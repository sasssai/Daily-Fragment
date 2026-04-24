# Scarlet7 Template 🚀

爆速で開発を始めるための Next.js + Supabase テンプレートです。  
認証、DB、ローカル開発環境、デプロイ、CI/CD まで含めて、保守運用を見越した土台を最初から用意しています。自由に改造して使ってください。

## ✨ このテンプレートでできること

- Next.js App Router ベースですぐに画面開発を始められる
- Supabase Auth を使った認証付きアプリをすぐに立ち上げられる
- ローカル Supabase で DB を安全に開発できる
- SQL ファイルを正本にした宣言ベースのスキーマ管理ができる
- Supabase Storage の bucket 定義と policy をファイル管理し、GitHub Actions から本番反映できる
- GitHub Actions でアプリの CI と Supabase の migration / Edge Functions のチェックとデプロイができる
- AWS Amplify へそのままデプロイしやすい

## 🧱 技術スタック

- フロントエンド: Next.js 16, React 19, TypeScript
- UI: Tailwind CSS v4, shadcn/ui, Radix UI, lucide-react
- バックエンド: Supabase
- メール: Resend
- インフラ: AWS Amplify
- 開発支援: ESLint, Prettier, TypeScript

### 📝 一言用語説明

- Supabase: Postgres ベースのデータベースバックエンドサービス
- Resend: アプリからのメール送信に使うメール配信サービス
- Amplify: AWS のフロントエンド向けホスティングサービス

## ✅ 前提環境

- Node.js
- npm
- Docker

Next.js の最小要件は 2026年3月17日時点で `20.9` 以上です。そこさえ満たしていれば、Node.js のバージョンは基本的に何でも構いません。  
ただし、ローカルで使う Node.js のバージョンと `amplify.yml` に書かれているバージョンは揃えておいてください。
以下のコマンドでバージョン確認ができます。

```bash
node --version
```

出力例:

```
22.22.1
```

## 🛠️ 初回セットアップ

1. GitHub でこのリポジトリをテンプレートとして使い、新しいリポジトリを作成します
2. 作成したリポジトリを git clone し、好きなエディタで開きます
3. 依存関係をインストールします

```bash
npm install
```

4. `.env.example` をコピーして `.env` を作成します

```bash
cp .env.example .env
```

5. Docker Desktop または Dockerを起動します
6. ローカル Supabase を起動します

```bash
npm run db:start
```

> [!TIP]
> 初回はイメージの取得などで時間がかかります。
>
> `54321` `54322` `54323` などのポート競合エラーが出た場合は、すでに別の Supabase ローカル環境が起動している可能性があります。  
> その場合は使っていないプロジェクト側で `npx supabase stop` を実行するか、`supabase/config.toml` のポート設定を変更してください。

7. `.env` を編集します

```dotenv
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-supabase-publishable-key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

- `NEXT_PUBLIC_SUPABASE_URL` はローカル開発ではそのままで構いません
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` には `npm run db:start` 完了時に表示される Publishable key を入れてください
- `NEXT_PUBLIC_BASE_URL` には、`http://localhost:3000` や `https://あなたのドメイン名` のように URL 全体を入れてください

8. 開発サーバーを起動します

```bash
npm run dev
```

