"use client";

import { useState } from "react";
import Image from "next/image";

/*
  One entry per future page. Today the last two point at external sites;
  when the pages exist, change `href` and set `external: false`.
  Add a preview image by setting `image` to a path in /public, e.g. "/images/story-preview.jpg".
  With `image: null` a soft gold placeholder shows instead.
  The preview copy below is placeholder text.
*/
const ITEMS = [
  {
    id: "story",
    title: "Read the story",
    note: "The artist behind the voice",
    preview: "Where the voice comes from: the early years, the influences, and the late nights that shaped the sound.",
    cta: "Read the story",
    href: "#story",
    external: false,
    image: null,
    alt: "",
  },
  {
    id: "performances",
    title: "Past performances",
    note: "Live sessions and stages",
    preview: "Live sessions and stage sets from over the years, all in one place.",
    cta: "Watch performances",
    href: "https://www.youtube.com/channel/UCIxtpNCsWzQydg7UKcB2IJg",
    external: true,
    image: null,
    alt: "",
  },
  {
    id: "shows",
    title: "Upcoming shows",
    note: "Find the next live date",
    preview: "Upcoming dates and ticket links, so you can catch the next live show.",
    cta: "See show dates",
    href: "https://in.bookmyshow.com/person/falita-chowdhary/2059259",
    external: true,
    image: null,
    alt: "",
  },
];

