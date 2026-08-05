import React, { useState } from 'react';
import { CartItem } from '../types';
import { PROMO_CODES } from '../data/promos';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  ShieldCheck, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: (appliedPromoCode?: string) => void;
}

const FREE_SHIPPING_THRESHOLD = 80;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Promo code calculation
  let discountAmount = 0;
  let isFreeShippingByPromo = false;

  if (appliedPromo && PROMO_CODES[appliedPromo]) {
    const promo = PROMO_CODES[appliedPromo];
    if (promo.discountType === 'percentage') {
      discountAmount = (subtotal * promo.value) / 100;
    } else if (promo.discountType === 'fixed') {
      discountAmount = promo.value;
    } else if (promo.discountType === 'free_shipping') {
      isFreeShippingByPromo = true;
    }
  }

  const shippingCost = (subtotal >= FREE_SHIPPING_THRESHOLD || isFreeShippingByPromo || items.length === 0) ? 0 : 5.90;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (PROMO_CODES[code]) {
      const promo = PROMO_CODES[code];
      if (promo.minOrderValue && subtotal < promo.minOrderValue) {
        setPromoError(`Le code nécessite un panier minimum de ${promo.minOrderValue} $.`);
        return;
      }
      setAppliedPromo(code);
      setPromoError('');
    } else {
      setPromoError('Code promo non valide. Essayez "ARTISAN10" ou "BIENVENUE".');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-stone-200 bg-stone-50/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-900" />
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Mon Panier
              </h3>
              <span className="bg-stone-200 text-stone-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {items.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-stone-800">
                <Truck className="w-3.5 h-3.5 text-amber-800" />
                {remainingForFreeShipping > 0
                  ? `Plus que ${remainingForFreeShipping.toFixed(0)} $ pour la livraison offerte`
                  : 'Félicitations ! Livraison offerte 🚚'}
              </span>
              <span className="text-amber-900 font-bold">{progressPercent.toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-800 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Drawer Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-lg font-bold text-stone-800">
                Votre panier est vide
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Parcourez nos catégories pour découvrir nos pièces uniques façonnées à la main.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-3 bg-stone-50/80 border border-stone-200/80 rounded-2xl relative group"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover rounded-xl shrink-0 border border-stone-200"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif text-sm font-bold text-stone-900 truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-0.5"
                        title="Supprimer l'article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.customEngraving && (
                      <p className="text-[11px] text-amber-900 font-medium italic bg-amber-100/60 px-2 py-0.5 rounded-md inline-block mt-1">
                        Gravure : "{item.customEngraving}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-1">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-stone-300 rounded-lg bg-white px-1">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 font-bold text-stone-600 hover:text-stone-950 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 font-bold text-stone-600 hover:text-stone-950 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-serif text-sm font-bold text-stone-950">
                      {(item.product.price * item.quantity).toFixed(0)} $
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer: Promos & Order Cost Breakdown */}
        {items.length > 0 && (
          <div className="p-6 border-t border-stone-200 bg-stone-50/80 space-y-4">
            
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Code Promo (ex: ARTISAN10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-xs uppercase text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-stone-100 text-xs font-bold rounded-xl transition-colors"
                >
                  Appliquer
                </button>
              </div>

              {appliedPromo && (
                <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Code "{appliedPromo}" appliqué ({PROMO_CODES[appliedPromo]?.description})
                </p>
              )}
              {promoError && (
                <p className="text-[11px] text-rose-600 font-medium pt-1">
                  {promoError}
                </p>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200">
              <div className="flex justify-between">
                <span>Sous-total articles :</span>
                <span className="font-medium text-stone-900">{subtotal.toFixed(2)} $</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Réduction appliquée :</span>
                  <span>- {discountAmount.toFixed(2)} $</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Frais de livraison :</span>
                {shippingCost === 0 ? (
                  <span className="font-bold text-emerald-700 uppercase text-[10px]">Offerts</span>
                ) : (
                  <span className="font-medium text-stone-900">{shippingCost.toFixed(2)} $</span>
                )}
              </div>

              <div className="flex justify-between pt-2 border-t border-stone-200 text-base font-bold text-stone-950 font-serif">
                <span>Total estimé :</span>
                <span className="text-amber-950">{grandTotal.toFixed(2)} $</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout(appliedPromo || undefined);
              }}
              className="w-full py-4 bg-amber-900 hover:bg-amber-950 text-amber-50 font-bold rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Paiement Sécurisé</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Garantie Satisfait ou Remboursé sous 14 jours</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
