import { useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Vector3, Quaternion } from 'three';

export default function StartBtn({ onLand, setOrbitEnabled, setLookAroundEnabled }) {
  const { camera } = useThree();
  const [start, setStart] = useState(false);
  const [clicked, setClicked] = useState(false);
  const phase = useRef(0); // 0 = idle, 1 = fly up, 2 = descend
  const timer = useRef(0);

  const flyUpPos = new Vector3(0.1, 13, 1.4); 
  const flyDownPos = new Vector3(0.1, 3, 1.4);
  const finalLookAtTarget = new Vector3(-0.7, 1.5, -0.5);

  const flyStartPos = useRef(new Vector3());
  const flyStartQuat = useRef(new Quaternion());
  const flyUpQuat = useRef(new Quaternion());
  const finalLookQuat = useRef(new Quaternion());

  const handleClick = () => {
    const a = new Audio('/click.mp3');
    a.volume = 0.05;
    a.play();
    setOrbitEnabled(false);
    // document.body.requestPointerLock();
    setStart(true);
    setClicked(true);
    phase.current = 1;
    timer.current = 0;

    // Save current camera state
    flyStartPos.current.copy(camera.position);
    flyStartQuat.current.copy(camera.quaternion);

    // Rotation for fly up
    const cam1 = camera.clone();
    cam1.position.copy(flyUpPos);
    cam1.lookAt(flyDownPos);
    flyUpQuat.current.copy(cam1.quaternion);

    // Rotation for final look after landing
    const cam2 = camera.clone();
    cam2.position.copy(flyDownPos);
    cam2.lookAt(finalLookAtTarget);
    finalLookQuat.current.copy(cam2.quaternion);
  };

  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  useFrame((_, delta) => {
    if (phase.current === 1) {
      timer.current += delta;
      const duration = 3;
      const t = Math.min(timer.current / duration, 1);
      const easedT = easeInOutCubic(t);

      camera.position.lerpVectors(flyStartPos.current, flyUpPos, easedT);
      camera.quaternion.slerpQuaternions(flyStartQuat.current, flyUpQuat.current, easedT);

      if (t >= 1) {
        phase.current = 2;
        timer.current = 0;
      }
    }

    if (phase.current === 2) {
      timer.current += delta;

      const duration = 6.5;
      const t = Math.min(timer.current / duration, 1);
      const easedT = easeInOutCubic(t);

      camera.position.lerpVectors(flyUpPos, flyDownPos, easedT);
      camera.quaternion.slerpQuaternions(flyUpQuat.current, finalLookQuat.current, easedT);

      if (t >= 1) {
        camera.position.copy(flyDownPos);
        camera.quaternion.copy(finalLookQuat.current);
        setLookAroundEnabled(true);
        onLand?.();
        phase.current = 0;
      }
    }
  });

  if (start) return null;

  return (
    <Html fullscreen>
  <div
    onClick={handleClick}
    style={{
      position: 'absolute',
      top: '2.5vh', // responsive top spacing
      left: '50%',
      transform: `translateX(-50%) scale(${clicked ? 0.95 : 1})`,
      padding: '0.45em 1.5em',
      background: 'transparent',
      color: 'white',
      fontSize: 'clamp(0.9rem, 1.5vw, 1.125rem)', // responsive font size
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background 0.3s ease, transform 0.2s ease',
      // zIndex: 900,
      border: '1px solid white',
      borderRadius: '30px',
      filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      touchAction: 'manipulation', // helps on touch devices
    }}
  >
    Explore
  </div>
</Html>


  );
}
