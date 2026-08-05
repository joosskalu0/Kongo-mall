import React, { useState } from 'react';
import { Product, Review } from '../types';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Star, 
  Clock, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Send,
  PenTool,
  Info
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, customization?: string) => void;
  allProducts: Product[];
  onSelectRelated: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  allProducts,
  onSelectRelated
}) => {
  if (!product) return null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState('');
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  // Review Form state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewsList, setReviewsList] = useState<Review[]>(product.reviews || []);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, quantity, customText || undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    const newRev: Review = {
      id: 'rev-' + Date.now(),
      author: reviewAuthor.trim(),
      rating: reviewRating,
      date: 'Aujourd’hui',
      comment: reviewComment.trim(),
      verifiedPurchase: true
    };

    setReviewsList([newRev, ...reviewsList]);
    setReviewAuthor('');
    setReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-stone-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-auto flex flex-col max-h-[92vh]">
        
        {/* Sticky Top Close Bar */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-1 rounded-md">
              {product.categoryLabel}
            </span>
            {product.isUniquePiece && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-stone-900 px-2.5 py-1 rounded-md">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Pièce Unique
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Left: Gallery */}
            <div className="space-y-4">
              <div className="aspect-4/3 w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 relative group">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-300"
                />
                
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`absolute top-4 right-4 p-3 rounded-full transition-all shadow-md ${
                    isWishlisted ? 'bg-rose-50 text-rose-600' : 'bg-white/90 text-stone-700 hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImageIndex === idx ? 'border-amber-900 ring-2 ring-amber-900/20' : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Aperçu ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Crafting Specs Box */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs space-y-2 text-stone-700">
                <div className="flex items-center justify-between font-semibold border-b border-stone-200/80 pb-2">
                  <span className="text-amber-900 font-serif text-sm">Fiche d'Artisanat</span>
                  <span className="text-stone-500 font-normal">Savoir-faire garanti</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div>
                    <span className="text-stone-400 block">Temps de confection</span>
                    <strong className="text-stone-900 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-800" />
                      {product.craftingTimeHours}h d'atelier
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Dimensions</span>
                    <strong className="text-stone-900 font-medium">{product.dimensions}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Poids</span>
                    <strong className="text-stone-900 font-medium">{product.weight}</strong>
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Info & Purchase */}
            <div className="space-y-6">
              
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-stone-900">{product.rating}</span>
                  </div>
                  <span className="text-stone-300">•</span>
                  <button 
                    onClick={() => setActiveTab('reviews')}
                    className="text-stone-600 hover:text-amber-900 underline text-xs font-medium"
                  >
                    {reviewsList.length} avis certifiés
                  </button>
                  <span className="text-stone-300">•</span>
                  <span className="text-emerald-700 font-medium text-xs flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    En stock ({product.stockCount} disponible{product.stockCount > 1 ? 's' : ''})
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="font-serif text-3xl font-bold text-stone-950">
                  {product.price} $
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    {product.originalPrice} $
                  </span>
                )}
                <span className="ml-auto text-[11px] text-stone-500">
                  TVA incluse • Livraison calculée au panier
                </span>
              </div>

              {/* Story */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  L'Histoire du Façonnage
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic bg-amber-50/50 p-3 rounded-xl border border-amber-200/50">
                  "{product.story}"
                </p>
              </div>

              {/* Materials */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Matériaux d'Origine
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {product.materials.map((mat, idx) => (
                    <span key={idx} className="px-3 py-1 bg-stone-100 border border-stone-200 rounded-lg text-xs font-medium text-stone-800">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Customization Input if applicable */}
              {product.customizable && (
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                  <label className="block text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5 text-amber-800" />
                    Personnalisation Gratuite (Optionnel)
                  </label>
                  <p className="text-[11px] text-stone-500">
                    {product.customizationPlaceholder || 'Indiquez votre texte ou initiales à inscrire.'}
                  </p>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Ex: Initiales A.B. ou Date de mariage 14.07.26"
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                  />
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-stone-300 rounded-xl bg-white p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 font-bold text-stone-600 hover:text-stone-950 flex items-center justify-center rounded-lg hover:bg-stone-100"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                      className="w-8 h-8 font-bold text-stone-600 hover:text-stone-950 flex items-center justify-center rounded-lg hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={`flex-1 py-3.5 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                      added
                        ? 'bg-emerald-700 text-white'
                        : 'bg-stone-900 hover:bg-amber-900 text-white hover:shadow-lg active:scale-98'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-5 h-5 text-emerald-200" />
                        <span>Ajouté au Panier !</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>Ajouter au Panier • {(product.price * quantity).toFixed(0)} €</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Guarantees */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-200 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>Expédié sous 48h en carton renforcé</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>Garantie réparation atelier à vie</span>
                </div>
              </div>

            </div>

          </div>

          {/* Tabs: Details vs Reviews */}
          <div className="pt-8 border-t border-stone-200">
            <div className="flex gap-6 border-b border-stone-200 text-sm font-medium mb-6">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-3 transition-colors ${
                  activeTab === 'details' ? 'border-b-2 border-amber-900 text-amber-900 font-bold' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Description complète & Entretien
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 transition-colors ${
                  activeTab === 'reviews' ? 'border-b-2 border-amber-900 text-amber-900 font-bold' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Avis Clients ({reviewsList.length})
              </button>
            </div>

            {activeTab === 'details' ? (
              <div className="prose prose-stone text-xs sm:text-sm space-y-4 text-stone-600">
                <p>{product.description}</p>
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <h5 className="font-bold text-stone-900 mb-1 text-xs">Conseils d'entretien :</h5>
                  <p className="text-xs text-stone-600">
                    Pour conserver l'éclat des matières naturelles, évitez les produits chimiques agressifs. Un chiffon doux légèrement humide ou une goutte d'huile naturelle régénère le bois et le cuir.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Review Submit Form */}
                <form onSubmit={handleAddReview} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                  <h4 className="font-serif text-base font-bold text-stone-900">
                    Déposer un avis sur cette création
                  </h4>
                  
                  {reviewSubmitted && (
                    <div className="p-3 bg-emerald-100 text-emerald-900 text-xs rounded-xl font-medium flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-700" />
                      Merci ! Votre avis certifié a été publié.
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Votre Prénom ou Nom"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      required
                      className="px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-stone-300 rounded-xl">
                      <span className="text-xs text-stone-500 font-medium">Note :</span>
                      <div className="flex gap-1 text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="focus:outline-none"
                          >
                            <Star className={`w-4 h-4 ${star <= reviewRating ? 'fill-current text-amber-400' : 'text-stone-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Partagez votre expérience (qualité de fabrication, emballage...)"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                  />

                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-900 text-white rounded-xl text-xs font-bold hover:bg-amber-950 transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Publier l'avis
                  </button>
                </form>

                {/* Review List */}
                <div className="space-y-3">
                  {reviewsList.length === 0 ? (
                    <p className="text-stone-400 text-xs italic">Aucun avis pour l'instant. Soyez le premier à partager votre ressenti !</p>
                  ) : (
                    reviewsList.map((rev) => (
                      <div key={rev.id} className="p-4 bg-white border border-stone-200 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-stone-900">{rev.author}</span>
                          <span className="text-[10px] text-stone-400">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-stone-200'}`} />
                          ))}
                          {rev.verifiedPurchase && (
                            <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-md font-semibold">
                              Achat Vérifié
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 pt-1 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="pt-8 border-t border-stone-200">
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-4">
                Dans la même catégorie
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center gap-3 cursor-pointer hover:border-amber-700/50 hover:bg-stone-100 transition-all"
                  >
                    <img
                      src={rel.images[0]}
                      alt={rel.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 object-cover rounded-lg shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-serif text-xs font-bold text-stone-900 truncate">
                        {rel.name}
                      </h4>
                      <p className="text-xs text-stone-600 font-bold">{rel.price} €</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
