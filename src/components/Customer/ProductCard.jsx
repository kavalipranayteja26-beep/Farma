import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Check, Heart, ShieldAlert, Sparkles, Clock } from 'lucide-react';

const ProductCard = ({ product, onSelectFarm }) => {
  const { addToCart, cart } = useApp();

  const cartItem = cart.find(item => item.id === product.id);
  const isInCart = Boolean(cartItem);

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
      
      {/* Product Image & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>

        {/* Offer Discount Badge */}
        {product.discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-amber-500 text-slate-900 font-bold text-xs px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>{product.discountPercent}% OFF</span>
          </div>
        )}

        {/* Harvest Time Badge */}
        {product.harvestTime && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-emerald-900 font-semibold text-[11px] px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-600" />
            <span>{product.harvestTime}</span>
          </div>
        )}

        {/* Farm Name Link Pill */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectFarm) onSelectFarm(product.farmId);
          }}
          className="absolute bottom-2.5 left-3 right-3 text-white text-xs font-semibold truncate cursor-pointer hover:underline flex items-center gap-1 drop-shadow-md"
        >
          <span className="text-emerald-300">🏡</span>
          <span className="truncate">{product.farmName}</span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-slate-800 text-base line-clamp-1 font-outfit group-hover:text-emerald-800 transition-colors">
              {product.name}
            </h3>
          </div>

          {/* Unit Metric */}
          <div className="text-xs text-slate-500 mb-2 font-medium">
            Quantity: <span className="text-slate-700 font-semibold">{product.unit}</span>
          </div>

          {/* Medicinal Health Motive Note */}
          {product.healthBenefit && (
            <div className="mb-3 p-2 rounded-xl bg-emerald-50/80 border border-emerald-100 text-[11px] text-emerald-900 leading-snug flex items-start gap-1.5">
              <Heart className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2">{product.healthBenefit}</span>
            </div>
          )}
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-slate-900 font-outfit">
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold">Farmer Desired Price</span>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              isInCart
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>In Cart ({cartItem.quantity})</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>ADD</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};

export default ProductCard;
