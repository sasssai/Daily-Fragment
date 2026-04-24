# Supabase CLI

## Restrictions

- AI agents may operate only on the local development database
- AI agents must not access or modify production or linked Supabase environments
- AI agents must not run commands that can apply database changes to remote environments
- AI agents must not run commands that require `supabase link`
- AI agents must not run commands that require production credentials, access tokens, or database passwords
- AI agents must ask for user approval before running `npm run db:reset`

## Source Of Truth

- Schema source files are `supabase/schemas/*.sql`
- This template manages both `public` and `cron` schemas as source of truth
- Supabase Storage is enabled by default in local config, but no buckets are created unless `[storage.buckets.*]` entries are defined
- Storage bucket definitions should be managed in `supabase/config.toml`
- Storage policy source files should be managed in `supabase/storage/*.sql`
- Storage policy deployments still happen through SQL migrations against the `storage` schema
- Most other `supabase/config.toml` settings are not deployed to hosted Supabase by this template
- Hosted Auth settings such as email templates, password rules, and provider setup must be configured directly in the target Supabase project
- Extensions that the project depends on should also be declared in `supabase/schemas/*.sql`
- Deployment applies files in `supabase/migrations/`
- GUI changes in Supabase Studio are not the source of truth

## Local Development

- Start local Supabase with `npm run db:start`
- Check service status with `npm run db:status`
- Stop local Supabase with `npm run db:stop`
- Supabase Studio runs at `http://127.0.0.1:54323`

## Schema Update Flow

1. Edit `supabase/schemas/*.sql`
2. Generate a migration with `npm run db:diff <migration_name>`
3. Rebuild the local database with `npm run db:reset`
4. Check remaining drift with `npm run db:check`
5. Regenerate local types with `npm run db:types:local`
6. Commit both `supabase/schemas/` and `supabase/migrations/`

## Storage Update Flow

1. Enable `[storage]` in `supabase/config.toml` only if the app needs Storage
2. Add one or more `[storage.buckets.<bucket_name>]` entries
3. Add or update Storage policies in `supabase/storage/*.sql`
4. Run `npm run db:buckets` to sync buckets to the local project
5. Run `npm run db:diff:storage <migration_name>` when `storage` schema policies changed
6. Commit `supabase/config.toml`, `supabase/storage/`, and any generated migration files

## Command Mapping

- `npm run db:start`: `npx supabase start`
- `npm run db:stop`: `npx supabase stop`
- `npm run db:status`: `npx supabase status`
- `npm run db:reset`: `npx supabase db reset`
- `npm run db:check`: `npx supabase db diff --schema public,cron`
- `npm run db:check:storage`: `npx supabase db diff --schema storage`
- `npm run db:diff`: `npx supabase db diff --schema public,cron -f`
- `npm run db:diff:storage`: `npx supabase db diff --schema storage -f`
- `npm run db:migrate`: `npx supabase migration up`
- `npm run db:buckets`: `npx supabase seed buckets --local`
- `npm run db:types:local`: `npx supabase gen types --lang typescript --local --schema public > types/database.types.ts`

## CI Behavior

- Pull requests to `main` run `.github/workflows/supabase-migrate-check.yml`
- Pull requests that touch `supabase/config.toml`, `supabase/storage/**`, or `supabase/migrations/**` also run `.github/workflows/supabase-storage-check.yml`
- The migration workflow links the remote project and runs `supabase db push --dry-run --linked`
- The migration workflow starts local Supabase and runs `supabase db reset`
- The storage workflow runs `npm run db:buckets` only when Storage is enabled and buckets are defined
- The workflow fails when `npm run db:check` detects schema drift
- The storage workflow checks `storage` schema drift when Storage is enabled
- Production bucket deployment is handled by `.github/workflows/supabase-storage-prod.yml` after changes are merged to `main`
- The workflow runs `supabase db lint --level error`

## Notes

- If `supabase/schemas/*.sql` changes without a new migration, CI fails
- If Storage is enabled and `supabase/storage/*.sql` changes without a new storage migration, CI fails
- `cron` related definitions should also be managed in `supabase/schemas/*.sql`, not only in Supabase Studio
- Migrations pushed to `main` are applied to the cloud Supabase project
- `supabase/config.toml` changes on `main` trigger `.github/workflows/supabase-storage-prod.yml`
- Storage bucket deployment is effectively gated by bucket definitions. Repositories that do not define `[storage.buckets.*]` should not add bucket-specific policies or migrations
