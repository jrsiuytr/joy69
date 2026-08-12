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

    // 1. Falling Soft Embers (Reduced count on Mobile for performance & clean visuals)
    const emberCount = isMobile ? 8 : 40;
    const embers: { x: number; y: number; vy: number; vx: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < emberCount; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vy: 1.2 + Math.random() * 2.2,
        vx: (Math.random() - 0.4) * 0.8,
        size: isMobile ? 1.0 + Math.random() * 1.2 : 1.2 + Math.random() * 2.0,
        alpha: 0.3 + Math.random() * 0.5,
      });
    }

    let time = 0;

    // 2. Main Render Loop (60 FPS)
    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse position interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // A. Deep Dark Atmosphere Background
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.4,
        100,
        width * 0.5,
        height * 0.5,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, 'rgba(10, 16, 32, 0.4)');
      bgGrad.addColorStop(0.6, 'rgba(8, 12, 22, 0.7)');
      bgGrad.addColorStop(1, 'rgba(4, 6, 12, 0.95)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // B. ELEGANT SPIDER-MAN WEB MESH (Radiating cleanly behind Hero text)
      const centerX = width * 0.48;
      const centerY = height * 0.42;
      const numRays = isMobile ? 10 : 16;
      const numRings = isMobile ? 4 : 7;
      const maxRadius = Math.max(width, height) * 0.65;

      ctx.save();
      // Fade web mesh slightly as user scrolls down into Venom territory
      const webAlpha = Math.max(0.15, 0.45 - scrollProgress * 0.35);

      // Mouse displacement vector
      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const mouseDist = Math.sqrt(dx * dx + dy * dy);
      const mousePushX = mouseDist < 300 ? (dx / mouseDist) * 20 : 0;
      const mousePushY = mouseDist < 300 ? (dy / mouseDist) * 20 : 0;

      // 1. Draw Radial Web Rays
      for (let i = 0; i < numRays; i++) {
        const angle = (i / numRays) * Math.PI * 2 + Math.sin(time * 0.3) * 0.02;
        const rayEndX = centerX + Math.cos(angle) * maxRadius + mousePushX;
        const rayEndY = centerY + Math.sin(angle) * maxRadius + mousePushY;

        ctx.strokeStyle = i % 2 === 0 ? `rgba(239, 68, 68, ${webAlpha})` : `rgba(56, 189, 248, ${webAlpha})`;
        ctx.lineWidth = 1.2;
        if (!isMobile) {
          ctx.shadowColor = i % 2 === 0 ? '#ef4444' : '#38bdf8';
          ctx.shadowBlur = 8;
        }

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(rayEndX, rayEndY);
        ctx.stroke();
      }

      // 2. Draw Concentric Curved Web Rings (Sagging Web Strings)
      for (let r = 1; r <= numRings; r++) {
        const radius = (r / numRings) * maxRadius;
        const sag = 15 + Math.sin(time * 1.5 + r) * 4;

        ctx.strokeStyle = r % 2 === 0 ? `rgba(239, 68, 68, ${webAlpha * 0.9})` : `rgba(56, 189, 248, ${webAlpha * 0.9})`;
        ctx.lineWidth = 1.4;

        ctx.beginPath();
        for (let i = 0; i <= numRays; i++) {
          const angle1 = (i / numRays) * Math.PI * 2;
          const angle2 = ((i + 1) / numRays) * Math.PI * 2;

          const p1x = centerX + Math.cos(angle1) * radius;
          const p1y = centerY + Math.sin(angle1) * radius;

          const p2x = centerX + Math.cos(angle2) * radius;
          const p2y = centerY + Math.sin(angle2) * radius;

          // Sagging quadratic control point
          const midAngle = (angle1 + angle2) / 2;
          const cpX = centerX + Math.cos(midAngle) * (radius - sag);
          const cpY = centerY + Math.sin(midAngle) * (radius - sag);

          if (i === 0) ctx.moveTo(p1x, p1y);
          ctx.quadraticCurveTo(cpX, cpY, p2x, p2y);
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.restore();

      // C. LIQUID VENOM SYMBIOTE TENDRIL VINES (Creeping in organically from edges)
      const symbioteAlpha = Math.min(1, Math.max(0, scrollProgress * 1.4));
      if (symbioteAlpha > 0.05) {
        ctx.save();
        ctx.globalAlpha = symbioteAlpha;

        const numTendrils = isMobile ? 4 : 10;
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
          ctx.strokeStyle = t % 2 === 0 ? 'rgba(37, 99, 235, 0.5)' : 'rgba(220, 38, 38, 0.5)';
          if (!isMobile) {
            ctx.shadowColor = t % 2 === 0 ? '#0284c7' : '#ef4444';
            ctx.shadowBlur = 14;
          }
          ctx.lineWidth = isMobile ? 8 : 14;
          ctx.lineCap = 'round';

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.quadraticCurveTo(cpX, cpY, endX, endY);
          ctx.stroke();

          // Inner Viscous Black Symbiote Core
          ctx.strokeStyle = '#050711';
          ctx.shadowBlur = 0;
          ctx.lineWidth = isMobile ? 5 : 10;
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
        if (!isMobile) {
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 6;
        }

        ctx.beginPath();
        ctx.moveTo(ember.x, ember.y);
        ctx.lineTo(ember.x - ember.vx * 3, ember.y - 16);
        ctx.stroke();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
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
