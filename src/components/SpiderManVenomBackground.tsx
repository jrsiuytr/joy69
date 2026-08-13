import React, { useEffect, useRef } from 'react';

export const SpiderManVenomBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let scrollProgress = 0;

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = Math.min(1, Math.max(0, window.scrollY / (maxScroll || 1)));
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    handleScroll();

    const isMobile = window.innerWidth < 640;

    // 1. Falling Soft Embers (Lightweight count for ultra-smooth performance)
    const emberCount = isMobile ? 1 : 4;
    const embers: { x: number; y: number; vy: number; vx: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < emberCount; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vy: 1.2 + Math.random() * 1.8,
        vx: (Math.random() - 0.4) * 0.6,
        size: isMobile ? 1.0 : 1.4,
        alpha: 0.3 + Math.random() * 0.4,
      });
    }

    let time = 0;

    // 2. Main Render Loop (60 FPS Lightweight)
    const render = () => {
      time += 0.015;
      ctx.fillStyle = '#05060B';
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse position interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // B. FLEXIBLE SPIDER-MAN WEB MESH
      const centerX = width * 0.48;
      const centerY = height * 0.42;
      const numRays = isMobile ? 8 : 10;
      const numRings = isMobile ? 3 : 4;
      const maxRadius = Math.max(width, height) * 0.6;

      ctx.save();
      // Fade web mesh slightly as user scrolls down into Venom territory
      const webAlpha = Math.max(0.15, 0.45 - scrollProgress * 0.35);

      // Build Flexible Physics Node Mesh Grid
      const bgNodeGrid: { x: number; y: number }[][] = [];
      for (let r = 0; r <= numRings; r++) {
        const ringNodes: { x: number; y: number }[] = [];
        const ringRadius = (r / numRings) * maxRadius;

        for (let i = 0; i < numRays; i++) {
          const baseAngle = (i / numRays) * Math.PI * 2;
          const angle = baseAngle + Math.sin(time * 0.4 + i) * 0.015;

          const origX = centerX + Math.cos(angle) * ringRadius;
          const origY = centerY + Math.sin(angle) * ringRadius;

          // Realistic elastic swaying physics (Wind oscillation + Mouse push)
          const swayX = Math.sin(time * 1.1 + r * 0.7 + i) * (2.5 + r * 0.9);
          const swayY = Math.cos(time * 1.3 + r * 0.5 + i) * (2.5 + r * 0.9);

          const nodeDx = origX - mouseX;
          const nodeDy = origY - mouseY;
          const nodeDist = Math.sqrt(nodeDx * nodeDx + nodeDy * nodeDy);
          const pushFactor = Math.max(0, (220 - nodeDist) / 220);
          const pushX = (nodeDx / (nodeDist || 1)) * pushFactor * 30;
          const pushY = (nodeDy / (nodeDist || 1)) * pushFactor * 30;

          ringNodes.push({
            x: origX + swayX + pushX,
            y: origY + swayY + pushY,
          });
        }
        bgNodeGrid.push(ringNodes);
      }

      // 1. Draw Radial Elastic Web Rays
      ctx.lineWidth = 1.3;
      for (let i = 0; i < numRays; i++) {
        const rayGrad = ctx.createLinearGradient(
          bgNodeGrid[0][i].x,
          bgNodeGrid[0][i].y,
          bgNodeGrid[numRings][i].x,
          bgNodeGrid[numRings][i].y
        );
        rayGrad.addColorStop(0, `rgba(255, 255, 255, ${webAlpha * 1.2})`);
        rayGrad.addColorStop(0.5, i % 2 === 0 ? `rgba(239, 68, 68, ${webAlpha})` : `rgba(56, 189, 248, ${webAlpha})`);
        rayGrad.addColorStop(1, `rgba(255, 255, 255, ${webAlpha * 0.3})`);

        ctx.strokeStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(bgNodeGrid[0][i].x, bgNodeGrid[0][i].y);

        for (let r = 1; r <= numRings; r++) {
          ctx.lineTo(bgNodeGrid[r][i].x, bgNodeGrid[r][i].y);
        }
        ctx.stroke();
      }

      // 2. Draw Flexible Sagging Catenary Web Rings
      for (let r = 1; r <= numRings; r++) {
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = r % 2 === 0 ? `rgba(239, 68, 68, ${webAlpha * 0.85})` : `rgba(56, 189, 248, ${webAlpha * 0.85})`;

        ctx.beginPath();
        for (let i = 0; i < numRays; i++) {
          const p1 = bgNodeGrid[r][i];
          const nextIdx = (i + 1) % numRays;
          const p2 = bgNodeGrid[r][nextIdx];

          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;

          const centerVectorX = centerX - midX;
          const centerVectorY = centerY - midY;
          const sagAmount = 0.14 + Math.sin(time * 1.8 + r + i) * 0.04;

          const cpX = midX + centerVectorX * sagAmount;
          const cpY = midY + centerVectorY * sagAmount;

          if (i === 0) ctx.moveTo(p1.x, p1.y);
          ctx.quadraticCurveTo(cpX, cpY, p2.x, p2.y);
        }
        ctx.stroke();
      }

      // 3. Draw Glistening Dewdrop Silk Nodes
      for (let r = 2; r <= numRings; r += 2) {
        for (let i = 0; i < numRays; i += 3) {
          const node = bgNodeGrid[r][i];
          const glintAlpha = (0.3 + Math.sin(time * 2.5 + r * 2 + i) * 0.3) * webAlpha;

          ctx.fillStyle = `rgba(255, 255, 255, ${glintAlpha})`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 2.0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      // C. LIQUID VENOM SYMBIOTE TENDRIL VINES (Creeping in organically from edges)
      const symbioteAlpha = Math.min(1, Math.max(0, scrollProgress * 1.4));
      if (symbioteAlpha > 0.05) {
        ctx.save();
        ctx.globalAlpha = symbioteAlpha;

        const numTendrils = isMobile ? 4 : 8;
        for (let t = 0; t < numTendrils; t++) {
          const isTop = t % 2 === 0;
          const startX = (t / numTendrils) * width;
          const startY = isTop ? 0 : height;

          const reach = (200 + Math.sin(time * 1.2 + t) * 60) * (0.5 + scrollProgress);
          const endX = startX + (Math.sin(time + t) * 80);
          const endY = isTop ? startY + reach : startY - reach;

          const cpX = (startX + endX) / 2 + Math.cos(time * 1.5 + t) * 50;
          const cpY = (startY + endY) / 2 + Math.sin(time * 1.5 + t) * 50;

          // Outer Deep Blue/Red Neon Edge Glow
          ctx.strokeStyle = t % 2 === 0 ? 'rgba(37, 99, 235, 0.4)' : 'rgba(220, 38, 38, 0.4)';
          ctx.lineWidth = isMobile ? 8 : 12;
          ctx.lineCap = 'round';

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.quadraticCurveTo(cpX, cpY, endX, endY);
          ctx.stroke();

          // Inner Viscous Black Symbiote Core
          ctx.strokeStyle = '#050711';
          ctx.lineWidth = isMobile ? 4 : 8;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.quadraticCurveTo(cpX, cpY, endX, endY);
          ctx.stroke();
        }

        ctx.restore();
      }

      // D. FALLING DEEP RED EMBERS (From Venom Poster Reference)
      embers.forEach((ember) => {
        ember.x += ember.vx;
        ember.y += ember.vy;

        if (ember.y > height) {
          ember.y = -20;
          ember.x = Math.random() * width;
        }

        const streakGrad = ctx.createLinearGradient(
          ember.x,
          ember.y,
          ember.x - ember.vx * 3,
          ember.y - 16
        );
        streakGrad.addColorStop(0, `rgba(254, 240, 138, ${ember.alpha})`);
        streakGrad.addColorStop(0.5, `rgba(239, 68, 68, ${ember.alpha * 0.8})`);
        streakGrad.addColorStop(1, `rgba(153, 27, 27, 0)`);

        ctx.strokeStyle = streakGrad;
        ctx.lineWidth = ember.size;

        ctx.beginPath();
        ctx.moveTo(ember.x, ember.y);
        ctx.lineTo(ember.x - ember.vx * 3, ember.y - 16);
        ctx.stroke();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
    />
  );
};

export default SpiderManVenomBackground;
