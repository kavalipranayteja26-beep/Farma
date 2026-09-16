import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Logo from '../Logo';
import { User, Store, Truck, ShieldCheck, ArrowRight, Lock, Mail, Phone, MapPin, FileCheck, UserPlus, LogIn, Award } from 'lucide-react';

const LoginModal = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, loginUser, registerUser } = useApp();
  
  // Mode: 'login' or 'register'
  const [authMode, setAuthMode] = useState('register');
  const [selectedRole, setSelectedRole] = useState('customer');

  // Common Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('••••••••');

  // Customer Specific Fields
  const [address, setAddress] = useState('');

  // Farmer Specific Fields
  const [farmName, setFarmName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [specialty, setSpecialty] = useState('Pure A2 Milk, Paneer & Organic Vegetables');
  const [certNumber, setCertNumber] = useState('');

  // Delivery Partner Specific Fields
  const [vehicleType, setVehicleType] = useState('Electric Scooter');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (authMode === 'register') {
      registerUser(selectedRole, {
        name,
        email,
        phone,
        password,
        address,
        farmName: farmName || `${name}'s Organic Farm`,
        location: farmLocation || 'Green Acres Bio Zone',
        specialty,
        certNumber: certNumber || `ORG-IND-${Math.floor(1000 + Math.random() * 9000)}`,
        vehicleType,
        vehicleNumber: vehicleNumber || 'TS 09 EQ 9988',
        licenseNumber: licenseNumber || 'DL-IND-2026-77112',
      });
    } else {
      loginUser(selectedRole, {
        name: name || (selectedRole === 'farmer' ? 'Ramesh Patel' : selectedRole === 'delivery' ? 'Kiran Kumar' : 'Sanjana Rao'),
        email: email || (selectedRole === 'farmer' ? 'ramesh@aaravfarms.com' : selectedRole === 'delivery' ? 'kiran@farma.com' : 'sanjana@example.com'),
        farmName: farmName || 'Aarav Organic Vedic Dairy',
      });
    }
  };

  const handleQuickDemoLogin = (role) => {
    setSelectedRole(role);
    loginUser(role, {});
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        
        {/* Top Header with Dark Variant Logo for perfect contrast */}
        <div className="p-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <Logo size="md" showTagline={true} variant="dark" />
        </div>

        <div className="p-6 sm:p-8 space-y-5 max-h-[85vh] overflow-y-auto">
          
          {/* Mode Switcher Tabs: Sign In vs Register */}
          <div className="flex border-b border-slate-200 text-sm font-bold">
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 pb-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'register'
                  ? 'border-emerald-700 text-emerald-800 font-extrabold text-base'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Create New Account</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 pb-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'login'
                  ? 'border-emerald-700 text-emerald-800 font-extrabold text-base'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In (Existing User)</span>
            </button>
          </div>

          <div className="text-center space-y-1">
            <h2 className="font-extrabold text-2xl font-outfit text-slate-900">
              {authMode === 'register' ? 'Register New Account' : 'Sign In to Farma'}
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {authMode === 'register' 
                ? 'Join as a Customer, Farmer, or Delivery Partner to get started.'
                : 'Enter your credentials to access your locked portal.'}
            </p>
          </div>

          {/* Role Selector Cards */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedRole('customer')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                selectedRole === 'customer'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-400 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-5 h-5 text-emerald-700" />
              <span className="text-xs font-bold">Customer</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('farmer')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                selectedRole === 'farmer'
                  ? 'border-emerald-700 bg-emerald-700 text-white font-bold ring-2 ring-emerald-500 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Store className="w-5 h-5" />
              <span className="text-xs font-bold">Farmer Store</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('delivery')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                selectedRole === 'delivery'
                  ? 'border-amber-600 bg-amber-600 text-white font-bold ring-2 ring-amber-400 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Truck className="w-5 h-5" />
              <span className="text-xs font-bold">Delivery Partner</span>
            </button>
          </div>

          {/* AUTH FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Common Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {selectedRole === 'farmer' ? 'Farmer Owner Full Name' : selectedRole === 'delivery' ? 'Driver Full Name' : 'Customer Full Name'}
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={selectedRole === 'farmer' ? 'e.g. Bala Shankar' : selectedRole === 'delivery' ? 'e.g. Kiran Kumar' : 'e.g. Sanjana Rao'}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            {/* FARMER SPECIFIC REGISTRATION FIELDS */}
            {authMode === 'register' && selectedRole === 'farmer' && (
              <div className="space-y-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span>Farm Store Credentials & License</span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Farm Store Name</label>
                  <input 
                    type="text" 
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="e.g. Pranay Organic Vedic Farm"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Farm Location / Address</label>
                  <input 
                    type="text" 
                    value={farmLocation}
                    onChange={(e) => setFarmLocation(e.target.value)}
                    placeholder="e.g. Green Acres Bio Plot 14, Hyderabad"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Govt Organic Cert License #</label>
                  <input 
                    type="text" 
                    value={certNumber}
                    onChange={(e) => setCertNumber(e.target.value)}
                    placeholder="e.g. ORG-IND-2026-8891"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                  />
                </div>
              </div>
            )}

            {/* DELIVERY PARTNER SPECIFIC REGISTRATION FIELDS */}
            {authMode === 'register' && selectedRole === 'delivery' && (
              <div className="space-y-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-amber-700" />
                  <span>Driver Vehicle & License Verification</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Vehicle Type</label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                    >
                      <option value="Electric Scooter">Electric Scooter</option>
                      <option value="Motorcycle / Bike">Motorcycle / Bike</option>
                      <option value="E-Rickshaw Van">E-Rickshaw Van</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Vehicle Plate #</label>
                    <input 
                      type="text" 
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      placeholder="TS 09 EQ 8899"
                      required
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Driving License Number</label>
                  <input 
                    type="text" 
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="DL-IND-2026-77881"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  />
                </div>
              </div>
            )}

            {/* CUSTOMER SPECIFIC REGISTRATION FIELDS */}
            {authMode === 'register' && selectedRole === 'customer' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Doorstep Delivery Address</label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your flat/house number, street & city address"
                  required
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            )}

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-3.5 text-sm font-bold shadow-lg shadow-emerald-700/20"
            >
              <span>{authMode === 'register' ? `Register & Launch ${selectedRole.toUpperCase()} Portal` : `Sign In as ${selectedRole.toUpperCase()}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Quick Demo Access Bar */}
          <div className="pt-3 border-t border-slate-100">
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2 text-center">
              Quick Demo Access Buttons
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold">
              <button
                onClick={() => handleQuickDemoLogin('customer')}
                className="px-2 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors text-center truncate"
              >
                🛒 Customer Demo
              </button>
              <button
                onClick={() => handleQuickDemoLogin('farmer')}
                className="px-2 py-1.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 transition-colors text-center truncate"
              >
                👩‍🌾 Farmer Demo
              </button>
              <button
                onClick={() => handleQuickDemoLogin('delivery')}
                className="px-2 py-1.5 rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition-colors text-center truncate"
              >
                🚚 Driver Demo
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default LoginModal;
