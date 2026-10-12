# Spatial Audio Tools site

Spatial Audio Tools provides browser-based tools for preparing and processing spatial audio impulse responses. The HeSuVi Auto Editor converts stereo 7.1 captures to aligned 14-channel WAV files locally in the browser.

The editor includes Simple and Glass layouts, light and dark themes, impulse-response plots, and output statistics. Runtime files live under `hesuvi-auto-editor/`; no build step is required.

## Frontend tests

Requires Node.js 18 or newer:

```sh
node --test tests/frontend.test.cjs
```
