// /components/ProfileForm.tsx
"use client";

import { useState, FormEvent } from "react";
import { TextField, Button, Stack } from "@mui/material";
import { useSession } from "next-auth/react";

export default function ProfileForm() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name ?? "");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    // v5: useSession().update({...}) -> jwt 콜백에 trigger='update' 로 반영
    await update({ user: { name } as any });
  }

  return (
    <form onSubmit={onSubmit}>
      <Stack direction="row" spacing={1}>
        <TextField
          label="표시 이름"
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="submit" variant="contained">저장</Button>
      </Stack>
    </form>
  );
}
