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

    this.statEls = {
      hunger: this.panel.querySelector('[data-stat="hunger"]'),
      stamina: this.panel.querySelector('[data-stat="stamina"]'),
      focus: this.panel.querySelector('[data-stat="focus"]'),
    }

    this.customProgress = null
    this.customProgressTimer = 0

    context.registerSystem('survival', {
      applyGather: (type) => this.handleGather(type),
      getState: () => ({ ...this.state }),
    })
  },

  update(context) {
    const { delta, input } = context
    this.state.hunger = Math.min(100, this.state.hunger + delta * 4)
    this.state.stamina = Math.max(0, this.state.stamina - delta * 3)
    this.state.focus = Math.max(0, this.state.focus - delta * 1.5)

    if (input.keys.has('r')) {
      this.applyRest()
    }

    this.renderStats()
    this.refreshProgress(delta)
  },

  renderStats() {
    this.statEls.hunger.textContent = this.state.hunger.toFixed(0)
    this.statEls.stamina.textContent = this.state.stamina.toFixed(0)
    this.statEls.focus.textContent = this.state.focus.toFixed(0)
  },

  refreshProgress(delta) {
    if (this.customProgress) {
      this.customProgressTimer -= delta
      if (this.customProgressTimer > 0) {
        this.context.progress.textContent = this.customProgress
        return
      }
      this.customProgress = null
    }
    this.context.progress.textContent = this.getStatusMessage()
  },

  getStatusMessage() {
    if (this.state.hunger > 85) {
      return 'Need to forage soon.'
    }
    if (this.state.stamina < 25) {
      return 'Energy running low.'
    }
    return 'Status stable.'
  },

  handleGather(type) {
    if (type === 'wood') {
      this.state.hunger = Math.max(0, this.state.hunger - 6)
      this.state.focus = Math.min(100, this.state.focus + 5)
      this.setProgressMessage('Gathered timber. Hunger eased.', 3)
    } else if (type === 'stone') {
      this.state.stamina = Math.min(100, this.state.stamina + 5)
      this.state.focus = Math.max(0, this.state.focus - 3)
      this.setProgressMessage('Stone hauled in. Endurance boosted.', 3)
    } else {
      this.setProgressMessage('Collected something unknown.', 2)
    }
    this.renderStats()
  },

  applyRest() {
    this.state.stamina = Math.min(100, this.state.stamina + 25)
    this.state.focus = Math.min(100, this.state.focus + 15)
    this.setProgressMessage('Resting restored stamina.', 3)
    this.renderStats()
  },

  setProgressMessage(message, duration = 2) {
    this.customProgress = message
    this.customProgressTimer = duration
    this.context.progress.textContent = message
  },
}
