import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import DeliveryRegister from './DeliveryRegister';
import LiveNavigation from './LiveNavigation';
import { Truck, ShieldCheck, Navigation, MapPin, DollarSign, Power, CheckCircle, ArrowRight, UserCheck } from 'lucide-react';

const DeliveryDashboard = () => {
  const { deliveryBoy, setDeliveryBoy, orders, updateOrderStatus, addToast } = useApp();
  const [selectedNavOrder, setSelectedNavOrder] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(!deliveryBoy.idVerified);

  if (showRegisterForm) {
    return <DeliveryRegister onComplete={() => setShowRegisterForm(false)} />;
  }

  if (selectedNavOrder) {
    return (
      <LiveNavigation 
        order={selectedNavOrder} 
        onBack={() => setSelectedNavOrder(null)} 
      />
    );
  }

  const toggleOnline = () => {
    setDeliveryBoy(prev => ({ ...prev, isOnline: !prev.isOnline }));
    addToast(deliveryBoy.isOnline ? 'You are now Offline.' : 'You are now Online & ready to receive farm delivery jobs!', 'info');
  };

  const availableJobs = orders.filter(o => o.status === 'packed' || o.status === 'accepted' || o.status === 'on_the_way');

  const handleAcceptJob = (order) => {
    updateOrderStatus(order.id, 'on_the_way');
    setSelectedNavOrder({ ...order, status: 'on_the_way' });
    addToast(`Accepted order #${order.id}! Launching turn-by-turn live navigation.`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Driver Header Profile Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-3xl font-extrabold shadow-md flex-shrink-0">
            🚚
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>License Verified</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-bold flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                <span>GPS Location Active</span>
              </span>
            </div>
            <h1 className="text-2xl font-extrabold font-outfit">{deliveryBoy.name}</h1>
            <p className="text-xs text-slate-300">
              Vehicle: <strong className="text-white">{deliveryBoy.vehicleType} ({deliveryBoy.vehicleNumber})</strong> • License: {deliveryBoy.licenseNumber}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRegisterForm(true)}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/15"
          >
            Edit Credentials / License
          </button>

          <button
            onClick={toggleOnline}
            className={`px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
              deliveryBoy.isOnline
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{deliveryBoy.isOnline ? 'Online • Ready for Jobs' : 'Offline'}</span>
          </button>
        </div>
      </div>

      {/* Driver Analytics Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-semibold">Today's Earnings</div>
          <div className="text-2xl font-extrabold text-slate-900 font-outfit">₹{deliveryBoy.todayEarnings}</div>
          <div className="text-[11px] text-emerald-700 font-semibold">Direct Doorstep Payouts</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-semibold">Deliveries Completed</div>
          <div className="text-2xl font-extrabold text-slate-900 font-outfit">{deliveryBoy.deliveriesCompleted} Trips</div>
          <div className="text-[11px] text-slate-500 font-medium">100% On-Time Delivery</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-semibold">Driver Rating</div>
          <div className="text-2xl font-extrabold text-slate-900 font-outfit">{deliveryBoy.rating} ⭐</div>
          <div className="text-[11px] text-slate-500 font-medium">Top Customer Feedback</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-semibold">Active Jobs Nearby</div>
          <div className="text-2xl font-extrabold text-amber-600 font-outfit">{availableJobs.length} Available</div>
          <div className="text-[11px] text-amber-800 font-medium">Within 3.5 km radius</div>
        </div>
      </div>

      {/* Available Jobs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-outfit text-slate-800 flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-600" />
            <span>Available Farm Delivery Requests</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Updated live</span>
        </div>

        {availableJobs.length > 0 ? (
          <div className="space-y-4">
            {availableJobs.map(job => (
              <div 
                key={job.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold">
                      Payout: ₹65
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                      Order #{job.id}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {job.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                      <div className="font-bold text-slate-500 uppercase text-[10px] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pickup Farm</span>
                      </div>
                      <div className="font-bold text-slate-800 text-sm">{job.farmName}</div>
                      <div className="text-slate-500">{job.farmLocation}</div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                      <div className="font-bold text-slate-500 uppercase text-[10px] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span>Doorstep Delivery Drop</span>
                      </div>
                      <div className="font-bold text-slate-800 text-sm">{job.customerName}</div>
                      <div className="text-slate-500">{job.deliveryAddress}</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600">
                    <span className="font-bold text-slate-800">Insulated Items:</span> {job.items.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleAcceptJob(job)}
                    className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md shadow-amber-600/20 flex items-center justify-center gap-2"
                  >
                    <span>Accept Job & Launch Live Navigation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-500">
            No active delivery jobs available right now. Check back in a few minutes!
          </div>
        )}
      </div>

    </div>
  );
};

export default DeliveryDashboard;
