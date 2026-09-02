# Changelog

All notable changes to this project are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/) · Versioning: [SemVer](https://semver.org/).
The service-worker `CACHE_VERSION` in `sw.js` must be bumped with every release.

## [1.1.0] — 2026-09-02
### Added — accessibility release
- Text-size control (100–145%) scaling the entire interface via root font-size; desktop header A−/A+ and mobile Settings picker
- High-contrast mode: user toggle plus automatic `prefers-contrast: more` support
- Skip-to-results link as first tab stop
- `aria-live` announcement of result counts on every filter change
- Mobile sheet upgraded to a true dialog: `role="dialog"`, `aria-modal`, focus trap, Escape to close, focus restoration
- Combobox pattern for station autocomplete (`aria-activedescendant`, `aria-selected`)
- Table caption, `scope="col"`, `aria-sort`, keyboard-operable sort headers (Enter/Space)
- 48 px minimum touch-target floor, verified by automated test
### Changed
- Application script wrapped in a strict-mode IIFE; zero globals
- `CACHE_VERSION` → `msrtc-v1.1.0`

## [1.0.0] — 2026-09-02
### Added
- Initial release: 1,514 services / 278 stations from four depot timetable sources
- Bilingual UI (English/Marathi) with Devanagari numeral mode
- Mobile destination-board cards, desktop multi-column sortable table
- Filters: class, departure window, routing, fare, seats; analytics panel with hourly histogram
- Offline PWA: versioned service worker, manifest, icons
- Server configs: nginx, IIS `web.config`, Apache `.htaccess`
