
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ReferenceAxes({ scene, size = 2 }) {
  const axesRef = useRef()

  useEffect(() => {
    if (!scene) return
    const axes = new THREE.AxesHelper(size)
    axesRef.current = axes
    scene.add(axes)
    return () => {
      scene.remove(axes)
      axes.geometry?.dispose?.()
      axes.material?.dispose?.()
    }
  }, [scene, size])

  return null
}