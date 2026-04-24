# Project Facts

- App: Next.js 16 + React 19 + TypeScript
- Router: Next.js App Router
- Auth backend: Supabase Auth
- Database backend: Supabase Postgres
- Email: Resend
- Auth-required pages belong under `app/protected/*`
- Auth behavior is enforced by `proxy.ts` and `lib/supabase/proxy.ts`
- Local DB development uses Supabase CLI and Docker
- Database source files are `supabase/schemas/*.sql`
- Storage policy source files are `supabase/storage/*.sql`
- Deployment migrations are `supabase/migrations/*.sql`
- Supabase Storage is enabled in local config by default, but buckets are created only when `supabase/config.toml` defines them
- Storage bucket definitions belong in `supabase/config.toml`
- Storage access policies are authored in `supabase/storage/*.sql` and deployed via SQL migrations against the `storage` schema

## Task Completion

- The minimum completion criterion for any task is that `npm run check` passes.

## References

- [Supabase CLI](docs/ai/supabase-cli.md)
  Read this before performing any operation related to Supabase schema changes, including editing schema or storage SQL files, generating or applying migrations, resetting or diffing the local database, editing `supabase/config.toml`, running or proposing Supabase CLI commands, or troubleshooting local Supabase startup.
- [Supabase Data Fetching](docs/ai/supabase-data-fetching.md)
  Read this when adding or changing data access in the Next.js app, choosing between server/client fetching patterns, working with Supabase clients in App Router, or reviewing auth-aware data fetching behavior.
