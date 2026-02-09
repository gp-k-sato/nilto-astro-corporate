# NILTO + Astro コーポレートデモサイト

## 技術スタック

- **Astro 5.x** — 静的サイト生成（SSG）
- **Sass 1.x** — Dart Sass / FLOCSS設計
- **NILTO** — ヘッドレスCMS（Content API v1）

## プロジェクト構成

```
src/
├── assets/           # 画像などの静的アセット
├── components/       # Astro コンポーネント
├── layouts/          # 共通レイアウト（Layout.astro）
├── lib/              # API クライアント（nilto.js）
├── pages/            # ページ・ルーティング
└── styles/           # SCSS（FLOCSS: foundation / global / layout / object / pages）
```

## SCSS設計

- **FLOCSS構成:** Foundation → Layout → Object（Component / Project / Utility）→ Pages
- **Dart Sass:** `@use` / `@forward` を使用（`@import` は使わない）
- `style.scss` は `@use` のみ（global は各パーシャルが個別に `@use` する）
- `global/_mixin.scss` と `global/_function.scss` は `@use "setting" as *;` が必要
- `foundation/`, `layout/`, `object/`, `pages/` のパーシャルは `@use "../global" as *;` または `@use "../../global" as *;`（ネスト深度に応じて）
- `additionalData`（astro.config.mjs）は Astro の `<style>` タグ用に global を自動注入。`style.scss` と `global/` 配下は除外すること

## NILTO CMS連携

- **スペース:** コーポレートデモサイト（ID: `744643889`）
- **モデル:** `news`, `company`, `service`（service は後で完成予定）
- **API クライアント:** `src/lib/nilto.js`

### データ取得関数

| 関数 | 用途 |
|------|------|
| `fetchNews(options)` | ニュース一覧取得（limit, offset 指定可） |
| `fetchCompany()` | 会社情報取得（1件） |
| `fetchServices(options)` | サービス一覧取得 |
| `fetchContents(params)` | 汎用コンテンツ取得 |
| `fetchContentById(id, params)` | 単一コンテンツ取得 |

### ユーティリティ関数

| 関数 | 用途 |
|------|------|
| `formatDate(value)` | 日付を YYYY.MM.DD 形式に変換 |
| `getImageUrl(image)` | メディアフィールドから画像URLを取得 |
| `getImageAlt(image)` | メディアフィールドからalt文字列を取得 |
| `getBodyHtml(body)` | リッチテキストフィールドからHTMLを取得 |

### 注意事項

- `news` モデルに summary フィールドは無い
- MCP ではメディアフィールドは設定不可

## コンポーネント

| コンポーネント | 役割 | 主な props |
|---------------|------|-----------|
| `Layout.astro` | 共通レイアウト（head, header, footer） | `title`, `description` |
| `Header.astro` | ヘッダー・ナビゲーション | — |
| `Footer.astro` | フッター | — |
| `SectionHeading.astro` | セクション見出し（日英表示） | `title`, `subtitle`, `align` |
| `NewsCard.astro` | ニュースカード | `news`（コンテンツオブジェクト） |
| `ServiceCard.astro` | サービスカード | `service`, `variant`（summary / detail） |

## 開発コマンド

```sh
npm run dev       # 開発サーバー（localhost:4321）
npm run build     # 本番ビルド（./dist/）
npm run preview   # ビルドプレビュー
```
