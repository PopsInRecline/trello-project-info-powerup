# Trello Project Info Power-Up

Adds a **Project Info** button to every Trello card. One click scans every
PDF attachment, every .txt attachment, and the text under **ORDER NOTES** in
the card description, merges the candidates by confidence, and shows the two
best guesses — **Project Name** and **Project Address** — each with its own
**Copy** button. Extraction uses the same engine as the PDF Merge tool.

The extraction engine (`js/pi-module.js`) shares its core with
`PDF Merge Tool/eval/pi_extract.mjs` — output is formatted identically to the
merge tool's Project Info card (`piTitleCase` name, `Street – City` address).

## How it works on a card

1. Open a card → click **Project Info** (right-side card buttons).
2. First time only: click **Authorize Trello** (read-only token, stored in that
   person's browser).
3. Every source is scanned and merged, in priority order:
   - **PDF attachments** (newest first) — fast text-layer pass on all of them;
   - **.txt attachments** (newest first) — run through the same line extractor;
   - the text immediately under an **ORDER NOTES** heading in the card
     description (markdown decoration, lowercase, and `ORDER NOTES: …`
     same-line text all work).
4. Each source yields name/address candidates with a confidence level
   (label-based `AUTO` beats positional `GUESS` beats `META`/`AI`); the
   best-ranked candidate per field wins, ties keep the higher-priority source.
5. OCR (Tesseract, ~15 s first run) only runs when a field is still missing
   after the fast pass, and only on the two newest PDFs. The optional AI
   vision fallback stays last-resort.
6. The two winners land in **Project Name** / **Project Address**, each with
   its own **Copy** button. **Re-extract** re-runs the whole merge.

## One-time deployment (owner)

The Power-Up is a static site — no server code. GitHub Pages works fine:

1. Create a GitHub repo (private is fine — Pages still serves publicly) and
   push this folder's contents to it.
2. Repo → Settings → Pages → deploy from branch `main`, root folder.
   Note the URL, e.g. `https://<user>.github.io/<repo>/`.
3. Go to <https://trello.com/power-ups/admin> → **New** →
   - Workspace: your team's workspace
   - Iframe connector URL: `https://<user>.github.io/<repo>/index.html`
4. In the Power-Up's admin page:
   - **Capabilities** tab → enable **card-buttons**.
   - **API key** tab → **Generate a new API key**. Copy the key.
   - Same tab, **Allowed origins** → add your Pages origin
     (`https://<user>.github.io`).
5. Paste the API key into `js/config.js` (`APP_KEY`), commit, push.
6. On each board: Menu → Power-Ups → **Custom** → add *Project Info Extractor*.

Team members need zero setup — they just click the button and authorize once.

## Keeping the extraction core up to date

`js/pi-module.js` contains a `SYNCED-CORE-BEGIN … SYNCED-CORE-END` region that
is auto-regenerated from `PDF Merge Tool/eval/pi_extract.mjs` by
`PDF Merge Tool/eval/sync_core_to_html.mjs` (this file is registered as a
target there, alongside the two HTML tools). The daily retrain task refreshes
it automatically, and the **TrelloPowerUp_CorePush** scheduled task
(`auto_push_core.ps1`, registered by `register_auto_push_task.ps1`; triggers:
logon +30 min and daily 12:00) commits & pushes the updated file so the hosted
Power-Up redeploys without manual steps. Log: `logs/auto_push.log`.

## Local testing (dev mode)

Open `extract.html` outside Trello (e.g. `python -m http.server` and browse to
it) and it shows a drop zone for testing PDFs and .txt files locally. You can
also append `?pdf=<same-origin-url>` or `?txt=<same-origin-url>` to auto-run
a test file (`test-notes.txt` is a ready-made notes sample).

## Optional AI vision fallback

For logo-only drawings OCR can't read: click **AI key** in the popup footer
and paste an Anthropic API key. Per-browser (localStorage), same as the merge
tool's vision fallback. Costs ~$0.005/page, only used when everything else
comes up empty.

## Attachment download proxy

Trello's attachment download endpoint requires an OAuth Authorization header
but returns **no CORS headers**, so browsers can never fetch attachments
client-side (a documented limitation). `proxy-worker/` is a tiny Cloudflare
Worker that forwards the download server-side and adds the CORS headers. It
only accepts requests from this Power-Up's origin and only for Trello
attachment-download URLs; the user's token passes through and is never stored.

Deployed at the URL in `js/config.js` → `PROXY_URL`. To redeploy after a
change: `npx wrangler deploy` from `proxy-worker/` (needs `wrangler login`).

## Files

| File | Purpose |
|---|---|
| `index.html` | Connector page — registers the card button |
| `extract.html` | The popup UI + Trello REST glue |
| `js/pi-module.js` | Extraction engine (synced core + pdf.js/OCR wrappers) |
| `js/helpers.js` | `piTitleCase` / `cleanExtractedName` (copies of merge-tool versions) |
| `js/config.js` | Trello API key + app name |
| `js/vendor/pdf.worker.min.js` | pdf.js worker, served same-origin (cross-origin workers are blocked by browsers) |
| `icon.svg` | Card-button icon |
