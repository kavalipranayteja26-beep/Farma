import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ProductCard from './ProductCard';
import { CATEGORIES } from '../../data/mockData';
import { Search, Star, MapPin, ShieldCheck, Heart, Sparkles, Filter, Milk, Flame, Carrot, Apple, Leaf, Store } from 'lucide-react';

const iconMap = {
  Sparkles,
  Milk,
  Flame,
  Carrot,
  Apple,
  Leaf
};

const FarmList = ({ onSelectFarm }) => {
  const { farms, products } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('farms'); // 'farms' or 'products'

  // Filter products by category & search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.farmName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter farms by search
  const filteredFarms = farms.filter(farm => {
    const matchesSearch = farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          farm.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Motive Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 sm:p-10 shadow-lg">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/90 text-slate-950 text-xs font-extrabold tracking-wide shadow-sm uppercase">
            <Heart className="w-3.5 h-3.5 text-slate-950 fill-current" />
            <span>Nature's Pharmacy Motive</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-outfit tracking-tight leading-tight">
            Farm Fresh Products, <br />
            <span className="text-amber-300 underline decoration-amber-400/50">Pure as Medicine</span>
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl">
            Skip chemical preservatives and middlemen. Connect directly with verified local farmers for 100% pure A2 milk, high-curcumin turmeric, organic paneer, zero-carbide fruits & same-day harvested leafy greens at farmer-desired prices.
          </p>

          {/* Quick Motive Pills */}
          <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-emerald-200">
              🥛 100% Antibiotic-Free Milk
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-emerald-200">
              🌿 7.5% High Curcumin Turmeric
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-emerald-200">
              🚚 30-Min Realtime GPS Doorstep Delivery
            </span>
          </div>
        </div>
      </section>

      {/* Search & Category Filter Section */}
      <div className="space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search milk, paneer, turmeric, leafy greens, or farm name..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-sm"
            />
          </div>

          {/* Toggle View Mode: Farms vs Products */}
          <div className="flex items-center p-1 bg-slate-200/80 rounded-2xl self-start md:self-auto text-xs font-semibold">
            <button
              onClick={() => setViewMode('farms')}
              className={`px-4 py-2 rounded-xl transition-all ${
                viewMode === 'farms' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              🏡 Browse Farms ({farms.length})
            </button>
            <button
              onClick={() => setViewMode('products')}
              className={`px-4 py-2 rounded-xl transition-all ${
                viewMode === 'products' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              🥦 All Products ({products.length})
            </button>
          </div>

        </div>

        {/* Categories Pills Horizontal Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => {
            const IconComp = iconMap[cat.icon] || Sparkles;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  if (viewMode === 'farms' && cat.id !== 'all') {
                    setViewMode('products'); // auto switch to products view when specific category clicked
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-sm border ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-emerald-700/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                }`}
              >
                <IconComp className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-emerald-600'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Main Content Area */}
      {viewMode === 'farms' ? (
        
        /* FARMS DIRECTORY VIEW */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-outfit text-slate-800 flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-600" />
              <span>Verified Organic Farms Near You</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Showing {filteredFarms.length} farms</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFarms.map(farm => {
              const farmProds = products.filter(p => p.farmId === farm.id);

              return (
                <div 
                  key={farm.id}
                  onClick={() => onSelectFarm(farm.id)}
                  className="farm-card bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img 
                      src={farm.banner} 
                      alt={farm.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                    {/* Organic Cert Badge */}
                    <div className="absolute top-3 left-3 bg-emerald-600/95 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1 shadow-md">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Certified Organic</span>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-xs font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{farm.rating}</span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold font-outfit drop-shadow-md group-hover:text-emerald-300 transition-colors">
                        {farm.name}
                      </h3>
                      <div className="text-xs text-emerald-200 flex items-center gap-2 font-medium">
                        <span>Farmer: {farm.farmerName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {farm.distance}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-slate-600 font-medium line-clamp-2">
                        <span className="font-bold text-slate-800">Specialty:</span> {farm.specialty}
                      </p>

                      <div className="mt-2 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-100 text-[11px] text-emerald-900 leading-snug flex items-start gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="italic line-clamp-2">"{farm.motiveNote}"</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span className="text-emerald-700 font-bold">{farmProds.length} Products Available</span>
                      <button className="text-emerald-800 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold">
                        <span>Visit Farm Store</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      ) : (

        /* ALL PRODUCTS DIRECT GRID VIEW */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-outfit text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>Direct Farm Products ({filteredProducts.length})</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Filtered by category</span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onSelectFarm={onSelectFarm} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500">
              No agricultural products found matching your search.
            </div>
          )}
        </div>

      )}

    </div>
  );
};

export default FarmList;
