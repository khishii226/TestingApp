import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense, useEffect, useRef, useState } from 'react';

import Island from './Island';
import IslandNight from './IslandNight';
import LookAroundControls from './LookAroundControls';
import SceneMarkerWithLine from './SceneMarkerWithLine';
import cameraTargets from './cameraTargets';
import markerTargets from './markerTargets';
import StartBtn from './StartBtn';
import ExitBtn from './ExitBtn';
import CameraFlyTo from './CameraFlyTo';
import CameraMoveTo from './CameraMoveTo';
import BirdFlock from './BirdFlock';
import ToggleButton from './ToggleButton';
import BackgroundManager from './BackgroundManager';
import SkyAndLights from './SkyAndLights';
import BackBtn from './Back';
import FloatingBubbleMenu from './FloatingBubbleMenu';
import Loader from './Loader';
import FloatingDialog from './FloatingDialog';
import Logo from './Logo';

export default function IslandScene() {
   const clickSound = new Audio('/click.mp3');
  clickSound.volume = 0.05;
  const [flyTarget, setFlyTarget] = useState(null);
  const [moveTarget, setMoveTarget] = useState(null);
  const [currentTarget, setCurrentTarget] = useState(null);
  const [hasLanded, setHasLanded] = useState(false);
  const [orbitEnabled, setOrbitEnabled] = useState(true);
  const [lookAroundEnabled, setLookAroundEnabled] = useState(false);
  const [activeMarkers, setActiveMarkers] = useState([]);
  const [currentSceneLabel, setCurrentSceneLabel] = useState(null);
  const [currentMarkerPos, setCurrentMarkerPos] = useState(null);
  const [yawRestrictEnabled, setYawRestrictEnabled] = useState(false);
  const [isDay, setIsDay] = useState(() => {
    const hour = new Date().getHours();
    return hour >= 7 && hour < 18;
  });
  const [showToggleBtn, setShowToggleBtn] = useState(true);

  const currentAudioRef = useRef(null);
  const islandRef = useRef();
  const [sceneKey, setSceneKey] = useState(0);
  
  const [showGardenDialog, setShowGardenDialog] = useState(false);
  const [showBeachDialog, setShowBeachDialog] = useState(false);
  const [showOfficeDialog, setShowOfficeDialog] = useState(false);
  const [showSpDialog, setShowSpDialog] = useState(false);

  const towerMarkers = [
  { label: 'House', position: [-1.3, 1.7, 2.15] },
  { label: 'Office', position: [0.77, 1.7, -0.4] },
  { label: 'Garden', position: [-1.2, 1.7, -0.4] },
  { label: 'Beach', position: [-2.18, 1.2, 3.8] },
];
const showTowerMarkers = hasLanded && lookAroundEnabled && currentSceneLabel === 'Tower';
const cleanupMemory = () => {
  if (!islandRef.current || !islandRef.current.scene) return;

  islandRef.current.scene.traverse((child) => {
    if (child.isMesh) {
      if (child.geometry) child.geometry.dispose();
    }
  });
};

  useEffect(() => {
    const matchPos = (a, b) => a && b && a.every((v, i) => +v.toFixed(2) === +b[i].toFixed(2));

    const gardenPos = [-1.5, 0.42, -2.1];
    const beachPos = [0.2, 0.42, 3.2];
    const officePos = [1.9, 0.35, -0.5];
    const spPos = [-2.4, 0.42, -1.8];

    const gardenTimeout = matchPos(currentMarkerPos, gardenPos)
      ? setTimeout(() => setShowGardenDialog(true), 2000)
      : null;

    const beachTimeout = matchPos(currentMarkerPos, beachPos)
      ? setTimeout(() => setShowBeachDialog(true), 2000)
      : null;

    const officeTimeout = matchPos(currentMarkerPos, officePos)
      ? setTimeout(() => setShowOfficeDialog(true), 2000)
      : null;

    const spTimeout = matchPos(currentMarkerPos, spPos)
      ? setTimeout(() => setShowSpDialog(true), 2000)
      : null;

    if (!matchPos(currentMarkerPos, gardenPos)) setShowGardenDialog(false);
    if (!matchPos(currentMarkerPos, beachPos)) setShowBeachDialog(false);
    if (!matchPos(currentMarkerPos, officePos)) setShowOfficeDialog(false);
    if (!matchPos(currentMarkerPos, spPos)) setShowSpDialog(false);

    return () => {
      clearTimeout(gardenTimeout);
      clearTimeout(beachTimeout);
      clearTimeout(officeTimeout);
      clearTimeout(spTimeout);
    };
  }, [currentMarkerPos]);

  function LookAroundWrapper() {
    const { camera, gl } = useThree();
    return (
      <LookAroundControls
        camera={camera}
        domElement={gl.domElement}
        restrictYaw={yawRestrictEnabled}
      />
    );
  }

  const handleMarkerClick = (marker) => {
    clickSound.play();
    setMoveTarget({ targetPos: marker.targetPos, lookAt: marker.lookAt, label: marker.label || 'Marker' });
    setCurrentMarkerPos(marker.position);

    const pos = marker.position.map(v => +v.toFixed(2));
    const restrictedMarkers = [
      [-1.62, 0.4, 1.3],
      [-1.4, 0.3, 0.9],
      // [1.9, 0.35, -0.5], //office
      [2.2, 0.7, 0.15],
    ];
    const isRestricted = restrictedMarkers.some(m => m.every((v, i) => +v.toFixed(2) === pos[i]));
    setYawRestrictEnabled(isRestricted);

    const playLoopedAudio = (path) => {
      currentAudioRef.current?.pause();
      currentAudioRef.current?.remove();
      const audio = new Audio(path);
      audio.loop = true;
      audio.volume = 0.1;
      audio.play();
      currentAudioRef.current = audio;
    };

    if (pos.every((v, i) => v === [-1.5, 0.42, -2.1][i])) {
      playLoopedAudio('/sceneSounds/sparrow.mp3');
    } else if (pos.every((v, i) => v === [0.2, 0.42, 3.2][i])) {
      playLoopedAudio('/sceneSounds/beach.mp3');
    }

    if (
      (pos.every((v, i) => v === [-3.9, 0.4, 1.55][i])) ||
      (pos.every((v, i) => v === [-0.5, 0.42, -1.9][i]))
    ) {
      setTimeout(() => {
        currentAudioRef.current?.pause();
        currentAudioRef.current?.remove();
        const catSound = new Audio('/sceneSounds/cat.wav');
        catSound.volume = 0.03;
        catSound.play();
        currentAudioRef.current = catSound;
      }, 1000);
    }

    if (islandRef.current) {
      if (pos.every((v, i) => v === [1.9, 0.35, -0.5][i])) {
        islandRef.current.playAnimationsOnce(isDay ? ['Action.002'] : ['Armature.027Action']);
      } else if (pos.every((v, i) => v === [0.2, 0.42, 3.2][i])) {
        islandRef.current.playAnimationsOnce(['Action.016']);
      } else if (pos.every((v, i) => v === [-1.5, 0.42, -2.1][i])) {
        islandRef.current.playAnimationsOnce(['Action.008', 'Action.009']);
      }
    }
  };

  const handleLand = () => {
    setLookAroundEnabled(true);
    setHasLanded(true);
    setCurrentSceneLabel('Tower');
    setCurrentTarget({ label: 'Tower' });
    setShowToggleBtn(false);
  };

  const handleFlyTo = (sceneLabel) => {
    if (sceneLabel === currentSceneLabel) return;
    const sceneTarget = cameraTargets.find(t => t.label === sceneLabel);
    if (!sceneTarget) return;
    clickSound.play();
    setFlyTarget({ ...sceneTarget, label: sceneLabel });
    setMoveTarget(null);
    setHasLanded(false);
    setLookAroundEnabled(false);
    setActiveMarkers([]);
    setYawRestrictEnabled(false);
  };

  const returnToTower = () => {
    clickSound.play();
    currentAudioRef.current?.pause();
    currentAudioRef.current = null;
    setShowGardenDialog(false);
    setShowBeachDialog(false);
    setShowOfficeDialog(false);
    setShowSpDialog(false);
    setFlyTarget({
      targetPos: [0.1, 3, 1.4],
      lookAt: [-0.7, 1.5, -0.5], // [-0.7, 2.2, -0.5]
      label: 'Tower',
    });
    setMoveTarget(null);
    setHasLanded(false);
    setLookAroundEnabled(false);
    setActiveMarkers([]);
    setCurrentSceneLabel('Tower');
    setYawRestrictEnabled(false);
  };

  const onFlyArrive = () => {
    if (!flyTarget) return;
    setHasLanded(true);
    setLookAroundEnabled(true);
    setCurrentSceneLabel(flyTarget.label);
    setCurrentTarget(flyTarget);
    setActiveMarkers(markerTargets[flyTarget.label] || []);
    setFlyTarget(null);
  };

  const onMoveArrive = () => {
    if (!moveTarget) return;
    setCurrentTarget(moveTarget);
    setMoveTarget(null);
  };

  return (
    
    <div style={{ width: '100vw', height: '100vh' }}>
      
      {showToggleBtn && (
        <ToggleButton
          isDay={isDay}
          setIsDay={(val) => {
            cleanupMemory();
            setIsDay(val);
            setSceneKey(prev => prev + 1);
          }}
        />
      )}

      <Logo
        onClick={() => {
          setSceneKey(prev => prev + 1);
          setFlyTarget(null);
          setMoveTarget(null);
          setCurrentTarget(null);
          setHasLanded(false);
          setOrbitEnabled(true);
          setLookAroundEnabled(false);
          setActiveMarkers([]);
          setCurrentSceneLabel(null);
          setCurrentMarkerPos(null);
          setYawRestrictEnabled(false);
          setShowGardenDialog(false);
          setShowBeachDialog(false);
          setShowOfficeDialog(false);
          setShowToggleBtn(true);
          currentAudioRef.current?.pause();
          currentAudioRef.current = null;
        }}
      />

      <FloatingBubbleMenu />
        
      <Canvas
        key={sceneKey}
        camera={{ position: [5, 5, 15], fov: 50 }}
        gl={{
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}

        style={{ zIndex: 0 }}
      >
      {/* <SceneMarkerWithLine position={[3, 0.25, -0.97]} />
      <SceneMarkerWithLine position={[2.85, 0.26, -0.7]} /> */}

        <BackgroundManager isDay={isDay} />
        <SkyAndLights isDay={isDay} />

        <Suspense fallback={<Loader />}>
          <StartBtn
            onLand={handleLand}
            setOrbitEnabled={setOrbitEnabled}
            setLookAroundEnabled={setLookAroundEnabled}
          />
          {isDay ? <Island ref={islandRef} /> : <IslandNight ref={islandRef} />}
          {isDay && <BirdFlock />}

          {flyTarget && <CameraFlyTo target={flyTarget} onArrive={onFlyArrive} />}
          {moveTarget && <CameraMoveTo target={moveTarget} onArrive={onMoveArrive} />}

          {orbitEnabled && !lookAroundEnabled && (
            <OrbitControls maxDistance={14} minDistance={10} enablePan={false} />
          )}
          {lookAroundEnabled && hasLanded && <LookAroundWrapper />}

           <group visible={showTowerMarkers}>
      {towerMarkers.map((m) => (
        <SceneMarkerWithLine
          key={m.label}
          label={m.label}
          position={m.position}
          onClick={() => handleFlyTo(m.label)}
          radius={0.08}
        />
      ))}
    </group>

          {hasLanded && lookAroundEnabled && activeMarkers.map((marker, i) => (
            <SceneMarkerWithLine
              key={`${marker.label}-${i}`}
              position={marker.position}
              onClick={() => handleMarkerClick(marker)}
              radius={0.04}
            />
          ))}

          {/* {showGardenDialog && (
            <FloatingDialog position={[-2.5, 0.4, -2.9]} texts="Once upon a time, shoppers roamed the land of aisles — until the magic of the internet changed everything." active t="r" />
          )}
          {showBeachDialog && (
            <FloatingDialog position={[0.5, 0.2, 3.15]} texts="Say goodbye to the divide — GHARSEE merges the magic of in-store shopping with the ease of online." active t="r" />
          )}
          {showOfficeDialog && (
            <FloatingDialog position={[2.65, 0.47, -0.71]} texts="With GHARSEE’s lifelike interface, your favorite stores walk right into your home — why go out when the shop comes to you?" active t="l"/>
          )}
          {showSpDialog && (
            <FloatingDialog position={[-2.2, 0.37, -1.25]} texts="he hehe  he ehe " active t="l"/>
          )} */}
        </Suspense>
      </Canvas>

      {hasLanded && lookAroundEnabled && currentSceneLabel !== 'Tower' && (
        <>
          <ExitBtn onClick={returnToTower} />
          <BackBtn
            currentMarkerPos={currentMarkerPos}
            setCurrentTarget={(target) => {
              currentAudioRef.current?.pause();
              currentAudioRef.current = null;
              setMoveTarget({ targetPos: target.position, lookAt: target.lookAt, label: 'Back' });
              setCurrentMarkerPos(null);
              setYawRestrictEnabled(false);
              setShowGardenDialog(false);
              setShowBeachDialog(false);
              setShowOfficeDialog(false);
              setShowSpDialog(false);
            }}
          />
        </>
      )}
    </div>
  );
}
