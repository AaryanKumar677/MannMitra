import React, { useEffect, useRef, useState } from "react";
import { MannMitraicon, MannMitraname } from "../../../assets";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import "./LoopHolePortal.css";

export default function LoopHolePortal({ onComplete, duration = 3000 }) {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing Quantum Mind Space...");
  const [isMuted, setIsMuted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const audioContextRef = useRef(null);

  // Play ambient cosmic synthesizer frequency ramp
  useEffect(() => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(110, ctx.currentTime); // Low soothing A2
      osc.frequency.exponentialRampToValueAtTime(432, ctx.currentTime + 2.4); // 432Hz Healing Frequency
      osc.frequency.exponentialRampToValueAtTime(528, ctx.currentTime + 2.9); // 528Hz Solfeggio

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(300, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 2.6);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 3.1);
    } catch (e) {
      // Audio autoplay policy fallback
    }

    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        try {
          audioContextRef.current.close();
        } catch (e) {}
      }
    };
  }, [isMuted]);

  // Main 3-second Canvas Particle Vortex & Wormhole
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle Stars for Hyperdrive / Warp
    const starsCount = 450;
    const stars = [];
    for (let i = 0; i < starsCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        pz: Math.random() * width,
        hue: Math.random() > 0.5 ? 160 : 270 // Emerald or Violet
      });
    }

    const startTime = performance.now();
    let vortexAngle = 0;

    const render = (currentTime) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);

      // Smooth progress update
      setProgress(Math.round(t * 100));

      if (t < 0.35) {
        setStatusText("Aligning Neural Frequencies...");
      } else if (t < 0.75) {
        setStatusText("Bending Continuum • Opening Safe Haven...");
      } else if (t < 0.95) {
        setStatusText("Synchronizing Sanctuary • Welcome to MannMitra");
      } else {
        setStatusText("Entering Sanctuary...");
      }

      // Background fade trail for warp blur
      ctx.fillStyle = "rgba(7, 8, 14, 0.35)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw Rotating Geometric Neon Vortex Rings
      vortexAngle += 0.04 + t * 0.12;
      const numRings = 9;
      for (let r = 1; r <= numRings; r++) {
        const radius = (r * 45 + Math.sin(currentTime * 0.005 + r) * 15) * (1 + t * 2.2);
        const ringAlpha = Math.max(0, 1 - r / numRings) * (0.4 + 0.6 * Math.sin(t * Math.PI));

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(vortexAngle * (r % 2 === 0 ? 1 : -1) * (0.5 + r * 0.1));

        ctx.beginPath();
        const sides = 6 + (r % 3);
        for (let s = 0; s < sides; s++) {
          const angle = (s * 2 * Math.PI) / sides;
          const px = Math.cos(angle) * radius;
          const py = Math.sin(angle) * radius;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        ctx.lineWidth = 2 + (r % 2);
        ctx.shadowBlur = 18;
        ctx.shadowColor = r % 2 === 0 ? "#10b981" : "#8b5cf6";
        ctx.strokeStyle =
          r % 2 === 0
            ? `rgba(16, 185, 129, ${ringAlpha})`
            : `rgba(139, 92, 246, ${ringAlpha})`;
        ctx.stroke();
        ctx.restore();
      }

      // Warp Speed Streaking Stars
      const warpSpeed = 15 + Math.pow(t, 2.5) * 85;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.pz = star.z;
        star.z -= warpSpeed;

        if (star.z <= 0) {
          star.z = width;
          star.pz = width;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        const k = 250 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        const pk = 250 / star.pz;
        const prevPx = star.x * pk + cx;
        const prevPy = star.y * pk + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const intensity = Math.min(1, (1 - star.z / width) * 1.5);
          ctx.beginPath();
          ctx.moveTo(prevPx, prevPy);
          ctx.lineTo(px, py);
          ctx.lineWidth = Math.max(1, (1 - star.z / width) * 4);
          ctx.strokeStyle =
            star.hue === 160
              ? `rgba(52, 211, 153, ${intensity})`
              : `rgba(192, 132, 252, ${intensity})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = star.hue === 160 ? "#10b981" : "#c084fc";
          ctx.stroke();
        }
      }

      // Singularity Core Glow in Center
      const corePulse = 25 + Math.sin(currentTime * 0.01) * 8 + t * 65;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, corePulse * 3);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      grad.addColorStop(0.2, "rgba(16, 185, 129, 0.8)");
      grad.addColorStop(0.6, "rgba(139, 92, 246, 0.4)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, corePulse * 3, 0, Math.PI * 2);
      ctx.fill();

      // Check for completion
      if (t < 1) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        // Trigger exit expansion flash
        setIsExiting(true);
        setTimeout(() => {
          onComplete?.();
        }, 380);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [duration, onComplete]);

  // Handle ESC key to skip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsExiting(true);
        setTimeout(() => onComplete?.(), 200);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onComplete]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => onComplete?.(), 200);
  };

  return (
    <div className={`mm-portal-overlay ${isExiting ? "exiting" : ""}`}>
      {/* Background Canvas for Warp Field */}
      <canvas ref={canvasRef} className="mm-portal-canvas" />

      {/* Futuristic Center Telemetry & Logo Singularity */}
      <div className="mm-portal-center-content">
        {/* Hyperspace Portal Rings Container */}
        <div className="mm-portal-rings">
          <div className="mm-ring ring-1"></div>
          <div className="mm-ring ring-2"></div>
          <div className="mm-ring ring-3"></div>

          {/* Glowing Emblem in Center */}
          <div className="mm-portal-emblem-wrap">
            <img
              src={MannMitraicon}
              alt="MannMitra"
              className="mm-portal-logo-icon"
            />
            <div className="mm-portal-glow-pulse" />
          </div>
        </div>

        {/* Logo Wordmark */}
        <div className="mm-portal-wordmark">
          <img src={MannMitraname} alt="MannMitra" className="mm-portal-logo-name" />
          <div className="mm-portal-badge">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>CONFIDENTIAL AI MENTAL WELLNESS</span>
          </div>
        </div>

        {/* Dynamic Telemetry HUD */}
        <div className="mm-portal-hud">
          <div className="mm-hud-text">{statusText}</div>

          {/* Progress Bar */}
          <div className="mm-hud-bar-wrap">
            <div className="mm-hud-bar" style={{ width: `${progress}%` }} />
          </div>

          <div className="mm-hud-percentage">
            <span>WARP SEQUENCE</span>
            <strong>{progress}%</strong>
          </div>
        </div>
      </div>

      {/* Top and Bottom Controls */}
      <div className="mm-portal-controls">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="mm-portal-ctrl-btn"
          title={isMuted ? "Unmute warp sound" : "Mute warp sound"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          <span>{isMuted ? "Sound Off" : "Ambient 528Hz"}</span>
        </button>

        <button onClick={handleSkip} className="mm-portal-skip-btn">
          <span>Skip Warp</span>
          <span className="mm-esc-badge">ESC</span>
        </button>
      </div>
    </div>
  );
}
