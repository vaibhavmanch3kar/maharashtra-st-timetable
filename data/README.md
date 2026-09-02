# Data provenance

## What is in this folder

`timetables_web_extracted.csv` — 371 rows extracted from published depot
timetable pages (Ratnagiri, Mumbai Central, Pune Swargate, Kurundwad),
retrieved 2026-08-28. Columns: source, source_type, destination,
departure_times, route (via-stops), distance, fare (where published).

## How the in-app dataset was produced

1. Source rows were parsed; departure-time lists were split and validated
   (invalid clock values such as `7:90` in the Kurundwad source were dropped).
2. Each (origin, destination, departure) became one service — 1,514 total
   across 278 stations.
3. Fields the sources do not publish — arrival, duration, distance, fare,
   service class, platform, seats, status — were **modelled** with simple
   heuristics so the interface could be demonstrated end-to-end. They are
   labelled as modelled inside the app (Settings → Data sources).
4. The result was packed into positional arrays and embedded in `index.html`
   (schema documented at the top of the application script).

## Replacing the data

To load real data, produce the packed JSON structure described in
`index.html` §1 (`PACKED`: stations `s`, classes `c`, via-pool `v`, rows `r`)
and replace the embedded object. Everything else adapts automatically,
including both languages and the analytics panel.

## Known gaps

- 31 MSRTC divisional timetables exist only as scanned Marathi PDFs
  (614 pages, image-only, Devanagari numerals) and are **not yet** in this
  dataset. OCR or official structured data is required to ingest them.
- Fares shown in-app are modelled, not tariff-table values.
