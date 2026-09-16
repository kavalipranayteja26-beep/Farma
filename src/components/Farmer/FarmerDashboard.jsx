import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Store, 
  PlusCircle, 
  ShieldCheck, 
  Star, 
  Package, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Trash2, 
  Power, 
  Truck, 
  Phone, 
  MapPin, 
  FileCheck, 
  CheckSquare, 
  Calendar,
  DollarSign
} from 'lucide-react';

const FarmerDashboard = () => {
  const { 
    farms, 
    products, 
    orders, 
    user, 
    setIsAddProductOpen, 
    toggleProductAvailability, 
    deleteProduct, 
    updateOrderStatus 
  } = useApp();

  const [activeTab, setActiveTab] = useState('orders'); // Default to 'orders' to highlight sales & handovers!

  const myFarm = farms.find(f => f.id === (user?.farmId || 'farm-1')) || farms[0];
  const myProducts = products.filter(p => p.farmId === myFarm.id);
  const myOrders = orders.filter(o => o.farmId === myFarm.id || o.farmId === 'farm-1');

  // Calculate Today's Sold metrics
  const todayOrders = myOrders; // All current active/completed orders
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalItemsSoldToday = todayOrders.reduce((sum, o) => {
    return sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);

  const pendingHandoversCount = todayOrders.filter(o => o.status === 'accepted' || o.status === 'packed' || o.status === 'placed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Farmer Store Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-6 sm:p-8 shadow-lg">
        <img 
          src={myFarm.banner} 
          alt={myFarm.name} 
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src={myFarm.image} 
              alt={myFarm.farmerName} 
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white/20 shadow-md flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Organic Farmer</span>
                </span>
                <span className="px-2.5 py-1 bg-amber-400 text-slate-950 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{myFarm.rating} Rating</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white">
                {myFarm.name}
              </h1>
              <p className="text-emerald-200 text-xs sm:text-sm">
                Owner: <strong className="text-white font-bold">{myFarm.farmerName}</strong> • License: {myFarm.certNumber}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddProductOpen(true)}
            className="btn-primary py-3 px-6 text-sm font-bold shadow-lg shadow-emerald-700/30 self-start md:self-auto"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Produce Item</span>
          </button>
        </div>
      </div>

      {/* TODAY'S SALES & EARNINGS METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Money Earned Today */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Money Earned Today</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-outfit">₹{todayRevenue}</div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Today's Net Direct Earnings</span>
          </div>
        </div>

        {/* Quantity Sold Today */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-4 h-4 text-amber-600" />
            <span>Items Sold Today</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">{totalItemsSoldToday} Units</div>
          <div className="text-[11px] text-slate-500 font-medium">Milk, Paneer, Turmeric & Greens</div>
        </div>

        {/* Pending Driver Handovers */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Pending Driver Handovers</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-outfit">{pendingHandoversCount} Packages</div>
          <div className="text-[11px] text-amber-800 font-medium">Waiting for Driver Pickup</div>
        </div>

        {/* Store Products Count */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Store className="w-4 h-4 text-emerald-600" />
            <span>Active Store Produce</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">{myProducts.length} Products</div>
          <div className="text-[11px] text-emerald-700 font-semibold">Desired Farmer Prices</div>
        </div>

      </div>

      {/* Tabs Selector: Orders vs Products */}
      <div className="border-b border-slate-200 flex gap-4 text-sm font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-emerald-700 text-emerald-800 font-extrabold text-base'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Incoming Customer Orders & Driver Handovers ({myOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'products'
              ? 'border-emerald-700 text-emerald-800 font-extrabold text-base'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>My Produce Catalog & Rates ({myProducts.length})</span>
        </button>
      </div>

      {/* TAB 1: ORDERS, DRIVER DETAILS & HANDOVER CHECKLIST */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-outfit text-slate-800">
              Customer Orders & Delivery Partner Handover Details
            </h3>
            <span className="text-xs text-slate-500 font-medium">Reflected live in real-time</span>
          </div>

          <div className="space-y-6">
            {myOrders.map(order => {
              const driver = order.deliveryPartner || {
                name: 'Kiran Kumar',
                phone: '+91 99887 76655',
                vehicle: 'Electric Scooter (TS 09 EQ 4412)',
                license: 'DL-IND-2022-771120',
                etaToFarm: '5-8 mins away',
              };

              return (
                <div 
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5 hover:shadow-md transition-shadow"
                >
                  
                  {/* Order Top Bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                          Order #{order.id}
                        </span>
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                          Paid: {order.paymentMethod}
                        </span>
                        <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                          order.status === 'delivered'
                            ? 'bg-emerald-700 text-white'
                            : 'bg-amber-500 text-slate-950'
                        }`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-lg font-outfit">
                        Customer: {order.customerName} ({order.customerPhone})
                      </h4>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Doorstep Delivery: {order.deliveryAddress}</span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-extrabold text-emerald-800 font-outfit">₹{order.grandTotal}</div>
                      <div className="text-xs text-emerald-700 font-bold">Farmer Net Revenue</div>
                    </div>
                  </div>

                  {/* Order Items Breakdown */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                    <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                      Customer Product Order List ({order.items.length} items):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="p-2.5 bg-white rounded-xl border border-slate-200 flex justify-between items-center font-medium">
                          <div>
                            <span className="font-bold text-slate-900 text-sm">{item.quantity}x</span> {item.name}
                            <div className="text-[11px] text-slate-500">{item.unit}</div>
                          </div>
                          <span className="font-extrabold text-slate-900">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DRIVER DETAILS & HANDOVER CHECKLIST GRID */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    
                    {/* ASSIGNED DELIVERY BOY INFO BOX */}
                    <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-amber-700" />
                          <span>Assigned Delivery Boy Coming for Pickup</span>
                        </div>
                        <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                          ETA: 5-8 mins
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-xl font-bold shadow-sm">
                            🚚
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{driver.name}</div>
                            <div className="text-xs text-amber-900 font-semibold">{driver.vehicle}</div>
                            <div className="text-[11px] text-slate-600">License: {driver.license}</div>
                          </div>
                        </div>

                        <a 
                          href={`tel:${driver.phone}`}
                          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-700 text-white text-xs font-bold hover:bg-amber-800 transition-colors flex-shrink-0 shadow-sm"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call Driver</span>
                        </a>
                      </div>
                    </div>

                    {/* HANDOVER PACKAGE CHECKLIST BOX */}
                    <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 space-y-3">
                      <div className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-emerald-700" />
                        <span>Package Handout Checklist for Driver Handover</span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        {order.items.map((it, i) => (
                          <div key={i} className="flex items-center gap-2 text-slate-800 font-medium">
                            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                            <span>Pack <strong className="text-emerald-900">{it.quantity}x {it.name}</strong> ({it.unit}) in insulated fresh pouch</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2">
                        {order.status === 'placed' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'accepted')}
                            className="w-full btn-primary text-xs py-2.5 font-bold shadow-md"
                          >
                            Accept Order & Start Packing Items
                          </button>
                        )}

                        {order.status === 'accepted' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'packed')}
                            className="w-full btn-primary text-xs py-2.5 font-bold shadow-md"
                          >
                            Mark Insulated Packing Ready for Driver Pickup
                          </button>
                        )}

                        {order.status === 'packed' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'on_the_way')}
                            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                          >
                            <Truck className="w-4 h-4" />
                            <span>Confirm Package Handover to Driver {driver.name}</span>
                          </button>
                        )}

                        {(order.status === 'on_the_way' || order.status === 'delivered') && (
                          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs text-center flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-700" />
                            <span>Handed Over & Dispatched with Driver {driver.name}</span>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: FARM PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-outfit text-slate-800">Your Agricultural Products & Desired Rates</h3>
            <button 
              onClick={() => setIsAddProductOpen(true)}
              className="text-xs text-emerald-700 font-bold hover:underline"
            >
              + Add New Produce
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProducts.map(product => (
              <div 
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="flex gap-3">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 text-sm font-outfit">{product.name}</h4>
                    <div className="text-xs text-slate-500">{product.unit}</div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-extrabold text-slate-900 text-base">₹{product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-slate-400 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <div>Harvest: <span className="font-semibold text-slate-800">{product.harvestTime}</span></div>
                  <div>Health Note: <span className="font-semibold text-emerald-800">{product.healthBenefit}</span></div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => toggleProductAvailability(product.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      product.isAvailable
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{product.isAvailable ? 'In Stock' : 'Out of Stock'}</span>
                  </button>

                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default FarmerDashboard;
