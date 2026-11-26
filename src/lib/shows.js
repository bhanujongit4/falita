// Server-side: pulls the shows from the Google Sheet and cleans them up.
const SHEET_ID = "1dF3Ckmbm96o2C2BKlHsYiYyJkk69EZSBekEz0COYIGs";
const GID = process.env.SHOWS_SHEET_GID || "0"; // only change if the shows are not on the first tab

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Small CSV parser that copes with quoted cells (the map links contain commas)
function parseCSV(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; } else quoted = false;
      } else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function makeDate(y, mo, d) {
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCMonth() !== mo - 1) return null;
  const pad = (n) => String(n).padStart(2, "0");
  return {
    iso: `${y}-${pad(mo)}-${pad(d)}`,
    day: String(d),
    month: MONTHS[mo - 1],
    year: String(y),
    weekday: DAYS[dt.getUTCDay()],
  };
}

// accepts 26-02-26, 26-02-2026, 26/02/26, 26.02.2026 and 2026-02-26
function parseDate(raw) {
  const s = (raw || "").trim();
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return makeDate(+m[1], +m[2], +m[3]);
  m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2}|\d{4})$/);
  if (m) return makeDate(+m[3] < 100 ? 2000 + +m[3] : +m[3], +m[2], +m[1]);
  return null;
}

// Google Drive "share" links don't work in <img>; turn them into a thumbnail URL.
// (The file must be shared as "Anyone with the link".)
function toImageUrl(raw) {
  const s = (raw || "").trim();
  if (!s) return "";
  if (/drive\.google\.com|docs\.google\.com/.test(s)) {
    const m = s.match(/\/d\/([\w-]+)/) || s.match(/[?&]id=([\w-]+)/);
    if (m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w1200`;
  }
  return s;
}


// Pulls a place name / coordinates out of a Google Maps link so we can show a map preview
function mapInfo(url, city) {
  let label = "";
  try {
    const u = new URL(url);
    const dest = u.searchParams.get("daddr") || u.searchParams.get("q") || u.searchParams.get("destination") || u.searchParams.get("query");
    if (dest) label = dest;
    else {
      const m = u.pathname.match(/\/maps\/place\/([^/]+)/);
      if (m) label = decodeURIComponent(m[1].replace(/\+/g, " "));
    }
  } catch {}
  const coords = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/) || url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  const mapQuery = coords ? `${coords[1]},${coords[2]}` : label || city;
  const mapHref = url || (mapQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}` : "");
  return { mapQuery, mapLabel: label || city, mapHref };
}

export function todayInIndia() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date()); // YYYY-MM-DD
}

export async function getShows() {
  try {
    const res = await fetch(
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`,
      { next: { revalidate: 300 } } // re-reads the sheet at most every 5 minutes
    );
    if (!res.ok) throw new Error(`Sheet responded ${res.status}`);
    const text = (await res.text()).replace(/^\uFEFF/, "");
    if (text.trimStart().startsWith("<")) throw new Error("Sheet is not public");

    const [head, ...body] = parseCSV(text);
    // headers in the sheet have stray spaces ("ImageUrl ", "location link "), so normalise them
    const col = {};
    head.forEach((h, i) => { col[h.trim().toLowerCase().replace(/[^a-z0-9]/g, "")] = i; });
    const get = (r, name) => (r[col[name]] ?? "").trim();

    const shows = body
      .filter((r) => get(r, "title"))
      .map((r, i) => ({
        key: `s${i}`,
        title: get(r, "title"),
        image: toImageUrl(get(r, "imageurl")),
        city: get(r, "location"),
        ...mapInfo(get(r, "locationlink"), get(r, "location")),
        date: parseDate(get(r, "date")),
        description: get(r, "description"),
      }));

    return { shows, failed: false };
  } catch (err) {
    console.error("[shows] could not load the sheet:", err);
    return { shows: [], failed: true };
  }
}