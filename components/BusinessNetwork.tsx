import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// Fix for JSX.IntrinsicElements errors in strict TypeScript environments
declare global {
  namespace JSX {
    interface IntrinsicElements {
      businessGridMaterial: any;
      bufferGeometry: any;
      bufferAttribute: any;
      points: any;
    }
  }
}

// -----------------------------------------------------------------------------
// Business Network Morphing Shader
// -----------------------------------------------------------------------------
const BusinessGridMaterial = shaderMaterial(
  {
    uTime: 0,
    uState: 0, 
    uColor1: new THREE.Color('#1e3a8a'),
    uColor2: new THREE.Color('#3b82f6'),
    uColor3: new THREE.Color('#7c3aed'),
    uPixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    uSize: 3.5,
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform float uState;
    uniform float uPixelRatio;
    uniform float uSize;

    attribute vec3 aPosRandom;
    attribute vec3 aPosGlobe;
    attribute vec3 aPosCube;
    attribute float aSize;

    varying vec3 vPos;
    varying float vAlpha;

    float easeInOutCubic(float x) {
      return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
    }

    void main() {
      vec3 pos;
      float phase = mod(uState, 4.0);
      float t;
      
      if (phase < 1.0) {
        t = easeInOutCubic(phase);
        pos = mix(aPosRandom, aPosGlobe, t);
      } else if (phase < 2.0) {
        t = easeInOutCubic(phase - 1.0);
        pos = mix(aPosGlobe, aPosCube, t);
      } else if (phase < 3.0) {
        t = easeInOutCubic(phase - 2.0);
        pos = mix(aPosCube, aPosGlobe, t); 
      } else {
        t = easeInOutCubic(phase - 3.0);
        pos = mix(aPosGlobe, aPosRandom, t);
      }

      float rotSpeed = 0.2;
      float angle = uTime * rotSpeed;
      angle += sin(uTime * 0.5 + pos.y * 0.5) * 0.05;

      float c = cos(angle);
      float s = sin(angle);
      mat2 rot = mat2(c, -s, s, c);
      pos.xz = rot * pos.xz;

      pos.y += sin(uTime * 0.8 + pos.x) * 0.2;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      gl_PointSize = uSize * aSize * uPixelRatio * (20.0 / -mvPosition.z);
      vPos = pos;
      float pulse = 0.8 + 0.2 * sin(uTime * 2.0 + pos.x + pos.y);
      vAlpha = pulse;
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform float uTime;

    varying vec3 vPos;
    varying float vAlpha;

    void main() {
      vec2 xy = gl_PointCoord.xy - vec2(0.5);
      float r = length(xy);
      if (r > 0.5) discard;
      float glow = 1.0 - smoothstep(0.3, 0.5, r);
      float colorMix = vPos.y * 0.1 + 0.5;
      vec3 baseColor = mix(uColor1, uColor2, colorMix + sin(uTime)*0.1);
      float packet = smoothstep(0.9, 1.0, sin(vPos.x * 0.5 + vPos.z * 0.5 + uTime * 2.0));
      vec3 finalColor = mix(baseColor, uColor3, packet);
      gl_FragColor = vec4(finalColor, vAlpha * glow);
    }
  `
);

extend({ BusinessGridMaterial });

// Generator (same as before)
const generateBusinessShapes = (count: number) => {
  const posRandom = new Float32Array(count * 3);
  const posGlobe = new Float32Array(count * 3);
  const posCube = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const rSpread = 16;
    posRandom[i * 3] = (Math.random() - 0.5) * rSpread;
    posRandom[i * 3 + 1] = (Math.random() - 0.5) * rSpread;
    posRandom[i * 3 + 2] = (Math.random() - 0.5) * rSpread;

    const r = 6.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    posGlobe[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    posGlobe[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    posGlobe[i * 3 + 2] = r * Math.cos(phi);

    const gridSize = 14; 
    const step = 2.0; 
    let cx = (Math.random() - 0.5) * gridSize;
    let cy = (Math.random() - 0.5) * gridSize;
    let cz = (Math.random() - 0.5) * gridSize;
    cx = Math.round(cx / step) * step;
    cy = Math.round(cy / step) * step;
    cz = Math.round(cz / step) * step;
    posCube[i * 3] = cx;
    posCube[i * 3 + 1] = cy;
    posCube[i * 3 + 2] = cz;

    sizes[i] = Math.random() > 0.95 ? 1.5 : 0.6 + Math.random() * 0.4;
  }
  return { posRandom, posGlobe, posCube, sizes };
};

const BusinessParticles = () => {
  const count = 3000;
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { posRandom, posGlobe, posCube, sizes } = useMemo(() => generateBusinessShapes(count), []);
  const [targetState, setTargetState] = useState(0); 

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const sequence = async () => {
        setTargetState(1); await new Promise(r => setTimeout(r, 8000));
        setTargetState(2); await new Promise(r => setTimeout(r, 8000));
        setTargetState(1); 
        sequence();
    };
    timeout = setTimeout(sequence, 500);
    return () => clearTimeout(timeout);
  }, []);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      const current = materialRef.current.uniforms.uState.value;
      const step = (targetState - current) * 0.8 * delta;
      materialRef.current.uniforms.uState.value += step;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={posRandom} itemSize={3} />
        <bufferAttribute attach="attributes-aPosRandom" count={count} array={posRandom} itemSize={3} />
        <bufferAttribute attach="attributes-aPosGlobe" count={count} array={posGlobe} itemSize={3} />
        <bufferAttribute attach="attributes-aPosCube" count={count} array={posCube} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <businessGridMaterial ref={materialRef} transparent={true} depthWrite={false} blending={THREE.NormalBlending} />
    </points>
  );
};

const BusinessNetwork: React.FC = () => {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05, rootMargin: "50px" } // Optimized for mobile scrolling
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    // Explicit min-height ensures observer triggers correctly
    <div ref={containerRef} className="w-full h-full relative bg-[#F5F5F7] min-h-[400px]">
      {isInView && (
        <Canvas 
          camera={{ position: [0, 0, 20], fov: 45 }} 
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        >
          <BusinessParticles />
        </Canvas>
      )}
    </div>
  );
};

export default BusinessNetwork;