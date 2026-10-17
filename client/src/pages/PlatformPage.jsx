import React from "react";
import { Link } from "react-router-dom";
import { Arrow, Kicker, Lines, NextStep, PageHero, Photo, SectionHeading, Steps } from "../components/PageHero.jsx";
import styles from "./Pages.module.css";
import { Brand } from "../components/Brand.jsx";

const capabilities = [
  ["01", "A guided mobile count", "Give counters a clear way to scan products and record quantities at the shelf."],
  ["02", "One live operations view", "Follow progress across teams, zones and locations while the count is underway."],
  ["03", "Exceptions in context", "Make mismatches visible early and route unusual results to the right reviewer."],
  ["04", "A cleaner closeout", "Bring counted quantities and review decisions together for a useful final report."],
];

const outputs = [
  ["01", "Live stocktake overview", "Progress across active teams and locations."],
  ["02", "Item-level count records", "Scanned products and quantities captured in the field."],
  ["03", "Variance review", "Differences made visible for timely follow-up."],
  ["04", "Reconciliation & closeout", "A final view of count results and agreed actions."],
];

function PhoneMock() {
  return (
    <div className={styles.phoneMock} data-reveal="" aria-hidden="true">
      <div className={styles.phoneScreen}>
        <div className={styles.phoneBar}><span>9:41</span><span>●●●</span></div>
        <small>ACTIVE STOCKTAKE</small>
        <strong>OAT-48291</strong>
        <div className={styles.phoneScan}><i /><i /><i /><i /><span /></div>
        <div className={styles.phoneField}><span>Item</span><b>Oat drink</b></div>
        <div className={styles.phoneField}><span>Quantity</span><b>12 units</b></div>
        <div className={styles.phonePhotos}><i /><i /><i /></div>
        <div className={styles.phoneSubmit}>Save count</div>
      </div>
    </div>
  );
}

function PlatformPage() {
  return (
    <main>
      <PageHero number="02" category="THE STOCKTAKING PLATFORM" title="One live view." accent="From shelf to summary." description="Connect mobile counting, live operations and variance review in one practical workspace built around how your teams work." photo="shelf-check" photoAlt="A team member checking products on a store shelf" action="Request a platform demo" />
      <Steps items={["SET UP", "COUNT LIVE", "REVIEW & REPORT"]} />
      <section className={styles.contentSection}>
        <SectionHeading kicker="ONE CONNECTED WORKFLOW" title="Your stocktake," accent="in one connected workspace." copy="Give counters and managers a shared view of the same exercise—from the first scan to the last variance review." />
        <div className={styles.featureGrid} data-stagger="">
          {capabilities.map(([number, title, copy]) => (
            <article className={styles.featureCard} key={number} data-tilt="5">
              <span>{number} / 04</span><span className={styles.featureArrow} aria-hidden="true">↗</span>
              <h3>{title}</h3><p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.splitSection}>
        <div className={styles.splitMedia}>
          <div className={styles.splitImage} data-clip=""><Photo name="tablet-review" alt="Team members reviewing stocktake details on a mobile device" /></div>
          <PhoneMock />
        </div>
        <div className={styles.splitContent}>
          <Kicker>IN THE FIELD</Kicker>
          <Lines lines={["A familiar phone becomes", <em key="a">a focused counting tool.</em>]} />
          <p data-reveal="">Scan the product barcode, enter the quantity and keep the count linked to its item and location—without switching between paper and spreadsheets.</p>
          <div className={styles.detailList} data-stagger="">
            <div><span>01</span><span><strong>Scan</strong><small>Identify the item from its barcode.</small></span></div>
            <div><span>02</span><span><strong>Count</strong><small>Enter a quantity at the point of truth.</small></span></div>
            <div><span>03</span><span><strong>Review</strong><small>Send results and exceptions to the shared view.</small></span></div>
          </div>
          <Link className={styles.textLinkDark} to="/how-it-works">Explore the stocktake flow <Arrow diagonal /></Link>
        </div>
      </section>
      <section className={styles.platformControl}>
        <div className={styles.platformControlIntro}>
          <Kicker>FOR THE PEOPLE RUNNING THE COUNT</Kicker>
          <Lines lines={["The shelf is one view.", <em key="a">The operation is another.</em>]} />
          <p data-reveal="">Counters need an uncluttered way to record what they find. Managers need the bigger picture. <Brand /> brings both into the same stocktake.</p>
        </div>
        <div className={styles.controlCards} data-stagger="">
          <article><span>01 / FIELD TEAM</span><b>Keep moving</b><p>Scan items, enter quantities and see the work assigned to your location or zone.</p><i aria-hidden="true">⌗</i></article>
          <article><span>02 / STOCKTAKE LEAD</span><b>Stay in control</b><p>Follow progress by location and team, then direct attention to the work still in flight.</p><i aria-hidden="true">◉</i></article>
          <article><span>03 / REVIEWER</span><b>Focus on differences</b><p>Review unusual counts, resolve questions and complete the exercise with clear decisions.</p><i aria-hidden="true">✓</i></article>
        </div>
      </section>
      <section className={styles.platformOutputs}>
        <div className={styles.fullWidthHeading}><Kicker>FROM LIVE COUNT TO CLEAR OUTPUT</Kicker><Lines lines={["Every count visible.", <em key="a">Every variance reviewable.</em>]} /></div>
        <div className={styles.outputRows} data-stagger="">
          {outputs.map(([number, title, copy]) => (
            <div key={number}><span>{number}</span><strong>{title}</strong><p>{copy}</p></div>
          ))}
        </div>
      </section>
      <NextStep kicker="THE PLATFORM, BUILT AROUND YOUR COUNT" title="Bring your teams, items and locations into one clear stocktake." />
    </main>
  );
}

export default PlatformPage;
