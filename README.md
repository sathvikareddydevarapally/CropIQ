# CropIQ — Smart Farming AI 🌱

CropIQ is a smart farming web application developed as a **Smart India Hackathon (SIH)** project. It brings crop management, soil analysis, AI-assisted predictions, weather insights, and a farmer community into one dashboard.

> This repository is a portfolio-ready standalone version of the original SIH prototype. The original hosted backend was replaced with a local demo data layer so the project can run independently on GitHub Pages.

## Features

- 🌱 **My Farm** — add, search, filter, and manage crops.
- 🧪 **Soil Analysis** — upload a soil image and view AI-style soil assessment results.
- 🤖 **AI Predictions** — generate sample yield, harvest, fertilizer, irrigation, and pest/disease insights.
- 🌦️ **Weather Dashboard** — current conditions, forecasts, and alerts.
- 👥 **Community Hub** — farmer discussions and marketplace-style posts.
- 👤 **Profile** — manage farm information and notification preferences.
- 💾 **Local persistence** — demo records are stored in browser `localStorage`.

## Tech Stack

- React 18
- Vite
- React Router
- Tailwind CSS
- Radix UI
- Recharts
- Lucide React
- React Query
- JavaScript / JSX

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## GitHub Pages deployment

This project uses `HashRouter`, so client-side navigation works on GitHub Pages without a custom server rewrite.

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`. After pushing the project to GitHub:

1. Open **Settings → Pages** in the repository.
2. Set **Source** to **GitHub Actions**.
3. Push to the `main` branch.
4. GitHub Actions will build and publish the `dist` folder automatically.

## Demo architecture

The original SIH prototype used a hosted backend. This public version intentionally uses a lightweight local data layer in `src/lib/localStore.js` instead:

- no API keys are required;
- no external authentication service is required;
- demo data is seeded automatically in the browser;
- changes persist in `localStorage` on the same browser.

The soil-analysis and prediction AI functions are represented by deterministic demo responses in `src/integrations/Core.js`. They can later be replaced with a real backend or AI API without changing the main UI flow.

## Project structure

```text
src/
├── components/       Reusable UI and feature components
├── entities/         Local data access layer
├── integrations/     Demo AI/file integration layer
├── lib/              Local storage, auth context, utilities
├── pages/            Main application pages
└── App.jsx           Application routing
```

## SIH project context

CropIQ was designed to help farmers make better decisions using crop records, soil information, weather signals, AI-assisted recommendations, and community knowledge in a single platform.

## License

This project is shared for educational and portfolio purposes.
