# ASSETKOUNT

A responsive ASSETKOUNT website built with React, React Router and Vite. The homepage introduces the smartphone stocktaking workflow, live operations view, plans and industry use cases. A distinct enterprise asset-management page covers asset registers, lifecycle history, physical verification and reconciliation. Supporting pages cover the stocktaking platform, workflow, delivery models and demo request.

## Structure

- `client/` — React app, CSS Modules, branded intro loader, animated page transitions, the long-form stocktaking homepage, Enterprise Asset Management, Platform, How it works, Full Service, Self Service and Contact pages.
- `client/public/assets/deck/` — optimized visuals extracted from the supplied presentation.
- `backend/` — Node.js/Express health and demo-enquiry endpoints, with local JSONL enquiry storage and optional webhook forwarding.

## Run the website

```powershell
cd client
npm install
npm run dev
```

## Run the backend scaffold

```powershell
cd backend
npm install
npm run dev
```

The scaffold responds to `GET http://localhost:4000/api/health`. The demo request form submits to `POST /api/contact`; enquiries are written to `backend/data/enquiries.jsonl`. Set `CONTACT_WEBHOOK_URL` to optionally forward submissions to an external service.

## Client routes

- `/` — Home
- `/` — Product overview, stocktaking workflow, plans and industry solutions
- `/#features` — Product demonstration overview
- `/#power` — Mobile counting technology
- `/#howitworks` — Four-step stocktake workflow
- `/#pricing` — Plans
- `/#solutions` — Industry use cases
- `/platform` — ASSETKOUNT platform
- `/asset-management` — Enterprise asset register, lifecycle and verification programme (`#mobile`, `#workflow`, `#dashboards`)
- `/how-it-works` — Stocktake workflow
- `/services/full-service` — ASSETKOUNT-led on-site delivery
- `/services/self-service` — Customer-led delivery
- `/contact` — Demo request form
- `/login` — Workspace access information; authentication is not connected yet