9. [http://localhost:3000](http://localhost:3000) にアクセスします

## 🔁 毎回の開発環境構築

1. Docker を起動します
2. `npm run db:start` を実行します
3. `npm run dev` を実行します
4. Supabase Edge Functions も使う場合だけ、別ターミナルで `npm run fn:serve` を実行します
5. [http://localhost:3000](http://localhost:3000) にアクセスします
6. Supabase Studio は [http://127.0.0.1:54323](http://127.0.0.1:54323) で確認できます

> [!IMPORTANT]
> Studio で見た内容はデバッグには便利ですが、GUI上でのデータベースの変更はデプロイ後に反映されないことが多いです。テーブルを作成したり、カラムを編集したりする場合はコードを編集してmigrationを実行してください。

`npm run fn:serve` は、Supabase Edge Functions をローカルで動かしたいときだけ使ってください。  
Next.js の `npm run dev` とは別のプロセスなので、同じターミナルではなく別ターミナルで実行します。

このコマンドを実行すると、Edge Functions 用のローカルサーバーが立ち上がります。  
起動後はログが少なく、反応が止まったように見えることがありますが、壊れているわけではなく待機状態です。そのまま Edge Functions へのリクエストを待っています。

Edge Functions のデバッグには、Postman のような API テストツールがあると便利です。  
リクエストの body、header、method を変えながら試したいときに使いやすいです。Postman: https://www.postman.com/

## 💡 開発のヒント

環境構築お疲れさまでした。ここからはそれぞれのアプリ要件に合わせて開発を進めてください。開発でのTipsを下にまとめておくので必要に応じて使ってください。  
また特別な理由がなければ、最初に[デプロイ](#デプロイ)作業を行うことをおすすめします。

### 🎨 テーマカラーの変更

- [TweakCN](https://tweakcn.com/editor/theme) でテーマカラーを作成できます
- 出力された CSS を `app/globals.css` に反映して使ってください

### 🧩 shadcn/ui の追加

- このテンプレートの UI は shadcn/ui を使っています
- 新しい UI コンポーネントを追加したいときは、公式ドキュメントを見ながら追加してください
- たとえば `button` を追加したい場合は、以下のコマンドを使います

```bash
npx shadcn@latest add button
```

- `button` の部分を `dialog` や `sheet` など、追加したいコンポーネント名に置き換えて使ってください
- 公式ドキュメント: https://ui.shadcn.com/docs/components

### 🔔 画面通知

- ユーザー向けの画面通知には `toast` を使えます
- `Toaster` は `app/layout.tsx` に配置済みです
- `toast()` は Client Component でのみ動作します。Server Component からは直接呼べません

実装例:

```tsx
"use client";

import { toast } from "sonner";

export function SaveButton() {
  const handleClick = async () => {
    toast.success("保存しました");
  };

  return <button onClick={handleClick}>保存</button>;
}
```

エラー通知の例:

```tsx
toast.error("保存に失敗しました");
```

### 🌐 SEO / OGP の設定

- アプリタイトルや概要、OGP、Twitter Card の文章設定は `app/layout.tsx` の `metadata` で変更できます
- ロゴを作成し、画像を差し替えるのがおすすめです。

文章設定:

- `app/layout.tsx`
  アプリタイトル、概要、Open Graph、Twitter Card の文言を設定する場所です。Google 検索や SNS に出る文章は、まずここを見直してください。
- `app/manifest.json`
  アプリ名やホーム画面追加時の表示名などを設定する場所です。PWA として使う場合はここも見直してください。

画像まわりで最初に見直すことが多いファイル:

| ファイル                   | 何に使うか     | ひとこと解説                                      | サイズの目安                         |
| -------------------------- | -------------- | ------------------------------------------------- | ------------------------------------ |
| `public/icons/og-icon.png` | OGP 画像       | SNS で URL を貼ったときに表示される大きい画像です | `1200 x 630` 推奨                    |
| `app/favicon.ico`          | favicon        | ブラウザのタブに出る小さいアイコンです            | 正方形。`32 x 32` 以上の `.ico` 推奨 |
| `public/images/logo.png`   | ロゴ画像       | アプリ内で使うロゴです                            | 用途次第。背景透過の PNG 推奨        |
| `public/icons/192x192.png` | PWA 用アイコン | スマホのホーム画面追加などで使われるアイコンです  | `192 x 192`                          |
| `public/icons/512x512.png` | PWA 用アイコン | PWA や一部端末で使われる大きいアイコンです        | `512 x 512`                          |

### 🤖 AI Agent 向けドキュメント

- `AGENTS.md` と `docs/ai/*` に、AI Agent が最初に把握しやすい最低限の情報をまとめています
- どちらもこのテンプレート用の補助ドキュメントなので、プロジェクトに合わせて自由に書き換えて構いません
- 必要に応じて、チームの運用ルールや実装方針を追記して使ってください
- ファイル名もチームで使用しているAI Agentが参照しやすい名前に変更するなど、自由に変更してください

### 📂 最初に触ることが多いファイル

- `app/page.tsx`: ルートページ。全ユーザーアクセス可能
- `app/protected/home/page.tsx`: ログイン後の最初の画面
- `app/protected/settings/page.tsx`: 設定画面
- `components/header/AppHeader.tsx`: 認証後ヘッダー
- `app/globals.css`: 全体のテーマや見た目

### 🗺️ ルーティング構成

- `/`: ルートページ
- `/auth/*`: ログイン、サインアップ、パスワード再設定などの認証画面
- `/protected/*`: ログイン済みユーザー向けページ

### 🔐 認証保護のしくみ

- `proxy.ts` と `lib/supabase/proxy.ts` でセッションを更新しています
- 未ログイン時に `/protected/*` へ行くと `/auth/login` にリダイレクトされます
- ログイン済みで `/` や `/auth/*` へ行くと `/protected/home` にリダイレクトされます

### 🧪 サンプルスキーマについて

- `public.profiles` テーブルを最小サンプルとして同梱しています
- サインアップ時に trigger でプロフィールを自動作成します
- 不要なら関連する function、trigger、policy ごと削除してください
- ユーザーごとに個別の設定ができる必要のあるアプリ要件の場合、そのまま転用できます

## 🗄️ Supabase のスキーマ運用

このテンプレートでは、DB の設計を `supabase/schemas/*.sql` で管理します。  
テーブルや関数、制約、RLS などをファイルごとに分けて書いていく方式です。

このテンプレートで管理対象にしているスキーマは `public` と `cron` です。  
通常の業務データは `public` に置き、定期実行の定義が必要なときは `cron` も `schemas` 配下で一緒に管理します。

Storage policy はこのフローとは分けて、`supabase/storage/*.sql` を正本にして管理します。

ただし、実際にデプロイで使われるのは `supabase/migrations/` のファイルです。  
そのため、スキーマを変更したら migration ファイルも必ず作成してコミットしてください。

### 🧾 ファイル構成

- `00_extensions.sql`: extension の有効化
- `10_types.sql`: enum などの型定義
- `20_functions.sql`: trigger function や RPC 用 function
- `30_tables.sql`: table と trigger の定義
- `40_constraints.sql`: unique, check, foreign key などの制約
- `50_indexes.sql`: index の定義
- `60_rls.sql`: RLS の有効化
- `70_policies.sql`: policy の定義
- `80_cron.sql`: cron に関するメモや定期実行の定義

### 🔄 運用フロー

1. `supabase/schemas/*.sql` を編集する
2. `npm run db:diff migration名` を実行して `supabase/migrations/` に migration を生成する
3. `npm run db:reset` でローカル DB に反映して確認する
4. 必要に応じて `npm run db:check` で差分が残っていないか確認する
5. `npm run db:types:local` で型定義を更新する
6. `schemas` と `migrations` の両方をコミットする
7. main ブランチに migration が push されると、自動でクラウドの Supabase に適用されます

> [!WARNING]
> `schemas` を変更したのに migration の作成を忘れたまま main 向け PR を作ると、CI が落ちます。  
> その場合は `npm run db:diff migration名` を実行して、生成された migration を追加してください。
>
> DB 変更を含む本番反映では、migration とアプリ変更を同時に公開しないでください。  
> 安全に進めるには、先に migration を `main` に反映して GitHub Actions の完了を確認し、その後で新しい schema を前提にしたアプリ変更をデプロイしてください。

## 📦 Supabase Storage の使い方

Storage はデフォルトで有効ですが、bucket を定義しない限り何も作られません。  
Storage を使わないアプリでは、そのまま bucket を追加しなければ構いません。GitHub Actions でも bucket 定義がない場合は Storage 用の処理が自動でスキップされるため、空設定が原因で CI やデプロイが落ちることはありません。

> [!IMPORTANT]
> `supabase/config.toml` の変更がそのまま本番 Supabase 全体へ自動反映されるわけではありません。  
> このテンプレートで GitHub Actions から本番へ反映している `config.toml` 由来の内容は、Storage bucket 定義だけです。  
> たとえば Auth のメールテンプレート、パスワード要件、OAuth provider 設定などは `config.toml` を編集しても本番環境には自動適用されないため、Supabase ダッシュボードなどで本番プロジェクトを直接設定してください。

Storage の正本は 2 つに分かれます。  
bucket 定義は `supabase/config.toml`、Storage policy は `supabase/storage/*.sql` です。`public` / `cron` 用の `supabase/schemas/*.sql` に混ぜないでください。

Storage を使う場合だけ、以下を追加してください。

1. `supabase/config.toml` に `[storage.buckets.<bucket名>]` を追加する
2. 必要に応じて bucket ごとの `public`、`file_size_limit`、`allowed_mime_types` などを設定する
3. `supabase/storage/*.sql` に `storage.objects` など向けの policy を追加する
4. `npm run db:buckets` を実行してローカルに bucket 定義を反映する
5. Storage の policy を変更したときは `npm run db:diff:storage <migration名>` を実行して migration を生成する
6. `supabase/storage/*.sql` と `supabase/migrations/*.sql` を両方コミットする

たとえば、bucket の定義は次のように書けます。

```toml
[storage]
enabled = true
file_size_limit = "50MiB"

[storage.buckets.avatars]
public = false
file_size_limit = "10MiB"
allowed_mime_types = ["image/png", "image/jpeg", "image/webp"]
```

補助コマンド:

- `npm run db:buckets`
  ローカル Supabase に bucket 定義を反映します。実行前に `supabase/config.toml` で Storage を有効化し、bucket を定義してください。

- `npm run db:diff:storage <migration名>`
  `supabase/storage/*.sql` を正本として、`storage` schema の差分から migration を生成します。Storage policy を追加・変更した場合はこちらを使ってください。

- `npm run db:check:storage`
  `storage` schema の差分が残っていないかを確認します。

> [!IMPORTANT]
> bucket 定義は `supabase/config.toml` が正本です。  
> Storage policy の正本は `supabase/storage/*.sql` です。  
> デプロイに使われるのは migration なので、変更後は `npm run db:diff:storage <migration名>` で migration を生成して一緒にコミットしてください。
> 本番の bucket 反映は、`main` へのマージ後に GitHub Actions が実行します。ローカルから `--linked` で直接反映する運用は想定していません。

## DB コマンドのちょいメモ

- `npm run db:start`
  ローカル Supabase を起動します。

- `npm run db:status`
  各サービスの起動状況や接続情報を確認できます。

- `npm run db:reset`
  migration を最初から適用し直してローカル DB を作り直します。ローカル専用です。

- `npm run db:check`
  `supabase/schemas/*.sql` と現在の DB 状態の差分を確認します。`public` と `cron` を対象にしています。

- `npm run db:diff <migration名>`
  スキーマ差分から migration ファイルを生成します。`npm run db:diff migration名` のように migration 名を付けて実行してください。`public` と `cron` の変更が対象です。生成された SQL は本番環境に適用されるので、内容を確認してからコミットしてください。

- `npm run db:diff:storage <migration名>`
  `supabase/storage/*.sql` の変更をもとに、`storage` schema の差分から migration ファイルを生成します。Storage を使う場合だけ実行してください。

- `npm run db:migrate`
  既存の migration を順番に適用します。

- `npm run db:types:local`
  ローカル DB から TypeScript 型定義を再生成します。

- `npm run db:buckets`
  Storage を使う場合だけ、ローカルへ bucket 定義を反映します。

- `npm run fn:serve`
  Supabase Edge Functions をローカルで動かすサーバーを起動します。Edge Functions を使う場合だけ、`npm run dev` とは別ターミナルで実行してください。起動後に出力が少なくても、待機状態でサーバーが立ち上がっていれば正常です。

- `npm run db:stop`
  ローカル Supabase を停止します。

## その他の開発コマンド

- `npm run check`
  ESLint と TypeScript のチェックを実行します。

- `npm run build`
  本番ビルドを実行します。

- `npm run format`
  Prettier で整形します。

## デプロイ

独自ドメインが必要です。どのドメイン管理サービスでも構いませんが、新しく取得するなら Route 53 だと今後のセットアップが比較的スムーズです。

事前に以下のアカウントを用意してください。

- AWS
- Supabase
- Resend
- GitHub

### 1. Resend を設定する

1. Resend でドメインを追加します
2. ドメイン管理サービスで DNS 設定を行います
3. ドメイン認証が完了したら API キーを発行して控えます

### 2. Supabase プロジェクトを作成する

1. Supabase で新しいプロジェクトを作成します
2. DB Password(データベースパスワード) を控えます
3. Account の Access Token を発行して控えます
4. `Settings > General` からProject ID を控えます
5. `Connect > App Framework` から以下を確認します

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

6. `Authentication > Emails > SMTP Settings` を開き、`Enable custom SMTP` を有効化します
7. 以下の値を設定します

| 項目名                    | 値                                     |
| ------------------------- | -------------------------------------- |
| Sender email address      | お好きな名前@Resend に登録したドメイン |
| Sender name               | お好きな名前                           |
| Host                      | smtp.resend.com                        |
| Port number               | 465                                    |
| Minimum interval per user | 60                                     |
| Username                  | resend                                 |
| Password                  | Resend の API キー                     |

8. `Authentication > URL Configuration` で Site URL に `https://あなたのドメイン名` を設定します（将来のアプリのURL）

9. `Authentication > URL Configuration` で Redirect URLs に以下の表に従って値を入れます

| Redirect URLs | 値                                                |
| ------------- | ------------------------------------------------- |
| 1             | `https://あなたのドメイン名/auth/update-password` |
| 2             | `https://あなたのドメイン名/protected/home`       |

### 3. GitHub Secrets を設定する

GitHub リポジトリの `Settings > Secrets and variables > Actions > Repository secrets` で以下を登録してください。

| 項目名                | 値                                        |
| --------------------- | ----------------------------------------- |
| SUPABASE_DB_PASSWORD  | Supabase プロジェクト作成時の DB Password |
| SUPABASE_ACCESS_TOKEN | Supabase の Access Token                  |
| SUPABASE_PROJECT_REF  | Supabase の Project ID                    |

### 3.5 初期 migration を本番 Supabase に適用する

このテンプレートでは、本番 Supabase への schema 反映は GitHub Actions の `Supabase Migration Deploy (prod)` で行います。  
ただし、この workflow は通常 `supabase/migrations/**` の変更時に動くため、新しい Supabase プロジェクトを作成しただけでは初期 migration の適用が自動では走らない場合があります。

テンプレート作成直後の初回デプロイでは、AWS Amplify の初回公開より先に GitHub の `Actions` タブから `Supabase Migration Deploy (prod)` を手動実行してください。

1. GitHub の `Actions` タブを開きます
2. `Supabase Migration Deploy (prod)` を開きます
3. `Run workflow` を実行します
4. 完了後、Supabase に初期テーブルが作成されていることを確認します

### 4. AWS Amplify を設定する

1. AWS Amplify で新しいアプリを作成します
2. GitHub リポジトリとデプロイ対象ブランチを接続します
3. 詳細設定の中にある、環境変数を設定します

最低限、以下は必須です。

| 項目名                                       | 値                                                               |
| -------------------------------------------- | ---------------------------------------------------------------- |
| NEXT_PUBLIC_SUPABASE_URL                     | Supabase の `Connect > App Framework` で確認した URL             |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY | Supabase の `Connect > App Framework` で確認した Publishable key |
| NEXT_PUBLIC_BASE_URL                         | `https://あなたのドメイン名`                                     |

4. デプロイを実行します
5. Amplify のカスタムドメイン設定で独自ドメインを接続します
6. ドメイン管理サービス側で必要な DNS 設定を反映します

これでデプロイ完了です。

## 付属の GitHub Actions

- `main` ブランチ向け PR で `npm run check` と `npm run build` が走ります
- `supabase/schemas/**` と `supabase/migrations/**` の変更がある PR では、Supabase migration の dry-run、ローカル適用、`db:check`、DB lint が走ります
- `supabase/config.toml`、`supabase/storage/**`、または `supabase/migrations/**` の変更がある PR では、Storage 専用 workflow が走り、Storage を有効化して bucket 定義がある場合だけ bucket のローカル反映と `storage` schema の drift check を行います
- `schemas` を変更したのに migration の生成が漏れている場合、PR の CI が落ちます
- Storage を有効化して bucket 定義がある状態で `supabase/storage/*.sql` を変更したのに Storage 向け migration の生成が漏れている場合も、PR の CI が落ちます
- `main` への push で `supabase/migrations/**` の変更があれば、本番 Supabase へ migration を適用します
- `main` への push で `supabase/config.toml` の変更があれば、Storage 専用 workflow が走り、Storage を有効化して bucket 定義がある場合だけ bucket 定義を本番 Supabase へ反映します
- `supabase/functions/**` の変更がある PR では Edge Functions の bundle チェックが走ります
- `main` への push で `supabase/functions/**` の変更があれば Edge Functions を本番へデプロイします

## ライセンス

このテンプレートは [Next.js Supabase Starter Kit](https://github.com/vercel/next.js/tree/canary/examples/with-supabase) をベースに改変しています。

MIT License
