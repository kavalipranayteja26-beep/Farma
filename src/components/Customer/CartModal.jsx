import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

const CartModal = () => {
  const { cart, updateCartQty, removeFromCart, isCartOpen, setIsCartOpen, setIsCheckoutOpen } = useApp();

  if (!isCartOpen) return null;

  const itemTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalTotal = cart.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
  const savings = Math.max(0, originalTotal - itemTotal);
  const deliveryFee = cart.length > 0 ? 29 : 0;
  const grandTotal = itemTotal + deliveryFee;

  const farmName = cart.length > 0 ? cart[0].farmName : 'Local Organic Farm';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slideLeft">
        
        {/* Cart Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            <h2 className="font-bold text-lg font-outfit text-slate-800">Your Fresh Farm Cart</h2>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Farm Source Banner */}
        {cart.length > 0 && (
          <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-900 font-semibold">
            <span className="truncate">Sourced from: <strong className="text-emerald-800 font-bold">{farmName}</strong></span>
            <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded-full text-emerald-900 font-bold flex-shrink-0">Direct Farm</span>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-slate-500 my-auto">
              <ShoppingBag className="w-16 h-16 text-slate-300 stroke-1" />
              <div className="font-bold text-slate-700 text-base">Your cart is empty</div>
              <p className="text-xs text-slate-400 max-w-xs">
                Add fresh A2 milk, organic paneer, turmeric, or leafy greens from your local farms to get started!
              </p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 items-center justify-between">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-800 truncate font-outfit">{item.name}</h4>
                  <div className="text-[11px] text-slate-500 font-medium">{item.unit}</div>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="font-extrabold text-sm text-slate-900">₹{item.price * item.quantity}</span>
                    <span className="text-[10px] text-slate-400">({item.quantity} x ₹{item.price})</span>
                  </div>
                </div>

                {/* Quantity Buttons */}
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                  <button 
                    onClick={() => updateCartQty(item.id, -1)}
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                  <button 
                    onClick={() => updateCartQty(item.id, 1)}
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer Breakdown */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            
            {/* Health Motive Guarantee */}
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 font-medium flex items-center gap-2">
              <Heart className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Medicinal Purity Guarantee: Zero artificial additives or chemicals.</span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="font-semibold text-slate-800">₹{itemTotal}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Farmer Direct Savings</span>
                  <span>-₹{savings}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Doorstep Delivery Partner Fee</span>
                <span className="font-semibold text-slate-800">₹{deliveryFee}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900 font-outfit">
                <span>Grand Total</span>
                <span className="text-emerald-800 text-lg">₹{grandTotal}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full btn-primary py-3.5 text-sm font-bold shadow-lg shadow-emerald-700/20"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        )}

      </div>

    </div>
  );
};

export default CartModal;
