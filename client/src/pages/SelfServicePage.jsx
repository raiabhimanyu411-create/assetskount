import React from "react";
import { Link } from "react-router-dom";
import { Arrow, Kicker, Lines, NextStep, PageHero, Photo, SectionHeading } from "../components/PageHero.jsx";
import styles from "./Pages.module.css";
import { Brand } from "../components/Brand.jsx";

const steps = [
  ["01", "Set up your stocktake", "Choose locations, load inventory and decide how teams will split the count."],
  ["02", "Assign and count", "Your counters scan products and record quantities from their own devices."],
  ["03", "Review differences", "Your nominated reviewers check variances and resolve questions."],
  ["04", "Approve and close", "Complete the count and share a clear record of the results."],
];

function SelfServicePage() {
  return (
    <main>
      <PageHero number="05" category="SELF SERVICE STOCKTAKE" title="Your team counts." accent="You stay in control." description="A flexible option for organisations that want their own people to set up, run and review stocktakes with ASSETKOUNT." photo="team-planning" photoAlt="A team planning a stocktake together" action="Request a self-service demo" />
      <div className={styles.serviceBanner}>
        <div className={styles.serviceBannerMedia}><Photo name="client-meeting" alt="A team planning a stocktake together" data-parallax="0.08" /></div>
        <div className={styles.serviceBannerCopy}>
          <Kicker>YOUR TEAM IN CONTROL</Kicker>
          <Lines lines={["Set your own pace.", "Keep the count connected."]} />
          <p data-reveal="">Configure locations and count zones, assign work to your people, follow progress and manage variances from one shared workspace.</p>
          <Link className={styles.textLink} to="/contact" data-reveal="">Plan your first stocktake <Arrow /></Link>
        </div>
      </div>
      <section className={styles.serviceSteps}>
        <SectionHeading kicker="HOW SELF SERVICE WORKS" title="Your people on the floor." accent="Your managers in control." copy="Your team owns the preparation, count and review. ASSETKOUNT brings the mobile tools and a shared view of the work." />
        <div className={styles.serviceRows} data-stagger="">
          {steps.map(([number, title, copy]) => (
            <article className={styles.serviceStep} key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
        <p className={styles.serviceFootnote} data-reveal="">Your authorised counters and reviewers complete the stocktake using <Brand />.</p>
      </section>
      <section className={styles.selfServiceControls}>
        <div className={styles.selfServiceIntro}>
          <Kicker>YOUR PEOPLE. YOUR PROCESS.</Kicker>
          <Lines lines={["Keep ownership close.", <em key="a">Keep progress visible.</em>]} />
          <p data-reveal="">Self service is a good fit when your people know the locations best and you want to build a repeatable stocktake rhythm inside the operation.</p>
        </div>
        <div className={styles.selfServiceGrid}>
          <article><span>01</span><b>Set the rhythm</b><p>Plan counts around your trading and operational calendar.</p></article>
          <article><span>02</span><b>Use local knowledge</b><p>Let people who know the site manage zones and access.</p></article>
          <article><span>03</span><b>Keep decisions in-house</b><p>Your reviewers decide how to resolve quantity differences.</p></article>
          <article><span>04</span><b>Repeat with confidence</b><p>Build on a shared workflow as your team and locations grow.</p></article>
        </div>
      </section>
      <div className={styles.modelSwitch}>
        <div><Kicker>WANT A HANDS-ON TEAM?</Kicker><Lines lines={["We can lead the count", <>with <em>you on site.</em></>]} /></div>
        <Link className={styles.textLinkDark} to="/services/full-service" data-reveal="">Explore full service <Arrow /></Link>
      </div>
      <NextStep kicker="SELF SERVICE / YOUR TEAM" title="Bring your locations, counters and inventory together for a smoother count." />
    </main>
  );
}

export default SelfServicePage;
