# Spatial Audio Tools site

Public, documentation-only GitHub Pages source. The site contains the HeSuVi Auto Editor setup/usage page and its existing local-only browser helper, plus a simple landing page and a blank Apple2Sofa route.

The browser helper inspects RIFF WAV headers and exports a local CLI configuration. It does not decode samples, run DSP, or upload audio. Audio conversion runs in the local Python CLI.

## Frontend tests

Requires Node.js 18 or newer:

```sh
node --test tests/frontend.test.cjs
```

No Python DSP source, audio recordings, private test reports, or personalized measurements are included in this repository.
