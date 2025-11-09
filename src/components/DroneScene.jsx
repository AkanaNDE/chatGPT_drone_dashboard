// src/components/DroneScene.jsx
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import ReferenceAxes from './axes/ReferenceAxes.jsx'
import Drone from './Drone.jsx'
import { DRONE_POSE } from '../constants/droneState.js'
import { eulerZYXDegToQuat } from '../lib/math.js'

export default function DroneScene({ dronePose }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const droneGroupRef = useRef(null)   // ✅ เก็บ group ของโดรน
  const [three, setThree] = useState(null)

  useEffect(() => {
    const container = wrapRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)

    // Camera
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200)
    camera.position.set(6, 4, 6)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.target.set(0, 0, 0)

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const dir = new THREE.DirectionalLight(0xffffff, 0.8)
    dir.position.set(5, 8, 5)
    scene.add(dir)

    // Grid
    const grid = new THREE.GridHelper(50, 50, 0x999999, 0xdddddd)
    grid.position.y = -0.001
    scene.add(grid)

    // ✅ เส้น origin → drone (เก็บไว้ใน scene)
    const lineMat = new THREE.LineBasicMaterial({ color: 0xff0066 })
    const lineGeom = new THREE.BufferGeometry()
    const line = new THREE.Line(lineGeom, lineMat)
    scene.add(line)

    setThree({ scene, camera, renderer, controls, grid, line, lineGeom })

    // Resize
    const resize = () => {
      const { clientWidth, clientHeight } = container
      const w = Math.max(1, clientWidth)
      const h = Math.max(1, clientHeight)
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize)

    // Animate
    let raf = 0
    const tmp = new THREE.Vector3()
    const tick = () => {
      // อัปเดตปลายเส้นให้ “ติดโดรน”
      if (droneGroupRef.current && three?.line && three?.lineGeom) {
        droneGroupRef.current.getWorldPosition(tmp)
        updateLine(three.line, new THREE.Vector3(0,0,0), tmp) // ต้นเส้น origin, ปลาย = จุดโดรน (world)
      }

      controls.update()
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      scene.remove(grid, line)
      lineGeom.dispose(); lineMat.dispose()
      renderer.dispose()
    }
  }, []) // eslint-disable-line

  return (
    <div className="canvas-wrap" ref={wrapRef} style={{ position: 'relative' }}>
      <div className="floating-label">Drag หมุน | Wheel ซูม | Right-Drag แพน</div>
      <canvas ref={canvasRef} />

      {three?.scene && <ReferenceAxes scene={three.scene} size={2} />}

      {three?.scene && (
        <Drone
          scene={three.scene}
          position={dronePose.position}
          quaternion={eulerZYXDegToQuat(dronePose.rpyDeg)}
          onReady={group => droneGroupRef.current = group}
        />
      )}
    </div>
  )
}

function updateLine(line, a, b) {
  const positions = new Float32Array([
    a.x, a.y, a.z,
    b.x, b.y, b.z
  ])
  line.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  line.geometry.computeBoundingSphere()
}