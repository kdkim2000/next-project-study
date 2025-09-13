// /components/NavBar.tsx
"use client";

import { AppBar, Toolbar, Typography, Button, Avatar, Stack } from "@mui/material";
import { useSession } from "next-auth/react";
import { signOutAction } from "@/lib/actions";

export default function NavBar() {
  const { data: session, status } = useSession();

  return (
    <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar sx={{ display: "flex", gap: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Social Auth Hub</Typography>
        {status === "authenticated" ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2">
              {session.user?.name} ({session.user?.role})
            </Typography>
            <Avatar src={session.user?.image ?? undefined} />
            <Button variant="outlined" onClick={() => signOutAction()}>로그아웃</Button>
          </Stack>
        ) : (
          <Button href="/login" variant="contained">로그인</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
