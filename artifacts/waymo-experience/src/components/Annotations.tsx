import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { AnnotationData } from '../data/chapters';

interface AnnotationsProps {
  annotations: AnnotationData[];
  isFinale?: boolean;
  accentColor?: string;
}

export function Annotations({ annotations, isFinale = false, accentColor = '#00d4ff' }: AnnotationsProps) {
  return (
    <group>
      {annotations.map((ann, i) => (
        <AnnotationPin
          key={ann.id}
          annotation={ann}
          isFinale={isFinale}
          accentColor={accentColor}
          delayIndex={i}
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
}: {
  annotation: AnnotationData;
  isFinale: boolean;
  accentColor: string;
  delayIndex: number;
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
      const gs = 1 + Math.sin(t * 2.8 + delayIndex * 2.1) * 0.5;
      glowRef.current.scale.setScalar(gs);
      const m = glowRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.35 + Math.sin(t * 2.8 + delayIndex * 2.1) * 0.2;
    }
  });

  if (!visible) return null;

  const color = new THREE.Color(accentColor);

  return (
    <group position={pos}>
      {/* Core emissive dot */}
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.038, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Outer glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* HTML label — Drei keeps it facing camera automatically */}
      <Html
        position={[0.14, 0.08, 0]}
        center={false}
        zIndexRange={[200, 100]}
        className="pointer-events-none select-none"
        style={{ width: 'max-content' }}
      >
        <div
          className="flex items-center gap-1.5 annotation-label"
          style={{
            animationDelay: `${delayIndex * 0.1}s`,
          }}
        >
          {/* Connector line */}
          <div
            style={{
              width: 20,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${accentColor}99)`,
              flexShrink: 0,
            }}
          />
          {/* Label chip */}
          <div
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
