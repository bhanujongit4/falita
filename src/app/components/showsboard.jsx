"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const GENRES = [
  "Bollywood", "Western Pop", "Jazz", "Groove", "Acoustic", "Indie", "Soul", "Funk",
  "R&B", "Rock", "Electronic", "Folk", "Sufi", "Retro", "Original Music", "World Music",
  "Latin", "Disco", "Blues", "Country",
];
const pad = (n) => String(n).padStart(2, "0");
const isoOf = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const dayNumber = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d) / 86400000;
};
function buildMonth(y, m) {
  const lead = new Date(Date.UTC(y, m, 1)).getUTCDay();
  const total = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const cells = Array(lead).fill(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  return cells;
}

function Photo({ src, alt = "", className }) {
  const [bad, setBad] = useState(false);
  if (!src || bad) return <span className={`${className} photo-ph`} aria-hidden="true" />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src={src} alt={alt} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setBad(true)} />;
}

function Eq() {
  return <span className="eq" aria-hidden="true"><i /><i /><i /></span>;
}

/* Small map box. The iframe only mounts once the show has stayed selected for a moment,
   so skimming through the list doesn't fire a map request for every row. */
function Venue({ show }) {
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 350);
    return () => clearTimeout(t);
  }, []);
  if (!show.mapHref) return null;
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(show.mapQuery)}&z=14&output=embed`;
  return (
    <a className="venue" href={show.mapHref} target="_blank" rel="noreferrer" aria-label={`Open ${show.mapLabel} in Google Maps`}>
      <span className="venue__map">
        {!loaded && <span className="venue__pin" aria-hidden="true" />}
        {ready && (
          <iframe
            className={loaded ? "is-loaded" : ""}
            src={src}
            title={`Map of ${show.mapLabel}`}
            loading="lazy"
            tabIndex={-1}
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setLoaded(true)}
          />
        )}
      </span>
      <span className="venue__text">
        <small>Venue</small>
        <strong>{show.mapLabel}</strong>
        <span className="venue__open">Open in Maps <span aria-hidden="true">↗</span></span>
      </span>
    </a>
  );
}

export default function ShowsBoard({ upcoming, past, today, failed }) {
  const all = [...upcoming, ...past];
  const first = all[0]?.key ?? null;
  const seed = all[0]?.date?.iso ?? today;
  const [active, setActive] = useState(first); // drives the stage on desktop
  const [open, setOpen] = useState(first); // drives the dropdown on phones
  const [view, setView] = useState({ y: +seed.slice(0, 4), m: +seed.slice(5, 7) - 1 }); // calendar month
  const current = all.find((s) => s.key === active) ?? all[0] ?? null;
  const isPast = (s) => !!s.date && s.date.iso < today;

  // calendar data
  const byDate = {};
  all.forEach((s) => { if (s.date) (byDate[s.date.iso] ||= []).push(s); });
  const cells = buildMonth(view.y, view.m);
  const monthKey = `${view.y}-${pad(view.m + 1)}`;
  const inMonth = all.filter((s) => s.date?.iso.startsWith(monthKey)).length;

  // header details

  function activate(s, alsoOpen = false) {
    setActive(s.key);
    if (alsoOpen) setOpen(s.key);
    if (s.date) setView({ y: +s.date.iso.slice(0, 4), m: +s.date.iso.slice(5, 7) - 1 });
  }
  function shiftMonth(delta) {
    setView((v) => {
      let m = v.m + delta, y = v.y;
      if (m < 0) { m = 11; y -= 1; }
      if (m > 11) { m = 0; y += 1; }
      return { y, m };
    });
  }
  function pickDate(list) {
    const i = list.findIndex((s) => s.key === active);
    const s = list[(i + 1) % list.length]; // several shows on one day: tap again to cycle
    activate(s, true);
    if (typeof window !== "undefined" && window.innerWidth <= 900) {
      setTimeout(() => document.getElementById(`btn-${s.key}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
    }
  }
  function spot(e) {
    const b = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--sx", `${e.clientX - b.left}px`);
    e.currentTarget.style.setProperty("--sy", `${e.clientY - b.top}px`);
  }
  function rest(e) {
    e.currentTarget.style.removeProperty("--sx");
    e.currentTarget.style.removeProperty("--sy");
  }
  function glow(e) {
    const b = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--row-x", `${e.clientX - b.left}px`);
  }

  // plain function (not a component) so rows don't remount and lose their animations
  function renderRow(s, index) {
    const past = isPast(s);
    const isActive = active === s.key;
    const isOpen = open === s.key;
    return (
      <li
        key={s.key}
        className={`row${past ? " is-past" : ""}${isActive ? " is-active" : ""}${isOpen ? " is-open" : ""}`}
        style={{ "--i": index }}
      >
        <button
          type="button"
          className="row__btn"
          id={`btn-${s.key}`}
          aria-expanded={isOpen}
          aria-controls={`panel-${s.key}`}
          onPointerEnter={(e) => e.pointerType === "mouse" && activate(s)}
          onFocus={() => activate(s)}
          onPointerMove={glow}
          onClick={() => { activate(s); setOpen(isOpen ? null : s.key); }}
        >
          <span className="row__date">
            <span className={`row__day${s.date ? "" : " row__day--tba"}`}>{s.date ? s.date.day : "TBA"}</span>
            {s.date && <span className="row__mon">{s.date.month} {s.date.year}</span>}
          </span>
          <span className="row__title">{s.title}</span>
          <span className="row__city">{s.city}</span>
          <span className="row__eq"><Eq /></span>
          <span className="row__go" aria-hidden="true" />
        </button>

        {/* dropdown, used on phones (desktop uses the stage) */}
        <div className="row__panel" id={`panel-${s.key}`} role="region" aria-labelledby={`btn-${s.key}`}>
          <div className="row__clip">
            <div className="row__body">
              <div className="row__media"><Photo src={s.image} alt={s.title} className="row__img" /></div>
              <div className="row__text">
                {s.description && <p>{s.description}</p>}
                {isOpen && <Venue key={s.key} show={s} />}
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }

  let n = 0;

  return (
    <main className="shows">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap');
        @property --sx { syntax: "<length-percentage>"; inherits: true; initial-value: 50%; }
        @property --sy { syntax: "<length-percentage>"; inherits: true; initial-value: 34%; }

        html, body { background: #05060a; }
        .shows, .shows * { box-sizing: border-box; }
        .shows h1, .shows h2, .shows h3, .shows p, .shows ol, .shows li { margin: 0; padding: 0; }

        .shows {
          --ink: #05060a; --bone: #f1ede6; --mute: rgba(241,237,230,0.62); --line: rgba(241,237,230,0.16);
          --teal: #3fd4e6; --violet: #7a4dff; --amber: #ff9a4d;
          --pad: clamp(1.25rem, 5vw, 4.5rem);
          position: relative; isolation: isolate; min-height: 100vh; overflow-x: clip;
          background: var(--ink); color: var(--bone); font-family: Helvetica, Arial, sans-serif;
        }

        /* ---------- Atmosphere ---------- */
        .haze { position: fixed; inset: 0; z-index: -1; pointer-events: none; mix-blend-mode: screen; }
        .haze span { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.2; }
        .haze span:nth-child(1) { width: 36vw; height: 36vw; right: 8%; top: 10%; background: radial-gradient(circle, var(--teal), transparent 65%); animation: d1 24s ease-in-out infinite alternate; }
        .haze span:nth-child(2) { width: 32vw; height: 32vw; right: -6%; bottom: 0; background: radial-gradient(circle, var(--violet), transparent 65%); animation: d2 30s ease-in-out infinite alternate; }
        .haze span:nth-child(3) { width: 20vw; height: 20vw; right: 30%; top: 50%; opacity: 0.1; background: radial-gradient(circle, var(--amber), transparent 65%); animation: d1 36s ease-in-out infinite alternate; }
        @keyframes d1 { from { transform: translate(0,0) scale(1); } to { transform: translate(-6vw,5vh) scale(1.2); } }
        @keyframes d2 { from { transform: translate(0,0) scale(1.1); } to { transform: translate(-5vw,-6vh) scale(0.9); } }
        .grain {
          position: fixed; inset: 0; z-index: 50; pointer-events: none; opacity: 0.07; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
        }

        /* ---------- Top bar + intro ---------- */
        .top { position: relative; z-index: 5; display: flex; align-items: center; justify-content: space-between; padding: 0.5rem var(--pad); }
        .top::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--line) 20%, var(--line) 80%, transparent); }
        .top__logo img { display: block; width: clamp(4.6rem, 8vw, 7.5rem); height: auto; }
        .pill {
          display: inline-flex; align-items: center; gap: 0.6rem; padding: 0.6rem 1.2rem;
          border: 1px solid rgba(241,237,230,0.28); border-radius: 999px; color: var(--bone);
          font-size: 0.92rem; letter-spacing: 0.02em; text-decoration: none;
          transition: background 300ms ease, color 300ms ease, border-color 300ms ease;
        }
        .pill:hover, .pill:focus-visible { background: var(--bone); border-color: var(--bone); color: var(--ink); }

        .intro {
          display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: center; gap: 2.5rem 4rem;
          max-width: 96rem; margin: 0 auto; padding: clamp(2.5rem, 7vw, 6rem) var(--pad) clamp(1.5rem, 3vw, 2.5rem);
        }
        .intro__lead { text-align: center; }
        .intro h1 {
          font-family: 'Playfair Display', Georgia, serif; font-weight: 400;
          font-size: clamp(3.2rem, 8vw, 7.5rem); line-height: 0.98; letter-spacing: -0.02em;
          animation: rise 1.4s cubic-bezier(0.2,0.7,0.2,1) both;
        }
        .intro__lead > p { margin: 1.6rem auto 0; max-width: 31rem; font-size: clamp(1rem, 1.25vw, 1.12rem); line-height: 1.7; font-weight: 300; color: var(--mute); animation: rise 1.4s 0.15s cubic-bezier(0.2,0.7,0.2,1) both; }
        .next {
          display: inline-flex; align-items: center; gap: 0.65rem; margin-top: 1.6rem; padding: 0.5rem 1rem;
          border: 1px solid var(--line); border-radius: 999px; color: var(--mute); font-size: 0.88rem;
          animation: rise 1.4s 0.3s cubic-bezier(0.2,0.7,0.2,1) both;
        }
        .next i { width: 6px; height: 6px; border-radius: 50%; background: var(--teal); box-shadow: 0 0 10px var(--teal); }
        .next b { color: var(--bone); font-weight: 400; }
        .stats { display: flex; animation: rise 1.4s 0.3s cubic-bezier(0.2,0.7,0.2,1) both; }
        .stats div { display: grid; gap: 0.5rem; padding: 0 clamp(1.25rem, 3vw, 2.75rem); border-left: 1px solid var(--line); }
        .stats div:first-child { padding-left: 0; border-left: 0; }
        .stats b { font-family: 'Playfair Display', Georgia, serif; font-weight: 400; font-size: clamp(2.4rem, 4.6vw, 4.2rem); line-height: 0.95; letter-spacing: -0.02em; }
        .stats span { font-size: 0.82rem; color: var(--mute); }
        @keyframes rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }

        /* ---------- City ticker ---------- */
        .marquee { overflow: hidden; margin: 0 0 clamp(1.5rem, 3vw, 2.5rem); -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
        .marquee__track { display: flex; width: max-content; animation: marq 64s linear infinite; }
        .marquee__set { display: flex; flex: none; align-items: center; }
        .marquee__set span {
          padding-right: 0.5em; white-space: nowrap; font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2rem, 6vw, 5rem); line-height: 1.2; letter-spacing: -0.02em;
          color: transparent; -webkit-text-stroke: 1px rgba(241,237,230,0.5);
        }
        .marquee__set span::after { content: "·"; display: inline-block; margin-left: 0.5em; color: rgba(241,237,230,0.35); -webkit-text-stroke: 0; }
        @keyframes marq { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        /* ---------- Layout ---------- */
        .layout { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: clamp(2rem, 5vw, 6rem); align-items: start; max-width: 96rem; margin: 0 auto; padding: 0 var(--pad) 5rem; }
        .layout--solo { grid-template-columns: minmax(0, 1fr); }

        /* ---------- Calendar ---------- */
        .cal { margin-bottom: clamp(2.5rem, 5vw, 4rem); padding: clamp(1rem, 2.4vw, 1.75rem); border: 1px solid var(--line); border-radius: 0.4rem; background: radial-gradient(90% 70% at 0% 0%, rgba(63,212,230,0.07), transparent 60%), rgba(241,237,230,0.02); animation: rise 1s 0.2s cubic-bezier(0.2,0.7,0.2,1) both; }
        .cal__head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.25rem; }
        .cal__title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.9rem, 3.2vw, 2.7rem); font-weight: 400; letter-spacing: -0.02em; line-height: 1; }
        .cal__title span { margin-left: 0.6rem; font-family: Helvetica, Arial, sans-serif; font-size: 0.9rem; letter-spacing: 0.04em; color: var(--mute); }
        .cal__sub { margin-top: 0.5rem; font-size: 0.82rem; color: var(--mute); }
        .cal__nav { display: flex; gap: 0.5rem; }
        .cal__nav button {
          display: grid; width: 2.4rem; height: 2.4rem; place-items: center; padding: 0; cursor: pointer;
          border: 1px solid rgba(241,237,230,0.28); border-radius: 50%; background: none; color: var(--bone); font-size: 1rem;
          transition: background 300ms ease, color 300ms ease, border-color 300ms ease;
        }
        .cal__nav button:hover, .cal__nav button:focus-visible { background: var(--bone); border-color: var(--bone); color: var(--ink); }
        .cal__week, .cal__grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); }
        .cal__week span { padding-bottom: 0.7rem; text-align: center; font-size: 0.72rem; letter-spacing: 0.1em; color: rgba(241,237,230,0.4); }
        .cal__grid { border-top: 1px solid var(--line); }
        .cal__cell {
          --accent: var(--teal); position: relative; isolation: isolate; display: grid; place-items: center;
          height: clamp(2.9rem, 4.6vw, 3.7rem); padding: 0; border: 0; background: none; color: inherit; font: inherit;
        }
        .cal__cell.is-past { --accent: var(--bone); }
        .cal__num { position: relative; z-index: 1; font-size: 0.98rem; font-weight: 300; color: rgba(241,237,230,0.6); transition: color 300ms ease; }
        .cal__cell.is-today::after { content: ""; position: absolute; top: 0.35rem; left: 50%; width: 4px; height: 4px; margin-left: -2px; border-radius: 50%; background: var(--bone); }
        .cal__cell--show { cursor: pointer; }
        .cal__cell--show .cal__num { color: var(--bone); font-weight: 400; }
        .cal__cell--show::before {
          content: ""; position: absolute; z-index: 0; top: 50%; left: 50%; width: 2.4rem; height: 2.4rem; margin: -1.2rem 0 0 -1.2rem;
          border-radius: 50%; border: 1px solid color-mix(in srgb, var(--accent) 55%, transparent);
          transition: background 300ms ease, box-shadow 300ms ease, transform 420ms cubic-bezier(0.2,0.7,0.2,1);
        }
        .cal__cell--show:hover::before { transform: scale(1.08); }
        .cal__cell--show:focus-visible { outline: 2px solid var(--teal); outline-offset: -4px; }
        .cal__cell--show.is-selected::before { background: var(--accent); box-shadow: 0 0 26px color-mix(in srgb, var(--accent) 55%, transparent); }
        .cal__cell--show.is-selected .cal__num { color: var(--ink); font-weight: 500; }
        .cal__dots { position: absolute; z-index: 1; bottom: 0.2rem; left: 0; right: 0; display: flex; justify-content: center; gap: 3px; }
        .cal__dots i { width: 3px; height: 3px; border-radius: 50%; background: var(--accent); }
        .cal__legend { display: flex; gap: 1.4rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--line); font-size: 0.78rem; color: var(--mute); }
        .cal__legend span { display: inline-flex; align-items: center; gap: 0.5rem; }
        .cal__legend i { width: 7px; height: 7px; border-radius: 50%; background: var(--teal); box-shadow: 0 0 8px var(--teal); }
        .cal__legend span + span i { background: var(--bone); box-shadow: none; }

        /* ---------- Lists ---------- */
        .sec + .sec { margin-top: clamp(2.5rem, 5vw, 4rem); }
        .sec__head { display: flex; align-items: baseline; gap: 0.7rem; margin-bottom: 1rem; font-size: 0.85rem; font-weight: 400; letter-spacing: 0.02em; color: var(--mute); }
        .sec__head span { color: rgba(241,237,230,0.4); }
        .list { list-style: none; border-top: 1px solid var(--line); }
        .empty { padding: 1.6rem 0; border-bottom: 1px solid var(--line); display: grid; justify-items: start; gap: 1.2rem; }
        .empty p { font-size: clamp(1.3rem, 2.4vw, 1.9rem); font-weight: 300; letter-spacing: -0.04em; color: var(--mute); }

        /* ---------- Rows ---------- */
        .row { --accent: var(--teal); position: relative; border-bottom: 1px solid var(--line); animation: rise 0.9s cubic-bezier(0.2,0.7,0.2,1) both; animation-delay: calc(var(--i) * 70ms + 200ms); }
        .row.is-past { --accent: var(--bone); }
        .row::after { content: ""; position: absolute; left: 0; bottom: -1px; width: 100%; height: 1px; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform 560ms cubic-bezier(0.2,0.7,0.2,1); pointer-events: none; }
        .row__btn {
          --row-x: 50%; position: relative; isolation: isolate; width: 100%;
          display: grid; grid-template-columns: 5.4rem minmax(0,1fr) auto 1.5rem; align-items: center; gap: 1.25rem;
          padding: clamp(0.9rem, 1.8vw, 1.35rem) 0; border: 0; background: none; color: inherit; font: inherit; text-align: left; cursor: pointer;
          opacity: 0.55; transition: opacity 320ms ease;
        }
        .row__btn::before {
          content: ""; position: absolute; inset: 0 -1rem; z-index: -1; opacity: 0; pointer-events: none; transition: opacity 320ms ease;
          background: radial-gradient(340px circle at var(--row-x) 50%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%);
        }
        .row__btn:focus-visible { outline: none; }
        .row__day { display: block; font-family: 'Playfair Display', Georgia, serif; font-size: clamp(2.1rem, 3.6vw, 3.1rem); line-height: 0.95; letter-spacing: -0.02em; transition: color 320ms ease; }
        .row__day--tba { font-family: Helvetica, Arial, sans-serif; font-size: 1.1rem; font-weight: 300; letter-spacing: 0.04em; }
        .row__mon { display: block; margin-top: 0.4rem; font-size: 0.72rem; letter-spacing: 0.08em; color: var(--mute); }
        .row__title { font-size: clamp(1.4rem, 2.8vw, 2.4rem); font-weight: 300; letter-spacing: -0.045em; line-height: 1.05; transition: transform 420ms cubic-bezier(0.2,0.7,0.2,1); }
        .row__city { font-size: 0.85rem; color: var(--mute); text-align: right; }
        .row__go { display: none; }

        .eq { display: inline-flex; align-items: flex-end; gap: 2px; height: 0.9rem; color: var(--accent); opacity: 0; transition: opacity 320ms ease; }
        .eq i { display: block; width: 2px; height: 100%; border-radius: 1px; background: currentColor; transform-origin: bottom; }
        .eq i:nth-child(1) { transform: scaleY(0.45); }
        .eq i:nth-child(2) { transform: scaleY(1); animation-delay: -260ms; }
        .eq i:nth-child(3) { transform: scaleY(0.7); animation-delay: -520ms; }
        @keyframes eq { from { transform: scaleY(0.3); } to { transform: scaleY(1); } }

        .row__panel { display: none; }

        /* ---------- Stage (desktop) ---------- */
        .stage { position: sticky; top: 2rem; display: grid; gap: 1.4rem; }
        .stage__frame {
          position: relative; isolation: isolate; width: 100%; height: min(46vh, 30rem); overflow: hidden;
          border: 1px solid var(--line); border-radius: 0.4rem; background: #0a0b10;
        }
        .stage__frame > .stage__mono, .stage__frame > .stage__color { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; animation: stageIn 900ms cubic-bezier(0.2,0.7,0.2,1) both; }
        .stage__mono { filter: grayscale(1) brightness(0.5) contrast(1.05); }
        .stage__color {
          filter: saturate(1.12) contrast(1.04);
          -webkit-mask-image: radial-gradient(circle 300px at var(--sx) var(--sy), #000 0%, rgba(0,0,0,0.9) 30%, transparent 100%);
          mask-image: radial-gradient(circle 300px at var(--sx) var(--sy), #000 0%, rgba(0,0,0,0.9) 30%, transparent 100%);
          transition: --sx 260ms ease-out, --sy 260ms ease-out;
        }
        @keyframes stageIn { from { opacity: 0; transform: scale(1.06); } to { opacity: 1; transform: none; } }
        .photo-ph.stage__mono { background: linear-gradient(160deg, #16171d, #0a0b10); }
        .photo-ph.stage__color, .photo-ph.row__img {
          background:
            radial-gradient(80% 60% at 30% 25%, rgba(63,212,230,0.45), transparent 60%),
            radial-gradient(70% 60% at 80% 70%, rgba(122,77,255,0.45), transparent 65%),
            radial-gradient(50% 40% at 60% 40%, rgba(255,154,77,0.25), transparent 70%), #0a0b10;
        }
        .stage__vignette { position: absolute; inset: 0; z-index: 1; pointer-events: none; background: linear-gradient(to top, rgba(5,6,10,0.92) 0%, rgba(5,6,10,0.4) 30%, transparent 55%); }
        .stage__caption { position: absolute; z-index: 2; left: 1.4rem; right: 1.4rem; bottom: 1.3rem; pointer-events: none; animation: rise 700ms cubic-bezier(0.2,0.7,0.2,1) both; }
        .stage__when { font-size: 0.8rem; letter-spacing: 0.04em; color: var(--mute); }
        .stage__city { margin-top: 0.35rem; font-family: 'Playfair Display', Georgia, serif; font-size: clamp(2rem, 3.4vw, 3.2rem); line-height: 1; letter-spacing: -0.02em; }
        .stage__info { display: grid; gap: 1.2rem; animation: rise 700ms 80ms cubic-bezier(0.2,0.7,0.2,1) both; }
        .stage__info p { max-width: 30rem; font-size: 1.05rem; font-weight: 300; line-height: 1.65; color: var(--mute); }

        /* ---------- Venue map box ---------- */
        .venue {
          display: grid; grid-template-columns: clamp(8rem, 11vw, 10rem) minmax(0, 1fr); width: 100%; overflow: hidden;
          border: 1px solid var(--line); border-radius: 0.4rem; background: rgba(241,237,230,0.03);
          color: inherit; text-decoration: none; transition: border-color 300ms ease;
        }
        .venue:hover, .venue:focus-visible { border-color: rgba(63,212,230,0.6); outline: none; }
        .venue__map {
          position: relative; min-height: 6.8rem; overflow: hidden;
          background: linear-gradient(rgba(241,237,230,0.06) 1px, transparent 1px) 0 0 / 22px 22px, linear-gradient(90deg, rgba(241,237,230,0.06) 1px, transparent 1px) 0 0 / 22px 22px, #0a0b10;
        }
        .venue__map::after { content: ""; position: absolute; inset: 0; box-shadow: inset 0 0 24px rgba(5,6,10,0.75); pointer-events: none; }
        .venue__pin { position: absolute; left: 50%; top: 50%; width: 10px; height: 10px; margin: -5px 0 0 -5px; border-radius: 50%; background: var(--teal); box-shadow: 0 0 0 6px rgba(63,212,230,0.18), 0 0 18px var(--teal); }
        .venue__map iframe {
          position: absolute; left: -8%; top: -14%; width: 116%; height: 128%; border: 0; pointer-events: none; opacity: 0; transition: opacity 600ms ease;
          filter: invert(0.92) hue-rotate(180deg) saturate(0.55) brightness(0.82) contrast(0.95);
        }
        .venue__map iframe.is-loaded { opacity: 1; }
        .venue__text { display: grid; align-content: center; gap: 0.35rem; min-width: 0; padding: 0.9rem 1rem; }
        .venue__text small { font-size: 0.72rem; letter-spacing: 0.08em; color: var(--mute); }
        .venue__text strong { font-size: 1rem; font-weight: 300; line-height: 1.35; letter-spacing: -0.01em; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .venue__open { font-size: 0.82rem; color: var(--teal); }

        .row__btn:focus-visible .row__title { outline: 2px solid var(--teal); outline-offset: 4px; }
        .pill:focus-visible { outline: 2px solid var(--teal); outline-offset: 4px; }

        /* ---------- Closing call to action ---------- */
        .cta { max-width: 96rem; margin: 0 auto; padding: 0 var(--pad) 6rem; }
        .cta__inner { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 2rem; padding-top: clamp(2rem, 4vw, 3.5rem); border-top: 1px solid var(--line); }
        .cta h2 { max-width: 16ch; font-family: 'Playfair Display', Georgia, serif; font-weight: 400; font-size: clamp(2.2rem, 5vw, 4.2rem); line-height: 1; letter-spacing: -0.02em; }
        .cta p { margin-top: 1.2rem; max-width: 28rem; font-size: 1rem; font-weight: 300; line-height: 1.65; color: var(--mute); }

        /* ---------- Desktop states ---------- */
        @media (min-width: 901px) {
          .row__btn:hover { opacity: 0.9; }
          .row__btn:hover::before { opacity: 1; }
          .row.is-active .row__btn { opacity: 1; }
          .row.is-active .row__btn::before { opacity: 1; }
          .row.is-active::after { transform: scaleX(1); }
          .row.is-active .row__day { color: var(--accent); }
          .row.is-active .row__title { transform: translateX(0.6rem); }
          .row.is-active .eq { opacity: 1; }
          .row.is-active .eq i { animation: eq 800ms ease-in-out infinite alternate; }
        }

        /* ---------- Mobile: dropdown rows ---------- */
        @media (max-width: 900px) {
          .haze { display: none; }
          .intro { align-items: flex-start; }
          .layout { grid-template-columns: minmax(0, 1fr); }
          .stage, .row__eq { display: none; }

          .row__btn { grid-template-columns: 3.9rem minmax(0,1fr) 2.1rem; gap: 0.15rem 1rem; padding: 0.95rem 0; opacity: 1; }
          .row__date { grid-row: 1 / span 2; }
          .row__title { grid-column: 2; grid-row: 1; font-size: clamp(1.35rem, 6vw, 1.8rem); }
          .row__city { grid-column: 2; grid-row: 2; text-align: left; }
          .row__go { display: block; position: relative; grid-column: 3; grid-row: 1 / span 2; width: 2.1rem; height: 2.1rem; border: 1px solid rgba(241,237,230,0.28); border-radius: 50%; transition: background 320ms ease, border-color 320ms ease, color 320ms ease; }
          .row__go::before, .row__go::after { content: ""; position: absolute; inset: 0; width: 0.8rem; height: 1px; margin: auto; background: currentColor; transition: transform 420ms cubic-bezier(0.2,0.7,0.2,1); }
          .row__go::after { transform: rotate(90deg); }
          .row.is-open .row__go::after { transform: rotate(0); }
          .row.is-open .row__go { background: var(--bone); border-color: var(--bone); color: var(--ink); }
          .row.is-open::after { transform: scaleX(1); }
          .row.is-open .row__day { color: var(--accent); }

          .row__panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 520ms cubic-bezier(0.2,0.7,0.2,1); }
          .row.is-open .row__panel { grid-template-rows: 1fr; }
          .row__clip { min-height: 0; overflow: hidden; visibility: hidden; transition: visibility 0s 520ms; }
          .row.is-open .row__clip { visibility: visible; transition: visibility 0s; }
          .row__body { display: grid; gap: 1.1rem; padding: 0.4rem 0 1.6rem; }
          .row__media { position: relative; aspect-ratio: 16 / 10; overflow: hidden; border-radius: 0.4rem; clip-path: inset(0 0 100% 0); transition: clip-path 700ms cubic-bezier(0.2,0.7,0.2,1); }
          .row.is-open .row__media { clip-path: inset(0); transition-delay: 140ms; }
          .row__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transform: scale(1.12); transition: transform 1100ms cubic-bezier(0.2,0.7,0.2,1); }
          .row.is-open .row__img { transform: scale(1); }
          .row__text { display: grid; gap: 1.2rem; opacity: 0; transform: translateY(10px); transition: opacity 250ms ease, transform 250ms ease; }
          .row.is-open .row__text { opacity: 1; transform: none; transition: opacity 600ms ease 220ms, transform 600ms cubic-bezier(0.2,0.7,0.2,1) 220ms; }
          .row__text p { font-size: 1rem; font-weight: 300; line-height: 1.65; color: var(--mute); }
        }
        @media (max-width: 600px) {
          .stats div { padding: 0 1rem; }
          .cal__title span { display: block; margin: 0.35rem 0 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .haze span, .intro h1, .intro__lead > p, .next, .stats, .cal, .row, .stage__caption, .stage__info, .stage__mono, .stage__color { animation: none !important; }
          .eq i { animation: none !important; }
          .row__panel, .row__clip, .row__media, .row__img, .row__text, .row__title, .row::after, .stage__color, .cal__cell::before { transition: none !important; }
        }
      `}</style>

      <div className="haze" aria-hidden="true"><span /><span /><span /></div>
      <div className="grain" aria-hidden="true" />

      <header className="top">
        <a className="top__logo" href="/" aria-label="Hifalita home">
          <Image src="/assets/whiteautog.png" alt="Hifalita" width={120} height={87} priority />
        </a>
        <a className="pill" href="/">Home</a>
      </header>

      <section className="intro">
        <div className="intro__lead">
          <h1>Live, up close.</h1>
          <p>Upcoming dates, and a look back at the nights so far.</p>
        </div>
      </section>

      <div className="marquee" aria-label={`Genres: ${GENRES.join(", ")}`}>
        <div className="marquee__track">
          {[0, 1].map((copy) => (
            <div className="marquee__set" key={copy} aria-hidden="true">
              {GENRES.map((genre, index) => <span key={`${copy}-${index}`}>{genre}</span>)}
            </div>
          ))}
        </div>
      </div>

      <div className={`layout${current ? "" : " layout--solo"}`}>
        <div className="lists">
          {all.length > 0 && (
            <section className="cal" aria-label="Show calendar">
              <div className="cal__head">
                <div>
                  <h2 className="cal__title" aria-live="polite">{MONTHS[view.m]}<span>{view.y}</span></h2>
                  <p className="cal__sub">{inMonth === 0 ? "No shows this month" : `${inMonth} ${inMonth === 1 ? "show" : "shows"} this month`}</p>
                </div>
                <div className="cal__nav">
                  <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month">←</button>
                  <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month">→</button>
                </div>
              </div>
              <div className="cal__week" aria-hidden="true">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i}>{d}</span>)}
              </div>
              <div className="cal__grid">
                {cells.map((d, i) => {
                  if (!d) return <span key={i} className="cal__cell" aria-hidden="true" />;
                  const iso = isoOf(view.y, view.m, d);
                  const list = byDate[iso];
                  const isToday = iso === today;
                  if (!list) {
                    return <span key={i} className={`cal__cell${isToday ? " is-today" : ""}`}><span className="cal__num">{d}</span></span>;
                  }
                  const selected = current?.date?.iso === iso;
                  const label = `${d} ${MONTHS[view.m]} ${view.y}: ${list.map((s) => `${s.title}${s.city ? `, ${s.city}` : ""}`).join("; ")}`;
                  return (
                    <button
                      key={i}
                      type="button"
                      className={`cal__cell cal__cell--show${selected ? " is-selected" : ""}${iso < today ? " is-past" : ""}${isToday ? " is-today" : ""}`}
                      aria-label={label}
                      aria-pressed={selected}
                      title={label}
                      onPointerEnter={(e) => e.pointerType === "mouse" && activate(list[0])}
                      onClick={() => pickDate(list)}
                    >
                      <span className="cal__num">{d}</span>
                      <span className="cal__dots" aria-hidden="true">{list.slice(0, 3).map((s) => <i key={s.key} />)}</span>
                    </button>
                  );
                })}
              </div>
              <div className="cal__legend" aria-hidden="true"><span><i /> Upcoming</span><span><i /> Past</span></div>
            </section>
          )}

          <section className="sec">
            <h2 className="sec__head">Upcoming <span>{upcoming.length}</span></h2>
            {upcoming.length > 0 ? (
              <ol className="list">{upcoming.map((s) => renderRow(s, n++))}</ol>
            ) : (
              <div className="list">
                <div className="empty">
                  <p>{failed ? "We couldn’t load the dates just now. Please try again in a moment." : "No dates announced right now."}</p>
                  <a className="pill" href="https://in.bookmyshow.com/person/falita-chowdhary/2059259" target="_blank" rel="noreferrer">Find live shows <span aria-hidden="true">↗</span></a>
                </div>
              </div>
            )}
          </section>

          {past.length > 0 && (
            <section className="sec">
              <h2 className="sec__head">Past shows <span>{past.length}</span></h2>
              <ol className="list">{past.map((s) => renderRow(s, n++))}</ol>
            </section>
          )}
        </div>

        {current && (
          <aside className="stage" aria-live="polite">
            <div className="stage__frame" onPointerMove={spot} onPointerLeave={rest}>
              <Photo key={`m-${current.key}`} src={current.image} className="stage__mono" />
              <Photo key={`c-${current.key}`} src={current.image} alt={current.title} className="stage__color" />
              <div className="stage__vignette" />
              <div className="stage__caption" key={`cap-${current.key}`}>
                <p className="stage__when">
                  {current.date ? `${current.date.weekday}, ${current.date.day} ${current.date.month} ${current.date.year}` : "Date to be announced"}
                </p>
                <p className="stage__city">{current.city || current.title}</p>
              </div>
            </div>
            <div className="stage__info" key={`info-${current.key}`}>
              {current.description && <p>{current.description}</p>}
              <Venue key={current.key} show={current} />
            </div>
          </aside>
        )}
      </div>

      <section className="cta">
        <div className="cta__inner">
          <div>
            <h2>Bring the night to your city.</h2>
            <p>Private events, Public events and festivals . Get in touch to book Falita.</p>
          </div>
          <a className="pill" href="/#contact">Get in touch</a>
        </div>
      </section>
    </main>
  );
}
