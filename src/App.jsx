import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import FarmList from './components/Customer/FarmList';
import FarmDetail from './components/Customer/FarmDetail';
import CartModal from './components/Customer/CartModal';
import CheckoutModal from './components/Customer/CheckoutModal';
import OrderTracking from './components/Customer/OrderTracking';
import FarmerDashboard from './components/Farmer/FarmerDashboard';
import AddProductModal from './components/Farmer/AddProductModal';
import DeliveryDashboard from './components/Delivery/DeliveryDashboard';
import LoginModal from './components/Auth/LoginModal';
import Toast from './components/Common/Toast';
import Logo from './components/Logo';
import { Heart, ShieldCheck, Truck, Sparkles, Award } from 'lucide-react';

const MainContent = () => {
  const { userRole } = useApp();
  const [selectedFarmId, setSelectedFarmId] = useState(null);

  return (
    <main className="min-h-[calc(100vh-80px-200px)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {userRole === 'customer' && (
        selectedFarmId ? (
          <FarmDetail farmId={selectedFarmId} onBack={() => setSelectedFarmId(null)} />
        ) : (
          <FarmList onSelectFarm={(farmId) => setSelectedFarmId(farmId)} />
        )
      )}

      {userRole === 'farmer' && (
        <FarmerDashboard />
      )}

      {userRole === 'delivery' && (
        <DeliveryDashboard />
      )}
    </main>
  );
};

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-[#FAFBF8] text-slate-800 font-sans">
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Dynamic Main Body View */}
        <MainContent />

        {/* Global Modals */}
        <CartModal />
        <CheckoutModal />
        <OrderTracking />
        <AddProductModal />
        <LoginModal />

        {/* Floating Toast Notification Stack */}
        <Toast />

        {/* Footer */}
        <footer className="mt-auto bg-slate-950 text-white border-t border-slate-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
              <Logo size="lg" showTagline={true} variant="dark" />
              
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-emerald-300">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Verified Organic Farms</span>
                <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-amber-400" /> Insulated Cold-Chain Delivery</span>
                <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-amber-400" /> Direct Farmer Desired Rates</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <p>© 2026 Farma Inc. Motive: "Farm products are like medicines". Direct Farm Marketplace.</p>
              <div className="flex gap-4">
                <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#terms" className="hover:text-white transition-colors">Farmer Terms</a>
                <a href="#delivery" className="hover:text-white transition-colors">Delivery Partner License Policy</a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </AppProvider>
  );
}

export default App;
