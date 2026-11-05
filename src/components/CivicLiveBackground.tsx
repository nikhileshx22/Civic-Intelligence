import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  isBeacon?: boolean;
}

interface CivicLiveBackgroundProps {
  className?: string;
  theme?: 'rich-dark' | 'rich-light';
  isGodMode?: boolean;
}

export const CivicLiveBackground: React.FC<CivicLiveBackgroundProps> = ({
  className = '',
  theme = 'rich-dark',
  isGodMode = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Create realistic civic mesh nodes representing Visakhapatnam wards
    const particles: Particle[] = [];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 55);

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        const isBeacon = i % 7 === 0;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: isBeacon ? (isGodMode ? 3.5 : 2.5) : Math.random() * 1.5 + 0.8,
          alpha: Math.random() * 0.4 + 0.2,
          baseAlpha: Math.random() * 0.35 + 0.15,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulsePhase: Math.random() * Math.PI * 2,
          isBeacon,
        });
      }
    }

    initParticles();

    // Subtle radar sweep angle
    let radarAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Radar rotation
      radarAngle += isGodMode ? 0.008 : 0.004;
      if (radarAngle > Math.PI * 2) radarAngle = 0;

      // Draw subtle background radial gradient
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35,
        100,
        width * 0.5,
        height * 0.5,
        Math.max(width, height)
      );

      if (isGodMode) {
        // Luxury deep obsidian with emerald-gold God Mode accents
        bgGrad.addColorStop(0, '#0a1420');
        bgGrad.addColorStop(0.5, '#070b13');
        bgGrad.addColorStop(1, '#030509');
      } else {
        // Classic deep civic intelligence palette
        bgGrad.addColorStop(0, '#0c1626');
        bgGrad.addColorStop(0.5, '#070d17');
        bgGrad.addColorStop(1, '#04070d');
      }

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw faint geometric telemetry grid
      ctx.strokeStyle = isGodMode ? 'rgba(56, 189, 248, 0.04)' : 'rgba(148, 163, 184, 0.035)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      const startX = 0;
      const startY = 0;

      ctx.beginPath();
      for (let x = startX; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = startY; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Sweeping radar arc centered at the top-middle
      const radarCenterX = width * 0.5;
      const radarCenterY = height * 0.25;
      const radarRadius = Math.min(width, height) * 0.75;

      const sweepGrad = ctx.createConicGradient(radarAngle, radarCenterX, radarCenterY);
      const sweepColor = isGodMode
        ? 'rgba(16, 185, 129, 0.07)'
        : 'rgba(56, 189, 248, 0.055)';
      sweepGrad.addColorStop(0, sweepColor);
      sweepGrad.addColorStop(0.12, 'rgba(0, 0, 0, 0)');
      sweepGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.arc(radarCenterX, radarCenterY, radarRadius, 0, Math.PI * 2);
      ctx.fill();

      // Subtle concentric radar range rings (50m, 100m, 200m civic proximity rings)
      ctx.strokeStyle = isGodMode ? 'rgba(52, 211, 153, 0.06)' : 'rgba(56, 189, 248, 0.05)';
      ctx.lineWidth = 1;
      [120, 240, 380, 560].forEach((r) => {
        ctx.beginPath();
        ctx.arc(radarCenterX, radarCenterY, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Update and connect proximity particles (civic geodetic mesh)
      const maxDist = isGodMode ? 160 : 130;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;
        p1.pulsePhase += p1.pulseSpeed;

        if (p1.x < -20) p1.x = width + 20;
        if (p1.x > width + 20) p1.x = -20;
        if (p1.y < -20) p1.y = height + 20;
        if (p1.y > height + 20) p1.y = -20;

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * (isGodMode ? 0.22 : 0.14);
            ctx.strokeStyle = isGodMode
              ? `rgba(52, 211, 153, ${lineAlpha})`
              : `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = p1.isBeacon || p2.isBeacon ? 1.2 : 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Draw particle
        const currentAlpha = p1.baseAlpha + Math.sin(p1.pulsePhase) * 0.15;
        ctx.fillStyle = p1.isBeacon
          ? isGodMode
            ? `rgba(52, 211, 153, ${Math.min(currentAlpha + 0.3, 0.95)})`
            : `rgba(56, 189, 248, ${Math.min(currentAlpha + 0.3, 0.95)})`
          : isGodMode
          ? `rgba(167, 243, 208, ${Math.max(currentAlpha, 0.1)})`
          : `rgba(186, 230, 253, ${Math.max(currentAlpha, 0.1)})`;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fill();

        // Beacon halo
        if (p1.isBeacon) {
          ctx.strokeStyle = isGodMode
            ? `rgba(52, 211, 153, ${currentAlpha * 0.35})`
            : `rgba(56, 189, 248, ${currentAlpha * 0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, p1.radius * 3.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isGodMode]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Subtle telemetry watermark */}
      <div className="absolute bottom-3 left-6 text-[10px] font-mono tracking-widest text-slate-500/40 select-none hidden sm:block">
        VIZAG CIVIC MESH // 17.7385° N, 83.3250° E // AUTONOMOUS AUDIT PROTOCOL
      </div>

      <div className="absolute bottom-3 right-6 text-[10px] font-mono tracking-widest text-slate-500/40 select-none hidden sm:block">
        {isGodMode ? 'AI GOD MODE: ACTIVE // MULTI-SPECTRAL MUNICIPAL TRIAGE' : 'AI RADAR: 200M PROXIMITY ACTIVE'}
      </div>
    </div>
  );
};
