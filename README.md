# ByeTension Content Planner Dashboard

React + Vite + Tailwind dashboard for ByeTension content planning.

## Local preview

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal.

## Build

```bash
npm run build
```

## Deploy to Vercel

1. Create a new GitHub repository.
2. Upload all files from this folder.
3. Go to Vercel and import the GitHub repository.
4. Framework Preset: Vite.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. Click Deploy.

## Note about Done status

The Done checklist is stored in browser localStorage. It stays on the same browser/device, but it does not sync across devices unless a database is added later.
