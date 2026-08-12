import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ExternalLink, Sparkles, MoveLeft, MoveRight, Flame } from 'lucide-react';
import utexo1Img from '../images/utexo1.png';
import bloomImg from '../images/bloom1.png';
import naoxevm from '../images/naoxevm.jpg';
import spidermanImg from '../images/spiderman.png';
import arindam from '../images/arindam.png';
import cyberpunkImg from '../images/games/cyberpunk.jpg';
import relay from '../images/relay.jpg';

interface ApeItem {
  id: string;
  title: string;
  category: string;
  tag: string;
  description: string;
  image: string;
  link: string;
}

const apeItems: ApeItem[] = [
  {
    id: 'utexo',
    title: 'UTEXO PROTOCOL',
    category: 'Bitcoin-native execution and settlement layer',
    tag: 'api layer',
    description: 'The protocol that allows developers to build next-generation applications on Bitcoin.',
    image: utexo1Img,
    link: 'https://utexo.com/',
  },
  {
    id: 'relay',
    title: 'Relay',
    category: 'Swap & Bridge',
    tag: 'FAST & SECURE',
    description: 'Fast, secure, and low-cost swaps and bridges across multiple blockchains.',
    image: relay,
    link: 'https://relay.link/',
  },
  {
    id: 'Debank',
    title: 'DeBank',
    category: 'Web3 Wallet & DeFi Portfolio Tracker',
    tag: 'TRACKER',
    description: 'Decentralized Web3 wallet and DeFi portfolio tracker with real-time market data and analytics.',
    image: naoxevm,
    link: 'https://debank.com/',
  },
  {
    id: 'opensea',
    title: 'Opensea',
    category: 'nft marketplace',
    tag: 'MARKETPLACE',
    description: 'The most comprehensive NFT marketplace with latest and new nfts listed every day',
    image: bloomImg,
    link: 'https://opensea.io/',
  },
  {
    id: 'arc',
    title: 'ARC',
    category: 'L1',
    tag: 'STABLECOIN',
    description: 'Build real-world finance onchain',
    image: spidermanImg,
    link: 'https://www.arc.io/',
  },
  {
    id: 'Broski',
    title: 'Arindam',
    category: 'Developer',
    tag: 'MAGICAL',
    description: 'Frontend and Blockchain Magician',
    image: arindam,
    link: 'https://www.mrarindam.xyz',
  },
  {
    id: 'base',
    title: 'BASE',
    category: 'L2',
    tag: 'BLOCKCHAIN',
    description: 'Base is the best layer-2 chain for building the next generation of applications.',
    image: cyberpunkImg,
    link: 'https://www.base.org/',
  },
];

