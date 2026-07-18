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
const _lookAt = new THREE.Vector3(0, 0.8, 0);

export function CarScene({ activeChapter }: { activeChapter: number }) {
  const carGroup = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useLayoutEffect(() => {
    const c = CHAPTERS[0];
    camera.position.set(c.cameraPos[0], c.cameraPos[1], c.cameraPos[2]);
    (camera as THREE.PerspectiveCamera).fov = 52;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    camera.lookAt(_lookAt);
  }, [camera]);

  useFrame(() => {
    if (!carGroup.current) return;

    const raw = scrollState.progress * (CHAPTERS.length - 1.001);
    const currIdx = Math.min(CHAPTERS.length - 2, Math.floor(raw));
    const nextIdx = currIdx + 1;
    const localT = raw - currIdx;

    // Smooth ease
    const t = gsap.parseEase('power2.inOut')(localT);

    const curr = CHAPTERS[currIdx];
    const next = CHAPTERS[nextIdx];

    // Rotate car
    carGroup.current.rotation.x = THREE.MathUtils.lerp(curr.carRotation[0], next.carRotation[0], t);
    carGroup.current.rotation.y = THREE.MathUtils.lerp(curr.carRotation[1], next.carRotation[1], t);
    carGroup.current.rotation.z = THREE.MathUtils.lerp(curr.carRotation[2], next.carRotation[2], t);

    // Move camera — use pre-allocated vectors
    _camA.set(curr.cameraPos[0], curr.cameraPos[1], curr.cameraPos[2]);
    _camB.set(next.cameraPos[0], next.cameraPos[1], next.cameraPos[2]);
    camera.position.lerpVectors(_camA, _camB, t);
    camera.lookAt(_lookAt);
  });

  const chapter = CHAPTERS[activeChapter];
  const isFinale = activeChapter === CHAPTERS.length - 1;

  return (
    <>
      <color attach="background" args={['#04060e']} />

      <Environment preset="city" environmentIntensity={0.45} />

      {/* Lighting — cool automotive studio setup */}
      <ambientLight intensity={0.18} color="#ffffff" />
      <directionalLight position={[6, 10, 6]} intensity={2.0} color="#ffffff" castShadow
        shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight position={[-6, 4, -4]} intensity={1.8} color="#0066cc" />
      <spotLight position={[0, 12, 0]} intensity={2.5} angle={0.5} penumbra={0.8} color="#002244" />
      {/* Accent rim light from below — gives the floating glow */}
      <pointLight position={[0, -0.5, 0]} intensity={3} color="#001a4d" distance={5} />
      {/* Cyan fill for sensor highlights */}
      <pointLight position={[3, 2, 3]} intensity={1.5} color="#003344" distance={8} />

      {/* Floor glow plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshBasicMaterial
          color="#000d1a"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Grid floor */}
      <gridHelper args={[30, 30, '#001133', '#000a1a']} position={[0, -0.6, 0]} />

      <ParticleField />

      <ContactShadows
        position={[0, -0.58, 0]}
        resolution={512}
        scale={12}
        blur={3}
        opacity={0.9}
        far={2.5}
        color="#000000"
      />

      <group ref={carGroup}>
        <Suspense fallback={null}>
          <CarModel />
        </Suspense>
        {chapter && chapter.annotations.length > 0 && (
          <Annotations
            key={`ann-${activeChapter}`}
            annotations={chapter.annotations}
            isFinale={isFinale}
            accentColor={chapter.accentColor}
          />
        )}
      </group>

      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.25}
          luminanceSmoothing={0.9}
          mipmapBlur
          intensity={1.4}
        />
        <Vignette eskil={false} offset={0.12} darkness={1.0} />
      </EffectComposer>
    </>
  );
}
