# Modding the Prototype

Isaac Voxels is built to treat every significant chunk of gameplay or UI as a mod. Mods are simple JavaScript modules located under `src/mods/`, and they register with the runtime via the lightweight `ModManager` in `src/modManager.js`.

## Mod Entry Points

A mod exports an object shaped like this:

```js
export const exampleMod = {
  id: 'example',
  name: 'Example Mod',
  description: 'What this mod controls.',
  async setup(context) {
    // Called once before the game loop starts.
  },
  update(context) {
    // Runs each frame. The context includes delta, input, and shared helpers.
  },
  lateUpdate(context) {
    // Optional second pass.
  },
}
```

### Shared Context

`context` includes:

- `scene`, `camera`, `renderer`: Three.js essentials.
- `clock`: Shared clock for consistent timing.
- `input`: Tracks pressed keys (`input.keys`) and pointer position (`input.pointer`). Use `input.keys.has('g')` to detect held keys.
- `hud`: DOM element where mods can append overlays.
- `progress`: Shared status text node at the bottom-left.
- `registerSystem(key, value)`: Expose capabilities (like terrain regeneration) so other mods can use them.
- `mods` (map of registered systems) and `registeredMods` (array of mod metadata) for introspection.

## Adding a New Mod

1. Create `src/mods/myMod.js` and export your mod object.
2. Import your mod into `src/mods/index.js` and include it in the exported array.
3. Use camera, scene, or DOM APIs freely. Keep everything scoped to your mod so it can be swapped with another implementation.
4. If your mod should expose services (e.g., `myMod.setDifficulty()`), call `context.registerSystem('myMod', { setDifficulty })` during `setup()`.

## Runtime Hooks

- The mod manager executes `setup()` for each mod sequentially before the animation loop.
- Each frame, `update(deltaContext)` runs, followed by optional `lateUpdate` hooks.
- Mods can mutate the shared context (e.g., `context.progress.textContent = 'Something'`) to inform other systems.

## Example: Terrain Mod

The terrain mod uses an `InstancedMesh` of `THREE.BoxGeometry` to draw the voxel ground. It registers a terrain system with `regenerate`, `setWireframe`, and `setRotationSpeed`, which the toolkit UI mod consumes. Regeneration can be triggered via the `G` key or the toolkit button.

## Example: Toolkit UI Mod

Displays a panel that lists every registered mod, lets you regenerate terrain, toggle wireframes, and tweak rotation speed. It reads from `context.registeredMods` to keep the list up-to-date and calls terrain services via `context.mods.terrain`.

## Example: Survival Modifier Mod

Keeps track of dynamic stats (hunger, stamina, focus) and writes updates to both the HUD and the shared progress text. It listens for `R` to rest and uses `context.progress` to notify the player.

## Tips

- Keep mods self-contained so you can drop-in replacements easily.
- Use `context.registerSystem` to expose commands or data your mod provides.
- UI mods should generally append inside `context.hud` so layout stays consistent.
- Rebuild your scene on demand (for example, by exposing a `regenerate()` function) to keep rendering lightweight.
