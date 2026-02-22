# NILTO + Astro コーポレートデモサイト

NILTO（ヘッドレスCMS）と Astro を組み合わせたコーポレートサイトのデモプロジェクトです。

## 技術スタック

- **フレームワーク:** [Astro](https://astro.build/) 5.x（SSG）
- **スタイル:** Sass（Dart Sass）/ FLOCSS設計
- **CMS:** [NILTO](https://nilto.com/)（ヘッドレスCMS）
- **フォント:** Google Fonts（Fustat + Noto Sans JP）

## セットアップ

### 1. 依存パッケージのインストール

```sh
npm install
```

### 2. 環境変数の設定

`.env.example` をコピーして `.env` を作成し、NILTO の API キーを設定します。

```sh
cp .env.example .env
```

```
NILTO_API_KEY=your_api_key_here
```

### 3. NILTO スペースの準備

以下のコンテンツモデルを NILTO 上に作成してください。

| モデル | 用途 |
|--------|------|
| `news` | ニュース・お知らせ |
| `company` | 会社情報 |
| `service` | サービス情報 |
| `service_page` | サービス一覧ページ情報（リード文など） |

### 4. デプロイ

Vercel へのデプロイ手順は [docs/vercel-setup.md](docs/vercel-setup.md) を参照してください。

## 開発コマンド

プロジェクトルートから実行します。

| コマンド | 内容 |
|----------|------|
| `npm run dev` | 開発サーバーを起動（`localhost:4321`） |
| `npm run build` | 本番用ビルド（`./dist/`） |
| `npm run preview` | ビルド結果をローカルでプレビュー |

## プロジェクト構成

```
src/
├── assets/                  # 画像などの静的アセット
├── components/              # Astro コンポーネント
│   ├── Header.astro         #   ヘッダー・ナビゲーション
│   ├── Footer.astro         #   フッター
│   ├── SectionHeading.astro #   セクション見出し
│   ├── NewsCard.astro       #   ニュースカード
│   ├── ServiceCard.astro    #   サービスカード
│   └── Breadcrumb.astro     #   パンくずリスト
├── layouts/
│   └── Layout.astro         # 共通レイアウト
├── lib/
│   └── nilto.js             # NILTO API クライアント
├── pages/                   # ページ（ルーティング）
│   ├── index.astro          #   トップページ
│   ├── company.astro        #   会社概要
│   ├── contact.astro        #   お問い合わせ
│   ├── service/
│   │   ├── index.astro      #   サービス一覧
│   │   └── [slug].astro     #   サービス詳細
│   └── news/
│       ├── index.astro      #   ニュース一覧
│       └── [id].astro       #   ニュース詳細
└── styles/                  # SCSS（FLOCSS構成）
    ├── style.scss           #   エントリーポイント
    ├── foundation/          #   リセット・ベース
    ├── global/              #   変数・Mixin・関数
    ├── layout/              #   ヘッダー・フッター・メイン
    ├── object/
    │   ├── component/       #   汎用コンポーネント
    │   ├── project/         #   ページ固有スタイル
    │   └── utility/         #   ユーティリティ
    └── pages/               #   ページ単位スタイル
```

## ページ一覧

| パス | ページ | データソース |
|------|--------|-------------|
| `/` | トップページ | news, company, service |
| `/company/` | 会社概要 | company |
| `/service/` | サービス一覧 | service, service_page |
| `/service/[slug]/` | サービス詳細 | service |
| `/news/` | ニュース一覧 | news |
| `/news/[id]/` | ニュース詳細 | news（個別） |
| `/contact/` | お問い合わせ | — |

## NILTO コンテンツモデル

### news（ニュース）

ニュース・お知らせの管理。一覧・詳細ページで使用。

### company（会社情報）

会社概要（社名、所在地、設立日、理念、沿革など）の管理。1件のみ。

### service（サービス）

提供サービスの管理。トップページ・サービス一覧・サービス詳細ページで使用。

### service_page（サービスページ情報）

サービス一覧ページのリード文などの管理。1件のみ。
