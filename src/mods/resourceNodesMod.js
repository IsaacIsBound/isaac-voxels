import * as THREE from 'three'

const RESOURCE_TYPES = {
  wood: { color: '#9ae6cf', description: 'Fuel & food fibers' },
  stone: { color: '#cbd5ff', description: 'Structure & salvage' },
}
const NODE_COUNT = 14

export const resourceNodesMod = {
  id: 'resource-nodes',
  name: 'Resource Nodes',
  description: 'Scatters gatherable nodes and exposes a lightweight inventory UI.',

  setup(context) {
    this.context = context
    this.scene = context.scene
    this.camera = context.camera
    this.renderer = context.renderer
    this.input = context.input
    this.pointer = new THREE.Vector2()
    this.raycaster = new THREE.Raycaster()
    this.nodeGroup = new THREE.Group()
    this.scene.add(this.nodeGroup)

    this.inventory = {
      wood: 0,
      stone: 0,
    }

    this.nodes = []
    this.allowGather = true
    this.activeHighlight = null

    this.panel = document.createElement('section')
    this.panel.className = 'resource-panel'
    this.panel.innerHTML = `
      <h2>Resource Cache</h2>
      <p>Point at a node and press <strong>E</strong> to harvest it.</p>
      <ul>
        <li><span>Wood</span><strong data-resource="wood">0</strong></li>
        <li><span>Stone</span><strong data-resource="stone">0</strong></li>
      </ul>
      <p class="resource-hint">Nearest node: <span data-nearest>None</span></p>
    `
    context.hud.appendChild(this.panel)

    this.entries = {
      wood: this.panel.querySelector('[data-resource="wood"]'),
      stone: this.panel.querySelector('[data-resource="stone"]'),
    }
    this.nearestLabel = this.panel.querySelector('[data-nearest]')

    this.buildNodes(NODE_COUNT)

    context.registerSystem('resources', {
      getInventory: () => ({ ...this.inventory }),
    })
  },

  buildNodes(count) {
    const geometry = new THREE.IcosahedronGeometry(0.65, 0)
    const spread = 24
    for (let i = 0; i < count; i += 1) {
      const type = i % 2 === 0 ? 'wood' : 'stone'
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * spread,
        Math.random() * 1 + 1,
        (Math.random() - 0.5) * spread
      )
      const material = new THREE.MeshStandardMaterial({
        color: RESOURCE_TYPES[type].color,
        emissive: '#1a1f2d',
        emissiveIntensity: 0.5,
        metalness: 0.2,
        roughness: 0.6,
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.copy(position)
      const scale = 1 + Math.random() * 0.4
      mesh.scale.setScalar(scale)
      const node = {
        mesh,
        type,
        baseScale: scale,
      }
      mesh.userData.node = node
      this.nodeGroup.add(mesh)
      this.nodes.push(node)
    }
  },

  update(context) {
    const { delta } = context
    this.nodes.forEach((node) => {
      node.mesh.rotation.y += delta * 0.8
    })

    this.updatePointer()
    const target = this.findTarget()
    this.updateHighlight(target)
    this.updateNearestLabel(target)

    if (!context.input.keys.has('e')) {
      this.allowGather = true
    }

    if (context.input.keys.has('e') && this.allowGather) {
      this.allowGather = false
      this.tryGather(target)
    }
  },

  updatePointer() {
    const rect = this.renderer.domElement.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) {
      return
    }
    this.pointer.x = ((this.input.pointer.x - rect.left) / rect.width) * 2 - 1
    this.pointer.y = -((this.input.pointer.y - rect.top) / rect.height) * 2 + 1
  },

  findTarget() {
    if (!this.nodes.length) {
      return null
    }
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const intersects = this.raycaster.intersectObjects(this.nodeGroup.children, false)
    if (!intersects.length) {
      return null
    }
    return intersects[0].object.userData.node || null
  },

  updateHighlight(target) {
    if (this.activeHighlight && this.activeHighlight !== target) {
      this.activeHighlight.mesh.scale.setScalar(this.activeHighlight.baseScale)
      this.activeHighlight.mesh.material.emissiveIntensity = 0.5
    }
    if (target && this.activeHighlight !== target) {
      target.mesh.scale.setScalar(target.baseScale * 1.25)
      target.mesh.material.emissiveIntensity = 1
    }
    this.activeHighlight = target
  },

  updateNearestLabel(target) {
    if (!target) {
      this.nearestLabel.textContent = 'None'
      return
    }
    const distance = target.mesh.position.distanceTo(this.camera.position).toFixed(1)
    this.nearestLabel.textContent = `${target.type} (${distance}m)`
  },

  tryGather(target) {
    if (!target) {
      this.context.progress.textContent = 'Aim at a resource node to harvest.'
      return
    }
    this.collectNode(target)
  },

  collectNode(node) {
    const { type, mesh } = node
    this.inventory[type] += 1
    this.updateInventoryDisplay()
    this.context.progress.textContent = `Harvested ${type}. Inventory updated.`
    this.context.mods.survival?.applyGather(type)

    this.nodeGroup.remove(mesh)
    this.nodes = this.nodes.filter((entry) => entry !== node)
    if (this.activeHighlight === node) {
      this.activeHighlight = null
      this.nearestLabel.textContent = 'None'
    }
  },

  updateInventoryDisplay() {
    Object.entries(this.entries).forEach(([type, el]) => {
      if (this.inventory[type] != null) {
        el.textContent = this.inventory[type]
      }
    })
  },
}
