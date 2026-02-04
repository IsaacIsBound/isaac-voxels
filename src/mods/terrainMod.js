import * as THREE from 'three'

const MAX_INSTANCES = 32 * 32 * 16
const HALF_SIZE = 16

export const terrainMod = {
  id: 'terrain-mod',
  name: 'Terrain Generator',
  description: 'Creates a voxel terrain pad using deterministic noise.',
  async setup(context) {
    this.scene = context.scene
    this.matrix = new THREE.Matrix4()
    this.position = new THREE.Vector3()
    this.size = new THREE.Vector3(1, 1, 1)
    this.mesh = this.createMesh()
    this.scene.add(this.mesh)
    this.setupLights(this.scene)
    this.allowRegenerate = true
    this.rotationSpeed = 0.02
    this.populateTerrain()
    context.registerSystem('terrain', {
      regenerate: () => this.populateTerrain(),
      setWireframe: (flag) => {
        this.mesh.material.wireframe = flag
      },
      setRotationSpeed: (speed) => {
        this.rotationSpeed = speed
      },
    })
  },

  update(context) {
    const { delta, input } = context
    if (!input.keys.has('g')) {
      this.allowRegenerate = true
    }
    if (input.keys.has('g') && this.allowRegenerate) {
      this.allowRegenerate = false
      this.populateTerrain()
    }
    this.mesh.rotation.y += delta * this.rotationSpeed
  },

  createMesh() {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({
      color: '#4e8c33',
      flatShading: true,
      metalness: 0.1,
      roughness: 0.8,
    })
    const instanced = new THREE.InstancedMesh(geometry, material, MAX_INSTANCES)
    instanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    instanced.castShadow = true
    instanced.receiveShadow = true
    return instanced
  },

  populateTerrain() {
    let index = 0
    for (let x = -HALF_SIZE; x < HALF_SIZE; x += 1) {
      for (let z = -HALF_SIZE; z < HALF_SIZE; z += 1) {
        const height = this.getHeight(x, z)
        for (let y = 0; y < height; y += 1) {
          if (index >= MAX_INSTANCES) return
          this.position.set(x, y, z)
          this.size.set(1, 1, 1)
          this.matrix.compose(this.position, new THREE.Quaternion(), this.size)
          this.mesh.setMatrixAt(index, this.matrix)
          index += 1
        }
      }
    }
    this.mesh.count = index
    this.mesh.instanceMatrix.needsUpdate = true
  },

  getHeight(x, z) {
    const noise = Math.sin(x * 0.25) + Math.cos(z * 0.15) + Math.sin(x * 0.1 + z * 0.2)
    return Math.max(1, Math.min(12, Math.floor((noise + 2.5) * 2)))
  },

  setupLights(scene) {
    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)
    const sun = new THREE.DirectionalLight('#ffeedd', 1)
    sun.position.set(10, 15, 5)
    scene.add(sun)
  },
}
