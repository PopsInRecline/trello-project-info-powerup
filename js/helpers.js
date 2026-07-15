/* helpers.js — display formatting shared with PDF_merge_tool.html.
   piTitleCase / cleanExtractedName are verbatim copies; keep in sync
   if the merge tool's versions change. */

function cleanExtractedName(name) {
  if (!name) return name;
  const tokens = name.trim().split(/\s+/);
  const kept = [];
  let shortRun = 0;
  for (const tok of tokens) {
    // Non-ASCII character → definitely garbage; stop (drop this token too)
    if (/[^\x00-\x7F]/.test(tok)) break;
    // Standalone punctuation symbols that never appear in real names
    if (/^[»«›‹→←•·…©®™°]+$/.test(tok)) break;
    // Standalone dash/slash after ≥1 good word = likely OCR garbage separator
    if (kept.length >= 1 && /^[-–—\/|]$/.test(tok)) break;
    // Track runs of very short tokens (1-2 chars that aren't initials like "A.")
    if (tok.length <= 2 && !/^[A-Z]\.$/.test(tok)) {
      shortRun++;
      if (shortRun >= 3) { kept.splice(-2); break; } // drop the short run we already kept
    } else {
      shortRun = 0;
    }
    kept.push(tok);
  }
  return kept.join(" ").trim();
}

// Convert an extracted business/project name to "Title Caps" regardless of
// the source casing. Preserves a small set of acronyms (LLC, USA, AT&T, II,
// roman numerals, etc.) and lowercases articles when they appear inside
// the name (but not as the first word).
const PI_TITLECASE_KEEP = new Set([
  "LLC","INC","CO","CORP","LP","LLP","PLLC","PA","PC","LTD",
  "USA","UK","NYC","LA","FL","NY","CA","TX","DC",
  "HQ","HVAC","ATM","HOA","DBA","CPA","ER","TV","AC","ID","IT","IP","IPO",
  "BBQ","DIY","DJ","FAQ","GPS","PDF","PIN","SUV","UPS","UV","VIP","XL","XXL",
  "ROI","SEO","API","CEO","CFO","CTO","COO","RV","NW","NE","SW","SE",
  "AT&T","H&M","J&J","P&G",
  "II","III","IV","VI","VII","VIII","IX","XI","XII","XIII","XIV","XV"
]);
const PI_TITLECASE_MINOR = new Set([
  "a","an","and","as","at","but","by","for","in","of","on","or","the","to","vs","via","with"
]);
function piTitleCase(s) {
  if (!s) return s;
  const trimmed = s.trim();
  if (!trimmed) return trimmed;
  // Tokenize keeping separators (space, hyphen, slash, ampersand)
  const parts = trimmed.split(/(\s+|[\-\/])/);
  const wordIdxs = parts.map((p, i) => /\S/.test(p) && !/^[\-\/]$/.test(p) ? i : -1).filter(i => i >= 0);
  const firstW = wordIdxs[0], lastW = wordIdxs[wordIdxs.length - 1];
  return parts.map((tok, i) => {
    if (!/\S/.test(tok) || /^[\-\/]$/.test(tok)) return tok;
    const upper = tok.toUpperCase();
    if (PI_TITLECASE_KEEP.has(upper)) return upper;
    // Things containing digits or only punctuation — keep as-is uppercased
    if (/\d/.test(tok) && !/[a-z]/i.test(tok)) return tok;
    const low = tok.toLowerCase();
    // Middle articles stay lowercase; "and" becomes "&"
    if (i !== firstW && i !== lastW && PI_TITLECASE_MINOR.has(low)) {
      return low === "and" ? "&" : low;
    }
    // McX / MacX style: capitalize after Mc/Mac
    let m = low.match(/^(mc)([a-z].*)$/);
    if (m) return "Mc" + m[2][0].toUpperCase() + m[2].slice(1);
    m = low.match(/^(mac)([a-z]{2,}.*)$/);
    if (m) return "Mac" + m[2][0].toUpperCase() + m[2].slice(1);
    // O'X style — capitalize after the apostrophe
    m = low.match(/^(o['’])([a-z].*)$/);
    if (m) return "O" + m[1].slice(1) + m[2][0].toUpperCase() + m[2].slice(1);
    // Apostrophe-S contractions/possessives stay lowercase ('s)
    m = low.match(/^(.+)('s|’s)$/);
    if (m) return m[1][0].toUpperCase() + m[1].slice(1) + m[2];
    // Default: capitalize first letter
    return low[0].toUpperCase() + low.slice(1);
  }).join("");
}
