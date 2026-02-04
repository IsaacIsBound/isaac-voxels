export const toolkitMod = {
  id: 'toolkit-ui',
  name: 'Toolkit UI',
  description: 'Overlays handy controls for the prototype environment.',
  setup(context) {
    this.context = context
    this.panel = document.createElement('section')
    this.panel.className = 'toolkit-panel'
    this.panel.innerHTML = `
      <header>
        <h2>Toolkit</h2>
        <p>Core mods are exposed here so you can swap them on the fly.</p>
      </header>
      <div class="mod-list" data-mod-list></div>
      <div class="toolkit-actions">
        <button data-action="regen">Regenerate Terrain (G)</button>
        <label>
          <span>Rotation Speed</span>
          <input type="range" min="0" max="0.2" step="0.01" value="0.02" data-action="rotation">
        </label>
        <label>
          <input type="checkbox" data-action="wireframe">
          <span>Wireframe</span>
        </label>
      </div>
    `
    context.hud.appendChild(this.panel)
    this.modListEl = this.panel.querySelector('[data-mod-list]')
    this.lastModCount = 0
    this.buildModList()
    this.wireframeToggle = this.panel.querySelector('[data-action="wireframe"]')
    this.wireframeToggle.addEventListener('change', () => {
      const terrain = context.mods.terrain
      terrain?.setWireframe(this.wireframeToggle.checked)
    })
    const rotationInput = this.panel.querySelector('[data-action="rotation"]')
    rotationInput.addEventListener('input', (event) => {
      const speed = parseFloat(event.target.value)
      const terrain = context.mods.terrain
      terrain?.setRotationSpeed(speed)
    })
    const regenButton = this.panel.querySelector('[data-action="regen"]')
    regenButton.addEventListener('click', () => {
      this.context.mods.terrain?.regenerate()
      this.context.progress.textContent = 'Terrain regenerated from toolkit panel.'
    })
  },

  buildModList() {
    const mods = this.context.registeredMods || []
    this.modListEl.innerHTML = ''
    mods.forEach((mod) => {
      const entry = document.createElement('article')
      entry.className = 'mod-entry'
      entry.innerHTML = `
        <h3>${mod.name}</h3>
        <p>${mod.description}</p>
      `
      this.modListEl.appendChild(entry)
    })
  },

  update(context) {
    const mods = this.context.registeredMods || []
    if (mods.length !== this.lastModCount) {
      this.buildModList()
      this.lastModCount = mods.length
    }
  },
}
