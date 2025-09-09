// 이 모듈은 Node 전용(fs/path 사용) — 절대 클라이언트에서 import하지 마세요.
import "server-only";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import readingTime from "reading-time";
import type { FrontMatter, Post, CategoryCount, SearchFilters } from "@/types/blog";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function listMarkdownFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
}

export function getAllSlugs(): string[] {
  return listMarkdownFiles().map((f) => f.replace(/\.mdx?$/, ""));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const md = path.join(POSTS_DIR, `${slug}.md`);
  const mdx = path.join(POSTS_DIR, `${slug}.mdx`);
  const filePath = fs.existsSync(md) ? md : fs.existsSync(mdx) ? mdx : null;
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  if (!data?.title || !data?.date) {
    console.error(`[blog] invalid frontmatter in: ${slug}`);
    return null;
  }

  const processed = await remark().use(html, { sanitize: false }).process(content);
  const contentHtml = processed.toString();
  const rt = readingTime(content);

  const fm = data as FrontMatter;
  return {
    slug,
    contentHtml,
    readingTime: rt,
    frontMatter: {
      title: String(fm.title),
      date: String(fm.date),
      excerpt: fm.excerpt ? String(fm.excerpt) : undefined,
      category: fm.category ? String(fm.category) : undefined,
      tags: Array.isArray(fm.tags) ? fm.tags.map(String) : undefined,
      cover: fm.cover ? String(fm.cover) : undefined,
    },
  };
}

export async function getAllPosts(limit?: number): Promise<Post[]> {
  const slugs = getAllSlugs();
  const posts = await Promise.all(slugs.map((s) => getPostBySlug(s)));
  const sorted = (posts.filter(Boolean) as Post[]).sort((a, b) =>
    a.frontMatter.date < b.frontMatter.date ? 1 : -1
  );
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  const slugs = getAllSlugs();
  const posts = (await Promise.all(slugs.map((s) => getPostBySlug(s)))).filter(Boolean) as Post[];

  const withFlag = posts.map((p) => {
    const md = path.join(POSTS_DIR, `${p.slug}.md`);
    const mdx = path.join(POSTS_DIR, `${p.slug}.mdx`);
    const filePath = fs.existsSync(md) ? md : fs.existsSync(mdx) ? mdx : null;
    let featured = false;
    if (filePath) {
      const raw = fs.readFileSync(filePath, "utf8");
      const { data } = matter(raw);
      featured = Boolean((data as any)?.featured);
    }
    return { post: p, featured };
  });

  const featured = withFlag
    .filter((x) => x.featured)
    .map((x) => x.post)
    .sort((a, b) => (a.frontMatter.date < b.frontMatter.date ? 1 : -1));

  if (featured.length >= limit) return featured.slice(0, limit);

  const latest = posts
    .sort((a, b) => (a.frontMatter.date < b.frontMatter.date ? 1 : -1))
    .filter((p) => !featured.find((f) => f.slug === p.slug));

  return [...featured, ...latest].slice(0, limit);
}

export async function getCategoriesWithCount(): Promise<CategoryCount[]> {
  const posts = await getAllPosts();
  const map = new Map<string, number>();
  for (const p of posts) {
    const c = p.frontMatter.category ?? "uncategorized";
    map.set(c, (map.get(c) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => a.category.localeCompare(b.category));
}

export async function searchPosts(filters: SearchFilters): Promise<Post[]> {
  const { query, category, tags } = filters;
  const posts = await getAllPosts();

  return posts.filter((p) => {
    let ok = true;
    if (query && query.trim()) {
      const q = query.toLowerCase();
      const hay = [
        p.frontMatter.title,
        p.frontMatter.excerpt ?? "",
        p.frontMatter.category ?? "",
        (p.frontMatter.tags ?? []).join(" "),
      ].join(" ").toLowerCase();
      ok &&= hay.includes(q);
    }
    if (category && category.trim()) {
      ok &&= (p.frontMatter.category ?? "").toLowerCase() === category.toLowerCase();
    }
    if (tags && tags.length) {
      const ptags = (p.frontMatter.tags ?? []).map((t) => t.toLowerCase());
      ok &&= tags.every((t) => ptags.includes(t.toLowerCase()));
    }
    return ok;
  });
}
