import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Sparkles, 
  Menu, 
  X, 
  Compass, 
  ShieldCheck, 
  Palette,
  Truck,
  PackageCheck,
  Store,
  Lock
} from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenCustomOrder: () => void;
  onOpenAIAdvisor: () => void;
  onOpenOrderTracker: () => void;
  onOpenSellerAdmin: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeSection: string;
  onNavigate: (section: 'catalog' | 'atelier' | 'custom' | 'guarantee') => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenCustomOrder,
  onOpenAIAdvisor,
  onOpenOrderTracker,
  onOpenSellerAdmin,
  searchQuery,
  onSearchChange,
  activeSection,
  onNavigate
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Banner - Eco & Shipping Announcement */}
      <div className="bg-stone-900 text-stone-200 text-xs py-2 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-3 border-b border-stone-800">
        <span className="inline-flex items-center gap-1.5 text-amber-300">
          <Truck className="w-3.5 h-3.5" />
          Livraison offerte dès 80€ d’achat
        </span>
        <span className="hidden sm:inline text-stone-600">•</span>
        <span className="hidden sm:inline-flex items-center gap-1 text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5" />
          100% Fait-main à Kinshasa (RDC) & Emballages locaux durables
        </span>
        <span className="hidden md:inline text-stone-600">•</span>
        <button 
          onClick={onOpenOrderTracker}
          className="hidden md:inline-flex items-center gap-1 text-stone-300 hover:text-amber-300 transition-colors underline underline-offset-2"
        >
          <PackageCheck className="w-3.5 h-3.5" />
          Suivre ma commande
        </button>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Mobile Menu Toggle & Brand Logo */}
            <div className="flex items-center gap-3 lg:gap-8">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-stone-700 hover:text-stone-950 lg:hidden focus:outline-none"
                aria-label="Menu principal"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <button 
                onClick={() => onNavigate('catalog')}
                className="flex items-center gap-3 text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-900 text-amber-100 flex items-center justify-center font-serif text-xl font-extrabold shadow-sm group-hover:bg-amber-950 transition-colors">
                  K
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 block leading-none">
                    Kongo Mall
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-amber-800 font-semibold block mt-1">
                    Artisanat & Fait-Main RDC
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-700">
              <button
                onClick={() => onNavigate('catalog')}
                className={`transition-colors hover:text-amber-900 ${
                  activeSection === 'catalog' ? 'text-amber-900 font-semibold border-b-2 border-amber-800 pb-1' : ''
                }`}
              >
                Catalogue Artisanal
              </button>

              <button
                onClick={onOpenCustomOrder}
                className="flex items-center gap-1.5 transition-colors text-stone-800 hover:text-amber-900 font-medium"
              >
                <Palette className="w-4 h-4 text-amber-700" />
                Sur-Mesure
              </button>

              <button
                onClick={() => onNavigate('atelier')}
                className={`transition-colors hover:text-amber-900 ${
                  activeSection === 'atelier' ? 'text-amber-900 font-semibold border-b-2 border-amber-800 pb-1' : ''
                }`}
              >
                L'Atelier & Histoire
              </button>

              <button
                onClick={() => onNavigate('guarantee')}
                className={`transition-colors hover:text-amber-900 ${
                  activeSection === 'guarantee' ? 'text-amber-900 font-semibold border-b-2 border-amber-800 pb-1' : ''
                }`}
              >
                Engagements & Garantie
              </button>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Search Toggle / Input */}
              <div className="relative">
                {isSearchOpen ? (
                  <div className="flex items-center bg-stone-100 border border-stone-300 rounded-full px-3 py-1.5 w-48 sm:w-64 focus-within:border-amber-700 focus-within:ring-1 focus-within:ring-amber-700 transition-all">
                    <Search className="w-4 h-4 text-stone-500 mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="Rechercher une création..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="bg-transparent text-sm text-stone-900 placeholder-stone-400 focus:outline-none w-full"
                      autoFocus
                    />
                    <button 
                      onClick={() => {
                        setIsSearchOpen(false);
                        onSearchChange('');
                      }} 
                      className="p-1 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2.5 text-stone-700 hover:text-amber-900 hover:bg-stone-100 rounded-full transition-colors"
                    title="Rechercher"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* AI Advisor Button */}
              <button
                onClick={onOpenAIAdvisor}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100/80 text-amber-900 hover:bg-amber-200/80 rounded-full text-xs font-semibold transition-colors border border-amber-300/60"
                title="Conseiller Cadeau AI"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                Conseiller AI
              </button>

              {/* Seller Admin Button (Protected) */}
              <button
                onClick={onOpenSellerAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900/90 text-amber-100 hover:bg-amber-950 hover:text-white rounded-full text-xs font-bold transition-all border border-stone-800 shadow-2xs group"
                title="Accès réservé au propriétaire (Espace Vendeur Protégé)"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline">Gérer mes Articles</span>
                <span className="xl:hidden">Espace Vendeur</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={onOpenWishlist}
                className="relative p-2.5 text-stone-700 hover:text-rose-700 hover:bg-stone-100 rounded-full transition-colors"
                title="Mes Coups de Cœur"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-2 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-full text-sm font-medium shadow-xs transition-all hover:shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden xs:inline text-xs font-semibold">{cartTotal.toFixed(0)} €</span>
                {cartCount > 0 && (
                  <span className="bg-amber-500 text-stone-950 text-xs font-bold px-1.5 py-0.2 rounded-full min-w-[1.25rem] text-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-stone-50 px-4 pt-3 pb-6 space-y-3">
            <button
              onClick={() => {
                onNavigate('catalog');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-base font-medium text-stone-800 hover:text-amber-900 border-b border-stone-200/60"
            >
              Catalogue Artisanal
            </button>
            <button
              onClick={() => {
                onOpenCustomOrder();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full text-left py-2 text-base font-medium text-amber-900 border-b border-stone-200/60"
            >
              <Palette className="w-4 h-4 text-amber-700" />
              Création Sur-Mesure
            </button>
            <button
              onClick={() => {
                onNavigate('atelier');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-base font-medium text-stone-800 hover:text-amber-900 border-b border-stone-200/60"
            >
              L'Atelier & Histoire
            </button>
            <button
              onClick={() => {
                onNavigate('guarantee');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-base font-medium text-stone-800 hover:text-amber-900 border-b border-stone-200/60"
            >
              Garantie & Engagements
            </button>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenAIAdvisor();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-amber-100 text-amber-900 rounded-xl text-sm font-semibold"
              >
                <Sparkles className="w-4 h-4 text-amber-700" />
                Conseiller AI Cadeaux & Déco
              </button>
              <button
                onClick={() => {
                  onOpenSellerAdmin();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-stone-900 text-amber-100 rounded-xl text-sm font-bold shadow-xs"
              >
                <Store className="w-4 h-4 text-amber-400" />
                Espace Vendeur & Articles
              </button>
              <button
                onClick={() => {
                  onOpenOrderTracker();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 border border-stone-300 text-stone-800 rounded-xl text-sm font-medium"
              >
                <PackageCheck className="w-4 h-4" />
                Suivre une commande
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
