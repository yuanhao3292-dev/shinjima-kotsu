
import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// -----------------------------------------------------------------------------
// Hero Morph Material (The Brand Identity Sequence)
// -----------------------------------------------------------------------------
const HeroMorphMaterial = shaderMaterial(
  {
    uTime: 0,
    uState: 0, 
    // Unified Palette: Navy (Business) -> Royal Blue (Tech) -> Magenta (Medical)
    uColor1: new THREE.Color('#1e3a8a'), 
    uColor2: new THREE.Color('#0044cc'), 
    uColor3: new THREE.Color('#e6007e'), 
    uPixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    uSize: 3.5, 
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform float uState;
    uniform float uPixelRatio;
    uniform float uSize;

    attribute vec3 aPosSphere;
    attribute vec3 aPosShin; // 新
    attribute vec3 aPosJima; // 島
    attribute vec3 aPosKo;   // 交
    attribute vec3 aPosTsu;  // 通
    attribute float aRandom;

    varying vec3 vPos;
    varying float vRandom;

    float easeInOutCubic(float x) {
      return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
    }

    void main() {
      vRandom = aRandom;
      vec3 pos;
      
      // Sequence: Sphere(0) -> Shin(1) -> Jima(2) -> Ko(3) -> Tsu(4) -> Sphere(5/0)
      float phase = mod(uState, 5.0);
      float t;
      
      if (phase < 1.0) {
        // Sphere -> Shin (新)
        t = easeInOutCubic(phase);
        pos = mix(aPosSphere, aPosShin, t);
      } else if (phase < 2.0) {
        // Shin -> Jima (島)
        t = easeInOutCubic(phase - 1.0);
        pos = mix(aPosShin, aPosJima, t);
      } else if (phase < 3.0) {
        // Jima -> Ko (交)
        t = easeInOutCubic(phase - 2.0);
        pos = mix(aPosJima, aPosKo, t);
      } else if (phase < 4.0) {
        // Ko -> Tsu (通)
        t = easeInOutCubic(phase - 3.0);
        pos = mix(aPosKo, aPosTsu, t);
      } else {
        // Tsu -> Sphere
        t = easeInOutCubic(phase - 4.0);
        pos = mix(aPosTsu, aPosSphere, t);
      }

      // Organic Noise / Breathing
      float noiseFreq = 0.5;
      float noiseAmp = 0.15;
      pos.x += sin(uTime * 0.5 + pos.y * noiseFreq) * noiseAmp;
      pos.y += cos(uTime * 0.3 + pos.z * noiseFreq) * noiseAmp;
      pos.z += sin(uTime * 0.4 + pos.x * noiseFreq) * noiseAmp;

      // Gentle Rotation (Global)
      // Rotates slowly to show depth
      float angle = uTime * 0.08;
      float c = cos(angle);
      float s = sin(angle);
      vec3 rotatedPos = vec3(
        pos.x * c - pos.z * s,
        pos.y,
        pos.x * s + pos.z * c
      );

      vec4 mvPosition = modelViewMatrix * vec4(rotatedPos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Size attenuation
      gl_PointSize = uSize * uPixelRatio * (28.0 / -mvPosition.z);
      
      // Twinkle effect
      float twinkle = 0.8 + 0.2 * sin(uTime * 3.0 + aRandom * 10.0);
      gl_PointSize *= twinkle;

      vPos = rotatedPos;
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform float uTime;

    varying vec3 vPos;
    varying float vRandom;

    void main() {
      vec2 xy = gl_PointCoord.xy - vec2(0.5);
      float r = length(xy);
      if (r > 0.5) discard;
      
      // Smooth soft glow
      float glow = 1.0 - smoothstep(0.0, 0.5, r);
      glow = pow(glow, 1.8);

      // Gradient Mapping
      float gradientX = smoothstep(-10.0, 10.0, vPos.x + sin(uTime * 0.2) * 5.0);
      float gradientY = smoothstep(-5.0, 5.0, vPos.y);

      vec3 color = mix(uColor1, uColor2, gradientX);
      color = mix(color, uColor3, gradientY);

      gl_FragColor = vec4(color, 0.9 * glow);
    }
  `
);

extend({ HeroMorphMaterial });

// -----------------------------------------------------------------------------
// Generators
// -----------------------------------------------------------------------------

// Helper to generate points from text
const generateTextPoints = (text: string, count: number, width: number, height: number): Float32Array => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new Float32Array(count * 3);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
  
  ctx.fillStyle = 'white';
  // Use Shippori Mincho for that high-end Japanese serif look
  ctx.font = 'bold 280px "Shippori Mincho", serif'; 
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const validPoints: [number, number][] = [];

  // Sampling with step to reduce density check
  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      const index = (y * width + x) * 4;
      if (data[index] > 128) { // Red channel > 128
         validPoints.push([x - width / 2, (y - height / 2) * -1]); 
      }
    }
  }

  const positions = new Float32Array(count * 3);
  const scale = 0.05; // Scale down to world units

  if (validPoints.length > 0) {
    for (let i = 0; i < count; i++) {
        const targetIndex = Math.floor(Math.random() * validPoints.length);
        const [tx, ty] = validPoints[targetIndex];
        
        // Add jitter for volume
        positions[i * 3] = tx * scale + (Math.random() - 0.5) * 0.2;
        positions[i * 3 + 1] = ty * scale + (Math.random() - 0.5) * 0.2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5; // Z depth
    }
  }
  return positions;
};

const generateParticles = async (count: number) => {
  // 1. Sphere (Network/Globe)
  const posSphere = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 8.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    posSphere[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    posSphere[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    posSphere[i * 3 + 2] = r * Math.cos(phi);
  }

  // 2. Text Shapes
  const canvasSize = 1024;
  const posShin = generateTextPoints("新", count, canvasSize, canvasSize);
  const posJima = generateTextPoints("島", count, canvasSize, canvasSize);
  const posKo = generateTextPoints("交", count, canvasSize, canvasSize);
  const posTsu = generateTextPoints("通", count, canvasSize, canvasSize);

  // Randoms
  const randoms = new Float32Array(count);
  for (let i = 0; i < count; i++) randoms[i] = Math.random();

  return { posSphere, posShin, posJima, posKo, posTsu, randoms };
};

const ParticleSystem = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [data, setData] = useState<any>(null);
  const [targetState, setTargetState] = useState(0);

  useEffect(() => {
    // Wait for fonts to load to ensure text generates correctly
    document.fonts.ready.then(() => {
        const init = async () => {
            const d = await generateParticles(6000); // 6000 particles for density
            setData(d);
        };
        init();
    });
  }, []);

  useEffect(() => {
    if (!data) return;
    
    let timeout: ReturnType<typeof setTimeout>;
    
    // The Loop: Sphere -> 新 -> 島 -> 交 -> 通 -> Sphere
    const sequence = async () => {
        const holdTime = 2500; // Hold longer to read chars
        const morphTime = 1200; // Fast morph

        // 0 -> 1 (Sphere -> Shin)
        setTargetState(1); await new Promise(r => setTimeout(r, morphTime + holdTime));
        
        // 1 -> 2 (Shin -> Jima)
        setTargetState(2); await new Promise(r => setTimeout(r, morphTime + holdTime));
        
        // 2 -> 3 (Jima -> Ko)
        setTargetState(3); await new Promise(r => setTimeout(r, morphTime + holdTime));
        
        // 3 -> 4 (Ko -> Tsu)
        setTargetState(4); await new Promise(r => setTimeout(r, morphTime + holdTime));
        
        // 4 -> 5 (Tsu -> Sphere)
        setTargetState(5); await new Promise(r => setTimeout(r, morphTime + holdTime));
        
        // Loop back logic handled in useFrame (5 resets to 0)
        sequence(); 
    };
    
    // Initial start delay
    timeout = setTimeout(sequence, 1000);
    return () => clearTimeout(timeout);
  }, [data]);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      let current = materialRef.current.uniforms.uState.value;
      
      // Reset logic
      if (current > 4.95 && targetState === 1) {
          materialRef.current.uniforms.uState.value = 0;
          current = 0;
      }

      // Smooth interpolation
      const step = (targetState - current) * 1.5 * delta;
      materialRef.current.uniforms.uState.value += step;
    }
  });

  if (!data) return null;

  return (
    // @ts-ignore
    <points ref={pointsRef}>
      {/* @ts-ignore */}
      <bufferGeometry>
        {/* @ts-ignore */}
        <bufferAttribute attach="attributes-position" count={data.posSphere.length / 3} array={data.posSphere} itemSize={3} />
        {/* @ts-ignore */}
        <bufferAttribute attach="attributes-aPosSphere" count={data.posSphere.length / 3} array={data.posSphere} itemSize={3} />
        {/* @ts-ignore */}
        <bufferAttribute attach="attributes-aPosShin" count={data.posShin.length / 3} array={data.posShin} itemSize={3} />
        {/* @ts-ignore */}
        <bufferAttribute attach="attributes-aPosJima" count={data.posJima.length / 3} array={data.posJima} itemSize={3} />
        {/* @ts-ignore */}
        <bufferAttribute attach="attributes-aPosKo" count={data.posKo.length / 3} array={data.posKo} itemSize={3} />
        {/* @ts-ignore */}
        <bufferAttribute attach="attributes-aPosTsu" count={data.posTsu.length / 3} array={data.posTsu} itemSize={3} />
        {/* @ts-ignore */}
        <bufferAttribute attach="attributes-aRandom" count={data.randoms.length} array={data.randoms} itemSize={1} />
      </bufferGeometry>
      {/* @ts-ignore */}
      <heroMorphMaterial ref={materialRef} transparent={true} depthWrite={false} blending={THREE.NormalBlending} />
    </points>
  );
};

const IntroParticles: React.FC = () => {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only mount the canvas when in view to save WebGL context for subsequent 3D sections
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.01, rootMargin: "100px" } // Load slightly before view, keep slightly after
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full bg-white relative overflow-hidden">
      {isInView && (
        <Canvas camera={{ position: [0, 0, 18], fov: 35 }} dpr={[1, 2]} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}>
          {/* @ts-ignore */}
          <color attach="background" args={['#FFFFFF']} />
          <ParticleSystem />
        </Canvas>
      )}
      {/* REMOVED GRADIENT OVERLAY TO MAKE PARTICLES POP AS "TOPMOST" LAYER */}
    </div>
  );
};

export default IntroParticles;
