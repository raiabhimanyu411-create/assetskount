import React, { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import styles from "../pages/Pages.module.css";
import { Brand, withBrand } from "./Brand.jsx";

const HeroScene = lazy(() => import("./HeroScene.jsx"));

const PHOTO_SIZES = {
  "tablet-review": [806, 941],
  "shelf-check": [676, 941],
  "counter-scan": [787, 941],
  "laptop-review": [798, 941],
  "team-planning": [814, 941],
  "client-meeting": [757, 941],
};

export function Arrow({ diagonal = false }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {diagonal
        ? <path d="M5 15 15 5M6 5h9v9" />
        : <path d="M3.5 10h12m-5-5 5 5-5 5" />}
    </svg>
  );
}

// Cropped, web-optimised photography. `wide` uses the uncropped frame.
export function Photo({ name, alt = "", wide = false, priority = false, sizes = "(max-width: 680px) 100vw, 50vw", ...props }) {
  const [width, height] = wide ? [1672, 941] : PHOTO_SIZES[name];
  const base = `/assets/photos/${name}`;
  return (
    <img
      src={wide ? `${base}-wide.webp` : `${base}.webp`}
      srcSet={wide ? undefined : `${base}-sm.webp 480w, ${base}.webp ${width}w`}
      sizes={wide ? undefined : sizes}
      width={width}
      height={height}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      {...props}
    />
  );
}

// A heading whose lines rise out of a mask as it scrolls into view.
export function Lines({ as: Tag = "h2", lines, hero = false, className }) {
  return (
    <Tag className={className} data-lines="" data-hero-lines={hero ? "" : undefined}>
      {lines.map((line, index) => (
        <span className={styles.line} data-line="" key={index}><span>{line}</span></span>
      ))}
    </Tag>
  );
}

export function Kicker({ children, hero = false }) {
  return <p className={styles.kicker} {...(hero ? { "data-hero-item": "" } : { "data-reveal": "" })}><span />{children}</p>;
}

export function AmbientScene() {
  return (
    <div className={styles.ambientScene} aria-hidden="true">
      <Suspense fallback={null}><HeroScene variant="ambient" className={styles.ambientCanvas} /></Suspense>
    </div>
  );
}

export function PageHero({ number, category, title, accent, description, photo, photoAlt = "", action = "Request a demo", actionTo = "/contact" }) {
  return (
    <section className={styles.pageHero}>
      <AmbientScene />
      <div className={styles.heroCopy}>
        <Kicker hero>{category}</Kicker>
        <span className={styles.heroNumber} data-hero-item="">{number} <i /> <Brand /> / STOCKTAKE WORKSPACE</span>
        <Lines as="h1" hero lines={[title, <em key="accent">{accent}</em>]} />
        <p data-hero-item="">{withBrand(description)}</p>
        <Link className={styles.buttonPrimary} to={actionTo} data-hero-item="" data-magnetic="">{action}<Arrow /></Link>
      </div>
      <div className={styles.heroVisual} data-hero-item="" data-tilt="5">
        <Photo name={photo} alt={photoAlt} priority data-parallax="0.06" />
        <div className={styles.visualShade} />
        <div className={styles.scanFrame} aria-hidden="true"><i /><i /><i /><i /></div>
        <div className={styles.imageIndex}><span>{number}</span><i /> COUNT WITH CLARITY</div>
        <div className={styles.scanLine} />
      </div>
    </section>
  );
}

export function SectionHeading({ kicker, title, accent, copy }) {
  return (
    <div className={styles.sectionHeading}>
      <Kicker>{kicker}</Kicker>
      <Lines lines={[title, <em key="accent">{accent}</em>]} />
      {copy && <p data-reveal="">{withBrand(copy)}</p>}
    </div>
  );
}

export function NextStep({ kicker = "YOUR NEXT STEP", title = "Start with what matters most.", copy = "Bring your locations, inventory and questions. Together, shape a practical first stocktake." }) {
  return (
    <section className={styles.nextStep}>
      <div className={styles.nextStepGlow} aria-hidden="true" />
      <div>
        <Kicker>{kicker}</Kicker>
        <h2 data-reveal="">{title}</h2>
        <p data-reveal="">{copy}</p>
      </div>
      <Link className={styles.buttonLight} to="/contact" data-magnetic="">Request a product demo <Arrow diagonal /></Link>
    </section>
  );
}

export function Marquee({ items }) {
  const row = items.flatMap((item, index) => [
    <span key={`t${index}`}>{item}</span>,
    <b key={`s${index}`} aria-hidden="true">✳</b>,
  ]);
  return (
    <div className={styles.logoStatement}>
      <div className={styles.marqueeTrack} aria-hidden="true">
        <div>{row}</div><div>{row}</div>
      </div>
      <p className={styles.visuallyHidden}>{items.join(" · ")}</p>
    </div>
  );
}

export function Steps({ items }) {
  return (
    <div className={styles.logoStatement}>
      <div className={styles.stepsTrack} data-stagger="">
        {items.flatMap((item, index) => [
          index > 0 && <b key={`a${index}`} aria-hidden="true">→</b>,
          <span key={item}>{item}</span>,
        ]).filter(Boolean)}
      </div>
    </div>
  );
}
