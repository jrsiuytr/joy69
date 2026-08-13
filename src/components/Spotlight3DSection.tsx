import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ExternalLink, Flame, Sparkles } from 'lucide-react';
import { WaterButton } from './WaterButton';
import utexo1Img from '../images/utexo1.webp';
import opensea from '../images/opensea.webp';
import debank from '../images/debank.webp';
import arcn from '../images/arc.webp';
import arindam from '../images/arindam.webp';
import base from '../images/base.webp';
import relay from '../images/relay.webp';

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
    title: 'UTEXO',
    category: 'stablecoin payment infrastructure',
    tag: 'BITCOIN NATIVE',
    description: 'Bitcoin-native execution and settlement layer',
    image: utexo1Img,
    link: 'https://utexo.com/',
  },
  {
    id: 'relay',
    title: 'RELAY LINK',
    category: 'SWAP & BRIDGE',
    tag: 'DEFI',
    description: 'LOW-COST SWAPS & BRIDGES ACROSS CHAINS',
    image: relay,
    link: 'https://relay.link/',
  },
  {
    id: 'debank',
    title: 'DEBANK',
    category: 'TRACKER',
    tag: 'WALLETS',
    description: 'WEB3 PORTFOLIO TRACKER & REAL-TIME ANALYTICS',
    image: debank,
    link: 'https://debank.com/',
  },
  {
    id: 'opensea',
    title: 'OPENSEA',
    category: 'NFT MARKETPLACE',
    tag: 'NFTs',
    description: 'PREMIER WEB3 NFT MARKETPLACE & TRADING HUB',
    image: opensea,
    link: 'https://opensea.io/',
  },
  {
    id: 'arc',
    title: 'ARC NETWORK',
    category: 'BLOCKCHAIN',
    tag: 'LAYER-1',
    description: 'BUILD REAL-WORLD FINANCE ONCHAIN',
    image: arcn,
    link: 'https://www.arc.io/',
  },
  {
    id: 'arindam',
    title: 'ARINDAM DEV',
    category: 'CREATOR',
    tag: 'DEVELOPER',
    description: '3D WEB EXPERIENCES & FRONTEND ARCHITECTURE',
    image: arindam,
    link: 'https://www.mrarindam.xyz',
  },
  {
    id: 'base',
    title: 'BASE NETWORK',
    category: 'LAYER 2',
    tag: 'ECOSYSTEM',
    description: 'THE BEST LAYER-2 CHAIN FOR WEB3 APPLICATIONS',
    image: base,
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
  const userHasInteractedRef = useRef(false);
  const lastInteractionTimeRef = useRef(Date.now());
  const isVisibleRef = useRef(false);

  // Automatic Smooth Card Sliding (Waits full 4.5 seconds after last user interaction/swipe while section is visible)
  useEffect(() => {
    const autoSlideTimer = setInterval(() => {
      if (
        isVisibleRef.current &&
        !isDraggingRef.current &&
        Date.now() - lastInteractionTimeRef.current >= 4500
      ) {
        targetRotationYRef.current -= angleStep;
        lastInteractionTimeRef.current = Date.now();
      }
    }, 1000);

    return () => clearInterval(autoSlideTimer);
  }, [angleStep]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;

    const cylinderRadius = isMobile ? 5.2 : isTablet ? 6.2 : 7.6;
    const cardHeight = isMobile ? 2.5 : isTablet ? 3.6 : 4.4;
    const cameraZ = isMobile ? 8.8 : isTablet ? 8.2 : 8.8;
    const cameraY = isMobile ? 0.35 : 0.1;
    const cameraX = 0; // Perfectly centered camera alignment

    // 1. WebGL Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(isMobile ? 42 : 35, width / height, 0.1, 100);
    camera.position.set(cameraX, cameraY, cameraZ);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    // 2. Clean Natural Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight.position.set(0, 8, 10);
    scene.add(dirLight);

    // 3. Texture Loader & Main 3D Card Group
    const textureLoader = new THREE.TextureLoader();
    const deckGroup = new THREE.Group();
    scene.add(deckGroup);

    const cardMeshes: THREE.Mesh[] = [];
    // Arc length per card mesh (~2.3° tight gap / half of previous gap)
    const arcLength = isMobile ? 0.865 : 0.856;

    // Create True Cylindrical Arc Mesh Geometry
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
      texture.generateMipmaps = false;

      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 1.0,
        metalness: 0.0,
        side: THREE.FrontSide,
      });

      const mesh = new THREE.Mesh(sharedGeo, material);
      mesh.userData = { id: item.id, index: idx, title: item.title, link: item.link };

      deckGroup.add(mesh);
      cardMeshes.push(mesh);
    });

    // 4. Smooth WebGL Render & Transform Update
    const updateWebGLTransforms = () => {
      const currRot = rotationYRef.current;
      let nearestIdx = 0;
      let minDiff = Infinity;

      // Mouse Parallax Tilt Easing
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

      // 3D Slanted Tilt
      deckGroup.rotation.x = 0.12 + mouseRef.current.y * 0.08;
      deckGroup.rotation.y = mouseRef.current.x * 0.12;

      cardMeshes.forEach((mesh, idx) => {
        const baseAngle = idx * angleStep;
        const angle = baseAngle + currRot;

        // Position along 3D cylinder drum
        const x = Math.sin(angle) * cylinderRadius;
        const z = Math.cos(angle) * cylinderRadius - cylinderRadius;

        mesh.position.set(x, 0, z);

        // Rotation around drum center
        mesh.rotation.y = angle;
        mesh.rotation.z = Math.sin(angle) * 0.03;

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
        const minScale = isMobile ? 0.74 : 0.70;
        const maxScaleBonus = isMobile ? 0.20 : 0.24;
        const scale = Math.max(minScale, 0.75 + normZ * maxScaleBonus);
        mesh.scale.set(scale, scale, scale);
      });

      // ONLY update React state when active card changes
      if (nearestIdx !== activeIndexRef.current) {
        activeIndexRef.current = nearestIdx;
        setActiveIndex(nearestIdx);
      }
    };

    // 5. Unified Smooth Physics Interpolation Loop with Viewport Visibility Pause
    let animId: number;
    let isVisible = true;

    const animate = () => {
      if (!isVisible) return;

      if (!isDraggingRef.current) {
        const diff = targetRotationYRef.current - rotationYRef.current;
        if (Math.abs(diff) > 0.0001) {
          rotationYRef.current += diff * 0.08;
        }
      }

      updateWebGLTransforms();
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wasVisible = isVisibleRef.current;
          isVisibleRef.current = entry.isIntersecting;
          isVisible = entry.isIntersecting;
          if (entry.isIntersecting) {
            lastInteractionTimeRef.current = Date.now();
            if (!wasVisible) {
              const nearestIdx = activeIndexRef.current;
              targetRotationYRef.current = -nearestIdx * angleStep;
              rotationYRef.current = targetRotationYRef.current;
            }
            cancelAnimationFrame(animId);
            animate();
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(mount);
    animate();

    // Mouse Parallax Handler
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) return;
      targetMouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      if (!mount) return;
      width = mount.clientWidth;
      height = mount.clientHeight;

      const mobile = window.innerWidth < 640;
      const tablet = window.innerWidth >= 640 && window.innerWidth < 1024;

      camera.aspect = width / height;
      camera.fov = mobile ? 42 : 35;
      camera.position.z = mobile ? 8.8 : tablet ? 8.2 : 8.8;
      camera.position.y = mobile ? 0.35 : 0.1;
      camera.position.x = 0;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [angleStep]);

  // Smooth Pointer Drag Handlers
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastXRef.current;
      velocityRef.current = dx * 0.0035;
      rotationYRef.current += velocityRef.current;
      targetRotationYRef.current = rotationYRef.current;
      lastXRef.current = e.clientX;
    };

    const handlePointerUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      lastInteractionTimeRef.current = Date.now();
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
    userHasInteractedRef.current = true;
    isDraggingRef.current = true;
    lastInteractionTimeRef.current = Date.now();
    lastXRef.current = e.clientX;
    velocityRef.current = 0;
  };

  const selectCard = (index: number) => {
    userHasInteractedRef.current = true;
    lastInteractionTimeRef.current = Date.now();
    let targetAngle = -index * angleStep;
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
      className="relative z-10 w-full min-w-full overflow-hidden select-none bg-transparent py-4 sm:py-8"
    >
      {/* 3D WebGL Canvas Container */}
      <div className="relative w-full h-[340px] sm:h-[580px] lg:h-[680px] flex items-center justify-center">

        {/* THREE.JS 3D WebGL Canvas (Full Width) */}
        <div
          ref={mountRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none z-10"
          onPointerDown={handlePointerDown}
        />



        {/* DESKTOP OVERLAYS (hidden on mobile, visible on sm and up) */}
        <div className="hidden sm:flex absolute bottom-8 left-10 lg:left-16 z-20 max-w-xl pointer-events-auto flex-col items-start">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 text-white font-black text-[11px] font-mono flex items-center gap-1 shadow-[0_0_12px_rgba(239,68,68,0.6)] uppercase">
              <Flame className="w-3.5 h-3.5 fill-white" /> {activeItem.tag}
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 font-bold uppercase tracking-widest">
              {activeItem.category}
            </span>
          </div>

          <h2 className="hero-heading text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] leading-none my-1 font-['Kanit',sans-serif]">
            {activeItem.title}
          </h2>

          <p className="text-xs font-medium uppercase tracking-wider text-cyan-200/80 drop-shadow-md mb-3 max-w-md">
            {activeItem.description}
          </p>

          {activeItem.link !== '#' ? (
            <WaterButton
              href={activeItem.link}
              target="_blank"
              rel="noopener noreferrer"
              waterColor="#0052CC"
              textColor="#FFFFFF"
              paddingX={18}
              paddingY={7}
              rounded={50}
              waterAmount={60}
              glass={{ tint: 'rgba(0, 0, 0, 0.3)', blur: 20, frost: 20 }}
              borderOptions={{ color: 'rgba(0, 102, 255, 0.8)', stroke: 1.5 }}
              font={{ fontFamily: 'Kanit, sans-serif', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em' }}
            >
              LAUNCH <ExternalLink className="w-3.5 h-3.5" />
            </WaterButton>
          ) : (
            <button
              disabled
              className="px-8 py-3 rounded-full bg-white/20 text-white/50 font-mono text-xs uppercase cursor-not-allowed flex items-center gap-1"
            >
              PREVIEW <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* DESKTOP THUMBNAILS (hidden on mobile, visible on sm and up) */}
        <div className="hidden sm:flex absolute bottom-8 right-10 lg:right-16 z-20 flex-col items-end pointer-events-auto">
          <div className="flex items-center gap-2 bg-black/70 backdrop-blur-xl p-1.5 rounded-xl border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            {apeItems.map((item, idx) => {
              const isSel = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => selectCard(idx)}
                  className={`relative group rounded-lg overflow-hidden w-11 h-11 border-2 transition-all duration-300 flex-shrink-0 ${isSel
                    ? 'border-cyan-400 scale-110 shadow-[0_0_15px_rgba(6,182,212,0.8)] ring-2 ring-cyan-400/50'
                    : 'border-white/20 opacity-50 hover:opacity-100 hover:border-white/60 hover:scale-105'
                    }`}
                  title={item.title}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 bg-cyan-500/20 transition-opacity ${isSel ? 'opacity-0' : 'opacity-40 group-hover:opacity-0'
                      }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* DEDICATED MOBILE CONTENT CONTAINER (only visible on mobile screens < 640px) */}
      <div className="block sm:hidden px-4 mt-2 relative z-20">
        {/* Info Box */}
        <div className="bg-[#0A0D1A]/95 border border-cyan-500/30 p-4 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.25)] flex flex-col gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 text-white font-black text-[10px] font-mono flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.6)] uppercase">
              <Flame className="w-3 h-3 fill-white" /> {activeItem.tag}
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 font-bold uppercase tracking-widest">
              {activeItem.category}
            </span>
          </div>

          <h2 className="hero-heading text-2xl font-black uppercase tracking-tighter leading-none font-['Kanit',sans-serif]">
            {activeItem.title}
          </h2>

          <p className="text-[11px] font-medium uppercase tracking-wider text-cyan-200/80 line-clamp-2">
            {activeItem.description}
          </p>

          {activeItem.link !== '#' ? (
            <WaterButton
              href={activeItem.link}
              target="_blank"
              rel="noopener noreferrer"
              waterColor="#0052CC"
              textColor="#FFFFFF"
              paddingX={16}
              paddingY={6}
              rounded={50}
              waterAmount={60}
              glass={{ tint: 'rgba(0, 0, 0, 0.3)', blur: 20, frost: 20 }}
              borderOptions={{ color: 'rgba(0, 102, 255, 0.8)', stroke: 1.5 }}
              font={{ fontFamily: 'Kanit, sans-serif', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em' }}
              className="w-full justify-center mt-1"
            >
              LAUNCH <ExternalLink className="w-3 h-3" />
            </WaterButton>
          ) : (
            <button
              disabled
              className="w-full py-2.5 rounded-full bg-white/20 text-white/50 font-mono text-xs uppercase cursor-not-allowed flex items-center justify-center gap-1 mt-1"
            >
              PREVIEW <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dedicated Mobile Thumbnail Selector Deck */}
        <div className="mt-3 flex items-center gap-2.5 overflow-x-auto py-2.5 px-3 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl scrollbar-none">
          {apeItems.map((item, idx) => {
            const isSel = idx === activeIndex;
            return (
              <button
                key={`mobile-thumb-${item.id}`}
                onClick={() => selectCard(idx)}
                className={`relative group rounded-xl overflow-hidden w-12 h-12 border-2 transition-all duration-300 flex-shrink-0 ${isSel
                  ? 'border-cyan-400 scale-105 shadow-[0_0_15px_rgba(6,182,212,0.8)] ring-2 ring-cyan-400/50 z-10'
                  : 'border-white/20 opacity-50 active:opacity-100'
                  }`}
                title={item.title}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute inset-0 bg-cyan-500/20 transition-opacity ${isSel ? 'opacity-0' : 'opacity-40'
                    }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Spotlight3DSection;
