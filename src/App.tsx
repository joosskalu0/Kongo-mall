import React, { useState, useEffect } from 'react';
import { Product, CartItem, FilterState, Order, CategoryId } from './types';
import { PRODUCTS } from './data/products';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryBar } from './components/CategoryBar';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CustomOrderModal } from './components/CustomOrderModal';
import { AIAdvisorModal } from './components/AIAdvisorModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { SellerAdminModal } from './components/SellerAdminModal';
import { ArtisanStory } from './components/ArtisanStory';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';

export default function App() {
  // Local Storage Products State (Allows seller to add, edit, or delete items)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_products');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  // Local Storage State Persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentOrders, setRecentOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filter State
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    minPrice: 0,
    maxPrice: 300,
    selectedMaterials: [],
    inStockOnly: false,
    uniquePieceOnly: false,
    ecoOnly: false,
    sortBy: 'featured'
  });

  // Navigation and Modals State
  const [activeSection, setActiveSection] = useState<'catalog' | 'atelier' | 'guarantee'>('catalog');
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCustomOrderOpen, setIsCustomOrderOpen] = useState(false);
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isSellerAdminOpen, setIsSellerAdminOpen] = useState(false);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | undefined>(undefined);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('atelier_products', JSON.stringify(products));
    } catch (e) {
      console.warn("Could not save products to localStorage:", e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('atelier_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn("Could not save cart to localStorage:", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('atelier_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.warn("Could not save wishlist to localStorage:", e);
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem('atelier_orders', JSON.stringify(recentOrders));
    } catch (e) {
      console.warn("Could not save orders to localStorage:", e);
    }
  }, [recentOrders]);

  // Product CRUD Handlers
  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    // If detail modal is open with this product, update it
    if (selectedProductDetail?.id === updatedProduct.id) {
      setSelectedProductDetail(updatedProduct);
    }
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (selectedProductDetail?.id === productId) {
      setSelectedProductDetail(null);
    }
  };

  const handleResetProducts = () => {
    setProducts(PRODUCTS);
    localStorage.removeItem('atelier_products');
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1, customization?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          customEngraving: customization || updated[existingIndex].customEngraving
        };
        return updated;
      }
      return [...prev, { product, quantity, customEngraving: customization }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleNavigate = (section: 'catalog' | 'atelier' | 'custom' | 'guarantee') => {
    if (section === 'custom') {
      setIsCustomOrderOpen(true);
      return;
    }
    if (section === 'guarantee' || section === 'atelier') {
      setActiveSection('atelier');
      const el = document.getElementById('atelier-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveSection('catalog');
      const el = document.getElementById('catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderCompleted = (newOrder: Order) => {
    setRecentOrders((prev) => [newOrder, ...prev]);
    setCart([]); // Clear cart after order complete
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-900 selection:text-amber-100">
      
      {/* Header */}
      <Header
        cartCount={cartCount}
        cartTotal={cartSubtotal}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCustomOrder={() => setIsCustomOrderOpen(true)}
        onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        onOpenSellerAdmin={() => setIsSellerAdminOpen(true)}
        searchQuery={filterState.searchQuery}
        onSearchChange={(q) => {
          setFilterState((prev) => ({ ...prev, searchQuery: q }));
          setActiveSection('catalog');
        }}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Content */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <Hero
          onExploreClick={() => handleNavigate('catalog')}
          onCustomOrderClick={() => setIsCustomOrderOpen(true)}
          onAIAdvisorClick={() => setIsAIAdvisorOpen(true)}
        />

        {/* Category Horizontal Filter Bar */}
        <CategoryBar
          selectedCategory={filterState.category}
          onSelectCategory={(cat) => setFilterState((prev) => ({ ...prev, category: cat }))}
        />

        {/* Catalog Grid Section */}
        <ProductGrid
          products={products}
          filterState={filterState}
          onFilterChange={setFilterState}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={setSelectedProductDetail}
          onAddToCart={handleAddToCart}
        />

        {/* Artisan Workshop & Ethos Story Section */}
        <ArtisanStory />

      </main>

      {/* Modals & Slide-over Drawers */}
      
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        isWishlisted={selectedProductDetail ? wishlistIds.includes(selectedProductDetail.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={(product, qty, customization) => {
          handleAddToCart(product, qty, customization);
        }}
        allProducts={products}
        onSelectRelated={setSelectedProductDetail}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={(promoCode) => {
          setAppliedPromoCode(promoCode);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        appliedPromoCode={appliedPromoCode}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      {/* Custom Order Commission Request Modal */}
      <CustomOrderModal
        isOpen={isCustomOrderOpen}
        onClose={() => setIsCustomOrderOpen(false)}
      />

      {/* AI Advisor Modal */}
      <AIAdvisorModal
        isOpen={isAIAdvisorOpen}
        onClose={() => setIsAIAdvisorOpen(false)}
        products={products}
        onSelectProduct={(p) => {
          setSelectedProductDetail(p);
        }}
      />

      {/* Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        recentOrders={recentOrders}
      />

      {/* Seller Admin Modal (Gérer mes Articles & Commandes) */}
      <SellerAdminModal
        isOpen={isSellerAdminOpen}
        onClose={() => setIsSellerAdminOpen(false)}
        products={products}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetProducts={handleResetProducts}
        orders={recentOrders}
        onUpdateOrders={setRecentOrders}
      />

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenCustomOrder={() => setIsCustomOrderOpen(true)}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
      />

      {/* Floating WhatsApp Quick Contact Button */}
      <WhatsAppButton />

    </div>
  );
}
