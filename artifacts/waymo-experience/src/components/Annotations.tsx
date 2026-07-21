import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { AnnotationData } from '../data/chapters';

interface AnnotationsProps {
  annotations: AnnotationData[];
  isFinale?: boolean;
  accentColor?: string;
  isMobile?: boolean;
  isCompactLandscape?: boolean;
}

export function Annotations({ annotations, isFinale = false, accentColor = '#00d4ff', isMobile = false, isCompactLandscape = false }: AnnotationsProps) {
  return (
    <group>
      {annotations.map((ann, i) => (
        <AnnotationPin
          key={ann.id}
          annotation={ann}
          isFinale={isFinale}
          accentColor={accentColor}
          delayIndex={i}
          isMobile={isMobile}
          isCompactLandscape={isCompactLandscape}
        />
      ))}
      {isFinale && annotations.length > 1 && (
        <FinaleConnections annotations={annotations} />
      )}
    </group>
  );
}

function AnnotationPin({
  annotation,
  isFinale,
  accentColor,
  delayIndex,
  isMobile,
  isCompactLandscape,
}: {
  annotation: AnnotationData;
  isFinale: boolean;
  accentColor: string;
  delayIndex: number;
  isMobile: boolean;
  isCompactLandscape: boolean;
}) {
  const dotRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [visible, setVisible] = useState(false);

  const pos = useMemo(() => new THREE.Vector3(...annotation.position), [annotation.position]);

  // Staggered mount animation
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delayIndex * 120);
    return () => clearTimeout(timer);
  }, [delayIndex]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (dotRef.current) {
      const s = 1 + Math.sin(t * 3.5 + delayIndex * 2.1) * 0.22;
      dotRef.current.scale.setScalar(s);
    }
    if (glowRef.current) {
      const gs = 1 + Math.sin(t * 2.8 + delayIndex * 2.1) * 0.3;
      glowRef.current.scale.setScalar(gs);
      const m = glowRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.2 + Math.sin(t * 2.8 + delayIndex * 2.1) * 0.1;
    }
  });

  if (!visible) return null;

  const color = new THREE.Color(accentColor);
  const mobileOffset = getMobileAnnotationOffset(annotation.id, isCompactLandscape);

  return (
    <group position={pos}>
      {/* Core emissive dot */}
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.038, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Outer glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* HTML label — Drei keeps it facing camera automatically */}
      <Html
        position={isMobile ? mobileOffset : [0.14, 0.08, 0]}
        center={false}
        zIndexRange={[200, 100]}
        className={`pointer-events-none select-none ${isMobile ? 'annotation-mobile' : ''}`}
        style={{ width: 'max-content' }}
      >
        <div
          className={`flex items-center gap-1.5 annotation-label ${isMobile ? 'annotation-label-mobile' : ''}`}
          style={{
            animationDelay: `${delayIndex * 0.1}s`,
          }}
        >
          {/* Connector line */}
          <div
            className="annotation-connector"
            style={{
              width: 20,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${accentColor}99)`,
              flexShrink: 0,
            }}
          />
          {/* Label chip */}
          <div
            className="annotation-chip"
            style={{
              background: 'rgba(4, 6, 14, 0.88)',
              border: `1px solid ${accentColor}66`,
              backdropFilter: 'blur(8px)',
              padding: '4px 10px',
              boxShadow: `0 0 12px ${accentColor}22, inset 0 0 8px ${accentColor}0a`,
            }}
          >
            <span
              style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.12em',
                color: '#e8f4ff',
                whiteSpace: 'nowrap',
              }}
            >
              {annotation.label}
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
}

function getMobileAnnotationOffset(id: string, isCompactLandscape: boolean): [number, number, number] {
  const offsets: Record<string, [number, number, number]> = {
    'lidar-main': [0.12, 0.24, 0],
    'front-radar': isCompactLandscape ? [-1.25, 0.55, 0] : [0.16, 0.18, 0],
    'cam-fl': [0.12, 0.16, 0],
    'cam-fr': [-0.4, 0.16, 0],
    'cam-side': [-0.38, 0.14, 0],
    'ultra-fl': [0.12, 0.15, 0],
    'ultra-fr': [-0.38, 0.15, 0],
    'ultra-rl': [-0.35, 0.15, 0],
    compute: [-1.05, 0.18, 0],
  };

  return offsets[id] ?? [0.12, 0.14, 0];
}

function FinaleConnections({ annotations }: { annotations: AnnotationData[] }) {
  const linesRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const computeNode = annotations.find((a) => a.id.includes('compute')) ?? annotations[annotations.length - 1];
    const pts: THREE.Vector3[] = [];
    annotations.forEach((ann) => {
      if (ann.id !== computeNode.id) {
        pts.push(new THREE.Vector3(...computeNode.position));
        pts.push(new THREE.Vector3(...ann.position));
      }
    });
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [annotations]);

  useFrame((state) => {
    if (linesRef.current) {
      const m = linesRef.current.material as THREE.LineBasicMaterial;
      m.opacity = 0.25 + Math.sin(state.clock.elapsedTime * 4) * 0.18;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial
        color="#00d4ff"
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}
