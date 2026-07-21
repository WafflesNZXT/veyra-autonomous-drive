import { useRef, useLayoutEffect, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';

import { CarModel } from './CarModel';
import { Annotations } from './Annotations';
import { ParticleField } from './ParticleField';
import { CHAPTERS } from '../data/chapters';
import { scrollState } from '../hooks/useScrollProgress';

// Pre-allocate to avoid garbage collection in render loop
const _camA = new THREE.Vector3();
const _camB = new THREE.Vector3();
const _lookA = new THREE.Vector3();
const _lookB = new THREE.Vector3();
const _lookAt = new THREE.Vector3(0, 0.15, 0);
const _ease = gsap.parseEase('power2.inOut');

// Car rests on stage at ground level; scene floor sits below
const GROUND_Y = -0.6;

// Scroll fraction over which the car + stage rise into frame (chapter 1 starts at ~0.167)
const ENTRANCE_END = 0.1;
const ENTRANCE_DROP = 5.5;

const MOBILE_CHAPTER_VIEWS = [
  { cameraPos: [4.4, 1.5, 7.4], target: [0, 0.25, 0] },
  { cameraPos: [2.1, 3.6, 6.9], target: [0, 0.92, -0.3] },
  { cameraPos: [0, 1.2, 8.4], target: [0, 0.45, 1.25] },
  { cameraPos: [5.7, 1.75, 5.8], target: [0, 0.75, 0.35] },
  { cameraPos: [4.5, 1.2, 6.7], target: [0, 0.35, 1.0] },
  { cameraPos: [-4.5, 2.1, -7.2], target: [0, 0.9, -1.35] },
  { cameraPos: [5.0, 2.0, 7.8], target: [0, 0.35, 0] },
] as const;

export function CarScene({ activeChapter }: { activeChapter: number }) {
  const carGroup = useRef<THREE.Group>(null);
  const stageGroup = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  const isMobileViewport = size.width <= 768 || size.height <= 520;

  useLayoutEffect(() => {
    const c = CHAPTERS[0];
    camera.position.set(c.cameraPos[0], c.cameraPos[1], c.cameraPos[2]);
    (camera as THREE.PerspectiveCamera).fov = 50;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    camera.lookAt(_lookAt);
  }, [camera]);

  useFrame(() => {
    if (!carGroup.current) return;

    const expectedFov = isMobileViewport ? (size.width > size.height ? 56 : 58) : 50;
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    if (perspectiveCamera.fov !== expectedFov) {
      perspectiveCamera.fov = expectedFov;
      perspectiveCamera.updateProjectionMatrix();
    }

    // Cinematic entrance — car + stage rest below frame at the hero,
    // then rise smoothly into view as scrolling begins.
    if (stageGroup.current) {
      const heroT = THREE.MathUtils.clamp(scrollState.progress / ENTRANCE_END, 0, 1);
      const eIn = _ease(heroT);
      stageGroup.current.position.y = -(1 - eIn) * ENTRANCE_DROP;
    }

    const raw = scrollState.progress * (CHAPTERS.length - 1.001);
    const currIdx = Math.min(CHAPTERS.length - 2, Math.floor(raw));
    const nextIdx = currIdx + 1;
    const localT = raw - currIdx;

    const t = _ease(localT);

    const curr = CHAPTERS[currIdx];
    const next = CHAPTERS[nextIdx];

    // Rotate car (turntable + subtle pitch)
    carGroup.current.rotation.x = THREE.MathUtils.lerp(curr.carRotation[0], next.carRotation[0], t);
    carGroup.current.rotation.y = THREE.MathUtils.lerp(curr.carRotation[1], next.carRotation[1], t);
    carGroup.current.rotation.z = THREE.MathUtils.lerp(curr.carRotation[2], next.carRotation[2], t);
    carGroup.current.scale.setScalar(isMobileViewport ? (size.width > size.height ? 0.95 : 0.86) : 1);

    // Camera path — pre-allocated vectors
    if (isMobileViewport) {
      const currentView = MOBILE_CHAPTER_VIEWS[currIdx];
      const nextView = MOBILE_CHAPTER_VIEWS[nextIdx];
      _camA.set(currentView.cameraPos[0], currentView.cameraPos[1], currentView.cameraPos[2]);
      _camB.set(nextView.cameraPos[0], nextView.cameraPos[1], nextView.cameraPos[2]);
      _lookA.set(currentView.target[0], currentView.target[1], currentView.target[2]);
      _lookB.set(nextView.target[0], nextView.target[1], nextView.target[2]);
      _lookAt.lerpVectors(_lookA, _lookB, t);
    } else {
      _camA.set(curr.cameraPos[0], curr.cameraPos[1], curr.cameraPos[2]);
      _camB.set(next.cameraPos[0], next.cameraPos[1], next.cameraPos[2]);
      _lookAt.set(0, 0.15, 0);
    }
    camera.position.lerpVectors(_camA, _camB, t);
    camera.lookAt(_lookAt);
  });

  const chapter = CHAPTERS[activeChapter];
  const isFinale = activeChapter === CHAPTERS.length - 1;

  return (
    <>
      <color attach="background" args={['#04060e']} />

      {/* Reflection source — city HDR gives glossy paint something to mirror */}
      <Environment preset="city" environmentIntensity={0.55} />

      {/* ── STUDIO LIGHTING RIG ── */}
      <ambientLight intensity={0.15} color="#ffffff" />
      {/* Key light — high, warm-white */}
      <directionalLight
        position={[6, 8, 6]}
        intensity={2.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Cool rim light — carves the silhouette from behind */}
      <directionalLight position={[-7, 3.5, -6]} intensity={1.8} color="#4d9fff" />
      {/* Cyan kicker — top-rear halo on roofline */}
      <spotLight position={[0, 7, -8]} intensity={1.1} angle={0.65} penumbra={0.9} color="#00d4ff" />
      {/* Side fill */}
      <pointLight position={[4, 1, 4]} intensity={0.6} color="#1a4d66" distance={9} />

      <ParticleField />

      {/* ── STAGE — rises into frame after the hero ── */}
      <group ref={stageGroup} position={[0, -ENTRANCE_DROP, 0]}>
        {/* Underglow */}
        <pointLight position={[0, GROUND_Y + 0.3, 0]} intensity={0.9} color="#0033aa" distance={5} />

        {/* Floor glow plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND_Y - 0.08, 0]}>
          <planeGeometry args={[26, 26]} />
          <meshBasicMaterial
            color="#000d1a"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Grid floor */}
        <gridHelper args={[32, 32, '#001133', '#000a1a']} position={[0, GROUND_Y - 0.07, 0]} />

        <ContactShadows
          position={[0, GROUND_Y + 0.005, 0]}
          resolution={512}
          scale={13}
          blur={2.6}
          opacity={0.85}
          far={2.2}
          color="#000000"
        />

        {/* Car + annotations rotate together (turntable) */}
        <group ref={carGroup} position={[0, GROUND_Y, 0]}>
          <Suspense fallback={null}>
            <CarModel />
          </Suspense>
          {chapter && chapter.annotations.length > 0 && (
            <Annotations
              key={`ann-${activeChapter}`}
              annotations={chapter.annotations}
              isFinale={isFinale}
              accentColor={chapter.accentColor}
              isMobile={isMobileViewport}
              isCompactLandscape={isMobileViewport && size.width > size.height}
            />
          )}
        </group>
      </group>

      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.75}
          luminanceSmoothing={0.4}
          mipmapBlur
          radius={0.5}
          intensity={0.5}
        />
        <Vignette eskil={false} offset={0.12} darkness={1.0} />
      </EffectComposer>
    </>
  );
}
