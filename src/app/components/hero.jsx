import Image from 'next/image';

export default function Hero() {
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

        /* ---------- Content ---------- */
        .nav {
          position: relative;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem clamp(1.5rem, 5vw, 4.5rem);
          background: rgba(5, 6, 10, 0.16);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
        }
        .logo {
          font-family: Helvetica, Arial, sans-serif;
          font-size: 1.6rem;
          letter-spacing: 0.01em;
          color: var(--bone);
          text-decoration: none;
        }
        .nav ul {
          display: flex;
          gap: 2.4rem;
          list-style: none;
        }
        .mobile-menu { display: none; }
        .nav a.link {
          display: inline-block;
          color: var(--bone);
          text-decoration: none;
          font-size: 1.242rem;
          font-weight: 400;
          transition: color 0.25s ease, transform 0.2s ease;
        }
        .nav a.link:hover,
        .nav a.link:focus-visible { color: var(--bone); }
        @media (min-width: 901px) {
          .nav a.link:hover,
          .nav a.link:focus-visible { transform: scale(1.2); }
        }

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
        .title em { font-style: italic; }

        .lede {
          margin-top: 5rem;
          max-width: 31rem;
          font-size: clamp(1rem, 1.25vw, 1.12rem);
          line-height: 1.7;
          font-weight: 300;
          color: var(--mute);
          animation: rise 1.4s 0.15s cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }

        .nav a:focus-visible {
          outline: 2px solid var(--teal);
          outline-offset: 3px;
        }

        @keyframes rise {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 900px) {
          .nav { padding: 1rem clamp(1rem, 4vw, 2rem); gap: 1rem; }
          .nav ul { display: flex; gap: clamp(0.5rem, 2vw, 1.25rem); }
          .nav a.link { font-size: clamp(0.918rem, 2.16vw, 1.161rem); }
          .logo img { display: block; width: clamp(4.5rem, 12vw, 7rem); height: auto; }
          .hero { min-height: 100svh; }
          .hero__image { inset: 0; width: 100%; height: 100%; }
          .hero__image img {
            object-fit: cover;
            object-position: center;
            -webkit-mask-image: none;
            mask-image: none;
          }
          .shade {
            background:
              linear-gradient(180deg, transparent 20%, rgba(5,6,10,0.15) 45%, rgba(5,6,10,0.8) 100%);
          }
          .content { justify-content: flex-end; padding-bottom: 7rem; }
        }

        @media (max-width: 600px) {
          .hero {
            display: grid;
            grid-template-columns: minmax(0, 1fr);
            grid-template-rows: auto auto auto auto;
            align-content: start;
            min-height: 100svh;
            padding-bottom: 4.5rem;
          }
          .nav {
            grid-row: 1;
            z-index: 20;
            padding: 0.45rem 1rem;
            min-height: 3.6rem;
          }
          .nav > ul { display: none; }
          .mobile-menu { display: block; position: relative; }
          .mobile-menu summary {
            display: flex;
            width: 2.5rem;
            height: 2.5rem;
            align-items: center;
            justify-content: center;
            list-style: none;
            cursor: pointer;
            border: 1px solid var(--line);
            border-radius: 50%;
            background: rgba(5,6,10,0.6);
          }
          .mobile-menu summary::-webkit-details-marker { display: none; }
          .hamburger, .hamburger::before, .hamburger::after {
            display: block;
            width: 1rem;
            height: 1px;
            background: var(--bone);
          }
          .hamburger { position: relative; }
          .hamburger::before, .hamburger::after { content: ''; position: absolute; left: 0; }
          .hamburger::before { top: -5px; }
          .hamburger::after { top: 5px; }
          .mobile-menu ul {
            position: absolute;
            top: calc(100% + 0.5rem);
            right: 0;
            z-index: 10;
            display: grid;
            gap: 0;
            min-width: 9rem;
            padding: 0.4rem;
            border: 1px solid var(--line);
            border-radius: 0.8rem;
            background: rgba(5,6,10,0.96);
            list-style: none;
          }
          .mobile-menu a {
            display: block;
            padding: 0.65rem 0.75rem;
            color: var(--bone);
            text-decoration: none;
            font-size: 1.152rem;
          }
          .logo img { width: 4.5rem; }
          .hero__image {
            grid-row: 3;
            position: relative;
            inset: auto;
            width: 100%;
            height: auto;
            aspect-ratio: 4 / 3;
            margin-top: 0.35rem;
          }
          .hero__image img {
            object-fit: cover;
            object-position: center 42%;
          }
          .shade, .haze, .grain { display: none; }
          .content {
            display: contents;
          }
          .title, .lede { position: relative; z-index: 5; }
          .title {
            grid-row: 2;
            top: 0;
            max-width: 100%;
            padding: 0.9rem 1rem 0.55rem;
            font-size: clamp(1.25rem, 7.2vw, 1.95rem);
            letter-spacing: -0.03em;
            line-height: 1.1;
            white-space: nowrap;
          }
          .title span { display: inline; }
          .title span::after { content: none; }
          .lede {
            grid-row: 4;
            max-width: 28rem;
            margin: 0.9rem 1.25rem 0;
            font-size: 0.88rem;
            line-height: 1.5;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .haze span, .title, .lede { animation: none !important; }
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
        <ul>
          <li><a className="link" href="#music">Music</a></li>
          <li><a className="link" href="#live">Live</a></li>
          <li><a className="link" href="#journal">Journal</a></li>
          <li><a className="link" href="#contact">Contact</a></li>
        </ul>
        <details className="mobile-menu">
          <summary aria-label="Open navigation menu"><span className="hamburger" /></summary>
          <ul>
            <li><a href="#music">Music</a></li>
            <li><a href="#live">Live</a></li>
            <li><a href="#journal">Journal</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </details>
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
