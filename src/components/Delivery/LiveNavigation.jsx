import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import InteractiveMap from '../Common/InteractiveMap';
import confetti from 'canvas-confetti';
import { ArrowLeft, Navigation, Phone, CheckCircle2, ShieldCheck, MapPin, AlertCircle, Compass } from 'lucide-react';

const LiveNavigation = ({ order, onBack }) => {
  const { updateOrderStatus, addToast } = useApp();
  const [otpCode, setOtpCode] = useState('');
  const [isCompleted, setIsCompleted] = useState(order.status === 'delivered');

  const handleCompleteDelivery = (e) => {
    e.preventDefault();
    
    // Trigger confetti celebration effect
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    updateOrderStatus(order.id, 'delivered');
    setIsCompleted(true);
    addToast('🎉 Order delivered successfully to customer doorstep!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3.5 py-2 rounded-full shadow-sm hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-900 rounded-full text-xs font-bold border border-amber-300">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
          <span>Live GPS Route Active</span>
        </div>
      </div>

      {/* Turn-by-Turn GPS Direction Banner */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between gap-4 shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-600 rounded-xl text-white">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Next Direction</div>
            <div className="text-sm sm:text-base font-bold font-outfit">
              In 200m, turn right onto Green Valley Road towards Doorstep Drop
            </div>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-xl font-extrabold text-amber-400 font-outfit">1.8 km</div>
          <div className="text-[11px] text-slate-300">ETA: 4 mins</div>
        </div>
      </div>

      {/* Interactive Canvas GPS Map */}
      <InteractiveMap 
        orderStatus={order.status}
        farmName={order.farmName}
        deliveryPartnerName="You (Driver)"
      />

      {/* Pickup & Drop Points Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Farm Pickup */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Farm Pickup Point</span>
          </div>
          <div className="font-bold text-slate-800 text-sm">{order.farmName}</div>
          <div className="text-xs text-slate-500">{order.farmLocation}</div>
        </div>

        {/* Customer Doorstep Drop */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>Customer Doorstep Drop</span>
          </div>
          <div className="font-bold text-slate-800 text-sm">{order.customerName} ({order.customerPhone})</div>
          <div className="text-xs text-slate-500">{order.deliveryAddress}</div>
        </div>

      </div>

      {/* Delivery Completion Form */}
      <div className="p-6 rounded-3xl bg-amber-50/90 border border-amber-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-bold text-slate-900 text-base font-outfit">Complete Doorstep Handover</h3>
            <p className="text-xs text-slate-600">Verify customer code and confirm delivery completion.</p>
          </div>
          <span className="font-extrabold text-slate-900 text-lg">Earnings: ₹65</span>
        </div>

        {isCompleted ? (
          <div className="p-4 rounded-2xl bg-emerald-700 text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-md">
            <CheckCircle2 className="w-5 h-5 text-amber-300" />
            <span>Delivery Completed & Earnings Credited!</span>
          </div>
        ) : (
          <form onSubmit={handleCompleteDelivery} className="flex flex-col sm:flex-row items-center gap-3">
            <input 
              type="text" 
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Enter 4-digit Customer Delivery Code (or click Complete)"
              className="w-full sm:flex-1 px-4 py-3 rounded-2xl border border-amber-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Delivery</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
};

export default LiveNavigation;
