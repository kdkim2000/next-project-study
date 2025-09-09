import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

function escapeXml(unsafe: string) {
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function GET() {
  const posts = await getAllPosts();

  const items = posts.map((p) => {
    const url = `${SITE_URL}/posts/${p.slug}`;
    const title = escapeXml(p.frontMatter.title);
    const desc = escapeXml(p.frontMatter.excerpt ?? "");
    const pubDate = new Date(p.frontMatter.date).toUTCString();
    return `
  <item>
    <title>${title}</title>
    <link>${url}</link>
    <guid>${url}</guid>
    <description>${desc}</description>
    <pubDate>${pubDate}</pubDate>
  </item>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Developer's Blog</title>
  <link>${SITE_URL}</link>
  <description>Markdown 기반 기술 블로그 RSS</description>
  ${items}
</channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
