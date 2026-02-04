# Roadmap

## Prototype Polishes

- [x] Modular entry-point (ModManager) that bootstraps terrain, UI, and survival modules.
- [x] Three.js-powered voxel terrain with instanced rendering and simple regeneration controls.
- [x] Toolkit HUD with mod list, action buttons, and parameter sliders.
- [x] Survival stats mod (hunger, stamina, focus) that demonstrates runtime state composability.
- [x] Documentation, AGC-ready README, modding guide, and GitHub Actions workflow.

## Next Up

1. **Procedural biomes** – add per-chunk biome data with textures/voxel variants and a noise-driven color palette.
2. **Tooling mod** – introduce a builder tool (block placement/removal) as a mod so basic interactions live in scripts.
3. **Survival chain** – hunger should open craft/forage opportunities; survival mod should emit events that other mods can react to.
4. **Better lighting / day-night cycle** – move lights into a mod so we can swap between flat vs dynamic time-of-day.
5. **Mod marketplace** – support dynamic import of external mod manifests (e.g., load from CDN) for experimentation.
6. **Story hooks** – add narrative prompts and objectives to guide player interactions within the voxel landscape.
