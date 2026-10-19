import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { openEnquiry } from "../components/Enquiry.jsx";
import site from "../components/Site.module.css";
import { lockScroll, whenIntroDone } from "../lib/motion.js";
import styles from "./Home.module.css";
import { Brand, withBrand } from "../components/Brand.jsx";

const IMG = "/assets/enterprise";

const issues = [
  ["Ghost assets in the books", "Missing or disposed assets remain on the register.", (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5M10 12.5l4 4M14 12.5l-4 4" />
    </>
  )],
  ["Location and custody mismatches", "Physical movements outpace record updates.", (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  )],
  ["Weak evidence and delayed reconciliation", "Unresolved differences surface when the pressure is on.", (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  )],
];

const blueprint = [
  ["Enterprise Asset Register", "Centralised asset master with categories, tags, serial numbers, locations, custodians, cost centres, book values, attachments and lifecycle history.", (
    <>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="3" />
      <path d="M4.5 5.5v13c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-13M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
    </>
  )],
  ["Mobile Verification", "Verify assets using smartphone camera, QR, barcode, RFID-ready workflows, GPS, photos, digital signatures, condition checklists and offline sync.", (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2" />
      <path d="M11 18h2" />
    </>
  )],
  ["Verification Events", "Plan and run structured physical verification events by location, zone, asset class, team, approval rule and audit sample requirement.", (
    <>
      <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
      <path d="M8 2.5v4M16 2.5v4M3.5 10h17M9 15l2 2 4-4" />
    </>
  )],
  ["ERP Reconciliation", "Compare book records against physical findings to identify ghost assets, unrecorded assets, wrong locations, cost centre mismatches and disposal candidates.", (
    <path d="M7 3.5 3.5 7 7 10.5M3.5 7h13M17 13.5l3.5 3.5-3.5 3.5M20.5 17h-13" />
  )],
  ["Audit Evidence Centre", "Every verification is backed by user ID, timestamp, GPS, photo evidence, scan details, approval trail and immutable activity history.", (
    <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3ZM9 12l2 2 4-4" />
  )],
  ["AI Asset Intelligence", "Detect duplicate records, repeated missing assets, location drift, high-risk custodians, ageing assets, condition deterioration and audit gaps.", (
    <path d="M10 3.5 11.8 8.2 16.5 10l-4.7 1.8L10 16.5l-1.8-4.7L3.5 10l4.7-1.8L10 3.5ZM18 14v6M15 17h6" />
  )],
];

const dimensions = [
  ["Existence", "Is the recorded asset physically present?", (
    <path d="M21 8 12 3 3 8v8l9 5 9-5V8ZM3 8l9 5 9-5M12 13v8" />
  )],
  ["Location", "Is it at the location shown in your records?", (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  )],
  ["Custody", "Who is responsible for the asset?", (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  )],
  ["Condition", "Does its physical condition match the record?", (
    <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3ZM9 12l2 2 4-4" />
  )],
];

