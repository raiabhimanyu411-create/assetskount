import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Arrow, Kicker, Lines, Photo } from "../components/PageHero.jsx";
import styles from "./Pages.module.css";
import { Brand } from "../components/Brand.jsx";

// Optional fallback inbox, shown only if the API cannot be reached.
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL;

function ContactPage() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "We couldn't send your request.");
      form.reset();
      setStatus("sent");
    } catch (submitError) {
      setError(submitError.message === "Failed to fetch" ? "We couldn't reach our server." : submitError.message);
      setStatus("error");
    }
  }

  return (
    <main className={styles.contactPage}>
      <section className={styles.contactHeading}>
        <Kicker hero>YOUR NEXT STEP / PRODUCT WALKTHROUGH</Kicker>
        <span className={styles.heroNumber} data-hero-item="">06 <i /> <Brand /> DEMO</span>
        <Lines as="h1" hero lines={["See a clearer", <em key="a">way to count.</em>]} />
        <p data-hero-item="">Tell us a little about your operation and what you manage. We'll follow up to arrange a product walkthrough around your locations, inventory or fixed assets.</p>
        <div className={styles.contactInfo} data-hero-item="">
          <h2>What we'll cover</h2>
          <ul>
            {["Your count process", "Locations and products", "Team size", "Live progress", "Variance review", "Getting started"].map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className={styles.contactImage} data-clip="">
          <Photo name="client-meeting" alt="Team discussing a stocktaking project" sizes="(max-width: 680px) 100vw, 40vw" />
          <span>COUNT WITH CLARITY</span>
        </div>
      </section>

      {status === "sent" ? (
        <div className={styles.formSuccess} role="status">
          <span className={styles.successMark} aria-hidden="true">
            <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" /><path d="M15 27l7 7 15-16" /></svg>
          </span>
          <h2>Thanks—your demo request is in.</h2>
          <p>We'll review your details and get in touch to plan a walkthrough for your operation.</p>
          <div className={styles.successActions}>
            <Link className={styles.buttonPrimary} to="/platform" data-magnetic="">Explore the platform <Arrow /></Link>
            <button type="button" className={styles.textLinkDark} onClick={() => setStatus("idle")}>Send another request</button>
          </div>
        </div>
      ) : (
        <form className={styles.contactForm} onSubmit={handleSubmit} data-hero-item="" aria-busy={status === "sending"}>
          <div className={styles.formIntro}><span>LET'S FIND THE RIGHT <Brand /> OFFERING</span><h2>Book your product demo.</h2></div>
          <label>Full name<input name="name" autoComplete="name" placeholder="Jane Smith" required maxLength={120} /></label>
          <label>Business email<input name="email" type="email" autoComplete="email" placeholder="jane@company.com" required maxLength={160} /></label>
          <label>Phone number<input name="phone" type="tel" autoComplete="tel" placeholder="+1 555 012 3456" maxLength={32} /></label>
          <label>Company name<input name="company" autoComplete="organization" placeholder="Your organisation" maxLength={160} /></label>
          <label className={styles.fullWidth}>Industry
            <span className={styles.selectWrap}>
              <select name="industry" defaultValue="">
                <option value="" disabled>Select your industry</option>
                <option>Retail</option>
                <option>Warehousing</option>
                <option>Logistics</option>
                <option>Pharmacy</option>
                <option>FMCG</option>
                <option>Manufacturing</option>
                <option>Other</option>
              </select>
            </span>
          </label>
          <label>Product interest
            <span className={styles.selectWrap}>
              <select name="productInterest" defaultValue="">
                <option value="" disabled>Select an offering</option>
                <option value="Stocktaking">Inventory stocktaking</option>
                <option value="Asset management">Enterprise asset management</option>
                <option value="Both">Both offerings</option>
              </select>
            </span>
          </label>
          <label>Number of locations
            <span className={styles.selectWrap}>
              <select name="locations" defaultValue="">
                <option value="" disabled>Select a range</option>
                <option value="1">1</option>
                <option value="2-10">2–10</option>
                <option value="11-50">11–50</option>
                <option value="51+">51+</option>
              </select>
            </span>
          </label>
          <label className={styles.fullWidth}>What would you like to improve?
            <textarea name="scope" placeholder="Tell us about your stocktake, asset register, locations or questions for the demo..." maxLength={4000} />
          </label>
          <label className={styles.honeypot} aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>

          {status === "error" && (
            <p className={styles.formError} role="alert">
              {error} Please try again{CONTACT_EMAIL ? <> or email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></> : ""}.
            </p>
          )}

          <button className={styles.formSubmit} type="submit" disabled={status === "sending"} data-magnetic="">
            {status === "sending" ? "Sending…" : "Request a demo"} <Arrow />
          </button>
          <p className={styles.formDisclosure}>We'll only use these details to follow up about your demo request.</p>
        </form>
      )}
    </main>
  );
}

export default ContactPage;
