import React from 'react';
import { useApp, INITIAL_COUPONS } from '../../context/AppContext';
import { X, Tag, Sparkles, Heart } from 'lucide-react';

const OffersModal = () => {
  const { isOffersModalOpen, setIsOffersModalOpen, applyCouponCode, addToast } = useApp();

  if (!isOffersModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-300" />
            <h2 className="font-extrabold text-lg font-outfit">Farma Organic Offers & Coupons</h2>
          </div>
          <button 
            onClick={() => setIsOffersModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-emerald-700 text-emerald-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Apply discount coupons directly at checkout for extra savings!</span>
          </div>

          <div className="space-y-3">
            {INITIAL_COUPONS.map(c => (
              <div key={c.code} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-300 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-emerald-900 text-sm tracking-wider font-mono bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300">
                    {c.code}
                  </span>
                  <button
                    onClick={() => {
                      applyCouponCode(c.code, 250);
                      setIsOffersModalOpen(false);
                    }}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                  >
                    Apply Coupon
                  </button>
                </div>
                <div className="text-xs font-bold text-slate-800">{c.desc}</div>
                <div className="text-[11px] text-slate-500">Minimum Order Value: ₹{c.minOrder}</div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};

export default OffersModal;
