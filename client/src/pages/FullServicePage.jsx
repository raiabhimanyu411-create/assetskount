import React from "react";
import { Link } from "react-router-dom";
import { Arrow, Kicker, Lines, NextStep, PageHero, Photo, SectionHeading } from "../components/PageHero.jsx";
import styles from "./Pages.module.css";
import { Brand, withBrand } from "../components/Brand.jsx";

const steps = [
  ["01", "Plan the stocktake", "Align locations, item data, timing and the people who need to be involved."],
  ["02", "Count on site", "Our team runs the count using ASSETKOUNT's mobile workflow."],
  ["03", "Review differences", "Bring unusual quantities to your nominated reviewers while the work is active."],
  ["04", "Close with a report", "Share count results, exceptions and the agreed next actions."],
];

function FullServicePage() {
  return (
    <main>
      <PageHero number="04" category="FULL SERVICE STOCKTAKE" title="Our team counts." accent="Your operation keeps moving." description="A hands-on option for organisations that want ASSETKOUNT to coordinate and carry out stocktaking at their locations." photo="counter-scan" photoAlt="A team member using a phone to check products at a counter" action="Request a full-service demo" />
      <div className={styles.serviceBanner}>
        <div className={styles.serviceBannerMedia}><Photo name="laptop-review" alt="Project team reviewing stocktake operations and inventory records" data-parallax="0.08" /></div>
        <div className={styles.serviceBannerCopy}>
          <Kicker>ON YOUR PREMISES</Kicker>
          <Lines lines={["We coordinate the count.", "You get a clearer closeout."]} />
          <p data-reveal="">From preparation and team deployment to review and reporting, our delivery team helps turn a complex stocktake into a managed, connected exercise.</p>
          <Link className={styles.textLink} to="/contact" data-reveal="">Talk through your locations <Arrow /></Link>
        </div>
      </div>
      <section className={styles.serviceSteps}>
        <SectionHeading kicker="HOW FULL SERVICE WORKS" title="From first briefing" accent="to a finished count." copy="Your people help us understand the operation. ASSETKOUNT teams coordinate the stocktake, work through the count and prepare the agreed outputs." />
        <div className={styles.serviceRows} data-stagger="">
          {steps.map(([number, title, copy]) => (
            <article className={styles.serviceStep} key={number}><span>{number}</span><h3>{title}</h3><p>{withBrand(copy)}</p></article>
          ))}
        </div>
        <p className={styles.serviceFootnote} data-reveal="">Locations, inventory scope, schedule, outputs and fees are confirmed before delivery begins.</p>
      </section>
      <section className={styles.serviceOwnership}>
        <div className={styles.serviceOwnershipIntro}>
          <Kicker>ONE DELIVERY TEAM, CLEAR RESPONSIBILITIES</Kicker>
          <Lines lines={["We run the count.", <em key="a">You set the priorities.</em>]} />
          <p data-reveal="">Your organisation stays involved in the decisions while <Brand /> coordinates the day-to-day stocktake delivery.</p>
        </div>
        <div className={styles.ownershipGrid}>
          <article><span><Brand /> LEADS</span><h3>Planning & execution</h3><ul><li>Stocktake coordination</li><li>On-site counting team</li><li>Progress and exception updates</li><li>Results and closeout summary</li></ul></article>
          <article><span>YOUR TEAM PROVIDES</span><h3>Local knowledge & decisions</h3><ul><li>Location access and site contacts</li><li>Inventory data and count context</li><li>Operational priorities and timing</li><li>Review and sign-off of findings</li></ul></article>
        </div>
      </section>
      <div className={styles.modelSwitch}>
        <div><Kicker>ANOTHER WAY TO COUNT</Kicker><Lines lines={["Prefer to run the count", <>with <em>your own team?</em></>]} /></div>
        <Link className={styles.textLinkDark} to="/services/self-service" data-reveal="">Explore self service <Arrow /></Link>
      </div>
      <NextStep kicker="FULL SERVICE / YOUR LOCATIONS" title="Tell us where you count and what you need to get from the results." />
    </main>
  );
}

export default FullServicePage;
