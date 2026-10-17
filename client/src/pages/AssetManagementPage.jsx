import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Arrow, Kicker, Lines, NextStep, Photo } from "../components/PageHero.jsx";
import styles from "./AssetManagementPage.module.css";
import { Brand } from "../components/Brand.jsx";

const modules = [
  ["01", "Enterprise asset register", "Bring tags, serial numbers, category, assigned custodian, cost centre, location and book value into one structured asset record.", "▤"],
  ["02", "Mobile physical verification", "Capture scan results, condition, location and supporting evidence where the asset is actually found.", "⌗"],
  ["03", "Verification events", "Plan a controlled exercise by location, zone, asset class, team and review requirements.", "◷"],
  ["04", "Movement & lifecycle history", "Keep transfers, custody changes, condition updates and verification milestones connected to the asset.", "↗"],
  ["05", "ERP reconciliation", "Compare recorded details with physical findings and route mismatches, missing records and disposal candidates for review.", "⇄"],
  ["06", "Audit evidence centre", "Bring verifier, time, evidence and review decisions together in an accessible activity history.", "✓"],
];

const roles = [
  {
    role: "ADMIN",
    title: "Configure the foundation",
    copy: "Manage asset data, locations, categories, permissions and programme settings.",
    dashboardTitle: "Control centre",
    points: ["Platform setup health and master data completeness", "User, role and permission management", "ERP/API sync health and security alerts"],
    metrics: [["REGISTER HEALTH", "96%", "Master data completeness"], ["ACCESS REVIEWS", "04", "Awaiting confirmation"], ["SYNC STATUS", "Online", "Last update · 8 min ago"]],
  },
  {
    role: "SUPERVISOR",
    title: "Coordinate field work",
    copy: "Set up events, assign teams, monitor progress and review exceptions.",
    dashboardTitle: "Field operations",
    points: ["Plan verification events by location and asset class", "Assign zones, verifiers and review rules", "Track live progress and approve exceptions"],
    metrics: [["VERIFIED TODAY", "1,248", "Across 3 locations"], ["ACTIVE TEAMS", "08", "2 zones underway"], ["OPEN EXCEPTIONS", "12", "4 need attention"]],
  },
  {
    role: "FINANCE",
    title: "Reconcile the records",
    copy: "Compare physical findings with finance data and follow up on valuation or location differences.",
    dashboardTitle: "Reconciliation desk",
    points: ["Compare book records with physical findings", "Review ghost, unrecorded and moved assets", "Prepare disposal and correction candidates"],
    metrics: [["MATCHED RECORDS", "94.2%", "Compared with register"], ["VALUE VARIANCE", "$18.4k", "Across 7 records"], ["REVIEW QUEUE", "16", "Finance follow-up"]],
  },
  {
    role: "AUDIT",
    title: "Follow the evidence",
    copy: "Review activity, supporting records and the decisions made during an event.",
    dashboardTitle: "Evidence review",
    points: ["Trace who verified what, when and where", "Review photos, scans and approval trails", "Export audit-ready evidence packs"],
    metrics: [["EVIDENCE COMPLETE", "97%", "Current verification"], ["SIGN-OFFS", "32", "2 awaiting review"], ["AUDIT NOTES", "06", "Linked to asset records"]],
  },
  {
    role: "EXECUTIVE",
    title: "See the portfolio",
    copy: "Get a higher-level view of verified assets, outstanding work and areas needing attention.",
    dashboardTitle: "Portfolio overview",
    points: ["Verification coverage across every location", "Value at risk and open exposure", "Programme progress against targets"],
    metrics: [["ASSETS IN SCOPE", "24.8k", "Across all locations"], ["VERIFICATION", "81%", "Current cycle"], ["EXPOSURE TO REVIEW", "$42k", "Illustrative flagged value"]],
  },
];

const mobileCapabilities = [
  "QR and barcode scanning",
  "Location and geofence capture (if enabled)",
  "Photo evidence and condition checks",
  "Offline capture and later sync (if supported)",
  "Digital sign-off and exception notes",
  "Serial-number capture assistance (if supported)",
  "Exception raising and routing",
  "Condition checklists by asset class",
];

const heroStats = [
  ["99%+", "Evidence capture"],
  ["Real-time", "Verification control"],
  ["ERP-ready", "Reconciliation"],
];

const industries = ["Retail", "Healthcare", "Facilities", "Manufacturing", "Hospitality", "Education"];

