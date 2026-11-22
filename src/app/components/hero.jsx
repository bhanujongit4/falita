import Image from 'next/image';

export default function Hero() {
  return (
    <main className="hero">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600&display=swap');

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
          font-family: 'Manrope', system-ui, sans-serif;
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
          padding: 2rem clamp(1.5rem, 5vw, 4.5rem);
        }
        .logo {
          font-family: 'Instrument Serif', serif;
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
        .nav a.link {
          color: var(--mute);
          text-decoration: none;
          font-size: 0.92rem;
          font-weight: 400;
          transition: color 0.25s ease;
        }
        .nav a.link:hover,
        .nav a.link:focus-visible { color: var(--bone); }

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
          font-family: 'Instrument Serif', serif;
          font-weight: 400;
          font-size: clamp(3.2rem, 7.6vw, 7rem);
          line-height: 0.98;
          letter-spacing: -0.02em;
          color: var(--bone);
          animation: rise 1.4s cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }
        .title em { font-style: italic; }

        .lede {
          margin-top: 1.8rem;
          max-width: 31rem;
          font-size: clamp(1rem, 1.25vw, 1.12rem);
          line-height: 1.7;
          font-weight: 300;
          color: var(--mute);
          animation: rise 1.4s 0.15s cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }

        .actions {
          margin-top: 2.6rem;
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
          animation: rise 1.4s 0.3s cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.95rem 1.7rem;
          border-radius: 999px;
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .btn--solid {
          background: var(--bone);
          color: var(--ink);
          border: 1px solid var(--bone);
        }
        .btn--solid:hover,
        .btn--solid:focus-visible {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px -8px rgba(63, 212, 230, 0.55);
        }
        .btn--ghost {
          background: rgba(241, 237, 230, 0.04);
          color: var(--bone);
          border: 1px solid var(--line);
          backdrop-filter: blur(8px);
        }
        .btn--ghost:hover,
        .btn--ghost:focus-visible {
          border-color: rgba(241, 237, 230, 0.5);
          background: rgba(241, 237, 230, 0.09);
        }
        .btn:focus-visible, .nav a:focus-visible {
          outline: 2px solid var(--teal);
          outline-offset: 3px;
        }
        .play {
          width: 0; height: 0;
          border-left: 9px solid currentColor;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
        }

        /* ---------- Now playing strip ---------- */
        .track {
          position: absolute;
          z-index: 5;
          left: clamp(1.5rem, 5vw, 4.5rem);
          bottom: 2.4rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.85rem;
          color: var(--mute);
          animation: rise 1.4s 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }
        .eq {
          display: flex;
          align-items: flex-end;
          gap: 3px;
          height: 16px;
        }
        .eq i {
          display: block;
          width: 3px;
          background: var(--teal);
          border-radius: 2px;
          animation: eq 1.1s ease-in-out infinite;
        }
        .eq i:nth-child(1) { height: 40%; animation-delay: 0s; }
        .eq i:nth-child(2) { height: 90%; animation-delay: 0.2s; }
        .eq i:nth-child(3) { height: 60%; animation-delay: 0.4s; }
        .eq i:nth-child(4) { height: 80%; animation-delay: 0.1s; }
        @keyframes eq {
          0%, 100% { transform: scaleY(0.35); }
          50%      { transform: scaleY(1); }
        }
        .track b { color: var(--bone); font-weight: 500; }

        @keyframes rise {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 900px) {
          .nav ul { display: none; }
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
          .hero__image {
            top: 12%;
            right: 0;
            left: auto;
            width: 68%;
            height: 52%;
          }
          .hero__image img {
            object-fit: contain;
            object-position: right center;
          }
          .shade {
            background: linear-gradient(90deg, var(--ink) 0%, rgba(5,6,10,0.75) 38%, rgba(5,6,10,0.08) 100%),
                        linear-gradient(180deg, transparent 0%, rgba(5,6,10,0.18) 42%, var(--ink) 78%);
          }
          .content {
            min-height: calc(100svh - 6.5rem);
            max-width: 74%;
            justify-content: center;
            padding: 1rem 0 5.5rem 1.5rem;
          }
          .title { font-size: clamp(2.55rem, 10vw, 3.4rem); }
          .lede { max-width: 19rem; font-size: 0.95rem; }
          .actions { gap: 0.7rem; margin-top: 1.5rem; }
          .btn { padding: 0.8rem 1rem; font-size: 0.82rem; }
          .track { bottom: 1.4rem; font-size: 0.75rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .haze span, .eq i, .title, .lede, .actions, .track { animation: none !important; }
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
        <a href="#" className="logo">Hifalita</a>
        <ul>
          <li><a className="link" href="#music">Music</a></li>
          <li><a className="link" href="#live">Live</a></li>
          <li><a className="link" href="#journal">Journal</a></li>
          <li><a className="link" href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* Copy */}
      <section className="content">
        <h1 className="title">
          Slow songs for <em>the hours after midnight.</em>
        </h1>
        <p className="lede">
          Downtempo beats, deep bass and a voice that sits close to the mic.
          Live sessions, new releases and late-night sets, all in one place.
        </p>
        <div className="actions">
          <a href="#music" className="btn btn-solid btn--solid">
            <span className="play" aria-hidden="true" />
            Play latest single
          </a>
          <a href="#live" className="btn btn--ghost">See live dates</a>
        </div>
      </section>

      {/* Now playing */}
      <div className="track" aria-label="Now playing">
        <div className="eq" aria-hidden="true">
          <i /><i /><i /><i />
        </div>
        <span>Now playing <b>Glasshouse (Live Session)</b></span>
      </div>
    </main>
  );
}
