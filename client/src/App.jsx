import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter, Link, Outlet, Route, Routes, useLocation } from "react-router-dom";
import shell from "./components/Shared.module.css";
import site from "./components/Site.module.css";
import { EnquiryDialog, openEnquiry } from "./components/Enquiry.jsx";
import { finishIntro, getLenis, scrollToTop, useMagnetic, usePageAnimations, useSmoothScroll, useTilt } from "./lib/motion.js";
import ContactPage from "./pages/ContactPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import HowItWorksPage from "./pages/HowItWorksPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PlatformPage from "./pages/PlatformPage.jsx";
import FullServicePage from "./pages/FullServicePage.jsx";
import SelfServicePage from "./pages/SelfServicePage.jsx";
import AssetManagementPage from "./pages/AssetManagementPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { Brand } from "./components/Brand.jsx";

const navigation = [
  { id: "platform", label: "The Platform" },
  { id: "journey", label: "How It Works" },
  { id: "delivery", label: "Delivery Models" },
  { id: "pilot", label: "Your Pilot" },
];

const titles = {
  "/": "ASSETKOUNT | Enterprise Asset Verification",
  "/platform": "The stocktaking platform — ASSETKOUNT",
  "/how-it-works": "How stocktaking works — ASSETKOUNT",
  "/services/full-service": "Full Service — ASSETKOUNT",
  "/services/self-service": "Self Service — ASSETKOUNT",
  "/asset-management": "Enterprise asset management — ASSETKOUNT",
  "/login": "Workspace access — ASSETKOUNT",
  "/contact": "Request a demo — ASSETKOUNT",
};

// Workspace sign-in address; the header button stays inert until this is set.
const SIGN_IN_URL = "";

const INTRO_KEY = "assetkount-intro-seen";

function readIntroSeen() {
  try {
    return Boolean(window.sessionStorage.getItem(INTRO_KEY));
  } catch {
    return true;
  }
}

function Preloader({ onDone }) {
  useEffect(() => {
    const lift = window.setTimeout(finishIntro, 1250);
    const remove = window.setTimeout(() => {
      try { window.sessionStorage.setItem(INTRO_KEY, "true"); } catch { /* storage unavailable */ }
      onDone();
    }, 2100);
    return () => {
      window.clearTimeout(lift);
      window.clearTimeout(remove);
    };
  }, [onDone]);

  return (
    <div className={shell.preloader} role="status" aria-label="Loading ASSETKOUNT">
      <div className={shell.loaderInner}>
        <div className={shell.loaderBrand}>
          <img src="/assets/deck/image2.png" alt="" />
          <span className={shell.loaderScanner} />
        </div>
        <p>BECAUSE EVERY ASSET MATTERS</p>
        <div className={shell.loaderTrack}><span /></div>
      </div>
    </div>
  );
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const location = useLocation();
  const header = useRef(null);
  const toggle = useRef(null);

  useEffect(() => setMenuOpen(false), [location.pathname, location.hash]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggle.current?.focus();
      }
    };
    const onClick = (event) => {
      if (!header.current?.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [menuOpen]);

  // Underline the nav item for the section currently in view.
  useEffect(() => {
    setCurrent("");
    if (location.pathname !== "/" || !("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setCurrent(entry.target.id); });
    }, { rootMargin: "-15% 0px -65% 0px", threshold: 0 });
    navigation.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [location.pathname]);

  // Tuck the header away while scrolling down; bring it back on the way up.
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 6) return;
      setHidden(y > lastY && y > 160);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`${site.header} ${hidden && !menuOpen ? site.headerHidden : ""}`}
      ref={header}
      onFocusCapture={() => setHidden(false)}
    >
      <div className={`${site.container} ${site.headerInner}`}>
        <Link className={site.brand} to="/" aria-label="ASSETKOUNT home">
          <img src="/assets/deck/image2.png" width="584" height="207" alt="ASSETKOUNT" />
        </Link>
        <button
          ref={toggle}
          className={site.menuToggle}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span />
        </button>
        <nav id="main-navigation" className={`${site.nav} ${menuOpen ? site.navOpen : ""}`} aria-label="Main navigation">
          {navigation.map(({ id, label }) => (
            <Link key={id} to={`/#${id}`} aria-current={current === id ? "location" : undefined}>{label}</Link>
          ))}
          <button className={site.requestDemo} type="button" onClick={() => { setMenuOpen(false); openEnquiry("Live product demo"); }}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.6 3.4c2.6-1.5 5.6-1.9 7.6-1.6.3 2-.1 5-1.6 7.6-1 1.8-2.6 3.4-4.4 4.6l-.4 3.7a1 1 0 0 1-.5.8l-3 1.8a.6.6 0 0 1-.9-.6l.5-3.2-2.5-2.5-3.2.5a.6.6 0 0 1-.6-.9l1.8-3a1 1 0 0 1 .8-.5l3.7-.4c1.2-1.8 2.8-3.4 4.7-4.3Zm2.9 3.1a2 2 0 1 0 0 2.9 2 2 0 0 0 0-2.9ZM5.3 16.1c.7-.7 1.9-.7 2.6 0s.7 1.9 0 2.6c-.9.9-3.6 1.5-3.6 1.5s.5-2.7 1-4.1Z" />
            </svg>
            Request Demo
          </button>
          <a
            className={site.signIn}
            href={SIGN_IN_URL || "#"}
            onClick={(event) => { if (!SIGN_IN_URL) event.preventDefault(); }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
            Sign In
          </a>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className={site.footer}>
      <div className={`${site.container} ${site.footerMain}`}>
        <div className={site.footerBrand}>
          <Link className={site.brand} to="/" aria-label="ASSETKOUNT home">
            <img src="/assets/deck/image2.png" width="584" height="207" alt="ASSETKOUNT" />
          </Link>
          <p>Enterprise Asset Verification.<br />Asset Lifecycle Management.<br />Physical Evidence. Controlled Outcomes.</p>
        </div>
        <div>
          <h3>Explore</h3>
          <Link to="/#platform">The Platform</Link>
          <Link to="/#journey">Verification Journey</Link>
          <Link to="/#controls">Review Controls</Link>
        </div>
        <div>
          <h3>Work With Us</h3>
          <Link to="/#delivery">Full Service &amp; Self Service</Link>
          <Link to="/#pilot">Focused Pilot</Link>
          <button className={site.footerLink} type="button" onClick={() => openEnquiry("Live product demo")}>Book a Live Demo</button>
        </div>
        <div>
          <h3>Get In Touch</h3>
          <a href="mailto:contact@acrebis.com">contact@acrebis.com</a>
          <a href="tel:+6597157555">+65 9715 7555</a>
          <a href="https://www.acrebis.com/" target="_blank" rel="noopener noreferrer">Visit ACREBIS <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className={`${site.container} ${site.footerBottom}`}>
        <span>© {new Date().getFullYear()} ACREBIS. All Rights Reserved.</span>
        <span><Brand /> · Because Every Asset Matters.</span>
        <button type="button" onClick={() => scrollToTop(false)}>Back to Top ↑</button>
      </div>
    </footer>
  );
}

