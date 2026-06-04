'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
const INTERACTIVE_SELECTORS =
  'a, button, input, textarea, select, label, [role="button"], [tabindex]';

export default function CustomCursorAndMenu() {
  const router = useRouter();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);
  const isClicking = useRef(false);
  const rafId = useRef<number>(0);

  // ── Smooth animation loop ──────────────────────────────────────────────────
  useEffect(() => {
    const animate = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!dot || !ring) {
        rafId.current = requestAnimationFrame(animate);
        return;
      }

      // If motion is reduced, set LERP to 1.0 (instant movement) to prevent animations
      const isReduced = document.documentElement.classList.contains('a11y-motion-reduced');
      const LERP = isReduced ? 1.0 : 0.10;

      dot.style.transform = `translate(${mousePos.current.x - 4}px, ${mousePos.current.y - 4}px)`;

      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * LERP;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * LERP;

      const ringSize = isHovering.current ? 48 : isClicking.current ? 14 : 32;
      ring.style.width = `${ringSize}px`;
      ring.style.height = `${ringSize}px`;
      ring.style.transform = `translate(${ringPos.current.x - ringSize / 2}px, ${ringPos.current.y - ringSize / 2}px)`;
      ring.style.opacity = isClicking.current ? '0.3' : '1';

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  // ── Mouse tracking ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      isHovering.current = !!(e.target as Element)?.closest(INTERACTIVE_SELECTORS);
    };
    const onMouseDown = () => { isClicking.current = true; };
    const onMouseUp = () => { isClicking.current = false; };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // ── Cancel native context menu on right-click ─────────────────────────────
  useEffect(() => {
    let rightClicks = 0;
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      rightClicks++;
      if (rightClicks >= 5) {
        router.push('/busted');
      }
    };
    window.addEventListener('contextmenu', onContextMenu);
    return () => window.removeEventListener('contextmenu', onContextMenu);
  }, [router]);

  return (
    <>
      {/* Cursor dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="custom-cursor pointer-events-none fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.8)]"
        style={{ willChange: 'transform' }}
      />

      {/* Cursor ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="custom-cursor pointer-events-none fixed top-0 left-0 z-[9998] rounded-full border border-cyan-400/60 shadow-[0_0_12px_2px_rgba(34,211,238,0.3)]"
        style={{
          width: 32,
          height: 32,
          transition:
            'width 200ms cubic-bezier(0.34,1.56,0.64,1), height 200ms cubic-bezier(0.34,1.56,0.64,1), opacity 150ms ease',
          willChange: 'transform',
        }}
      />
    </>
  );
}
