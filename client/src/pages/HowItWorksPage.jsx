import React from "react";
import { Link } from "react-router-dom";
import { Arrow, Kicker, Lines, NextStep, PageHero, Photo, SectionHeading, Steps } from "../components/PageHero.jsx";
import styles from "./Pages.module.css";

const steps = [
  ["01", "Set up the count", "Choose locations, upload item data and define how the team will count."],
  ["02", "Put counters in motion", "Assign zones and start scanning from compatible smartphones."],
  ["03", "Follow activity live", "Watch progress and send quantity differences to a reviewer as they appear."],
  ["04", "Reconcile and report", "Review count results, resolve exceptions and close with a clear summary."],
];

const principles = [
  ["Simple at the shelf", "Make scanning and entering a quantity part of one guided mobile flow."],
  ["Visibility during the count", "Keep managers informed about location progress and team activity."],
  ["Variances get attention", "Bring unusual results to a reviewer before the stocktake is closed."],
];

function HowItWorksPage() {
  return (
    <main>
      <PageHero number="03" category="HOW STOCKTAKING WORKS" title="From first scan" accent="to final report." description="Set up the count, send teams to the floor, monitor progress and review results in one straightforward flow." photo="tablet-review" photoAlt="A team reviewing stocktake details on a tablet" action="Plan a first stocktake" />
      <Steps items={["SET UP", "DEPLOY", "COUNT", "RECONCILE"]} />
      <section className={styles.workflow}>
        <SectionHeading kicker="THE STOCKTAKE JOURNEY" title="Four straightforward steps." accent="One shared picture." copy="A practical count starts with a clear plan, keeps teams connected while they work and ends with results people can review." />
        <div className={styles.workflowGrid} data-stagger="">
          {steps.map(([number, title, copy]) => (
            <article className={styles.workflowStep} key={number}>
              <span>{number} / 04</span><h3>{title}</h3><p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.splitSection}>
        <div className={styles.splitContent}>
          <Kicker>AT THE SHELF</Kicker>
          <Lines lines={["Scan each item.", <em key="a">Keep the count moving.</em>]} />
          <p data-reveal="">Counters use a guided phone workflow to identify a product, enter the quantity found and share results with the stocktake workspace.</p>
          <div className={styles.detailList} data-stagger="">
            {principles.map(([title, copy], index) => (
              <div key={title}><span>0{index + 1}</span><span><strong>{title}</strong><small>{copy}</small></span></div>
            ))}
          </div>
        </div>
        <div className={styles.splitImage} data-clip=""><Photo name="counter-scan" alt="A team member scanning a product at a store counter" /></div>
      </section>
      <section className={styles.countTimeline}>
        <div className={styles.countTimelineHead}>
          <Kicker>A WELL-PREPARED COUNT</Kicker>
          <Lines lines={["Before the team starts,", <em key="a">set the count up to succeed.</em>]} />
          <p data-reveal="">Good preparation keeps counters focused, helps the operation stay coordinated and gives reviewers a clearer closeout.</p>
        </div>
        <div className={styles.prepList} data-stagger="">
          {[
            ["01", "Locations & zones", "Decide what is being counted and how the work is split."],
            ["02", "Inventory data", "Prepare the item information your count needs to identify products."],
            ["03", "People & access", "Assign counters, leads and reviewers before the first scan."],
            ["04", "Rules for review", "Agree how to handle unexpected quantities and repeat counts."],
          ].map(([number, title, copy]) => <article key={number}><span>{number}</span><div><b>{title}</b><small>{copy}</small></div><i aria-hidden="true">↗</i></article>)}
        </div>
      </section>
      <section className={styles.processCallout}>
        <div><Kicker>BEFORE THE FIRST COUNT</Kicker><Lines lines={["Set your teams", <em key="a">up for a smooth run.</em>]} /></div>
        <p data-reveal="">Confirm locations, item data, count zones, team roles and the approach to reviewing differences. A little preparation makes it easier to keep the stocktake on track.</p>
        <Link className={styles.textLinkDark} to="/contact" data-reveal="">Plan a stocktake <Arrow /></Link>
      </section>
      <NextStep kicker="READY WHEN YOUR TEAM IS" title="Start with one location, bring the team together and build from there." />
    </main>
  );
}

export default HowItWorksPage;
