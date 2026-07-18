import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment, ContactShadows } from '@react-three/drei';
import { CarModel } from './CarModel';

type ViewKey = 'front' | 'side' | 'rear' | 'top' | 'orbit';

const VIEWS: Record<ViewKey, { pos: [number, number, number]; label: string }> = {
  orbit: { pos: [4.2, 1.5, 5.4], label: 'STUDIO' },
  front: { pos: [0, 0.9, 6.8], label: 'FRONT' },
  side: { pos: [6.8, 0.9, 0], label: 'SIDE' },
  rear: { pos: [0, 1.1, -6.8], label: 'REAR' },
  top: { pos: [0.01, 7.4, 0.6], label: 'TOP' },
};

const GROUND_Y = -0.6;
const _target = new THREE.Vector3();
const _look = new THREE.Vector3(0, 0.15, 0);

function ViewerRig({ view, autoRotate }: { view: ViewKey; autoRotate: boolean }) {
  const carRef = useRef<THREE.Group>(null);

  useFrame(({ camera }, delta) => {
    const v = VIEWS[view];
    _target.set(v.pos[0], v.pos[1], v.pos[2]);
    camera.position.lerp(_target, 1 - Math.exp(-3.2 * delta));
    camera.lookAt(_look);
    if (carRef.current) {
      carRef.current.rotation.y += autoRotate ? delta * 0.25 : 0;
      // Ease rotation back to 0 when a fixed view is selected
      if (!autoRotate) {
        carRef.current.rotation.y *= Math.exp(-4 * delta) as number;
      }
    }
  });

  return (
    <group position={[0, GROUND_Y, 0]} ref={carRef}>
      <CarModel />
    </group>
  );
}

export function VehicleViewer() {
  const [view, setView] = useState<ViewKey>('orbit');

  return (
    <div className="relative w-full" style={{ height: 'min(72vh, 640px)' }} data-testid="vehicle-viewer">
      <Canvas
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
        dpr={[1, 1.5]}
        camera={{ fov: 45, near: 0.1, far: 100, position: VIEWS.orbit.pos }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#04060e']} />
          <fog attach="fog" args={['#04060e', 14, 30]} />
          <ambientLight intensity={0.25} />
          <directionalLight position={[6, 8, 4]} intensity={2.2} color="#eaf6ff" castShadow />
          <directionalLight position={[-7, 3.5, -6]} intensity={1.6} color="#4d9fff" />
          <spotLight position={[0, 7, -8]} intensity={0.9} angle={0.65} penumbra={0.9} color="#00d4ff" />
          <Environment preset="city" />
          <ViewerRig view={view} autoRotate={view === 'orbit'} />
          <ContactShadows position={[0, GROUND_Y + 0.01, 0]} opacity={0.55} scale={12} blur={2.4} far={3} />
        </Suspense>
      </Canvas>

      {/* View selector */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5" data-testid="view-selector">
        {(Object.keys(VIEWS) as ViewKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className="font-mono text-[10px] tracking-[0.2em] px-4 py-2 border transition-all duration-300"
            style={{
              borderColor: view === key ? 'rgba(0,212,255,0.6)' : 'rgba(255,255,255,0.1)',
              color: view === key ? '#00d4ff' : 'rgba(255,255,255,0.45)',
              background: view === key ? 'rgba(0,212,255,0.06)' : 'rgba(4,6,14,0.6)',
              backdropFilter: 'blur(8px)',
            }}
            data-testid={`view-btn-${key}`}
          >
            {VIEWS[key].label}
          </button>
        ))}
      </div>
    </div>
  );
}
