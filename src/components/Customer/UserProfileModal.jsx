import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  User, 
  Wallet, 
  Package, 
  Tag, 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Edit3, 
  Save, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Clock,
  Sparkles
} from 'lucide-react';
import { INITIAL_COUPONS } from '../../context/AppContext';

const UserProfileModal = () => {
  const { 
    isProfileModalOpen, 
    setIsProfileModalOpen, 
    user, 
    updateUserProfile, 
    walletTransactions, 
    addWalletMoney, 
    orders, 
    setTrackingOrderId, 
    setIsOrderTrackingOpen,
    applyCouponCode,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'wallet' | 'orders' | 'coupons' | 'addresses'
  
  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');

  // Wallet Top-up state
  const [topUpAmount, setTopUpAmount] = useState('500');

  // Coupon code input state
  const [couponInput, setCouponInput] = useState('');

  if (!isProfileModalOpen || !user) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile({ name, email, phone, address });
    setIsEditing(false);
  };

  const handleTopUp = (e) => {
    e.preventDefault();
    addWalletMoney(topUpAmount);
  };

  const myOrders = orders.filter(o => o.customerId === user.id || o.customerId === 'cust-1');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'} 
              alt={user.name} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-extrabold uppercase">
                  {user.role.toUpperCase()} ACCOUNT
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-extrabold flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-current" />
                  <span>{user.healthPoints || 120} Organic Health Points</span>
                </span>
              </div>
              <h2 className="text-xl font-extrabold font-outfit text-white">{user.name}</h2>
              <div className="text-xs text-emerald-200">{user.email}</div>
            </div>
          </div>

          <button 
            onClick={() => setIsProfileModalOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex overflow-x-auto bg-slate-100 border-b border-slate-200 text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-3 whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'profile' ? 'bg-white text-emerald-800 border-b-2 border-emerald-700 font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-emerald-600" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-4 py-3 whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'wallet' ? 'bg-white text-emerald-800 border-b-2 border-emerald-700 font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wallet className="w-4 h-4 text-amber-600" />
            <span>FarmaWallet (₹{user.walletBalance})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-3 whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'orders' ? 'bg-white text-emerald-800 border-b-2 border-emerald-700 font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4 text-emerald-600" />
            <span>My Orders ({myOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-3 whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'coupons' ? 'bg-white text-emerald-800 border-b-2 border-emerald-700 font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tag className="w-4 h-4 text-amber-600" />
            <span>Offers & Coupons</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          
          {/* TAB 1: PROFILE DETAILS & EDIT */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold font-outfit text-slate-900">Personal Information</h3>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Details</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="text-xs font-bold text-slate-500 hover:underline"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {!isEditing ? (
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="text-[11px] text-slate-400 font-bold uppercase">Full Name</div>
                    <div className="font-bold text-slate-800 text-sm">{user.name}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="text-[11px] text-slate-400 font-bold uppercase">Email Address</div>
                      <div className="font-bold text-slate-800">{user.email}</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="text-[11px] text-slate-400 font-bold uppercase">Contact Phone</div>
                      <div className="font-bold text-slate-800">{user.phone}</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="text-[11px] text-slate-400 font-bold uppercase">Primary Doorstep Delivery Address</div>
                    <div className="font-bold text-slate-800">{user.address}</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Phone</label>
                      <input 
                        type="text" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Delivery Address</label>
                    <textarea 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      rows={2}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary py-2.5 px-5 text-xs font-bold shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: FARMAWALLET */}
          {activeTab === 'wallet' && (
            <div className="space-y-5">
              
              {/* Wallet Balance Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-950/80">FarmaWallet Balance</span>
                  <Wallet className="w-6 h-6 text-slate-950" />
                </div>
                <div className="text-4xl font-extrabold font-outfit text-slate-950">₹{user.walletBalance}</div>
                <div className="text-xs font-bold text-slate-900/90">
                  Instant 1-Click Payments & Automatic Cashback Rewards
                </div>
              </div>

              {/* Add Money Form */}
              <form onSubmit={handleTopUp} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800">Top-Up FarmaWallet</div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-xs">₹</span>
                    <input 
                      type="number" 
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      placeholder="Enter amount"
                      required
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex-shrink-0"
                  >
                    + Add Money
                  </button>
                </div>
                <div className="flex gap-2">
                  {[100, 250, 500, 1000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt.toString())}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:border-amber-400"
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>
              </form>

              {/* Wallet Transactions */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800">Transaction History</div>
                <div className="space-y-2">
                  {walletTransactions.map(tx => (
                    <div key={tx.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl ${tx.type === 'credit' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{tx.desc}</div>
                          <div className="text-[10px] text-slate-400">{tx.date}</div>
                        </div>
                      </div>
                      <span className={`font-extrabold text-sm ${tx.type === 'credit' ? 'text-emerald-700' : 'text-slate-900'}`}>
                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-800">Order History & Real-Time Tracking</div>
              
              {myOrders.map(order => (
                <div key={order.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                    <div>
                      <span className="font-bold text-emerald-800">Order #{order.id}</span>
                      <div className="text-[11px] text-slate-500">{order.farmName}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-slate-900 text-sm">₹{order.grandTotal}</span>
                      <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5 inline-block">
                        {order.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-0.5">
                    {order.items.map((it, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{it.quantity}x {it.name} ({it.unit})</span>
                        <span className="font-semibold text-slate-800">₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setTrackingOrderId(order.id);
                        setIsOrderTrackingOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-sm hover:bg-emerald-800 transition-colors flex items-center gap-1"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Track Live Delivery</span>
                    </button>
                    <span className="text-[11px] text-slate-400 font-medium">{order.orderTime}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: OFFERS & COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-800">Available Farma Health Coupons & Discounts</div>

              <div className="grid grid-cols-1 gap-3">
                {INITIAL_COUPONS.map(c => (
                  <div key={c.code} className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-amber-950 text-sm tracking-wider font-mono bg-amber-200 px-2.5 py-0.5 rounded-lg border border-amber-300">
                          {c.code}
                        </span>
                        <span className="text-xs font-bold text-amber-900">{c.desc}</span>
                      </div>
                      <div className="text-[11px] text-amber-800 font-medium">Min Order: ₹{c.minOrder}</div>
                    </div>

                    <button
                      onClick={() => {
                        applyCouponCode(c.code, 250);
                        addToast(`Copied & Applied "${c.code}"!`, 'success');
                      }}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm flex-shrink-0"
                    >
                      Apply Code
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default UserProfileModal;