function scrollToSection(id, immediate) {
  const target = document.getElementById(id);
  if (!target) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(target, { offset: -88, duration: 1.1, immediate, force: true });
  else target.scrollIntoView({ behavior: immediate ? "instant" : "smooth" });
}

function RouteEffects() {
  const { pathname, hash } = useLocation();
  const previousPath = useRef(null);

  useEffect(() => {
    document.title = titles[pathname] ?? "Page not found — ASSETKOUNT";
    const arrivedFromAnotherPage = previousPath.current !== pathname;
    previousPath.current = pathname;

    if (!hash) {
      scrollToTop(true);
      return undefined;
    }

    const id = decodeURIComponent(hash.slice(1));
    if (!arrivedFromAnotherPage) {
      const timeout = window.setTimeout(() => scrollToSection(id, false), 40);
      return () => window.clearTimeout(timeout);
    }

    // A fresh page is still laying out (images, scroll triggers), so jump to
    // the section and re-align once the layout has settled.
    scrollToTop(true);
    const timeouts = [250, 800, 1500].map((delay) => window.setTimeout(() => scrollToSection(id, true), delay));
    return () => timeouts.forEach((timeout) => window.clearTimeout(timeout));
  }, [pathname, hash]);
  return null;
}

function RouteTransition() {
  const location = useLocation();
  const scope = useRef(null);
  // The first page is revealed by the preloader; later pages by a curtain.
  const firstPath = useRef(location.pathname);
  const navigated = useRef(false);
  if (location.pathname !== firstPath.current) navigated.current = true;
  usePageAnimations(scope, location.pathname);
  return (
    <>
      {navigated.current && <div key={`curtain-${location.pathname}`} className={shell.routeCurtain} aria-hidden="true" />}
      <div key={location.pathname} ref={scope} className={shell.pageTransition}>
        <Outlet />
      </div>
    </>
  );
}

function SiteLayout() {
  useSmoothScroll();
  useMagnetic();
  useTilt();
  return (
    <>
      <a className={shell.skipLink} href="#content">Skip to content</a>
      <RouteEffects />
      <SiteHeader />
      <div id="content">
        <Routes>
          <Route element={<RouteTransition />}>
            <Route index element={<HomePage />} />
            <Route path="/platform" element={<PlatformPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/services/full-service" element={<FullServicePage />} />
            <Route path="/services/self-service" element={<SelfServicePage />} />
            <Route path="/asset-management" element={<AssetManagementPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </div>
      <SiteFooter />
      <EnquiryDialog />
      <div className={shell.grain} aria-hidden="true" />
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(() => !readIntroSeen());

  useEffect(() => {
    if (!loading) finishIntro();
  }, [loading]);

  return (
    <BrowserRouter>
      {loading && <Preloader onDone={() => setLoading(false)} />}
      <SiteLayout />
    </BrowserRouter>
  );
}

export default App;