export const Spotlight3DSection: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  // Rotation & Drag Physics State
  const rotationYRef = useRef(0);
  const targetRotationYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const velocityRef = useRef(0);

  // Mouse Parallax Tilt Physics
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  const total = apeItems.length;
  const angleStep = (Math.PI * 2) / total;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    // 1. WebGL Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.4);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 2. Specular Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
    dirLight.position.set(6, 12, 8);
    scene.add(dirLight);

    const redLight = new THREE.DirectionalLight(0xef4444, 1.8);
    redLight.position.set(-6, -6, 6);
    scene.add(redLight);

    // 3. Texture Loader & Main 3D Card Group
    const textureLoader = new THREE.TextureLoader();
    const deckGroup = new THREE.Group();
    scene.add(deckGroup);

    const cardMeshes: THREE.Mesh[] = [];
    const cylinderRadius = 6.4;
    const cardHeight = 3.3;
    const arcLength = 0.78; // ~45 deg arc per card for larger presentation

    // Create True Cylindrical Arc Mesh Geometry (Clean UV Orientation)
    const createCylindricalArcGeometry = () => {
      const geo = new THREE.CylinderGeometry(
        cylinderRadius,
        cylinderRadius,
        cardHeight,
        64,
        1,
        true,
        -arcLength / 2,
        arcLength
      );

      // Translate geometry so origin is at cylinder center
      geo.translate(0, 0, -cylinderRadius);
      geo.computeVertexNormals();
      return geo;
    };

    const sharedGeo = createCylindricalArcGeometry();

    // Build WebGL Curved Card Meshes
    apeItems.forEach((item, idx) => {
      const texture = textureLoader.load(item.image);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.15,
        metalness: 0.25,
        side: THREE.FrontSide, // Crisp right-side up rendering!
      });

      const mesh = new THREE.Mesh(sharedGeo, material);
      mesh.userData = { id: item.id, index: idx, title: item.title, link: item.link };

      deckGroup.add(mesh);
      cardMeshes.push(mesh);
    });

    // 4. Smooth WebGL Render & Transform Update (Zero Flickering / Zero Blinking!)
    const updateWebGLTransforms = () => {
      const currRot = rotationYRef.current;
      let nearestIdx = 0;
      let minDiff = Infinity;

      // Mouse Parallax Tilt Smoothing
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

      // ApeChain Slanted 3D Mouse Tilt
      deckGroup.rotation.x = 0.16 + mouseRef.current.y * 0.12;
      deckGroup.rotation.y = mouseRef.current.x * 0.18;

      cardMeshes.forEach((mesh, idx) => {
        const baseAngle = idx * angleStep;
        const angle = baseAngle + currRot;

        // Position along 3D cylinder drum
        const x = Math.sin(angle) * cylinderRadius;
        const z = Math.cos(angle) * cylinderRadius - cylinderRadius;

        mesh.position.set(x, 0, z);

        // Rotation around drum center
        mesh.rotation.y = angle;
        mesh.rotation.z = Math.sin(angle) * 0.04;

        // Calculate front active card
        let normAngle = angle % (Math.PI * 2);
        if (normAngle > Math.PI) normAngle -= Math.PI * 2;
        if (normAngle < -Math.PI) normAngle += Math.PI * 2;

        const diff = Math.abs(normAngle);
        if (diff < minDiff) {
          minDiff = diff;
          nearestIdx = idx;
        }

        // Depth scale
        const normZ = (z + cylinderRadius) / cylinderRadius;
        const scale = Math.max(0.65, 0.76 + normZ * 0.34);
        mesh.scale.set(scale, scale, scale);
      });

      // ONLY update React state when active card changes (Eliminates all flickering & blinking!)
      if (nearestIdx !== activeIndexRef.current) {
        activeIndexRef.current = nearestIdx;
        setActiveIndex(nearestIdx);
      }
    };

    // 5. Unified Smooth Physics Interpolation Loop
    let animId: number;
    const animate = () => {
      if (!isDraggingRef.current) {
        const diff = targetRotationYRef.current - rotationYRef.current;
        if (Math.abs(diff) > 0.0001) {
          rotationYRef.current += diff * 0.075; // Ultra-smooth inertia easing!
        }
      }

      updateWebGLTransforms();
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    // Mouse Parallax Handler
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      if (!mount) return;
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Smooth Pointer Drag Handlers
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastXRef.current;
      velocityRef.current = dx * 0.004;
      rotationYRef.current += velocityRef.current;
      targetRotationYRef.current = rotationYRef.current;
      lastXRef.current = e.clientX;
    };

    const handlePointerUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      const curr = rotationYRef.current + velocityRef.current * 6;
      const nearestIdx = Math.round(-curr / angleStep);
      targetRotationYRef.current = -nearestIdx * angleStep;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [angleStep]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    velocityRef.current = 0;
  };

  // Ultra-Smooth Target Rotation Adjustment (Zero Glitch Arrow Buttons & Thumbnails!)
  const selectCard = (index: number) => {
    // Calculate shortest angular rotation distance
    let targetAngle = -index * angleStep;

    // Normalize target angle relative to current rotation to prevent spinning 360 degrees
    const currentRot = rotationYRef.current;
    const diff = (targetAngle - currentRot) % (Math.PI * 2);
    let shortestDiff = diff;
    if (diff > Math.PI) shortestDiff -= Math.PI * 2;
    if (diff < -Math.PI) shortestDiff += Math.PI * 2;

    targetRotationYRef.current = currentRot + shortestDiff;
  };

  const activeItem = apeItems[activeIndex];

  return (
    <section
      id="spotlight-3d"
      className="relative z-10 w-full min-w-full px-4 sm:px-8 py-6 sm:py-10 text-[#D7E2EA] overflow-x-clip select-none bg-transparent"
    >
      {/* ApeChain Topographic Contour Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center overflow-hidden">
        <svg className="w-[900px] h-[900px] text-cyan-400/40" viewBox="0 0 1000 1000" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="500" cy="500" r="160" strokeDasharray="6 6" />
          <circle cx="500" cy="500" r="280" />
          <circle cx="500" cy="500" r="400" strokeDasharray="12 8" />
          <circle cx="500" cy="500" r="520" />
        </svg>
      </div>

      {/* Ambient Radial Glow - Sized smoothly to avoid box edge clipping */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-0 relative z-10">

        {/* THREE.JS WebGL Canvas Container */}
        <div
          ref={mountRef}
          className="relative w-full h-[400px] sm:h-[480px] md:h-[520px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={handlePointerDown}
        />

        {/* Floating Active Info Panel Below Canvas */}
        <div className="mt-2 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-[#0A0D18]/90 border border-cyan-500/30 p-3.5 sm:p-4 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.22)] max-w-xl w-full justify-between z-20">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 font-bold uppercase">
                {activeItem.tag}
              </span>
              <span className="text-xs font-mono text-white/60">{activeItem.category}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold uppercase text-white tracking-tight">
              {activeItem.title}
            </h3>
            <p className="text-xs text-[#D7E2EA]/75 font-light line-clamp-1 mt-0.5">
              {activeItem.description}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {activeItem.link !== '#' ? (
              <a
                href={activeItem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center gap-1.5 hover:scale-105"
              >
                Visit Site <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                disabled
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/10 text-white/40 font-mono text-xs uppercase flex items-center gap-1 cursor-not-allowed"
              >
                Preview <Sparkles className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Thumbnail Deck & Arrow Controls - Increased Size */}
        <div className="flex items-center gap-3 sm:gap-5 mt-4 relative z-20">
          <button
            onClick={() => selectCard((activeIndex - 1 + total) % total)}
            className="p-3.5 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all hover:scale-110 active:scale-95 shadow-lg flex-shrink-0"
            aria-label="Previous app"
          >
            <MoveLeft className="w-5 h-5" />
          </button>

          {/* Mini Thumbnail Indicators (Significantly Bigger Boxes) */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto py-2 px-1 max-w-full scrollbar-none">
            {apeItems.map((item, idx) => {
              const isSel = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => selectCard(idx)}
                  className={`relative group rounded-xl overflow-hidden w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 border-2 transition-all duration-300 flex-shrink-0 ${isSel
                    ? 'border-cyan-400 scale-110 shadow-[0_0_20px_rgba(6,182,212,0.7)] ring-2 ring-cyan-400/40 z-10'
                    : 'border-white/25 opacity-60 hover:opacity-100 hover:border-white/60 hover:scale-105'
                    }`}
                  title={item.title}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div
                    className={`absolute inset-0 bg-cyan-500/20 transition-opacity duration-300 ${isSel ? 'opacity-0' : 'opacity-40 group-hover:opacity-0'
                      }`}
                  />
                </button>
              );
            })}
          </div>

          <button
            onClick={() => selectCard((activeIndex + 1) % total)}
            className="p-3.5 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all hover:scale-110 active:scale-95 shadow-lg flex-shrink-0"
            aria-label="Next app"
          >
            <MoveRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Spotlight3DSection;
