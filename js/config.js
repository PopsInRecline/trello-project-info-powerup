/* config.js — per-deployment settings for the Project Info Power-Up.
   APP_KEY comes from the Power-Up admin page (trello.com/power-ups/admin):
   open your Power-Up → "API key" tab → "Generate a new API key".
   The key is safe to ship in client code; each team member still has to
   authorize the Power-Up individually (their token stays in their browser). */
window.PI_POWERUP_CONFIG = {
  APP_KEY: "f48b59a96e4bd6ae25a4efebe31e45cb",
  APP_NAME: "Project Info Extractor",
  // Trello's attachment download route returns no CORS headers, so browsers
  // can't fetch it directly — this Cloudflare Worker (proxy-worker/) forwards
  // the download server-side. Leave empty to attempt direct fetches only.
  PROXY_URL: "https://trello-attachment-proxy.clangley00.workers.dev",
};
