import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_FARMS, INITIAL_PRODUCTS, INITIAL_ORDERS, DEMO_DELIVERY_BOY } from '../data/mockData';

const AppContext = createContext();

export const INITIAL_COUPONS = [
  { code: 'FARMAHEALTH', discount: 50, type: 'flat', minOrder: 200, desc: 'Flat ₹50 OFF on Organic Medicine Produce' },
  { code: 'PUREA2MILK', discount: 15, type: 'percent', minOrder: 150, desc: '15% OFF Fresh A2 Milk & Dairy' },
  { code: 'ORGANICSPICE', discount: 20, type: 'percent', minOrder: 100, desc: '20% OFF Lakadong Turmeric & Spices' },
  { code: 'FRESHGREEN', discount: 29, type: 'flat', minOrder: 99, desc: 'Free Farm Doorstep Delivery' },
];

export const AppProvider = ({ children }) => {
  // Authentication State
  const [userRole, setUserRole] = useState('customer'); // Default to customer for instant preview, fully switchable
  const [user, setUser] = useState({
    id: 'user-1',
    name: 'Sanjana Rao',
    email: 'sanjana.rao@example.com',
    phone: '+91 98765 43210',
    address: 'Flat 402, Lotus Heights, Green Avenue, Jubilee Hills, Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    role: 'customer',
    walletBalance: 500, // ₹500 initial FarmaWallet credit
    healthPoints: 120,   // Organic Health Points
    savedAddresses: [
      { id: 'addr-1', label: 'Home', text: 'Flat 402, Lotus Heights, Green Avenue, Hyderabad' },
      { id: 'addr-2', label: 'Office', text: 'Plot 12, Bio-Tech Park, Gachibowli, Hyderabad' },
    ]
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);

  // App Data States
  const [farms, setFarms] = useState(INITIAL_FARMS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [cart, setCart] = useState([]);
  const [activeFarmId, setActiveFarmId] = useState(null);

  // Coupons & Wallet State
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [walletTransactions, setWalletTransactions] = useState([
    { id: 'tx-1', type: 'credit', amount: 500, desc: 'Welcome Bonus Credited', date: 'Today' },
    { id: 'tx-2', type: 'debit', amount: 319, desc: 'Paid for Order #FRM-88910', date: 'Today' },
    { id: 'tx-3', type: 'credit', amount: 50, desc: 'Organic Health Cashback', date: 'Yesterday' },
  ]);

  // Delivery partner state
  const [deliveryBoy, setDeliveryBoy] = useState(DEMO_DELIVERY_BOY);
  const [activeDeliveryOrder, setActiveDeliveryOrder] = useState(INITIAL_ORDERS[0]);

  // Modals & UI states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState(INITIAL_ORDERS[0]?.id || null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // User Profile Update
  const updateUserProfile = (updatedFields) => {
    setUser(prev => ({ ...prev, ...updatedFields }));
    addToast('Profile details updated successfully!', 'success');
  };

  // FarmaWallet Operations
  const addWalletMoney = (amount) => {
    const numAmt = parseFloat(amount);
    if (!numAmt || numAmt <= 0) return;

    setUser(prev => ({ ...prev, walletBalance: prev.walletBalance + numAmt }));
    setWalletTransactions(prev => [
      { id: `tx-${Date.now()}`, type: 'credit', amount: numAmt, desc: 'Wallet Top-Up', date: 'Just now' },
      ...prev
    ]);
    addToast(`Added ₹${numAmt} to your FarmaWallet!`, 'success');
  };

  // Coupon Operations
  const applyCouponCode = (code, orderSubtotal) => {
    const coupon = INITIAL_COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) {
      addToast('Invalid coupon code.', 'error');
      return false;
    }

    if (orderSubtotal < coupon.minOrder) {
      addToast(`Coupon requires a minimum order of ₹${coupon.minOrder}`, 'error');
      return false;
    }

    let calculatedDiscount = 0;
    if (coupon.type === 'flat') {
      calculatedDiscount = coupon.discount;
    } else {
      calculatedDiscount = Math.round((orderSubtotal * coupon.discount) / 100);
    }

    setAppliedCoupon({ ...coupon, calculatedDiscount });
    addToast(`🎉 Coupon "${coupon.code}" applied! Saved ₹${calculatedDiscount}`, 'success');
    return true;
  };

  const removeAppliedCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed.');
  };

  // Login Handler
  const loginUser = (role, customUserData = {}) => {
    setUserRole(role);
    
    if (role === 'farmer') {
      const farmerObj = {
        id: 'farm-owner-1',
        name: customUserData.name || 'Ramesh Patel',
        email: customUserData.email || 'ramesh.patel@aaravfarms.com',
        phone: '+91 98765 43210',
        role: 'farmer',
        farmId: 'farm-1',
        farmName: 'Aarav Organic Vedic Dairy & Farms',
        walletBalance: 4850,
      };
      setUser(farmerObj);
      addToast(`Logged in as Farmer (${farmerObj.name}).`, 'info');
    } else if (role === 'delivery') {
      const driverObj = {
        id: deliveryBoy.id,
        name: customUserData.name || deliveryBoy.name,
        email: customUserData.email || deliveryBoy.email,
        phone: deliveryBoy.phone,
        role: 'delivery',
        license: deliveryBoy.licenseNumber,
        walletBalance: 840,
      };
      setUser(driverObj);
      addToast(`Logged in as Delivery Partner (${driverObj.name}).`, 'info');
    } else {
      const customerObj = {
        id: 'user-1',
        name: customUserData.name || 'Sanjana Rao',
        email: customUserData.email || 'sanjana.rao@example.com',
        phone: '+91 98765 43210',
        address: 'Flat 402, Lotus Heights, Green Avenue, Hyderabad',
        role: 'customer',
        walletBalance: 500,
        healthPoints: 120,
      };
      setUser(customerObj);
      addToast(`Logged in as Customer (${customerObj.name}).`, 'info');
    }

    setIsLoginModalOpen(false);
  };

  const registerUser = (role, data) => {
    setUserRole(role);

    if (role === 'farmer') {
      const newFarmId = `farm-${Date.now()}`;
      const newFarm = {
        id: newFarmId,
        name: data.farmName || 'My Organic Farm',
        farmerName: data.name || 'Farmer Owner',
        phone: data.phone || '+91 98765 43210',
        location: data.location || 'Green Acres Bio Zone',
        distance: '1.5 km away',
        rating: 5.0,
        reviewsCount: 1,
        organicCertified: true,
        certNumber: data.certNumber || `ORG-IND-${Math.floor(1000 + Math.random() * 9000)}`,
        specialty: data.specialty || 'Fresh Dairy, Spices & Organic Greens',
        motiveNote: 'Pure organic harvest — farm fresh products as medicine.',
        image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=800',
        banner: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=1200',
        deliveryTime: '20-30 mins',
      };

      setFarms(prev => [newFarm, ...prev]);

      const farmerObj = {
        id: `farmer-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: 'farmer',
        farmId: newFarmId,
        farmName: newFarm.name,
        walletBalance: 0,
      };

      setUser(farmerObj);
      addToast(`🎉 Welcome ${data.name}! Farm "${newFarm.name}" registered!`, 'success');
    } else if (role === 'delivery') {
      const updatedDriver = {
        id: `del-${Date.now()}`,
        name: data.name,
        phone: data.phone || '+91 99887 76655',
        email: data.email,
        vehicleType: data.vehicleType || 'Electric Scooter',
        vehicleNumber: data.vehicleNumber || 'TS 09 EQ 4412',
        licenseNumber: data.licenseNumber || 'DL-IND-2026-99120',
        idVerified: true,
        rating: 5.0,
        deliveriesCompleted: 0,
        todayEarnings: 0,
        isOnline: true,
        locationPermission: true,
      };

      setDeliveryBoy(updatedDriver);
      setUser({
        id: updatedDriver.id,
        name: updatedDriver.name,
        email: updatedDriver.email,
        phone: updatedDriver.phone,
        role: 'delivery',
        license: updatedDriver.licenseNumber,
        walletBalance: 0,
      });

      addToast(`🎉 Welcome Driver ${data.name}! License verified!`, 'success');
    } else {
      const customerObj = {
        id: `cust-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone || '+91 98765 43210',
        address: data.address || 'Flat 402, Lotus Heights, Hyderabad',
        role: 'customer',
        walletBalance: 500,
        healthPoints: 50,
      };

      setUser(customerObj);
      addToast(`🎉 Registration successful! Welcome, ${data.name}!`, 'success');
    }

    setIsLoginModalOpen(false);
  };

  const logoutUser = () => {
    setUserRole(null);
    setUser(null);
    setCart([]);
    setIsLoginModalOpen(true);
    addToast('Logged out. Select a role to proceed.', 'info');
  };

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    if (userRole !== 'customer') {
      addToast('Only customer accounts can add items to cart.', 'error');
      return;
    }

    if (cart.length > 0 && cart[0].farmId !== product.farmId) {
      if (!window.confirm(`Your cart contains products from "${cart[0].farmName}". Clear cart to add products from "${product.farmName}"?`)) {
        return;
      }
      setCart([{ ...product, quantity }]);
      setActiveFarmId(product.farmId);
      addToast(`Cart cleared & added ${product.name}!`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setActiveFarmId(product.farmId);
    addToast(`Added ${product.name} to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const updated = prev.filter(item => item.id !== productId);
      if (updated.length === 0) setActiveFarmId(null);
      return updated;
    });
  };

  const updateCartQty = (productId, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
    setActiveFarmId(null);
    setAppliedCoupon(null);
  };

  // Product Management (Farmer Action)
  const addProduct = (newProdData) => {
    const newProd = {
      id: `prod-${Date.now()}`,
      farmId: newProdData.farmId || (user ? user.farmId : 'farm-1'),
      farmName: newProdData.farmName || (user ? user.farmName : 'Aarav Organic Vedic Dairy & Farms'),
      rating: 5.0,
      isAvailable: true,
      ...newProdData,
      price: parseFloat(newProdData.price),
      originalPrice: newProdData.originalPrice ? parseFloat(newProdData.originalPrice) : parseFloat(newProdData.price) * 1.2,
      discountPercent: newProdData.discountPercent ? parseInt(newProdData.discountPercent) : 15,
    };

    setProducts(prev => [newProd, ...prev]);
    addToast(`Added "${newProd.name}" to farm store!`);
  };

  const toggleProductAvailability = (productId) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p));
    addToast('Product availability updated.');
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    addToast('Product removed from store.');
  };

  // Order Placement (with FarmaWallet option & Health Points reward)
  const placeOrder = (orderData) => {
    const farmObj = farms.find(f => f.id === orderData.farmId) || farms[0];
    
    // Deduct from FarmaWallet if paid via Wallet
    if (orderData.paymentMethod.includes('Wallet')) {
      if (user.walletBalance < orderData.grandTotal) {
        addToast('Insufficient FarmaWallet balance. Please top-up or choose another method.', 'error');
        return false;
      }

      setUser(prev => ({ ...prev, walletBalance: prev.walletBalance - orderData.grandTotal }));
      setWalletTransactions(prev => [
        { id: `tx-${Date.now()}`, type: 'debit', amount: orderData.grandTotal, desc: `Payment for Order #${orderData.id || 'NEW'}`, date: 'Just now' },
        ...prev
      ]);
    }

    // Award Health Points (1 Point per ₹10 spent)
    const earnedPoints = Math.floor(orderData.grandTotal / 10);
    setUser(prev => ({ ...prev, healthPoints: (prev.healthPoints || 0) + earnedPoints }));

    const newOrder = {
      id: `FRM-${Math.floor(10000 + Math.random() * 90000)}`,
      customerId: user ? user.id : 'cust-1',
      customerName: user ? user.name : 'Sanjana Rao',
      customerPhone: orderData.phone || user?.phone || '+91 98765 43210',
      deliveryAddress: orderData.address || user?.address,
      farmId: farmObj.id,
      farmName: farmObj.name,
      farmLocation: farmObj.location,
      items: cart.map(c => ({ id: c.id, name: c.name, price: c.price, quantity: c.quantity, unit: c.unit })),
      itemTotal: orderData.itemTotal,
      deliveryFee: orderData.deliveryFee,
      discountAmount: orderData.discountAmount,
      grandTotal: orderData.grandTotal,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'PAID',
      status: 'placed',
      orderTime: 'Just now',
      eta: '25-30 mins',
      deliveryPartner: {
        id: deliveryBoy.id,
        name: deliveryBoy.name,
        phone: deliveryBoy.phone,
        vehicle: `${deliveryBoy.vehicleType} (${deliveryBoy.vehicleNumber})`,
        license: deliveryBoy.licenseNumber,
        rating: deliveryBoy.rating,
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        etaToFarm: '5-8 mins to pickup',
      },
      handoutChecklist: cart.map(c => ({
        name: c.name,
        qty: c.quantity,
        unit: c.unit,
        isPacked: true,
      })),
      handoverStatus: 'Pending Pickup',
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveDeliveryOrder(newOrder);
    setTrackingOrderId(newOrder.id);
    clearCart();
    setIsCheckoutOpen(false);
    setIsOrderTrackingOpen(true);
    addToast(`🎉 Order placed! You earned +${earnedPoints} Farma Health Points!`, 'success');
    return true;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const isHandedOver = newStatus === 'on_the_way' || newStatus === 'delivered';
        return { 
          ...o, 
          status: newStatus,
          handoverStatus: isHandedOver ? 'Handed Over to Driver' : o.handoverStatus 
        };
      }
      return o;
    }));

    if (activeDeliveryOrder?.id === orderId) {
      setActiveDeliveryOrder(prev => ({ 
        ...prev, 
        status: newStatus,
        handoverStatus: (newStatus === 'on_the_way' || newStatus === 'delivered') ? 'Handed Over to Driver' : prev.handoverStatus
      }));
    }
    addToast(`Order status updated to: ${newStatus.replace('_', ' ').toUpperCase()}`);
  };

  return (
    <AppContext.Provider value={{
      userRole,
      setUserRole,
      user,
      setUser,
      updateUserProfile,
      loginUser,
      registerUser,
      logoutUser,
      // Wallet & Rewards
      addWalletMoney,
      walletTransactions,
      appliedCoupon,
      applyCouponCode,
      removeAppliedCoupon,
      // Data
      farms,
      setFarms,
      products,
      setProducts,
      orders,
      setOrders,
      cart,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      activeFarmId,
      deliveryBoy,
      setDeliveryBoy,
      activeDeliveryOrder,
      setActiveDeliveryOrder,
      addProduct,
      toggleProductAvailability,
      deleteProduct,
      placeOrder,
      updateOrderStatus,
      // Modals
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      isAddProductOpen,
      setIsAddProductOpen,
      isLoginModalOpen,
      setIsLoginModalOpen,
      isProfileModalOpen,
      setIsProfileModalOpen,
      isWalletModalOpen,
      setIsWalletModalOpen,
      isOffersModalOpen,
      setIsOffersModalOpen,
      isOrderTrackingOpen,
      setIsOrderTrackingOpen,
      trackingOrderId,
      setTrackingOrderId,
      // Toast
      toasts,
      addToast,
      removeToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
