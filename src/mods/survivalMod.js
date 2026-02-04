export const survivalMod = {
  id: 'survival',
  name: 'Survival Modifier',
  description: 'Layer that simulates hunger, stamina, and motivation ticks.',
  setup(context) {
    this.context = context
    this.state = {
      hunger: 70,
      stamina: 90,
      focus: 85,
    }
    this.panel = document.createElement('section')
    this.panel.className = 'survival-panel'
    this.panel.innerHTML = `
      <h2>Survival</h2>
      <div class="stat-grid">
        <div class="stat-item"><span>Hunger</span><strong data-stat="hunger">${this.state.hunger}</strong></div>
        <div class="stat-item"><span>Stamina</span><strong data-stat="stamina">${this.state.stamina}</strong></div>
        <div class="stat-item"><span>Focus</span><strong data-stat="focus">${this.state.focus}</strong></div>
      </div>
      <button data-action="rest">Rest &amp; Recover</button>
    `
    const button = this.panel.querySelector('[data-action="rest"]')
    button.addEventListener('click', () => this.applyRest())
    context.hud.appendChild(this.panel)
  },

  update(context) {
    const { delta, input } = context
    this.state.hunger = Math.min(100, this.state.hunger + delta * 4)
    this.state.stamina = Math.max(0, this.state.stamina - delta * 3)
    this.state.focus = Math.max(0, this.state.focus - delta * 1.5)

    if (input.keys.has('r')) {
      this.applyRest()
    }

    this.panel.querySelector('[data-stat="hunger"]').textContent = this.state.hunger.toFixed(0)
    this.panel.querySelector('[data-stat="stamina"]').textContent = this.state.stamina.toFixed(0)
    this.panel.querySelector('[data-stat="focus"]').textContent = this.state.focus.toFixed(0)

    const message = this.state.hunger > 85 ? 'Need to forage soon.' : 'Status stable.'
    this.context.progress.textContent = message
  },

  applyRest() {
    this.state.stamina = Math.min(100, this.state.stamina + 25)
    this.state.focus = Math.min(100, this.state.focus + 15)
    this.context.progress.textContent = 'Resting restored stamina.'
  },
}
