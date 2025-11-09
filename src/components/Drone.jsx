// src/components/Drone.jsx
import { useEffect } from 'react'
import * as THREE from 'three'

export default function Drone({ scene, position, quaternion, onReady }) {
  useEffect(() => {
    if (!scene) return

    const group = new THREE.Group()

    // ลำตัว
    const bodyGeo = new THREE.BoxGeometry(0.4, 0.1, 0.3)
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2b6cb0, metalness: 0.2, roughness: 0.6 })
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    group.add(body)

    // แขน 4 ทิศ
    const armGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 16)
    const armMat = new THREE.MeshStandardMaterial({ color: 0x718096 })
    const armX = new THREE.Mesh(armGeo, armMat)
    armX.rotation.z = Math.PI / 2
    group.add(armX)
    const armZ = new THREE.Mesh(armGeo, armMat)
    armZ.rotation.x = Math.PI / 2
    group.add(armZ)

    // โรเตอร์ 4 มุม
    const rotorGeo = new THREE.TorusGeometry(0.08, 0.01, 8, 24)
    const rotorMat = new THREE.MeshStandardMaterial({ color: 0x1a202c })
    ;[
      [ 0.3, 0,  0.2],
      [ 0.3, 0, -0.2],
      [-0.3, 0,  0.2],
      [-0.3, 0, -0.2],
    ].forEach(([x,y,z]) => {
      const r = new THREE.Mesh(rotorGeo, rotorMat)
      r.position.set(x, y + 0.02, z)
      r.rotation.x = Math.PI / 2
      group.add(r)
    })

    // ✅ ลูกศรทิศทาง: ทำเป็นลูกของ group
    // ใน local ของโดรน ให้ชี้ไป +X (1,0,0) ได้เลย
    const arrowDir = new THREE.Vector3(1, 0, 0)  // forward ใน local
    const arrow = new THREE.ArrowHelper(arrowDir, new THREE.Vector3(0, 0, 0), 1.0, 0x00aa55, 0.15, 0.08)
    // ถ้าอยากยกให้ลอยเหนือกล่องเล็กน้อย:
    arrow.position.set(0, 0.08, 0)
    group.add(arrow)

    // วางท่าของโดรน
    group.position.set(position.x, position.y, position.z)
    group.quaternion.copy(quaternion)

    scene.add(group)
    onReady?.(group)

    return () => {
      onReady?.(null)
      scene.remove(group)
      bodyGeo.dispose(); bodyMat.dispose()
      armGeo.dispose(); armMat.dispose()
      rotorGeo.dispose(); rotorMat.dispose()
      // ArrowHelper ไม่มี geometry/material จัดการเอง ไม่ต้อง dispose เพิ่มเติม
    }
  }, [scene, position, quaternion, onReady])

  return null
}