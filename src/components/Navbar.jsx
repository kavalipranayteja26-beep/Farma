import React from 'react';
import { useApp } from '../context/AppContext';
import Logo from './Logo';
import { ShoppingBag, Truck, UserCheck, Navigation, PlusCircle, Store, ShieldCheck, LogOut, Wallet, Tag, User } from 'lucide-react';

const Navbar = () => {
  const { 
    userRole, 
    user, 
    logoutUser,
    cart, 
    setIsCartOpen, 
    setIsLoginModalOpen, 
    setIsProfileModalOpen,
    setIsWalletModalOpen,
    setIsOffersModalOpen,
    setIsAddProductOpen,
    activeDeliveryOrder,
    setIsOrderTrackingOpen
  } = useApp();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Motive */}
          <div className="flex-shrink-0">
            <Logo size="md" showTagline={true} variant="light" />
          </div>

          {/* Active Role Lock Indicator Badge */}
          {userRole && (
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800">
              {userRole === 'farmer' ? (
                <>
                  <Store className="w-4 h-4 text-emerald-700" />
                  <span>Farmer Portal • {user?.name}</span>
                </>
              ) : userRole === 'delivery' ? (
                <>
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>Delivery Partner • {user?.name}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Customer Marketplace</span>
                </>
              )}
            </div>
          )}

          {/* Action Controls */}
          <div className="flex items-center gap-2.5">
            
            {/* Customer Specific FarmaWallet Balance Button */}
            {userRole === 'customer' && user && (
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-950 border border-amber-300 hover:bg-amber-100 transition-colors text-xs font-bold shadow-sm"
              >
                <Wallet className="w-4 h-4 text-amber-600" />
                <span>₹{user.walletBalance}</span>
              </button>
            )}

            {/* Offers & Coupons Trigger */}
            {userRole === 'customer' && (
              <button
                onClick={() => setIsOffersModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors text-xs font-bold"
              >
                <Tag className="w-4 h-4 text-emerald-600" />
                <span>Offers</span>
              </button>
            )}

            {/* Active Live Tracking Indicator */}
            {activeDeliveryOrder && userRole === 'customer' && (
              <button
                onClick={() => setIsOrderTrackingOpen(true)}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-bold animate-pulse hover:bg-emerald-100 transition-colors"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                </span>
                <Navigation className="w-3.5 h-3.5" />
                <span>Track Order #{activeDeliveryOrder.id}</span>
              </button>
            )}

            {/* Farmer Specific Quick Action: Add Produce */}
            {userRole === 'farmer' && (
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="btn-primary text-xs sm:text-sm py-2 px-4 shadow-emerald-700/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Produce</span>
              </button>
            )}

            {/* Customer Cart Trigger */}
            {userRole === 'customer' && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md text-sm font-semibold"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Cart</span>
                {totalCartCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 text-[11px] font-bold bg-emerald-500 text-white rounded-full">
                    {totalCartCount}
                  </span>
                )}
              </button>
            )}

            {/* User Profile Modal Trigger */}
            {user ? (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors"
              >
                <img 
                  src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'} 
                  alt={user.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="hidden sm:inline max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="btn-primary text-xs py-2 px-4"
              >
                <span>Sign In</span>
              </button>
            )}

            {/* Logout / Switch Role Button */}
            {userRole && (
              <button
                onClick={logoutUser}
                className="p-2 rounded-full border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-300 transition-colors"
                title="Logout / Switch Role"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;
