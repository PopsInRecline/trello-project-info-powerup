/* trello-attachment-proxy — Cloudflare Worker
 *
 * Trello's attachment download route requires an OAuth Authorization header
 * but returns NO Access-Control-Allow-Origin header, so browsers can never
 * read the response client-side. This worker forwards the download request
 * server-side and returns the bytes with proper CORS headers.
 *
 * Locked down two ways:
 *   - only the Power-Up's origin may call it (ALLOWED_ORIGIN)
 *   - only Trello attachment-download URLs may be requested (TARGET_RE)
 * The caller's Authorization header is passed through, never stored.
 */
const ALLOWED_ORIGIN = "https://popsinrecline.github.io";
const TARGET_RE = /^https:\/\/(api\.)?trello\.com\/1\/cards\/[A-Za-z0-9]+\/attachments\/[A-Za-z0-9]+\/download\//;

export default {
  async fetch(req) {
    const cors = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization",
      "Access-Control-Max-Age": "3600",
      "Vary": "Origin",
    };
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (req.method !== "GET") return new Response("method not allowed", { status: 405, headers: cors });

    const target = new URL(req.url).searchParams.get("url");
    if (!target || !TARGET_RE.test(target))
      return new Response("bad target — only Trello attachment download URLs are allowed", { status: 400, headers: cors });

    const auth = req.headers.get("Authorization");
    if (!auth) return new Response("missing Authorization header", { status: 401, headers: cors });

    const upstream = await fetch(target, { headers: { Authorization: auth } });
    const headers = new Headers(cors);
    for (const h of ["Content-Type", "Content-Length", "Content-Disposition"]) {
      const v = upstream.headers.get(h);
      if (v) headers.set(h, v);
    }
    return new Response(upstream.body, { status: upstream.status, headers });
  },
};
