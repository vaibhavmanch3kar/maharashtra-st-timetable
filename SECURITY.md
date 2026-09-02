# Security Policy

## Scope

This is a static, client-only application: no server code, no database, no
accounts, no cookies, no third-party analytics. The attack surface is
correspondingly small, but not zero.

In scope:
- XSS via dataset fields or URL parameters rendered into the DOM
- Service-worker cache poisoning or scope abuse
- Supply-chain risk from the two external origins (Tailwind CDN, Google Fonts)
- CSP bypasses in the provided server configurations

Out of scope:
- Accuracy of timetable data (report as a normal issue)
- Vulnerabilities in browsers or hosting platforms themselves

## Reporting

Do **not** open a public issue for a vulnerability. Use GitHub's private
vulnerability reporting ("Report a vulnerability" under the Security tab).
Include reproduction steps and impact. Acknowledgement within 7 days;
fix or public disclosure coordination within 90.

## Hardening recommendations for deployers

1. Serve over HTTPS only (the provided configs redirect).
2. Self-host Tailwind (pre-built) and fonts to eliminate third-party origins
   and drop `unsafe-eval` from the CSP.
3. Keep `sw.js` at `Cache-Control: no-cache` — a poisoned, long-cached
   service worker is persistent compromise.
4. Enable Subresource Integrity if you keep any CDN script.
