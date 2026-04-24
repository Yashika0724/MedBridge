# MedBridge

India's medicine affordability finder. Type a branded medicine, instantly see its
generic equivalent, compare prices, estimate yearly savings, and find the nearest
Jan Aushadhi store.

**Live demo:** _add your Vercel URL here_

## The problem

Branded medicines in India often cost 5–10× more than their identical generic
counterparts, even though both contain the same active molecule and are
regulated by the same authority (CDSCO). Most people simply don't know a cheaper
equivalent exists. MedBridge makes that equivalence visible in one search.

## What it does

- **Search** any branded medicine and get the government-approved generic beside it
- **Compare** branded vs. generic side-by-side — composition, company, MRP, unit size
- **Estimate** yearly savings based on how many strips you buy per month
- **Locate** the nearest Jan Aushadhi Kendra via browser geolocation
- **Learn** why generics are clinically equivalent (CDSCO, WHO, AIIMS)

## Screenshots

_Add screenshots of the landing page, search results, detail view and store locator here._

## Tech stack

- **React 18** (Vite)
- **React Router** for client-side routing
- **Plain CSS** — no UI framework, no Tailwind
- **Local JSON** dataset (no backend, no database)
- **Browser Geolocation API** for the store locator

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

## Build for production

```bash
npm run build
npm run preview
```

## Deploy to Vercel

This repo is Vercel-ready. Import it into Vercel, keep the defaults (Vite), and
deploy. `vercel.json` rewrites every route to `index.html` so client-side routing
works on refresh.

## Project structure

```
src/
  components/     Header, Footer, SearchBar, MedicineCard, CategoryPills, Icons
  pages/          Home, Results, MedicineDetail, StoreLocator, WhyGenerics, About
  data/           medicines.json, stores.json
  lib/            search.js, geo.js
  styles/         index.css
```

## Data

- **Medicines:** 50+ common prescriptions across Pain & Fever, Diabetes, Heart & BP,
  Antibiotics, Gastric, Vitamins, Skin Care and Mental Health. Branded MRPs are
  representative; generic prices are drawn from the Jan Aushadhi product catalogue.
- **Stores:** 20 Jan Aushadhi Kendras across Delhi, Mumbai, Chennai, Bangalore,
  Hyderabad, Kolkata, Pune, Ahmedabad, Jaipur and Lucknow, with real coordinates
  used to compute distances.

## Disclaimer

MedBridge is an informational tool. It does not prescribe, dispense, or verify the
availability of any specific medicine. Always consult a qualified doctor or
pharmacist before changing your medication.

## License

MIT.
