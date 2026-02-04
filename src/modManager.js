export class ModManager {
  constructor(context) {
    this.context = {
      ...context,
      mods: {},
      registerSystem: (key, value) => {
        this.context.mods[key] = value
      },
    }
    this.mods = []
  }

  register(mod) {
    const modCopy = { ...mod }
    this.mods.push(modCopy)
    this.context.registeredMods = this.mods
  }

  async bootstrap() {
    for (const mod of this.mods) {
      if (mod.setup) {
        await mod.setup(this.context)
      }
    }
  }

  update(delta) {
    this.context.delta = delta
    for (const mod of this.mods) {
      if (mod.update) {
        mod.update(this.context)
      }
      if (mod.lateUpdate) {
        mod.lateUpdate(this.context)
      }
    }
  }
}
