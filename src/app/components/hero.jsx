"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const LINKS = [
  { label: "Music", href: "#music" },
  { label: "Live", href: "#live" },
  { label: "Journal", href: "#journal" },
  { label: "Contact", href: "#contact" },
];
const SPOTIFY = "https://open.spotify.com/artist/3iMVG3kOFKYLBbbR2mAX1o";

function Eq() {
  return (
    <span className="eq" aria-hidden="true">
      <i /><i /><i />
    </span>
  );
}

export default function Hero() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <main className="hero">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap');

        :root {
          --ink: #05060a;
          --bone: #f1ede6;
          --mute: rgba(241, 237, 230, 0.62);
          --line: rgba(241, 237, 230, 0.16);
          --teal: #3fd4e6;
          --violet: #7a4dff;
          --amber: #ff9a4d;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: var(--ink); }

        .hero {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          background: var(--ink);
          color: var(--bone);
          font-family: Helvetica, Arial, sans-serif;
          isolation: isolate;
        }

        /* ---------- Image layer ---------- */
        .hero__image {
          position: absolute;
          top: 0;
          right: 0;
          height: 100%;
          width: 78%;
          z-index: 0;
        }
        .hero__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 85% center;
          display: block;
          -webkit-mask-image:
            linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 22%, #000 55%),
            linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%);
          -webkit-mask-composite: source-in;
          mask-image:
            linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 22%, #000 55%),
            linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%);
          mask-composite: intersect;
          filter: saturate(1.15) contrast(1.05);
        }

        /* ---------- Psychedelic haze ---------- */
        .haze {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          mix-blend-mode: screen;
        }
        .haze span {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.32;
          will-change: transform;
        }
        .haze span:nth-child(1) {
          width: 38vw; height: 38vw;
          right: 18%; top: 4%;
          background: radial-gradient(circle, var(--teal), transparent 65%);
          animation: drift1 22s ease-in-out infinite alternate;
        }
        .haze span:nth-child(2) {
          width: 34vw; height: 34vw;
          right: -6%; bottom: 0%;
          background: radial-gradient(circle, var(--violet), transparent 65%);
          animation: drift2 28s ease-in-out infinite alternate;
        }
        .haze span:nth-child(3) {
          width: 22vw; height: 22vw;
          right: 34%; top: 38%;
          background: radial-gradient(circle, var(--amber), transparent 65%);
          opacity: 0.16;
          animation: drift3 34s ease-in-out infinite alternate;
        }
        @keyframes drift1 {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(-6vw, 5vh) scale(1.2); }
        }
        @keyframes drift2 {
          from { transform: translate(0, 0) scale(1.1); }
          to   { transform: translate(-5vw, -6vh) scale(0.9); }
        }
        @keyframes drift3 {
          from { transform: translate(0, 0); }
          to   { transform: translate(5vw, 7vh); }
        }

        /* ---------- Darkening + grain ---------- */
        .shade {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background:
            linear-gradient(90deg, var(--ink) 0%, var(--ink) 30%, rgba(5,6,10,0.55) 40%, transparent 45%);
        }
        .grain {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          opacity: 0.09;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
        }

        /* ---------- Nav (desktop) ---------- */
        .nav {
          position: relative;
          z-index: 5;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 0.5rem clamp(1.5rem, 5vw, 4.5rem);
          background: linear-gradient(to bottom, rgba(5,6,10,0.55), transparent);
        }
        /* hairline that fades out at both ends */
        .nav::after {
          content: "";
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--line) 20%, var(--line) 80%, transparent);
          pointer-events: none;
        }
        .logo { justify-self: start; display: inline-block; color: var(--bone); text-decoration: none; }

        .nav__links {
          display: flex;
          gap: clamp(2rem, 3.4vw, 3.4rem);
          list-style: none;
        }
        .nav a.link {
          position: relative;
          display: inline-block;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.3rem;
          letter-spacing: -0.01em;
          color: var(--bone);
          text-decoration: none;
          transition: opacity 320ms ease;
        }
        /* a small lit dot marks the link in focus */
        .nav a.link::before {
          content: "";
          position: absolute;
          left: -0.95rem;
          top: 50%;
          width: 5px;
          height: 5px;
          margin-top: -2.5px;
          border-radius: 50%;
          background: var(--teal);
          box-shadow: 0 0 10px var(--teal);
          transform: scale(0);
          transition: transform 360ms cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        .nav a.link:hover::before,
        .nav a.link:focus-visible::before { transform: scale(1); }
        @media (hover: hover) {
          .nav__links:hover a.link:not(:hover) { opacity: 0.4; }
        }

        .nav__cta {
          justify-self: end;
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.55rem 1.15rem 0.55rem 0.95rem;
          border: 1px solid rgba(241, 237, 230, 0.28);
          border-radius: 999px;
          color: var(--bone);
          text-decoration: none;
          font-size: 0.92rem;
          letter-spacing: 0.02em;
          transition: background 300ms ease, color 300ms ease, border-color 300ms ease;
        }
        .nav__cta:hover,
        .nav__cta:focus-visible { background: var(--bone); color: var(--ink); border-color: var(--bone); }

        .eq { display: inline-flex; align-items: flex-end; gap: 2px; height: 0.8rem; }
        .eq i {
          display: block;
          width: 2px;
          height: 100%;
          border-radius: 1px;
          background: currentColor;
          transform-origin: bottom;
        }
        .eq i:nth-child(1) { transform: scaleY(0.45); }
        .eq i:nth-child(2) { transform: scaleY(1); }
        .eq i:nth-child(3) { transform: scaleY(0.7); }
        .nav__cta:hover .eq i,
        .nav__cta:focus-visible .eq i,
        .menu__listen:hover .eq i { animation: eq 800ms ease-in-out infinite alternate; }
        .eq i:nth-child(2) { animation-delay: -260ms; }
        .eq i:nth-child(3) { animation-delay: -520ms; }
        @keyframes eq { from { transform: scaleY(0.3); } to { transform: scaleY(1); } }

        .menu-btn, .menu { display: none; }

        .nav a:focus-visible, .menu a:focus-visible, .menu-btn:focus-visible {
          outline: 2px solid var(--teal);
          outline-offset: 3px;
        }

        /* ---------- Content ---------- */
        .content {
          position: relative;
          z-index: 5;
          min-height: calc(100vh - 6.5rem);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 clamp(1.5rem, 5vw, 4.5rem) 6rem;
          max-width: 760px;
        }
        .title {
          position: relative;
          top: 2.5rem;
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 400;
          font-size: clamp(3.2rem, 7.6vw, 7rem);
          line-height: 0.98;
          letter-spacing: -0.02em;
          color: var(--bone);
          animation: rise 1.4s cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }
        .lede {
          margin-top: 5rem;
          max-width: 31rem;
          font-size: clamp(1rem, 1.25vw, 1.12rem);
          line-height: 1.7;
          font-weight: 300;
          color: var(--mute);
          animation: rise 1.4s 0.15s cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }
        @keyframes rise {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ---------- Mobile + tablet: full-bleed photo, type at the bottom ---------- */
        @media (max-width: 900px) {
          .hero { display: flex; flex-direction: column; min-height: 100svh; }
          .haze, .grain { display: none; }

          .hero__image { inset: 0 0 auto 0; width: 100%; height: 84svh; }
          .hero__image img {
            object-position: 72% 30%;
            -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 58%, transparent 100%);
            mask-image: linear-gradient(to bottom, #000 0%, #000 58%, transparent 100%);
            -webkit-mask-composite: source-over;
            mask-composite: add;
          }
          .shade {
            background: linear-gradient(
              to bottom,
              rgba(5,6,10,0.6) 0%,
              transparent 24%,
              transparent 42%,
              rgba(5,6,10,0.8) 74%,
              var(--ink) 100%
            );
          }

          .nav {
            position: absolute;
            z-index: 20;
            top: 0; left: 0; right: 0;
            display: flex;
            justify-content: space-between;
            padding: 0.7rem 1.25rem;
            background: none;
          }
          .nav::after, .nav__links, .nav__cta { display: none; }
          .logo { position: relative; z-index: 2; }
          .logo img { display: block; width: 4.6rem; height: auto; }

          .menu-btn {
            position: relative;
            z-index: 2;
            display: grid;
            width: 2.7rem;
            height: 2.7rem;
            place-items: center;
            border: 1px solid rgba(241, 237, 230, 0.28);
            border-radius: 50%;
            background: rgba(5, 6, 10, 0.35);
            -webkit-backdrop-filter: blur(6px);
            backdrop-filter: blur(6px);
            color: var(--bone);
            cursor: pointer;
          }
          .bars { position: relative; display: block; width: 1rem; height: 1px; }
          .bars::before, .bars::after {
            content: "";
            position: absolute;
            left: 0;
            width: 100%;
            height: 1px;
            background: var(--bone);
            transition: top 280ms ease, transform 380ms cubic-bezier(0.2, 0.7, 0.2, 1);
          }
          .bars::before { top: -3px; }
          .bars::after  { top: 3px; }
          .menu-btn[aria-expanded="true"] .bars::before { top: 0; transform: rotate(45deg); }
          .menu-btn[aria-expanded="true"] .bars::after  { top: 0; transform: rotate(-45deg); }

          /* full-screen menu */
          .menu {
            position: fixed;
            inset: 0;
            z-index: 1;
            display: flex;
            flex-direction: column;
            padding: 6.5rem 1.5rem 2rem;
            background: rgba(5, 6, 10, 0.97);
            opacity: 0;
            visibility: hidden;
            transition: opacity 350ms ease, visibility 0s 350ms;
          }
          .menu--open { opacity: 1; visibility: visible; transition: opacity 350ms ease, visibility 0s; }
          .menu ul { list-style: none; border-top: 1px solid var(--line); }
          .menu li {
            border-bottom: 1px solid var(--line);
            opacity: 0;
            transform: translateY(14px);
            transition: opacity 250ms ease, transform 250ms ease;
          }
          .menu--open li {
            opacity: 1;
            transform: none;
            transition: opacity 600ms ease, transform 600ms cubic-bezier(0.2, 0.7, 0.2, 1);
            transition-delay: calc(var(--i) * 70ms + 120ms);
          }
          .menu li a {
            display: block;
            padding: 1rem 0;
            font-family: 'Playfair Display', Georgia, serif;
            font-size: clamp(2.1rem, 9vw, 3rem);
            letter-spacing: -0.02em;
            color: var(--bone);
            text-decoration: none;
          }
          .menu__listen {
            display: inline-flex;
            align-items: center;
            gap: 0.7rem;
            margin-top: auto;
            color: var(--mute);
            text-decoration: none;
            font-size: 0.95rem;
          }

          .content {
            flex: 1;
            max-width: none;
            min-height: 0;
            justify-content: flex-end;
            padding: 0 1.4rem 2.6rem;
          }
          .title {
            top: 0;
            font-size: clamp(2.9rem, 13.5vw, 5rem);
            line-height: 1;
          }
          .title span { display: block; }
          .lede {
            margin-top: 1.4rem;
            max-width: 26rem;
            font-size: 0.98rem;
            line-height: 1.6;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .haze span, .title, .lede { animation: none !important; }
          .menu, .menu li, .bars::before, .bars::after { transition: none !important; }
          .eq i { animation: none !important; }
        }
      `}</style>

      {/* Image + effects */}
      <div className="hero__image">
        <picture>
          <source media="(max-width: 900px)" srcSet="/images/heromobile.jpg" />
          <Image src="/images/hifalita.jpeg" alt="Vocalist on stage under starburst lights" fill priority sizes="(max-width: 900px) 100vw, 78vw" />
        </picture>
      </div>
      <div className="haze" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="shade" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      {/* Nav */}
      <nav className="nav">
        <a href="/" className="logo" aria-label="Hifalita home">
          <Image src="/assets/whiteautog.png" alt="Hifalita" width={120} height={87} priority />
        </a>

        <ul className="nav__links">
          {LINKS.map((l) => (
            <li key={l.href}><a className="link" href={l.href}>{l.label}</a></li>
          ))}
        </ul>

        <a className="nav__cta" href={SPOTIFY} target="_blank" rel="noreferrer">
          <Eq /> Listen
        </a>

        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="bars" />
        </button>

        <div id="site-menu" className={`menu${open ? " menu--open" : ""}`}>
          <ul>
            {LINKS.map((l, i) => (
              <li key={l.href} style={{ "--i": i }}>
                <a href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
              </li>
            ))}
          </ul>
          <a className="menu__listen" href={SPOTIFY} target="_blank" rel="noreferrer">
            <Eq /> Listen on Spotify
          </a>
        </div>
      </nav>

      {/* Copy */}
      <section className="content">
        <h1 className="title">
          <span>Vocals that</span>{' '}<span>ring through</span>{' '}<span>time</span>
        </h1>
        <p className="lede">
          Downtempo beats, deep bass and a voice that sits close to the mic.
          Live sessions, new releases and late-night sets, all in one place.
        </p>
      </section>
    </main>
  );
}
