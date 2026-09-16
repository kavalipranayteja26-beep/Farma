import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Truck, MapPin, FileCheck, CheckCircle2, Navigation } from 'lucide-react';

const DeliveryRegister = ({ onComplete }) => {
  const { deliveryBoy, setDeliveryBoy, addToast } = useApp();

  const [name, setName] = useState(deliveryBoy.name || '');
  const [phone, setPhone] = useState(deliveryBoy.phone || '');
  const [vehicleType, setVehicleType] = useState(deliveryBoy.vehicleType || 'Electric Scooter');
  const [vehicleNumber, setVehicleNumber] = useState(deliveryBoy.vehicleNumber || 'TS 09 EQ 4412');
  const [licenseNumber, setLicenseNumber] = useState(deliveryBoy.licenseNumber || 'DL-IND-2022-771120');
  const [locationPermission, setLocationPermission] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !licenseNumber) return;

    setDeliveryBoy(prev => ({
      ...prev,
      name,
      phone,
      vehicleType,
      vehicleNumber,
      licenseNumber,
      locationPermission,
      idVerified: true,
    }));

    addToast('🎉 Delivery Partner registration & License verified!', 'success');
    if (onComplete) onComplete();
  };

  return (
    <div className="max-w-xl mx-auto my-8 bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
      
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-amber-100 text-amber-800 rounded-2xl mb-1 shadow-sm">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold font-outfit text-slate-900">
          Join Farma Delivery Network
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Deliver farm-fresh produce directly from local organic farms to customer doorsteps with real-time GPS navigation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Full Name */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Contact Phone */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone</label>
          <input 
            type="text" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Driving License Number */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>Driving License Number (Required)</span>
          </label>
          <input 
            type="text" 
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder="e.g. DL-IND-2022-771120"
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Vehicle Selection & Plate */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Vehicle Type</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
            >
              <option value="Electric Scooter">Electric Scooter</option>
              <option value="Motorcycle / Bike">Motorcycle / Bike</option>
              <option value="E-Rickshaw Van">E-Rickshaw Van</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Vehicle Plate Number</label>
            <input 
              type="text" 
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="TS 09 EQ 4412"
              required
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Location Access Grant Toggle */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Navigation className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-amber-950">Allow Real-Time Location Access</div>
              <div className="text-[11px] text-amber-800">Enables turn-by-turn navigation map during live delivery</div>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={locationPermission}
              onChange={(e) => setLocationPermission(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl text-sm transition-all shadow-md shadow-amber-600/20 flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Verify License & Save Profile</span>
        </button>

      </form>

    </div>
  );
};

export default DeliveryRegister;
