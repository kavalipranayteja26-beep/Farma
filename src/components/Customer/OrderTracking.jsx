import React from 'react';
import { useApp } from '../../context/AppContext';
import InteractiveMap from '../Common/InteractiveMap';
import { X, CheckCircle2, Clock, Phone, MapPin, Truck, ShieldCheck, Heart } from 'lucide-react';

const OrderTracking = () => {
  const { isOrderTrackingOpen, setIsOrderTrackingOpen, activeDeliveryOrder, orders, trackingOrderId } = useApp();

  if (!isOrderTrackingOpen) return null;

  const currentOrder = orders.find(o => o.id === trackingOrderId) || activeDeliveryOrder || orders[0];

  if (!currentOrder) return null;

  const steps = [
    { key: 'placed', label: 'Order Placed', desc: 'Sent to Farm' },
    { key: 'accepted', label: 'Farm Accepted', desc: 'Harvesting & Packing' },
    { key: 'packed', label: 'Insulated Packing', desc: 'Ready for Driver Pickup' },
    { key: 'on_the_way', label: 'On The Way', desc: 'Driver Navigating to Doorstep' },
    { key: 'delivered', label: 'Delivered', desc: 'Safely Delivered to Home' },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'placed': return 0;
      case 'accepted': return 1;
      case 'packed': return 2;
      case 'on_the_way': return 3;
      case 'delivered': return 4;
      default: return 3;
    }
  };

  const activeIndex = getStepIndex(currentOrder.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Live Order Tracking</span>
            </div>
            <h2 className="font-extrabold text-lg font-outfit">Order #{currentOrder.id}</h2>
          </div>
          <button 
            onClick={() => setIsOrderTrackingOpen(false)}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          
          {/* Interactive Realtime GPS Canvas Map */}
          <InteractiveMap 
            orderStatus={currentOrder.status}
            farmName={currentOrder.farmName}
            deliveryPartnerName={currentOrder.deliveryPartner?.name || 'Kiran (Delivery)'}
          />

          {/* Delivery Partner Info Bar */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-md">
                🚚
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <span>{currentOrder.deliveryPartner?.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold">Verified Driver</span>
                </div>
                <div className="text-xs text-emerald-800 font-medium">{currentOrder.deliveryPartner?.vehicle}</div>
                <div className="text-[11px] text-emerald-700">License: {currentOrder.deliveryPartner?.license}</div>
              </div>
            </div>

            <a 
              href={`tel:${currentOrder.deliveryPartner?.phone}`}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-md hover:bg-emerald-800 transition-all flex-shrink-0"
            >
              <Phone className="w-4 h-4" />
              <span>Call Partner</span>
            </a>
          </div>

          {/* Progress Timeline Tracker */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Delivery Timeline</div>
            
            <div className="grid grid-cols-5 gap-1 pt-2">
              {steps.map((step, idx) => {
                const isDone = idx <= activeIndex;
                const isCurrent = idx === activeIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center space-y-1">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 scale-110 shadow-md'
                          : isDone
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div className={`text-[10px] font-bold leading-tight ${isCurrent ? 'text-emerald-800 font-extrabold' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                      {step.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Itemized Order Details */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="font-bold text-slate-800 flex justify-between">
              <span>Farm Source: {currentOrder.farmName}</span>
              <span className="text-emerald-700 font-extrabold">PAID ₹{currentOrder.grandTotal}</span>
            </div>

            <div className="divide-y divide-slate-200/80">
              {currentOrder.items.map((item, i) => (
                <div key={i} className="py-2 flex justify-between items-center text-slate-700">
                  <span>{item.quantity}x {item.name} ({item.unit})</span>
                  <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 text-slate-500 text-[11px] flex items-center justify-between">
              <span>Delivery Address: {currentOrder.deliveryAddress}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default OrderTracking;
