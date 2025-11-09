import React, { useState, useEffect } from 'react'
import DroneScene from './components/DroneScene.jsx'

// ✅ ลบการใช้ DRONE_POSE แบบ static
// import { DRONE_POSE } from './constants/droneState.js'

export default function App() {

  // ✅ ใช้ state แทนค่า static
  const [dronePose, setDronePose] = useState({
    position: { x: 0, y: 1.2, z: -3 },
    rpyDeg: { roll: 10, pitch: -15, yaw: 40 }
  });

  // ✅ เพิ่มค่า x ทุก 50ms (ช้าสวย ๆ ลื่น ๆ)
  useEffect(() => {
    const interval = setInterval(() => {
      setDronePose(prev => ({
        ...prev,
        position: {
          ...prev.position,
          x: prev.position.x + 0.02   // ✅ เพิ่มทีละ 0.02
        }
      }));
    }, 50); // ms

    return () => clearInterval(interval);
  }, []);

  const { position, rpyDeg } = dronePose;

  return (
    <div className="app">
      <div className="panel">
        <h1>Drone Pose Dashboard</h1>
        <div className="grid">
          <div>
            <h3>Reference (World)</h3>
            <p>X: 0.00</p>
            <p>Y: 0.00</p>
            <p>Z: 0.00</p>
          </div>
          <div>
            <h3>Drone (Position)</h3>
            <p>X: {position.x.toFixed(2)}</p>
            <p>Y: {position.y.toFixed(2)}</p>
            <p>Z: {position.z.toFixed(2)}</p>
          </div>
          <div>
            <h3>Drone (RPY °)</h3>
            <p>Roll:  {rpyDeg.roll.toFixed(1)}</p>
            <p>Pitch: {rpyDeg.pitch.toFixed(1)}</p>
            <p>Yaw:   {rpyDeg.yaw.toFixed(1)}</p>
          </div>
        </div>

        <p className="hint">
          หมายเหตุ: ซีนแสดงแกนอ้างอิงโลก (RGB = X,Y,Z), เส้นเชื่อมจาก origin ไปยังโดรน และลูกศร “forward” ของโดรน
        </p>
      </div>

      {/* ✅ ส่ง dronePose ไปให้ DroneScene เพื่ออัปเดตการเคลื่อนที่ */}
      <DroneScene dronePose={dronePose} />
    </div>
  )
}