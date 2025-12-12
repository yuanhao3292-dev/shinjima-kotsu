import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, extend, Object3DNode } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// -----------------------------------------------------------------------------
// 1. Custom Shader Material (Holographic Dark Particles for White BG)
//    Updated with Mixed Shapes (5-Point Star + 4-Point Gemini Sparkle + Circles)
// -----------------------------------------------------------------------------
const HoloParticleMaterial = shaderMaterial(
  {
    uTime: 0,
    uProgress: 0, // 0 = Exploded, 1 = Formed
    uColor1: new THREE.Color('#2e008b'), // Deep Violet (Contrast on White)
    uColor2: new THREE.Color('#0044cc'), // Royal Blue
    uColor3: new THREE.Color('#e6007e'), // Magenta
    uPixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    uSize: 2.8, // Base particle size
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform float uProgress;
    uniform float uPixelRatio;
    uniform float uSize;

    attribute vec3 aTarget; // Text position
    attribute vec3 aStart;  // Exploded position
    attribute float aRandom; // Random seed

    varying vec3 vPos;
    varying float vRandom; // Pass random to fragment for shape selection

    // Pseudo-random
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    // Simple noise
    float noise(vec3 p) {
        return sin(p.x * 0.5 + uTime) * sin(p.y * 0.3 + uTime);
    }

    // Ease Out Cubic
    float easeOutCubic(float x) {
        return 1.0 - pow(1.0 - x, 3.0);
    }

    void main() {
      vPos = aTarget;
      vRandom = aRandom;

      // Animation Progress with Easing
      float t = easeOutCubic(clamp(uProgress, 0.0, 1.0));

      // --- 1. Interpolation (Start -> Target) ---
      vec3 pos = mix(aStart, aTarget, t);

      // --- 2. Swirling / Implosion Effect during transition ---
      float angle = aRandom * 6.28;
      float radiusOffset = (1.0 - t) * 15.0; // Scatter radius
      pos.x += cos(angle + uTime * 2.0) * radiusOffset;
      pos.z += sin(angle + uTime * 2.0) * radiusOffset;
      pos.y += sin(angle * 2.0 + uTime) * radiusOffset * 0.5;

      // --- 3. Idle Floating (After formed) ---
      float idleAmp = mix(0.0, 0.15, t); 
      pos.x += noise(pos + vec3(0.0, uTime * 0.5, 0.0)) * idleAmp;
      pos.y += noise(pos + vec3(10.0, uTime * 0.4, 0.0)) * idleAmp;
      pos.z += noise(pos + vec3(20.0, uTime * 0.3, 0.0)) * idleAmp;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Size Attenuation
      // Stars (low random value) get a larger size boost to make shape visible
      float sizeBoost = (aRandom < 0.3) ? 1.8 : 1.0; 
      
      gl_PointSize = uSize * uPixelRatio * sizeBoost * (40.0 / -mvPosition.z);
      
      // Particles appear smaller when exploded, larger when formed
      gl_PointSize *= mix(0.3, 1.0, t);
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
      float len = length(xy);
      float alpha = 0.0;
      float angle = atan(xy.y, xy.x);
      
      // --- Mix of Shapes ---
      // 0.0 - 0.15: 5-Point Star (Classic Star)
      // 0.15 - 0.30: 4-Point Star (Gemini Sparkle)
      // 0.30 - 1.00: Circle (Soft Dot)

      if (vRandom < 0.15) {
          // --- 5-Point Star ---
          // Rotating
          float theta = angle + uTime * 2.0;
          
          // Cosine wave with frequency 5 gives 5 lobes
          float lobes = 0.5 + 0.5 * cos(theta * 5.0);
          
          // Modulate distance: larger lobes = longer rays (smaller distance metric)
          // 1.5 base - 0.8 * lobe creates concave star shape
          float starDist = len * (1.6 - 0.8 * pow(lobes, 2.0)); 
          
          alpha = 1.0 - smoothstep(0.0, 0.35, starDist);
          alpha = pow(alpha, 2.0); // Sharpen core
      } 
      else if (vRandom < 0.3) {
          // --- 4-Point Gemini Sparkle ---
          // Use sin(2*angle) to create 4 lobes
          float starFactor = 0.5 + 2.0 * abs(sin(angle * 2.0 + uTime * 1.5));
          
          // Squeeze the circle
          float dist = len * starFactor;
          
          alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha = pow(alpha, 2.5); // Glowing core
      } 
      else {
          // --- Circle ---
          if (len > 0.5) discard;
          alpha = smoothstep(0.5, 0.25, len);
      }

      // Discard faint pixels
      if (alpha < 0.01) discard;

      // Holographic Gradient Mapping
      float gradientX = smoothstep(-8.0, 8.0, vPos.x + sin(uTime * 0.2) * 2.0);
      float gradientY = smoothstep(-2.0, 2.0, vPos.y);

      vec3 color = mix(uColor1, uColor2, gradientX);
      color = mix(color, uColor3, gradientY);

      // Add shimmer
      float shine = sin(vPos.x * 0.5 + uTime * 2.0) * 0.5 + 0.5;
      color += vec3(0.1) * shine;

      // Output
      gl_FragColor = vec4(color, alpha * 0.9);
    }
  `
);

extend({ HoloParticleMaterial });

// -----------------------------------------------------------------------------
// 2. Particle System Component (Canvas Sampling Method)
// -----------------------------------------------------------------------------
const ParticleSystem = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [active, setActive] = useState(false);
  const [particleData, setParticleData] = useState<{
    positions: Float32Array;
    targets: Float32Array;
    randoms: Float32Array;
  } | null>(null);

  // Responsive Scale State
  const [meshScale, setMeshScale] = useState<[number, number, number]>([1, 1, 1]);

  useEffect(() => {
    // Responsive Logic: 
    // If width < 768px (Mobile), scale down drastically (0.35) to fit vertical screen.
    // If width >= 768px (Tablet/Desktop), keep scale at 1.0.
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setMeshScale([0.35, 0.35, 0.35]); // Reduced from previous 0.55 to fit better
      } else {
        setMeshScale([1, 1, 1]);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const generateParticles = async () => {
      // Wait for fonts to be ready to ensure correct typeface rendering
      await document.fonts.ready;

      // Configuration
      const text = "AIと、その先へ";
      const particleCount = 6000;
      const canvasWidth = 1024;
      const canvasHeight = 256;
      
      // 1. Create off-screen canvas for text analysis
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      // Draw Text (Use CSS font loaded in index.html)
      ctx.fillStyle = 'white';
      // Font size optimized
      ctx.font = 'bold 55px "Shippori Mincho", serif'; 
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);

      // 2. Scan pixel data to find text shape
      const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
      const data = imageData.data;
      const validPoints: [number, number][] = [];

      for (let y = 0; y < canvasHeight; y += 4) { // Step 4 for performance
        for (let x = 0; x < canvasWidth; x += 4) {
          const index = (y * canvasWidth + x) * 4;
          const alpha = data[index + 3];
          if (alpha > 128) {
             // Map 2D pixel to 3D world space centered at 0,0
             // Y is inverted in 3D space
             validPoints.push([x - canvasWidth / 2, -(y - canvasHeight / 2)]); 
          }
        }
      }

      // 3. Generate Particles
      const posArray = new Float32Array(particleCount * 3);    // Exploded positions
      const targetArray = new Float32Array(particleCount * 3); // Text positions
      const randomArray = new Float32Array(particleCount);
      
      const scale = 0.05; // Scale down pixel coordinates to world units

      if (validPoints.length > 0) {
        for (let i = 0; i < particleCount; i++) {
            // Target: Pick a random valid point on the text
            const targetIndex = Math.floor(Math.random() * validPoints.length);
            const [tx, ty] = validPoints[targetIndex];
            
            targetArray[i * 3] = tx * scale;
            targetArray[i * 3 + 1] = ty * scale;
            targetArray[i * 3 + 2] = 0; // Flat Z for text

            // Start: Random position on a large sphere (Explosion state)
            const r = 40 + Math.random() * 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            posArray[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            posArray[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            posArray[i * 3 + 2] = r * Math.cos(phi);

            // Random
            randomArray[i] = Math.random();
        }
      }

      setParticleData({
        positions: posArray,
        targets: targetArray,
        randoms: randomArray
      });

      // Start animation sequence with loop
      const runLoop = async () => {
         // Wait a bit before first start
         await new Promise(r => setTimeout(r, 500)); 
         
         while (isMounted) {
             // 1. Form the text
             setActive(true); 
             // Time to form (slowly) + hold reading time (total ~7s)
             await new Promise(r => setTimeout(r, 7000)); 
             
             if (!isMounted) break;
             
             // 2. Explode the text
             setActive(false); 
             // Time to explode + wait in chaos (total ~3s)
             await new Promise(r => setTimeout(r, 3000)); 
         }
      };
      
      runLoop();
    };

    generateParticles();
    
    return () => { isMounted = false; };
  }, []);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Animation Progress Logic
      const target = active ? 1 : 0;
      const current = materialRef.current.uniforms.uProgress.value;
      
      // Reduced speed from 1.5 to 0.8 for a slower, more zen-like convergence
      const step = (target - current) * 0.8 * delta; 
      materialRef.current.uniforms.uProgress.value += step;
    }
    
    // Slight mouse parallax or rotation can be added here
    if (pointsRef.current) {
        pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
        pointsRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.15) * 0.02;
    }
  });

  if (!particleData) return null;

  return (
    // @ts-ignore
    <points ref={pointsRef} scale={meshScale}>
      {/* @ts-ignore */}
      <bufferGeometry>
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-position"
          count={particleData.targets.length / 3}
          array={particleData.targets} 
          itemSize={3}
        />
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-aTarget"
          count={particleData.targets.length / 3}
          array={particleData.targets}
          itemSize={3}
        />
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-aStart"
          count={particleData.positions.length / 3}
          array={particleData.positions}
          itemSize={3}
        />
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-aRandom"
          count={particleData.randoms.length}
          array={particleData.randoms}
          itemSize={1}
        />
      {/* @ts-ignore */}
      </bufferGeometry>
      {/* @ts-ignore */}
      <holoParticleMaterial
        ref={materialRef}
        transparent={true}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    {/* @ts-ignore */}
    </points>
  );
};

// -----------------------------------------------------------------------------
// 3. Main Export
// -----------------------------------------------------------------------------
const IntroParticles: React.FC = () => {
  return (
    <div className="w-full h-full bg-white relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 18], fov: 35 }}
        dpr={[1, 2]} 
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        {/* @ts-ignore */}
        <color attach="background" args={['#FFFFFF']} />
        <ParticleSystem />
      </Canvas>
      
      {/* Decorative Overlay Gradient (Vignette) for Focus */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_10%,rgba(255,255,255,0.8)_100%)]"></div>
    </div>
  );
};

export default IntroParticles;