---
name: Three.js verification limits
description: How to verify React Three Fiber / WebGL scenes in this workspace, and the vite dedupe gotcha for three examples imports
---

# Verifying Three.js / R3F work

The screenshot tool's sandboxed browser has **no GPU** — `THREE.WebGLRenderer: Error creating WebGL context` and `Context Lost` in its logs are expected and NOT app bugs. The user's real browser renders fine.

**Why:** Wasted cycles investigating "broken" screenshots that were environment artifacts.

**How to apply:** For any WebGL/R3F artifact, verify with: typecheck, vite/workflow logs, and browser console logs (runtime errors still surface there). Judge visual quality from code review + user feedback, not screenshots.

## Vite + three examples imports

Importing from `three/examples/jsm/...` (e.g. BufferGeometryUtils) makes Vite optimize a second copy of three → `THREE.WARNING: Multiple instances of Three.js being imported`. Fix: add `'three'` to `resolve.dedupe` in vite config (restart required — config changes don't hot-reload).
