import React, { useState } from 'react';
import { Product } from '../types';
import { 
  Heart, 
  ShoppingBag, 
  Eye, 
  Star, 
  Clock, 
  Sparkles,
  Check
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onAddToCart
}) => {
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div 
      onClick={() => onQuickView(product)}
      className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden hover:border-amber-700/40 hover:shadow-xl hover:shadow-stone-900/5 transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isUniquePiece && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-900/90 text-amber-300 text-[11px] font-bold tracking-wide uppercase shadow-sm backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Pièce Unique
            </span>
          )}
          {!product.isUniquePiece && product.isLimitedEdition && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-950/90 text-emerald-300 text-[11px] font-bold uppercase shadow-sm backdrop-blur-xs">
              Série Limitée
            </span>
          )}
          {product.isBestseller && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-900/90 text-amber-100 text-[11px] font-bold uppercase shadow-sm backdrop-blur-xs">
              Favori des clients
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-md scale-110'
              : 'bg-white/85 text-stone-600 hover:text-rose-600 hover:bg-white shadow-xs backdrop-blur-xs'
          }`}
          title={isWishlisted ? "Retirer de mes favoris" : "Ajouter à mes favoris"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-2 bg-white/95 text-stone-900 text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 hover:bg-white transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Aperçu rapide & Histoire
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Crafting Time */}
          <div className="flex items-center justify-start text-xs text-stone-500 mb-2 font-medium">
            <span className="inline-flex items-center gap-1 text-stone-500">
              <Clock className="w-3 h-3" />
              {product.craftingTimeHours}h de travail
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-1 mb-1.5">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-stone-600 text-xs leading-relaxed line-clamp-2 mb-3">
            {product.description}
          </p>

          {/* Material Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {product.materials.slice(0, 2).map((mat, idx) => (
              <span 
                key={idx}
                className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-medium border border-stone-200/80"
              >
                {mat}
              </span>
            ))}
          </div>
        </div>

        {/* Footer: Price, Rating & Add to Cart */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-xl font-bold text-stone-950">
                {product.price} $
              </span>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  {product.originalPrice} $
                </span>
              )}
            </div>
            {/* Rating */}
            <div className="flex items-center gap-1 text-[11px] text-amber-700 font-semibold mt-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-stone-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              added
                ? 'bg-emerald-700 text-white'
                : product.inStock
                ? 'bg-stone-900 hover:bg-amber-900 text-stone-50 hover:shadow-md active:scale-95'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
            title={product.inStock ? "Ajouter au panier" : "Épuisé"}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Ajouté</span>
              </>
            ) : product.inStock ? (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </>
            ) : (
              <span>Épuisé</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
