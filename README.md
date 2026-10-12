# Spatial Audio Tools site

Spatial Audio Tools provides browser-based tools for preparing and processing spatial audio impulse responses. The HeSuVi Auto Editor page currently inspects WAV files and prepares settings for the Python converter.

The HeSuVi Auto Editor checks RIFF WAV headers, prepares a CLI configuration, and guides users through local conversion with the Python CLI.

## Frontend tests

Requires Node.js 18 or newer:

```sh
node --test tests/frontend.test.cjs
```
