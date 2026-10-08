# 開発環境

- URL: https://dev.rana-rium.com
- Worker: ranarium-hp-dev
- Gitブランチ: dev
- 本番: main → ranarium-hp

本番から独立したWorkerに同じサイトをビルドします。開発サイトはnoindexを設定し、お問い合わせは入力検証後にテスト成功を返します。メールや管理者アラートは送信しません。検索除外はアクセス制限ではありません。

## ローカル開発

```sh
npm ci
npm run dev
```

## 開発サイトの更新

Cloudflare Workers Buildsを接続済みです。devブランチへのpushで `npm run build:dev` → `npx wrangler deploy` が実行され、開発URLが自動更新されます。他ブランチのプレビュービルドは無効です。

手動で更新する場合:

```sh
git switch dev
npm run deploy:dev
```

Cloudflareへのログインが必要です。`build:dev` が `wrangler.dev.jsonc` を使用し、生成した `dist/server/wrangler.json` をWranglerが自動使用します。開発用に本番メールのシークレットをコピーする必要はありません。

## 本番への反映

開発サイトで確認後、変更をレビューしてmainへ反映します。本番ビルドは通常の `npm run build` / `npm run deploy` を使います。開発Workerに本番ドメインのルートを追加しないでください。

Cloudflareの設定: 対象devブランチ、ビルド `npm run build:dev`、デプロイ `npx wrangler deploy`。開発サイトではセッションを使用しないため、セッションストアはメモリとし、本番のKVを共有しません。
