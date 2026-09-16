import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ProductCard from './ProductCard';
import { ArrowLeft, Star, ShieldCheck, MapPin, Phone, Award, Sparkles, Heart } from 'lucide-react';

const FarmDetail = ({ farmId, onBack }) => {
  const { farms, products } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const farm = farms.find(f => f.id === farmId) || farms[0];
  const farmProducts = products.filter(p => p.farmId === farm.id);

  const filteredProducts = selectedCategory === 'all'
    ? farmProducts
    : farmProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Farms</span>
      </button>

      {/* Farm Banner Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-md">
        <img 
          src={farm.banner} 
          alt={farm.name} 
          className="w-full h-64 sm:h-80 object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 text-white">
          <div className="flex items-start gap-4">
            <img 
              src={farm.image} 
              alt={farm.farmerName} 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white/20 shadow-lg flex-shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-emerald-500/90 text-white font-bold text-xs px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Organic Certified</span>
                </span>
                <span className="bg-amber-400 text-slate-900 font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current text-slate-900" />
                  <span>{farm.rating} ({farm.reviewsCount} ratings)</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-outfit text-white tracking-tight">
                {farm.name}
              </h1>
              <p className="text-emerald-200 text-xs sm:text-sm font-medium flex items-center gap-2">
                <span>Owned by {farm.farmerName}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {farm.location} ({farm.distance})</span>
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl max-w-sm text-xs space-y-1 text-emerald-100">
            <div className="font-bold text-white flex items-center gap-1.5 text-xs">
              <Heart className="w-4 h-4 text-emerald-400" />
              <span>Medicinal Quality Motive</span>
            </div>
            <p className="text-[11px] leading-snug opacity-90 italic">"{farm.motiveNote}"</p>
          </div>
        </div>
      </div>

      {/* Organic Certification Banner */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-emerald-700 flex-shrink-0" />
          <div>
            <div className="text-xs font-bold text-emerald-900">Verified Organic Farm Credentials</div>
            <div className="text-[11px] text-emerald-700 font-medium">Govt License: {farm.certNumber} • Direct Farmer Desired Rates</div>
          </div>
        </div>
        <span className="hidden sm:inline-block px-3 py-1 bg-white text-emerald-800 border border-emerald-300 rounded-full text-xs font-semibold">
          No Middlemen • Direct Harvest
        </span>
      </div>

      {/* Catalog Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold font-outfit text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>Farm Fresh Products ({filteredProducts.length})</span>
          </h2>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500">
            No products found in this category for {farm.name}.
          </div>
        )}
      </div>

    </div>
  );
};

export default FarmDetail;
