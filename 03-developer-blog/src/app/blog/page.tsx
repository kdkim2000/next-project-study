// src/app/blog/page.tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { Typography, List, ListItem, ListItemText } from "@mui/material";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <Typography variant="h4" gutterBottom>
        블로그 목록
      </Typography>
      <List>
        {posts.map((post) => (
          <ListItem
            key={post.slug}
            component={Link}
            href={`/blog/${post.slug}`}
            divider
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItemText
              primary={post.title}
              secondary={post.date ? `작성일: ${post.date}` : null}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
}