export default function StoryLinks({ onPointerMove }) {
  const [open, setOpen] = useState(null);

  function track(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--row-x", `${event.clientX - bounds.left}px`);
    if (onPointerMove) onPointerMove(event);
  }

  return (
    <>
      <div className="story-links" data-open={open !== null} role="list" aria-label="Explore Falita">
        {ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.id} className={`story-item${isOpen ? " is-open" : ""}`} role="listitem">
              <h3 className="story-item__heading">
                <button
                  type="button"
                  className="story-item__trigger"
                  id={`story-trigger-${item.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`story-panel-${item.id}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  onPointerMove={track}
                >
                  <span className="story-item__name">{item.title}</span>
                  <span className="story-item__note">{item.note}</span>
                  <span className="story-item__go" aria-hidden="true" />
                </button>
              </h3>

              <div
                className="story-item__panel"
                id={`story-panel-${item.id}`}
                role="region"
                aria-labelledby={`story-trigger-${item.id}`}
              >
                <div className="story-item__clip">
                  <div className="story-item__body">
                    <div className="story-item__media">
                      {item.image ? (
                        <Image src={item.image} alt={item.alt} fill sizes="(max-width: 700px) 100vw, 19rem" />
                      ) : (
                        <span className="story-item__placeholder" aria-hidden="true" />
                      )}
                    </div>
                    <div className="story-item__text">
                      <p>{item.preview}</p>
                      <a
                        className="story-item__cta"
                        href={item.href}
                        {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
                      >
                        {item.cta}
                        {item.external && <span aria-hidden="true">↗</span>}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .story-links {
          --gold: #e6c889;
          --cream: #f1ede6;
          --ink: #05060a;
          display: flex;
          flex-direction: column;
          width: min(100%, 86rem);
          border-top: 1px solid rgba(241, 237, 230, 0.16);
          color: var(--cream);
          font-family: Helvetica, Arial, sans-serif;
          pointer-events: auto;
        }
        .story-item {
          position: relative;
          border-bottom: 1px solid rgba(241, 237, 230, 0.16);
        }
        /* gold line that draws in under the open or hovered row */
        .story-item::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -1px;
          width: 100%;
          height: 1px;
          background: var(--gold);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 560ms cubic-bezier(0.2, 0.7, 0.2, 1);
          pointer-events: none;
        }
        .story-item.is-open::after,
        .story-item:has(.story-item__trigger:hover)::after,
        .story-item:has(.story-item__trigger:focus-visible)::after { transform: scaleX(1); }

        .story-item__heading { font: inherit; }

        /* ---------- Row ---------- */
        .story-item__trigger {
          --row-x: 50%;
          position: relative;
          isolation: isolate;
          display: grid;
          grid-template-columns: 1fr auto 2.4rem;
          align-items: center;
          gap: 1.25rem;
          width: 100%;
          padding: clamp(1.5rem, 2.4vw, 2rem) 0.4rem;
          border: 0;
          background: none;
          color: inherit;
          font: inherit;
          text-align: left;
          cursor: pointer;
        }
        .story-item__trigger::before {
          content: "";
          position: absolute;
          inset: 0 -1rem;
          z-index: -1;
          background: radial-gradient(340px circle at var(--row-x) 50%, color-mix(in srgb, var(--gold) 18%, transparent), transparent 70%);
          opacity: 0;
          transition: opacity 320ms ease;
          pointer-events: none;
        }
        .story-item__trigger:hover::before,
        .story-item__trigger:focus-visible::before { opacity: 1; }
        .story-item__trigger:focus-visible { outline: none; }

        .story-item__name {
          font-size: clamp(1.6rem, 3.4vw, 2.9rem);
          font-weight: 300;
          letter-spacing: -0.045em;
          line-height: 1.05;
          transition: transform 420ms cubic-bezier(0.2, 0.7, 0.2, 1), opacity 320ms ease;
        }
        .story-item__note {
          color: rgba(241, 237, 230, 0.5);
          font-size: 0.85rem;
          text-align: right;
          transition: color 320ms ease;
        }
        .story-item__trigger:hover .story-item__name,
        .story-item__trigger:focus-visible .story-item__name { transform: translateX(0.6rem); opacity: 1; }
        .story-item__trigger:hover .story-item__note,
        .story-item__trigger:focus-visible .story-item__note,
        .story-item.is-open .story-item__note { color: var(--cream); }

        /* once one row is open, the closed ones step back */
        .story-links[data-open="true"] .story-item:not(.is-open) .story-item__name { opacity: 0.5; }

        /* plus that becomes a minus */
        .story-item__go {
          position: relative;
          width: 2.4rem;
          height: 2.4rem;
          border: 1px solid rgba(241, 237, 230, 0.28);
          border-radius: 50%;
          transition: background 320ms ease, border-color 320ms ease, color 320ms ease;
        }
        .story-item__go::before,
        .story-item__go::after {
          content: "";
          position: absolute;
          inset: 0;
          width: 0.85rem;
          height: 1px;
          margin: auto;
          background: currentColor;
          transition: transform 420ms cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        .story-item__go::after { transform: rotate(90deg); }
        .story-item.is-open .story-item__go::after { transform: rotate(0deg); }
        .story-item__trigger:hover .story-item__go,
        .story-item__trigger:focus-visible .story-item__go,
        .story-item.is-open .story-item__go {
          background: var(--cream);
          border-color: var(--cream);
          color: var(--ink);
        }

        /* ---------- Panel ---------- */
        .story-item__panel {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 520ms cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        .story-item.is-open .story-item__panel { grid-template-rows: 1fr; }
        .story-item__clip {
          min-height: 0;
          overflow: hidden;
          visibility: hidden;
          transition: visibility 0s 520ms;
        }
        .story-item.is-open .story-item__clip { visibility: visible; transition: visibility 0s; }

        .story-item__body {
          display: grid;
          grid-template-columns: minmax(0, 19rem) minmax(0, 1fr);
          gap: clamp(1.25rem, 3vw, 3rem);
          align-items: end;
          padding: 0.5rem 0 clamp(1.5rem, 3vw, 2.25rem);
        }
        .story-item__media {
          position: relative;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          border-radius: 0.4rem;
          clip-path: inset(0 0 100% 0);
          transition: clip-path 700ms cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        .story-item.is-open .story-item__media { clip-path: inset(0); transition-delay: 140ms; }
        .story-item__media img {
          object-fit: cover;
          transform: scale(1.12);
          transition: transform 1100ms cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        .story-item.is-open .story-item__media img { transform: scale(1); }
        .story-item__placeholder {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(120% 90% at 20% 15%, rgba(230, 200, 137, 0.35), transparent 60%),
            linear-gradient(160deg, #15161c, #0a0b10);
        }

        .story-item__text {
          display: grid;
          justify-items: start;
          gap: 1.4rem;
          max-width: 32rem;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 250ms ease, transform 250ms ease;
        }
        .story-item.is-open .story-item__text {
          opacity: 1;
          transform: none;
          transition: opacity 600ms ease 220ms, transform 600ms cubic-bezier(0.2, 0.7, 0.2, 1) 220ms;
        }
        .story-item__text p {
          font-size: clamp(1rem, 1.25vw, 1.12rem);
          font-weight: 300;
          line-height: 1.65;
          color: rgba(241, 237, 230, 0.68);
        }
        .story-item__cta {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.65rem 1.2rem;
          border: 1px solid rgba(241, 237, 230, 0.28);
          border-radius: 999px;
          color: var(--cream);
          font-size: 0.92rem;
          letter-spacing: 0.02em;
          text-decoration: none;
          transition: background 300ms ease, color 300ms ease, border-color 300ms ease;
        }
        .story-item__cta:hover,
        .story-item__cta:focus-visible { background: var(--cream); border-color: var(--cream); color: var(--ink); }

        .story-item__trigger:focus-visible .story-item__go,
        .story-item__cta:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }

        /* ---------- Mobile ---------- */
        @media (max-width: 700px) {
          .story-item__trigger { grid-template-columns: 1fr 2.1rem; gap: 0.2rem 1rem; padding: 0.7rem 0.35rem; }
          .story-item__name { font-size: 1.15rem; }
          .story-item__note { grid-column: 1; grid-row: 2; text-align: left; font-size: 0.72rem; }
          .story-item__go { grid-column: 2; grid-row: 1 / span 2; width: 2.1rem; height: 2.1rem; }
          .story-item__body { grid-template-columns: 1fr; gap: 1.1rem; align-items: start; }
          .story-item__media { aspect-ratio: 16 / 10; }
        }
        @media (prefers-reduced-motion: reduce) {
          .story-item::after, .story-item__trigger::before, .story-item__name, .story-item__go,
          .story-item__go::before, .story-item__go::after, .story-item__panel, .story-item__clip,
          .story-item__media, .story-item__media img, .story-item__text { transition: none !important; }
          .story-item__trigger:hover .story-item__name { transform: none; }
        }
      `}</style>
    </>
  );
}
