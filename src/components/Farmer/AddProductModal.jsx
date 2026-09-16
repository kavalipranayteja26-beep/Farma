import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, PlusCircle, Sparkles, Heart, Tag, Package, DollarSign } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';

const IMAGE_PRESETS = [
  { label: 'Milk Glass Bottle', url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=600' },
  { label: 'Fresh Malai Paneer', url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=600' },
  { label: 'Turmeric Powder', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600' },
  { label: 'Leafy Spinach (Palak)', url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=600' },
  { label: 'Organic Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600' },
  { label: 'Fresh Pomegranates', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600' },
];

const AddProductModal = () => {
  const { isAddProductOpen, setIsAddProductOpen, addProduct, user } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('dairy');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [unit, setUnit] = useState('1 Litre Bottle');
  const [stock, setStock] = useState('50');
  const [harvestTime, setHarvestTime] = useState('Fresh Morning Batch (5:00 AM)');
  const [healthBenefit, setHealthBenefit] = useState('100% Pure & Antibiotic free. Rich in natural nutrients.');
  const [image, setImage] = useState(IMAGE_PRESETS[0].url);

  if (!isAddProductOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) return;

    const discountPercent = originalPrice && parseFloat(originalPrice) > parseFloat(price)
      ? Math.round(((parseFloat(originalPrice) - parseFloat(price)) / parseFloat(originalPrice)) * 100)
      : 15;

    addProduct({
      farmId: user.farmId || 'farm-1',
      farmName: 'Aarav Organic Vedic Dairy & Farms',
      name,
      category,
      price,
      originalPrice: originalPrice || (parseFloat(price) * 1.2).toFixed(0),
      discountPercent,
      unit,
      stock: parseInt(stock),
      harvestTime,
      healthBenefit,
      image,
      offerBadge: `${discountPercent}% OFF • Direct Farmer Rate`,
    });

    // Reset Form
    setName('');
    setPrice('');
    setOriginalPrice('');
    setIsAddProductOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-300" />
            <h2 className="font-bold text-lg font-outfit">Add New Farm Produce</h2>
          </div>
          <button 
            onClick={() => setIsAddProductOpen(false)}
            className="p-1.5 rounded-full hover:bg-emerald-700 text-emerald-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Product Title */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Product Title</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pure Desi A2 Cow Milk, Raw Turmeric, Malai Paneer"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
              >
                {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Unit Metric</label>
              <input 
                type="text" 
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. 1 Litre, 250g, 1 kg"
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Price & Offer Settings */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-emerald-800 block mb-1">Your Price (₹)</label>
              <input 
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 75"
                required
                className="w-full px-3 py-2 rounded-xl border border-emerald-400 bg-emerald-50/50 font-bold text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Original MRP (₹)</label>
              <input 
                type="number" 
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="e.g. 90"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Stock Quantity</label>
              <input 
                type="number" 
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Harvest Timing Note */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Harvest / Batch Freshness Time</label>
            <input 
              type="text" 
              value={harvestTime}
              onChange={(e) => setHarvestTime(e.target.value)}
              placeholder="e.g. Harvested 1 hour ago / Fresh Morning Batch"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Medicinal Health Motive Note */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-emerald-600" />
              <span>Medicinal Health Benefit Note</span>
            </label>
            <textarea 
              value={healthBenefit}
              onChange={(e) => setHealthBenefit(e.target.value)}
              rows={2}
              placeholder="e.g. Rich in Curcumin, Zero Antibiotics, Easy Digestibility"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Image Selection Presets */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Select Product Image</label>
            <div className="grid grid-cols-3 gap-2">
              {IMAGE_PRESETS.map((p, i) => (
                <div 
                  key={i}
                  onClick={() => setImage(p.url)}
                  className={`cursor-pointer p-1 rounded-xl border overflow-hidden ${
                    image === p.url ? 'border-emerald-600 ring-2 ring-emerald-300' : 'border-slate-200'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-full h-14 object-cover rounded-lg" />
                  <div className="text-[10px] text-center font-medium truncate mt-1">{p.label}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-3 text-sm font-bold shadow-md shadow-emerald-700/20"
          >
            <span>Publish Product to Store</span>
          </button>

        </form>

      </div>

    </div>
  );
};

export default AddProductModal;
