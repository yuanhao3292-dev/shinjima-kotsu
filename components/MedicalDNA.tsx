
import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// -----------------------------------------------------------------------------
// DNA/Cell Morphing Shader (Adapted for White Background)
// -----------------------------------------------------------------------------
const BioMorphMaterial = shaderMaterial(
  {
    uTime: 0,
    uState: 0, 
    // Matching IntroParticles colors (Dark/Vibrant for white BG)
    uColor1: new THREE.Color('#2e008b'), // Deep Violet
    uColor2: new THREE.Color('#0044cc'), // Royal Blue
    uColor3: new THREE.Color('#e6007e'), // Magenta
    uPixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    uSize: 3.8, // Increased size for visibility
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform float uState;
    uniform float uPixelRatio;
    uniform float uSize;

    attribute vec3 aPosRandom;
    attribute vec3 aPosDNA;
    attribute vec3 aPosCell;
    attribute float aSize;

    varying vec3 vPos; // Pass position to fragment for gradient coloring
    varying float vAlpha;

    float easeInOutCubic(float x) {
      return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
    }

    void main() {
      vec3 pos;
      
      float phase = mod(uState, 4.0);
      float t;
      
      // Morphing Logic
      if (phase < 1.0) {
        t = easeInOutCubic(phase);
        pos = mix(aPosRandom, aPosDNA, t);
      } else if (phase < 2.0) {
        t = easeInOutCubic(phase - 1.0);
        pos = mix(aPosDNA, aPosRandom, t);
      } else if (phase < 3.0) {
        t = easeInOutCubic(phase - 2.0);
        pos = mix(aPosRandom, aPosCell, t);
      } else {
        t = easeInOutCubic(phase - 3.0);
        pos = mix(aPosCell, aPosRandom, t);
      }

      // Alive Noise (Breathing)
      float noiseFreq = 0.5;
      float noiseAmp = 0.15;
      pos.x += sin(uTime * 0.5 + pos.y * noiseFreq) * noiseAmp;
      pos.y += cos(uTime * 0.3 + pos.z * noiseFreq) * noiseAmp;
      pos.z += sin(uTime * 0.4 + pos.x * noiseFreq) * noiseAmp;

      // Rotation logic
      if (phase >= 0.0 && phase <= 2.0) {
         float dnaMix = 1.0 - abs(phase - 1.0); 
         float angle = uTime * 0.2 * dnaMix;
         float c = cos(angle);
         float s = sin(angle);
         mat2 rot = mat2(c, -s, s, c);
         pos.xz = rot * pos.xz;
      }
      
      if (phase >= 2.0) {
         float cellMix = 1.0 - abs(phase - 3.0);
         float angle = uTime * 0.1 * cellMix;
         float c = cos(angle);
         float s = sin(angle);
         mat2 rot = mat2(c, -s, s, c);
         pos.xy = rot * pos.xy;
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Size attenuation
      gl_PointSize = uSize * aSize * uPixelRatio * (18.0 / -mvPosition.z);
      
      vPos = pos; // Pass for coloring
      
      float randomStateMix = 1.0 - abs(mod(phase, 2.0) - 1.0); 
      // Keep alpha high for visibility on white
      vAlpha = 0.6 + 0.4 * randomStateMix;
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
      
      // Sharper gradient for clearer particles on white
      float glow = 1.0 - (r * 2.0);
      glow = pow(glow, 1.5);

      float gradientX = smoothstep(-10.0, 10.0, vPos.x + sin(uTime * 0.2) * 2.0);
      float gradientY = smoothstep(-5.0, 5.0, vPos.y);

      vec3 color = mix(uColor1, uColor2, gradientX);
      color = mix(color, uColor3, gradientY);

      gl_FragColor = vec4(color, vAlpha * glow);
    }
  `
);

extend({ BioMorphMaterial });

// ... Generator (same as before, omitted for brevity but logic is unchanged)
const generateShapes = (count: number) => {
  const posRandom = new Float32Array(count * 3);
  const posDNA = new Float32Array(count * 3);
  const posCell = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const rSpread = 18;
    posRandom[i * 3] = (Math.random() - 0.5) * rSpread;
    posRandom[i * 3 + 1] = (Math.random() - 0.5) * rSpread;
    posRandom[i * 3 + 2] = (Math.random() - 0.5) * rSpread;

    const y = (Math.random() - 0.5) * 14; 
    const radius = 2.2;
    const twist = 0.7;
    const isStrand2 = i % 2 === 0;
    const offset = isStrand2 ? Math.PI : 0;
    const angle = y * twist + offset;
    
    let dx, dy, dz;
    if (Math.random() > 0.2) {
       dx = radius * Math.cos(angle);
       dy = y;
       dz = radius * Math.sin(angle);
    } else {
       const t = Math.random(); 
       const x1 = radius * Math.cos(y * twist);
       const z1 = radius * Math.sin(y * twist);
       const x2 = radius * Math.cos(y * twist + Math.PI);
       const z2 = radius * Math.sin(y * twist + Math.PI);
       dx = x1 + (x2 - x1) * t;
       dy = y;
       dz = z1 + (z2 - z1) * t;
    }

    const slantAngle = Math.PI / 4; 
    const cosS = Math.cos(slantAngle);
    const sinS = Math.sin(slantAngle);
    posDNA[i * 3] = dx * cosS - dy * sinS;
    posDNA[i * 3 + 1] = dx * sinS + dy * cosS;
    posDNA[i * 3 + 2] = dz; 

    let r;
    const rand = Math.random();
    if (rand < 0.3) {
       r = 2.0 * Math.cbrt(Math.random()); 
    } else {
       r = 5.5 + Math.random() * 1.0; 
    }

    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    posCell[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    posCell[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    posCell[i * 3 + 2] = r * Math.cos(phi);

    sizes[i] = 0.5 + Math.random() * 1.0; 
  }
  return { posRandom, posDNA, posCell, sizes };
};

const BioParticles = () => {
  const count = 3500;
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { posRandom, posDNA, posCell, sizes } = useMemo(() => generateShapes(count), []);
  const [targetState, setTargetState] = useState(0); 

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const sequence = async () => {
        setTargetState(1); await new Promise(r => setTimeout(r, 6000));
        setTargetState(2); await new Promise(r => setTimeout(r, 2000));
        setTargetState(3); await new Promise(r => setTimeout(r, 6000));
        setTargetState(4); await new Promise(r => setTimeout(r, 2000));
        sequence();
    };
    timeout = setTimeout(sequence, 500);
    return () => clearTimeout(timeout);
  }, []);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      let current = materialRef.current.uniforms.uState.value;
      if (current > 3.95 && targetState === 1) { 
          materialRef.current.uniforms.uState.value = 0;
          current = 0;
      }
      const step = (targetState - current) * 1.5 * delta;
      materialRef.current.uniforms.uState.value += step;
    }
  });

  return (
    // @ts-ignore
    <points>
      {/* @ts-ignore */}
      <bufferGeometry>
        {/* @ts-ignore */}
        <bufferAttribute attach="attributes-position" count={count} array={posRandom} itemSize={3} />
        {/* @ts-ignore */}
        <bufferAttribute attach="attributes-aPosRandom" count={count} array={posRandom} itemSize={3} />
        {/* @ts-ignore */}
        <bufferAttribute attach="attributes-aPosDNA" count={count} array={posDNA} itemSize={3} />
        {/* @ts-ignore */}
        <bufferAttribute attach="attributes-aPosCell" count={count} array={posCell} itemSize={3} />
        {/* @ts-ignore */}
        <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      {/* @ts-ignore */}
      <bioMorphMaterial ref={materialRef} transparent={true} depthWrite={false} blending={THREE.NormalBlending} />
    </points>
  );
};

const MedicalDNA: React.FC = () => {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05, rootMargin: "50px" } // Looser threshold for mobile
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    // Explicitly set w-full h-full to ensure container has size
    <div ref={containerRef} className="w-full h-full relative min-h-[400px]">
      {isInView && (
        <Canvas 
          camera={{ position: [0, 0, 18], fov: 45 }} 
          // Lower pixel ratio on mobile to save memory (dpr 1-1.5 is usually enough)
          dpr={[1, 1.5]} 
          gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        >
          <BioParticles />
        </Canvas>
      )}
    </div>
  );
};

export default MedicalDNA;
