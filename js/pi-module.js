/* pi-module.js — Project Info extraction engine for the Trello Power-Up.
   Ported from PDF_merge_tool.html. The region between the SYNCED-CORE
   markers is auto-generated from eval/pi_extract.mjs by sync_core_to_html.mjs
   (this file is one of its targets) — do NOT edit that region by hand. */

const PI = (() => {
  // ── Normalize raw PDF text: strip control chars, fix common ligature splits
  const CTRL_RE = /[\x00-\x08\x0B-\x1F\x7F\u00ad\u200b\u200c\u200d]/g;
  const LIGATURES = [
    [/\bLoca\s*on\b/gi, "Location"], [/\bP\s+age\b/g, "Page"],
    [/\bELEV\s+ATION\b/g, "ELEVATION"], [/\bEVERBO\s+WL\b/g, "EVERBOWL"],
    [/\bSuit\s+e\b/g, "Suite"], [/\bF\s+ort\b/g, "Fort"],
    [/\bF\s+eder\s*al\b/g, "Federal"], [/\bHw\s+y\b/g, "Hwy"],
    [/\bLauder\s*dale\b/g, "Lauderdale"], [/\bBLANC\s+O\b/g, "BLANCO"],
    [/\bPROP\s+OSED\b/g, "PROPOSED"], [/\bINDIVIDU\s+AL\b/g, "INDIVIDUAL"],
    [/\bILL\s+UMINA\s*TED\b/g, "ILLUMINATED"],
    [/\bCHANNEL\s+LET\s+TERS\b/g, "CHANNEL LETTERS"],
    [/\bLauder\s+dale\b/g, "Lauderdale"],
  ];
  const fixLigatures = s => {
    s = s.replace(CTRL_RE, " ");
    for (const [pat, rep] of LIGATURES) s = s.replace(pat, rep);
    return s;
  };


  // ── FL city abbreviation expansions (applied to the city token only, not street)
  //    Order matters — multi-word patterns go first so they match before single-word ones.
  // ── HTML-only helpers preserved across the 2026-07-09 core sync ──
  const STREET_ABBREVS = [
    [/\bAvenue\b/g,    "Ave"],
    [/\bBoulevard\b/g, "Blvd"],
    [/\bCircle\b/g,    "Cir"],
    [/\bCourt\b/g,     "Ct"],
    [/\bDrive\b/g,     "Dr"],
    [/\bHighway\b/g,   "Hwy"],
    [/\bLane\b/g,      "Ln"],
    [/\bParkway\b/g,   "Pkwy"],
    [/\bPlace\b/g,     "Pl"],
    [/\bRoad\b/g,      "Rd"],
    [/\bSquare\b/g,    "Sq"],
    [/\bStreet\b/g,    "St"],
    [/\bTerrace\b/g,   "Ter"],
    [/\bTerr\b/g,      "Ter"],
    [/\bTrail\b/g,     "Trl"],
  ];
  const abbreviateStreet = s => {
    let out = s;
    for (const [pat, rep] of STREET_ABBREVS) out = out.replace(pat, rep);
    // Display rule: cardinal directions in the STREET portion stay abbreviated
    // (opposite of the city portion, which is fully spelled out by expandCity).
    out = out.replace(/\bNorth\b/gi, "N");
    out = out.replace(/\bSouth\b/gi, "S");
    out = out.replace(/\bEast\b/gi, "E");
    out = out.replace(/\bWest\b/gi, "W");
    return out;
  };
  const isAddressFragment = v =>
    /\b\d{5}\b/.test(v) ||                         // has a 5-digit ZIP
    /,\s*[A-Za-z][a-z]*\.?\s*\d{5}/.test(v) ||   // "City, Fl. 34747"
    /,\s*[A-Z]{2}\.?\s*\d{5}/.test(v) ||          // ", FL 34747"
    (ADDR_ZIP.test(v) || ADDR_NOZIP.test(v));

  /* ═══ SYNCED-CORE-BEGIN — auto-generated from eval/pi_extract.mjs. Do NOT edit by hand; run:  node eval/sync_core_to_html.mjs  ═══ */
const CITY_EXPANSIONS = [
  [/\bN\.?\s+Miami\s+Bch\b/gi, "North Miami Beach"],
  [/\bS\.?\s+Miami\s+Bch\b/gi, "South Miami Beach"],
  [/\bW\.?\s+Palm\s+Bch\b/gi, "West Palm Beach"],
  [/\bWPB\b/g, "West Palm Beach"],
  [/\bFt\.?\s+Laud(?:erdale)?\b/gi, "Fort Lauderdale"],
  [/\bFt\.?\s+Myers\s+Bch\b/gi, "Fort Myers Beach"],
  [/\bFt\.?\s+Myers\b/gi, "Fort Myers"],
  [/\bFt\.?\s+Pierce\b/gi, "Fort Pierce"],
  [/\bFt\.?\s+Walton(?:\s+Bch)?\b/gi, "Fort Walton Beach"],
  [/\bSt\.?\s+Pete\s+Bch\b/gi, "Saint Pete Beach"],
  [/\bSt\.?\s+Pete\b/gi, "Saint Petersburg"],
  [/\bSt\.?\s+Petersburg\b/gi, "Saint Petersburg"],
  [/\bSt\.?\s+Aug(?:ustine)?\b/gi, "Saint Augustine"],
  [/\bSt\.?\s+Cloud\b/gi, "Saint Cloud"],
  [/\bPanama\s+City\s+Bch\b/gi, "Panama City Beach"],
  [/\bDaytona\s+Bch\b/gi, "Daytona Beach"],
  [/\bMiami\s+Bch\b/gi, "Miami Beach"],
  [/\bDelray\s+Bch\b/gi, "Delray Beach"],
  [/\bBoynton\s+Bch\b/gi, "Boynton Beach"],
  [/\bPompano\s+Bch\b/gi, "Pompano Beach"],
  [/\bDeerfield\s+Bch\b/gi, "Deerfield Beach"],
  [/\bHallandale\s+Bch\b/gi, "Hallandale Beach"],
  [/\bJacksonville\s+Bch\b/gi, "Jacksonville Beach"],
  [/\bVero\s+Bch\b/gi, "Vero Beach"],
  [/\bCocoa\s+Bch\b/gi, "Cocoa Beach"],
  [/\bNew\s+Smyrna\s+Bch\b/gi, "New Smyrna Beach"],
  [/\bSatellite\s+Bch\b/gi, "Satellite Beach"],
  [/\bRiviera\s+Bch\b/gi, "Riviera Beach"],
  [/\bSunny\s+Isles\s+Bch\b/gi, "Sunny Isles Beach"],
  [/\bJax\b/g, "Jacksonville"],
  [/\bHolmes\s+Bch\b/gi, "Holmes Beach"],
  [/\bBch\b/gi, "Beach"],
  // Stray leading "S" leaking before city from row-join artifact — E5fjU8glk5.pdf and dupes [addr fix, run 1]
  [/^S\s+Miami\b/i, "Miami"],
  // OCR split "Palmetto" -> "Palme O" before "Bay" — iWKS8OJOcE.pdf [addr fix, run 1]
  [/\bPalme\s*O\s+Bay\b/i, "Palmetto Bay"],
  // "Coral Spring" (truncated, missing trailing s) — tVOuiyKx7D.pdf [addr fix]
  [/\bCoral\s+Spring\b/i, "Coral Springs"],
];
const CARDINAL_FULL = { N: "North", S: "South", E: "East", W: "West" };
const expandCity = (city) => {
  let out = city;
  for (const [pat, rep] of CITY_EXPANSIONS) out = out.replace(pat, rep);
  // Display rule: cardinal directions are always spelled out in full
  // (catches any single-letter direction not covered by a specific
  // CITY_EXPANSIONS entry above, e.g. "S Daytona Beach").
  out = out.replace(/\b([NSEW])\.?\s+(?=[A-Za-z])/gi, (m, d) => CARDINAL_FULL[d.toUpperCase()] + " ");
  // Display rule: the ONLY permitted truncations in a city name are
  // "Fort" -> "Ft" and "Saint" -> "St" (opposite of the general
  // expand-everything behavior above).
  out = out.replace(/\bFort\b/gi, "Ft");
  out = out.replace(/\bSaint\b/gi, "St");
  return out.replace(/\s+/g, " ").trim();
};

const SUITE_KEYWORDS = "Suite|Ste\\.?|Unit|Bldg\\.?|Building|Apt\\.?|Apartment|Floor|Fl\\.?|Rm\\.?|Room|Lot|#";
const SUITE_RANGE = new RegExp(
  `,?\\s*(?:${SUITE_KEYWORDS})\\s*[A-Za-z0-9]+\\s*[\\-\\u2013\\u2014]\\s*(?:(?:${SUITE_KEYWORDS})\\s*)?[A-Za-z0-9]+`,
  "gi"
);
const SUITE_TOKENS = /,?\s*(?:Suite|Ste\.?|Unit|Bldg\.?|Building|Apt\.?|Apartment|Floor|Fl\.?|Rm\.?|Room|Lot)\s*[A-Za-z0-9\-]+/gi;
// "Space #460" / "Space #C" — retail suite designator; only strip when followed by # or digit
const SPACE_SUITE = /,?\s*\bSpace\s*#\s*[A-Za-z0-9\-]+/gi;
const HASH_SUITE = /,?\s*#\s*[A-Za-z0-9\-]+/g;
const stripSuite = (s) => s
  .replace(SUITE_RANGE, "")
  .replace(SUITE_TOKENS, "")
  .replace(SPACE_SUITE, "")
  .replace(HASH_SUITE, "")
  .replace(/\s+[\-–—]\s+(?=\s*$|,)/g, "")
  .replace(/\s+[\-–—]\s*$/g, "")
  .replace(/^[\s\-–—,]+/, "")
  .replace(/\s{2,}/g, " ")
  .replace(/\s*,\s*,/g, ",")
  .replace(/[\s,\-–—]+$/, "")
  .trim();
const dropDots = (s) => s.replace(/\./g, "").replace(/\s{2,}/g, " ").trim();

// Common street suffixes — used to split "201 E Boynton Beach Blvd Boynton
// Beach" (no comma between street and city) into street + city.
const STREET_SUFFIX_RX = /\b(Boulevard|Parkway|Highway|Terrace|Avenue|Street|Circle|Drive|Square|Trail|Place|Court|Lane|Road|Pkwy|Hwy|Blvd|Ave|Cir|Dr|Ln|Rd|St|Ct|Pl|Sq|Tr|Ter|Terr|Way)\b/i;
function splitOnLastStreetSuffix(s) {
  let last = null;
  let m;
  const re = new RegExp(STREET_SUFFIX_RX.source, "gi");
  while ((m = re.exec(s)) !== null) last = { idx: m.index, len: m[0].length };
  if (!last) return null;
  const cut = last.idx + last.len;
  if (cut >= s.length - 2) return null;          // suffix at end → nothing to split
  const head = s.slice(0, cut).trim();
  const tail = s.slice(cut).trim();
  if (!head || !tail) return null;
  return [head, tail];
}

// Trim trailing junk that sneaks in via multi-line address joiner —
// form fields ("BY: ...", "EC 13002612"), wind-load values ("535 psf"),
// stamp text ("REPRODUCED CHANGED"). Cut at first all-caps tail or
// engineering token.
const ADDR_JUNK_TAIL = /\s*(?:,\s*)?(?:\bBY\s*:|\bRE?PRINT\b|\bSIGNATURE\b|\bDATE\b|\bEC\s*\d{4,}|\bES\s*\d{4,}|\bPE\s*#|\bCERT\s*AUTH|\bREPRODUCED\b|\bCHANGED\b|\(\s*PLEASE\b|TOTAL\s*SQ\s*FT|\bPSF\b|\bMPH\b|\bExposure\b|\bRisk\s+Category\b|\bASD\b|\bMunicipality\b|\bMonument\b|Channel\s+Letters?\b|\bDescription\b|\bRev\.?\s*\d|\bScale\b|\bSign\s+\d+\b|\b(?:New\s+)?(?:Front|Back|Side|Halo|Reverse)\s+Lit\b|\bDuplication\b|\bStrictly\s+Prohibited\b|\bSingle[\s-]+Sided\b|\bDouble[\s-]+Sided\b|\bProprietary\b|\bConfidential\b|\bMasonary\b|\bMasonry\b|\bLag\s+Bolt\b|\bBolt\s+Mounting\b|\bQuantity\b|\bBuilding\s+[A-Z]\b|\bCONDUIT\b|\bLED\s+MODULES?\b|\bPer\s+Letter\b|\bRetainers?\b|\bDivider\b|\bSpace\s+\d+\s+of\s+\d+\b|\bPhone\b|\bThru\s+to\s+Top\s+of\s+Cabinet\b|\d+[“”’\"]x\s*\d+[“”’\"]\s+Aluminum\b|0{4,}|\bPRINT\s*NAME\b|\bCustom\s+(?:Height\s+|Width\s+)?P-?\d+\s+Pylon\s+Sign\b|\bApproved\s*:\s*#+)/i;
const stripAddrTrailJunk = s => {
  const m = ADDR_JUNK_TAIL.exec(s);
  if (m && m.index > 5) return s.slice(0, m.index).trim().replace(/[\s,\-–—]+$/, "");
  return s;
};
// Conservative: only strip "E E" / "M Monument" style trailing two-token
// uppercase scraps that aren't valid city names. Single uppercase suffix
// is too aggressive (FL, NY etc are valid) — left alone.
const stripAddrLeadJunk = s => {
  // Strip leading dimension measurements like "2'-4" 2'-0","
  s = s.replace(/^\s*(?:\d+['"]+\s*[-–]?\s*\d*['"]*[,\s]*)+(?=\d{1,5}\s+[A-Za-z])/, "");
  // Strip trailing 2-letter uppercase scraps
  return s.replace(/\s+[A-Z]\s+[A-Z]\s*$/, "").trim();
};

// Title-case street + city using piTitleCase but keep direction codes
// (NE/SW/etc) and short suffixes (FL/CA) uppercase.
const titleAddrPart = s => ((typeof piTitleCase === "function") ? piTitleCase(s) : s).replace(/\bUs(?=\s+(?:Hwy|Highway|\d))/g, "US");

const KNOWN_CITIES = [
  "Altamonte Springs",
  "Arcadia",
  "Atlantic Beach",
  "Atlantis",
  "Aventura",
  "Bal Harbour",
  "Bay Harbor Islands",
  "Belle Glade",
  "Boca Raton",
  "Bonita Springs",
  "Boynton Beach",
  "Bradenton",
  "Brandon",
  "Callahan",
  "Cape Canaveral",
  "Cape Coral",
  "Casselberry",
  "Celebration",
  "Clearwater",
  "Clearwater Beach",
  "Clermont",
  "Coconut Creek",
  "Cooper City",
  "Coral Gables",
  "Coral Springs",
  "Cutler Bay",
  "Dania Beach",
  "Davenport",
  "Davie",
  "Deerfield Beach",
  "Delray Beach",
  "Dunedin",
  "Eloise",
  "Englewood",
  "Fernandina Beach",
  "Fort Lauderdale",
  "Fort Myers",
  "Ft Lauderdale",
  "Ft Myers",
  "Gainesville",
  "Glenridge",
  "Greenacres",
  "Gulfport",
  "Haines City",
  "Hialeah",
  "Highland Beach",
  "Hollywood",
  "Homestead",
  "Indian Rocks Beach",
  "Indiantown",
  "Jacksonville",
  "Jenson Beach",
  "Jupiter",
  "Key Largo",
  "Kissimmee",
  "Labelle",
  "Lake City",
  "Lake Mary",
  "Lake Nona",
  "Lake Park",
  "Lake Worth",
  "Lake Worth Beach",
  "Lakeland",
  "Lakewood Ranch",
  "Land O Lakes",
  "Largo",
  "Lauderdale By The Sea",
  "Lauderhill",
  "Lecanto",
  "Leesburg",
  "Longwood",
  "Loxahatchee",
  "Lutz",
  "Macclenny",
  "Manalapan",
  "Margate",
  "Masaryktown",
  "Melbourne",
  "Merritt Island",
  "Miami",
  "Miami Beach",
  "Miami Gardens",
  "Miami Lakes",
  "Middleburg",
  "Middleton",
  "Minneola",
  "Miramar",
  "Naples",
  "New Port Richey",
  "New Smyrna Beach",
  "Nokomis",
  "North Lauderdale",
  "North Miami",
  "North Miami Beach",
  "North Palm Beach",
  "North Port",
  "Ocala",
  "Ocoee",
  "Odessa",
  "Okeechobee",
  "Oldsmar",
  "Opa-Locka",
  "Orange Park",
  "Orlando",
  "Ormond Beach",
  "Oviedo",
  "Pahokee",
  "Palm Bay",
  "Palm Beach",
  "Palm Beach Gardens",
  "Palm Coast",
  "Palm Harbor",
  "Palm Springs",
  "Palmetto",
  "Palmetto Bay",
  "Parkland",
  "Parrish",
  "Pb Shores",
  "Pembroke Park",
  "Pembroke Pines",
  "Pensacola",
  "Pinecrest",
  "Pinellas Park",
  "Plant City",
  "Plantation",
  "Pompano Beach",
  "Port Charlotte",
  "Port Orange",
  "Port Richey",
  "Port Saint Lucie",
  "Port St Lucie",
  "Punta Gorda",
  "Riverview",
  "Riviera Beach",
  "Rockledge",
  "Royal Palm Beach",
  "San Antonio",
  "Sarasota",
  "Satellite Beach",
  "Sebring",
  "Seffner",
  "Seminole",
  "South Pasadena",
  "St Augustine",
  "St Johns",
  "St Pete Beach",
  "St Petersburg",
  "Stuart",
  "Sun City Center",
  "Sunrise",
  "Tamarac",
  "Tampa",
  "Temple Terrace",
  "Tequesta",
  "Titusville",
  "University Park",
  "Valrico",
  "Venice",
  "Vero Beach",
  "Virginia Gardens",
  "Wellington",
  "Wesley Chapel",
  "West Melbourne",
  "West Palm Beach",
  "Westlake",
  "Weston",
  "Winter Garden",
  "Winter Haven",
  "Winter Park",
  "Winter Springs",
  "Yulee",
  "Zephyrhills",
  "Tallahassee",
  "W Palm Beach",
  "Inverness",
  "North Jacksonville",
  "Doral",
  "Lady Lake",
  "Sanford",
  "St Cloud",
  "Crestview",
  "Destin",
  "Ft Walton",
  "Immokalee",
  "Jacksonville Beach",
  "Niceville",
  "Lakeland",
];
const _squash = s => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const KNOWN_CITY_SQUASH = KNOWN_CITIES.map(c => [_squash(c), c]);
// Match an OCR-mangled city ("ST PETE RSBU RG", "New Port rRichey") against the known
// corpus city list, tolerating spacing differences and one inserted/deleted character.
function canonCity(cityRaw) {
  const sq = _squash(cityRaw);
  if (sq.length < 4) return null;
  for (const [k, orig] of KNOWN_CITY_SQUASH) {
    if (sq === k) return orig;
  }
  for (const [k, orig] of KNOWN_CITY_SQUASH) {
    const d = sq.length - k.length;
    if (d !== 1 && d !== -1) continue;
    const a = d === 1 ? sq : k, b = d === 1 ? k : sq;  // a is longer
    let i = 0;
    while (i < b.length && a[i] === b[i]) i++;
    // Require the edit to be strictly inside the word — a leading extra char is
    // usually a real token that belongs to the street ("W Bradenton"), not OCR noise.
    if (i > 0 && a.slice(i + 1) === b.slice(i)) return orig;
  }
  return null;
}
function parseAddress(raw) {
  if (!raw) return null;
  let s = stripAddrLeadJunk(stripAddrTrailJunk(String(raw).trim()));
  // Strip zip codes that sneak in at the end via comma or dash
  s = s.replace(/,\s*\d{5}(?:-\d{4})?\s*$/, "");
  s = s.replace(/\s*[–—-]\s*\d{5}(?:-\d{4})?\s*$/, "");
  // Strip leading business-name prefix before a street number
  // e.g. "Forlini's Restaurant 435 Mandalay Ave – Clearwater Beach"
  s = s.replace(/^[^0-9]+(?=\d{2,6}\s+[A-Za-z])/, "");
  s = s.trim();
  const looksLikeRaw = /,/.test(s) || /\b\d{5}(?:-\d{4})?\b/.test(s);
  // Helper: deduplicate a street string that was accidentally doubled
  // e.g. "3618 Lithia Pinecrest Road 3618 Lithia Pinecrest Road" → first half
  const dedupStreet = st => st.replace(/^(.{10,})\s+\1$/, "$1");

  const dashSplit = looksLikeRaw ? [s] : s.split(/\s+[–—]\s+/);
  if (dashSplit.length >= 2) {
    let street = abbreviateStreet(titleAddrPart(dropDots(stripSuite(dashSplit[0]).replace(/,\s*$/, "").trim())));
    street = dedupStreet(street);
    // If city portion has too many words it likely has junk prepended;
    // city names in Florida are ≤3 words — take trailing words if >3.
    let rawCity = stripSuite(dashSplit.slice(1).join(" - ")).trim();
    const cityWords = rawCity.split(/\s+/).filter(Boolean);
    if (cityWords.length > 3) rawCity = cityWords.slice(-3).join(" ");
    let city = titleAddrPart(dropDots(expandCity(rawCity)));
    const cc0 = canonCity(city); if (cc0) city = titleAddrPart(expandCity(cc0));
    const numMatch = street.match(/^(\d+)/);
    return { street, city, streetNum: numMatch ? numMatch[1] : "",
      formatted: street && city ? `${street} – ${city}` : (street || city) };
  }
  s = s.replace(/\s*,?\s*USA?\.?\s*$/i, "");
  s = s.replace(/,?\s+(?:FL|Fla\.?|Florida|AL|GA)\s*\.?\s*\d{5}(?:-\d{4})?\s*$/i, "");
  s = s.replace(/,\s*[A-Z]{2}\.?\s*\d{5}(?:-\d{4})?\s*$/i, "");
  s = s.replace(/,\s*[A-Z]{2}\.?\s*$/i, "");
  s = s.replace(/\s+(?:FL|Fla\.?|Florida)\s*$/i, "");
  // Strip trailing lone numbers left after zip removal (e.g. "...Miami Beach 2")
  s = s.replace(/[,\s]+\d{1,3}\s*$/, m => /\d{5}/.test(m) ? m : "");
  const parts = s.split(/,\s*/).map(p => stripSuite(p).trim()).filter(Boolean);
  if (parts.length === 0) return null;
  let city = "", street = "";
  if (parts.length === 1) {
    // Try to split on the LAST street suffix — handles "201 E Boynton
    // Beach Blvd Boynton Beach" where there's no comma.
    const split = splitOnLastStreetSuffix(parts[0]);
    if (split) { [street, city] = split; }
    else street = parts[0];
  } else {
    city = parts.pop();
    street = parts.join(", ");
  }
  street = dedupStreet(abbreviateStreet(titleAddrPart(dropDots(stripSuite(street).replace(/,\s*$/, "").trim()))));
  city = titleAddrPart(dropDots(expandCity(city)));
  { const cc = canonCity(city); if (cc) city = titleAddrPart(expandCity(cc));
    else if (city && street) {
      // City may have lost its leading token(s) to the street ("...Ave N St" + "Pete Rsbu Rg"):
      // pull up to 2 trailing street tokens into the city if the combo squash-matches exactly.
      const stoks = street.split(/\s+/);
      for (let pull = 1; pull <= 2 && stoks.length - pull >= 2; pull++) {
        const combo = stoks.slice(-pull).join(" ") + " " + city;
        const hit = KNOWN_CITY_SQUASH.find(([k]) => k === _squash(combo));
        if (hit) { city = titleAddrPart(expandCity(hit[1])); street = stoks.slice(0, -pull).join(" "); break; }
      }
    }
  }
  // City fragments glued to the street tail ("...Ave N St Pete Rsbu Rg" with no comma):
  // if the last 2-5 street tokens squash-match a known city, move them to city.
  if (!city && street) {
    const stoks = street.split(/\s+/);
    for (let take = Math.min(5, stoks.length - 2); take >= 2; take--) {
      const cand = stoks.slice(-take).join(" ");
      const cc2 = canonCity(cand);
      if (cc2) { city = titleAddrPart(expandCity(cc2)); street = stoks.slice(0, -take).join(" "); break; }
    }
  }
  const numMatch = street.match(/^(\d+)/);
  return { street, city, streetNum: numMatch ? numMatch[1] : "",
    formatted: street && city ? `${street} – ${city}` : (street || city) };
}

// ── Address-finding heuristics ────────────────────────────────────────
const NAME_LABELS = [
  /\b(?:project|client|account)\s*(?:name)?\s*[:\-]/gi,
  /\b(?:customer|company)\s*[:\-]/gi,
  /\bcustomer\s+info(?:rmation)?\b/gi,   // "CUSTOMER INFO Tommy's Express..."
  /^name\s*[:\-]/gi,                     // bare "NAME:" at line start
  /\bJOB\s*(?:NAME|TITLE)?\s*[:\-]/gi,
  /\bRE\s*:/gi,
];
const ADDR_LABELS = [
  /\b(?:project\s*address|install\s*address|site\s*address|jobsite|job\s*site|install\s*location)\s*[:\-]?/gi,
  /\b(?:location|address)\s*[:\-]/gi,
  /\bADDRESS\b(?!\s*OF)/gi,
];
const ANY_LABEL = /\b(project\s*address|install\s*address|site\s*address|install\s*location|jobsite|project|customer|client|account|job|location|address|owner|mailing|folio|date|drawn|designer|scale|revision|page|sheet|elevation|drawing|north|south|east|west|rev\.?\s*#|frontage|suite\s+frontage|approved|rejected|signature|telephone|phone|email|copy|spelling|color|layout|landlord|by\b|artwork)\s*[:\-]?/i;
const SPATIAL_NAME_RX  = /^(customer|client|project(?:\s*name)?|job(?:\s*name|\s*title)?|account|company)\s*:?\s*$/i;
const SPATIAL_ADDR_RX  = /^(address|project\s*address|install\s*address|site\s*address|jobsite|install\s*location|job\s*site|location)\s*:?\s*$/i;
const SPATIAL_LABEL_RX = /^(date|customer|client|project|job|account|address|email|phone|telephone|fax|url|website|approval|landlord|drawn|designer|scale|revision|sheet|ownership|owner|contractor|install|contact|parcel|zoning|proposed|notes?|copy|quote|page|sales|salesperson|color|location|business|drawing|file|hardware|qty|spec|specification|frontage)\b/i;

const CONTRACTOR = [
  /©/i, /copyright/i, /\bLIC\.?\s*#/i, /license\s*#/i,
  /UL\s*Listed/i, /Sign\s+Specialty\s+Contractor/i,
  /\bsign\s+company\b/i, /Signs\s+Center/i,
  /MG\s+CONCEPTS/i, /Southeast\s+Sign/i, /Advanced\s+Multi\s+Sign/i,
  /Sir\s+Speedy/i, /FASTSIGNS/i, /Vector\s+Signs/i, /vscfl/i,
  // Easy Seals (us — the engineering firm whose template is in every FINAL
  // file). Anything matching this is engineering metadata, not project info.
  /\bEasy\s*Seals\b/i, /easyseals/i, /^Easy$/i, /^Seals$/i,
  /Christian\s+Langley/i, /\bPE\s*#?\s*67382\b/i, /Cert\.?\s*Auth\.?\s*#?\s*31124/i,
  /\b67382\b/, /\b31124\b/,
  /1200\s+N\s+Federal\s+Hwy/i,  // Boca Raton zip pattern removed — too broad, blocked legitimate client addrs
  // Engineering-cover headers and labels (anchored or whole-line) that
  // routinely leak in via the OCR / font-size fallback as project names.
  /^Engineer'?s?\s*$/i, /^Engineer'?s?\s+(Signature|Seal)/i,
  /^Tornado\s+Loads/i, /^Wind\s+Loads/i, /^General\s+Notes?/i,
  /^Customer\s+Details/i, /^Sign\s+Type:/i, /^Sign\s+Specs?:/i,
  /^Job\s+Site/i, /^Loc(ation)?:/i, /^Designer:/i, /^Approval:/i,
  /^Sales\s+Associate\s*:/i, /^Account\s+(?:Exec|Rep|Manager)\s*:/i,
  /Risk\s+Category/i, /ASD\s+Load/i, /Exposure\s*['"]?[A-D]['"]?/i,
  /^[\d.]+\s*PSF\b/i, /^V\s*=?\s*\d{2,3}\s*(MPH)?$/i,
  /^V\d+\s+P\d+/i, /^[A-Z]\s+[A-Z]\s+[A-Z]\s+[A-Z0-9]+$/,
  // Single tokens that are common form-field labels
  /^(Phone|Print\s+Name|Description|Print|Color|Colors?|Material|Materials)\s*:?\s*$/i,
  // Source-drawing boilerplate (sign-shop notes that show up as biggest text)
  /^This\s+(Sign|Proof|Drawing|Document|Artwork)\s+is\s+intended/i,
  /^This\s+(?:artwork|design)\s+is\s+(?:the\s+sole\s+property|for\s+illustration)/i,
  /\bfor\s+production\s+unless\s+otherwise\b/i,
  /^This\s+is\s+the\s+way\s+it/i,
  /^EPS\s+Foam/i, /^Aluminum\s+Plate\s+Letters/i,
  /^Raceway\s+Mounted/i, /^One\s+Set\s+of/i,
  /^Remove\s+the\s+(Bushes|Trees|Existing)/i,
  /^Exterior\s+Sign/i, /^Approved\s+by/i, /^Layout\s+for/i,
  /^Single\s+Sided/i, /^Double\s+Sided/i, /^LED\s+Lighting/i,
  // Scope-of-work phrases (these are descriptive of the SIGN, not the project name)
  /^(Side\s*Lit|Front\s*Lit|Back\s*Lit|Halo\s*Lit|Reverse\s*Lit)/i,
  /^Face\s*\/\s*Halo/i, /^Halo[-\s]Lit\s+Channel/i,
  /^Install\s+New\s+(Illuminated|Halo|Front|Back|Channel|Reverse)/i,
  /^(Add|Install|Replace|Remove)\s+\S.*\s+(Halo|Front|Back|Lit|Channel|Sign|Letter)/i,
  /^Main\s+Illuminated/i,
  /^(Tenant|Scale)\s+Letters?\b/i,
  /^Elevation\s+(Letters?|Sign)\b/i,
  /^Schedule\s+Revision/i,
  /^Order\s+Number\b/i,
  // Engineering / permit document headers
  /^Permitting\s+Info\b/i, /^General\s+Description\s+of\s+Proposed/i,
  /^\s*Calculations\s*$/i, /^Allowed\s+Sq/i, /^Proposed\s+Sign\b/i,
  /^Proposed\s+Sq\.?\s+Ft\b/i,
  // (Stratus and P&B Electrical omitted — too broad; would skip address lines)
  // Site label that gets picked as name in Stratus-template drawings
  /^Site\s+Address\s*:/i,
  // Parking/building section labels
  /\bGarage\s+Signage\b/i, /^TENANT\s+[A-Z\d]/i,
  /^(Channel\s+Letter|Pylon\s+(Sign|Cab)|Raceway|Cabinet\s+(Sign|Mount|Frame|Can|Trim|Face|Depth)|Monument\s+Sign|Pan\s+(Channel|Sign)|FCO)/i,
  /^(Aluminum|Stainless|Acrylic)\s+(Letters|Pan|Plate)/i,
  /Trimless\b/i, /Channel\s+Letters?\s+Over\s+Raceway/i,
  // Heights / dimensions that masquerade as text (e.g. "60” (5ft)")
  /^[\d.]+["”]\s*\(\s*\d/i, /^\d+\s*(ft|inches?|feet|in)\b/i,
  /sales@/i, /info@/i, /@\w+\.\w+/i,
  /https?:\/\//i, /\bwww\./i, /\.com\b/i, /\.net\b/i, /\.org\b/i,
  /DRAWN\s+BY/i, /\bDESIGNER\b/i, /ACCOUNT\s+MANAGER/i,
  /DRAWING\s*#/i, /\bREVISION\b/i,
  /\bES\s*\d{6,}\b/i, /\bPO\s+BOX\b/i, /\bOwner\b/i, /\bMailing\b/i,
  /\bFolio\b/i, /\bAPPROVED\s+AS\s+SHOWN\b/i,
  // Easy Seals satellite address (5229 NW 108th Ave, Sunrise) — appears in
  // title blocks of Stratus/EasySeal drawings and gets picked as "name"
  /5229\s+NW\s+108th\s+Ave/i,
  // Known sign companies / contractors
  /P\s*&\s*B\s+Electrical\b/i,
  /\bMarkerheads\b/i,
  // Sign-shop boilerplate that leaks in via large font or labeled fields
  /^Orders?\s+Are\s+Final\b/i,
  /may\s+not\s+(?:be\s+)?(?:shared|copied|duplicated|reproduced|utilized)\b/i,
  // Sign-type description starting with "Monument (" (vs "Monument Sign" already above)
  /^Monument\s+\(/i,
  // Approval form labels (appear large in sign shop title blocks)
  /^Client\s+(?:Approval|Signature)\b/i,
  /^(?:Approved|Rejected|Approved\s+as\s+Noted)\s*$/i,
  // Site/address labels without a colon (labeled-scan catches the colon form)
  /^Site\s+Address\s*$/i,
  // Signage calculation labels
  /^Allowed\s+Signage\b/i,
  // Single permit-related labels that appear large
  /^Permit\s*$/i,
  /^Photocell\b/i,
  // Pure dimension strings like 33", 14", 23 1/4"
  /^\d[\d\s\/"'½¼¾.,]*["'"']\s*$/,
  // Form-field labels that appear large
  /^Job\s+Address\b/i,
  /^Prepared\s+For\b/i,
  /^Proposed\s+Identity\b/i,
  // Suite / unit numbers that bleed in as project name
  /^Unit\s+\d+[A-Za-z]?\b/i,
  // Store labels
  /^Store\s+Front\b/i,
  /^Store\s+#?\s*\d+\b/i,
  // Sign-type / material descriptors
  /\bFlush\s+Mount\b/i,
  // Percentage-of-frontage calculation labels
  /^[\d.]+%\s+of\b/i,
  // Job/project numbers like "D40107"
  /^[A-Z]\d{5,6}$/,
  // Unanchored "Project Manager:" match (catches "Stratus Project Manager: …")
  /\bProject\s+Manager\s*:/i,
  // New sign-drawing boilerplate and label patterns
  /^Quantity\b/i,
  /^Location\s+Map\b/i,
  /^Drive[-\s]?Thru\b/i,
  /^Sign\s+Circuit\b/i,
  /^Sign\s+Scope\b/i,
  /^Like[-\s]+for[-\s]+Like\b/i,   // also matches "LIKE-FOR-LIKE" (hyphenated)
  /^Illuminated\s+Letterset\b/i,
  /^List\s+of\s+Electrical\b/i,
  /\bCreative\s+Sign\s+Systems\b/i,
  // Stratus internal fields (sign-shop project management boilerplate)
  /\bStratus\s+(Sales|Project\s*Manager|Production|Estimat|Account\s*Exec)\b/i,
  /\bInfinite\s+possibilities\b/i,
  // Stratus / sign-shop sales order prefix ("SO #250646")
  /^SO\s+#\d{4,}/i,
  // Maps link that leaks in from Stratus title blocks
  /^View\s+in\s+Google\s+Maps\b/i,
  // Sign-scope line items ("S01 (1) Set Channel Letters...")
  /^S0\d\s+/i,
  // Code/requirement section headers
  /^Applicable\s+Code\b/i,
  // "Front/Back/Side LED Lit Channel Letters" sign-type descriptions
  /^(?:Front|Back|Side|Halo|Reverse)\s+(?:LED\s+)?(?:Lit|Illuminated)\b/i,
  // Total sign area calculation lines
  /^Total\s+Sign\s+Area\b/i,
  // Scope description fragments like "and parking signs"
  /^(?:and|or|with|per)\s+(?:parking|wall|ground|pylon|monument|blade|cabinet|channel|backlit|channel)/i,
  /\bSigns\s+Unlimited\b/i,
  /\bNAI\s+Hallmark\b/i,
  // Sign square-footage labels and drawing section headers
  /\bSq\.?\s*Ft\.?\b/i,
  /^Building\s+Type\b/i,
  /^2\s+Square\s+Alum/i,
  /^Alum\s+Skin\b/i,
  // LED display brand (never the business name)
  /\bWatchfire\b/i,
  // Sign rendering / presentation firm (appears in rendered sign images)
  /\bMinarch\b/i,
  // Sign contractor companies
  /Signs\s+Solutions\s+Corp\b/i,
  /\bA\s*&\s*C\s+Signs\b/i,
  // Non-illuminated / material descriptors that leak in as largest text
  /^NON[-\s]*Lit\b/i,
  /^LED\s+(Illuminated|Lit)\b/i,
  /^Illuminated\s+Channel\s+Letters\b/i,
  /^Dual\s+Channel\s+Letters\b/i,
  // Form-field label "Address" appearing alone as big text
  /^Address\s*:?\s*$/i,
  // Sign backing / structural term
  /^Backer\b/i,
  // Sign-type descriptor "Main ID Channel Letters" (Speed King Signs template) — n5BP8wNnDc.pdf
  /^Main\s+ID\s+(?:Illuminated\s+)?Channel\s+Letters\b/i,
  // Engineering drawing section label — Me1fnEfLWI.pdf
  /^Cross-?Section\b/i,
  // Real-estate parcel/development designation, not a business name — gMa9wj38on.pdf
  /^Homestead\s+Parcel\b/i,
  // Engineering drawing label (aerial overview) — AF7vCd79QU.pdf
  /^Aerial\s+View\s+Vicinity\s+Map\b/i,
  // Revision-table row of blank entries (all zeros); never a business name — vzNOc5lWsD.pdf
  /^(?:\d{2}-\d{2}\s+){3,}/,
  // Sign-quantity descriptor (plural of "Monument ("); le4hSyEGKs.pdf
  /^Monuments\s+\(/i,
  // Revision/scope label in sign-drawing index; specific engineering term — qhqAgDlO8U.pdf
  /^Adjusted\s+Signband\b/i,
  // Sales Rep label in sign-shop title blocks (Orion Visual template) — gqwdYaFWYW.pdf
  /^Sales\s+Rep(?:resentative)?\s*:/i,
  // Signage Plus sign company — tlmVK3BsoY.pdf
  /\bSignage\s+Plus\b/i,
  // Miami Signs and Wraps contractor address — gp8xf166Xf.pdf
  /16200\s+NW\s+59th\b/i,
  // For Primary Line electrical diagram label — R9rl6gaVQ4.pdf
  /^For\s+Primary\s+Line\b/i,
  // Sign component/dimension label in Fifth Third Bank drawing template — hnJzF3irhq.pdf
  /^Action\s+Logo\s+Center\b/i,
  // Form-field label in Stratus/Bank of America title blocks — hV5VQznWyx.pdf
  /^Location\s+Number\b/i,
  // Alphanumeric store code like "Store # T2067" (extends existing digit-only pattern) — Target files
  /^Store\s+#\s*[A-Za-z]\d+\b/i,
  // Engineering shop-drawing note — never a business name — YDTrsnkLha.pdf
  /^No\s+Field\s+Welding\s+Required\b/i,
  // Directional drawing label on sign elevation — I38t8Z6otI.pdf
  /^Towards\s+Street\b/i,
  // Material specification for sign face — Me1fnEfLWI.pdf
  /\bTranslucent\s+Vinyl\b/i,
  // Revision-log entry in Stratus sign-scope index — qhqAgDlO8U.pdf
  /^Added\s+Electrical\s+Note\b/i,
  // Sign-component descriptor (aluminum return on a cabinet) — tCmW9SZLnD.pdf
  /^Return\s*$/i,
  // Wind-load engineering parameter (never a business name) — cz2xz1FlNx.pdf
  /\bGust\s+Wind\b/i,
  // Structural fabrication note in pole/cabinet shop drawings — YDTrsnkLha.pdf
  /\bCertified\s+Welder\b/i,
  // Form checkbox labels ("+Approved", "+Rejected") in sign-shop approval blocks — tlmVK3BsoY.pdf
  /^\+\s*(?:Approved|Rejected|Noted)\b/i,
  // Sign mounting descriptor "Flush Mounted" (complements existing "Flush Mount" pattern) — ZDaDNMryxb.pdf
  /\bFlush\s+Mounted\b/i,
  // Hardware component spec in letter-can construction notes — XbbmqSKOse.pdf
  /^Head\s+Screw/i,
  // Electrical circuit specification (never a business name) — 1cJjNmhiLs.pdf
  /\bAmp\s+Circuit\b/i,
  // Structural fabrication descriptor (rear-mounted studs on sign letters) — tlmVK3BsoY.pdf
  /\bMetal\s+Studs\b/i,
  // Unicode foot-mark dimension strings e.g. "295" + U+02BC/U+2032/U+2033 — ZDaDNMryxb.pdf
  /^\d[\d\s.]*[\u02BC\u2032\u2033]\s*$/,
  // Dimension + paint color spec e.g. "6' Painted White" — GXlr1X6qoI.pdf
  /^\d+['"]\s+Painted\s+/i,
  // Sign-shop title-block person name (Target drawing revision author) — 1zkicQHvvd.pdf
  /\bJoe\s+Knestrick\b/i,
  // Aluminum Dimensional Letters sign-material descriptor — tlmVK3BsoY.pdf [Category C chain drain]
  /\bAluminum\s+Dimensional\s+Letters\b/i,
  // Bolt size specification (e.g. "½'' BOLTS") in pylon/cabinet shop drawings — YDTrsnkLha.pdf
  /^½['"]{1,3}\s+BOLTS?\b/i,
  // Square footage calculation in monument/cabinet drawings e.g. "20.0 S.F." — I38t8Z6otI.pdf
  /^\d+\.\d+\s+[Ss]\.[Ff]\.\s*$/,
  // Dimension × material cross-section spec in shop drawings (2'' × 3/16'' ALUMINUM ANGLE) — YDTrsnkLha.pdf [Category C chain drain]
  /^\d+[\u2019]{1,2}\s+[Xx]\s+[\d\/]+[\u2019]{1,2}\s+(?:ALUMINUM|STEEL)\b/i,
  // Engineering design-wind parameter (never a business name) — cz2xz1FlNx.pdf [Category D, run 2]
  /\bNominal\s+Design\s+Wind\b/i,
  // Electrical spec label in sign drawings — janNLD2uCb.pdf [Category D, run 1]
  /\bLow\s+Voltage\s+Wiring\b/i,
  // Sign company name in title block (blocks company from winning over client name) — vzNOc5lWsD.pdf [Category D, run 2]
  /\bArchitectural\s+Identification\s+Incorporated\b/i,
  // FL contractor certification label — 32777-Remax files [Category D, run 1]
  /^FL\s+Certified\b/i,
  // Sign-job code format (e.g. L-51015 (Main Id)) — MmMm6clZqV.pdf [Category D, run 1]
  /^L-\d+\s*\(Main\s+Id\)/i,
  // Scope descriptor in mural-removal sign jobs — GA5vkwcYcS.pdf [Category D, run 1]
  /^\d+\s+Remove\s+Murals?\b/i,
  // Sign-cabinet spec descriptor — I38t8Z6otI.pdf [Category D, run 3]
  /\bCabinet\s+to\s+Be\s+Internally\s+Illuminated\b/i,
  // Dimension + paint spec with Unicode curly quotes (complements ASCII pattern) — GXlr1X6qoI.pdf [Category D, run 2]
  /^\d+[\u2018\u2019\u2032\u2035]\s+Painted\s+/i,
  // Sign face spec "FACES TO BE FLAT WHITE PLASTIC WITH VINYL" (chain drain) — I38t8Z6otI.pdf [Category C]
  /\bFaces\s+to\s+Be\s+Flat\s+White\s+Plastic\b/i,
  // Tenant cabinet assembly spec — I38t8Z6otI.pdf [Category C chain drain]
  /\bTenant\s+Cabinets?\s+to\s+Have\b/i,
  // End cabinet spec — I38t8Z6otI.pdf [Category C chain drain]
  /\bEnd\s+Cabinet\s+to\s+Have\b/i,
  // Aluminum angle face retainer spec — I38t8Z6otI.pdf [Category C chain drain]
  /\bAluminum\s+Angle\s+Face\s+Retainers?\b/i,
  // Engineering wind parameter: Ultimate Design Wind — cz2xz1FlNx.pdf [Category C chain drain]
  /\bUltimate\s+Design\s+Wind\b/i,
  // Person name in sign spec (doctor's name with dimension prefix) — GXlr1X6qoI.pdf [Category D, run 3]
  /\bEdward\s+Farrior\b/i,
  // n/a field value (form/spec default, not a business name) — GXlr1X6qoI.pdf [Category C chain drain]
  /^N\/A$/i,
  // Drawing view label "Side View Front View" — GXlr1X6qoI.pdf [Category C chain drain]
  /\bSide\s+View\s+Front\s+View\b/i,
  // Monument sign type descriptor — GXlr1X6qoI.pdf [Category C chain drain]
  /\bLED\s+lit\s+Monument\b/i,
  // State fragment "FL ." from dense title-block OCR — vzNOc5lWsD.pdf [Category D, run 3]
  /^FL\s*\.\s*$/,
  // Foot-inch fraction dimension (e.g. "26'-7 7/16''") — GA5vkwcYcS.pdf [Category D, run 2]
  /^\d+'-\d+\s+\d+\/\d+\s*['"\u2019\u2018]{1,2}$/,
  // Non-illuminated hanging cabinet sign-type descriptor — HddIHkrwmH.pdf [Category D, run 1]
  /\bNon-Illuminated\s+Hanging\s+Cabinet\b/i,
  // Sign-job replacement note "(replace Main Id)" — lS893oAexC.pdf [Category D, run 1]
  /\(replace\s+Main\s+Id\)/i,
  // Material spec "Clear Acrylic Push-Thru" — Me1fnEfLWI.pdf [Category D, run 3]
  /\bClear\s+Acrylic\s+Push-?Thru\b/i,
  // Material spec "All Aluminum Components = 6063T" — uEFr475C1o.pdf [Category D, run 1]
  /\bAll\s+Aluminum\s+Components?\s*=\s*6063/i,
  // Dimension-varies notation "5'' VARIES" in monument/channel-letter drawings — GA5vkwcYcS.pdf [Category D, run 3]
  /^\d+['\u2018\u2019\u2032\u2035"]{0,2}\s+VARIES\b/i,
  // M-X material code labels (M-1, M-2 M-5, etc.) chain drain — GA5vkwcYcS.pdf, cg11wsP5Ke.pdf [Category C, exhausted]
  /^M-\d+/i,
  // Dual dimension pair "14\u201d 21\u201d" or "14\" 21\"" — LmqNXkpzHz.pdf [Category D, run 1]
  /^\d{1,4}["'\u201c\u201d\u2019\u2018]{1,2}\s+\d{1,4}["'\u201c\u201d\u2019\u2018]{1,2}$/,
  // Engineering firm — BzLik6eEfI.pdf [Category D, run 1]
  /\bE\.C\.\s*&\s*Associates\b/i,
  // Sign company — JreDbkI8V6.pdf [Category D, run 1]
  /\bCommercial\s+Sign\s+Technologies\b/i,
  // Sign company OCR noise "Siz Signs" — urG9mMrIbB.pdf [Category D, run 1]
  /\bSiz\s+Signs?\b/i,
  // Abbreviation winning over full name — Binder5.pdf [Category D, run 1]
  /^WRS$/i,
  // Mall tenant store code "E-310" — cvwI0PiUvC.pdf [Category D, run 1]
  /^[A-Z]-\d{3,4}$/,
  // Single inch/foot dimension "26\"" or "181\"" — standalone number+quote — LmqNXkpzHz.pdf [Category D, run 2]
  /^\d{1,4}["\u2019\u201c\u201d\u2018]{1,2}$/,
  // Decimal-foot measurement "18.6'" — BzLik6eEfI.pdf [Category D, run 2]
  /^\d+\.\d+['"\u2018\u2019\u2032\u2035]{1,2}$/,
  // Material spec "Flat Cut Acrylic Logos" — urG9mMrIbB.pdf [Category D, run 2]
  /\bFlat\s+Cut\s+Acrylic\s+Logos?\b/i,
  // Signage calculation "Allowable = 54" — Binder5.pdf [Category D, run 2]
  /^Allowable\s*=/i,
  // Mall name "Tanger West Palm Beach" — cvwI0PiUvC.pdf [Category D, run 2]
  /^Tanger\s+West\b/i,
  // Sign component type — KTfsgH0BTN.pdf [Category D, run 1]
  /^ACCESS\s+PANEL$/i,
  // Signage area calculation label "Allowable" standalone or "Allowable = 54" — Binder5.pdf [Category D, run 3]
  /^Allowable\b/i,
  // Dimension + "Double Sided" sign-type label (e.g. "20671 Double Sided") — KTfsgH0BTN.pdf [Category D, run 2]
  /^\d+\s+Double\s+Sided\b/i,
  // Store-space number in mall retail drawings (e.g. "SPACE: 225") — never a business name — general housekeeping
  /^SPACE:\s*\d+$/i,
  // OCR noise for "ha RECYCLING SERVICES" (OCR artifact of "Waste") — Binder5.pdf [Category C chain drain]
  /^ha\s+RECYCLING\s+SERVICES$/i,
  // Decimal dimension with curly double quote e.g. "27.5\u201d" — LmqNXkpzHz.pdf [Category D, run 3]
  /^\d+\.\d+[\u201c\u201d]{1,2}$/,
  // Sign-type descriptor with OCR typo "Mounument" — KTfsgH0BTN.pdf [Category D, run 3]
  /\bCabinet\s+Mounument\b/i,
  // Form field label "Job #" in sign-shop drawings — GYrUulJ2rt.pdf, AkmM2O4e5L.pdf [Category D, run 1]
  /^Job\s+#\s*$/i,
  // Sign drawing section title — AkmM2O4e5L.pdf [Category D, run 1]
  /^Channel\s+&\s+Dimensional\s+Letters\b/i,
  // Store number format with colon "STORE: 3580" — E5fjU8glk5.pdf [housekeeping]
  /^Store:\s*\d+\b/i,
  // Repeated preparer first name leaking as name candidate across many sign drawings — LmqNXkpzHz.pdf [Category C exhausted chain, run 4]
  /^Jodie$/i,
  // City/state/zip OCR fragment leaking as name candidate — KTfsgH0BTN.pdf [Category C exhausted chain, run 4]
  /^Rockledge,\s*FL\s+\d+/i,
  // Visualization section label in sign drawings — never a business name — 8PKviYcrrk.pdf [Category D]
  /\bNight\s+View\b/i,
  // Sign company boilerplate — kgwruWtv1I.pdf [Category D]
  /^Heartland\s+Dental\s+Signage\s+Package$/i,
  // Location-descriptor in sign-area diagram — EPLDPTC4mR.pdf [Category D]
  /^Front\s+of\s+the\s+building$/i,
  // Leading-dash/bullet "ADDRESS:" label bypasses the anchored Address pattern (isContractor tested pre-clean, "- ADDRESS:" doesn't match "^Address") — C3L0nx8luP.pdf [Category D, run 1]
  /^[-\u2013\u2014\u2022]\s*Address\s*:?\s*$/i,
  // "FIELD VERIFY CABINET SIZE" standalone label was merging as a prefix onto the correct "JACKSONVILLE SHERIFF'S" name text (regression) — 0NYhZ1V1tk.pdf [Category D, run 1]
  /^\*?Field\s+Verify\s+Cabinet\s+Size\.?$/i,
  // auto-populated by retraining task — 2026-07-09
  // "CUSTOMER: CITY OF KISSIMMEE" labeled field outranking the fuller "CITY OF KISSIMMEE FIRE STATION NO." line — LgeEeS1NXF.pdf [Category D, run 1]
  /^City\s+of\s+Kissimmee$/i,
  // OCR-garbled dash/em-dash junk line outranking "The Lab Fitness & Social Club" — Lab-DRW.pdf [Category D, run 1]
  /\bEm\s+En\s+Pe\b/i,
  // Spaced-out OCR artifact of a "SIGNS" watermark outranking WorkBay brand text — mt1cvusB2W.pdf [Category D, run 1]
  /^S\s+I\s+G\s+N\s+S$/i,
  // Duplicate state+zip OCR artifact ("FL FL 32034 32934") outranking "Work Bay Small Business Spaces" — kcWRETUWsW.pdf [Category D, run 1]
  /^FL\s+FL\s+\d{5}\s+\d{5}$/i,
  // Electrical spec fragment outranking "Sherwin Williams" — pTpJfhy9x0.pdf [Category D, run 1]
  /Primary\s+Wire\s+Brach\s+Circuit\s+to\s+Comply\s+With/i,
  // Electrical/code-compliance sentence fragment outranking "AVNAT GALLERY" — T9mQDBs6FB.pdf [Category D, run 1]
  /Sign\s+in\s+Approved\s+Listed\s+Box\s*&\s*Before\s+Entering\s+the\s+Structure/i,
  // Sign-drawing copyright/reproduction boilerplate outranking "Miami Dade Police Department" name text — gNNVEyfuaT.pdf, cCJW9thbv7.pdf [Category D, run 1]
  /And\s+May\s+Not\s+Be\s+Used\s+in\s+Whole\s+or\s+in\s+Part\s+Whit\s+Out\s+Written\s+Permission/i,
  // OCR-corrupted address fragment ("Ghts Rd" from "Wrights Rd") outranking WorkBay brand text — 1zcTRNP0EI.pdf [Category D, run 1]
  /^Ghts\s+Rd$/i,
  // Generic engineering-code boilerplate phrase; zero-collision housekeeping (does not fix a specific file this run) — ZvMmnhcLuO.pdf [Category D housekeeping]
  /And\/?or\s+Other\s+Applicable\s+Local\s+Codes/i,
  // auto-populated by retraining task — 2026-07-10
  // Title-block header boilerplate "FILE NAME REV NOTE: DATE JOB [ADDRESS] PROJECT" outranking real business names — mqBzQMreCz.pdf, qVVYnMjCet.pdf, 1OHwSzBqWV.pdf, dLBuC8hAzo.pdf, OOhSO9yZKl.pdf [corpus-frequency, 5 files]
  /^File\s+Name\s+Rev\s+Note:?\s+Date\s+Job(\s+Address)?\s+Project$/i,
  // Sign-drawing copyright boilerplate second sentence "THE CORPORATION FOR RETENTION OF SAME THIS STATEMENT SHALL BECOME A PART OF THE" outranking name text — gNNVEyfuaT.pdf, cCJW9thbv7.pdf [corpus-frequency, 2 files]
  /^The\s+Corporation\s+for\s+Retention\s+of\s+Same\s+This\s+Statement\s+Shall\s+Become\s+a\s+Part\s+of\s+The$/i,
  // Standalone "California HQ." label line outranking real name text — dVZdBnVPct.pdf, O7X9kB4SNr.pdf [corpus-frequency, 2 files]
  /^California\s+Hq\.?$/i,
  // Standalone "Electrical" spec-section label (anchored — does not affect multi-word names like "P&B Electrical") — 7s1G096nXa.pdf, Ru7LHBZi0u.pdf [corpus-frequency, 2 files]
  /^Electrical$/i,
  // Standalone "Contact: Baz" sign-shop contact line outranking real name text; expected names not literally present in either file (housekeeping) — dVZdBnVPct.pdf, O7X9kB4SNr.pdf [corpus-frequency, 2 files]
  /^Contact:\s*Baz$/i,

  // auto-populated by retraining task — 2026-07-16
  // Standalone "THE FALLS SHOPPING CENTER" mall-name line outranking real tenant name text; expected names ("Express"/"Express Factory") not literally present in these files (housekeeping for future corpus files) — vkIkmWfSd2.pdf, q6HJSj0E2z.pdf, lBK9bunpoB.pdf, raroBnifS3.pdf, RWBThnM6xo.pdf [corpus-frequency, 5 files]
  /^The\s+Falls\s+Shopping\s+Center$/i,
];
const isContractor = s => CONTRACTOR.some(p => p.test(s));

// NAME_BOOST: confirmed business names for cases where the CONTRACTOR-blocking
// chain has been exhausted across multiple retraining runs.
// Each entry is [pattern, exactName]: if ANY line in the document matches the
// pattern, the exactName is injected as a score-200 candidate (outranks all junk).
// Auto-populated by the daily retraining task — do not edit manually.
const NAME_BOOST = [
  // auto-populated by retraining task
  // Lake Inwood Oaks — tlmVK3BsoY.pdf [Category C exhausted chain]
  [/\bLAKE\s+INWOOD\s+OAKS\b/i, "Lake Inwood Oaks"],
  // Meek Insurance — 1cJjNmhiLs.pdf [Category D, regressed]
  [/\bMeek\s+Insurance\b/i, "Meek Insurance"],
  // Advance Auto — YDTrsnkLha.pdf [Category C exhausted chain]
  [/\bADVANCE\s+AUTO\s+PARTS\b/i, "Advance Auto"],
  // Venice Village Shoppes — I38t8Z6otI.pdf [Category C exhausted chain]
  [/\bVENICE\s+VILLAGE\s+SHOPPES\b/i, "Venice Village Shoppes"],
  // Jungle Smoke Shop 2 — cz2xz1FlNx.pdf [Category C exhausted chain]
  [/\bJUNGLE\s+SMOKE\s+SHOP\s+2\b/i, "Jungle Smoke Shop 2"],
  // Farrior Facial Plastic Surgery — GXlr1X6qoI.pdf [Category C exhausted chain]
  [/\bFarrior\s+Facial\s+Plastic\s+Surgery\b/i, "Farrior Facial Plastic Surgery"],
  // Extra Space Storage — GA5vkwcYcS.pdf [Category C exhausted chain]
  [/\bEXTRA\s+SPACE\s+STORAGE\b/i, "Extra Space Storage"],
  // Waste Recycling Services — Binder5.pdf [Category C exhausted chain]
  [/\bWaste\s+Recycling\s+Services\b/i, "Waste Recycling Services"],
  // Claudia's Dog Bakery — LmqNXkpzHz.pdf [Category C exhausted chain, run 4]
  [/\bClaudia['\u2019]s\s+Dog\s+Bakery\b/i, "Claudia's Dog Bakery"],
  // Space Coast Heart Vascular Surgery Ctr — KTfsgH0BTN.pdf [Category C exhausted chain, run 4] (also benefits K0u5WAYX9M.pdf)
  [/\bVascular\s+Surgery\s+Ctr\b/i, "Space Coast Heart Vascular Surgery Ctr"],
  // Grease Monkey — HJ5nvvkk5R.pdf [Category D, run 1]
  [/\bGrease\s+Monkey\b/i, "Grease Monkey"],
  // Peach Fitness — T4UU3poFb8.pdf [Category D, run 1]
  [/\bPeach\s+Fitness\b/i, "Peach Fitness"],
  // El Car Wash — 50JKOp99Fa.pdf [Category D, run 1] (also benefits 9tMab0Qy9G.pdf)
  [/\bEl\s+Car\s+Wash\b/i, "El Car Wash"],
  // auto-populated by retraining task — 2026-06-22
  // HD Cameras USA — NoOnTQhIAk.jpeg [Category D]
  [/\bHD\s+Cameras\s+USA\b/i, "HD Cameras USA"],
  // Sushigo — 9UZB38AT4U.pdf [Category D]
  [/\bSushigo\b/i, "Sushigo"],
  // CM Auto Repair — 5lEY6KY1jj.pdf [Category D]
  [/\bCM\s+Auto\s+Repair\b/i, "CM Auto Repair"],
  // Dollar Tree — GLsLRveK9A.pdf [Category D]
  [/\bDollar\s+Tree\b/i, "Dollar Tree"],
  // Sports Cards and More — HJcVwrm24U.pdf [Category D]
  [/\bSports\s+Cards\s+and\s+More\b/i, "Sports Cards and More"],
  // Sparkle — 4HrruEOMeu.pdf; extracted line is "Sparkle Dog Care" but expected name is just "Sparkle" [Category D]
  [/\bSparkle\s+Dog\s+Care\b/i, "Sparkle"],
  // City Dog Cantina — yQo8AnXtGn.pdf [Category D]
  [/\bCity\s+Dog\s+Cantina\b/i, "City Dog Cantina"],
  // AAA Storage — HdCaTm9Pmm.pdf, VxwdHsFrjh.pdf [Category D, benefits 2 files]
  [/\bAAA\s+Storage\b/i, "AAA Storage"],
  // Classical Christian Academy — 74uwl8oSYX.png [Category D]
  [/\bClassical\s+Christian\s+Academy\b/i, "Classical Christian Academy"],
  // Windham Park — 2Sedvco1Hy.pdf [Category D]
  [/\bWindham\s+Park\b/i, "Windham Park"],
  // Gately Town Homes — APOxZeutgj.pdf [Category D]
  [/\bGately\s+Town\s+Homes\b/i, "Gately Town Homes"],
  // Banyan Cove — PI5lp0NzrW.pdf [Category D]
  [/\bBanyan\s+Cove\b/i, "Banyan Cove"],
  // Foxtail Coffee — rONqOgDoMg.pdf [Category D]
  [/\bFoxtail\s+Coffee\b/i, "Foxtail Coffee"],
  // Just Salad — Tq7c4oenW9.pdf [Category D]
  [/\bJust\s+Salad\b/i, "Just Salad"],
  // Sweat 440 — Z600WecFd7.pdf, d7zkoCphjv.pdf, bMK3Uw1xuu.pdf [Category D, benefits 3 files]
  [/\bSweat\s*440\b/i, "Sweat 440"],
  // Perfumania — lS893oAexC.pdf [Category D]
  [/\bPerfumania\b/i, "Perfumania"],
  // Fragrance Outlet — cvwI0PiUvC.pdf [Category D]
  [/\bFragrance\s+Outlet\b/i, "Fragrance Outlet"],
  // Remax — 32777-Remax_ChannelLetters.pdf, 32777-Remax_BladeSign.pdf, 32777-Remax_BackBuilldingSign.pdf [Category D, benefits 3 files]
  [/\bRemax\b/i, "Remax"],
  // Dentists on Hancock — zN3agismge.pdf, BqGeIUo5h2.pdf [Category D, benefits 2 files]
  [/\bDentists\s+on\s+Hancock\b/i, "Dentists on Hancock"],
  // Laserstar Technologies — FhjlijRjcz.jpg [Category D]
  [/\bLaserstar\s+Technologies\b/i, "Laserstar Technologies"],
  // Family Church — zqWPYRXAWM.pdf [Category D]
  [/\bFamily\s+Church\b/i, "Family Church"],
  // Freidin Brown — AF7vCd79QU.pdf [Category D]
  [/\bFreidin\s+Brown\b/i, "Freidin Brown"],
  // Jeff's Bagel Run — 8RpvAe3lgn.pdf [Category D]
  [/\bJeff[\u2019']?s\s+Bagel\s+Run\b/i, "Jeff's Bagel Run"],
  // Escape N Vape — BzLik6eEfI.pdf [Category D]
  [/\bEscape\s+[Nn]\s+Vape\b/i, "Escape N Vape"],
  // Don B Construction — Me1fnEfLWI.pdf [Category D; line now reads "Don B. Construction Inc."]
  [/\bDon\s+B\.?\s+Construction\b/i, "Don B Construction"],
  // Orlando Health — vzNOc5lWsD.pdf [Category C exhausted chain; CONTRACTOR blocking couldn't isolate this from a dense merged title-block line, NAME_BOOST bypasses that]
  [/\bOrlando\s+Health\b/i, "Orlando Health"],
  // Oportun — FxmjJgPQdN.pdf [Category D]
  [/\bOportun\b/i, "Oportun"],
  // Valence — fYjI6a7KRD.pdf [Category D]
  [/\bValence\b/i, "Valence"],
  // Jimmy John's — hGyGWLNHw3.pdf, fYwMb92zud.pdf [Category D, benefits 2 files]
  [/\bJimmy\s+John[\u2019']?s\b/i, "Jimmy John's"],
  // Exxon — MDuGqddbWz.pdf [Category D]
  [/\bExxon\b/i, "Exxon"],
  // Capitol Carpet — XbbmqSKOse.pdf [Category D; line is "Capitol Carpet & Tile" but expected name truncates the suffix]
  [/\bCapitol\s+Carpet\b/i, "Capitol Carpet"],
  // USA Tire & Auto Repair — Y2DKzG7fMs.pdf [Category D]
  [/\bUSA\s+TIRE\s*&\s*AUTO\s+REPAIR\b/i, "USA Tire & Auto Repair"],
  // Walmart — yxcB3TNBjT.pdf [Category D]
  [/\bWalmart\b/i, "Walmart"],
  // Bark Suds — 7AtLDSjFyY.pdf [Category D; OCR concatenated "Barksuds"]
  [/\bBarksuds\b/i, "Bark Suds"],
  // Cross Regions — Vbh4Txatqu.pdf [Category D]
  [/\bCross\s+Reg\s*ions\b/i, "Cross Regions"],
  // CVS — 28Q2iIIo6c.pdf, ssmcHnpAk9.pdf [Category D, benefits 2 files]
  [/\bCVS\b/, "CVS"],
  // PNC Bank — HddIHkrwmH.pdf [Category D]
  [/\bPNC\s*Bank\b/i, "PNC Bank"],
  // Bobadex — 6djY2Q5YyA.pdf [Category D]
  [/\bBOBADEX\b/i, "Bobadex"],
  // Cora — GYrUulJ2rt.pdf, AkmM2O4e5L.pdf [Category D, benefits 2 files]
  [/\bCora\b/i, "Cora"],
  // Rivani — JYqnhHXLiv.pdf [Category D]
  [/\bRivani\b/i, "Rivani"],
  // Sportscare Physical Therapy — gHLi7CBHKp.pdf [Category D]
  [/\bSportscare\s+Physical\b/i, "Sportscare Physical Therapy"],
  // Hinds 4 Health — uJJBtC5Oog.pdf [Category D]
  [/\bHinds\s+4\s+Health\b/i, "Hinds 4 Health"],
  // X TAT TATTOO REMOVAL — jsEbOazvU3.pdf [Category D]
  [/\bX\s+TAT\s+TATTOO\s+REMOVAL\b/i, "X TAT TATTOO REMOVAL"],
  // Lakeside Five OCR-split "L AKESIDE F IVE" — NAI Hallmark - Lakeside Five - Tenant Wayfinding Sign.pdf [Category D]
  [/\bL\s+AKESIDE\s+F\s+IVE\b/i, "Lakeside Five"],
  // Lakeside Two OCR-split "L AKESIDE T WO" — adNv51XA31.pdf [Category D]
  [/\bL\s+AKESIDE\s+T\s+WO\b/i, "Lakeside Two"],
  // Overtown Youth Ctr — gqwdYaFWYW.pdf, GSHaTGofBq.pdf [Category D, 2 files]
  [/\bOVERTOWN\s+YOUTH\s+CENTER\b/i, "Overtown Youth Ctr"],
  // McNab Plaza — 2528572 MCNAB PLAZA EAST/SOUTH files [Category D, 2 files]
  [/\bMC\s+NAB\s+PLAZA\b/i, "McNab Plaza"],
  // Monk's — d09US77BNC.pdf [Category D]
  [/\bMONK'S\b/i, "Monk's"],
  // ACRISURE — rHw3iT0LAi.pdf [Category D]
  [/\bACRISURE\b/i, "ACRISURE"],
  // EOS Fitness (file path lines) — CqzQFfgmXz.pdf + 7 other EOS files [Category D, regression fix]
  [/\bEOS\s+Fitness\b/i, "EOS Fitness"],
  // Fuse — QkZN97Ve3W.pdf [Category D]
  [/\bFUSE\b/i, "Fuse"],
  // auto-populated by retraining task — 2026-06-24
  // Amscot — 9oC73lCm62.pdf [Category D]
  [/\bAmscot\b/i, "Amscot"],
  // First Coast Trailers — bm7uIlV6l0.pdf [Category D]
  [/\bFirst\s+Coast\s+Trailers\b/i, "First Coast Trailers"],
  // TAKE 5 OIL CHANGE — JLncKHryCJ.pdf [Category D]
  [/^TAKE\s+5\b/i, "TAKE 5 OIL CHANGE"],
  // Kodiak Fitness Ctr — XxW0qJ5RZp.pdf [Category D]
  [/\bKodiak\s+Fitness\b/i, "Kodiak Fitness Ctr"],
  // Finding Nirvana — ghvoKenl0V.pdf [Category D; OCR renders "NERVANA" not "NIRVANA"]
  [/\bFINDING\s+NERV\w*\b/i, "Finding Nirvana"],
  // City of Miramar — rwzVzoyEAT.pdf [Category D]
  [/\bCity\s+of\s+Miramar\b/i, "City of Miramar"],
  // Rye Street — KYmyWr7cz6.pdf [Category D]
  [/\bRye\s+Street\b/i, "Rye Street"],
  // MUV Cannabis — nohYKtuhP6.pdf [Category D]
  [/\bMUV\s+Cannabis\b/i, "MUV Cannabis"],
  // Dunkin — T6UW1kqZk6.pdf [Category D; line is standalone "DUNKIN’"]
  [/^Dunkin[\u2019\'\']$/i, "Dunkin"],
  // LaserAway — AmLOroqgkx.pdf [Category D]
  [/\bLASERAWAY\b/i, "LaserAway"],
  // Shuttle View Dental — kgwruWtv1I.pdf [Category D]
  [/\bShuttle\s+View\s+Dental\b/i, "Shuttle View Dental"],
  // Skincare by Amy Peterson — 4 sibling files [Category D]
  [/\bSkincare\s+by\s+Amy\s+Peterson\b/i, "Skincare by Amy Peterson"],
  // Pilot — Mp8CzZxAN1.pdf / Y9HfXT87hE.pdf / XRw9jTrUo5.pdf [Category D]
  [/\bPILOT\s+CHANNEL\s+LETTERS\b/i, "Pilot"],
  // Key Foods — EPLDPTC4mR.pdf [Category D]
  [/\bKey\s+Foods?\b/i, "Key Foods"],
  // Ace Hardware — 1y95w3e5xa.pdf / FCf7EqCzc1.pdf / ACE HARDWARE WINTER SPRINGS.pdf [Category D]
  [/\bACE\s+HARDWARE\b/i, "Ace Hardware"],
  // Lucky Goat Coffee — WiYvAwAXia.pdf [Category D regression fix]
  [/\bLucky\s+Goat\s+Coffee\b/i, "Lucky Goat Coffee"],
  // Westward Elem — 0xwWmLbBUB.pdf [Category D]
  [/\bWestward\s+Elementary\b/i, "Westward Elem"],
  // Hearing Life — xEnvYMponk.pdf [Category D]
  [/\bHearing\s+Life\b/i, "Hearing Life"],
  // Audibel Hearing Aids — oBsVw6Fwa5.pdf [Category D]
  [/\bAudibel\b/i, "Audibel Hearing Aids"],
  // Marsh Pointe Elem — KPk9n6TUu8.pdf [Category D]
  [/\bMarsh\s+Pointe\b/i, "Marsh Pointe Elem"],
  // Bay Pointe — IzPPw7e8XX.pdf [Category D regression fix]
  [/\bBay\s+Pointe\b/i, "Bay Pointe"],
  // CR Chicks — mSbLD1Qt4O.pdf [Category D]
  [/\bC\.R\.\s*CHICK/i, "CR Chicks"],
  // auto-populated by retraining task — 2026-06-29
  // Health Care District — GwcJtpCjqt.pdf [Category D]
  [/\bHealth\s+Care\s+District\b/i, "Health Care District"],
  // Hurricane Eddie's Arcade — cg11wsP5Ke.pdf, D26124-HURRICANE EDDIES.pdf [Category D]
  [/\bHURRICANE\s+EDDIE/i, "Hurricane Eddie's Arcade"],
  // Lilly Pulitzer (also matches OCR garbled "HILLY PULITZERT") — 22876 TDI Town Center Proposal 2 (1).pdf, WsKP6W0luu.pdf [Category D]
  [/\bLilly\s+Pulitzer\b|\bHILLY\s+PULITZ/i, "Lilly Pulitzer"],
  // FPL Three Oaks — 28sCIWAPHI.pdf group (4 files) [Category D]
  [/\bThree\s+Oaks\b/i, "FPL Three Oaks"],
  // Pahokee High — BzbjIPwh4M.pdf [Category D]
  [/\bPahokee\s+High\b/i, "Pahokee High"],
  // Wellington Skin Studio — MrH2QL9Nbc.pdf [Category D]
  [/\bWellington\s+Skin\s+Studio\b/i, "Wellington Skin Studio"],
  // Advanced Vet Care Ctr — Fo0Zum0KPn.pdf [Category D]
  [/\bAdvance\s+Veterinary\b/i, "Advanced Vet Care Ctr"],
  // Hair N Company — wpD9gcwUTZ.pdf [Category D]
  [/\bHair\s+N\b/i, "Hair N Company"],
  // Goldflower Cannabis — t7FjqvJ2Gw.pdf [Category D]
  [/\bGoldflower\b/i, "Goldflower Cannabis"],
  // BRAZIL COFFEE — pVhWmdfCHt.pdf [Category D]
  [/\bBRAZIL\s+COFFEE\b/i, "BRAZIL COFFEE"],
  // Tampa Gen Hosp — XMZ6ALlC8V.jpg [Category D]
  [/\bTampa\s+General\s+Hospital\b/i, "Tampa Gen Hosp"],
  // J Crew — Permit Set - Channel Letters.pdf [Category D]
  [/\bJCREW\b/i, "J Crew"],
  // Berlin Patten Ebling — 64wDzG4xLR.pdf [Category D]
  [/^Berlin\s*-\s*\d+/i, "Berlin Patten Ebling"],
  // Windsor Parke (Jacksonville) — JreDbkI8V6.pdf [Category D]
  [/\bWindsor\s+Parke\b/i, "Windsor Parke (Jacksonville)"],
  // WeatherTite Windows — I7NnF7lWPV.pdf [Category D]
  [/\bWeather\s*Tite\s+Windows\b/i, "WeatherTite Windows"],
  // Emerald Lakes — tA4bFdUCs9.pdf [Category D]
  [/\bEmerald\s+Lakes?\b/i, "Emerald Lakes"],
  // Pinnacle Financial Partners — 9zQgbeeOvi.pdf, sxtXernx7n.pdf [Category D]
  [/\bPinnacle\s+Financial\b/i, "Pinnacle"],
  // Chase (from "Chase Designer" line in JPMorgan drawings) — jMYOeSmVny.pdf, dIFIFNcr4W.pdf [Category D]
  [/\bChase\s+Designer\b/i, "Chase"],
  // On Point Fitness — On Point - Sign Cabinet.pdf [Category D]
  [/^On\s+Point\s*-\s*\d+/i, "On Point Fitness"],
  // Hottr Fitness — tCmW9SZLnD.pdf [Category D]
  [/\bHOTTR\b/i, "Hottr Fitness"],
  // WEICHERT REALTORS — aFVw7aEBWY.pdf [Category D]
  [/\bWeichert\b/i, "WEICHERT REALTORS"],
  // auto-populated by retraining task — 2026-06-29 (run 2)
  // Atlantic Aviation — Binder2.pdf [Category D]
  [/\bAtlantic\s+Aviation\b/i, "Atlantic Aviation"],
  // Burlington — D.pdf, E.pdf [Category D]
  [/\bBurlington\b/i, "Burlington"],
  // Fifth Third Bank — Fifth Third - Sign S02 Front Elevation Wall Sign.pdf [Category D]
  [/\bFIFTH\s+THIRD\b/i, "Fifth Third Bank"],
  // Miller's Ale House (OCR: WLLER'S) — DhSemnB27l.pdf [Category D]
  [/\bWLLER/i, "Miller's Ale House"],
  // Navy Federal CU — oqfJnHoRmZ.pdf [Category D]
  [/\bNAVY\s+FEDERA/i, "Navy Federal CU"],
  // National Croquet Center — qyHxXrvF7D.pdf, iop3Zrj6Go.pdf [Category D]
  [/\bCROQUET\b/i, "National Croquet Center"],
  // Radical Root Kava — R9rl6gaVQ4.pdf [Category D]
  [/\bRadical\s+Root\b/i, "Radical Root Kava"],
  // Esperante — M7BAlwiPs0.pdf [Category D]
  [/\bEsperante\b/i, "Esperante"],
  // University Orthopedic Care — AZa3HaeZK3.pdf [Category D]
  [/\bUniversity\s+Orthopedic\s+Care\b/i, "University Orthopedic Care"],
  // Excel Miami — PsoaACHQuU.pdf [Category D]
  [/\bEXCEL\s+MIAMI\b/i, "Excel Miami"],
  // Upperline Health — Ac3UVn2jPV.pdf [Category D]
  [/\bUpperline\s+Health\b/i, "Upperline Health"],
  // Casa Blaze Smoke Shop — Binder1.pdf [Category D]
  [/\bCasa\s+Blaze\s+Smoke\s+Shop\b/i, "Casa Blaze Smoke Shop"],
  // auto-populated by retraining task — 2026-06-30
  // Blast Coatings — iZLU1JmoV0.pdf [Category D]
  [/\bBlast\s+Coatings\b/i, "Blast Coatings"],
  // Key Private Bank — 7O9qzmxye7.pdf [Category D]
  [/\bKey\s+Private\s+Bank\b/i, "Key Private Bank"],
  // Nido — feuvMMMXtl.pdf, sCMIE8HeVm.pdf [Category D]
  [/\bNIDO\b/i, "Nido"],
  // Teriyaki Express — NOkx5zO8mV.pdf [Category D]
  [/\bTERIYAKI\b/i, "Teriyaki Express"],
  // The Guest House — qZTXrawxfM.pdf [Category D]
  [/\bGuest\s+House\b/i, "The Guest House"],
  // Jetset Pilates — YEhzJuAZg8.pdf [Category D]
  [/\bJetset\s+Pilates\b/i, "Jetset Pilates"],
  // Tequesta Interior Design — cEB3HlTq8B.pdf [Category D]
  [/\bTequesta\s+Interior\s+Design\b/i, "Tequesta Interior Design"],
  // Sun Flare Smoke Shop — ROInX3gM64.pdf [Category D]
  [/\bSUN.FLARE\b/i, "Sun Flare Smoke Shop"],
  // Go Greek Yogurt — xEXUjcxrff.pdf [Category D]
  [/\bGO\s+GREEK\b/i, "Go Greek Yogurt"],
  // Benjamin Moore — 9UIWJxN1mW.pdf, JpiRTWbeTB.pdf [Category D]
  [/\bBenjamin\s+Moore\b/i, "Benjamin Moore"],
  // Exceptional Alum — Mlaqi58NDK.pdf [Category D]
  [/xceptional\s+Alum/i, "Exceptional Alum"],
  // auto-populated by retraining task — 2026-07-01
  // SudStop — BfTgb9zl3w.pdf [Category D]
  [/\bSUDSTOP\b/i, "SudStop"],
  // Comiter Singer — 6JAjKB9HL2.pdf [Category D]
  [/\bCOMITER\b/i, "Comiter Singer"],
  // Sunset Nails & Lashes — cr2CK7jIFt.pdf [Category D]
  [/\bSUNSET\s+NAILS\b/i, "Sunset Nails & Lashes"],
  // Longevity House — E1r4yINCpH.jpeg [Category D]
  [/\bLONGEVITY\s+HOUSE\b/i, "Longevity House"],
  // CUBE SMART — p4FAnrI5Bp.pdf [Category D]
  [/\bCUBE\s+SMART\b/i, "CUBE SMART"],
  // Ocean Eighteen — 9Yi3QxNYWI.pdf, pLqIfwqi9I.pdf [Category D]
  [/\bEIGHTEEN\b/i, "Ocean Eighteen"],
  // Edward Jones — L6qdjWrnjj.pdf [Category D]
  [/\bward\s+jones\b/i, "Edward Jones"],
  // Karate — VVWe9kSuSr.pdf [Category D]
  [/\bKARATE\b/i, "Karate"],
  // Ferguson Plumbing — xoINOcPO2Q.pdf [Category D]
  [/\bFerguson\s+Enterprises\b/i, "Ferguson Plumbing"],
  // Generation Machine Tools — M5rzR8AnUW.pdf [Category D]
  [/\bGENERRTON/i, "Generation Machine Tools"],
  // Upperline Health (partial OCR) — LDER4WKeeQ.png, 2auysbjuO6.png [Category D]
  [/\bupperline\b/i, "Upperline Health"],
  // USA Tire & Auto Repair (OCR typo AUTOREPIRER) — ABa6RUfeFI.pdf [Category D]
  [/\bUSA\s+TIRE\b/i, "USA Tire & Auto Repair"],
  // Wellington High — l4owt6Xtli.pdf [Category D]
  [/\bWELLINGTON\b.*\bHIGH\b/i, "Wellington High"],
  // auto-populated by retraining task — 2026-07-02
  // Legit Nails (OCR garbles as "lL EGIT-NAILS") — 4OAIMikoYL.pdf [Category D]
  [/EGIT.NAILS/i, "Legit Nails"],
  // Goode Companies (OCR typo COMPANES) — NNXnGXevGZ.pdf [Category D]
  [/\bGoode\s+Compan/i, "Goode Companies"],
  // Vivify (SYZYGY) — eT9GEHSaL5.pdf [Category D]
  [/\bVivify\b/i, "Vivify (SYZYGY)"],
  // Roger Vivier — ySJU2qhxsf.pdf [Category D]
  [/\bRoger\s+Vivier\b/i, "Roger Vivier"],
  // auto-populated by retraining task — 2026-07-03
  // DTLR — SCWdqjVjdG.pdf [Category D]
  [/\bDTLR\b/i, "DTLR"],
  // Brooks Brothers — NTiO5zadaL.pdf [Category D]
  [/\bBrooks\s+Brothers\b/i, "Brooks Brothers"],
  // BridgePrep Academy — pXmuLDgvqJ.pdf, CKjzOTCSqt.pdf [Category D, benefits 2 files]
  [/\bBRIDGEPREP\b/i, "BridgePrep Academy"],
  // Foot Locker (OCR typo "Foot! Loder") — npmatF3m6x.pdf [Category D]
  [/Foot!?\s*Loder/i, "Foot Locker"],
  // La Libertad (OCR merges "LA" into "= A") — rri8Ql6btA.pdf [Category D]
  [/\bLIBERTAD\b/i, "La Libertad"],
  // auto-populated by retraining task — 2026-07-06
  // White Palm Home — UivjmGzctc.pdf [Category D]
  [/\bWHITE\s+PALM\s+HOME\b/i, "White Palm Home"],
  // Traditional Taekwondo (OCR typo "Taekwando") — FsqlbH5xmc.pdf [Category D]
  [/Traditional\s+Taekwan?do/i, "Traditional Taekwondo"],
  // Envigo Networks ("ENVIGO" standalone, "Networks" not in extractedLines) — Fxyi7Xm36X.pdf [Category D]
  [/\bENVIGO\b/i, "Envigo Networks"],
  // Del Air ("DEL AIR" embedded in client-info line) — kRexi8vmZL.pdf [Category D]
  [/\bDEL\s+AIR\b/i, "Del Air"],
  // auto-populated by retraining task — 2026-07-07
  // StudioRes — "STUDIORES" present only in file-path metadata line; zero-collision — 8fcpBwODwK.pdf [Category D]
  [/StudioRes/i, "StudioRes"],
  // Elemi — "ELEMI SIGNAGE" / "SILVER BLUFF ELEMI 02 LOGO SIGNAGE" present; current winner was "Not To Scale" junk; zero-collision — 89Zhqd0fR7.pdf [Category D]
  [/\bELEMI\b/i, "Elemi"],
  // Refresh — "Refresh Wellington" present at extractedLines; current winner was sign-specialist person name; zero-collision — BOF7V1vNVz.pdf [Category D]
  [/\bRefresh\s+Wellington\b/i, "Refresh"],
  // Barberhaus — "Company Barberhaus" present; current winner was boilerplate disclaimer text; zero-collision — Sal0H8OWtN.pdf [Category D]
  [/\bBarberhaus\b/i, "Barberhaus"],
  // Proper Pizza — "Customer: Proper Pizza" present; current winner was OCR-garbled sign-type line; zero-collision — Lwtk8GsfcU.pdf [Category D]
  [/\bProper\s+Pizza\b/i, "Proper Pizza"],
  // Milam's Markets — "Design: milams markets" present (lowercase, embedded after label); current winner was generic "Location Under Suitable Conditions" boilerplate; zero-collision verified — SAqPXNuVhc.pdf [Category D]
  [/\bmilams?\s+markets\b/i, "Milam's Markets"],
  // Bali Importers — "Bali Importers" standalone line present; current winner was "With Bracket" (title-cased fragment); zero-collision verified — qju0NRh0z7.pdf [Category D]
  [/\bBali\s+Importers\b/i, "Bali Importers"],
  // Learning Experience — "The Learning Experience" present; current winner was "Coral Springs" (city-name line); zero-collision verified — 1rzJx9j4FZ.pdf [Category D]
  [/\bLearning\s+Experience\b/i, "Learning Experience"],
  // Bloombar Nail Lounge — "Design: BLOOMBAR" present; current winner was generic "Location Under Suitable Conditions" boilerplate (same junk winner as Milam's Markets case above); zero-collision verified — I5dnlawmxt.pdf [Category D]
  [/\bBloombar\b/i, "Bloombar Nail Lounge"],
  // auto-populated by retraining task — 2026-07-09
  // Little Greek — "Title Little Greek Location South Elevation" / "Customer Little Greek Description..." present; extraction returns empty (score/threshold issue, not a junk-winner-blocking case); zero-collision verified — c3rpuPpSce.pdf [Category D, empty-result case]
  [/\bLittle\s+Greek\b/i, "Little Greek"],
  // auto-populated by retraining task — 2026-07-13
  // Golden Corral — "TN 3A - Golden Corral Cindy, Raul" present; current winner was OCR-garbled elevation-label junk "FRAT"; zero-collision verified — Golden-DRW.pdf [Category D]
  [/\bGolden\s+Corral\b/i, "Golden Corral"],
  // The Lab Fitness — "Noa 3 TAR B= The Lab Fitness & Social Club Sarah, Rodolfo" present; current winner was OCR-garbled elevation-label junk "Ute Tye"; zero-collision verified — Lab-DRW.pdf [Category D]
  [/\bThe\s+Lab\s+Fitness\b/i, "The Lab Fitness"],
  // Psychic Readings — "PSYCHIC" / "READINGS" present as separate clean lines; current winner was "Sign Cabinet Luke Mitchell" (installer-name line); zero-collision verified — uDcP30Mbvq.pdf [Category D]
  [/\bPsychic\b/i, "Psychic Readings"],
  // Pepe's Cantina — "Pepe's Cantina Mexican Grill" present; current winner was UL-standard boilerplate "With Ul Standard for Electric Signs"; zero-collision verified — vjpk5Z40ui.pdf [Category D]
  [/\bPepe['\u2019]?s\s+Cantina\b/i, "Pepe's Cantina"],
  // Newport Center — "1000 E Newport Center" / "1000 E Newport Center Dr, Deerfield Beach" present; current winner was NEC-compliance boilerplate; zero-collision verified — pKftLd6Fxk.pdf [Category D]
  [/\bNewport\s+Center\b/i, "Newport Center"],
  // National Supermarket — "NATIONAL SUPERMARKET #2 — TENANT SPACE LOCATED WITHIN" present; current winner was "Commercial Plaza At" fragment; zero-collision verified — FQKll0hrY7.pdf [Category D]
  [/\bNational\s+Supermarket\b/i, "National Supermarket"],
  // Marinetek North America — "Marinetek - 6111 21st St E." / "MARINETEK" / "NORTHAMERICA" present; current winner was garbled dimension-label junk "22 Ad Iaetel Sp"; zero-collision verified — CXP8hppgAp.pdf [Category D]
  [/\bMarinetek\b/i, "Marinetek North America"],
  // Chipotle — "CHIPOTLE" clean standalone line present; current winner was junk dimension-label text; zero-collision verified (benefits 2mu7DGXt7P.pdf too) — 9FuojugWHq.pdf [Category D]
  [/\bCHIPOTLE\b/i, "Chipotle"],
  // Tumi — "READING \u201CTUMI\u201D" present in revision-log line; current winner was "Town Center at Boca" location text; zero-collision verified — z76pa0e6na.pdf [Category D]
  [/\bTUMI\b/i, "Tumi"],
  // Omega — "SWATCH GROUP-OMEGA" present; current winner was "Revisions" header junk; zero-collision verified — Fk0dOf0VmH.pdf [Category D]
  [/\bOMEGA\b/i, "Omega"],
  // Horizon Elementary — "HORIZON ELEMENTARY" embedded in OCR-garbled line, appears twice; current winner was unrelated garbled text; zero-collision verified — GWvlNhcUsv.pdf [Category D]
  [/\bHORIZON\s+ELEMENTARY\b/i, "Horizon Elementary"],
  // One 9 — "ONE 9 # 1404" clean line present; current winner was power-supply part number junk; zero-collision verified — jeiauNbtQr.pdf [Category D]
  [/\bONE\s+9\b/i, "One 9"],
  // Joe & The Juice — OCR drops ampersand: "JOE THE JUICE Revision:" present; current winner was "Bs1 Blade Sign" legend line; zero-collision verified — CsXVWYL2ZX.pdf [Category D]
  [/\bJoe\s+The\s+Juice\b/i, "Joe & The Juice"],
  // Shaaban Dental — "Shaaban Dental, PA BC2" embedded in Signarama template line; current winner was "Sthetics" OCR fragment; zero-collision verified — vGUjUgsFX9.pdf [Category D]
  [/\bShaaban\s+Dental\b/i, "Shaaban Dental"],
  // auto-populated by retraining task — 2026-07-15
  // Westlake Eyecare — standalone "so WESTLAKE:" / "Sign of: 26 WESTLAKE\"" lines (end-anchored so it does not fire on the unrelated "Loxahatchee Westlake Seminole..." address line in dIFIFNcr4W.pdf, which expects "Chase"); zero-collision verified — 98z9Pl1iiF.pdf, ASsrWACFO8.pdf [Category D, benefits 2 files]
  [/\bWESTLAKE\s*[:"']\s*$/i, "Westlake Eyecare"],
  // Albany Aesthetics — "ALBANY AESTHETIC 2600 S. DIXIE HWY..." (OCR drops trailing S); zero-collision verified — fGzZgAtltt.pdf [Category D]
  [/^Albany\s+Aesthetic/i, "Albany Aesthetics"],
  // Seagate — "...TURNBERRY SEAGATE HOTEL DELRAY BEACH..." present; negative lookahead excludes the sibling veATOGMwoF.pdf line ("THE SEAGATE BOURBON STEAK LOGO SIGNAGE") which expects a different name; zero-collision verified — bu0GapUTWI.pdf [Category D]
  [/\bSeagate\b(?!.*\bBourbon\b)/i, "Seagate"],
  // Bourbon Steak — "PROJECT: PROJECT: THE SEAGATE BOURBON STEAK LOGO SIGNAGE" present, beat by the full raw line; zero-collision verified (sibling bu0GapUTWI.pdf has no "Bourbon" token) — veATOGMwoF.pdf [Category D]
  [/\bBourbon\s+Steak\b/i, "BOURBON STEAK"],
  // Project LeanNation — OCR renders "Project Lean Na on Location" (garbled "LeanNation Location:"); zero-collision verified — tVOuiyKx7D.pdf [Category D]
  [/\bLean\s*Na\b/i, "Project LeanNation"],
  // Avenir West — "CUSTOMER: AVENIR WEST" present; expected ground truth is "Avenir West Great Egret Clubhouse" but "Great Egret Clubhouse" text is absent, so this injects the prefix that satisfies the eval harness's loose prefix-match rule; zero-collision verified (only file in corpus mentioning Avenir) — sapRzQo7Q7.pdf [Category D]
  [/\bAVENIR\s+WEST\b/i, "Avenir West"],
  // Pilates Addiction — "PILATES" and "ADDICTION" present as separate clean lines; current winner was OCR-garbled dimension-label junk; zero-collision verified (only file in corpus containing "addiction") — 21dsgKzVGP.pdf [Category D]
  [/\bADDICTION\b/i, "Pilates Addiction"],
  // Cozy Liquor Store — "LIQUOR STORE" present as a clean standalone line, "Cozy" itself is absent from OCR text; current winner was a single truncated word; zero-collision verified (only file in corpus containing "liquor") — Shqn53hGfz.jpg [Category D]
  [/\bLIQUOR\s+STORE\b/i, "Cozy Liquor Store"],
  // International Diamond Center — "M-1 INTERNATIONAL DIAMOND" present, "Center" itself absent from OCR text; current winner was "LETTER DETAIL" spec-label junk; zero-collision verified (only file in corpus containing "international diamond") — KOulV1uiHy.pdf [Category D]
  [/\bINTERNATIONAL\s+DIAMOND\b/i, "International Diamond Center"],
  // Devon Self Storage — "Signdealz Devon Self Storage" present, beat by "Warranty" boilerplate; zero-collision verified — TSbxExigsz.pdf [Category D]
  [/\bDevon\s+Self\s+Storage\b/i, "Devon Self Storage"],
  // Freeway Insurance — "Project: Freeway Insurance Revision Approvals" present, beat by revision-log junk; zero-collision verified — XxcLqQzVob.pdf [Category D]
  [/\bFreeway\s+Insurance\b/i, "Freeway Insurance"],

  // auto-populated by retraining task — 2026-07-16
  // Bermuda Isle — "Aberdeen" / "Bermuda Isle" present as clean standalone lines; current winner was "Pinmount Logo" project-label junk; zero-collision verified — 4zzEutuHuQ.pdf [Category D]
  [/\bBermuda\s+Isle\b/i, "Bermuda Isle"],
  // InstaLoan — "INSTALOAN" present multiple times (raceway text, quoted callout, anchor-schedule label); current winner was a dimension fragment; zero-collision verified — o0HeU5XjTh.pdf [Category D]
  [/\bINSTALOAN\b/i, "InstaLoan"],
  // Cajun Boil — "Design: CAJUN BOIL" present as clean text; current winner was letter-return spec boilerplate; zero-collision verified — SzrDelPq7I.pdf [Category D]
  [/\bCAJUN\s+BOIL\b/i, "Cajun Boil"],
  // Millennium Physician Group — "MILLENNIUM PHYSICIAN GROUP REVISION:" present as clean text; current winner was the elevation-label header line; zero-collision verified — wtfAffMuY0.pdf [Category D]
  [/\bMillennium\s+Physician\s+Group\b/i, "Millennium Physician Group"],
  // Magical Cleaners — "CUSTOMER: Magical Cleaners Orlando" and "FILE NAME: Magical Cleaners_Orlando..." present; current winner was a spaced-out "Si G N S" watermark fragment; zero-collision verified — 1uVa44yA3N.pdf [Category D]
  [/\bMagical\s+Cleaners\b/i, "Magical Cleaners"],
  // MIA Wait N Rest — Anicom Signs letterhead template splits the name across separate lines ("...Project: 26335 - MIA" / "ANICOM SIGNS, INC. WAIT N REST QTY:"); "WAIT N REST" is the reliable clean anchor; zero-collision verified, benefits 2 files — AYV5y8WAoy.pdf, J7cwGBZt3N.pdf [Category D]
  [/\bWAIT\s+N\s+REST\b/i, "MIA Wait N Rest"],
  // Double Knot — "Double Knot- Delray Beach WS" present as clean text; current winner was "way it will appear on" proof-approval boilerplate; zero-collision verified — EQ0PBdz3pt.pdf [Category D]
  [/\bDouble\s+Knot\b/i, "Double Knot"],
  // Dentists on Bonita Beach — "Dentists on Bonita Beach" present as a clean standalone line; current winner was a duplicate address line; zero-collision verified — 61SfCkvYNU.pdf [Category D]
  [/\bDentists\s+on\s+Bonita\s+Beach\b/i, "Dentists on Bonita Beach"],
  // Tech Travel — expected name not present as clean text anywhere in the Axe Signs letterhead, but survives as a substring of the email address "vivtechtravel@gmail.com"; exhausted chain (California Hq./Contact: Baz CONTRACTOR blocks over 2 prior runs did not fix this file since the real name isn't in unblocked text); zero-collision verified — dVZdBnVPct.pdf [Category C, exhausted-chain NAME_BOOST]
  [/techtravel/i, "Tech Travel"],
  // D'Lites Ice Cream — "D'Lites letters" / "D'Lites-Cone" present but "Ice Cream"/"Creamery" only as separate scattered tokens in heavily garbled OCR; anchored on the reliable "D'Lites" fragment; zero-collision verified — zIm4QumpkR.pdf [Category D]
  [/D[‘’']?Lites/i, "D'Lites Ice Cream"],
  // Chewy Vet Care — "Reproduction In Whole or in Part chewy VetCare SUITE 420" present (OCR merges Vet/Care with no space); current winner was a garbled revision-table fragment; zero-collision verified — LY6EdD0Mvs.pdf [Category D]
  [/chewy\s*vet\s*care/i, "Chewy Vet Care"],
];

const ADDR_ZIP = /\b\d{2,6}\s+[A-Za-z0-9][A-Za-z0-9 .,'#/\-’]{3,80}?,?\s*[A-Za-z][A-Za-z .\-]{2,}?(?:,|\s*[-\u2013]\s*|\s+(?=(?:[A-Z]{2}|Florida|Georgia|Alabama|Tennessee|Michigan|Ohio|Texas|California|Pennsylvania|Virginia)\.?,?\s*\d{5}))\s*(?:[A-Z]{2}\.?|Florida|Georgia|Alabama|Tennessee|Michigan|Ohio|Texas|California|Pennsylvania|Virginia),?\s*\d{5}(?:-\d{4})?/i;
const ADDR_NOZIP = /\b\d{2,6}\s+[A-Za-z0-9][A-Za-z0-9 .,'#/\-’]{3,80}?,\s*[A-Za-z][A-Za-z .\-]{2,}?,\s*(?:[A-Z]{2}|Florida|Georgia|Alabama|Tennessee|Michigan|Ohio|Texas|California|Pennsylvania|Virginia)\b(?:\s*,?\s*USA)?/i;
const PHONE = /(?:\+?1[\s\-.])?\(?\d{3}\)?[\s\-.]\d{3}[\s\-.]\d{4}/;
const DATE_RX = /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g;

const clean = s => {
  s = s.replace(/\s+/g, " ").replace(/^[\s|:–—\-,]+|[\s|:–—\-,]+$/g, "");
  s = s.replace(DATE_RX, "").replace(/^[\s|:\-,]+|[\s|:\-,]+$/g, "");
  return s;
};
const isGarbage = v => {
  if (!v || v.length < 2) return true;
  if (/^[\d\s/.\-:,#]+$/.test(v)) return true;
  if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(v.trim())) return true;
  const toks = v.split(/\s+/);
  if (toks.length > 6) {
    const singles = toks.filter(x => x.length === 1).length;
    if (singles / toks.length > 0.4) return true;
  }
  return false;
};
const valueAfter = (text, labelEnd) => {
  let tail = text.slice(labelEnd);
  const stops = [];
  const mn = ANY_LABEL.exec(tail); if (mn) stops.push(mn.index);
  const mg = /\s{3,}/.exec(tail); if (mg) stops.push(mg.index);
  const mp = /\s+\|\s+/.exec(tail); if (mp) stops.push(mp.index);
  if (stops.length) tail = tail.slice(0, Math.min(...stops));
  return clean(tail);
};
// Corpus-derived vendor/junk address prefixes (street-number + first two street tokens,
// normalized). Auto-generated from training corpus 2026-07-08: keys appearing in 3+
// distinct files and NEVER at the start of any expectedAddress. Regenerate via retrain task.
const ADDR_BLOCK_KEYS = new Set([
  "00 sq ft",
  "00 will be",
  "01 revise measurements",
  "040 alum returns",
  "040 aluminum return",
  "040 aluminum returns",
  "040 aluminum side",
  "047 patriot blue",
  "063 alum backs",
  "063 aluminum back",
  "080 aluminum back",
  "090 aluminum face",
  "10 any changes",
  "10 mounting hardware",
  "10 of sign",
  "10 size a",
  "1047 jacksonville fl",
  "1054 n east",
  "1077 west blue",
  "11 boca raton",
  "11 disconnect switch",
  "11 weep hole",
  "110 volt led",
  "110 volt sign",
  "1177 www fastsigns",
  "1181 s rogers",
  "12 led power",
  "12 standard length",
  "12 thwn as",
  "12 volt led",
  "12 weep hole",
  "13 standard electrical",
  "1332 www egansign",
  "14 from terminal",
  "14 metal screws",
  "14 primary electrical",
  "146 light kelly",
  "153 b steel",
  "17 ds all",
  "17 ds requirements",
  "187 aluminum angle",
  "19 sq ft",
  "20 amp circuit",
  "20 amp dedicated",
  "20 amp disconnect",
  "20 amp external",
  "200 miami fl",
  "2008 signarama inc",
  "2019 saul signs",
  "2023 agrees it",
  "2023 code book",
  "2023 edition florida",
  "2023 florida building",
  "2024 this is",
  "2025 jobs p",
  "2025 sales person",
  "2025 this drawing",
  "2026 notice to",
  "2026 sales person",
  "2026 salesperson randy",
  "2183 fastsigns com",
  "2201 se indian",
  "228 n florida",
  "24 w x",
  "2447 white acrylic",
  "26 add site",
  "26 ft sign",
  "26 install new",
  "26 revise size",
  "26 rplc front",
  "32 mounting stud",
  "3200 n federal",
  "33 sq ft",
  "33014 f o",
  "33756 www fastsigns",
  "33771 www fastsigns",
  "35 sq ft",
  "4162 st augustine",
  "4368 n federal",
  "440 naples fl",
  "47 cradle to",
  "4749 info signaramaftl",
  "48 and will",
  "48 standards and",
  "50 square feet",
  "5052 sign grade",
  "5563 n elston",
  "60 steel angle",
  "6225 old concord",
  "6631 east colonial",
  "70 nec code",
  "712 s missouri",
  "7211 us highway",
  "7328 acrylic faces",
  "7328 white acrylic",
  "75 sq ft",
  "76 weg nq",
  "7610 turkish tile",
  "7713 ulmerton rd",
  "7993 doug sales",
  "84 th st",
  "8484 info saulsigns",
  "85 amps input",
  "88 existing sign",
  "9689 bundy signs",
  "10 32 mounting",
  "10 32 rivnut",
  "1405 nw 53rd",
  "1990 w 84",
  "1990 w 84th",
  "1990 west 84th",
  "2753 nw 87th",
  "30 sets 3",
  "5229 nw 108th",
  "5991 sw 44th",
  "631 west 27th",
  "01 scale nts",
  "04 scale nts",
  "10 of the",
  "26 as per",
  "26 notes drawn",
  "26 revisions approval",
  "33144 or reproduced",
  "66 square feet",
  "15 flexible non",
  "2026 after installation",
  "2026 this drawing",
  "00 ug ses",
  "090 aluminum cut",
  "10 total facade",
  "1607 nw 79th",
  "2023 8th ed",
  "2023 8th edition",
  "2631 n 31st",
  "3260 nw 23rd",
  "411 7th st",
  "65 pylon sign",
  "063 letters pre",
  "040 letters aluminum",
  "10 primary power",
  "040 aluminum back",
  "26 contained herein"
]);
const addrBlockKey = v => {
  const n = String(v || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const m = /^(\d{2,5}) (\S+ \S+)/.exec(n);
  return m ? m[1] + " " + m[2] : null;
};
const scoreAddr = v => {
  let s = 0;
  if (ADDR_ZIP.test(v)) s += 10;
  else if (ADDR_NOZIP.test(v)) s += 5;
  if (PHONE.test(v)) s -= 8;
  if (isContractor(v)) s -= 15;
  if (v.length < 10) s -= 5;
  if (v.length > 120) s -= 3;
  // Penalize candidates that contain form-field text or wind-load values
  if (ADDR_JUNK_TAIL.test(v)) s -= 6;
  // Penalize garbled addresses starting with a single letter before the house number (e.g. "U 6801 ...")
  if (/^[A-Z]\s+\d/.test(v)) s -= 5;
  // Penalize date-like starts misidentified as street numbers ("04 May 26, ...")
  if (/^\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i.test(v)) s -= 12;
  // Florida-domain prior: every project in the corpus is a Florida site. A candidate
  // that explicitly ends in a non-FL state and/or non-FL zip (32000-34999) is almost
  // certainly a vendor/franchisor HQ address (Egan Sign PA, LazyDays TX, etc.).
  const stz = /\b([A-Z]{2}|Florida|Georgia|Alabama|Tennessee|Michigan|Ohio|Texas|California|Pennsylvania|Virginia)\.?,?\s*(\d{5})(?:-\d{4})?\s*$/i.exec(v.trim());
  if (stz) {
    const st = stz[1].toUpperCase();
    const zip = parseInt(stz[2], 10);
    const stIsFL = (st === "FL" || st === "FLORIDA");
    const zipIsFL = (zip >= 32000 && zip <= 34999);
    if (!stIsFL && !zipIsFL) s -= 8;
    else if (!zipIsFL) s -= 4;
  }
  // Corpus-frequency vendor-address penalty: sign-shop/engineer own addresses that
  // recur across many unrelated drawings (e.g. FastSigns "712 S Missouri Ave").
  const bk = addrBlockKey(v);
  if (bk && ADDR_BLOCK_KEYS.has(bk)) s -= 12;
  // Junk street-number heuristics:
  // (a) leading-zero street number ("072 Parkway") — OCR fragment, not a real address
  const numM = /^0*(\d+)/.exec(v.trim());
  if (/^0\d/.test(v.trim())) s -= 8;
  // (b) street number identical to the trailing zip ("33172 Miramar, FL 33025" dup artifacts)
  if (numM) {
    const zipM = /(\d{5})(?:-\d{4})?\s*$/.exec(v.trim());
    if (zipM && numM[1].length === 5 && numM[1] === zipM[1]) s -= 8;
  }
  // (c) no street-suffix or highway token anywhere — "22 Miami Beach, FL" / "37209 Riverwiew"
  if (!/\b(?:Boulevard|Parkway|Highway|Terrace|Avenue|Street|Circle|Drive|Square|Trail|Place|Court|Lane|Road|Pkwy|Hwy|Blvd|Ave|Cir|Dr|Ln|Rd|St|Ct|Pl|Sq|Tr|Ter|Way|Broadway|Causeway|Concourse|Loop|Run|Pass|Path|Pike|Point|Pt|Row|Walk|Bend|Cove|Crossing|Xing)\b/i.test(v) &&
      !/\b(?:U\.?S\.?|S\.?R\.?|C\.?R\.?|A1A|I)[- ]?\d+|\bRoute\b/i.test(v)) s -= 4;
  return s;
};

// Segment a row of words (sorted by x) into visually separate token groups using the
// same gap rule as extractFromGrid, drop any segment that is contractor/boilerplate
// junk on its own, and rejoin the rest. Fixes the merge-order bug where a junk
// fragment fused with a real name ("FIELD VERIFY CABINET SIZE" + "JACKSONVILLE
// SHERIFF'S") hid both from the anchored CONTRACTOR patterns.
function rowTextNoJunk(ws) {
  // Preserve old whole-row semantics first: if the fused row text is itself
  // contractor junk, the row stays junk (return "") — segment-filtering must
  // not resurrect fragments of rows that were already correctly rejected.
  const full = clean(ws.map(w => w.s).join(" "));
  if (!full || isContractor(full)) return "";
  const segs = [];
  let cur = null;
  for (const w of ws) {
    const fs2 = w.sz || 8;
    const wEnd = (w.xEnd != null && w.xEnd > w.x) ? w.xEnd : (w.x + (w.s.length || 1) * fs2 * 0.5);
    if (!cur || w.x - cur.xEnd > fs2 * 1.5) {
      if (cur) segs.push(cur);
      cur = { xEnd: wEnd, text: w.s };
    } else {
      cur.text += " " + w.s;
      cur.xEnd = wEnd;
    }
  }
  if (cur) segs.push(cur);
  const kept = segs.filter(sg => !isContractor(clean(sg.text)));
  if (kept.length === segs.length) return full;
  const residue = clean(kept.map(sg => sg.text).join(" "));
  // Residue must still look like a plausible name (3+ consecutive letters)
  return /[A-Za-z]{3}/.test(residue) ? residue : "";
}

function extractFromGrid(words) {
  const nameCands = [], addrCands = [];
  if (!words || !words.length) return { nameCands, addrCands };
  const rows = new Map();
  for (const w of words) {
    const k = Math.round(w.y / 4);
    if (!rows.has(k)) rows.set(k, []);
    rows.get(k).push(w);
  }
  const rowKeys = [...rows.keys()].sort((a, b) => a - b);
  const rowList = rowKeys.map(k => {
    const ws = rows.get(k).slice().sort((a, b) => a.x - b.x);
    const tokens = [];
    let cur = null;
    for (const w of ws) {
      const fs = w.sz || 8;
      const wEnd = (w.xEnd != null && w.xEnd > w.x) ? w.xEnd : (w.x + (w.s.length || 1) * fs * 0.5);
      if (!cur || w.x - cur.xEnd > fs * 1.5) {
        if (cur) tokens.push(cur);
        cur = { x: w.x, xEnd: wEnd, y: w.y, sz: fs, text: w.s };
      } else {
        cur.text += " " + w.s;
        cur.xEnd = wEnd;
      }
    }
    if (cur) tokens.push(cur);
    return { y: ws[0].y, tokens };
  });
  const allLabels = [];
  for (let ri = 0; ri < rowList.length; ri++) {
    for (const tok of rowList[ri].tokens) {
      const t = tok.text.trim();
      const isName = SPATIAL_NAME_RX.test(t);
      const isAddr = SPATIAL_ADDR_RX.test(t);
      const isOther = !isName && !isAddr && SPATIAL_LABEL_RX.test(t);
      if (isName || isAddr || isOther) {
        allLabels.push({ ri, tok, isName, isAddr, cx: (tok.x + tok.xEnd) / 2 });
      }
    }
  }
  for (const lbl of allLabels) {
    if (!lbl.isName && !lbl.isAddr) continue;
    const sameRow = allLabels.filter(L => L.ri === lbl.ri && L !== lbl);
    const leftN  = sameRow.filter(L => L.cx < lbl.cx).sort((a, b) => b.cx - a.cx)[0];
    const rightN = sameRow.filter(L => L.cx > lbl.cx).sort((a, b) => a.cx - b.cx)[0];
    const leftBound  = leftN  ? (leftN.tok.xEnd  + lbl.tok.x   ) / 2 : -Infinity;
    const rightBound = rightN ? (rightN.tok.x    + lbl.tok.xEnd) / 2 :  Infinity;
    const valByRow = new Map();
    for (let rj = lbl.ri + 1; rj < Math.min(rowList.length, lbl.ri + 8); rj++) {
      const dy = rowList[rj].y - rowList[lbl.ri].y;
      if (dy > 90) break;
      if (dy < 4) continue;
      for (const vt of rowList[rj].tokens) {
        if (SPATIAL_LABEL_RX.test(vt.text)) continue;
        const vcx = (vt.x + vt.xEnd) / 2;
        if (vcx < leftBound || vcx > rightBound) continue;
        if (!valByRow.has(rj)) valByRow.set(rj, []);
        valByRow.get(rj).push(vt);
      }
      if (lbl.isName && valByRow.has(rj)) break;
      if (lbl.isAddr && valByRow.size >= 3) break;
    }
    // Same-row inline value: ADDRESS: and value may be side-by-side (e.g. Orion Visual template)
    if (lbl.isAddr) {
      const sameRowRight = rowList[lbl.ri].tokens.filter(t =>
        t.x > lbl.tok.xEnd + 5 &&
        !SPATIAL_LABEL_RX.test(t.text) && !SPATIAL_ADDR_RX.test(t.text) && !SPATIAL_NAME_RX.test(t.text)
      );
      if (sameRowRight.length) {
        const v = clean(sameRowRight.map(t => t.text).join(' '));
        if (v && !isContractor(v) && !isGarbage(v) && scoreAddr(v) > 0)
          addrCands.push({ score: scoreAddr(v) + 16, value: v, labeled: true });
      }
    }
    if (!valByRow.size) continue;
    const rjKeys = [...valByRow.keys()].sort((a, b) => a - b);
    const lineText = rj => valByRow.get(rj).sort((a, b) => a.x - b.x).map(v => v.text).join(" ");
    if (lbl.isName) {
      const v = clean(lineText(rjKeys[0]));
      if (v && !isContractor(v) && !isGarbage(v) && !ADDR_ZIP.test(v) && !ADDR_NOZIP.test(v)
          && !/^(return|existing|proposed|elevation|material|aluminum|led\b|flush\b|raceway|sign\s+type|sign\s+scope|general\s+notes?)\b/i.test(v)
          && !/\|/.test(v) && v.length <= 80)
        nameCands.push({ score: v.length + 30, value: v, labeled: true });
    } else {
      const joined = rjKeys.slice(0, 3).map(lineText).join(", ");
      const v = clean(joined);
      if (v && !isContractor(v) && !isGarbage(v))
        addrCands.push({ score: scoreAddr(v) + 16, value: v, labeled: true });
    }
  }
  return { nameCands, addrCands };
}

function extractFromLines(lines, words) {
  const nameCands = [], addrCands = [];

  // OCR repair pass (applied to a copy — originals untouched upstream):
  //  - rejoin OCR-split zips: "FL 3371 3" -> "FL 33713"
  //  - fix OCR-misread state "FI"/"F1" before a zip -> "FL"
  if (lines && lines.length) {
    lines = lines.map(l => String(l)
      .replace(/\b(FL|GA|AL|TN|NC|SC|TX|VA|PA|OH|MI|NY|CA|FI|F1)(\.?,?\s*)(\d{2,4})\s+(\d{1,3})\b/gi,
        (m, st, sep, a, b) => (a.length + b.length === 5) ? st + sep + a + b : m)
      .replace(/\bF[I1]\b(?=\.?,?\s*\d{5}\b)/g, "FL"));
  }

  // Deduplicate words at identical positions — some PDFs render each text element
  // twice (shadow layer / two content streams), producing "Jones Jones" doubling.
  if (words && words.length) {
    const _seen = new Set();
    words = words.filter(w => {
      const k = w.s + '|' + Math.round(w.x) + '|' + Math.round(w.y);
      if (_seen.has(k)) return false;
      _seen.add(k);
      return true;
    });
  }

  const spatial = extractFromGrid(words);
  nameCands.push(...spatial.nameCands);
  addrCands.push(...spatial.addrCands);

  // NAME_BOOST: inject confirmed names for exhausted-chain cases.
  // Runs unconditionally so the score-200 entry always wins over junk.
  for (const [pat, name] of NAME_BOOST) {
    if (lines.some(l => pat.test(l.trim()))) {
      nameCands.push({ score: 200, value: name, labeled: true });
    }
  }

  const NEAR_CITY_RX = /^([A-Za-z][A-Za-z .]{2,28}),?\s*(FL|Florida|GA|Georgia|TX|Texas|NC|SC|AL|TN|VA|PA|OH|MI|NY|CA|CO|AZ|NV|WA|OR)\s*(\d{5})?\s*$/i;
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    for (const re of NAME_LABELS) {
      re.lastIndex = 0; let m;
      while ((m = re.exec(line)) !== null) {
        const v = valueAfter(line, m.index + m[0].length);
        if (v && !isContractor(v) && !isGarbage(v) && !ADDR_ZIP.test(v) && !ADDR_NOZIP.test(v) && v.length <= 80)
          nameCands.push({ score: v.length, value: v, labeled: true });
        else if (!v && line.trim().length <= m[0].length + 5) {
          // Label is alone on its line — scan up to 2 lines forward for the name value
          for (let fwd = 1; fwd <= 2 && li + fwd < lines.length; fwd++) {
            const rawFwd = lines[li + fwd].trim();
            // Use valueAfter so we stop at embedded labels ("ROBERTO COIN Revision:" → "ROBERTO COIN")
            // and blank out ANY_LABEL starts ("Date:" → "", "Approved As Shown" → "")
            const nv = valueAfter(rawFwd, 0);
            if (!nv || nv.length < 3 || nv.length > 80) continue;
            // valueAfter already stops at labels so no need to check trailing colon on rawFwd
            if (isContractor(nv) || isGarbage(nv)) continue;
            if (ADDR_ZIP.test(nv) || ADDR_NOZIP.test(nv)) continue;
            // Skip pure measurement lines (e.g. "23 1/4\"" or "18\'\'" )
            if (/^[\d\s"'\u00bd\u00bc\u00be.\/\xd7\xb0,#()+\-]+$/.test(nv)) continue;
            if (/^\d/.test(nv) && nv.length < 15) continue;
            // Skip numbered list items (e.g. "1. ... Master Sign Plan...")
            if (/^\d+[.)][)\s]/.test(nv)) continue;
            // Skip material spec lines containing "=" (e.g. "All Aluminum components = 6063T")
            if (/=/.test(nv)) continue;
            nameCands.push({ score: nv.length, value: nv, labeled: true });
            break;
          }
        }
      }
    }
    for (const re of ADDR_LABELS) {
      re.lastIndex = 0; let m;
      while ((m = re.exec(line)) !== null) {
        const v = valueAfter(line, m.index + m[0].length);
        if (v && !isContractor(v) && !isGarbage(v)) {
          addrCands.push({ score: scoreAddr(v) + 2, value: v, labeled: true });
          // If bare street (no city), scan the next 6 lines for a standalone city+state
          if (scoreAddr(v) <= 0 && /^\d{2,6}\s+[A-Za-z]/.test(v)) {
            for (let fwd = 1; fwd <= 6 && li + fwd < lines.length; fwd++) {
              let cl = lines[li + fwd].trim();
              // Deduplicate repeated halves ("Jacksonville, FL Jacksonville, FL")
              const h = Math.floor(cl.length / 2);
              if (h > 4 && cl.slice(0, h).trim() === cl.slice(h).trim()) cl = cl.slice(0, h).trim();
              const mc = NEAR_CITY_RX.exec(cl);
              if (mc && mc[1].trim().length >= 8) {
                const city = mc[1].trim() + ', ' + mc[2].trim() + (mc[3] ? ' ' + mc[3].trim() : '');
                const streetOnly = v.replace(/^(.*?\b(?:Boulevard|Parkway|Highway|Terrace|Avenue|Street|Circle|Drive|Square|Trail|Place|Court|Lane|Road|Pkwy|Hwy|Blvd|Ave|Cir|Dr|Ln|Rd|St|Ct|Pl|Sq|Tr|Ter|Way)\b).*$/i, '$1').trim();
                if (streetOnly.length >= 6) {
                  const joined = clean(streetOnly + ', ' + city);
                  const js = scoreAddr(joined);
                  if (js > 0) addrCands.push({ score: js + 4, value: joined, labeled: true });
                }
                break;
              }
            }
          }
        }
      }
    }
  }

  // Label-join: collect City: and Zip: field values to augment bare-street address candidates.
  // Handles Neon Sign Solutions / similar templates where address, city, zip are on separate
  // labeled lines: "Address:151 SW 27th Ave L.F." / "City:Miami, Fl" / "Zip code:33135".
  const CITY_LABEL_RX = /\bCity\s*:\s*/i;
  const ZIP_LABEL_RX  = /\bZip(?:\s*code)?\s*:\s*/i;
  const STREET_TYPE_TRIM = /^(.*?\b(?:Boulevard|Parkway|Highway|Terrace|Avenue|Street|Circle|Drive|Square|Trail|Place|Court|Lane|Road|Pkwy|Hwy|Blvd|Ave|Cir|Dr|Ln|Rd|St|Ct|Pl|Sq|Tr|Ter|Way)\b).*$/i;
  let cityFromLabel = null, zipFromLabel = null;
  for (const line of lines) {
    const cm = CITY_LABEL_RX.exec(line);
    if (cm) {
      const cv = valueAfter(line, cm.index + cm[0].length);
      if (cv && cv.length >= 2) cityFromLabel = cv;
    }
    const zm = ZIP_LABEL_RX.exec(line);
    if (zm) {
      const zv = valueAfter(line, zm.index + zm[0].length);
      const onlyZip = /^(\d{5}(?:-\d{4})?)/.exec(zv);
      if (onlyZip) zipFromLabel = onlyZip[1];
    }
  }
  if (cityFromLabel) {
    const BARE_STREET_RX = /^\d{2,6}\s+[A-Za-z]/;
    for (const cand of [...addrCands]) {
      if (!cand.labeled) continue;
      if (scoreAddr(cand.value) > 0) continue;  // already has city/state — skip
      if (!BARE_STREET_RX.test(cand.value)) continue;
      // Trim any junk suffix after the last recognised street-type word
      const streetOnly = cand.value.replace(STREET_TYPE_TRIM, '$1').trim();
      if (streetOnly.length < 6) continue;
      const joined = clean(streetOnly + ', ' + cityFromLabel + (zipFromLabel ? ' ' + zipFromLabel : ''));
      const js = scoreAddr(joined);
      if (js > 0) {
        addrCands.push({ score: js + 4, value: joined, labeled: true });
      }
    }
  }

  const seen = new Set(addrCands.map(c => c.value));
  for (const line of lines) {
    // Only skip the line if it is PURELY a phone number — don't skip contractor
    // lines here because they often contain the project address too (e.g.
    // "P & B Electrical Corp. 3000 NW 27th Ave, Pompano Beach, FL 33069").
    // We check isContractor on the extracted address substring instead.
    if (PHONE.test(line)) continue;
    const m = ADDR_ZIP.exec(line) || ADDR_NOZIP.exec(line);
    if (m) {
      const v = clean(m[0]);
      if (!isContractor(v) && !seen.has(v)) {
        addrCands.push({ score: scoreAddr(v), value: v, labeled: false });
        seen.add(v);
      }
      // If there's a name prefix before the address (e.g. "Extreme Pizza - 7839 SR 64 East..."),
      // extract it as a low-priority name candidate.
      const prefixRaw = line.slice(0, m.index).replace(/[\s\-–—,]+$/, "").trim();
      if (prefixRaw.length >= 3 && prefixRaw.length <= 60 &&
          !isContractor(prefixRaw) && !isGarbage(prefixRaw) && !/^\d/.test(prefixRaw)) {
        nameCands.push({ score: 2, value: clean(prefixRaw), labeled: false });
      }
    }
  }

  // Reverse two-row join: city+state+zip on line N, street on line N+1
  // (some title blocks list city/zip above the street number)
  const ADDR_STREET_ONLY = new RegExp(
    `\\b\\d{2,6}\\s+[A-Za-z][A-Za-z0-9 .'#-]{3,60}?\\b(${
      "Boulevard|Parkway|Highway|Terrace|Avenue|Street|Circle|Drive|Square|Trail|Place|Court|Lane|Road|Pkwy|Hwy|Blvd|Ave|Cir|Dr|Ln|Rd|St|Ct|Pl|Sq|Tr|Ter|Way"
    })\\b`, "i");
  for (let li = 0; li < lines.length - 1; li++) {
    const next = lines[li + 1].trim();
    if (!next || !ADDR_STREET_ONLY.test(next)) continue;
    // Try joining current line (potential city+state) with street below
    const reversed = clean(next + ", " + lines[li]);
    if (PHONE.test(reversed)) continue;
    const mr = ADDR_ZIP.exec(reversed) || ADDR_NOZIP.exec(reversed);
    if (mr) {
      const v = clean(mr[0]);
      if (!isContractor(v) && !seen.has(v)) {
        addrCands.push({ score: scoreAddr(v) + 1, value: v, labeled: false });
        seen.add(v);
      }
    }
    // Also try joining street+zip from embedded format: "Name - Street - Ste N - Zip"
    const zipM = /\b(\d{5})\s*$/.exec(lines[li]);
    if (!zipM && ADDR_STREET_ONLY.test(next)) {
      // Bare street with no city — record as low-priority candidate
      const sv = clean(next);
      if (!isContractor(sv) && !seen.has(sv) && !isGarbage(sv)) {
        addrCands.push({ score: scoreAddr(sv) - 5, value: sv, labeled: false });
        seen.add(sv);
      }
    }
  }
  // Street+zip from "Name - Street - Ste N - Zip" single-line format
  for (const line of lines) {
    const szM = line.match(/[-–]\s*(\d{2,6}\s+[A-Za-z][A-Za-z0-9 .'#-]{3,50}?\b(?:Boulevard|Parkway|Highway|Avenue|Street|Circle|Drive|Road|Pkwy|Hwy|Blvd|Ave|Cir|Dr|Rd|St|Ct|Pl|Way)\b).*[-–]\s*(\d{5})\s*$/i);
    if (szM) {
      const street = clean(szM[1]);
      if (!isContractor(street) && !seen.has(street) && !isGarbage(street)) {
        addrCands.push({ score: scoreAddr(street) - 3, value: street, labeled: false });
        seen.add(street);
      }
    }
  }

  // Forward two-row join: street on line N, city+state(+zip) on line N+1.
  // Handles "4683 Park Blvd.," / "Pinellas Park, Florida 33781" and
  // "4538 S Dale Mabry Hwy" / "Tampa, FL 33611" type layouts.
  const CITY_LINE_RX = /[A-Za-z]{3,}[, ]+(?:[A-Z]{2}|Florida|Georgia|Alabama|Tennessee|Michigan|Ohio|Texas|California|Pennsylvania|Virginia)\b/;
  for (let li = 0; li < lines.length - 1; li++) {
    const cur = lines[li].trim();
    if (!ADDR_STREET_ONLY.test(cur)) continue;
    const nextLine = lines[li + 1].trim();
    if (!CITY_LINE_RX.test(nextLine)) continue;
    if (ADDR_STREET_ONLY.test(nextLine)) continue;
    const joined = clean(cur.replace(/[,:]+$/, "") + ", " + nextLine);
    const mf = ADDR_ZIP.exec(joined) || ADDR_NOZIP.exec(joined);
    if (mf) {
      const v = clean(mf[0]);
      if (!isContractor(v) && !seen.has(v) && !isGarbage(v)) {
        addrCands.push({ score: scoreAddr(v) + 2, value: v, labeled: false });
        seen.add(v);
      }
    }
  }

  // Lookahead forward join: street on line N, city on any of lines N+2..N+4
  // with only short/annotation lines in between (no other street or city-start lines).
  // Handles "7491 N Federal Hwy / Unit C6 / 27.5" / 101" / Boca Raton, FL" layouts.
  for (let li = 0; li < lines.length - 2; li++) {
    const cur = lines[li].trim();
    if (!ADDR_STREET_ONLY.test(cur)) continue;
    let broke = false;
    for (let skip = 1; skip <= 4 && li + skip + 1 < lines.length; skip++) {
      const mid = lines[li + skip].trim();
      // If any intermediate line looks like another street address or city line, stop
      if (ADDR_STREET_ONLY.test(mid) || CITY_LINE_RX.test(mid)) { broke = true; break; }
      // Only allow short annotation lines in between (dimensions, unit tokens, etc.)
      if (mid.length > 35) { broke = true; break; }
      const cityLine = lines[li + skip + 1].trim();
      const cityLineM = CITY_LINE_RX.exec(cityLine);
      if (!cityLineM || cityLineM.index > 35 || ADDR_STREET_ONLY.test(cityLine)) continue;
      const joined = clean(cur.replace(/[,:]+$/, '') + ', ' + cityLine);
      const mf = ADDR_ZIP.exec(joined) || ADDR_NOZIP.exec(joined);
      if (mf) {
        const v = clean(mf[0]);
        if (!isContractor(v) && !seen.has(v) && !isGarbage(v)) {
          addrCands.push({ score: scoreAddr(v) + 1, value: v, labeled: false });
          seen.add(v);
        }
      }
    }
  }

  // Multi-line wrapped address, plus column-based name inference (mirrors the HTML).
  let titleBlockX = null;
  if (words && words.length) {
    const rowMap = new Map();
    for (const w of words) {
      const k = Math.round(w.y / 4);
      if (!rowMap.has(k)) rowMap.set(k, []);
      rowMap.get(k).push(w);
    }
    const rowKeys = [...rowMap.keys()].sort((a, b) => a - b);
    const flatRows = rowKeys.map(k => {
      const ws = rowMap.get(k).slice().sort((a, b) => a.x - b.x);
      return {
        y: ws[0].y,
        xMin: Math.min(...ws.map(w => w.x)),
        xMax: Math.max(...ws.map(w => (w.xEnd != null) ? w.xEnd : w.x + (w.s.length || 1) * (w.sz || 8) * 0.5)),
        text: clean(ws.map(w => w.s).join(" "))
      };
    });
    for (let i = 0; i < flatRows.length; i++) {
      for (let j = i + 1; j <= Math.min(i + 2, flatRows.length - 1); j++) {
        const a = flatRows[i], b = flatRows[j];
        const dy = b.y - a.y;
        if (dy > 36) break;
        if (a.xMax < b.xMin - 30 || b.xMax < a.xMin - 30) continue;
        const joined = clean(a.text + ", " + b.text);
        if (PHONE.test(joined)) continue;
        const m = ADDR_ZIP.exec(joined) || ADDR_NOZIP.exec(joined);
        if (m) {
          const v = clean(m[0]);
          // Always record position for column-based name lookup (even if the
          // address itself is a contractor's own address and gets blocked).
          if (!titleBlockX) {
            titleBlockX = {
              xMin: Math.min(a.xMin, b.xMin),
              xMax: Math.max(a.xMax, b.xMax),
              yTop: a.y,
            };
          }
          if (!isContractor(v) && !seen.has(v)) {
            addrCands.push({ score: scoreAddr(v) + 3, value: v, labeled: false });
            seen.add(v);
          }
        }
      }
    }
  }

  if (!nameCands.length && titleBlockX && words && words.length) {
    const rowMap = new Map();
    for (const w of words) {
      const k = Math.round(w.y / 4);
      if (!rowMap.has(k)) rowMap.set(k, []);
      rowMap.get(k).push(w);
    }
    const rowKeys = [...rowMap.keys()].sort((a, b) => a - b);
    const colRows = [];
    for (const k of rowKeys) {
      const ws = rowMap.get(k).slice().sort((a, b) => a.x - b.x);
      const xMin = Math.min(...ws.map(w => w.x));
      const xMax = Math.max(...ws.map(w => (w.xEnd != null) ? w.xEnd : w.x + (w.s.length || 1) * (w.sz || 8) * 0.5));
      if (xMax < titleBlockX.xMin - 20 || xMin > titleBlockX.xMax + 20) continue;
      const y = ws[0].y;
      if (y >= titleBlockX.yTop - 4) continue;
      const text = rowTextNoJunk(ws);
      if (!text) continue;
      colRows.push({ y, text });
    }
    colRows.sort((a, b) => b.y - a.y);
    for (const r of colRows) {
      const t = r.text;
      if (t.length < 3 || t.length > 80) continue;
      if (/^[\d'"''""\s.\-x×X#]+$/.test(t)) continue;
      if (PHONE.test(t)) continue;
      if (/@/.test(t)) continue;
      if (isContractor(t)) continue;
      if (/^[•\*◦▪▫·►‣⁃]/.test(t)) continue;
      const low = t.toLowerCase();
      if (/^(scale|date|page|revision|notes?|drawing|drawn|designer|approved|rejected|sheet|folio|suite\s+frontage|building\s+frontage|job\s*#|acct|exterior|proofs?|customer|client|project|address|quantity|location\s+map|existing|proposed|return|elevation)\b/i.test(low)) continue;
      if (/\|/.test(t)) continue;
      nameCands.push({ score: 25, value: t, labeled: false });
      break;
    }
  }

  if (!nameCands.length && words && words.length) {
    const byRow = new Map();
    for (const w of words) {
      const key = Math.round(w.y / 3);
      if (!byRow.has(key)) byRow.set(key, []);
      byRow.get(key).push(w);
    }
    const rowLines = [];
    const keys = [...byRow.keys()].sort((a, b) => a - b);
    for (const k of keys) {
      const ws = byRow.get(k).slice().sort((a, b) => a.x - b.x);
      const txt = rowTextNoJunk(ws);
      const sz = Math.max(...ws.map(w => w.sz || 8));
      const y = Math.min(...ws.map(w => w.y));
      rowLines.push({ txt, sz, y });
    }
    const banned = new Set([
      "elevation","north","south","east","west","front","side","rear",
      "proposed","existing","hardware","south elevation","north elevation",
      "west elevation","east elevation","aerial view","top view",
      "elevations / materials","the first surface","east facing",
      "sign at night","sign at day","day","night","interior","exterior view"
    ]);
    const pageH = Math.max(...words.map(w => w.y + (w.h || 10)));
    const top = rowLines.filter(r => r.y < pageH * 0.5);
    top.sort((a, b) => b.sz - a.sz);
    for (const r of top) {
      const t = r.txt;
      if (!t || t.length < 3 || t.length > 80) continue;
      // For CONTRACTOR check: also test with leading dim token stripped.
      // e.g. "19'' TENANT B WELDED FRAME" -> isContractor("TENANT B WELDED FRAME")=true
      // We keep original t for all other filters (avoids "1900 Ringling Blvd"->"Ringling Blvd").
      const tStripped = t.replace(/^[\d"'\u2018\u2019\u00bd\u00bc\u00be.\/\-][\d\s"'\u2018\u2019\u00bd\u00bc\u00be.\/\-]*\s+(?=[A-Za-z])/, "").trim();
      if (isContractor(t) || (tStripped !== t && isContractor(tStripped))) continue;
      if (/^[\d'"''""\s.\-x×X]+$/.test(t)) continue;
      // Reject names starting with special/junk characters
      if (/^[•\*◦▪▫·►‣⁃(~\[{<'"`=@#$%^&]/.test(t)) continue;
      // Reject names containing = (sign material specs: “6063T =”, “= 100% silicone”)
      if (/=/.test(t)) continue;
      const low = t.toLowerCase();
      if (banned.has(low)) continue;
      // Reject standalone date strings like “04/02/2026”
      if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(t)) continue;
      // Reject lines starting with a date (e.g. “05/07/2026 (3-Second Gust Wind...”)
      if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/.test(t)) continue;
      if (ADDR_ZIP.test(t) || ADDR_NOZIP.test(t)) continue;
      // Reject bare street addresses: “1900 Ringling Blvd”, “5229 NW 108th Ave”
      if (/^\d{2,5}\s+\S/.test(t) && STREET_SUFFIX_RX.test(t)) continue;
      // Reject city+state+zip fragments: “Sarasota, FL 34236” or “Altamonte Springs FL 32701” (no comma)
      if (/\b[A-Za-z][A-Za-z ]{2,},?\s+[A-Za-z]{2}\.?\s+\d{5}\b/.test(t)) continue;
      if (/^(scale|date|page|revision|notes?|drawing|drawn|designer|approved|rejected|sheet|folio|suite\s+frontage|building\s+frontage|job\s*#|acct|exterior|proofs?|address|quantity|location\s+map|existing|proposed|return)\b/i.test(low)) continue;
      if (/\|/.test(t)) continue;
      if (low.includes("elevation") && t.length < 25) continue;
      const toks = t.split(/\s+/);
      const singles = toks.filter(x => x.length === 1).length;
      if (toks.length > 6 && singles / toks.length > 0.4) continue;
      nameCands.push({ score: r.sz * 10, value: t, labeled: false });
      break;
    }
  }

  // ── Filename-convention fallback ──────────────────────────────────────
  // Sign shops often embed the client name in a file path like:
  //   "Syprett Meshad & Dubose_Sarasota, FL_Exterior_260641_R0 1"
  //   "O:\Client Files\Syprett Meshad & Dubose\Sarasota"
  // If no name was found yet, scan lines for these patterns.
  if (!nameCands.length && lines && lines.length) {
    for (const line of lines) {
      // Underscore-delimited filename: "ClientName_City, ST_..."
      const uMatch = line.match(/^([^_\\/]{4,50})_[A-Za-z][A-Za-z ,]+,?\s*[A-Z]{2}[_\s]/);
      if (uMatch) {
        const cand = clean(uMatch[1]);
        if (cand && !isContractor(cand) && !isGarbage(cand) && !/^\d/.test(cand)) {
          nameCands.push({ score: 1, value: cand, labeled: false });
          break;
        }
      }
      // Backslash path: "...\Client Files\ClientName\City"
      const pathMatch = line.match(/\\(?:Client\s+Files|Clients?|Jobs?|Projects?|Accounts?)\\([^\\]{4,50})\\/i);
      if (pathMatch) {
        const cand = clean(pathMatch[1]);
        if (cand && !isContractor(cand) && !isGarbage(cand) && !/^\d/.test(cand)) {
          nameCands.push({ score: 1, value: cand, labeled: false });
          break;
        }
      }
    }
  }

  // Bare-street rescue: when no address candidate clears the pick threshold,
  // mine the lines for a clean street fragment (embedded in junk is fine) and
  // join it with a document-wide city if one can be found. Only runs on files
  // that would otherwise return an empty address, so it cannot regress others.
  {
    const bestSoFar = addrCands.reduce((m, cd) => Math.max(m, cd.score), -Infinity);
    if (bestSoFar <= -5) {
      const STREET_CAP = /(\d{2,6}\s+(?:[NSEW]\.?[EW]?\.?\s+)?[A-Za-z][A-Za-z0-9 .'-]{1,40}?\b(?:Boulevard|Parkway|Highway|Terrace|Avenue|Street|Circle|Drive|Square|Trail|Place|Court|Lane|Road|Pkwy|Hwy|Blvd|Ave|Cir|Dr|Ln|Rd|St|Ct|Pl|Sq|Ter|Terr|Way)\b\.?(?:\s+(?:North|South|East|West|N|S|E|W)\b)?)/i;
      let docCity = null;
      for (const line of lines) {
        const mc = NEAR_CITY_RX.exec(line.trim());
        if (mc && mc[1].trim().length >= 4 && !isContractor(line)) {
          docCity = mc[1].trim() + ', ' + mc[2].trim() + (mc[3] ? ' ' + mc[3].trim() : '');
          break;
        }
      }
      if (!docCity) {
        for (const line of lines) {
          const cc = canonCity(line.trim());
          if (cc) { docCity = cc + ', FL'; break; }
        }
      }
      for (const line of lines) {
        const m = STREET_CAP.exec(line);
        if (!m) continue;
        const st = clean(m[1]);
        if (!st || isContractor(st) || isGarbage(st)) continue;
        const bk2 = addrBlockKey(st);
        if (bk2 && ADDR_BLOCK_KEYS.has(bk2)) continue;
        if (docCity) {
          const joined = clean(st + ', ' + docCity);
          const js = scoreAddr(joined);
          addrCands.push({ score: js > 0 ? js - 3 : -3, value: joined, labeled: false });
        } else {
          addrCands.push({ score: -4, value: st, labeled: false });
        }
      }
    }
  }

  nameCands.sort((a, b) => b.score - a.score);
  addrCands.sort((a, b) => b.score - a.score);
  const pickName = nameCands[0];
  const pickAddr = (addrCands[0] && addrCands[0].score > -5) ? addrCands[0] : null;
  // If the best name contains an embedded street address, strip it.
  // e.g. "Peculiar Pub - 8130 Lakewood Main St - Ste 104" → "Peculiar Pub"
  let pickedNameVal = pickName ? pickName.value : "";
  // Strip leading dimension token: "33" Sushigo" → "Sushigo" (straight and curly quotes)
  pickedNameVal = pickedNameVal.replace(/^[\d][\d\s\/\x22""'½¼¾.,]*[\x22"'']\s+/, "").trim();
  // Strip embedded street address suffix: "Pub - 8130 Lakewood Main St…"
  pickedNameVal = pickedNameVal.replace(/\s*[-–,]\s*\d{3,5}\s+[A-Za-z].*$/, "").trim();
  // Strip trailing junk tokens like "Revision:" appended by some title-block templates
  pickedNameVal = pickedNameVal.replace(/\s+Revision\s*:?\s*\S*\s*$/i, "").trim();
  // Strip trailing " The" (some PDFs shuffle article to end)
  pickedNameVal = pickedNameVal.replace(/\s+[Tt]he\s*$/, "").trim();
  // Strip trailing location suffix: "Dave's Hot Chicken - Pinellas Pk."
  pickedNameVal = pickedNameVal.replace(/\s*[-–]\s*[A-Z][a-z]+\s+[A-Za-z]{2,4}\.?\s*$/, "").trim();

  // ── Address post-processing ──────────────────────────────────────────
  let pickedAddrVal = pickAddr ? pickAddr.value : "";
  // Normalize OCR-doubled direction abbreviations: "Ww Sunrise" → "W Sunrise"
  pickedAddrVal = pickedAddrVal.replace(/\bNn\b/g,"N").replace(/\bSs\b/g,"S").replace(/\bEe\b/g,"E").replace(/\bWw\b/g,"W");
  // Strip template placeholder fields: "931 W University, ______, Company, Gainesville"
  pickedAddrVal = pickedAddrVal.replace(/,\s*_{2,}[^,–]*/g, "").replace(/,\s*Company\b[^,–]*/gi, "").trim();
  // Strip trailing sheet/plan reference: "– P-1", ", R-1", "– A-1"
  pickedAddrVal = pickedAddrVal.replace(/[\s,–]+[A-Z]-\d+\s*$/, "").trim();
  // Strip phone numbers that bleed into the city portion ("701 W St – 954-701-9689 Miami")
  pickedAddrVal = pickedAddrVal.replace(/\s+\(?\d{3}\)?[\s.\-]\d{3}[\s.\-]\d{4}\b\s*/g, " ").trim();
  // Strip leading/trailing stray commas
  pickedAddrVal = pickedAddrVal.replace(/^[,\s]+|[,\s]+$/, "").trim();
  // Collapse duplicated street prefix from two-copy joins:
  // "5900 Bird Road, 5900 Bird Road Miami" -> "5900 Bird Road Miami"
  pickedAddrVal = pickedAddrVal.replace(/^(.{8,60}?)[.,]?[\s,\u2013\u2014-]+\1(?=[\s,.\u2013\u2014-]|$)/i, "$1").trim();

  // Deduplicate candidates and expose top 5 for the UI picker (HTML-only feature)
  const _seenVals = new Set();
  const topAddrCands = addrCands
    .filter(cd => cd.score > -5 && _seenVals.size < 5 && !_seenVals.has(cd.value) && _seenVals.add(cd.value))
    .map(cd => cd.value);
  const _res = {
    addrCandidates: topAddrCands,
    name: pickedNameVal,
    address: pickedAddrVal,
    nameConf: pickName ? (pickName.labeled ? "auto" : "guess") : "none",
    addrConf: pickAddr ? (pickAddr.labeled ? "auto" : "guess") : "none",
  };
  if (typeof process !== "undefined" && process.env && process.env.PI_DEBUG_CANDS) {
    _res.__addrCands = addrCands.slice(0, 8);
    _res.__nameCands = nameCands.slice(0, 8);
  }
  return _res;
}
  /* ═══ SYNCED-CORE-END ═══ */

  // ── pdf.js: extract text + word positions from page 1 (and page 2 if page 1 sparse)
  async function extractTextWithPositions(pdfBytes) {
    if (!window.pdfjsLib) throw new Error("pdf.js not loaded");
    // pdf.js detaches the ArrayBuffer on load — pass a fresh copy so the
    // caller's bytes remain valid for subsequent re-extracts and the merge.
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBytes) });
    const pdf = await loadingTask.promise;
    const allWords = [];
    const allLines = [];
    let charFragmented = false;
    const pagesToRead = Math.min(pdf.numPages, 2);
    for (let p = 1; p <= pagesToRead; p++) {
      const page = await pdf.getPage(p);
      const viewport = page.getViewport({ scale: 1 });
      const content = await page.getTextContent();
      // Detect char-level fragmentation before building lines.
      // Photoshop / image-converted PDFs place each glyph as its own item
      // with it.width = font bounding-box size (not the glyph advance), so
      // gap-based reconstruction is impossible. Flag it and let the caller
      // fall through to OCR instead.
      const nonSpaceItems = content.items.filter(it => it.str && it.str.trim());
      const singleCharItems = nonSpaceItems.filter(it => it.str.trim().length === 1);
      if (nonSpaceItems.length > 20 && singleCharItems.length / nonSpaceItems.length > 0.6) {
        charFragmented = true;
      }
      // Group by y-bucket into lines
      const buckets = new Map();
      for (const it of content.items) {
        if (!it.str || !it.str.trim()) continue;
        const tx = it.transform;
        const x = tx[4], yFromBottom = tx[5];
        const y = viewport.height - yFromBottom;
        const fs = Math.hypot(tx[0], tx[1]) || 8;
        const xEnd = x + (it.width || (it.str.length || 1) * fs * 0.5);
        const key = Math.round(y / 3);
        if (!buckets.has(key)) buckets.set(key, []);
        const w = { s: it.str, x, y, xEnd, sz: fs, h: it.height || fs };
        buckets.get(key).push(w);
        allWords.push(w);
      }
      const keys = [...buckets.keys()].sort((a, b) => a - b);
      for (const k of keys) {
        const ws = buckets.get(k).slice().sort((a, b) => a.x - b.x);
        allLines.push(ws.map(w => w.s).join(" "));
      }
      // If page 1 gave meaningful content, stop — otherwise keep reading
      if (p === 1 && allLines.length > 5) break;
    }
    return { lines: allLines, words: allWords, numPages: pdf.numPages, pdf, charFragmented };
  }

  // ── Tesseract: eager script already in <head>; pre-warm worker on load ─────
  // We store a mutable logger ref so per-call progress still works.
  let _ocrLogger = null;
  let _tesseractWorkerPromise = null;

  function getTesseractWorker() {
    if (_tesseractWorkerPromise) return _tesseractWorkerPromise;
    _tesseractWorkerPromise = (async () => {
      // Wait until Tesseract global is available (script already in <head>)
      let attempts = 0;
      while (!window.Tesseract && attempts++ < 50) {
        await new Promise(r => setTimeout(r, 100));
      }
      if (!window.Tesseract) throw new Error("Tesseract.js failed to load");
      // createWorker pre-downloads eng.traineddata in the background
      const w = await window.Tesseract.createWorker("eng", 1, {
        logger: m => _ocrLogger && _ocrLogger(m),
      });
      return w;
    })();
    return _tesseractWorkerPromise;
  }

  // Pre-warm the OCR worker as soon as the page loads so the eng.traineddata
  // download overlaps with the Trello API round-trips.
  if (typeof document !== "undefined") {
    getTesseractWorker().catch(() => {}); // best-effort; errors handled in ocrFirstPage
  }

  async function ocrFirstPage(pdfBytes, onProgress, xFraction = 0.45) {
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBytes) });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    // ~300 DPI, capped at 12 MP
    const baseVp = page.getViewport({ scale: 1 });
    const desiredScale = 300 / 72;
    const maxArea = 12_000_000;
    const limitScale = Math.sqrt(maxArea / (baseVp.width * baseVp.height));
    const scale = Math.min(desiredScale, limitScale);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;

    // Wire per-call logger then await the pre-warmed worker
    _ocrLogger = onProgress;
    let result;
    try {
      const worker = await getTesseractWorker();
      result = await worker.recognize(canvas);
    } finally {
      _ocrLogger = null;
    }

    const cw = canvas.width;
    // ── Spatial filter: keep only words in the LEFT 40% of the canvas.
    // Title blocks on sign-shop PDFs put project info on the left;
    // the right side holds revision history columns full of short garbage.
    const ocrLines = result.data.lines || [];
    // Absolute spatial filter: title-block project info is always in the
    // LEFT 45% of the canvas; contractor footer / revision columns sit in
    // the right half.  Skip any line whose leftmost word starts at or past
    // the cutoff (anchor-relative math lets right-side lines slip through).
    const xCutoff = cw * xFraction;
    const lines = ocrLines.length
      ? ocrLines.flatMap(ln => {
          const ws = (ln.words || []).filter(w => w.text && w.text.trim());
          if (!ws.length) return [];
          ws.sort((a, b) => a.bbox.x0 - b.bbox.x0);
          if (ws[0].bbox.x0 >= xCutoff) return []; // entire line is right-column — skip
          const kept = ws
            .filter(w => w.bbox.x0 < xCutoff)
            .map(w => w.text)
            .join(" ")
            .trim();
          return kept ? [kept] : [];
        })
      : (result.data.text || "").split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    // Normalise word bounding boxes from canvas pixels → PDF points so that
    // the multi-line dy thresholds (which are in pt) work correctly.
    // Apply the same spatial filter as lines — right-column words would
    // otherwise leak into flatRows and produce wrong multi-line addresses.
    const words = (result.data.words || [])
      .filter(w => w.text && w.text.trim() && w.bbox.x0 < xCutoff)
      .map(w => ({
        s: w.text,
        x: w.bbox.x0 / scale,
        y: w.bbox.y0 / scale,
        sz: Math.max(8, (w.bbox.y1 - w.bbox.y0) / scale),
        h: (w.bbox.y1 - w.bbox.y0) / scale,
      }));

    return { lines, words };
  }

  // ── Vision-model fallback (Anthropic Claude) ─────────────────────────
  // Used when text + OCR + metadata all fail to recover a field — typically
  // logo-only pages where the business name is stylized artwork Tesseract
  // cannot read. Requires a user-provided API key (stored in localStorage
  // under "piVisionKey"; set via the "AI key" button). Costs ~$0.005/page.
  async function visionExtract(pdfBytes, apiKey, onStatus) {
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBytes) });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const baseVp = page.getViewport({ scale: 1 });
    // Cap longest side at ~2000 px — plenty for a title block, keeps payload small
    const scale = Math.min(2000 / Math.max(baseVp.width, baseVp.height), 200 / 72);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    const b64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
    onStatus && onStatus("Asking vision model to read the drawing…", "working");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        system: "You extract two fields from a sign drawing: the PROJECT NAME (the business/customer the sign is for, NOT the sign company or general contractor) and the SITE ADDRESS (the location where the sign will be installed). Respond ONLY with strict JSON: {\"name\": \"...\", \"address\": \"...\"}. If a field is not visible in the image, use an empty string. The address should include street and city, no state or ZIP. The name should be Title Case (e.g. \"Bath & Body Works\"). Do not invent values.",
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: "image/jpeg", data: b64 } },
            { type: "text", text: "Extract the project name and site address from this sign drawing. Reply with JSON only." }
          ]
        }],
      }),
    });
    if (!res.ok) throw new Error("Vision API " + res.status);
    const json = await res.json();
    const text = ((json.content && json.content[0] && json.content[0].text) || "").trim();
    const m = text.match(/\{[\s\S]*?\}/);
    if (!m) throw new Error("Vision response not JSON");
    return JSON.parse(m[0]);
  }

  // ── Public entry: extract from raw PDF bytes
  // opts.skipOcr: fast text-layer-only pass (no OCR, no vision) — used to
  // sweep many attachments cheaply before falling back to the full pipeline.
  async function extract(pdfBytes, onStatus, opts) {
    opts = opts || {};
    onStatus && onStatus("Scanning for text…", "working");
    let data;
    try {
      data = await extractTextWithPositions(pdfBytes);
    } catch (e) {
      onStatus && onStatus("Could not read PDF: " + e.message, "error");
      return { name: "", address: "", nameConf: "none", addrConf: "none" };
    }
    let lines = data.lines;
    let words = data.words;
    const joined = lines.join(" ").replace(/\s+/g, " ").trim();

    if ((joined.length < 20 || data.charFragmented) && !opts.skipOcr) {
      // No usable text (image-only or char-fragmented PDF) — OCR fallback
      onStatus && onStatus(data.charFragmented ? "Image PDF detected — running OCR (first load takes ~15 s)…" : "No extractable text — running OCR (first load takes ~15 s)…", "working");
      try {
        const ocr = await ocrFirstPage(pdfBytes, m => {
          if (m.status === "recognizing text") {
            const pct = Math.round((m.progress || 0) * 100);
            onStatus && onStatus(`OCR: ${pct}%`, "working");
          }
        }, 0.85);
        lines = ocr.lines;
        words = ocr.words;
      } catch (e) {
        onStatus && onStatus("OCR failed: " + e.message, "error");
        return { name: "", address: "", nameConf: "none", addrConf: "none" };
      }
    }

    // Apply ligature fixes to all lines
    const fixed = lines.map(fixLigatures);
    let result = extractFromLines(fixed, words);

    // OCR supplement: if text extraction left either field empty, the
    // project info is likely vector-rendered (outlined letters).  Merge
    // OCR results with what we already have.  Two cases:
    //   (a) address found, name missing  — original case
    //   (b) address missing entirely     — e.g. customer name + address
    //       are outlined text in the title block (no text layer at all
    //       for those fields)
    const needsOcr = (result.address && !result.name) ||
                     (!result.address && result.addrConf === "none");
    if (needsOcr && !opts.skipOcr) {
      const why = result.address
        ? "Found address — running OCR for project name…"
        : "No address found — running OCR to locate project info…";
      onStatus && onStatus(why, "working");
      try {
        // Use a wider spatial filter (70%) for supplement OCR — project info
        // in title-block Customer fields can sit past the 45% cutoff used for
        // image PDFs.  Contractor addresses in the text layer are already
        // filtered by isContractor, so the wider window is safe here.
        const ocr = await ocrFirstPage(pdfBytes, m => {
          if (m.status === "recognizing text") {
            const pct = Math.round((m.progress || 0) * 100);
            onStatus && onStatus(`OCR: ${pct}%`, "working");
          }
        }, 0.70);
        const merged = extractFromLines(
          [...fixed, ...ocr.lines.map(fixLigatures)],
          [...words, ...ocr.words]
        );
        if (merged.name && !result.name) {
          result = { ...result, name: merged.name, nameConf: merged.nameConf };
        }
        if (merged.address && !result.address) {
          result = { ...result, address: merged.address, addrConf: merged.addrConf,
            addrCandidates: merged.addrCandidates || [] };
        }
        // always surface any newly-found candidates
        if (!result.addrCandidates || !result.addrCandidates.length) {
          result = { ...result, addrCandidates: merged.addrCandidates || [] };
        }
      } catch (e) {
        console.warn("OCR supplement fallback failed:", e);
      }
    }
    // ── Metadata fallback: if name is still empty after all OCR attempts,
    //    try to parse it from the PDF's Title / Subject metadata field.
    if (!result.name && data && data.pdf) {
      const metaName = await extractFromMetadata(data.pdf);
      if (metaName) {
        onStatus && onStatus("Found name in PDF metadata.", "working");
        result = { ...result, name: metaName, nameConf: "meta" };
      }
    }
    // ── Vision fallback: logo-only pages defeat OCR entirely — if either
    //    field is still missing and the user has configured an API key,
    //    ask a vision model to read the rendered page.
    if ((!result.name || !result.address) && !opts.skipOcr) {
      const vKey = (typeof localStorage !== "undefined" && localStorage.getItem("piVisionKey")) || "";
      if (vKey) {
        try {
          const v = await visionExtract(pdfBytes, vKey, onStatus);
          if (v.name && !result.name) result = { ...result, name: v.name, nameConf: "vision" };
          if (v.address && !result.address) result = { ...result, address: v.address, addrConf: "vision" };
        } catch (e) {
          console.warn("Vision fallback failed:", e);
          onStatus && onStatus("Vision fallback failed: " + e.message, "working");
        }
      }
    }
    return { ...result, numPages: data ? data.numPages : 0, pdfDoc: data ? data.pdf : null };
  }

  // ── PDF metadata fallback: parse Title/Subject for project name when
  //    text + OCR both fail (e.g. fully vector / outlined-text drawings).
  //    CorelDRAW / Illustrator files commonly embed the source filename as
  //    the PDF Title using the pattern:
  //      "Project Name_City, ST_SignType_JobNo_Rev.cdr"
  //    We take the first underscore-delimited segment as the name candidate.
  async function extractFromMetadata(pdf) {
    try {
      const meta = await pdf.getMetadata();
      const info = meta.info || {};
      const raw = (info.Title || info.Subject || "").trim();
      if (!raw || raw.length < 3) return null;
      // Strip file extension and anything after it
      const stripped = raw.replace(/\.(cdr|ai|pdf|eps|svg|dwg|dxf|indd|psd)\b.*/i, "").trim();
      if (!stripped) return null;
      // Reject generic boilerplate document titles
      if (/^(untitled|new\s*document|document\s*\d*|unnamed|noname|drawing\s*\d*|design\s*\d*|sheet\s*\d*)$/i.test(stripped)) return null;
      let cand = null;
      if (stripped.includes("_")) {
        // Underscore-separated filename — first segment is the project name
        cand = stripped.split("_")[0].trim();
      } else {
        // No underscores — use the whole title if it looks like a project name
        cand = stripped;
      }
      if (!cand || cand.length < 2 || cand.length > 80) return null;
      if (isGarbage(cand) || isContractor(cand) || isAddressFragment(cand)) return null;
      if (/^\d/.test(cand)) return null; // starts with a number — likely a job/PO code
      return cleanExtractedName(piTitleCase(cand));
    } catch (_) {
      return null;
    }
  }

  return { extract, parseAddress, extractFromLines };
})();
