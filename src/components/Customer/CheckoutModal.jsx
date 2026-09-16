import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, QrCode, CreditCard, Banknote, ShieldCheck, CheckCircle2, ArrowRight, MapPin, Phone } from 'lucide-react';

const CheckoutModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, placeOrder, user } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [address, setAddress] = useState('Flat 402, Lotus Heights, Green Avenue, Jubilee Hills, Hyderabad');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const itemTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalTotal = cart.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
  const savings = Math.max(0, originalTotal - itemTotal);
  const deliveryFee = 29;
  const grandTotal = itemTotal + deliveryFee;

  const farmId = cart.length > 0 ? cart[0].farmId : 'farm-1';

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      placeOrder({
        farmId,
        address,
        phone,
        itemTotal,
        deliveryFee,
        discountAmount: savings,
        grandTotal,
        paymentMethod: paymentMethod === 'upi' ? 'UPI (Instant Scan)' : paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery',
      });
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <h2 className="font-bold text-lg font-outfit">Farma Secure Checkout</h2>
          </div>
          <button 
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full hover:bg-emerald-700 text-emerald-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handlePlaceOrder} className="p-6 space-y-5">
          
          {/* Delivery Address */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Delivery Doorstep Address</span>
            </label>
            <textarea 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Contact Phone */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Contact Phone for Driver Navigation</span>
            </label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Select Payment Method</label>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-2xl border text-left flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <QrCode className="w-5 h-5 text-emerald-700" />
                <span className="text-[11px]">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-left flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-5 h-5 text-emerald-700" />
                <span className="text-[11px]">Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-2xl border text-left flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-700" />
                <span className="text-[11px]">Cash on Delivery</span>
              </button>
            </div>
          </div>

          {/* UPI Scan Preview if UPI chosen */}
          {paymentMethod === 'upi' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <div className="text-xs font-bold text-slate-700">Scan QR Code or Click Pay below</div>
              <div className="inline-block p-2 bg-white rounded-xl shadow-inner border border-slate-200">
                {/* SVG mock QR Code */}
                <svg className="w-28 h-28 mx-auto" viewBox="0 0 100 100">
                  <path d="M0,0 h30 v30 h-30 z M40,0 h20 v10 h-20 z M70,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z M80,10 h10 v10 h-10 z M0,40 h10 v20 h-10 z M20,40 h30 v10 h-30 z M70,40 h10 v10 h-10 z M90,40 h10 v30 h-10 z M0,70 h30 v30 h-30 z M40,70 h20 v20 h-20 z M70,70 h20 v10 h-20 z M10,80 h10 v10 h-10 z" fill="#1E293B"/>
                </svg>
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold">Supported: Google Pay, PhonePe, Paytm, BHIM</div>
            </div>
          )}

          {/* Order Summary Box */}
          <div className="p-3.5 rounded-2xl bg-slate-100 text-xs space-y-1 text-slate-700">
            <div className="flex justify-between">
              <span>Items Total ({cart.length} products)</span>
              <span className="font-semibold text-slate-800">₹{itemTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Fresh Farm Delivery Fee</span>
              <span className="font-semibold text-slate-800">₹{deliveryFee}</span>
            </div>
            <div className="pt-1 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900 font-outfit">
              <span>Total Payable</span>
              <span className="text-emerald-800 text-base">₹{grandTotal}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full btn-primary py-3.5 text-sm font-bold shadow-lg shadow-emerald-700/20"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Processing Payment...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>Pay ₹{grandTotal} & Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>

        </form>

      </div>

    </div>
  );
};

export default CheckoutModal;
