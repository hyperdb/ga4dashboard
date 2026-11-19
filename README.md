# ga4dashboard

複数サイトの Google Analytics 4（GA4）アクセス解析データを一覧・可視化するダッシュボードアプリケーションです。

## 主な機能

- 複数サイト（GA4 プロパティ）の合算推移表示
- サイト（プロパティ ID）ごとの絞り込み表示
- ページビュー（PV）・アクティブユーザー数・セッション数の折れ線グラフ表示（直近 30 日分）

## 技術スタック

- React 19 + TypeScript
- Vite
- Chakra UI
- Recharts
- Oxlint
- pnpm

## セットアップ

### 1. 依存パッケージのインストール

```bash
pnpm install
```

### 2. 環境変数の設定

`.env.example` をコピーして `.env.local` を作成し、データ取得先の API エンドポイントを設定してください。

```bash
cp .env.example .env.local
```

```env
VITE_API_BASE_URL=https://your-worker.example.workers.dev/api/stats
```

> **Note:** Cloudflare Pages や Vercel などにデプロイする場合は、ホスティング側の環境変数にも `VITE_API_BASE_URL` を設定してください。

### 3. 開発サーバーの起動

```bash
pnpm dev
```

## 利用可能なコマンド

| コマンド | 内容 |
| --- | --- |
| `pnpm dev` | 開発サーバーを起動 |
| `pnpm build` | TypeScript の型チェックと本番ビルドを実行 |
| `pnpm preview` | 本番ビルド結果をローカルでプレビュー |
| `pnpm lint` | Oxlint による静的解析を実行 |

## 想定している API 仕様

`VITE_API_BASE_URL` に対して以下の `GET` リクエストを送信します。

- クエリパラメータ:
  - `limit`: 取得件数（既定値 `30`）
  - `property_id`: 特定サイトに絞り込む場合のみ付与
- レスポンス形式（JSON）:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "property_id": "123456789",
      "site_name": "example.com",
      "target_date": "2026-11-18",
      "page_views": 40,
      "active_users": 1,
      "sessions": 3
    }
  ]
}
```

## ライセンス

[MIT](./LICENSE)
