// ==========================================================================
// NILTO API Client
// ==========================================================================

const API_BASE = "https://cms-api.nilto.com/v1";

/**
 * NILTO API 汎用フェッチ
 */
async function fetchFromNilto(path, params = {}) {
  const apiKey = import.meta.env.NILTO_API_KEY;
  if (!apiKey) throw new Error("NILTO_API_KEY が .env に設定されていません");

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  const url = `${API_BASE}${path}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    headers: { "X-NILTO-API-KEY": apiKey },
  });

  if (!response.ok) {
    throw new Error(`NILTO API エラー: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// --------------------------------------------------------------------------
// Data Fetching
// --------------------------------------------------------------------------

/**
 * コンテンツ一覧取得
 */
export async function fetchContents(params) {
  const data = await fetchFromNilto("/contents", params);
  return data.data;
}

/**
 * コンテンツ単体取得
 */
export async function fetchContentById(id, params = {}) {
  return fetchFromNilto(`/contents/${id}`, params);
}

/**
 * ニュース一覧取得
 */
export async function fetchNews(options = {}) {
  return fetchContents({
    model: "news",
    order: "-publish_date",
    depth: 1,
    "body[format]": "html",
    ...options,
  });
}

/**
 * 会社情報取得（1件）
 */
export async function fetchCompany() {
  const items = await fetchContents({
    model: "company",
    limit: 1,
    depth: 1,
    "philosophy[format]": "html",
    "history[format]": "html",
  });
  return items && items.length > 0 ? items[0] : null;
}

/**
 * サービス一覧取得
 */
export async function fetchServices(options = {}) {
  return fetchContents({
    model: "service",
    depth: 1,
    "detail[format]": "html",
    ...options,
  });
}

/**
 * おすすめサービス取得（TOPページ用）
 * is_featuredフィールドが未設定の場合は全サービスから最大3件取得
 */
export async function fetchFeaturedServices() {
  try {
    const items = await fetchContents({
      model: "service",
      "is_featured[eq]": "true",
      depth: 1,
      "detail[format]": "html",
    });
    if (items && items.length > 0) return items;
  } catch {
    // is_featuredフィールドが存在しない場合のフォールバック
  }
  return fetchContents({
    model: "service",
    limit: 3,
    depth: 1,
    "detail[format]": "html",
  });
}

/**
 * サービスページ情報取得（リード文）
 */
export async function fetchServicePage() {
  try {
    const items = await fetchContents({
      model: "service_page",
      limit: 1,
      depth: 0,
    });
    return items && items.length > 0 ? items[0] : null;
  } catch {
    // service_pageモデルが未作成の場合
    return null;
  }
}

// --------------------------------------------------------------------------
// Utilities
// --------------------------------------------------------------------------

/**
 * 日付フォーマット（YYYY.MM.DD）
 */
export function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

/**
 * 画像URL取得（配列/単体両対応）
 */
export function getImageUrl(image) {
  if (!image) return null;
  if (Array.isArray(image)) return image[0]?.url || null;
  return image.url || null;
}

/**
 * 画像alt取得（配列/単体両対応）
 */
export function getImageAlt(image) {
  if (!image) return "";
  if (Array.isArray(image)) return image[0]?.alt || "";
  return image.alt || "";
}

/**
 * フレキシブルテキストHTML取得（string / { html } 両対応）
 */
export function getBodyHtml(body) {
  if (!body) return "";
  if (typeof body === "string") return body;
  return body.html || "";
}
