"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Chip,
  Stack,
  Box,
} from "@mui/material";
import type { Post } from "@/types/blog";

type Props = { post: Post };

export default function PostCard({ post }: Props) {
  const fm = post.frontMatter;
  const formattedDate = format(new Date(fm.date), "yyyy년 MM월 dd일", { locale: ko });

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardActionArea component={Link} href={`/posts/${post.slug}`}>
        <CardContent>
          <Typography variant="h6" component="h3" gutterBottom>
            {fm.title}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {formattedDate} · {post.readingTime.text}
          </Typography>

          {fm.excerpt && (
            <Typography variant="body1" sx={{ mt: 1.5 }}>
              {fm.excerpt}
            </Typography>
          )}

          <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap" }}>
            {fm.category && <Chip label={`#${fm.category}`} size="small" variant="outlined" sx={{ mr: 0.5 }} />}
            {(fm.tags ?? []).map((t) => (
              <Chip key={t} label={`#${t}`} size="small" variant="outlined" sx={{ mr: 0.5, mt: 0.5 }} />
            ))}
          </Stack>

          {fm.cover && (
            <Box sx={{ mt: 1.5, borderRadius: 1, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fm.cover} alt={fm.title} style={{ display: "block", width: "100%", height: "auto" }} />
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
