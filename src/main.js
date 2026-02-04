import './style.css'
import * as THREE from 'three'
import { ModManager } from './modManager.js'
import { mods } from './mods/index.js'

const app = document.querySelector('#app')
app.innerHTML = `
  <div class="game-shell">
    <canvas class="scene"></canvas>
    <div class="hud" data-hud="root"></div>
    <div class="progress" data-progress="message">Initializing...</div>
  </div>
`

const canvas = app.querySelector('canvas')
const hud = app.querySelector('[data-hud="root"]')
const progress = app.querySelector('[data-progress="message"]')

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const scene = new THREE.Scene()
scene.background = new THREE.Color('#0a111c')

const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 500)
camera.position.set(0, 16, 24)
camera.lookAt(0, 6, 0)

const clock = new THREE.Clock()

const input = {
  keys: new Set(),
  pointer: { x: 0, y: 0 },
  register(key) {
    this.keys.add(key)
  },
  unregister(key) {
    this.keys.delete(key)
  },
}

window.addEventListener('keydown', (event) => input.register(event.key))
window.addEventListener('keyup', (event) => input.unregister(event.key))
window.addEventListener('pointermove', (event) => {
  input.pointer.x = event.clientX
  input.pointer.y = event.clientY
})

const modManager = new ModManager({
  scene,
  camera,
  renderer,
  clock,
  input,
  hud,
  progress,
})

mods.forEach((mod) => modManager.register(mod))

function resize() {
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  renderer.setSize(width, height, false)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

window.addEventListener('resize', resize)
resize()

let lastTimestamp = 0

async function start() {
  await modManager.bootstrap()
  progress.textContent = 'Prototype live. Mods running.'
  lastTimestamp = performance.now()
  requestAnimationFrame(loop)
}

function loop(timestamp) {
  const delta = (timestamp - lastTimestamp) / 1000
  lastTimestamp = timestamp
  modManager.update(delta)
  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}

start()

export const runtime = {
  scene,
  camera,
  renderer,
  modManager,
}
