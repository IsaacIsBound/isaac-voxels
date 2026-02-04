# Isaac Voxels

A web-first-person voxel survival prototype powered by Three.js with every core feature provided as a swap-in mod. The entire experience is driven by a small `ModManager` that bootstraps terrain, toolkit UI, and survival modifiers so you can replace, combine, or extend them from JavaScript scripts.

## Highlights

- **Mod-first architecture** – treat terrain generation, UI, survival logic, or anything else as individual scripts that register with the runtime.
- **Voxel rendering** – instanced cubes powered by Three.js give a lightweight scene you can regenerate on demand.
- **Toolkit HUD** – interactively tweak rendering parameters, regenerate terrain, and inspect active mods.
- **Survival modifier** – hunger, stamina, and focus stats evolve over time so you can layer more complex status effects.
- **GitHub Actions + Pages** – we build with `npm run build` and deploy to GitHub Pages automatically (workflow included).

## Getting Started

```bash
npm install
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

## Modding Guide

Every core feature lives inside `src/mods/`. Each mod should export an object with some of the following hooks:

- `setup(context)` — initialize scene objects, UI, or systems.
- `update(context)` — run per-frame logic (capturing `delta`, `input`, etc.).
- `lateUpdate(context)` — optional second-phase updates.
- `description`, `name`, `id` — metadata surfaces to the Toolkit.

The shared `context` object includes the renderer, scene, camera, HUD container, clock, input state, a global progress text node, and a `registerSystem(key, value)` helper. Use that helper to expose capabilities to other mods (e.g., terrain exposes `regenerate`, `setWireframe`, `setRotationSpeed`).

Add a new mod by creating a file (for example, `src/mods/myFeature.js`), exporting the mod object, and appending it to `src/mods/index.js`. The toolkit UI automatically lists every registered mod and lets you trigger their exposed systems if available.

## Vite + Three.js Notes

- `main.js` sets up the renderer, camera, and mod manager.
- Input is tracked via a lightweight object that records pressed keys and pointer movement.
- Scene resizing keeps the canvas full-viewport. If you regenerate terrain with `G` or the toolkit button, the instanced mesh is rebuilt.

## Documentation

- `docs/modding.md` – deeper explanation of the mod contracts and runtime shape.
- `ROADMAP.md` – planned next steps (procedural biomes, tools, survival expansion, etc.).

## CI / Deployment

A GitHub Actions workflow (`.github/workflows/pages.yml`) runs on pushes to `main`. It installs dependencies, builds the Vite app, and deploys the `dist/` folder to GitHub Pages via `JamesIves/github-pages-deploy-action@v4`. The workflow publishes the `gh-pages` branch, so make sure GitHub Pages is configured to serve from that branch.

## Next Steps

See `ROADMAP.md` for upcoming improvements: procedural caves, crafting mods, survival story beats, and better starter content.
