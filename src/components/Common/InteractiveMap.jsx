import React, { useEffect, useRef, useState } from 'react';
import { Navigation, MapPin, Store, Home, ShieldCheck } from 'lucide-react';

const InteractiveMap = ({ orderStatus = 'on_the_way', farmName = 'Aarav Organic Farm', deliveryPartnerName = 'Kiran Kumar' }) => {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0.45); // 0 to 1 along path

  // Animate delivery vehicle movement on canvas
  useEffect(() => {
    let animationFrameId;
    let currentProgress = 0.15;

    if (orderStatus === 'placed') currentProgress = 0.05;
    else if (orderStatus === 'accepted') currentProgress = 0.15;
    else if (orderStatus === 'packed') currentProgress = 0.25;
    else if (orderStatus === 'on_the_way') currentProgress = 0.55;
    else if (orderStatus === 'delivered') currentProgress = 1.0;

    const animate = () => {
      if (orderStatus === 'on_the_way') {
        currentProgress += 0.0015;
        if (currentProgress > 0.95) currentProgress = 0.25; // loop smoothly for live demo
      }
      setProgress(currentProgress);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Background Map Styling (Pastel Roads & Green Fields)
      ctx.fillStyle = '#F4F7F4';
      ctx.fillRect(0, 0, width, height);

      // Grid/Field blocks
      ctx.fillStyle = '#E8F5E9';
      ctx.beginPath();
      ctx.roundRect(20, 20, 180, 110, 12);
      ctx.roundRect( width - 200, 30, 180, 120, 12);
      ctx.roundRect(40, height - 120, 200, 90, 12);
      ctx.fill();

      // Road Network Lines
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 24;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Define Bezier Curve Route: Farm (60, 80) -> Mid Control Point -> Doorstep (Width-60, Height-80)
      const p0 = { x: 80, y: 100 };
      const p1 = { x: width * 0.4, y: 40 };
      const p2 = { x: width * 0.6, y: height - 40 };
      const p3 = { x: width - 80, y: height - 100 };

      // Draw Main Road
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      ctx.stroke();

      // Inner Road Accent
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 14;
      ctx.stroke();

      // Active Delivery Traveled Path (Green Highlight)
      ctx.strokeStyle = '#22C55E';
      ctx.lineWidth = 6;
      ctx.setLineDash([8, 8]);
      ctx.stroke();
      ctx.setLineDash([]); // reset dash

      // Calculate current position on Bezier curve
      const t = currentProgress;
      const bx = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x;
      const by = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y;

      // 1. Draw Farm Marker (Start)
      ctx.fillStyle = '#15803D';
      ctx.beginPath();
      ctx.arc(p0.x, p0.y, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.fillText('🏡 Farm', p0.x - 22, p0.y - 20);

      // 2. Draw Customer Doorstep Marker (End)
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.arc(p3.x, p3.y, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.fillText('📍 Doorstep', p3.x - 26, p3.y + 30);

      // 3. Draw Moving Delivery Partner Vehicle Marker
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#EAB308'; // Amber delivery bike
      ctx.beginPath();
      ctx.arc(bx, by, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset shadow

      // Vehicle Pulse Ring
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bx, by, 22 + (Math.sin(Date.now() / 200) * 4), 0, Math.PI * 2);
      ctx.stroke();

      // Delivery Partner Icon/Label
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText(`🚚 ${deliveryPartnerName}`, bx - 35, by - 24);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [orderStatus, deliveryPartnerName]);

  return (
    <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-200/90 shadow-inner bg-slate-100">
      
      {/* Canvas Layer */}
      <canvas 
        ref={canvasRef} 
        width={700} 
        height={320} 
        className="w-full h-full object-cover"
      />

      {/* Top Floating Live GPS Pill */}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-slate-200 flex items-center gap-2 text-xs font-bold text-slate-800">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
        </span>
        <Navigation className="w-3.5 h-3.5 text-emerald-600" />
        <span>Live GPS Navigation • 1.8 km distance</span>
      </div>

      {/* Bottom Floating Delivery Status Pill */}
      <div className="absolute bottom-3 right-3 bg-slate-900/90 text-white backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-slate-700 text-xs flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <div>
          <div className="font-bold text-white">Insulated Cold-Chain Transit</div>
          <div className="text-[10px] text-slate-300">Temperature Controlled Freshness</div>
        </div>
      </div>

    </div>
  );
};

export default InteractiveMap;
