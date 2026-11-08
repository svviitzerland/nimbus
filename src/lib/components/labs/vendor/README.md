# CVSS 4.0 scoring engine

Source is [Red Hat Product Security and FIRST contributors](https://github.com/RedHatProductSecurity/cvss-v4-calculator/blob/b0930b7646be5892492df16ba81cd8d8423eb49a/cvss40.js), pinned to `b0930b7646be5892492df16ba81cd8d8423eb49a`.

The scoring algorithm and tables are unchanged. Nimbus replaces browser globals and CommonJS exports with ESM exports and adds a TypeScript check directive for the untyped upstream source. The typed and validated lesson API is `../cvss.ts`. No network requests are made by the engine.

BSD 2 clause license is retained in this folder and distributed at `/licenses/cvss.txt`. Upstream source is excluded from formatting and lint rewriting to keep review against the pinned source straightforward. Tests cover reference vectors, zero impact, metric validation, and reproducibility.