const intelligenceSignals = [
  ["Duplicate records", "The same asset registered more than once across sites or systems."],
  ["Repeated missing assets", "Items that keep failing verification event after event."],
  ["Location drift", "Assets regularly found away from their recorded location."],
  ["High-risk custodians", "Teams or holders linked to a pattern of exceptions."],
  ["Ageing & condition", "Deteriorating assets that may need repair, review or disposal."],
  ["Audit gaps", "Records with missing photos, scans, sign-offs or approvals."],
];

const plans = [
  { tier: "STARTER ENTERPRISE", name: "Verification Core", copy: "For organisations starting their asset verification journey.", features: ["Asset register", "QR / barcode verification", "Mobile app access", "Standard reports"], action: "Enquire" },
  { tier: "PROFESSIONAL", name: "Enterprise Control", copy: "For multi-location businesses needing governance and reconciliation.", features: ["Verification events", "Supervisor dashboard", "Exception workflows", "Finance reconciliation", "Audit evidence pack"], action: "Request demo", featured: true },
  { tier: "ENTERPRISE", name: "Full Asset360", copy: "For large enterprises requiring deep integration and controls.", features: ["SSO and advanced roles", "ERP/API integrations", "AI risk scoring", "Data governance"], action: "Talk to us" },
];

const workflow = [
  ["01", "Plan", "Create a verification event and select locations, asset classes and rules."],
  ["02", "Assign", "Allocate zones, verifiers and review responsibilities to authorised teams."],
  ["03", "Verify", "Scan assets and capture observed location, condition and supporting evidence."],
  ["04", "Review", "Route exceptions and proposed corrections to the right supervisor."],
  ["05", "Reconcile", "Compare physical findings with the asset register and finance records."],
  ["06", "Close", "Agree outcomes and prepare an audit-ready closeout pack; ERP posting formats depend on scope."],
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function ValueAtRiskEstimator() {
  const [assetValue, setAssetValue] = useState("5000000");
  const [exceptionRate, setExceptionRate] = useState("5");
  const [recoveryPotential, setRecoveryPotential] = useState("25");

  const estimate = useMemo(() => {
    const value = Math.max(0, Number(assetValue) || 0);
    const exception = Math.min(100, Math.max(0, Number(exceptionRate) || 0));
    const recovery = Math.min(100, Math.max(0, Number(recoveryPotential) || 0));
    const exposure = value * exception / 100;
    return { exposure, recovery: exposure * recovery / 100 };
  }, [assetValue, exceptionRate, recoveryPotential]);

  return (
    <div className={styles.estimator}>
      <div className={styles.estimatorIntro}>
        <span className={styles.estimatorIcon} aria-hidden="true">$</span>
        <div><span className={styles.estimatorLabel}>ILLUSTRATIVE PLANNING TOOL</span><h3>Estimate where a closer look may help.</h3></div>
      </div>
      <p className={styles.estimatorCopy}>Use your own assumptions to explore potential exposure in an asset portfolio. This is a planning estimate, not an audit finding or guaranteed recovery.</p>
      <div className={styles.estimatorInputs}>
        <label>Total asset value
          <span className={styles.currencyInput}><b>$</b><input aria-label="Total asset value in US dollars" inputMode="numeric" type="number" min="0" max="100000000000" step="10000" value={assetValue} onChange={(event) => setAssetValue(event.target.value)} /></span>
        </label>
        <label>Assumed exception rate
          <span className={styles.rangeValue}>{exceptionRate}%</span>
          <input aria-label="Assumed exception rate percentage" className={styles.rangeInput} type="range" min="0" max="30" step="0.5" value={exceptionRate} onChange={(event) => setExceptionRate(event.target.value)} />
        </label>
        <label>Potential recovery / correction
          <span className={styles.rangeValue}>{recoveryPotential}%</span>
          <input aria-label="Potential recovery or correction percentage" className={styles.rangeInput} type="range" min="0" max="100" step="5" value={recoveryPotential} onChange={(event) => setRecoveryPotential(event.target.value)} />
        </label>
      </div>
      <div className={styles.estimateResults} aria-live="polite">
        <div><span>Illustrative value at risk</span><b>{currency.format(estimate.exposure)}</b></div>
        <div><span>Potential recovery visibility</span><b>{currency.format(estimate.recovery)}</b></div>
      </div>
      <span className={styles.estimatorNote}>Calculation: portfolio value × assumed exception rate; potential recovery applies your selected correction percentage. Actual findings vary.</span>
    </div>
  );
}

function AssetManagementPage() {
  const [activeRole, setActiveRole] = useState(0);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const selectedRole = roles[activeRole];
  const selectedStep = workflow[activeWorkflowStep];

  function handleTabKeyDown(event, index, setActive, prefix, count) {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % count;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + count) % count;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = count - 1;
    else return;

    event.preventDefault();
    setActive(nextIndex);
    document.getElementById(`${prefix}-${nextIndex}`)?.focus();
  }

  return (
    <main className={styles.assetPage}>
      <section className={styles.assetHero}>
        <div className={styles.heroCopy}>
          <Kicker hero>ENTERPRISE ASSET MANAGEMENT</Kicker>
          <span className={styles.heroIndex} data-hero-item=""><i /> <Brand /> / PORTFOLIO CONTROL</span>
          <Lines as="h1" hero lines={["Know every asset.", <em key="accent">Understand every change.</em>]} />
          <p data-hero-item="">Connect asset records to field evidence, movement history and finance review—so your team can see more than a line in a register.</p>
          <Link className={styles.heroAction} to="/contact" data-hero-item="" data-magnetic="">Explore your asset programme <Arrow diagonal /></Link>
          <div className={styles.heroStats} data-hero-item="">
            {heroStats.map(([value, label]) => <div key={label}><b>{value}</b><span>{label}</span></div>)}
          </div>
          <div className={styles.heroFoot} data-hero-item=""><span>FIXED &amp; OPERATIONAL ASSETS</span><span>REGISTER → FIELD → REVIEW</span></div>
        </div>
        <div className={styles.heroArtifact} data-hero-item="" data-tilt="6" role="img" aria-label="Illustration of an asset record connected to location, custodian and verification history">
          <div className={styles.artifactGrid} />
          <div className={styles.artifactHeader}><span>ASSET RECORD / 20417</span><i><b /> VERIFIED</i></div>
          <div className={styles.artifactCore}>
            <span className={styles.artifactGlyph} aria-hidden="true">A</span>
            <div><small>PLANT &amp; EQUIPMENT</small><strong>Electric forklift</strong><span>FL-07 / NORTH DISTRIBUTION</span></div>
          </div>
          <div className={styles.artifactLines} aria-hidden="true"><i /><i /><i /></div>
          <div className={styles.artifactNodes}>
            <span><small>LOCATION</small><b>Bay 14</b></span>
            <span><small>CUSTODIAN</small><b>Operations</b></span>
            <span><small>LAST VERIFIED</small><b>Today · 10:42</b></span>
          </div>
          <div className={styles.artifactFooter}><span>RECORD CONFIDENCE</span><b>96 <small>/ 100</small></b></div>
          <span className={styles.artifactOrbit} aria-hidden="true" />
        </div>
      </section>
      <nav className={styles.sectionNav} aria-label="Asset management sections">
        <a href="#asset-modules">Modules <span aria-hidden="true">↓</span></a>
        <a href="#dashboards">Dashboards <span aria-hidden="true">↓</span></a>
        <a href="#mobile">Mobile app <span aria-hidden="true">↓</span></a>
        <a href="#workflow">Workflow <span aria-hidden="true">↓</span></a>
        <a href="#intelligence">AI intelligence <span aria-hidden="true">↓</span></a>
        <a href="#pricing">Pricing <span aria-hidden="true">↓</span></a>
      </nav>

      <div className={styles.industryStrip}>
        <p>Built for enterprises with distributed assets, multi-location operations and audit exposure.</p>
        <div>{industries.map((industry) => <span key={industry}>{industry}</span>)}</div>
      </div>

      <section className={styles.moduleSection} id="asset-modules">
        <div className={styles.moduleIntro}>
          <div><Kicker>ONE PORTFOLIO / SIX CONNECTED CAPABILITIES</Kicker><Lines lines={["From record to", <em key="a">review-ready action.</em>]} /></div>
          <p data-reveal="">For fixed and operational assets, bring identity, ownership, location, physical checks and follow-up into one coherent programme. This complements inventory stocktaking; it does not replace the fast-moving product-count workflow.</p>
        </div>
        <div className={styles.moduleGrid} data-stagger="">
          {modules.map(([number, title, copy, icon]) => (
            <article className={styles.moduleCard} key={number}>
              <div><span>{number} / 06</span><b aria-hidden="true">{icon}</b></div>
              <h3>{title}</h3><p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.registerSection}>
        <div className={styles.registerVisual}>
          <div className={styles.registerWindow}>
            <div className={styles.registerTop}><span className={styles.registerMark}>A</span><b><Brand /></b><small>ASSET REGISTER / ASSET DETAIL</small><span className={styles.recordState}><i /> IN SERVICE</span></div>
            <div className={styles.registerBody}>
              <div className={styles.registerTitle}><div><small>FIXED ASSET / PLANT & EQUIPMENT</small><h3>Electric forklift FL-07</h3></div><span>•••</span></div>
              <div className={styles.registerIdentity}><span><small>ASSET TAG</small><b>AK-20417</b></span><span><small>SERIAL NUMBER</small><b>FLT-882941</b></span><span><small>CONDITION</small><b className={styles.condition}>● Good</b></span></div>
              <div className={styles.registerDetails}>
                <div><small>LOCATION</small><b>Distribution Centre / Bay 14</b></div>
                <div><small>CUSTODIAN</small><b>Warehouse Operations</b></div>
                <div><small>COST CENTRE</small><b>OPS-240 · Logistics</b></div>
                <div><small>BOOK VALUE</small><b>$24,800</b></div>
              </div>
              <div className={styles.registerTimeline}>
                <span className={styles.timelineRail} />
                <div><i /><span><b>Physical check completed</b><small>North zone · Today, 10:42</small></span><strong>VERIFIED</strong></div>
                <div><i /><span><b>Custodian confirmed</b><small>Warehouse Operations · 18 Mar</small></span><strong>UPDATED</strong></div>
                <div><i /><span><b>Asset transferred</b><small>Receiving bay → Bay 14 · 06 Feb</small></span><strong>LOGGED</strong></div>
              </div>
            </div>
          </div>
          <div className={styles.registerFloat}><span>✓</span><div><b>Evidence linked to record</b><small>Verifier · location · timestamp</small></div></div>
        </div>
        <div className={styles.registerCopy}>
          <Kicker>ONE ASSET / A USEFUL HISTORY</Kicker>
          <Lines lines={["Know more than", <em key="a">what's on the list.</em>]} />
          <p data-reveal="">Keep the business details that make a record useful—where an asset belongs, who is responsible, what it is worth and what has changed over time.</p>
          <div className={styles.registerPoints} data-stagger="">
            <div><span>01</span><div><b>Identity & classification</b><small>Tags, serial numbers, asset class and attachments.</small></div></div>
            <div><span>02</span><div><b>Custody & location</b><small>Assigned teams, cost centres and site hierarchy.</small></div></div>
            <div><span>03</span><div><b>Movement & lifecycle</b><small>Transfers, condition updates and verification history.</small></div></div>
            <div><span>04</span><div><b>Value & reconciliation</b><small>Book values and differences for finance review.</small></div></div>
          </div>
          <p className={styles.scopeNote}>Register fields and lifecycle controls are agreed to fit your data and operating model.</p>
        </div>
      </section>

      <section className={styles.mobileEvidence} id="mobile">
        <div className={styles.mobileEvidenceCopy}>
          <Kicker>FIELD VERIFICATION / MOBILE</Kicker>
          <Lines lines={["Capture the details", <em key="a">the register can't see.</em>]} />
          <p data-reveal="">A physical check can bring together asset identity, observed condition, location and proof. Configure the field workflow around your approved devices and verification requirements.</p>
          <div className={styles.capabilityChips}>
            {mobileCapabilities.map((capability) => <span key={capability}><i>✓</i>{capability}</span>)}
          </div>
          <p className={styles.scopeNote}>Device support, offline behaviour, location capture and advanced capture options must be confirmed for the agreed deployment.</p>
        </div>
        <div className={styles.evidenceVisual}>
          <Photo name="counter-scan" alt="A field team member using a smartphone to verify an asset" sizes="(max-width: 760px) 100vw, 46vw" />
          <div className={styles.evidencePhone}>
            <div className={styles.evidencePhoneTop}><span>‹</span><b>Verify asset</b><span>•••</span></div>
            <small>SCANNED ASSET</small><strong>AK-20417</strong>
            <div className={styles.evidenceAsset}><span>⚙</span><div><b>Electric forklift</b><small>Distribution Centre / Bay 14</small></div></div>
            <div className={styles.evidenceCheck}><span>Condition</span><b>Good <i>⌄</i></b></div>
            <div className={styles.evidenceCheck}><span>Custodian</span><b>Operations <i>⌄</i></b></div>
            <div className={styles.evidencePhoto}><span>▧</span><div><b>Photo evidence</b><small>2 photos attached</small></div><i>+</i></div>
            <div className={styles.evidenceSubmit}>Submit verification <span>↗</span></div>
          </div>
          <div className={styles.evidenceStamp}><span>✓</span><div><b>Location captured</b><small>North zone · 10:42</small></div></div>
        </div>
      </section>

      <section className={styles.dashboardSection} id="dashboards">
        <div className={styles.dashboardIntro}>
          <Kicker>ROLE-BASED OPERATIONS / SELECT A VIEW</Kicker>
          <Lines lines={["One portfolio.", <em key="a">Different decisions.</em>]} />
          <p data-reveal="">Explore how the same asset record serves each team's responsibilities.</p>
        </div>
        <div className={styles.roleExplorer}>
          <div className={styles.roleTabs} role="tablist" aria-label="Choose a role dashboard">
            {roles.map(({ role, title }, index) => (
              <button
                aria-selected={activeRole === index}
                className={activeRole === index ? styles.roleTabActive : ""}
                id={`role-tab-${index}`}
                key={role}
                onClick={() => setActiveRole(index)}
                onKeyDown={(event) => handleTabKeyDown(event, index, setActiveRole, "role-tab", roles.length)}
                role="tab"
                tabIndex={activeRole === index ? 0 : -1}
                type="button"
              >
                <span>0{index + 1}</span>{role}<small>{title}</small>
              </button>
            ))}
          </div>
          <div className={styles.rolePanel} id="role-panel" role="tabpanel" aria-labelledby={`role-tab-${activeRole}`}>
            <div className={styles.rolePanelTop}>
              <div><span>{selectedRole.role} / WORKSPACE VIEW</span><h3>{selectedRole.dashboardTitle}</h3><p>{selectedRole.copy}</p></div>
              <span className={styles.rolePanelState}><i /> UPDATED JUST NOW</span>
            </div>
            <ul className={styles.rolePoints}>
              {selectedRole.points.map((point) => <li key={point}><i aria-hidden="true">✓</i>{point}</li>)}
            </ul>
            <div className={styles.roleMetrics}>
              {selectedRole.metrics.map(([label, value, note]) => <div key={label}><span>{label}</span><b>{value}</b><small>{note}</small></div>)}
            </div>
            <div className={styles.rolePanelFoot}><span><Brand /> / ROLE-SCOPED VIEW</span><span>Illustrative dashboard preview</span></div>
          </div>
        </div>
      </section>

      <section className={styles.auditSection} id="workflow">
        <div className={styles.auditCopy}>
          <Kicker>VERIFICATION WORKFLOW / SIX CHECKPOINTS</Kicker>
          <Lines lines={["Keep each handoff", <em key="a">in the record.</em>]} />
          <p data-reveal="">Plan the event, assign authorised teams, review discrepancies, reconcile changes and prepare evidence for closeout. Keep the sequence and decisions visible across the programme.</p>
          <Link className={styles.auditLink} to="/contact">Discuss your verification programme <Arrow diagonal /></Link>
        </div>
        <div className={styles.workflowExplorer}>
          <div className={styles.workflowRail} role="tablist" aria-label="Verification workflow steps">
            {workflow.map(([number, title], index) => (
              <button
                aria-selected={activeWorkflowStep === index}
                className={activeWorkflowStep === index ? styles.workflowStepActive : ""}
                id={`workflow-tab-${index}`}
                key={number}
                onClick={() => setActiveWorkflowStep(index)}
                onKeyDown={(event) => handleTabKeyDown(event, index, setActiveWorkflowStep, "workflow-tab", workflow.length)}
                role="tab"
                tabIndex={activeWorkflowStep === index ? 0 : -1}
                type="button"
              >
                <span>{number}</span><b>{title}</b>
              </button>
            ))}
          </div>
          <article className={styles.workflowDetail} role="tabpanel" aria-labelledby={`workflow-tab-${activeWorkflowStep}`}>
            <span>{selectedStep[0]} / 06</span>
            <div><small>WORKFLOW CHECKPOINT</small><h3>{selectedStep[1]}</h3><p>{selectedStep[2]}</p></div>
            <b className={styles.workflowDetailArrow} aria-hidden="true">↗</b>
          </article>
        </div>
      </section>

      <section className={styles.reconcileSection}>
        <div className={styles.reconcileHeading}>
          <div><Kicker>PHYSICAL RECORDS / FINANCE RECORDS</Kicker><Lines lines={["Make differences easier", <em key="a">to review and resolve.</em>]} /></div>
          <p data-reveal="">Reconciliation brings the physical findings alongside existing records so the right people can examine differences and agree what should happen next.</p>
        </div>
        <div className={styles.reconcileFlow}>
          <article><span>01 / REGISTER</span><b>What the system records</b><small>Asset ID · location · custodian · value</small></article>
          <i aria-hidden="true">⇄</i>
          <article><span>02 / FIELD FINDING</span><b>What the team observed</b><small>Presence · location · condition · evidence</small></article>
          <i aria-hidden="true">→</i>
          <article className={styles.reconcileResult}><span>03 / REVIEW</span><b>What needs a decision</b><small>Missing · moved · mismatched · follow-up</small></article>
        </div>
        <p className={styles.scopeNote}>ERP connections, data exchange and posting formats depend on the source system and implementation scope.</p>
      </section>

      <section className={styles.intelligenceSection} id="intelligence">
        <div className={styles.intelligenceIntro}>
          <div><Kicker>AI ASSET INTELLIGENCE</Kicker><Lines lines={["Asset risk signals before", <em key="a">they become audit issues.</em>]} /></div>
          <div>
            <p data-reveal=""><Brand /> can surface potential ghost assets, duplicate records, repeated location drift, missing evidence and disposal opportunities—so teams know where to look first.</p>
            <Link className={styles.intelligenceLink} to="/contact">Discuss AI roadmap <Arrow diagonal /></Link>
          </div>
        </div>
        <div className={styles.intelligenceGrid} data-stagger="">
          {intelligenceSignals.map(([title, copy], index) => (
            <article key={title} data-tilt="5"><span>0{index + 1} / SIGNAL</span><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
        <p className={styles.scopeNote}>AI capabilities are part of the product roadmap; availability is confirmed for each deployment.</p>
      </section>

      <section className={styles.riskSection} id="risk-estimator">
        <div className={styles.riskIntro}>
          <Kicker>PORTFOLIO RISK / PLANNING VIEW</Kicker>
          <Lines lines={["Put a rough value", <em key="a">around the unknowns.</em>]} />
          <p data-reveal="">Explore how assumed exceptions could translate into a review opportunity—then use a scoped verification to establish what is actually there.</p>
          <div className={styles.riskSignals}>
            <span><i /> Missing or unverified records</span>
            <span><i /> Location and custody drift</span>
            <span><i /> Unreviewed condition changes</span>
          </div>
        </div>
        <ValueAtRiskEstimator />
      </section>

      <section className={styles.programmeSection} id="pricing">
        <div className={styles.programmeIntro}>
          <Kicker>COMMERCIAL MODEL</Kicker>
          <Lines lines={["Flexible enterprise pricing", <em key="a">for verification at scale.</em>]} />
          <p data-reveal="">Programme scope can grow from basic identification to multi-location governance and connected finance review. We confirm system integrations, security, advanced controls and feature availability during discovery.</p>
        </div>
        <div className={styles.programmeGrid}>
          {plans.map((plan) => (
            <article className={plan.featured ? styles.programmeFeatured : undefined} key={plan.name} data-tilt="4">
              <span>{plan.tier}</span><h3>{plan.name}</h3><p>{plan.copy}</p>
              <ul>{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
              <Link className={plan.featured ? styles.programmeActionPrimary : styles.programmeAction} to="/contact">{plan.action} <Arrow diagonal /></Link>
            </article>
          ))}
        </div>
        <p className={styles.scopeNote}>Pricing is tailored to locations, asset volume and integration scope. Availability and delivery are confirmed against your requirements.</p>
      </section>

      <NextStep kicker="ASSET MANAGEMENT / YOUR PORTFOLIO" title="Bring your locations, asset records and control requirements to a product walkthrough." copy="We'll explore how physical verification, lifecycle history and reconciliation could fit your operation." />
    </main>
  );
}

export default AssetManagementPage;
