# Supabase Data Fetching

## Rules

- Client Components import `createClient` from `@/lib/supabase/client`
- Server Components import `createClient` from `@/lib/supabase/server`
- User claims are fetched with `supabase.auth.getClaims()`

## Client Component

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function CreateProfileButton() {
  const [isSaving, setIsSaving] = useState(false);

  const handleClick = async () => {
    setIsSaving(true);

    const supabase = createClient();
    const { error } = await supabase.from("posts").insert({
      title: "New Post",
      body: "Draft body",
    });

    setIsSaving(false);

    if (error) {
      throw error;
    }
  };

  return (
    <Button onClick={handleClick} disabled={isSaving}>
      {isSaving ? "Saving..." : "Create post"}
    </Button>
  );
}
```

## Server Component

```tsx
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title");

  if (error) {
    throw error;
  }

  return (
    <ul>
      {(posts ?? []).map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

## User Claims

```tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    redirect("/auth/login");
  }

  return <div>{user.email}</div>;
}
```

## Notes

- `lib/supabase/server.ts` creates a new server client for each request
- `lib/supabase/proxy.ts` also calls `supabase.auth.getClaims()` for session handling
