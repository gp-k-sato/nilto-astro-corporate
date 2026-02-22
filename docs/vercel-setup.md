# Vercel デプロイ手順

## 概要

本プロジェクトは **Astro（SSG）** で静的サイトを生成し、**Vercel** にデプロイする構成です。

- ビルド時に NILTO API からコンテンツを取得し、静的 HTML を生成
- Vercel へのデプロイは CLI での手動デプロイ、または GitHub Integration による自動デプロイに対応

## 前提条件

| 項目 | 要件 |
|------|------|
| Node.js | v22 以上（`.nvmrc` / `volta` で固定済み） |
| npm | Node.js に同梱のバージョン |
| Vercel アカウント | [vercel.com](https://vercel.com/) で作成 |
| NILTO API キー | NILTO ダッシュボードから取得 |

## 初回セットアップ手順

### 1. Vercel CLI のインストール・ログイン

```sh
npm i -g vercel
vercel login
```

### 2. プロジェクトのリンク

プロジェクトルートで以下を実行し、Vercel プロジェクトと紐付けます。

```sh
vercel link
```

対話形式で以下を設定します：

- **Scope:** チームまたは個人アカウントを選択
- **Link to existing project?** → 既存プロジェクトがあれば `Y`、なければ `N`（新規作成）
- **Project Name:** `nilto-astro-corporate`（デフォルトのまま）

### 3. 環境変数の設定

#### Vercel 側（Production / Preview）

Vercel ダッシュボード、または CLI で環境変数を設定します。

```sh
vercel env add NILTO_API_KEY
```

- **Environment:** `Production` と `Preview` を選択
- **Value:** NILTO ダッシュボードで取得した API キー

> **注意:** Sensitive（機密）として設定した環境変数は `Development` 環境には設定できません。ローカル開発では `.env` ファイルを使用してください。

#### ローカル開発用

プロジェクトルートに `.env` ファイルを作成します。

```sh
cp .env.example .env
# .env を編集して NILTO_API_KEY を設定
```

```
NILTO_API_KEY=your_api_key_here
```

> `.env` は `.gitignore` に含まれており、リポジトリにはコミットされません。

### 4. デプロイ

#### プレビューデプロイ（動作確認用）

```sh
vercel
```

プレビュー URL が発行されるので、ブラウザで動作を確認できます。

#### 本番デプロイ

```sh
vercel --prod
```

## 日常の開発フロー

### GitHub Integration（自動デプロイ）

GitHub リポジトリと連携すると、以下が自動で行われます：

- **`main` / `master` への push** → 本番デプロイ
- **PR の作成・更新** → プレビューデプロイ（PR ごとに固有の URL が発行）

#### 設定方法

1. Vercel ダッシュボード → プロジェクト設定 → Git Integration
2. GitHub リポジトリを選択して連携

### 手動デプロイ（CLI）

```sh
# プレビューデプロイ
vercel

# 本番デプロイ
vercel --prod
```

### 環境変数の追加・変更

#### CLI で追加

```sh
vercel env add NEW_VARIABLE_NAME
```

#### ダッシュボードで変更

Vercel ダッシュボード → Settings → Environment Variables から追加・編集・削除が可能です。

> **注意:** 環境変数を変更した後は、再デプロイが必要です。変更は次回のデプロイから反映されます。

### プレビューデプロイの活用

PR ごとにプレビュー URL が発行されるため、以下のような運用が可能です：

- コードレビュー時に実際の表示を確認
- デザイナーやクライアントに URL を共有してフィードバックを取得
- 本番反映前の最終確認

## 設定ファイルの説明

### `vercel.json`

セキュリティヘッダーを設定しています。

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

| ヘッダー | 効果 |
|---------|------|
| `X-Content-Type-Options: nosniff` | MIME タイプスニッフィングを防止 |
| `X-Frame-Options: DENY` | iframe への埋め込みを拒否（クリックジャッキング対策） |
| `Referrer-Policy: strict-origin-when-cross-origin` | 外部サイトへのリファラー送信を制限 |

### `package.json`（Node.js バージョン固定）

```json
{
  "volta": {
    "node": "22.12.0"
  },
  "engines": {
    "node": ">=22"
  }
}
```

- **`volta`**: [Volta](https://volta.sh/) を使用しているメンバーは自動で Node.js 22.12.0 が使われます
- **`engines`**: `npm install` 時にバージョンチェックが行われます

### `.nvmrc`

```
22
```

nvm を使用しているメンバーは `nvm use` で Node.js 22 に切り替わります。

## トラブルシューティング

### ビルドエラー: `NILTO_API_KEY` が未設定

```
Error: NILTO_API_KEY is not defined
```

**対処:** Vercel ダッシュボードで環境変数 `NILTO_API_KEY` が設定されているか確認してください。設定後、再デプロイが必要です。

### ビルドエラー: Node.js バージョンが合わない

```
Error: The engine "node" is incompatible with this module
```

**対処:** Vercel のプロジェクト設定で Node.js バージョンが 22.x になっているか確認してください。Settings → General → Node.js Version から変更できます。

### プレビューデプロイで NILTO のデータが取得できない

**対処:** 環境変数の適用範囲を確認してください。`Preview` 環境にチェックが入っているか、Vercel ダッシュボードの Settings → Environment Variables で確認できます。

### ローカルで `vercel dev` が動作しない

Astro の開発サーバーを直接使用することを推奨します。

```sh
npm run dev
```

`vercel dev` は Vercel のサーバーレス機能を使う場合に有用ですが、本プロジェクトは SSG のため `npm run dev` で十分です。
