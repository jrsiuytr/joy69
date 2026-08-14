import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import symbioteSpiderImg from '../images/symbiote_spider.webp';

interface SpiderWebLoaderProps {
  onComplete?: () => void;
}

export const SpiderWebLoader: React.FC<SpiderWebLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'zooming' | 'complete'>('loading');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Disable browser automatic scroll restoration to avoid starting in middle of page on refresh/load
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Always reset scroll position to top on mount
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

    // Lock body scroll during initial load
    document.body.style.overflow = 'hidden';

    // Smooth loading progress 0 -> 100%
    const duration = 700;
    const startTime = performance.now();

    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const progressFraction = Math.min(1, elapsed / duration);
      // Smooth ease-out quad curve for natural feel
      const easedProgress = Math.round((1 - Math.pow(1 - progressFraction, 2)) * 100);
      setProgress(easedProgress);

      if (progressFraction < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setTimeout(() => {
          setPhase('zooming');
          // Wait for full zoom & fade-out animation to complete seamlessly
          setTimeout(() => {
            setPhase('complete');
            document.body.style.overflow = '';
            if (onComplete) onComplete();
          }, 650);
        }, 100);
      }
    };

    const animFrame = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animFrame);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  // Real-time Physics Canvas Simulation for Flexible Moving Spider Web
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const centerX = width / 2;
    const centerY = height / 2;
    const numRays = 18;
    const numRings = 7;
    const maxRadius = Math.min(width, height) * 0.44;

    // Interactive mouse state
    let targetMouseX = centerX;
    let targetMouseY = centerY;
    let mouseX = centerX;
    let mouseY = centerY;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handlePointerMove);

    let time = 0;

    const render = () => {
      time += 0.025;
      ctx.clearRect(0, 0, width, height);

      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;



      // Build Dynamic Flexible Web Node Mesh
      const nodeGrid: { x: number; y: number; originX: number; originY: number }[][] = [];

      for (let r = 0; r <= numRings; r++) {
        const ringNodes: { x: number; y: number; originX: number; originY: number }[] = [];
        const ringRadius = (r / numRings) * maxRadius;

        for (let i = 0; i < numRays; i++) {
          const baseAngle = (i / numRays) * Math.PI * 2;
          // Organic natural imperfection angle shift
          const angle = baseAngle + Math.sin(time * 0.5 + i) * 0.015;

          const origX = centerX + Math.cos(angle) * ringRadius;
          const origY = centerY + Math.sin(angle) * ringRadius;

          // Physics displacement (Wind sway + Elastic spring response to mouse)
          const swayX = Math.sin(time * 1.2 + r * 0.8 + i) * (2 + r * 0.8);
          const swayY = Math.cos(time * 1.4 + r * 0.6 + i) * (2 + r * 0.8);

          // Distance to mouse force calculation
          const nodeDx = origX - mouseX;
          const nodeDy = origY - mouseY;
          const nodeDist = Math.sqrt(nodeDx * nodeDx + nodeDy * nodeDy);
          const pushFactor = Math.max(0, (180 - nodeDist) / 180);
          const pushX = (nodeDx / (nodeDist || 1)) * pushFactor * 24;
          const pushY = (nodeDy / (nodeDist || 1)) * pushFactor * 24;

          ringNodes.push({
            originX: origX,
            originY: origY,
            x: origX + swayX + pushX,
            y: origY + swayY + pushY,
          });
        }
        nodeGrid.push(ringNodes);
      }

      // 1. Draw Radial Elastic Anchor Rays
      ctx.lineWidth = 1.4;
      for (let i = 0; i < numRays; i++) {
        const outerNode = nodeGrid[numRings][i];
        const innerNode = nodeGrid[0][i];

        const rayGrad = ctx.createLinearGradient(innerNode.x, innerNode.y, outerNode.x, outerNode.y);
        rayGrad.addColorStop(0, '#FFFFFF');
        rayGrad.addColorStop(0.5, i % 2 === 0 ? '#FF2E38' : '#38BDF8');
        rayGrad.addColorStop(1, 'rgba(255, 255, 255, 0.4)');

        ctx.strokeStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(innerNode.x, innerNode.y);

        for (let r = 1; r <= numRings; r++) {
          const curr = nodeGrid[r][i];
          ctx.lineTo(curr.x, curr.y);
        }
        ctx.stroke();
      }

      // 2. Draw Flexible Sagging Catenary Web Rings
      for (let r = 1; r <= numRings; r++) {
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = r % 2 === 0 ? 'rgba(255, 255, 255, 0.85)' : 'rgba(224, 231, 255, 0.7)';

        ctx.beginPath();
        for (let i = 0; i < numRays; i++) {
          const p1 = nodeGrid[r][i];
          const nextIdx = (i + 1) % numRays;
          const p2 = nodeGrid[r][nextIdx];

          // Catenary sag calculation between adjacent radial rays
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;

          // Pull sag toward web center elastically
          const centerVectorX = centerX - midX;
          const centerVectorY = centerY - midY;
          const sagAmount = 0.12 + Math.sin(time * 2 + r + i) * 0.03;

          const cpX = midX + centerVectorX * sagAmount;
          const cpY = midY + centerVectorY * sagAmount;

          if (i === 0) ctx.moveTo(p1.x, p1.y);
          ctx.quadraticCurveTo(cpX, cpY, p2.x, p2.y);
        }
        ctx.stroke();
      }

      // 3. Draw Glistening Dewdrop Nodes at Intersections
      for (let r = 2; r <= numRings; r += 2) {
        for (let i = 0; i < numRays; i += 3) {
          const node = nodeGrid[r][i];
          const glintAlpha = 0.4 + Math.sin(time * 3 + r * 2 + i) * 0.4;

          ctx.fillStyle = `rgba(255, 255, 255, ${glintAlpha})`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
    };
  }, []);

  if (phase === 'complete') return null;

  return (
    <AnimatePresence>
      <motion.div
        key="spider-web-loader"
        initial={{ opacity: 1 }}
        animate={{
          opacity: phase === 'zooming' ? [1, 0.85, 0] : 1,
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed inset-0 z-[9999] bg-[#04050A] flex flex-col items-center justify-center overflow-hidden select-none"
      >
        {/* Deep ambient background */}
        <div className="absolute inset-0 bg-[#04050A] pointer-events-none" />

        {/* 3D Spider Net Container with perspective zoom effect */}
        <motion.div
          animate={
            phase === 'zooming'
              ? {
                  scale: [1, 2.4, 6.5],
                  rotateZ: [0, -3, 6],
                  opacity: [1, 0.85, 0],
                }
              : {
                  scale: [0.97, 1.03, 0.97],
                }
          }
          transition={
            phase === 'zooming'
              ? { duration: 0.62, ease: [0.25, 0.1, 0.25, 1] }
              : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
          }
          className="relative w-[340px] sm:w-[480px] md:w-[600px] h-[340px] sm:h-[480px] md:h-[600px] flex items-center justify-center origin-center will-change-transform"
        >
          {/* Realistic Physics Canvas Spider Web */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto cursor-pointer" />

          {/* Central 3D Spider-Man Hero Emblem */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <motion.div
              animate={{
                y: [-6, 6, -6],
                scale: [0.98, 1.05, 0.98],
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative flex items-center justify-center pointer-events-none"
            >
              {/* Glowing Silver-Chrome Backlight Aura Disc */}
              <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-slate-400/50 via-cyan-500/40 to-white/60 blur-2xl animate-pulse" />

              {/* Metallic Silver Chrome Symbiote Spider Emblem */}
              <img
                src={symbioteSpiderImg}
                alt="Silver Symbiote Spider"
                className="w-28 sm:w-40 md:w-48 h-auto object-contain drop-shadow-[0_0_35px_rgba(255,255,255,0.95)] filter brightness-125 contrast-125 relative z-10"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Loading Progress Percentage Counter */}
        <motion.div
          animate={phase === 'zooming' ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 mt-4 sm:mt-8 flex flex-col items-center gap-2"
        >
          <div className="flex items-baseline gap-1 font-black tracking-tight text-white font-mono">
            <span className="text-4xl sm:text-6xl hero-heading">{progress}</span>
            <span className="text-xl sm:text-2xl text-red-500">%</span>
          </div>

          <div className="w-48 sm:w-64 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/10 p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.9)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          <p className="text-xs sm:text-sm uppercase tracking-widest text-[#D7E2EA]/70 font-mono mt-1 animate-pulse">
            WEAVING FLEXIBLE SPIDER NET...
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SpiderWebLoader;
