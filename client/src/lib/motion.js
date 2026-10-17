import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

const EASE = "expo.out";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

let lenis = null;

// The intro preloader resolves this; hero timelines wait for it so the
// entrance plays when the curtain lifts instead of underneath it.
let resolveIntro;
const introDone = new Promise((resolve) => { resolveIntro = resolve; });
export function finishIntro() { resolveIntro(); }
export function whenIntroDone() { return introDone; }

export function getLenis() { return lenis; }

export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) {
      finishIntro();
      return undefined;
    }

    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)) });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenis = null;
    };
  }, []);
}

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true });
  else window.scrollTo({ top: 0, behavior: immediate ? "instant" : "smooth" });
}

export function lockScroll(locked) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

/*
 * Declarative scroll animations. Markup opts in with data attributes:
 *   data-hero-item      staggered entrance once the intro finishes
 *   data-hero-3d        hero visual that swings into place in 3D
 *   data-lines          heading whose [data-line] children rise from a mask
 *   data-reveal         fade and rise when scrolled into view
 *   data-stagger        children fade and rise one after another, tipping up in 3D
 *   data-clip           wrapper wipes open, its image settles from a zoom
 *   data-parallax="n"   image drifts by n * 100% of its overflow while scrolling
 */
export function usePageAnimations(scopeRef, key) {
  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope || prefersReducedMotion()) return undefined;

    let cancelled = false;
    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray("[data-hero-item]", scope);
      const heroLines = gsap.utils.toArray("[data-hero-lines] [data-line] > span", scope);
      gsap.set(heroItems, { autoAlpha: 0, y: 28 });
      gsap.set(heroLines, { yPercent: 115 });
      const hero3d = gsap.utils.toArray("[data-hero-3d]", scope);
      gsap.set(hero3d, { autoAlpha: 0, y: 40, rotationX: 18, rotationY: -16, transformPerspective: 1400, transformOrigin: "60% 50%" });

      whenIntroDone().then(() => {
        if (cancelled) return;
        ctx.add(() => {
          const intro = gsap.timeline({ defaults: { ease: EASE } });
          intro
            .to(heroLines, { yPercent: 0, duration: 1.4, stagger: 0.09 }, 0.05)
            .to(heroItems, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.07, clearProps: "transform" }, 0.2)
            .to(hero3d, { autoAlpha: 1, y: 0, rotationX: 0, rotationY: 0, duration: 1.8, clearProps: "transform" }, 0.25);
        });
      });

      gsap.utils.toArray("[data-lines]:not([data-hero-lines])", scope).forEach((heading) => {
        gsap.from(heading.querySelectorAll("[data-line] > span"), {
          yPercent: 115,
          duration: 1.3,
          ease: EASE,
          stagger: 0.08,
          scrollTrigger: { trigger: heading, start: "top 88%" },
        });
      });

      gsap.utils.toArray("[data-reveal]", scope).forEach((element) => {
        gsap.from(element, {
          autoAlpha: 0,
          y: 36,
          duration: 1.2,
          ease: EASE,
          clearProps: "transform",
          scrollTrigger: { trigger: element, start: "top 90%" },
        });
      });

      gsap.utils.toArray("[data-stagger]", scope).forEach((group) => {
        gsap.from(group.children, {
          autoAlpha: 0,
          y: 44,
          rotationX: -16,
          transformPerspective: 1000,
          transformOrigin: "50% 0%",
          duration: 1.1,
          ease: EASE,
          stagger: 0.1,
          clearProps: "transform",
          scrollTrigger: { trigger: group, start: "top 86%" },
        });
      });

      gsap.utils.toArray("[data-clip]", scope).forEach((wrapper) => {
        const image = wrapper.querySelector("img");
        const timeline = gsap.timeline({ scrollTrigger: { trigger: wrapper, start: "top 85%" } });
        timeline.from(wrapper, { clipPath: "inset(18% 12% 18% 12%)", duration: 1.5, ease: "expo.inOut", clearProps: "clipPath" });
        // clearProps hands transform back to CSS so hover zooms keep working.
        if (image) timeline.from(image, { scale: 1.35, duration: 1.8, ease: "expo.out", clearProps: "transform" }, 0);
      });

      gsap.utils.toArray("[data-parallax]", scope).forEach((image) => {
        const amount = Number(image.dataset.parallax) || 0.12;
        gsap.fromTo(image, { yPercent: -amount * 100 }, {
          yPercent: amount * 100,
          ease: "none",
          scrollTrigger: { trigger: image.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }, scope);

    // Images arriving late change section heights; re-measure triggers.
    const refresh = () => ScrollTrigger.refresh();
    const images = scope.querySelectorAll("img");
    images.forEach((image) => { if (!image.complete) image.addEventListener("load", refresh, { once: true }); });
    const settle = window.setTimeout(refresh, 600);

    return () => {
      cancelled = true;
      window.clearTimeout(settle);
      images.forEach((image) => image.removeEventListener("load", refresh));
      ctx.revert();
    };
  }, [scopeRef, key]);
}

// Buttons drift a few pixels towards the pointer.
export function useMagnetic() {
  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(hover: hover)").matches) return undefined;

    function move(event) {
      const target = event.target.closest?.("[data-magnetic]");
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.22;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.3;
      gsap.to(target, { x, y, duration: 0.5, ease: "power3.out" });
    }

    function leave(event) {
      const target = event.target.closest?.("[data-magnetic]");
      if (target && !target.contains(event.relatedTarget)) {
        gsap.to(target, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, .4)" });
      }
    }

    document.addEventListener("pointermove", move);
    document.addEventListener("pointerout", leave);
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
    };
  }, []);
}

/*
 * Surfaces marked data-tilt lean towards the pointer in 3D. The angle goes to
 * --tilt-x / --tilt-y; each stylesheet decides how its element uses them, so
 * hover lifts and entrance animations keep working. data-tilt="n" sets the
 * maximum angle in degrees.
 */
export function useTilt() {
  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;

    let active = null;
    let frame = 0;
    let pending = null;

    function apply() {
      frame = 0;
      if (!pending) return;
      const { element, x, y } = pending;
      const max = Number(element.dataset.tilt) || 6;
      element.style.setProperty("--tilt-x", `${(-y * max).toFixed(2)}deg`);
      element.style.setProperty("--tilt-y", `${(x * max).toFixed(2)}deg`);
      element.style.setProperty("--glare-x", `${((x + 0.5) * 100).toFixed(1)}%`);
      element.style.setProperty("--glare-y", `${((y + 0.5) * 100).toFixed(1)}%`);
    }

    function reset(element) {
      if (pending?.element === element) pending = null;
      element.style.setProperty("--tilt-x", "0deg");
      element.style.setProperty("--tilt-y", "0deg");
    }

    function move(event) {
      const element = event.target.closest?.("[data-tilt]");
      if (active && active !== element) reset(active);
      active = element;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      pending = { element, x: (event.clientX - rect.left) / rect.width - 0.5, y: (event.clientY - rect.top) / rect.height - 0.5 };
      if (!frame) frame = requestAnimationFrame(apply);
    }

    function leave(event) {
      if (active && !active.contains(event.relatedTarget)) {
        reset(active);
        active = null;
      }
    }

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
    };
  }, []);
}
