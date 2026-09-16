import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_FARMS, INITIAL_PRODUCTS, INITIAL_ORDERS, DEMO_DELIVERY_BOY } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication State
  const [userRole, setUserRole] = useState(null); // 'customer' | 'farmer' | 'delivery' | null
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true); // Open initially to ask login/register!

  // App Data States
  const [farms, setFarms] = useState(INITIAL_FARMS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [cart, setCart] = useState([]);
  const [activeFarmId, setActiveFarmId] = useState(null);

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

  // Register New User Handler for Customer, Farmer, or Delivery
  const registerUser = (role, data) => {
    setUserRole(role);

    if (role === 'farmer') {
      const newFarmId = `farm-${Date.now()}`;
      const newFarm = {
        id: newFarmId,
        name: data.farmName || 'My Fresh Organic Farm',
        farmerName: data.name || 'Farmer Owner',
        phone: data.phone || '+91 98765 43210',
        location: data.location || 'Green Valley Acres, Sector 5',
        distance: '1.5 km away',
        rating: 5.0,
        reviewsCount: 1,
        organicCertified: true,
        certNumber: data.certNumber || `ORG-IND-${Math.floor(1000 + Math.random() * 9000)}`,
        specialty: data.specialty || 'Fresh Dairy, Spices & Leafy Vegetables',
        motiveNote: data.motiveNote || 'Pure organic harvest — farm fresh products as medicine.',
        image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=800',
        banner: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=1200',
        deliveryTime: '20-30 mins',
      };

      setFarms(prev => [newFarm, ...prev]);

      const farmerObj = {
        id: `farmer-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: 'farmer',
        farmId: newFarmId,
        farmName: newFarm.name,
      };

      setUser(farmerObj);
      addToast(`🎉 Welcome ${data.name}! Your Farm "${newFarm.name}" is registered & live on Farma!`, 'success');
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
        role: 'delivery',
        license: updatedDriver.licenseNumber,
      });

      addToast(`🎉 Welcome Driver ${data.name}! Driving License verified & logged in!`, 'success');
    } else {
      const customerObj = {
        id: `cust-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone || '+91 98765 43210',
        address: data.address || 'Flat 402, Lotus Heights, Green Avenue, Hyderabad',
        role: 'customer',
      };

      setUser(customerObj);
      addToast(`🎉 Registration successful! Welcome to Farma, ${data.name}!`, 'success');
    }

    setIsLoginModalOpen(false);
  };

  // Existing Login Handler
  const loginUser = (role, customUserData = {}) => {
    setUserRole(role);
    
    if (role === 'farmer') {
      const farmerObj = {
        id: 'farm-owner-1',
        name: customUserData.name || 'Ramesh Patel',
        email: customUserData.email || 'ramesh.patel@aaravfarms.com',
        role: 'farmer',
        farmId: 'farm-1',
        farmName: 'Aarav Organic Vedic Dairy & Farms',
      };
      setUser(farmerObj);
      addToast(`Logged in as Farmer (${farmerObj.name}).`, 'info');
    } else if (role === 'delivery') {
      const driverObj = {
        id: deliveryBoy.id,
        name: customUserData.name || deliveryBoy.name,
        email: customUserData.email || deliveryBoy.email,
        role: 'delivery',
        license: deliveryBoy.licenseNumber,
      };
      setUser(driverObj);
      addToast(`Logged in as Delivery Partner (${driverObj.name}).`, 'info');
    } else {
      const customerObj = {
        id: 'user-1',
        name: customUserData.name || 'Sanjana Rao',
        email: customUserData.email || 'sanjana@example.com',
        role: 'customer',
      };
      setUser(customerObj);
      addToast(`Logged in as Customer (${customerObj.name}).`, 'info');
    }

    setIsLoginModalOpen(false);
  };

  // Logout Handler
  const logoutUser = () => {
    setUserRole(null);
    setUser(null);
    setCart([]);
    setIsLoginModalOpen(true);
    addToast('Logged out. Select a role or create an account to proceed.', 'info');
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
      addToast(`Cart cleared & added ${product.name} from ${product.farmName}!`);
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
    addToast(`Successfully added product "${newProd.name}" to your farm store!`);
  };

  const toggleProductAvailability = (productId) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p));
    addToast('Product availability updated.');
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    addToast('Product removed from store.');
  };

  // Order Placement
  const placeOrder = (orderData) => {
    const farmObj = farms.find(f => f.id === orderData.farmId) || farms[0];
    const newOrder = {
      id: `FRM-${Math.floor(10000 + Math.random() * 90000)}`,
      customerId: user ? user.id : 'cust-1',
      customerName: user ? user.name : 'Sanjana Rao',
      customerPhone: orderData.phone || '+91 98765 43210',
      deliveryAddress: orderData.address,
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
    addToast('🎉 Order placed successfully! Live delivery tracking active.', 'success');
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
      loginUser,
      registerUser,
      logoutUser,
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
