# Contributing

Thank you for helping make Maharashtra's bus timetables usable by everyone.

## The most valuable contributions

1. **Timetable data.** New depot sheets, corrections to departure times, missing via-stops. Open an issue with a photo/scan or link to the published sheet, or submit rows in the CSV schema used in `data/timetables_web_extracted.csv`. Cite the source sheet and its date — undated data cannot be verified and will not be merged.
2. **Marathi copy.** Translation corrections in the `I18N.mr` object in `index.html`. Native-speaker review of register and transliteration is worth more than any code change.
3. **Accessibility reports.** If any screen reader, switch device, or magnifier struggles with a flow, that is a bug. Name the assistive tech and version.

## Ground rules for code

- **No frameworks, no build step.** The single-file/no-toolchain constraint is the deployment story for low-resource hosts. PRs adding npm, bundlers, or frameworks will be declined regardless of quality.
- **Data honesty is non-negotiable.** Anything not sourced from a published sheet is modelled and must be marked as such in-product. PRs that present synthetic values (fares, live status) as real data will be declined.
- **Accessibility floor:** 48 px touch targets, visible focus, WCAG AA contrast, keyboard operability for every new control. The Playwright checks in the repo history show the expected assertions.
- Comments explain *why*, not *what*. Match the existing style.

## Workflow

1. Fork → branch (`fix/ratnagiri-0630-departure`, `feat/nashik-depot-data`)
2. Test on a real phone and with keyboard-only navigation
3. PR with: what changed, why, data source (for data PRs), before/after screenshots (for UI PRs)
4. One reviewer approval merges. Data PRs need the source citation checked.

## Reporting bugs

Open an issue with device, browser, steps, and a screenshot. For timetable errors, name the depot, destination, and printed time on the source sheet.
