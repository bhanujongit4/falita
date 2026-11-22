"use client";

import Image from "next/image";

export default function Interact() {
  function moveReveal(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
  }

  return (
    <main className="interact">
      <div className="interact__canvas" onPointerMove={moveReveal} onPointerDown={moveReveal}>
        <div className="interact__collage interact__collage--mono" aria-hidden="true">
          <Image src="/images/collagebg.png" alt="" fill priority sizes="100vw" />
        </div>
        <div className="interact__collage interact__collage--color" aria-hidden="true">
          <Image src="/images/collagebg.png" alt="" fill priority sizes="100vw" />
        </div>
        <div className="interact__shade" aria-hidden="true" />
        <div className="interact__top" aria-hidden="true" />
      </div>
      <style>{`
        .interact {
          --ink: #05060a;
          width: 100%;
          background: #000;
        }
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
        .interact__collage {
          position: absolute;
          inset: 0;
          z-index: -1;
        }
        .interact__collage img {
          object-fit: contain;
        }
        .interact__collage--mono img {
          filter: grayscale(1) brightness(0.62);
        }
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
        @media (max-width: 600px) {
          .interact__collage--color {
            -webkit-mask-image: radial-gradient(circle 118.75px at var(--pointer-x) var(--pointer-y), #000 0, transparent 100%);
            mask-image: radial-gradient(circle 118.75px at var(--pointer-x) var(--pointer-y), #000 0, transparent 100%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .interact__collage--color { transition: none; }
        }
      `}</style>
    </main>
  );
}
