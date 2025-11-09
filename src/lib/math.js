import * as THREE from 'three'

export const deg2rad = d => (d * Math.PI) / 180.0

// สร้าง quaternion จาก RPY (deg) ตามลำดับ ZYX (yaw, pitch, roll)
export function eulerZYXDegToQuat(rpyDeg) {
  const { roll, pitch, yaw } = rpyDeg
  const e = new THREE.Euler(
    deg2rad(roll),
    deg2rad(pitch),
    deg2rad(yaw),
    'ZYX' // ความหมาย: ใช้มุมที่กำหนดกับลำดับการหมุน Z->Y->X
  )
  const q = new THREE.Quaternion()
  q.setFromEuler(e)
  return q
}

// หาทิศ "forward" ของโดรนจาก quaternion (แกน +X เป็น forward ของตัวโดรน)
export function forwardVectorFromQuat(q) {
  const m = new THREE.Matrix4().makeRotationFromQuaternion(q)
  const f = new THREE.Vector3(1, 0, 0).applyMatrix4(m).normalize()
  return f
}