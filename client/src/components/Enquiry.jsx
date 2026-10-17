import React, { useEffect, useRef, useState } from "react";
import { lockScroll } from "../lib/motion.js";
import site from "./Site.module.css";

const OPEN_EVENT = "assetkount:enquiry";

const PURPOSES = [
  "Live product demo",
  "30-minute scoping call",
  "Pilot discussion",
  "Full Service discussion",
  "Self Service discussion",
];

// Any button on the site can open the enquiry dialog with a preselected purpose.
export function openEnquiry(purpose = PURPOSES[0]) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: purpose }));
}

function defaultDelivery(purpose) {
  if (purpose === "Full Service discussion") return "Full Service";
  if (purpose === "Self Service discussion") return "Self Service";
  return "To be discussed";
}

export function EnquiryDialog() {
  const dialog = useRef(null);
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [delivery, setDelivery] = useState("To be discussed");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const onOpen = (event) => {
      setPurpose(event.detail);
      setDelivery(defaultDelivery(event.detail));
      setStatus("idle");
      setError("");
      dialog.current?.showModal();
      lockScroll(true);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const close = () => dialog.current?.close();

  async function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const details = [`Enquiry: ${purpose}`, `Preferred delivery model: ${delivery}`, data.notes && `What to verify: ${data.notes}`];
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          company: data.company,
          website: data.website,
          productInterest: "Asset management",
          scope: details.filter(Boolean).join("\n"),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "We couldn't send your enquiry.");
      setStatus("sent");
    } catch (submitError) {
      setError(submitError.message === "Failed to fetch" ? "We couldn't reach our server." : submitError.message);
      setStatus("error");
    }
  }

  return (
    <dialog
      ref={dialog}
      className={site.dialog}
      aria-labelledby="enquiry-title"
      data-lenis-prevent=""
      onClose={() => lockScroll(false)}
      onClick={(event) => { if (event.target === dialog.current) close(); }}
    >
      <button className={site.dialogClose} type="button" onClick={close} aria-label="Close enquiry">×</button>
      <p className={site.eyebrow}>Let’s connect</p>
      <h2 id="enquiry-title">Your next step<br /><em>starts here.</em></h2>

      {status === "sent" ? (
        <div className={site.success} role="status">
          <p>Thank you. Your enquiry has been received and our team will be in touch to arrange the next step.</p>
          <button className={site.button} type="button" onClick={close}>Close <span aria-hidden="true">→</span></button>
        </div>
      ) : (
        <>
          <p className={site.dialogIntro}>Tell us a little about your verification needs and we’ll follow up to plan the next step.</p>
          <form className={site.form} onSubmit={handleSubmit} aria-busy={status === "sending"}>
            <div className={site.formGrid}>
              <label>Your name<input name="name" autoComplete="name" required maxLength={120} placeholder="Full name" /></label>
              <label>Work email<input name="email" type="email" autoComplete="email" required maxLength={160} placeholder="you@company.com" /></label>
            </div>
            <label>Organisation<input name="company" autoComplete="organization" required maxLength={160} placeholder="Company or organisation" /></label>
            <div className={site.formGrid}>
              <label>I’d like to discuss
                <select value={purpose} onChange={(event) => setPurpose(event.target.value)}>
                  {PURPOSES.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label>Preferred delivery model
                <select value={delivery} onChange={(event) => setDelivery(event.target.value)}>
                  <option value="To be discussed">Help me decide</option>
                  <option>Full Service</option>
                  <option>Self Service</option>
                </select>
              </label>
            </div>
            <label>What would you like to verify? <span className={site.optional}>Optional</span>
              <textarea name="notes" rows={3} maxLength={2500} placeholder="Sites, asset types, approximate scope or your main challenge…" />
            </label>
            <label className={site.honeypot} aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
            {status === "error" && <p className={site.formError} role="alert">{error} Please try again.</p>}
            <button className={`${site.button} ${site.formSubmit}`} type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send my enquiry"} <span aria-hidden="true">→</span>
            </button>
            <p className={site.formNote}>We’ll only use these details to respond to your enquiry.</p>
          </form>
        </>
      )}
    </dialog>
  );
}
