"use client";

import { useEffect, useRef } from "react";

const CLICKABLE_SELECTOR = [
  "a[href]",
  "button:not(:disabled)",
  '[role="button"]',
  "summary",
  "select",
  'input[type="button"]',
  'input[type="submit"]',
  'input[type="reset"]',
  'input[type="checkbox"]',
  'input[type="radio"]',
  "label[for]",
].join(",");

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!cursor || !finePointer.matches) return;

    let frameId = 0;
    let pointerX = 0;
    let pointerY = 0;
    let isClickable = false;

    function moveCursor(event: PointerEvent) {
      const target = event.target;
      pointerX = event.clientX;
      pointerY = event.clientY;
      isClickable = Boolean(target instanceof Element && target.closest(CLICKABLE_SELECTOR));

      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        const offsetX = isClickable ? 8 : 9;
        const offsetY = isClickable ? 13 : 5;
        cursor!.dataset.clickable = isClickable ? "true" : "false";
        cursor!.style.transform = `translate3d(${pointerX - offsetX}px, ${pointerY - offsetY}px, 0)`;
        cursor!.dataset.visible = "true";
        frameId = 0;
      });
    }

    function hideCursor() {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
      cursor!.dataset.visible = "false";
    }

    function pressCursor() {
      cursor!.dataset.pressed = "true";
    }

    function releaseCursor() {
      cursor!.dataset.pressed = "false";
    }

    window.addEventListener("pointermove", moveCursor, { passive: true });
    document.documentElement.addEventListener("mouseleave", hideCursor);
    window.addEventListener("blur", hideCursor);
    window.addEventListener("pointerdown", pressCursor, { passive: true });
    window.addEventListener("pointerup", releaseCursor, { passive: true });

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", moveCursor);
      document.documentElement.removeEventListener("mouseleave", hideCursor);
      window.removeEventListener("blur", hideCursor);
      window.removeEventListener("pointerdown", pressCursor);
      window.removeEventListener("pointerup", releaseCursor);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      data-visible="false"
      data-pressed="false"
      data-clickable="false"
      className="custom-pointer"
    />
  );
}
