# wasm-experiments

This repo contains a number of tests and and small programs to experiment
with various post-MVP WebAssembly proposals, see the WebAssembly
[Roadmap](https://webassembly.org/roadmap/).

## Quick Start

This repo requires node v18.

- `npm install -g pnpm`
- `pnpm install`
- `pnpm test:run`
- `pnpm tail-call`
- `pnpm type-reflection`

The reason the "Tail Call" and "Type Reflection" examples aren't written
as tests is they require special node flags to run and `vitest` doesn't
pass through to child node processes.
