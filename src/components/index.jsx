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
import HouseContent from './HouseContent';
import TVLogo from './TVLogo';

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
  const [showSpDialog, setShowSpDialog] = useState(false);
  const [showWDialog, setShowWDialog] = useState(false);
  const [showBeachDialog, setShowBeachDialog] = useState(false);
  const [showBeach2Dialog, setShowBeach2Dialog] = useState(false);
  const [showBeach3Dialog, setShowBeach3Dialog] = useState(false);
  const [showBeach4Dialog, setShowBeach4Dialog] = useState(false);
  const [showOfficeDialog, setShowOfficeDialog] = useState(false);
  const [showHouse1Dialog, setShowHouse1Dialog] = useState(false);
  const [showHouse2Dialog, setShowHouse2Dialog] = useState(false);

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
    const wPos = [-0.5, 0.42, -1.9];
    const beach2Pos = [1.5, 0.41, 2.67];
    const beach3Pos = [2.3, 0.35, 2];
    const house1Pos = [-1.62, 0.4, 1.3];
    const house2Pos = [-1.4, 0.3, 0.9];
    const beach4Pos = [-0.4, 0.35, 3.6];

    const gardenTimeout = matchPos(currentMarkerPos, gardenPos)
      ? setTimeout(() => setShowGardenDialog(true), 2000)
      : null;

    const beachTimeout = matchPos(currentMarkerPos, beachPos)
      ? setTimeout(() => setShowBeachDialog(true), 2000)
      : null;
    const beach2Timeout = matchPos(currentMarkerPos, beach2Pos)
      ? setTimeout(() => setShowBeach2Dialog(true), 2000)
      : null;
    const beach3Timeout = matchPos(currentMarkerPos, beach3Pos)
      ? setTimeout(() => setShowBeach3Dialog(true), 2000)
      : null;
    const beach4Timeout = matchPos(currentMarkerPos, beach4Pos)
      ? setTimeout(() => setShowBeach4Dialog(true), 2000)
      : null;

    const officeTimeout = matchPos(currentMarkerPos, officePos)
      ? setTimeout(() => setShowOfficeDialog(true), 2000)
      : null;

    const spTimeout = matchPos(currentMarkerPos, spPos)
      ? setTimeout(() => setShowSpDialog(true), 2000)
      : null;

    const wTimeout = matchPos(currentMarkerPos, wPos)
      ? setTimeout(() => setShowWDialog(true), 2000)
      : null;

    const house1Timeout = matchPos(currentMarkerPos, house1Pos)
      ? setTimeout(() => setShowHouse1Dialog(true), 2000)
      : null;
    const house2Timeout = matchPos(currentMarkerPos, house2Pos)
      ? setTimeout(() => setShowHouse2Dialog(true), 2000)
      : null;

    if (!matchPos(currentMarkerPos, gardenPos)) setShowGardenDialog(false);
    if (!matchPos(currentMarkerPos, beachPos)) setShowBeachDialog(false);
    if (!matchPos(currentMarkerPos, beach2Pos)) setShowBeach2Dialog(false);
    if (!matchPos(currentMarkerPos, beach3Pos)) setShowBeach3Dialog(false);
    if (!matchPos(currentMarkerPos, beach4Pos)) setShowBeach4Dialog(false);
    if (!matchPos(currentMarkerPos, officePos)) setShowOfficeDialog(false);
    if (!matchPos(currentMarkerPos, spPos)) setShowSpDialog(false);
    if (!matchPos(currentMarkerPos, wPos)) setShowWDialog(false);
    if (!matchPos(currentMarkerPos, house1Pos)) setShowHouse1Dialog(false);
    if (!matchPos(currentMarkerPos, house2Pos)) setShowHouse2Dialog(false);

    return () => {
      clearTimeout(gardenTimeout);
      clearTimeout(beachTimeout);
      clearTimeout(beach2Timeout);
      clearTimeout(beach3Timeout);
      clearTimeout(beach4Timeout);
      clearTimeout(officeTimeout);
      clearTimeout(spTimeout);
      clearTimeout(wTimeout);
      clearTimeout(house1Timeout);
      clearTimeout(house2Timeout);
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
    setShowBeach2Dialog(false);
    setShowBeach3Dialog(false);
    setShowBeach4Dialog(false);
    setShowOfficeDialog(false);
    setShowSpDialog(false);
    setShowWDialog(false);
    setShowHouse1Dialog(false);
    setShowHouse2Dialog(false);
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
          setShowBeach2Dialog(false);
          setShowBeach3Dialog(false);
          setShowBeach4Dialog(false);
          setShowOfficeDialog(false);
          setShowSpDialog(false);
          setShowWDialog(false);
          setShowHouse1Dialog(false);
          setShowHouse2Dialog(false);

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
      {/* <SceneMarkerWithLine position={[-0.4, 0.42, 3.6]} />
      <SceneMarkerWithLine position={[-0.1, 0.25, 3.2]} /> */}

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

          {showGardenDialog && (
            <FloatingDialog position={[-2.5, 0.4, -2.9]} texts="My favourite flower? The one I plant while laughing with mommy....not waiting in store lines" active t="r" />
          )}
          {showSpDialog && (
            <FloatingDialog position={[-2.2, 0.37, -1.25]} texts="GHARSEE handles errands so we can handle what matters: planting dreams alongside our little ones." active t="l"/>
          )}
          {showWDialog && (
            <FloatingDialog position={[-0.45, 0.36, -2.4]} texts="More blooms, fewer receipts--spend evenings tending love instead of stores." active t="r"/>
          )}


          {showBeachDialog && (
            <>
            <FloatingDialog position={[0.54, 0.2, 3.18]} texts="GHARSEE handles the hustle so we can build sandcastles instead of schedules" active t="r" />
            <FloatingDialog position={[0.54, 0.12, 3.09]} texts="GHARSEE magic means my parents stay longer! Our sandcastle has towers AND a treasure chest now!" active t="r" />
            <FloatingDialog position={[0.54, 0.12, 3.4]} texts="I dig holes, they laugh--GHARSEE made our day extra sandy and silly!" active t="l" />
            </>
          )}
          {showBeach2Dialog && (
            <FloatingDialog position={[2.5, 0.3, 2.5]} texts="The waves whisper relaxation. MY GHARSEE whisper, 'Your groceries are handled" active t="l"/>
          )}
          {showBeach3Dialog && (
            <>
            <FloatingDialog position={[3, 0.36, 2.19]} texts="GHARSEE's VR shopping = more sets, serves, and sand-sprints before sunset." active t="r"/>
            <FloatingDialog position={[3, 0.38, 2.98]} texts="Why waste energy on errands when i spike into joy? Thank you, GHARSEE efficiency!" active t="l"/>
            </>
          )}
          {showBeach4Dialog && (
             <FloatingDialog position={[-0.21, 0.26, 3.42]} texts="Reclined on a beach chair, not a rush in sight. My GHARSEE did the heavy lighting." active t="l"/>
          )}

          {showOfficeDialog && (
            <FloatingDialog position={[2.73, 0.47, -0.756]} texts="Efficient convenient shopping by dat, hoddy-hero by night--MY GHARSEE fuels both with zero mall marathons." active t="l" extra='yes'/>
          )}

          {showHouse1Dialog && (
            <HouseContent position={[-1.5, 0.25, 0.8]} texts="My couch is my command center. Why leave when my GHARSEE brings the mall to my fingertips?" />
          )}
          {showHouse2Dialog && (
            <>
            <TVLogo />
            <HouseContent position={[-1.527, 0.229, 0.7]} texts="Shop with GHARSEE: Where 'Errands' become 'Extra Moments' --all from your favourite spot at home." />
            </>
          )}

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
              setShowBeach2Dialog(false);
              setShowBeach3Dialog(false);
              setShowBeach4Dialog(false);
              setShowOfficeDialog(false);
              setShowSpDialog(false);
              setShowWDialog(false);
              setShowHouse1Dialog(false);
              setShowHouse2Dialog(false);
            }}
          />
        </>
      )}
    </div>
  );
}
