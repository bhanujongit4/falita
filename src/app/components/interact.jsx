"use client";

import Image from "next/image";
import StoryLinks from "./story-links";

const LINKS = [
  { name: "Instagram", note: "Follow along", tint: "#d9567f", href: "https://www.instagram.com/falita.sings/?hl=en" },
  { name: "YouTube", note: "Watch performances", tint: "#ff5a4d", href: "https://www.youtube.com/channel/UCIxtpNCsWzQydg7UKcB2IJg" },
  { name: "BookMyShow", note: "Find live shows", tint: "#f84464", href: "https://in.bookmyshow.com/person/falita-chowdhary/2059259" },
  { name: "Spotify", note: "Listen to the music", tint: "#3fd16f", href: "https://open.spotify.com/artist/3iMVG3kOFKYLBbbR2mAX1o?si=dyrCERAXRxedcqKndKuIgQ&utm_source=copy-link" },
];

export default function Interact() {
  function moveReveal(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
  }

  // Same idea as the collage reveal: a soft glow follows the pointer along the row
  function trackRow(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--row-x", `${event.clientX - bounds.left}px`);
  }

  return (
    <main className="interact">
      <section className="interact__social" aria-label="Connect with Falita">
        <div className="interact__social-heading">
          <h2>Find Falita<br />{" "}out there.</h2>
          <span>Follow, listen, watch, and catch a show.</span>
        </div>
        <div className="interact__social-links">
          {LINKS.map((link) => (
            <a
              key={link.name}
              className="social-row"
              style={{ "--tint": link.tint }}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              onPointerMove={trackRow}
            >
              <span className="social-row__name">{link.name}</span>
              <span className="social-row__note">{link.note}</span>
              <span className="social-row__go" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <div className="interact__canvas" onPointerMove={moveReveal} onPointerDown={moveReveal}>
        <div className="interact__collage interact__collage--mono" aria-hidden="true">
          <Image src="/images/collagebgdark.png" alt="" fill priority sizes="100vw" />
        </div>
        <div className="interact__collage interact__collage--color" aria-hidden="true">
          <Image src="/images/collagebgdark.png" alt="" fill priority sizes="100vw" />
        </div>
        <div className="interact__shade" aria-hidden="true" />
        <div className="interact__top" aria-hidden="true" />
        <article className="interact__poem" id="story">
          <div className="interact__poem-copy">
            <p>
              I celebrate myself, and sing myself,<br />
              And what I assume you shall assume,<br />
              For every atom belonging to me as good belongs to you.
            </p>
            <p>
              I loafe and invite my soul,<br />
              I lean and loafe at my ease observing a spear of summer grass.
            </p>
            <p>
              My tongue, every atom of my blood, form’d from this soil, this air,<br />
              Born here of parents born here from parents the same, and their music the same.
            </p>
          </div>
          <StoryLinks onPointerMove={trackRow} />
        </article>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&display=swap');

        .interact {
          --ink: #05060a;
          --cream: #f1ede6;
          width: 100%;
          background: #000;
        }

        /* ---------- Social: a quiet typographic index ---------- */
        .interact__social {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.7fr);
          gap: clamp(2rem, 6vw, 6rem);
          align-items: center;
          padding: clamp(2.1rem, 4.6vw, 4.25rem) clamp(1.25rem, 5vw, 4.5rem);
          color: var(--cream);
          background: var(--ink);
          font-family: Helvetica, Arial, sans-serif;
        }
        .interact__social-heading { max-width: 22rem; }
        .interact__social-heading h2 {
          margin: 0;
          font-size: clamp(1.9rem, 3.6vw, 3rem);
          font-weight: 300;
          line-height: 1.04;
          letter-spacing: -0.045em;
        }
        .interact__social-heading span {
          display: block;
          margin-top: 1rem;
          color: rgba(241, 237, 230, 0.55);
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .interact__social-links {
          display: flex;
          flex-direction: column;
          border-top: 1px solid rgba(241, 237, 230, 0.16);
        }
        .social-row {
          --row-x: 50%;
          position: relative;
          isolation: isolate;
          display: grid;
          grid-template-columns: 1fr auto 2.4rem;
          align-items: center;
          gap: 1.25rem;
          padding: clamp(1rem, 2vw, 1.5rem) 0;
          border-bottom: 1px solid rgba(241, 237, 230, 0.16);
          color: var(--cream);
          text-decoration: none;
          transition: opacity 320ms ease;
        }
        /* soft tinted glow that follows the pointer along the row */
        .social-row::before {
          content: "";
          position: absolute;
          inset: 0 -1rem;
          z-index: -1;
          background: radial-gradient(
            340px circle at var(--row-x) 50%,
            color-mix(in srgb, var(--tint) 20%, transparent),
            transparent 70%
          );
          opacity: 0;
          transition: opacity 320ms ease;
          pointer-events: none;
        }
        /* hairline that draws itself in the platform's colour */
        .social-row::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -1px;
          width: 100%;
          height: 1px;
          background: var(--tint);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 560ms cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        .social-row__name {
          font-size: clamp(1.6rem, 3.4vw, 2.9rem);
          font-weight: 300;
          letter-spacing: -0.045em;
          line-height: 1.05;
          transition: transform 420ms cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        .social-row__note {
          color: rgba(241, 237, 230, 0.5);
          font-size: 0.85rem;
          text-align: right;
          transition: color 320ms ease;
        }
        .social-row__go {
          display: grid;
          width: 2.4rem;
          height: 2.4rem;
          place-items: center;
          border: 1px solid rgba(241, 237, 230, 0.28);
          border-radius: 50%;
          font-size: 1rem;
          transition: background 320ms ease, color 320ms ease, border-color 320ms ease, transform 420ms cubic-bezier(0.2, 0.7, 0.2, 1);
        }

        .social-row:hover::before,
        .social-row:focus-visible::before { opacity: 1; }
        .social-row:hover::after,
        .social-row:focus-visible::after { transform: scaleX(1); }
        .social-row:hover .social-row__name,
        .social-row:focus-visible .social-row__name { transform: translateX(0.6rem); }
        .social-row:hover .social-row__note,
        .social-row:focus-visible .social-row__note { color: var(--cream); }
        .social-row:hover .social-row__go,
        .social-row:focus-visible .social-row__go {
          background: var(--cream);
          border-color: var(--cream);
          color: var(--ink);
          transform: rotate(45deg);
        }
        .social-row:focus-visible { outline: none; }

        /* the other rows step back while one is in focus */
        @media (hover: hover) {
          .interact__social-links:hover .social-row:not(:hover) { opacity: 0.35; }
        }

        /* ---------- Collage reveal (unchanged) ---------- */
        .interact__top {
          position: absolute;
          z-index: 0;
          inset: 0 0 auto;
          height: clamp(4rem, 12vh, 8rem);
          background: linear-gradient(to bottom, #000 0%, rgba(0, 0, 0, 0.72) 38%, transparent 100%);
          pointer-events: none;
        }
        .interact__canvas {
          --pointer-x: -1000px;
          --pointer-y: -1000px;
          position: relative;
          width: 100%;
          aspect-ratio: 2 / 3;
          overflow: hidden;
          isolation: isolate;
          background: var(--ink);
        }
        .interact__collage { position: absolute; inset: 0; z-index: -1; }
        .interact__collage img { object-fit: contain; }
        .interact__collage--mono img { filter: grayscale(1) brightness(0.27); }
        .interact__collage--color {
          -webkit-mask-image: radial-gradient(circle 168.75px at var(--pointer-x) var(--pointer-y), #000 0, transparent 100%);
          mask-image: radial-gradient(circle 168.75px at var(--pointer-x) var(--pointer-y), #000 0, transparent 100%);
          pointer-events: none;
        }
        .interact__shade {
          position: absolute;
          inset: 0;
          z-index: -1;
          background: rgba(0, 0, 0, 0.12);
          pointer-events: none;
        }
        .interact__poem {
          position: absolute;
          z-index: 2;
          inset: 0;
          display: flex;
          flex-direction: column;
          transform: translateY(5%);
          align-items: center;
          justify-content: flex-start;
          gap: clamp(5rem, 12.5vw, 11.25rem);
          padding: clamp(0.625rem, 2vh, 1.75rem) clamp(1.5rem, 6vw, 6rem) 4rem;
          color: var(--cream);
          text-align: center;
          text-shadow: 0 2px 18px rgba(0,0,0,0.8);
          pointer-events: none;
        }
        .interact__poem-copy {
          width: min(100%, 86rem);
          font-family: Montserrat, Helvetica, Arial, sans-serif;
          font-size: clamp(1.65rem, 3.8vw, 4.5rem);
          font-weight: 700;
          line-height: 1.38;
          letter-spacing: -0.025em;
          text-transform: uppercase;
        }
        .interact__poem-copy p { margin: 0; }
        .interact__poem-copy p + p { margin-top: clamp(0.85rem, 2vw, 1.5rem); }

        /* ---------- Responsive ---------- */
        @media (max-width: 800px) {
          .interact__social {
            grid-template-columns: 1fr;
            gap: 1.15rem;
            align-items: start;
            padding: clamp(1.5rem, 3vw, 2.25rem) clamp(1rem, 4vw, 2rem);
          }
          .interact__social-heading { max-width: none; }
          .interact__social-heading h2 br { display: none; }
        }
        @media (max-width: 700px) {
          .interact__canvas { aspect-ratio: auto; }
          .interact__poem {
            position: relative;
            inset: auto;
            transform: none;
            min-height: 150vw;
          }
        }
        @media (max-width: 600px) {
          .interact__social { gap: 0.8rem; padding: 1.35rem 1rem 1.5rem; }
          .interact__social-heading span { margin-top: 0.55rem; }
          .social-row { grid-template-columns: 1fr 2.1rem; gap: 0.2rem 1rem; }
          .social-row__note { grid-column: 1; grid-row: 2; text-align: left; font-size: 0.8rem; }
          .social-row__go { grid-column: 2; grid-row: 1 / span 2; width: 2.1rem; height: 2.1rem; }
          .interact__poem { gap: 2.5rem; padding: 0.35rem 0.7rem 1rem; }
          .interact__poem-copy { font-size: clamp(0.9rem, 4vw, 1.1rem); line-height: 1.28; letter-spacing: -0.035em; }
          .interact__poem-copy p + p { margin-top: 0.4rem; }
          .interact__collage--color {
            -webkit-mask-image: radial-gradient(circle 118.75px at var(--pointer-x) var(--pointer-y), #000 0, transparent 100%);
            mask-image: radial-gradient(circle 118.75px at var(--pointer-x) var(--pointer-y), #000 0, transparent 100%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .social-row, .social-row::before, .social-row::after,
          .social-row__name, .social-row__go { transition: none; }
          .social-row:hover .social-row__name { transform: none; }
        }
      `}</style>
    </main>
  );
}
