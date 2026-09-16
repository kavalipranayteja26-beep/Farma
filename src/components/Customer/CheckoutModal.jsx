import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, QrCode, CreditCard, Banknote, ShieldCheck, CheckCircle2, ArrowRight, MapPin, Phone, Wallet, Tag, Sparkles } from 'lucide-react';

const CheckoutModal = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    placeOrder, 
    user, 
    appliedCoupon, 
    applyCouponCode, 
    removeAppliedCoupon 
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('wallet'); // Default to FarmaWallet for convenience
  const [address, setAddress] = useState(user?.address || 'Flat 402, Lotus Heights, Green Avenue, Hyderabad');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const itemTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalTotal = cart.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
  const farmSavings = Math.max(0, originalTotal - itemTotal);
  
  const couponDiscount = appliedCoupon ? appliedCoupon.calculatedDiscount : 0;
  const deliveryFee = appliedCoupon?.code === 'FRESHGREEN' ? 0 : 29;
  
  const grandTotal = Math.max(0, itemTotal + deliveryFee - couponDiscount);

  const farmId = cart.length > 0 ? cart[0].farmId : 'farm-1';

  const handleApplyCouponSubmit = (e) => {
    e.preventDefault();
    if (!couponCodeInput) return;
    applyCouponCode(couponCodeInput, itemTotal);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (paymentMethod === 'wallet' && (user?.walletBalance || 0) < grandTotal) {
      alert(`Insufficient FarmaWallet balance (₹${user?.walletBalance || 0}). Please top-up or select another payment method.`);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const success = placeOrder({
        farmId,
        address,
        phone,
        itemTotal,
        deliveryFee,
        discountAmount: farmSavings + couponDiscount,
        grandTotal,
        paymentMethod: paymentMethod === 'wallet' ? 'FarmaWallet 1-Click Pay' : paymentMethod === 'upi' ? 'UPI (Instant Scan)' : paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery',
      });
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <h2 className="font-extrabold text-lg font-outfit">Farma Secure Checkout</h2>
          </div>
          <button 
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full hover:bg-emerald-700 text-emerald-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handlePlaceOrder} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          
          {/* Delivery Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Doorstep Delivery Address</span>
            </label>
            <textarea 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Contact Phone */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Contact Phone</span>
            </label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* APPLY COUPON SECTION */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
            <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>Apply Organic Coupon Code</span>
            </div>

            {!appliedCoupon ? (
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. FARMAHEALTH, PUREA2MILK"
                  className="flex-1 px-3 py-1.5 rounded-xl border border-amber-300 text-xs font-mono font-bold focus:outline-none bg-white"
                />
                <button
                  type="button"
                  onClick={handleApplyCouponSubmit}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Apply
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-amber-300 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-emerald-800">Coupon "{appliedCoupon.code}" Active (-₹{appliedCoupon.calculatedDiscount})</span>
                </div>
                <button
                  type="button"
                  onClick={removeAppliedCoupon}
                  className="text-xs text-rose-600 font-bold hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* SELECT PAYMENT METHOD (INCLUDING FARMAWALLET) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Select Payment Method</label>
            
            <div className="grid grid-cols-2 gap-2">
              
              {/* FARMAWALLET BUTTON */}
              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  paymentMethod === 'wallet'
                    ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-300 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="p-2 rounded-xl bg-amber-200 text-amber-900">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">FarmaWallet</div>
                  <div className="text-[10px] text-amber-900 font-bold">Balance: ₹{user?.walletBalance || 0}</div>
                </div>
              </button>

              {/* UPI BUTTON */}
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="p-2 rounded-xl bg-emerald-200 text-emerald-900">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">UPI QR / GPay</div>
                  <div className="text-[10px] text-slate-500">Instant Scan</div>
                </div>
              </button>

              {/* CARDS BUTTON */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-200 text-slate-800">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">Credit/Debit Card</div>
                  <div className="text-[10px] text-slate-500">All Banks</div>
                </div>
              </button>

              {/* CASH ON DELIVERY BUTTON */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-200 text-slate-800">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">Cash on Delivery</div>
                  <div className="text-[10px] text-slate-500">Pay at doorstep</div>
                </div>
              </button>

            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="p-3.5 rounded-2xl bg-slate-100 text-xs space-y-1 text-slate-700">
            <div className="flex justify-between">
              <span>Items Total ({cart.length} products)</span>
              <span className="font-semibold text-slate-800">₹{itemTotal}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Coupon Discount ({appliedCoupon.code})</span>
                <span>-₹{couponDiscount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Fresh Farm Delivery Fee</span>
              <span className="font-semibold text-slate-800">₹{deliveryFee}</span>
            </div>
            <div className="pt-1.5 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900 font-outfit">
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
                <span>Processing Order...</span>
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
