# Roadmap

## Prototype Polishes

- [x] Modular entry-point (ModManager) that bootstraps terrain, UI, and survival modules.
- [x] Three.js-powered voxel terrain with instanced rendering and simple regeneration controls.
- [x] Toolkit HUD with mod list, action buttons, and parameter sliders.
- [x] Survival stats mod (hunger, stamina, focus) that demonstrates runtime state composability.
- [x] Documentation, AGC-ready README, modding guide, and GitHub Actions workflow.

## Moddable Survival Expansion

The prototype now owns an event-aware survival system, so the next wave of work is to treat survival as a mod-driven ecosystem. The notes below describe how the upcoming modules should connect, how data should flow between them, and what UX scaffolding is needed for each.

### 1. Resource Gathering Layer

- Surface gatherable nodes (wood, stone, maybe metals) as their own mod so they can share a world-space group and highlight logic without touching the terrain.
- Emit context events (`resources` system) so other mods can read inventory counts or react to new harvests (e.g., survival stat adjustments, quest triggers).
- Provide HUD feedback via a dedicated resource panel plus progress messages that can be overridden by the survival mod when it needs to broadcast urgent status.
- Allow other mods (future crafting/base-building mods) to request a resource snapshot from `context.mods.resources.getInventory()`.

### 2. Base Building Layer

- Implement a foundation/floor mod that places modular nodes (platforms, walls, ramps) in the scene via a gizmo tool; each placement should consume resources from the shared resource system.
- Support construction categories (core, shelter, storage) with simple recipes so future mods can register new blueprints without editing the builder itself.
- Track active bases through a registry that exposes placement costs and health so other survival mods (storms, raids) can modify them mid-session.

### 3. Feedback & UI Layer

- Extend the HUD to show the most critical survival alerts (resource scarcity, shelter damage, quest updates) while keeping the toolkit information-rich but lightweight.
- Broadcast `progress` messages through a queue or timer so we can show harvest success, rest effects, and base-build confirmations sequentially.
- Add visual cues (glows, outlines) to nodes and placed structures to reinforce their interactability, tying back to the mod manager so tweaks stay modular.

## Next Up

1. **Procedural biomes** – add per-chunk biome data with textures/voxel variants and a noise-driven color palette.
2. **Tooling mod** – introduce a builder tool (block placement/removal) as a mod so basic interactions live in scripts.
3. **Survival chain** – hunger should open craft/forage opportunities; survival mod should emit events that other mods can react to.
4. **Better lighting / day-night cycle** – move lights into a mod so we can swap between flat vs dynamic time-of-day.
5. **Mod marketplace** – support dynamic import of external mod manifests (e.g., load from CDN) for experimentation.
6. **Story hooks** – add narrative prompts and objectives to guide player interactions within the voxel landscape.
