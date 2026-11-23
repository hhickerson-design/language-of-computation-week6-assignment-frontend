# Week 6 Assignment: Library Frontend

The React + Vite frontend for our team's library app. It talks to the
[books API backend](https://github.com/yuexinghu02/language-of-computation-week6-assignment-backend)
over HTTP.

## Running it

1. Start the backend first by following its README. It must answer at `http://localhost:8000/health`.
2. In this folder:

   ```
   npm install
   npm run dev
   ```

3. Open http://localhost:5173.

The frontend calls `http://localhost:8000` by default. To use another address, copy
`.env.example` to `.env`, change `VITE_API_URL`, and restart `npm run dev`.

## What's here

| Path | What it is |
| --- | --- |
| `src/api.js` | Every call to the backend, plus turning its error replies into readable messages |
| `src/App.jsx` | The page frame: header and navigation |
| `src/books/` | The Books screen: search and filters, paged results, and a detail panel |

## Working together

Each of us builds a different part of the UI on our own branch, then merges into `main`.
Build against what the backend actually offers: `http://localhost:8000/openapi.json`, or
the interactive version at `http://localhost:8000/docs`.

```
npm run lint    # check the code
npm run build   # make sure it compiles
```