const mobileSteps = [
  ["Scan the asset ID", "Identify the asset being verified.", (
    <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M8 9v6M11 9v6M13.5 9v6M16 9v6" />
  )],
  ["Record the physical findings", "Confirm condition and capture photos and location.", (
    <>
      <path d="M4 8a2 2 0 0 1 2-2h2l1.5-2h5L16 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  )],
  ["Retain the verification context", "Keep the verifier and timestamp with the submission.", (
    <path d="M9 4H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2M10 3h4a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM9 14l2 2 4-4" />
  )],
];

const rtChecks = [
  "QR / barcode / RFID / NFC scan evidence",
  "GPS location and geofence confirmation",
  "Photo or video proof of physical existence",
  "Serial number / nameplate OCR capture",
  "Asset condition and damage checklist",
  "Custodian confirmation and digital signature",
  "Timestamp, verifier ID, device ID, and full audit trail",
];

const rtProps = [
  ["Capture it once.", "Trust it forever.", <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3ZM9 12l2 2 4-4" />],
  ["Verify anywhere.", "Control everywhere.", <><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2.5" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></>],
  ["Real-time visibility.", "Smarter decisions.", <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2.5 2.5M4 4l2 2" /></>],
  ["Defensible evidence.", "Complete confidence.", <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>],
];

const rtLocations = [
  ["Head Office – Floor 1", 6, 6, "Completed"],
  ["Head Office – Floor 2", 5, 5, "Completed"],
  ["Warehouse A", 7, 12, "In Progress"],
  ["Retail Store – Indiranagar", 4, 9, "In Progress"],
  ["IT Department", 0, 8, "Not Started"],
];

const reviewFlow = [
  ["Field finding", "Missing, moved or changed asset recorded at source.", <path d="M5 21V4M5 4h11l-2 4 2 4H5" />],
  ["Evidence review", "Photos, location, verifier and timestamp checked.", <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4M8.5 11l1.8 1.8 3.2-3.3" /></>],
  ["Follow-up", "Resolved, reassigned or escalated with a full trail.", <><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>],
];

const reviewRoles = [
  ["Field teams", "Record findings at the asset.", <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>],
  ["Supervisors", "Review the evidence.", <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3ZM9 12l2 2 4-4" />],
];

const routeIcons = {
  "Verification": <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M8 9v6M11 9v6M13.5 9v6M16 9v6" />,
  "Supervisor review": <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  "Finance approval": <><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18M7 15h4" /></>,
  "Independent reverification": <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4M8.3 11l1.9 1.9 3.3-3.4" /></>,
};

const industries = [
  ["government", "Government", "Verify public assets, confirm custody and retain evidence for accountable reporting.", <path d="M3 21h18M4 10h16M12 3 3 8h18l-9-5ZM6 10v8M10 10v8M14 10v8M18 10v8M4 18h16" />, "An official verifies equipment with a tablet in a government building"],
  ["manufacturing", "Manufacturing", "Verify machinery, tools and plant equipment with clear records of location, custody and condition.", <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></>, "An engineer checks plant machinery on a factory floor with a tablet"],
  ["healthcare", "Healthcare", "Verify medical equipment across facilities, with physical evidence linked to every asset record.", <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z" />, "Clinicians review medical equipment records on a tablet"],
  ["education", "Education", "Verify laptops, lab equipment and campus assets across departments and locations.", <><path d="m2 9 10-5 10 5-10 5L2 9Z" /><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6" /></>, "A staff member verifies laptops in a campus computer lab"],
  ["construction", "Construction", "Verify tools, equipment and vehicles across projects, yards and sites.", <><path d="M4 18v-3a8 8 0 0 1 16 0v3" /><path d="M2 18h20v2H2zM10 7V5h4v2M12 7v5" /></>, "A site worker checks a generator on a construction site with a tablet"],
  ["retail", "Retail", "Verify POS terminals, store equipment and fixtures across outlets, warehouses and offices.", <><path d="M3 9 4.5 4h15L21 9M3 9h18v1.5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0V9ZM5 13v8h14v-8M10 21v-5h4v5" /></>, "A store associate scans a point of sale terminal in a retail store"],
];

const stages = [
  { name: "Scope", icon: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>, title: "Define the scope before you start.", description: "Choose the sites and asset classes, bring in the register, and agree evidence requirements and completion criteria." },
  { name: "Assign", icon: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.2a6.5 6.5 0 0 1 3 5.8" /></>, title: "Give each role a clear responsibility.", description: "Assign the people who will verify assets, review evidence and approve the outcomes for the selected exercise." },
  { name: "Verify", icon: <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M8 9v6M11 9v6M13.5 9v6M16 9v6" />, title: "Connect the record to the physical asset.", description: "Scan the asset ID, record the physical findings and capture supporting photos, location, verifier and timestamp." },
  { name: "Review", icon: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>, title: "Review the findings and the evidence.", description: "Use the selected review approach to examine submissions, investigate exceptions and agree the required follow-up." },
  { name: "Reconcile", icon: <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4" />, title: "Resolve differences against the register.", description: "Compare the verification findings with recorded asset details. Review the differences and agree follow-up actions." },
  { name: "Lock", icon: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>, title: "Complete the exercise with approved outcomes.", description: "Finish the authorised closeout workflow and retain the agreed verification outputs and supporting evidence." },
];

const controls = [
  { name: "Rapid Verification", level: 1, levelLabel: "Fast Turnaround", icon: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />, title: "Supervisor review", description: "Verification findings are reviewed by the supervisor before completion.", route: ["Verification", "Supervisor review"] },
  { name: "Standard Control", level: 2, levelLabel: "Balanced Control", icon: <><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>, title: "Supervisor review + Finance approval", description: "Combine operational review with Finance approval for the verification exercise.", route: ["Verification", "Supervisor review", "Finance approval"] },
  { name: "Independent Audit", level: 3, levelLabel: "Highest Assurance", icon: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4M8.3 11l1.9 1.9 3.3-3.4" /></>, title: "Independent reverification + Finance approval", description: "Apply an independent reverification and Finance approval to the selected exercise.", route: ["Verification", "Independent reverification", "Finance approval"] },
];

const erpSteps = [
  ["Import Register", <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />],
  ["Verify Assets", <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M8 9v6M11 9v6M13.5 9v6M16 9v6" />],
  ["Reconcile", <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4" />],
  ["Approve Outcomes", <><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>],
];

const outputs = [
  ["Verified Asset Register", "Recorded findings on existence and location.", <path d="M9 4H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2M10 3h4a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM9 14l2 2 4-4" />],
  ["Supporting Evidence", "Evidence linked to the verification record.", <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 16 5-5 4 4 3-3 6 6" /><circle cx="15.5" cy="9.5" r="1.5" /></>],
  ["Exception Summary", "Missing assets, mismatches and items to resolve.", <path d="M12 3 2 21h20L12 3ZM12 10v5M12 18h.01" />],
  ["Reconciliation and Closeout", "Reviewed differences and agreed follow-up actions.", <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>],
];

const models = [
  {
    key: "full",
    name: "Full Service",
    note: "Our teams execute",
    title: ["Our Teams Lead", "Your Verification."],
    description: "We manage and execute the verification at your premises using ASSETKOUNT.",
    items: [["Project management and site coordination", <><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M8 3v4M16 3v4M4 10h16M8 14h3M8 17h6" /></>], ["Physical verification at your premises", <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>], ["Evidence capture and exception review", <><path d="M4 8a2 2 0 0 1 2-2h2l1.5-2h5L16 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" /><circle cx="12" cy="13" r="3.5" /></>], ["Reporting and agreed closeout", <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />]],
    responsibility: "Your team provides records, access and approvals.",
    image: "full-service",
    alt: "A service team conducting an asset verification exercise at a customer's premises",
    enquiry: "Full Service discussion",
  },
  {
    key: "self",
    name: "Self Service",
    note: "Your teams execute",
    title: ["Your People.", "ASSETKOUNT Platform."],
    description: "Your representatives set up and verify assets on the ASSETKOUNT platform.",
    items: [["Configure the exercise scope and roles", <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4" />], ["Assign your teams and capture evidence", <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.2a6.5 6.5 0 0 1 3 5.8" /></>], ["Review findings and reconcile differences", <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4" />], ["Approve outcomes and complete the workflow", <><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>]],
    responsibility: "Customer-led execution using ASSETKOUNT.",
    image: "self-service",
    alt: "A customer employee uses a smartphone to verify a tagged printer",
    enquiry: "Self Service discussion",
  },
];

const pilotSteps = [
  ["Define the first scope", "Agree sites, asset classes and register availability.", <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>],
  ["Agree evidence and responsibilities", "Confirm the review roles and completion criteria.", <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.2a6.5 6.5 0 0 1 3 5.8" /></>],
  ["Assess the findings", "Review verification coverage, exceptions and reconciliation.", <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />],
];

const scopeItems = [
  ["Your delivery model", "Full Service or Self Service.", <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.2a6.5 6.5 0 0 1 3 5.8" /></>],
  ["Your first scope", "Sites, asset classes and available records.", <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>],
  ["Your control requirements", "Evidence, reviewers and completion criteria.", <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3ZM9 12l2 2 4-4" />],
  ["Your proposal", "Responsibilities, schedule, deliverables and fees.", <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></>],
];

const walkthrough = [
  { title: "Scope", description: "The office printer is included in the selected site and asset class. Evidence requirements and completion criteria are agreed.", outcome: "A defined exercise with an agreed starting register.", status: "Scope defined", image: "planning", alt: "A team plans the verification exercise" },
  { title: "Assign", description: "The verification officer, supervisor and required approvers are identified for the exercise.", outcome: "Clear responsibilities for verification and review.", status: "Roles assigned", image: "full-service", alt: "People coordinate an asset verification exercise" },
  { title: "Verify", description: "The officer scans the printer’s asset ID and records its location and condition, with photos, verifier and timestamp.", outcome: "Physical findings linked to the asset record.", status: "Evidence captured", image: "self-service", alt: "A verification officer checks an asset using a smartphone" },
  { title: "Review", description: "The reviewer examines the submission and its evidence. Any location or condition difference is followed up using the selected review approach.", outcome: "Reviewed evidence and a clear exception path.", status: "Evidence under review", image: "outputs", alt: "Reviewers discuss asset verification findings" },
  { title: "Reconcile", description: "The reviewed physical findings are compared with the register. Differences and the required follow-up actions are agreed.", outcome: "A reviewed reconciliation of the findings.", status: "Differences reconciled", image: "delivery", alt: "A customer and colleague review verification records" },
  { title: "Lock", description: "The authorised teams complete the closeout workflow and retain the agreed register findings, evidence and exception outputs.", outcome: "Approved outcomes and agreed closeout records.", status: "Approved closeout", image: "scoping", alt: "The customer and project lead agree the completion of an exercise" },
];

const pad = (index) => String(index + 1).padStart(2, "0");

// Slides wipe open as they scroll into view; the hero passes reveal={false}.
function Slide({ name, alt, className = "", children, priority = false, reveal = true, ...props }) {
  return (
    <div className={`${styles.slideCrop} ${className}`} data-clip={reveal ? "" : undefined} {...props}>
      <img
        src={`${IMG}/${name}.webp`}
        width="1672"
        height="941"
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />
      {children}
    </div>
  );
}

// Icons for the pill buttons, shared so every call to action looks the same.
function RocketIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.6 3.4c2.6-1.5 5.6-1.9 7.6-1.6.3 2-.1 5-1.6 7.6-1 1.8-2.6 3.4-4.4 4.6l-.4 3.7a1 1 0 0 1-.5.8l-3 1.8a.6.6 0 0 1-.9-.6l.5-3.2-2.5-2.5-3.2.5a.6.6 0 0 1-.6-.9l1.8-3a1 1 0 0 1 .8-.5l3.7-.4c1.2-1.8 2.8-3.4 4.7-4.3Zm2.9 3.1a2 2 0 1 0 0 2.9 2 2 0 0 0 0-2.9ZM5.3 16.1c.7-.7 1.9-.7 2.6 0s.7 1.9 0 2.6c-.9.9-3.6 1.5-3.6 1.5s.5-2.7 1-4.1Z" /></svg>;
}

function PlayIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5-12-7.5Z" /></svg>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.2 5.3 19.9 12l-6.7 6.7-1.4-1.4 4.3-4.3H4v-2h12.1l-4.3-4.3 1.4-1.4Z" /></svg>;
}

function Badge({ children }) {
  return (
    <p className={styles.sectionBadge} data-reveal="">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 2 4 13.5h6.5L9.5 22 20 9.5h-6.5L13.5 2Z" /></svg>
      {children}
    </p>
  );
}

function Icon({ children, className = styles.issueIcon }) {
  return <i className={className} aria-hidden="true"><svg viewBox="0 0 24 24">{children}</svg></i>;
}

function Eyebrow({ children, className = "" }) {
  return <p className={`${site.eyebrow} ${className}`}>{children}</p>;
}

// Arrow-key navigation shared by the tab lists on this page.
function onTabKeys(event, index, count, select) {
  const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
  let next;
  if (event.key in keys) next = (index + keys[event.key] + count) % count;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = count - 1;
  else return;
  event.preventDefault();
  select(next);
  event.currentTarget.parentElement.children[next]?.focus();
}

function Blueprint() {
  return (
    <section className={`${styles.section} ${styles.tint} ${styles.blueprint}`} id="blueprint" aria-labelledby="blueprint-title">
      <div className={site.container}>
        <div className={styles.blueprintHead}>
          <Badge>Platform Blueprint</Badge>
          <Lines id="blueprint-title" lines={[" Complete Asset Truth Layer", <em key="a">between physical assets and enterprise systems.</em>]} />
          <p className={styles.journeyIntro} data-reveal=""><Brand /> is designed to go beyond asset tracking. It connects the physical reality on the ground with ERP, finance, audit and operations.</p>
        </div>
        <div className={styles.blueprintGrid} data-stagger="" data-draw-icons="">
          {blueprint.map(([title, text, icon]) => (
            <article key={title} data-tilt="5">
              <Icon>{icon}</Icon>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Journey() {
  const [active, setActive] = useState(0);
  const stage = stages[active];
  return (
    <section className={`${styles.section} ${styles.journey}`} id="journey" aria-labelledby="journey-title">
      <div className={site.container}>
        <div className={styles.heading}>
          <div>
            <p className={styles.sectionBadge} data-reveal="">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 2 4 13.5h6.5L9.5 22 20 9.5h-6.5L13.5 2Z" /></svg>
              The Verification Journey
            </p>
            <Lines id="journey-title" lines={["Controlled Verification Process.", <em key="a">From Scoping to Successful Completion.</em>]} />
            <p className={styles.journeyIntro} data-reveal="">Give every exercise a defined scope, clear responsibilities and a controlled route to completion.</p>
          </div>
        </div>
        <div className={styles.workflowTabs} data-stagger="" data-draw-icons="" role="tablist" aria-label="Verification stages">
          {stages.map((item, index) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              id={`stage-tab-${index}`}
              aria-selected={index === active}
              aria-controls="stage-panel"
              tabIndex={index === active ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => onTabKeys(event, index, stages.length, setActive)}
            >
              <svg className={styles.tabIcon} viewBox="0 0 24 24" aria-hidden="true">{item.icon}</svg>{item.name}
            </button>
          ))}
        </div>
        <div className={styles.stagePanel} data-reveal="" id="stage-panel" role="tabpanel" aria-labelledby={`stage-tab-${active}`} tabIndex={0}>
          <i className={`${styles.issueIcon} ${styles.stageIcon}`} aria-hidden="true"><svg viewBox="0 0 24 24">{stage.icon}</svg></i>
          <div>
            <h3>{stage.title}</h3>
            <p>{stage.description}</p>
          </div>
        </div>
        <div className={styles.panorama} data-reveal="">
          <img data-parallax=".04" src={`${IMG}/journey.webp`} width="1672" height="941" alt="Connected scenes of planning, warehouse asset verification and management review" loading="lazy" decoding="async" />
        </div>
      </div>
    </section>
  );
}

function Controls() {
  const [active, setActive] = useState(0);
  const control = controls[active];
  return (
    <section className={`${styles.section} ${styles.recolor}`} id="controls" aria-labelledby="controls-title">
      <div className={site.container}>
        <div className={styles.heading}>
          <div>
            <Badge>Assurance To Match Your Controls</Badge>
            <Lines id="controls-title" lines={["The right review.", <em key="a">For each verification.</em>]} />
            <p className={styles.journeyIntro} data-reveal="">Choose the review approach that fits the exercise and your organisation’s control requirements.</p>
          </div>
        </div>
        <div className={styles.controlsLayout}>
          <div>
            <div className={styles.controlTabs} data-stagger="" data-draw-icons="" role="tablist" aria-label="Assurance approaches">
              {controls.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  role="tab"
                  id={`control-tab-${index}`}
                  aria-selected={index === active}
                  aria-controls="control-panel"
                  tabIndex={index === active ? 0 : -1}
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => onTabKeys(event, index, controls.length, setActive)}
                >
                  <Icon className={styles.controlIcon}>{item.icon}</Icon><strong>{item.name}</strong><i aria-hidden="true">↗</i>
                </button>
              ))}
            </div>
            <div className={styles.controlPanel} data-reveal="" id="control-panel" role="tabpanel" aria-labelledby={`control-tab-${active}`} tabIndex={0}>
              <div className={styles.panelTop}>
                <Eyebrow className={styles.eyebrowSmall}>Selected review approach</Eyebrow>
                <span className={styles.levelMeter} aria-label={`Assurance level ${control.level} of 3`}>
                  {[1, 2, 3].map((bar) => <i key={bar} className={bar <= control.level ? styles.levelOn : undefined} />)}
                  {control.levelLabel}
                </span>
              </div>
              <h3>{control.title}</h3>
              <p>{control.description}</p>
              <ol className={styles.routeSteps} aria-label="Approval route">
                {control.route.map((step) => (
                  <li key={step}><Icon className={styles.routeIcon}>{routeIcons[step]}</Icon><span>{step}</span></li>
                ))}
                <li className={styles.routeDone}><Icon className={styles.routeIcon}><path d="m7.5 12.5 3 3 6-6.5" /></Icon><span>Approved</span></li>
              </ol>
            </div>
          </div>
          <Slide name="assurance" className={styles.assuranceArt} alt="Finance and operational reviewers discuss asset records and supporting evidence" />
        </div>
      </div>
    </section>
  );
}

function Delivery() {
  const [active, setActive] = useState(0);
  const model = models[active];
  return (
    <section className={`${styles.section} ${styles.recolor} ${styles.delivery}`} id="delivery" aria-labelledby="delivery-title">
      <div className={site.container}>
        <div className={styles.heading}>
          <div>
            <Badge>Two Ways To Work With <Brand /></Badge>
            <Lines id="delivery-title" lines={["One Platform.", <em key="a">Your delivery model.</em>]} />
            <p className={styles.journeyIntro} data-reveal="">Choose who leads the exercise. Keep physical evidence, review and reconciliation at the centre.</p>
          </div>
        </div>
        <div className={styles.deliverySelector} data-reveal="" role="tablist" aria-label="Delivery models">
          {models.map((item, index) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              id={`model-tab-${item.key}`}
              aria-selected={index === active}
              aria-controls="model-panel"
              tabIndex={index === active ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => onTabKeys(event, index, models.length, setActive)}
            >
              {item.name} <span>{item.note}</span>
            </button>
          ))}
        </div>
        <div className={`${styles.split} ${styles.deliveryPanel} ${styles.copyFirst}`} id="model-panel" role="tabpanel" aria-labelledby={`model-tab-${model.key}`} tabIndex={0}>
          <div className={styles.modelPhoto} data-clip="">
            <img src={`${IMG}/${model.image}.webp`} width="1672" height="941" alt={model.alt} loading="lazy" decoding="async" />
          </div>
          <div className={styles.copy}>
            <h3 className={styles.modelTitle}>{withBrand(model.title[0])}<br />{withBrand(model.title[1])}</h3>
            <p className={styles.body} data-reveal="">{withBrand(model.description)}</p>
            <ul className={styles.featureGrid} data-stagger="" data-draw-icons="">
              {model.items.map(([item, icon]) => (
                <li key={item}><Icon className={styles.featureIcon}>{icon}</Icon><span>{item}</span></li>
              ))}
            </ul>
            <p className={styles.modelResponsibility} data-reveal="">
              <Icon className={styles.noteIcon}><><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></></Icon>
              {withBrand(model.responsibility)}
            </p>
            <button className={styles.pillOutline} data-magnetic="" type="button" onClick={() => openEnquiry(model.enquiry)}>Discuss {model.name}<ArrowIcon /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Walkthrough({ dialogRef }) {
  const [step, setStep] = useState(0);
  const item = walkthrough[step];
  const last = step === walkthrough.length - 1;
  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      className={styles.walkthroughDialog}
      aria-labelledby="walkthrough-title"
      data-lenis-prevent=""
      onClose={() => { lockScroll(false); setStep(0); }}
      onClick={(event) => { if (event.target === dialogRef.current) close(); }}
    >
      <button className={`${site.dialogClose} ${styles.walkthroughClose}`} type="button" onClick={close} aria-label="Close walkthrough">×</button>
      <div className={styles.walkthroughHeader}>
        <Eyebrow>Illustrative walkthrough</Eyebrow>
        <h2 id="walkthrough-title">One Asset.<br /><em>A controlled journey.</em></h2>
        <p className={styles.body}>Explore the stages, then book a live demo to see <Brand /> in operation.</p>
      </div>
      <div className={styles.walkthroughContent}>
        <div className={styles.walkthroughAsset}>
          <img src={`${IMG}/${item.image}.webp`} width="1672" height="941" alt={item.alt} />
          <div className={styles.sampleRecord}>
            <small>Illustrative asset record</small>
            <strong>AST-001 / Office printer</strong>
            <span>{item.status}</span>
          </div>
        </div>
        <div className={styles.walkthroughCopy}>
          <Eyebrow>Step {pad(step)} of 06</Eyebrow>
          <h3>{item.title}</h3>
          <p className={styles.body} data-reveal="">{item.description}</p>
          <p className={styles.walkthroughOutcome}>Outcome: {item.outcome}</p>
          <div className={styles.walkthroughProgress} aria-label="Walkthrough progress">
            {walkthrough.map((entry, index) => (
              <button
                key={entry.title}
                type="button"
                aria-label={`Step ${index + 1}: ${entry.title}`}
                aria-current={index === step ? "step" : undefined}
                onClick={() => setStep(index)}
              >
                {pad(index)}
              </button>
            ))}
          </div>
          <div className={styles.walkthroughButtons}>
            <button className={`${site.button} ${site.buttonOutline}`} type="button" disabled={step === 0} onClick={() => setStep(step - 1)}>← Previous</button>
            <button className={site.button} type="button" onClick={() => setStep(last ? 0 : step + 1)}>{last ? "Back to the start ↺" : "Next stage →"}</button>
          </div>
        </div>
      </div>
      <div className={styles.walkthroughFooter}>
        <span>See the workflow with your own verification requirements.</span>
        <button className={site.textLink} type="button" onClick={() => { close(); openEnquiry("Live product demo"); }}>
          Book a live demo <span aria-hidden="true">↗</span>
        </button>
      </div>
    </dialog>
  );
}

// Product screens: the field app on a phone and the campaign control centre on a laptop.
function RtPhone() {
  return (
    <div className={styles.rtPhone} data-reveal="">
      <img src={`${IMG}/control-centre-app.webp`} width="362" height="809" alt="The ASSETKOUNT mobile app home screen with assigned, verified and remaining assets" loading="lazy" decoding="async" />
    </div>
  );
}

function RtLaptop() {
  return (
    <div className={styles.rtLaptop} data-reveal="">
      <div className={styles.rtScreen}>
        <img src={`${IMG}/control-centre-web.webp`} width="888" height="392" alt="The ASSETKOUNT campaign control centre showing verification progress gauges" loading="lazy" decoding="async" />
        <div className={styles.rtScreenMore} aria-hidden="true">
          {rtLocations.map(([place, done, total, state]) => (
            <div key={place}>
              <span>{place}</span>
              <i><b data-grow="" style={{ width: `${(done / total) * 100}%` }} /></i>
              <span data-count={done} data-count-suffix={` / ${total}`}>{done} / {total}</span>
              <em className={styles[`rtState${state.replace(" ", "")}`]}>{state}</em>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.rtBase} />
    </div>
  );
}

function RealTimeControl() {
  return (
    <section className={`${styles.section} ${styles.rtSection}`} id="control-centre" aria-labelledby="rt-title">
      <div className={site.container}>
        <div className={styles.rtHead} data-reveal="">
          <Lines id="rt-title" lines={["Mobile Evidence + Real-Time Control"]} />
          <span className={styles.rtRule} aria-hidden="true"><i /></span>
          <p>Every verification activity produces defensible evidence and live management visibility.</p>
        </div>
        <div className={styles.rtGrid}>
          <RtPhone />
          <div className={styles.rtChecks}>
            <div className={styles.rtChecksHead} data-reveal="">
              <Icon className={styles.rtShield}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3ZM9 12l2 2 4-4" /></Icon>
              <h3>Evidence captured at the point of verification</h3>
            </div>
            <ul data-stagger="">
              {rtChecks.map((item) => <li key={item}><Icon className={styles.rtCheck}><path d="m7.5 12.5 3 3 6-6.5" /></Icon>{item}</li>)}
            </ul>
          </div>
          <RtLaptop />
          <div className={styles.rtProps} data-stagger="" data-draw-icons="">
            {rtProps.map(([first, second, icon]) => (
              <article key={first}><Icon className={styles.rtPropIcon}>{icon}</Icon><p>{first}<br />{second}</p></article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// The hero alternates between its two messages; both stay stacked in one grid
// cell so the buttons below never jump when the text changes.
const HERO_INTERVAL = 5000;
const HERO_SLIDES = 3;
const HERO_BADGES = ["Enterprise Asset Verification", "Asset Lifecycle Management"];

// Steps through `count` hero items on the shared interval. Returns a class
// builder for each item; -1 until the preloader lifts so the first one enters.
function useHeroRotation(count) {
  const [{ active, leaving }, setSlides] = useState({ active: -1, leaving: -1 });

  useEffect(() => {
    let timer;
    let cancelled = false;
    whenIntroDone().then(() => {
      if (cancelled) return;
      setSlides({ active: 0, leaving: -1 });
      timer = window.setInterval(() => {
        setSlides(({ active: current }) => ({ active: (current + 1) % count, leaving: current }));
      }, HERO_INTERVAL);
    });
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [count]);

  const slide = (index) => [
    styles.heroSlide,
    active === index && styles.heroSlideActive,
    leaving === index && styles.heroSlideLeaving,
  ].filter(Boolean).join(" ");

  return { active, slide };
}

function HeroBadge() {
  const { active, slide } = useHeroRotation(HERO_BADGES.length);
  return (
    <p className={styles.heroBadge} data-hero-item="">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 2 4 13.5h6.5L9.5 22 20 9.5h-6.5L13.5 2Z" /></svg>
      <span className={styles.heroSlides}>
        {HERO_BADGES.map((label, index) => (
          <span key={label} className={slide(index)} aria-hidden={active !== index}>
            <span className={styles.heroLine}><span>{label}</span></span>
          </span>
        ))}
      </span>
    </p>
  );
}

function HeroHeadings() {
  const { active, slide } = useHeroRotation(HERO_SLIDES);

  return (
    <div className={styles.heroSlides}>
      <div className={slide(0)} aria-hidden={active !== 0}>
        <HeroLines as="h1" id="hero-title" lines={["Your ERP says", "what should exist.", <em key="a"><Brand /></em>, <em key="b">proves what does.</em>]} />
        <p className={`${styles.heroDescription} ${styles.heroFade}`}>Connect your fixed asset register to physical evidence of existence, location, custody and condition.</p>
      </div>
      <div className={slide(1)} aria-hidden={active !== 1}>
        <HeroLines className={styles.heroTitle} lines={["Every Asset.", "Everywhere.", <em key="a">One Clear View.</em>]} />
        <p className={`${styles.heroSubtitle} ${styles.heroFade}`}>Your Central, Customisable Source of Truth.</p>
        <p className={`${styles.heroDescription} ${styles.heroFade}`} style={{ "--delay": ".12s" }}>Bring asset tracking, automated inspections and compliance evidence together in one platform—for complete operational accountability, without chasing spreadsheets.</p>
      </div>
      <div className={slide(2)} aria-hidden={active !== 2}>
        <HeroLines className={styles.heroTitle} lines={["Every asset verified.", "Every movement tracked.", <em key="a">Every record audit-ready.</em>]} />
        <p className={`${styles.heroDescription} ${styles.heroFade}`}><Brand /> gives enterprises a mobile-first platform to verify physical assets, capture evidence, reconcile with ERP and create a trusted asset truth layer across every location.</p>
      </div>
    </div>
  );
}

// Hero lines rise from a mask each time their slide becomes active.
function HeroLines({ as: Tag = "p", lines, ...props }) {
  return (
    <Tag {...props}>
      {lines.map((line, index) => (
        <span className={styles.heroLine} key={index}><span style={{ "--line": index }}>{line}</span></span>
      ))}
    </Tag>
  );
}

// Section headings whose lines rise from a mask as they scroll into view.
function Lines({ as: Tag = "h2", lines, ...props }) {
  return (
    <Tag {...props} data-lines="">
      {lines.map((line, index) => (
        <span className={styles.line} data-line="" key={index}><span>{line}</span></span>
      ))}
    </Tag>
  );
}

// Product film, loaded only when the dialog opens so it adds nothing to page weight.
function VideoDialog({ dialogRef }) {
  const video = useRef(null);
  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      className={styles.videoDialog}
      aria-label="AssetKount product video"
      data-lenis-prevent=""
      onClose={() => {
        lockScroll(false);
        video.current?.pause();
        if (video.current) video.current.currentTime = 0;
      }}
      onClick={(event) => { if (event.target === dialogRef.current) close(); }}
    >
      <button className={`${site.dialogClose} ${styles.videoClose}`} type="button" onClick={close} aria-label="Close video">×</button>
      <video
        ref={video}
        className={styles.video}
        src="/assets/videos/assetkount-intro.mp4"
        poster="/assets/videos/assetkount-intro-poster.jpg"
        preload="none"
        controls
        playsInline
      />
    </dialog>
  );
}

function HomePage() {
  const walkthroughDialog = useRef(null);
  const openWalkthrough = () => {
    walkthroughDialog.current?.showModal();
    lockScroll(true);
  };
  const videoDialog = useRef(null);
  const openVideo = () => {
    videoDialog.current?.showModal();
    lockScroll(true);
    videoDialog.current?.querySelector("video")?.play().catch(() => {});
  };

  return (
    <main className={styles.page}>
      {/* Hero: presentation visual 01 */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={`${site.container} ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <HeroBadge />
            <HeroHeadings />
            <div className={styles.actions} data-hero-item="">
              <button className={styles.pillPrimary} data-magnetic="" type="button" onClick={() => openEnquiry("Live product demo")}><RocketIcon />Get Started</button>
              <button className={styles.pillOutline} data-magnetic="" type="button" onClick={openVideo}><PlayIcon />Learn More</button>
            </div>
          </div>
          <Slide name="hero" priority reveal={false} data-hero-item="" className={styles.heroArt} alt="People using smartphones to verify tagged equipment across business locations" />
        </div>
      </section>

      <Blueprint />

      {/* 01: presentation visuals 02 / 02A */}
      <section className={`${styles.section} ${styles.reality}`} id="reality" aria-labelledby="reality-title">
        <div className={`${site.container} ${styles.split} ${styles.copyFirst}`}>
          <Slide name="reality-gap" className={styles.gapArt} alt="An asset register alongside a workplace with a missing asset and damaged equipment">
            <div className={styles.gapLabel}><span>Book Record</span><b aria-hidden="true">≠</b><span>Physical Reality</span></div>
          </Slide>
          <div className={styles.copy}>
            <p className={styles.sectionBadge} data-reveal="">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 2 4 13.5h6.5L9.5 22 20 9.5h-6.5L13.5 2Z" /></svg>
              The Asset Reality Gap
            </p>
            <Lines id="reality-title" lines={["Recorded in the books.", <em key="a">Uncertain on the ground.</em>]} />
            <p className={styles.body} data-reveal="">Your fixed asset register can record an asset long after its location, custodian or condition has changed. Verification brings those differences into view.</p>
            <ul className={styles.issueList} data-stagger="" data-draw-icons="">
              {issues.map(([title, text, icon]) => (
                <li key={title}>
                  <i className={styles.issueIcon} aria-hidden="true"><svg viewBox="0 0 24 24">{icon}</svg></i>
                  <div><strong>{title}</strong><span>{text}</span></div>
                </li>
              ))}
            </ul>
            <p className={styles.closingLine} data-reveal=""><Brand /> connects asset records to physical evidence seamlessly.</p>
          </div>
        </div>
      </section>

      {/* 02: presentation visual 03 */}
      <section className={`${styles.section} ${styles.tint} ${styles.verifies}`} id="platform" aria-labelledby="platform-title">
        <div className={site.container}>
          <div className={styles.heading}>
            <div>
              <p className={styles.sectionBadge} data-reveal="">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 2 4 13.5h6.5L9.5 22 20 9.5h-6.5L13.5 2Z" /></svg>
                What <Brand /> Verifies
              </p>
              <Lines id="platform-title" lines={["Evidence behind", <em key="a">every asset record.</em>]} />
            </div>
          </div>
          <div className={styles.evidenceLayout}>
            <div className={styles.dimensionList} data-stagger="" data-draw-icons="">
              {dimensions.map(([title, text, icon]) => (
                <article key={title}>
                  <i className={styles.issueIcon} aria-hidden="true"><svg viewBox="0 0 24 24">{icon}</svg></i>
                  <div><h3>{title}</h3><p>{text}</p></div>
                </article>
              ))}
            </div>
            <Slide name="evidence" className={styles.evidenceArt} alt="A verification officer scans the asset tag on a pharmacy refrigerator while a colleague reviews the record" />
          </div>
        </div>
      </section>

      {/* 03: presentation visual 04 */}
      <Journey />

      {/* 04: presentation visual 05 */}
      <section className={`${styles.section} ${styles.tint} ${styles.mobileSection}`} id="mobile" aria-labelledby="mobile-title">
        <div className={`${site.container} ${styles.split} ${styles.copyFirst}`}>
          <Slide name="mobile-verification" className={styles.mobileArt} alt="A smartphone captures the asset tag on a point of sale printer">
            <div className={styles.evidenceSlip}>
              <small>Evidence linked to the asset</small>
              <strong>Asset ID + photograph</strong>
              <span>Location · Condition</span>
              <span>Verifier · Timestamp</span>
            </div>
          </Slide>
          <div className={styles.copy}>
            <Badge>Verification at the Asset</Badge>
            <Lines id="mobile-title" lines={["A smartphone connects", <>the asset <em>to its evidence.</em></>]} />
            <p className={styles.body} data-reveal="">Bring the verification record to the physical asset. Capture the findings where the asset stands, with the context reviewers need.</p>
            <ul className={`${styles.numberedList} ${styles.iconList}`} data-stagger="" data-draw-icons="">
              {mobileSteps.map(([title, text, icon]) => (
                <li key={title}><Icon>{icon}</Icon><div><strong>{title}</strong><span>{text}</span></div></li>
              ))}
            </ul>
            <Link className={styles.pillOutline} data-magnetic="" to="/#demo">Explore the complete journey<ArrowIcon /></Link>
          </div>
        </div>
      </section>

      <RealTimeControl />

      {/* 05: presentation visual 06 */}
      <section className={`${styles.section} ${styles.tint} ${styles.exceptions}`} id="exceptions" aria-labelledby="exceptions-title">
        <div className={`${site.container} ${styles.split}`}>
          <div className={styles.copy}>
            <p className={styles.sectionBadge} data-reveal="">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 2 4 13.5h6.5L9.5 22 20 9.5h-6.5L13.5 2Z" /></svg>
              Exceptions with Accountability
            </p>
            <Lines id="exceptions-title" lines={["Every discrepancy", <em key="a">has a review path.</em>]} />
            <p className={styles.body} data-reveal="">Missing asset. Wrong location. Changed condition. Record the finding, attach the evidence and give reviewers a clear basis for follow-up.</p>
            <ol className={styles.reviewFlow} data-stagger="" data-draw="" data-draw-icons="">
              {reviewFlow.map(([title, text, icon], index) => (
                <li key={title}>
                  <Icon className={styles.flowIcon}>{icon}</Icon>
                  <small>Step {pad(index)}</small>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
            <div className={styles.roleSplit} data-stagger="">
              {reviewRoles.map(([who, task, icon]) => (
                <div key={who}><Icon className={styles.roleIcon}>{icon}</Icon><p><strong>{who}</strong>{task}</p></div>
              ))}
            </div>
            <Link className={styles.pillOutline} data-magnetic="" to="/#controls">Explore review controls<ArrowIcon /></Link>
          </div>
          <Slide name="exceptions" className={styles.exceptionsArt} alt="A warehouse verifier and supervisor examine asset findings together on a tablet" />
        </div>
      </section>

      {/* 06: presentation visual 07 */}
      <Controls />

      {/* 07: presentation visuals 08 and 14 */}
      <section className={`${styles.section} ${styles.tint} ${styles.recolor}`} id="reconciliation" aria-labelledby="reconciliation-title">
        <div className={site.container}>
          <div className={styles.split}>
            <div className={styles.copy}>
              <Badge>Verification to Action</Badge>
              <Lines id="reconciliation-title" lines={["Physical Evidence.", <em key="a">Financial Clarity.</em>]} />
              <p className={styles.leadLine} data-reveal=""><Brand /> Complements and Integrates with your ERP.</p>
              <p className={styles.body} data-reveal="">Import the asset register. Verify physical assets. Reconcile the findings and release approved outcomes for the next agreed action.</p>
              <div className={styles.erpSequence} data-stagger="" data-draw="" data-draw-icons="">
                {erpSteps.map(([label, icon], index) => (
                  <div key={label}>
                    <Icon className={styles.seqIcon}>{icon}</Icon>
                    <small>{pad(index)}</small>
                    <strong>{label}</strong>
                  </div>
                ))}
              </div>
            </div>
            <Slide name="reconciliation" className={styles.reconciliationArt} alt="A tagged device is checked against an asset register displayed on a laptop" />
          </div>
          <div className={styles.outputs}>
            <div className={styles.outputsHead} data-reveal="">
              <Eyebrow className={styles.outputsEyebrow}>What you receive</Eyebrow>
              <h3>Clear evidence. <em>Actionable outputs.</em></h3>
            </div>
            <div className={styles.outputList} data-stagger="" data-draw-icons="">
              {outputs.map(([title, text, icon]) => (
                <article key={title} data-tilt="5">
                  <div className={styles.outputTop}><Icon>{icon}</Icon></div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 08: presentation visuals 11 / 12 / 13 */}
      <Delivery />

      {/* 09: presentation visual 09 */}
      <section className={`${styles.section} ${styles.tint} ${styles.recolor}`} id="pilot" aria-labelledby="pilot-title">
        <div className={`${site.container} ${styles.split}`}>
          <div className={styles.copy}>
            <Badge>Focused Pilot</Badge>
            <Lines id="pilot-title" lines={["Clear Scope.", <em key="a">Measurable findings.</em>]} />
            <p className={styles.body} data-reveal="">Start with representative assets and locations. Use the pilot to see how the verification workflow, evidence and review requirements fit your organisation.</p>
            <ul className={`${styles.numberedList} ${styles.iconList}`} data-stagger="" data-draw-icons="">
              {pilotSteps.map(([title, text, icon]) => (
                <li key={title}><Icon>{icon}</Icon><div><strong>{title}</strong><span>{text}</span></div></li>
              ))}
            </ul>
            <button className={styles.pillPrimary} data-magnetic="" type="button" onClick={() => openEnquiry("Pilot discussion")}><RocketIcon />Discuss your Pilot</button>
          </div>
          <Slide name="pilot" className={styles.pilotArt} alt="A customer and project lead plan a focused verification pilot using asset records and location photographs" />
        </div>
      </section>

      {/* 10: presentation visual 10 */}
      <section className={`${styles.section} ${styles.recolor}`} id="demo" aria-labelledby="demo-title">
        <div className={`${site.container} ${styles.split} ${styles.copyFirst}`}>
          <div className={styles.demoVisual}>
            <Slide name="demo" alt="A smartphone and laptop show the connection between a tagged physical asset and its verification record" />
          </div>
          <div className={styles.copy}>
            <Badge>See <Brand /> in action</Badge>
            <Lines id="demo-title" lines={["One Asset.", <em key="a">The complete</em>, <em key="b">verification journey.</em>]} />
            <p className={styles.body} data-reveal="">See how an asset moves from campaign setup and mobile verification to evidence review, exception handling, reconciliation and approved closeout.</p>
            <div className={styles.actions} data-reveal="">
              <button className={styles.pillPrimary} data-magnetic="" type="button" onClick={() => openEnquiry("Live product demo")}><RocketIcon />Book a Live Demo</button>
              {/* <button className={site.textLink} type="button" onClick={openWalkthrough}>Explore the Walkthrough <span aria-hidden="true">→</span></button> */}
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.tint} ${styles.industries}`} id="industries" aria-labelledby="industries-title">
        <div className={site.container}>
          <div className={styles.industriesHead}>
            <Badge>Industries We Serve</Badge>
            <Lines id="industries-title" lines={[<>Asset Verification For <em>Every Sector</em></>]} />
            <p className={styles.journeyIntro} data-reveal="">One platform to verify physical assets, capture evidence and strengthen accountability across every location.</p>
          </div>
          <div className={styles.industryGrid} data-stagger="" data-draw-icons="">
            {industries.map(([key, name, text, icon, alt]) => (
              <article key={key} data-tilt="5">
                <div className={styles.industryPhoto}>
                  <img src={`${IMG}/industry-${key}.webp`} width="388" height="170" alt={alt} loading="lazy" decoding="async" />
                </div>
                <div className={styles.industryBody}>
                  <Icon className={styles.industryIcon}>{icon}</Icon>
                  <h3>{name}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
          <p className={styles.industrySignOff} data-reveal=""><span>Because <em>Every Asset Matters.</em></span></p>
        </div>
      </section>

      {/* 11: presentation visuals 15 / 16 */}
      <section className={`${styles.section} ${styles.nextStep}`} id="contact" aria-labelledby="contact-title">
        <div className={`${site.container} ${styles.contactGrid}`}>
          <div>
            <p className={`${styles.sectionBadge} ${styles.badgeDark}`} data-reveal="">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 2 4 13.5h6.5L9.5 22 20 9.5h-6.5L13.5 2Z" /></svg>
              Your Next Step
            </p>
            <Lines id="contact-title" lines={["Let’s define your first", <em key="a">verification exercise.</em>]} />
            <p className={styles.body} data-reveal="">A 30-minute scoping call to discuss your sites, asset classes, delivery model and starting records. Then agree a practical plan before work begins.</p>
            <div className={styles.contactActions} data-reveal="">
              <button className={styles.pillOutline} data-magnetic="" type="button" onClick={() => openEnquiry("30-minute scoping call")}><RocketIcon />Request a scoping call</button>
              <a className={styles.contactEmail} href="mailto:contact@acrebis.com">
                <Icon className={styles.mailIcon}><><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></></Icon>
                <span><small>Prefer email?</small>contact@acrebis.com</span>
              </a>
            </div>
          </div>
          <div className={styles.scopeSummary} data-reveal="">
            <p className={styles.scopeLabel}>A clear plan before we start</p>
            <ol data-stagger="" data-draw-icons="">
              {scopeItems.map(([title, text, icon], index) => (
                <li key={title}>
                  <Icon className={styles.scopeIcon}>{icon}</Icon>
                  <div><strong>{title}</strong><p>{text}</p></div>
                  <span className={styles.scopeStep}>{pad(index)}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <Walkthrough dialogRef={walkthroughDialog} />
      <VideoDialog dialogRef={videoDialog} />
    </main>
  );
}

export default HomePage;
