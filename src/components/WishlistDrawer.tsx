import React from 'react';
import { Product } from '../types';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 fill-current" />
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Mes Coups de Cœur
            </h3>
            <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {wishlistProducts.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-lg font-bold text-stone-800">
                Aucun favori enregistré
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Cliquez sur l'icône cœur au survol d'un objet pour le retrouver facilement ici.
              </p>
            </div>
          ) : (
            wishlistProducts.map((p) => (
              <div
                key={p.id}
                className="flex gap-4 p-3 bg-stone-50 border border-stone-200 rounded-2xl items-center"
              >
                <img
                  src={p.images[0]}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover rounded-xl shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-sm font-bold text-stone-900 truncate">
                    {p.name}
                  </h4>
                  <p className="text-xs text-amber-900 font-bold">{p.price} $</p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        onAddToCart(p);
                        onRemoveFromWishlist(p);
                      }}
                      className="px-3 py-1 bg-stone-900 hover:bg-amber-900 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Ajouter au panier</span>
                    </button>

                    <button
                      onClick={() => onRemoveFromWishlist(p)}
                      className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                      title="Retirer des favoris"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-200 bg-stone-50/80 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 bg-stone-900 text-white font-bold rounded-xl text-xs hover:bg-stone-800 transition-colors"
          >
            Continuer la Navigation
          </button>
        </div>

      </div>
    </div>
  );
};
