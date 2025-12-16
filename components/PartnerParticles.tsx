// @ts-nocheck
import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// Fix for "Property does not exist on type JSX.IntrinsicElements"
declare global {
  namespace JSX {
    interface IntrinsicElements {
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      partnerMorphMaterial: any;
    }
  }
}

// -----------------------------------------------------------------------------
// Partner Trust Morphing Shader
// Style matches BusinessNetwork (Blue/Navy/Purple) but morphs Text
// -----------------------------------------------------------------------------
const PartnerMorphMaterial = shaderMaterial(
  {
    uTime: 0,
    uState: 0,
    uColor1: new THREE.Color('#1e3a8a'), // Navy
    uColor2: new THREE.Color('#3b82f6'), // Blue
    uColor3: new THREE.Color('#7c3aed'), // Purple
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
    attribute vec3 aPosShin; // 信
    attribute vec3 aPosRai;  // 頼
    attribute float aSize;

    varying vec3 vPos;
    varying float vAlpha;

    float easeInOutCubic(float x) {
      return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
    }

    void main() {
      vec3 pos;
      float phase = mod(uState, 3.0);
      float t;

      if (phase < 1.0) {
        // Sphere -> Shin (0 -> 1)
        t = easeInOutCubic(phase);
        pos = mix(aPosSphere, aPosShin, t);
      } else if (phase < 2.0) {
        // Shin -> Rai (1 -> 2)
        t = easeInOutCubic(phase - 1.0);
        pos = mix(aPosShin, aPosRai, t);
      } else {
        // Rai -> Sphere (2 -> 3/0)
        t = easeInOutCubic(phase - 2.0);
        pos = mix(aPosRai, aPosSphere, t);
      }

      // Gentle Rotation
      // Slower than BusinessNetwork to make text readable
      float rotSpeed = 0.12; 
      float angle = uTime * rotSpeed;
      // Add subtle wave to rotation
      angle += sin(uTime * 0.5 + pos.y * 0.2) * 0.05;

      float c = cos(angle);
      float s = sin(angle);
      mat2 rot = mat2(c, -s, s, c);
      pos.xz = rot * pos.xz;

      // Vertical Float
      pos.y += sin(uTime * 0.8 + pos.x) * 0.2;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Size attenuation
      gl_PointSize = uSize * aSize * uPixelRatio * (20.0 / -mvPosition.z);
      
      vPos = pos;
      
      // Pulse alpha for "Digital Alive" feel
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
      
      // Soft glow circle
      float glow = 1.0 - smoothstep(0.3, 0.5, r);
      
      // Gradient coloring based on height
      float colorMix = vPos.y * 0.1 + 0.5;
      vec3 baseColor = mix(uColor1, uColor2, colorMix + sin(uTime)*0.1);
      
      // Data packet effect (moving light)
      float packet = smoothstep(0.9, 1.0, sin(vPos.x * 0.5 + vPos.z * 0.5 + uTime * 2.0));
      
      vec3 finalColor = mix(baseColor, uColor3, packet);
      
      gl_FragColor = vec4(finalColor, vAlpha * glow);
    }
  `
);

extend({ PartnerMorphMaterial });

// -----------------------------------------------------------------------------
// Generators
// -----------------------------------------------------------------------------

// Generate points from text canvas
const generateTextPoints = (text: string, count: number): Float32Array => {
  const width = 1024;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new Float32Array(count * 3);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
  
  ctx.fillStyle = 'white';
  ctx.font = 'bold 350px "Shippori Mincho", serif'; 
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const validPoints: [number, number][] = [];

  // Sampling
  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      const index = (y * width + x) * 4;
      if (data[index] > 128) { 
         validPoints.push([x - width / 2, (y - height / 2) * -1]); 
      }
    }
  }

  const positions = new Float32Array(count * 3);
  const scale = 0.04; // Scale down

  if (validPoints.length > 0) {
    for (let i = 0; i < count; i++) {
        const targetIndex = Math.floor(Math.random() * validPoints.length);
        const [tx, ty] = validPoints[targetIndex];
        
        // Add jitter for 3D volume feel on 2D text
        positions[i * 3] = tx * scale + (Math.random() - 0.5) * 0.5;
        positions[i * 3 + 1] = ty * scale + (Math.random() - 0.5) * 0.5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2.0; // Z depth
    }
  }
  return positions;
};

const generatePartnerShapes = async (count: number) => {
  // 1. Sphere (Network)
  const posSphere = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 7.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    posSphere[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    posSphere[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    posSphere[i * 3 + 2] = r * Math.cos(phi);
  }

  // 2. Text "信"
  const posShin = generateTextPoints("信", count);
  
  // 3. Text "頼"
  const posRai = generateTextPoints("頼", count);

  // Sizes for variation
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    sizes[i] = Math.random() > 0.9 ? 1.8 : 0.7 + Math.random() * 0.6;
  }

  return { posSphere, posShin, posRai, sizes };
};

const Particles = () => {
  const count = 4000;
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [data, setData] = useState<any>(null);
  const [targetState, setTargetState] = useState(0);

  useEffect(() => {
    document.fonts.ready.then(() => {
        generatePartnerShapes(count).then(setData);
    });
  }, []);

  useEffect(() => {
    if (!data) return;
    
    let timeout: ReturnType<typeof setTimeout>;
    
    // Sequence: Sphere(0) -> Shin(1) -> Rai(2) -> Sphere(3/0)
    const sequence = async () => {
        const holdText = 3000;
        const morphTime = 1500; 
        const holdSphere = 2000;

        // 0 -> 1 (Sphere -> Shin)
        setTargetState(1); await new Promise(r => setTimeout(r, morphTime + holdText));
        
        // 1 -> 2 (Shin -> Rai)
        setTargetState(2); await new Promise(r => setTimeout(r, morphTime + holdText));
        
        // 2 -> 3 (Rai -> Sphere)
        setTargetState(3); await new Promise(r => setTimeout(r, morphTime + holdSphere));
        
        sequence();
    };
    
    timeout = setTimeout(sequence, 1000);
    return () => clearTimeout(timeout);
  }, [data]);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      let current = materialRef.current.uniforms.uState.value;
      
      // Reset loop logic
      // When we reach state 3 (which is visually sphere again), and target wraps to 1..
      // Actually my sequence logic sets target to 3. 
      // Shader mod(uState, 3.0). 
      // 3.0 mod 3.0 = 0.0 (Sphere).
      // So animating 2 -> 3 visually goes Rai -> Sphere.
      // Once current is close to 3, we can snap to 0 safely.
      
      if (current > 2.95 && targetState === 1) {
          materialRef.current.uniforms.uState.value = 0;
          current = 0;
      }
      
      // If loop restarted, targetState might be 1, but current is 3.
      // We need to reset current to 0 manually if it exceeds 3
      if (current > 3.0) {
         materialRef.current.uniforms.uState.value = 0;
         current = 0;
      }

      // Smooth interpolation
      // If target is 3 and current is 2, it goes up.
      // If loop restarts, target becomes 1. We must ensure we reset current to 0 first.
      
      // Simple LERP approach
      // If targetState changed to 3, we approach 3.
      // When sequence function loops, it calls setTargetState(1) AFTER delay.
      // We need to detect that.
      
      // Better Reset Logic for React State loop:
      // My sequence above goes 0->1->2->3.
      // Then recursively calls sequence().
      // Immediately inside sequence, it does setTargetState(1).
      // So from 3, we want to go to 1? No, 3 is sphere. 1 is Shin.
      // So 0 -> 1 (Sphere->Shin) again.
      // So when target becomes 1, we must be at 0.
      // But we are at 3. 3 IS 0 visually. So we snap 3->0.
      
      if (targetState === 1 && current > 2.9) {
         materialRef.current.uniforms.uState.value = 0;
         current = 0;
      }

      const step = (targetState - current) * 1.0 * delta;
      materialRef.current.uniforms.uState.value += step;
    }
  });

  if (!data) return null;

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={data.posSphere} itemSize={3} />
        <bufferAttribute attach="attributes-aPosSphere" count={count} array={data.posSphere} itemSize={3} />
        <bufferAttribute attach="attributes-aPosShin" count={count} array={data.posShin} itemSize={3} />
        <bufferAttribute attach="attributes-aPosRai" count={count} array={data.posRai} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={count} array={data.sizes} itemSize={1} />
      </bufferGeometry>
      <partnerMorphMaterial ref={materialRef} transparent={true} depthWrite={false} blending={THREE.NormalBlending} />
    </points>
  );
};

const PartnerParticles: React.FC = () => {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05, rootMargin: "50px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-[#F5F5F7] min-h-[400px]">
      {isInView && (
        <Canvas 
          camera={{ position: [0, 0, 20], fov: 45 }} 
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        >
          <Particles />
        </Canvas>
      )}
    </div>
  );
};

export default PartnerParticles;