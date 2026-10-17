import express from "express";
import { appendFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const app = express();
const port = Number(process.env.PORT) || 4000;
const dataDir = fileURLToPath(new URL("../data/", import.meta.url));
const clientDist = fileURLToPath(new URL("../../client/dist/", import.meta.url));

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(express.json({ limit: "20kb" }));

app.use((_request, response, next) => {
  response.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  });
  next();
});

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", service: "assetkount-api" });
});

// Small in-memory limiter: 5 enquiries per IP every 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_REQUESTS;
}

const INDUSTRIES = ["Retail", "Warehousing", "Logistics", "Pharmacy", "FMCG", "Manufacturing", "Other"];
const PRODUCT_INTERESTS = ["Stocktaking", "Asset management", "Both"];
const LOCATION_RANGES = ["1", "2-10", "11-50", "51+"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");

app.post("/api/contact", async (request, response) => {
  if (rateLimited(request.ip)) {
    return response.status(429).json({ error: "Too many requests. Please wait a few minutes." });
  }

  const body = request.body || {};
  // Bots fill the hidden "website" field; accept silently and drop.
  if (clean(body.website, 200)) return response.json({ ok: true });

  const enquiry = {
    name: clean(body.name, 120),
    email: clean(body.email, 160),
    phone: clean(body.phone, 32),
    company: clean(body.company, 160),
    industry: INDUSTRIES.includes(body.industry) ? body.industry : "",
    productInterest: PRODUCT_INTERESTS.includes(body.productInterest) ? body.productInterest : "",
    locations: LOCATION_RANGES.includes(body.locations) ? body.locations : "",
    scope: clean(body.scope, 4000),
  };

  if (!enquiry.name) return response.status(400).json({ error: "Please add your name." });
  if (!EMAIL.test(enquiry.email)) return response.status(400).json({ error: "Please add a valid work email." });

  const record = { ...enquiry, receivedAt: new Date().toISOString() };

  try {
    await mkdir(dataDir, { recursive: true });
    await appendFile(`${dataDir}enquiries.jsonl`, `${JSON.stringify(record)}\n`);

    // Optional: forward to Slack, Zapier, a CRM or an email service.
    if (process.env.CONTACT_WEBHOOK_URL) {
      await fetch(process.env.CONTACT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: `New ASSETKOUNT enquiry from ${record.name} <${record.email}>`, ...record }),
      });
    }
  } catch (error) {
    console.error("Failed to store enquiry", error);
    return response.status(500).json({ error: "We couldn't save your request." });
  }

  return response.status(201).json({ ok: true });
});

app.use("/api", (_request, response) => response.status(404).json({ error: "Not found" }));

// In production, serve the built client and let React Router handle routes.
if (existsSync(clientDist)) {
  app.use(express.static(clientDist, { maxAge: "1y", index: false, setHeaders: (response, path) => {
    if (path.endsWith(".html")) response.set("Cache-Control", "no-cache");
  } }));
  app.get(/^(?!\/api).*/, (_request, response) => response.sendFile(`${clientDist}index.html`, { headers: { "Cache-Control": "no-cache" } }));
}

app.listen(port, () => {
  console.log(`ASSETKOUNT API listening on port ${port}`);
});
