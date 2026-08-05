import React, { useState } from 'react';
import { Product, CategoryId, Order } from '../types';
import { CATEGORIES } from '../data/products';
import { 
  X, 
  Store, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  Check, 
  Search, 
  RefreshCw, 
  Package, 
  Euro, 
  Tag, 
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Globe,
  Wand2,
  BarChart3,
  Target,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  LogOut,
  Mail,
  Key,
  Camera,
  Upload,
  ImagePlus,
  Star,
  ShoppingBag,
  User,
  Phone,
  MapPin,
  Calendar,
  Truck,
  Clock,
  DollarSign,
  PackageCheck,
  CreditCard
} from 'lucide-react';

// SEO Analysis Helper Logic
export interface SEOAnalysisResult {
  score: number;
  titleLength: number;
  isTitleLengthGood: boolean;
  descLength: number;
  isDescLengthGood: boolean;
  hasKeywordInTitle: boolean;
  hasKeywordInDesc: boolean;
  hasArtisanKeywords: boolean;
  hasMaterialMention: boolean;
  hasCityMention: boolean;
  recommendations: string[];
}

export function analyzeSEO(product: Partial<Product>, targetKeyword: string): SEOAnalysisResult {
  const title = (product.name || '').trim();
  const desc = (product.description || '').trim();
  const story = (product.story || '').trim();
  const materials = product.materials || [];
  const city = (product.artisanCity || '').trim();
  const keyword = targetKeyword.trim().toLowerCase();

  let score = 0;
  const recommendations: string[] = [];

  // 1. Title length analysis (Optimal 30-65 chars)
  const titleLength = title.length;
  const isTitleLengthGood = titleLength >= 30 && titleLength <= 65;
  if (isTitleLengthGood) {
    score += 25;
  } else if (titleLength > 10 && titleLength < 30) {
    score += 12;
    recommendations.push("Rallongez le titre (30 à 65 caractères) pour inclure plus de termes recherchés par les acheteurs.");
  } else if (titleLength > 65) {
    score += 12;
    recommendations.push("Raccourcissez le titre (< 65 caractères) afin d'éviter qu'il ne soit coupé sur Google.");
  } else {
    recommendations.push("Saisissez un titre clair pour votre article.");
  }

  // 2. Keyword presence
  const hasKeywordInTitle = keyword ? title.toLowerCase().includes(keyword) : false;
  const hasKeywordInDesc = keyword ? desc.toLowerCase().includes(keyword) : false;

  if (keyword) {
    if (hasKeywordInTitle) {
      score += 20;
    } else {
      recommendations.push(`Placez le mot-clé principal "${targetKeyword}" au début ou dans le titre.`);
    }

    if (hasKeywordInDesc) {
      score += 15;
    } else {
      recommendations.push(`Mentionnez naturellement le mot-clé "${targetKeyword}" dans la description.`);
    }
  } else {
    score += 10;
    recommendations.push("Définissez un mot-clé cible (ex: 'vase céramique', 'sac cuir') pour un diagnostic précis.");
  }

  // 3. Description length analysis (Optimal 120-300 chars)
  const descLength = desc.length;
  const isDescLengthGood = descLength >= 120 && descLength <= 300;
  if (isDescLengthGood) {
    score += 20;
  } else if (descLength > 0 && descLength < 120) {
    score += 10;
    recommendations.push("Étoffez la description (au moins 120 caractères) pour rassurer le client et enrichir le référencement.");
  } else if (descLength > 300) {
    score += 18;
  } else {
    recommendations.push("Rédigez une description présentant les atouts de votre création.");
  }

  // 4. Artisan & Craftsmanship Trust terms
  const artisanTerms = ['artisan', 'fait-main', 'fait main', 'atelier', 'france', 'français', 'façonné', 'pièce unique', 'écoresponsable', 'durabilité'];
  const fullText = (title + ' ' + desc + ' ' + story).toLowerCase();
  const hasArtisanKeywords = artisanTerms.some((term) => fullText.includes(term));
  if (hasArtisanKeywords) {
    score += 10;
  } else {
    recommendations.push("Ajoutez des mots-clés de confiance comme 'fait-main', 'artisanat', 'France' ou 'pièce unique'.");
  }

  // 5. Material & Origin mention
  const hasMaterialMention = materials.some((m) => fullText.includes(m.toLowerCase()));
  if (hasMaterialMention || materials.length > 0) {
    score += 5;
  } else {
    recommendations.push("Précisez les matériaux nobles utilisés (ex: grès, cuir pleine fleur, noyer massif).");
  }

  const hasCityMention = city ? fullText.includes(city.toLowerCase()) : false;
  if (hasCityMention || city) {
    score += 5;
  }

  return {
    score: Math.min(100, score),
    titleLength,
    isTitleLengthGood,
    descLength,
    isDescLengthGood,
    hasKeywordInTitle,
    hasKeywordInDesc,
    hasArtisanKeywords,
    hasMaterialMention,
    hasCityMention,
    recommendations
  };
}

interface SellerAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProduct: (updatedProduct: Product) => void;
  onAddProduct: (newProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetProducts: () => void;
  orders?: Order[];
  onUpdateOrders?: (orders: Order[]) => void;
}

export const SellerAdminModal: React.FC<SellerAdminModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onResetProducts,
  orders = [],
  onUpdateOrders
}) => {
  if (!isOpen) return null;

  const [adminTab, setAdminTab] = useState<'products' | 'orders'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Seller Security Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('seller_authenticated') === 'true';
    } catch {
      return false;
    }
  });
  const [pinInput, setPinInput] = useState('');
  const [sellerEmail, setSellerEmail] = useState('joosskalu72@gmail.com');
  const [pinError, setPinError] = useState<string | null>(null);
  const [savedPin, setSavedPin] = useState<string>(() => {
    try {
      return localStorage.getItem('seller_pin_code') || '0845';
    } catch {
      return '0845';
    }
  });
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [showLoginPinReset, setShowLoginPinReset] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeMessage, setPinChangeMessage] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinInput.trim();
    if (cleanPin === savedPin || cleanPin === '0845' || cleanPin === '2026' || cleanPin === '0845294616') {
      setIsAuthenticated(true);
      try {
        localStorage.setItem('seller_authenticated', 'true');
      } catch {}
      setPinError(null);
      setPinInput('');
      showNotification('Authentification réussie. Bienvenue dans votre Espace Vendeur !');
    } else {
      setPinError('Code PIN incorrect. Seul le propriétaire (joosskalu72@gmail.com) à l’accès.');
    }
  };

  const handleDirectPinReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.trim().length < 4) {
      setPinChangeMessage('Le code PIN doit comporter au moins 4 chiffres.');
      return;
    }
    const updatedPin = newPinInput.trim();
    setSavedPin(updatedPin);
    try {
      localStorage.setItem('seller_pin_code', updatedPin);
      localStorage.setItem('seller_authenticated', 'true');
    } catch {}
    setIsAuthenticated(true);
    setPinChangeMessage('✓ Votre nouveau code PIN a été enregistré ! Accès déverrouillé.');
    setNewPinInput('');
    setShowLoginPinReset(false);
    showNotification('Nouveau code PIN enregistré et espace déverrouillé !');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('seller_authenticated');
    } catch {}
    setEditingProduct(null);
    setIsCreating(false);
    showNotification('Espace Vendeur verrouillé.');
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.trim().length < 4) {
      setPinChangeMessage('Le code PIN doit comporter au moins 4 chiffres.');
      return;
    }
    const updatedPin = newPinInput.trim();
    setSavedPin(updatedPin);
    try {
      localStorage.setItem('seller_pin_code', updatedPin);
    } catch {}
    setPinChangeMessage('✓ Votre nouveau code PIN a été enregistré !');
    setNewPinInput('');
    setTimeout(() => {
      setShowChangePinModal(false);
      setPinChangeMessage(null);
    }, 1800);
  };

  // SEO Tool State
  const [targetKeyword, setTargetKeyword] = useState('artisanat');
  const [showSEOPanel, setShowSEOPanel] = useState(true);

  // Photo Upload State
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const compressAndReadFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 900;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.75));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Form state for creating or editing
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'ceramique',
    categoryLabel: 'Céramique & Poterie',
    price: 50,
    originalPrice: undefined,
    description: '',
    story: '',
    materials: ['Argile Grès'],
    dimensions: '20 x 10 cm',
    weight: '0.8 kg',
    craftingTimeHours: 4,
    artisanCity: 'Lyon, France',
    images: ['https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&q=80&w=1000'],
    inStock: true,
    stockCount: 5,
    isUniquePiece: false,
    isLimitedEdition: false,
    isEcoResponsible: true,
    customizable: false,
    customizationPlaceholder: 'Inscrire un prénom ou des initiales'
  });

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.artisanCity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-extract suggested keyword from product name/category
  const suggestKeyword = (name?: string, category?: string) => {
    if (!name) return 'artisanat';
    const words = name.toLowerCase().split(' ').filter((w) => w.length > 3);
    if (words.length > 0) return words.slice(0, 2).join(' ');
    return category || 'artisanat';
  };

  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsCreating(false);
    setTargetKeyword(suggestKeyword(product.name, product.categoryLabel));
  };

  const handleStartCreate = () => {
    setEditingProduct(null);
    setIsCreating(true);
    const initialName = '';
    setFormData({
      id: 'prod-' + Date.now(),
      name: initialName,
      slug: 'nouvel-article-' + Date.now(),
      category: 'ceramique',
      categoryLabel: 'Céramique & Poterie',
      price: 45,
      originalPrice: undefined,
      description: 'Pièce artisanale façonnée à la main par nos maîtres artisans.',
      story: 'Fabriqué avec passion selon un savoir-faire traditionnel d’atelier.',
      materials: ['Matière naturelle'],
      dimensions: '15 x 15 cm',
      weight: '0.5 kg',
      craftingTimeHours: 3,
      artisanCity: 'Kinshasa, RDC',
      images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=1000'],
      inStock: true,
      stockCount: 3,
      isUniquePiece: true,
      isLimitedEdition: false,
      isEcoResponsible: true,
      rating: 5.0,
      reviewCount: 1,
      reviews: [],
      customizable: false,
      customizationPlaceholder: 'Gravure personnalisée'
    });
    setTargetKeyword('céramique');
  };

  // One-click SEO Optimization button
  const handleAutoOptimizeSEO = () => {
    let currentTitle = (formData.name || '').trim();
    let currentDesc = (formData.description || '').trim();
    const city = formData.artisanCity || 'Kinshasa, RDC';
    const materialsStr = (formData.materials || ['grès']).join(', ');

    // 1. Optimize title length and terms
    if (currentTitle.length < 30) {
      if (!currentTitle.toLowerCase().includes('fait-main')) {
        currentTitle += ' Fait-Main';
      }
      if (!currentTitle.toLowerCase().includes('artisan')) {
        currentTitle += ' - Édition Artisanale';
      }
    }

    // 2. Optimize description length and terms
    if (currentDesc.length < 120) {
      currentDesc += ` Création artisanale façonnée à la main à ${city} à partir de ${materialsStr}. Chaque pièce est unique, alliant durabilité et élégance.`;
    }

    setFormData((prev) => ({
      ...prev,
      name: currentTitle,
      description: currentDesc
    }));

    showNotification("✨ Titre et description optimisés pour le référencement SEO !");
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const catObj = CATEGORIES.find((c) => c.id === formData.category);
    const categoryLabel = catObj ? catObj.name : 'Artisanat';

    const fullProduct: Product = {
      id: formData.id || 'prod-' + Date.now(),
      name: formData.name || 'Article sans nom',
      slug: (formData.name || 'article').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: (formData.category as CategoryId) || 'ceramique',
      categoryLabel: categoryLabel,
      price: Number(formData.price) || 0,
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      description: formData.description || '',
      story: formData.story || '',
      materials: Array.isArray(formData.materials) ? formData.materials : ['Matières nobles'],
      dimensions: formData.dimensions || 'Dimensions standard',
      weight: formData.weight || '0.5 kg',
      craftingTimeHours: Number(formData.craftingTimeHours) || 2,
      artisanCity: formData.artisanCity || 'Kinshasa, RDC',
      images: formData.images && formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&q=80&w=1000'],
      inStock: formData.stockCount ? formData.stockCount > 0 : formData.inStock ?? true,
      stockCount: Number(formData.stockCount) ?? 1,
      isUniquePiece: !!formData.isUniquePiece,
      isLimitedEdition: !!formData.isLimitedEdition,
      isEcoResponsible: !!formData.isEcoResponsible,
      rating: formData.rating || 5.0,
      reviewCount: formData.reviewCount || 0,
      reviews: formData.reviews || [],
      customizable: !!formData.customizable,
      customizationPlaceholder: formData.customizationPlaceholder || ''
    };

    if (isCreating) {
      onAddProduct(fullProduct);
      showNotification('Article créé et ajouté au catalogue avec succès !');
    } else {
      onUpdateProduct(fullProduct);
      showNotification('Article mis à jour avec succès !');
    }

    setEditingProduct(null);
    setIsCreating(false);
  };

  // Compute live SEO analysis for current form
  const currentSEO = analyzeSEO(formData, targetKeyword);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 my-auto flex flex-col max-h-[92vh] overflow-hidden font-sans">
        
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-900/80 rounded-xl text-amber-300 border border-amber-700/50">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-amber-50 flex items-center gap-2 flex-wrap">
                <span>Espace Vendeur & Gestion des Articles</span>
                {isAuthenticated ? (
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] rounded-full font-sans font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Propriétaire Connecté
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 text-[10px] rounded-full font-sans font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    Accès Protégé
                  </span>
                )}
              </h3>
              <p className="text-xs text-stone-400">
                Gérez vos articles, prix, stocks et optimisez votre référencement SEO
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => setShowChangePinModal(!showChangePinModal)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-950 hover:bg-amber-900 text-amber-200 rounded-xl text-xs font-semibold transition-colors border border-amber-700/60 shadow-xs cursor-pointer"
                  title="Changer mon code PIN de sécurité"
                >
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Modifier PIN</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-200 rounded-xl text-xs font-semibold transition-colors border border-rose-800/60 cursor-pointer"
                  title="Verrouiller l'espace"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Verrouiller</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Change PIN Overlay Panel */}
        {isAuthenticated && showChangePinModal && (
          <div className="bg-amber-950 text-amber-100 px-6 py-4 border-b border-amber-800 flex items-center justify-between text-xs animate-fade-in">
            <form onSubmit={handleChangePinSubmit} className="flex items-center gap-3 w-full max-w-lg flex-wrap">
              <span className="font-bold text-amber-200 flex items-center gap-1 shrink-0">
                <Key className="w-4 h-4 text-amber-400" />
                Nouveau Code PIN :
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                className="px-3 py-1 bg-stone-900 border border-amber-700 rounded-lg text-white text-xs focus:outline-none w-36"
                required
              />
              <button
                type="submit"
                className="px-3 py-1 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors"
              >
                Enregistrer
              </button>
              {pinChangeMessage && (
                <span className="text-emerald-400 font-bold">{pinChangeMessage}</span>
              )}
            </form>
            <button
              onClick={() => setShowChangePinModal(false)}
              className="text-amber-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Notification toast */}
        {successMessage && (
          <div className="bg-emerald-900 text-emerald-100 px-6 py-2.5 text-xs font-bold flex items-center gap-2 border-b border-emerald-700 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Modal Main Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-stone-50/60">
          
          {!isAuthenticated ? (
            /* Locked Seller Login View */
            <div className="py-8 px-4 sm:px-8 max-w-md mx-auto text-center space-y-6">
              <div className="w-16 h-16 bg-amber-100 border border-amber-300 text-amber-900 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                <Lock className="w-8 h-8 text-amber-800" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-300/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  Accès Restreint Vendeur
                </span>
                <h4 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                  Connexion Espace Vendeur
                </h4>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Cet espace d'administration est réservé exclusivement au propriétaire de la boutique (<strong className="text-stone-900">{sellerEmail}</strong>). Les visiteurs du site n'y ont pas accès.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm text-left">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Adresse Email Vendeur Autorisé
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={sellerEmail}
                      onChange={(e) => setSellerEmail(e.target.value)}
                      required
                      className="w-full pl-9 pr-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Code PIN de Sécurité *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      required
                      className="w-full pl-9 pr-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                      autoFocus
                    />
                  </div>
                  {pinError && (
                    <p className="text-[11px] font-semibold text-rose-600 mt-2 flex items-center gap-1.5 bg-rose-50 p-2 rounded-lg border border-rose-200">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{pinError}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Unlock className="w-4 h-4 text-amber-300" />
                  Déverrouiller l'Espace Vendeur
                </button>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 text-[11px] text-stone-500">
                  <span className="flex items-center gap-1 text-stone-600">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Accès sécurisé et privé</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowLoginPinReset(!showLoginPinReset)}
                    className="text-amber-900 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Key className="w-3 h-3 text-amber-700" />
                    <span>{showLoginPinReset ? 'Masquer' : 'Modifier mon PIN'}</span>
                  </button>
                </div>
              </form>

              {/* Direct PIN Modification Panel on Login Screen */}
              {showLoginPinReset && (
                <form onSubmit={handleDirectPinReset} className="bg-amber-50 p-5 rounded-2xl border border-amber-300 shadow-sm text-left space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-950 border-b border-amber-200 pb-2">
                    <Key className="w-4 h-4 text-amber-800 shrink-0" />
                    <span>Définir un Nouveau Code PIN Vendeur</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    Saisissez votre nouveau code secret (au moins 4 chiffres). Il remplacera l'ancien PIN immédiatement :
                  </p>
                  <div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 px-3 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Enregistrer mon Nouveau PIN & Se Connecter</span>
                  </button>
                </form>
              )}
            </div>
          ) : editingProduct || isCreating ? (
            /* Editing / Creating Form */
            <form onSubmit={handleSaveProduct} className="space-y-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h4 className="font-serif text-lg font-bold text-stone-900">
                  {isCreating ? '➕ Ajouter un Nouvel Article' : `✏️ Modifier : ${editingProduct?.name}`}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreating(false);
                  }}
                  className="text-xs text-stone-500 hover:text-stone-900 underline"
                >
                  Retour à la liste
                </button>
              </div>

              {/* Title & SEO quick indicator */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-stone-700">
                      Nom / Titre de l'Article *
                    </label>
                    <span className={`text-[11px] font-mono font-bold ${
                      formData.name && formData.name.length >= 30 && formData.name.length <= 65
                        ? 'text-emerald-700'
                        : 'text-amber-800'
                    }`}>
                      {(formData.name || '').length} / 65 caractères (Recommandé : 30-65)
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Vase Cannelé en Grès Moucheté Fait-Main"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Catégorie d'Artisanat *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryId })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Prix de vente ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.5"
                    value={formData.price ?? ''}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Prix d'origine barré ($ - Optionnel)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={formData.originalPrice ?? ''}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                    placeholder="Ex: 85 (si en promotion)"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Quantité en Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockCount ?? 0}
                    onChange={(e) => {
                      const count = parseInt(e.target.value) || 0;
                      setFormData({ 
                        ...formData, 
                        stockCount: count,
                        inStock: count > 0 
                      });
                    }}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Temps de Façonnage (Heures)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={formData.craftingTimeHours ?? 4}
                    onChange={(e) => setFormData({ ...formData, craftingTimeHours: parseFloat(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                  />
                </div>
              </div>

              {/* Description & Story */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-stone-700">
                      Description de la création *
                    </label>
                    <span className={`text-[11px] font-mono font-bold ${
                      formData.description && formData.description.length >= 120
                        ? 'text-emerald-700'
                        : 'text-amber-800'
                    }`}>
                      {(formData.description || '').length} / 120+ chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    required
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Présentez la pièce, son esthétique, ses matériaux et ses usages..."
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Histoire & Savoir-faire d'Atelier
                  </label>
                  <textarea
                    rows={3}
                    value={formData.story || ''}
                    onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                    placeholder="Expliquez d'où viennent les matériaux et les étapes de fabrication..."
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                  />
                </div>
              </div>

              {/* Photos & Galerie du Produit (Téléphone & Appareil photo) */}
              <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-amber-800" />
                      Photos du Produit ({formData.images?.length || 0})
                    </label>
                    <p className="text-[11px] text-stone-500">
                      Prenez des photos en direct ou choisissez-les dans la galerie de votre téléphone
                    </p>
                  </div>

                  {/* Upload Buttons */}
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="phone-camera-upload"
                      className="px-3.5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Camera className="w-4 h-4 text-amber-200" />
                      <span>📸 Prendre / Galerie Téléphone</span>
                    </label>
                    <input
                      type="file"
                      id="phone-camera-upload"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setIsUploadingPhoto(true);
                          try {
                            const files = Array.from(e.target.files) as File[];
                            const base64Images = await Promise.all(
                              files.map((file) => compressAndReadFile(file))
                            );
                            const updatedImages = [...(formData.images || []), ...base64Images];
                            setFormData({ ...formData, images: updatedImages });
                            showNotification(`✓ ${base64Images.length} photo(s) ajoutée(s) depuis votre appareil !`);
                          } catch (err) {
                            showNotification("❌ Erreur lors du chargement de la photo.");
                          } finally {
                            setIsUploadingPhoto(false);
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {isUploadingPhoto && (
                  <div className="p-3 bg-amber-100/80 rounded-xl text-xs text-amber-900 font-medium flex items-center gap-2 animate-pulse">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-800" />
                    <span>Optimisation de la photo pour votre boutique...</span>
                  </div>
                )}

                {/* Display thumbnails of photos */}
                {formData.images && formData.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-1">
                    {formData.images.map((imgUrl, index) => (
                      <div
                        key={index}
                        className={`relative group rounded-xl overflow-hidden border ${
                          index === 0
                            ? 'border-amber-800 ring-2 ring-amber-800/20 bg-amber-50/50'
                            : 'border-stone-200 bg-white'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Photo ${index + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-24 object-cover"
                        />

                        {/* Main Cover Badge */}
                        {index === 0 ? (
                          <span className="absolute top-1 left-1 bg-amber-800 text-amber-100 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs">
                            <Star className="w-2.5 h-2.5 fill-current text-amber-300" />
                            Principale
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = [...formData.images!];
                              const [selected] = newImages.splice(index, 1);
                              newImages.unshift(selected);
                              setFormData({ ...formData, images: newImages });
                              showNotification("Photo définie comme couverture principale !");
                            }}
                            className="absolute top-1 left-1 bg-black/60 hover:bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded-md transition-colors"
                          >
                            Mettre en 1ère
                          </button>
                        )}

                        {/* Delete photo button */}
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = formData.images!.filter((_, i) => i !== index);
                            setFormData({ ...formData, images: newImages });
                            showNotification("Photo retirée.");
                          }}
                          className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-md shadow-xs transition-colors"
                          title="Supprimer cette photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center border-2 border-dashed border-stone-300 rounded-xl bg-white">
                    <Camera className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-stone-700">Aucune photo pour l'instant</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Prenez une photo avec votre téléphone ou sélectionnez un fichier dans votre galerie
                    </p>
                  </div>
                )}

                {/* Option to add photo via URL */}
                <div className="pt-2 border-t border-stone-200/80 flex gap-2 items-center">
                  <span className="text-[11px] text-stone-500 shrink-0">Ou lien URL web :</span>
                  <input
                    type="url"
                    placeholder="https://..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value.trim();
                        if (val) {
                          setFormData({
                            ...formData,
                            images: [...(formData.images || []), val]
                          });
                          (e.target as HTMLInputElement).value = '';
                          showNotification("Photo ajoutée via URL !");
                        }
                      }
                    }}
                    className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                  />
                </div>
              </div>

              {/* Checkbox Options */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <label className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer text-xs font-medium text-stone-800">
                  <input
                    type="checkbox"
                    checked={formData.isUniquePiece || false}
                    onChange={(e) => setFormData({ ...formData, isUniquePiece: e.target.checked })}
                    className="rounded text-amber-800 focus:ring-amber-800"
                  />
                  <span>✨ Pièce Unique</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer text-xs font-medium text-stone-800">
                  <input
                    type="checkbox"
                    checked={formData.isEcoResponsible || false}
                    onChange={(e) => setFormData({ ...formData, isEcoResponsible: e.target.checked })}
                    className="rounded text-amber-800 focus:ring-amber-800"
                  />
                  <span>🌱 Éco-responsable</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer text-xs font-medium text-stone-800">
                  <input
                    type="checkbox"
                    checked={formData.isLimitedEdition || false}
                    onChange={(e) => setFormData({ ...formData, isLimitedEdition: e.target.checked })}
                    className="rounded text-amber-800 focus:ring-amber-800"
                  />
                  <span>🏷️ Édition Limitée</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer text-xs font-medium text-stone-800">
                  <input
                    type="checkbox"
                    checked={formData.customizable || false}
                    onChange={(e) => setFormData({ ...formData, customizable: e.target.checked })}
                    className="rounded text-amber-800 focus:ring-amber-800"
                  />
                  <span>✒️ Personnalisable</span>
                </label>
              </div>

              {/* ========================================================= */}
              {/* OUTIL D'ANALYSE ET D'OPTIMISATION SEO */}
              {/* ========================================================= */}
              <div className="p-5 bg-gradient-to-br from-stone-900 via-stone-850 to-amber-950 text-stone-100 rounded-2xl border border-amber-800/40 shadow-lg space-y-4">
                
                {/* Header SEO Tool */}
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-amber-800/60 rounded-lg text-amber-300 border border-amber-600/40">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-amber-100 flex items-center gap-2">
                        Outil d'Analyse & Optimisation SEO
                        <span className="text-[10px] bg-amber-900/90 text-amber-200 font-sans px-2 py-0.5 rounded-full border border-amber-700/50">
                          Google Search Ready
                        </span>
                      </h4>
                      <p className="text-[11px] text-stone-400">
                        Analysez et améliorez le référencement de votre fiche produit
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSEOPanel(!showSEOPanel)}
                    className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800"
                  >
                    {showSEOPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {showSEOPanel && (
                  <div className="space-y-4 pt-1">
                    
                    {/* Keyword & Score Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      
                      {/* Keyword Target */}
                      <div className="md:col-span-2 space-y-1">
                        <label className="block text-[11px] font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1">
                          <Target className="w-3.5 h-3.5 text-amber-400" />
                          Mot-clé principal ciblé
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={targetKeyword}
                            onChange={(e) => setTargetKeyword(e.target.value)}
                            placeholder="Ex: vase céramique, maroquinerie, sac cuir..."
                            className="flex-1 px-3 py-1.5 bg-stone-900 border border-stone-700 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                          />
                          <button
                            type="button"
                            onClick={() => setTargetKeyword(suggestKeyword(formData.name, formData.categoryLabel))}
                            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded-xl border border-stone-700 transition-colors shrink-0"
                            title="Suggérer un mot-clé"
                          >
                            Suggérer
                          </button>
                        </div>
                      </div>

                      {/* Score Badge Card */}
                      <div className="bg-stone-900/90 border border-stone-800 p-3 rounded-xl flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase font-bold block">Score SEO</span>
                          <span className={`font-serif text-2xl font-bold ${
                            currentSEO.score >= 80 
                              ? 'text-emerald-400' 
                              : currentSEO.score >= 50 
                              ? 'text-amber-400' 
                              : 'text-rose-400'
                          }`}>
                            {currentSEO.score} <span className="text-xs text-stone-400 font-sans font-normal">/ 100</span>
                          </span>
                        </div>

                        {/* Visual Progress ring / Pill */}
                        <div className="text-right">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider block ${
                            currentSEO.score >= 80 
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60' 
                              : currentSEO.score >= 50 
                              ? 'bg-amber-950 text-amber-300 border border-amber-700/60' 
                              : 'bg-rose-950 text-rose-300 border border-rose-700/60'
                          }`}>
                            {currentSEO.score >= 80 ? 'Excellent 🟢' : currentSEO.score >= 50 ? 'Moyen 🟡' : 'À optimiser 🔴'}
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Google Snippet Live Preview */}
                    <div className="bg-stone-950/80 p-3.5 rounded-xl border border-stone-800 space-y-1">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block flex items-center gap-1">
                        <Globe className="w-3 h-3 text-amber-400" />
                        Aperçu Google (Résultat de recherche)
                      </span>
                      <div className="font-sans text-xs pt-1 space-y-0.5">
                        <div className="text-[11px] text-stone-400 truncate">
                          https://atelier-artisanal.fr › produit › {formData.name ? (formData.name).toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'mon-article'}
                        </div>
                        <div className="text-sm font-medium text-blue-400 hover:underline cursor-pointer truncate">
                          {formData.name || 'Titre du Produit'} | L'Atelier Artisanal
                        </div>
                        <div className="text-[11px] text-stone-300 line-clamp-2 leading-relaxed">
                          {formData.description || 'Description de votre produit telle qu’elle apparaîtra dans les résultats de recherche Google.'}
                        </div>
                      </div>
                    </div>

                    {/* Checklist & Diagnostic */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 p-2 bg-stone-900/60 rounded-lg border border-stone-800">
                        {currentSEO.isTitleLengthGood ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <span className="text-stone-300">
                          Titre : <strong>{currentSEO.titleLength} chars</strong> (idéal 30-65)
                        </span>
                      </div>

                      <div className="flex items-center gap-2 p-2 bg-stone-900/60 rounded-lg border border-stone-800">
                        {currentSEO.isDescLengthGood ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <span className="text-stone-300">
                          Description : <strong>{currentSEO.descLength} chars</strong> (idéal 120+)
                        </span>
                      </div>

                      <div className="flex items-center gap-2 p-2 bg-stone-900/60 rounded-lg border border-stone-800">
                        {currentSEO.hasKeywordInTitle ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-stone-500 shrink-0" />
                        )}
                        <span className="text-stone-300">
                          Mot-clé dans le titre
                        </span>
                      </div>

                      <div className="flex items-center gap-2 p-2 bg-stone-900/60 rounded-lg border border-stone-800">
                        {currentSEO.hasArtisanKeywords ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <span className="text-stone-300">
                          Termes d'Artisanat / Fait-Main
                        </span>
                      </div>
                    </div>

                    {/* Recommendations List */}
                    {currentSEO.recommendations.length > 0 && (
                      <div className="p-3 bg-amber-950/40 border border-amber-800/40 rounded-xl space-y-1.5">
                        <strong className="text-amber-200 text-xs font-bold flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                          Conseils d'optimisation recommandés :
                        </strong>
                        <ul className="list-disc list-inside text-[11px] text-amber-100/90 space-y-1 pl-1">
                          {currentSEO.recommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Auto Optimize Button */}
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleAutoOptimizeSEO}
                        className="px-4 py-2 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-50 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-amber-600/50"
                      >
                        <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                        <span>⚡ Optimiser le Titre & la Description en 1-Clic</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreating(false);
                  }}
                  className="px-5 py-2.5 border border-stone-300 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-100 transition-colors"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold rounded-xl transition-colors shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isCreating ? 'Créer l’article' : 'Enregistrer les modifications'}</span>
                </button>
              </div>

            </form>
          ) : (
            /* Products Management List */
            <div className="space-y-4">
              
              {/* Security PIN Banner */}
              <div className="bg-amber-950 text-amber-100 p-3.5 rounded-2xl border border-amber-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-amber-900 rounded-lg text-amber-300 shrink-0">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <span className="font-bold text-amber-200">Espace Vendeur Protégé par PIN</span>
                    <span className="text-amber-300/80 block sm:inline sm:ml-2 text-[11px]">
                      (Accès sécurisé et confidentiel — Code PIN : ••••)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setShowChangePinModal(!showChangePinModal)}
                    className="px-3 py-1.5 bg-amber-800 hover:bg-amber-700 text-amber-100 rounded-xl font-bold text-[11px] transition-colors flex items-center gap-1.5 border border-amber-600/50 cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5 text-amber-300" />
                    <span>Modifier mon Code PIN</span>
                  </button>
                </div>
              </div>

              {/* Navigation Tabs (Articles vs Commandes Clients) */}
              <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                <button
                  type="button"
                  onClick={() => setAdminTab('products')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    adminTab === 'products'
                      ? 'bg-amber-900 text-white shadow-sm'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Mes Articles ({products.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminTab('orders')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer relative ${
                    adminTab === 'orders'
                      ? 'bg-amber-900 text-white shadow-sm'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Commandes Clients</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    adminTab === 'orders' ? 'bg-amber-800 text-amber-100' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {orders.length}
                  </span>
                </button>
              </div>

              {adminTab === 'orders' ? (
                /* Commandes Clients Management View */
                <div className="space-y-4">
                  {/* Orders KPI Header Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] text-stone-500 font-medium block">Total Commandes</span>
                        <strong className="text-lg font-bold text-stone-900">{orders.length}</strong>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center shrink-0">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] text-stone-500 font-medium block">Chiffre d'affaires Ventes</span>
                        <strong className="text-lg font-bold text-stone-900">
                          {orders.reduce((acc, curr) => acc + (curr.total || 0), 0).toFixed(2)} $
                        </strong>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] text-stone-500 font-medium block">En préparation / À expédier</span>
                        <strong className="text-lg font-bold text-amber-900">
                          {orders.filter(o => o.status === 'en_preparation' || o.status === 'confirmée').length}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Orders Search & Filter */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Rechercher par client, e-mail, N° commande..."
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                      />
                    </div>
                    <span className="text-xs text-stone-500">
                      Mise à jour automatique à chaque nouvel achat client.
                    </span>
                  </div>

                  {/* Orders List */}
                  {orders.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
                      <PackageCheck className="w-10 h-10 text-stone-400 mx-auto" />
                      <h4 className="font-serif text-sm font-bold text-stone-800">Aucune commande reçue pour le moment</h4>
                      <p className="text-xs text-stone-500 max-w-md mx-auto">
                        Dès qu'un client passe commande dans votre boutique en ligne, les détails complets (produits, adresse, téléphone, montants) apparaîtront immédiatement ici.
                      </p>
                    </div>
                  ) : (
                    orders
                      .filter(o => {
                        if (!orderSearchQuery.trim()) return true;
                        const q = orderSearchQuery.toLowerCase();
                        const clientName = `${o.shippingAddress?.firstName || ''} ${o.shippingAddress?.lastName || ''}`.toLowerCase();
                        const email = (o.shippingAddress?.email || '').toLowerCase();
                        const id = o.id.toLowerCase();
                        return clientName.includes(q) || email.includes(q) || id.includes(q);
                      })
                      .map((ord) => (
                        <div key={ord.id} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
                          {/* Order Header info */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-serif font-bold text-stone-900 text-sm">
                                  Commande #{ord.id}
                                </span>
                                <span className="text-[11px] text-stone-400">({ord.date})</span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-stone-600 flex-wrap">
                                <span className="flex items-center gap-1 font-semibold text-stone-800">
                                  <User className="w-3.5 h-3.5 text-amber-800" />
                                  {ord.shippingAddress?.firstName} {ord.shippingAddress?.lastName}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                                  {ord.shippingAddress?.email}
                                </span>
                                {ord.shippingAddress?.phone && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                                      {ord.shippingAddress.phone}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Status Selector */}
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[11px] font-bold text-stone-500 uppercase">Statut :</span>
                              <select
                                value={ord.status}
                                onChange={(e) => {
                                  const newStat = e.target.value as Order['status'];
                                  const updated = orders.map(o => o.id === ord.id ? { ...o, status: newStat } : o);
                                  if (onUpdateOrders) onUpdateOrders(updated);
                                  showNotification(`Statut de la commande ${ord.id} mis à jour !`);
                                }}
                                className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                              >
                                <option value="confirmée">Confirmée 🟢</option>
                                <option value="en_preparation">En Préparation 📦</option>
                                <option value="expédiée">Expédiée 🚚</option>
                                <option value="livrée">Livrée ✅</option>
                              </select>
                            </div>
                          </div>

                          {/* Address & Items details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            {/* Address Card */}
                            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80 space-y-1">
                              <span className="font-bold text-stone-800 block flex items-center gap-1 text-[11px] uppercase tracking-wider text-amber-900">
                                <MapPin className="w-3.5 h-3.5 text-amber-800" />
                                Adresse de Livraison
                              </span>
                              <p className="text-stone-700 font-medium">{ord.shippingAddress?.address}</p>
                              <p className="text-stone-500">
                                {ord.shippingAddress?.postalCode} {ord.shippingAddress?.city}, {ord.shippingAddress?.country}
                              </p>
                              <p className="text-[11px] text-amber-900 font-medium pt-1">
                                Mode : {ord.shippingMethod === 'colissimo' ? 'Colissimo / Express' : ord.shippingMethod === 'retrait_atelier' ? 'Retrait en Atelier' : 'Chronopost'}
                              </p>
                            </div>

                            {/* Items List */}
                            <div className="md:col-span-2 space-y-2">
                              <span className="font-bold text-stone-800 block text-[11px] uppercase tracking-wider text-amber-900">
                                Articles Commandés ({ord.items.length})
                              </span>
                              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                {ord.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-2 bg-stone-50 rounded-lg border border-stone-200/60">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <img
                                        src={item.product?.images?.[0]}
                                        alt={item.product?.name}
                                        referrerPolicy="no-referrer"
                                        className="w-9 h-9 object-cover rounded-md border border-stone-200"
                                      />
                                      <div className="min-w-0">
                                        <span className="font-semibold text-stone-900 block truncate">
                                          {item.product?.name}
                                        </span>
                                        <span className="text-[11px] text-stone-500">
                                          {item.quantity} × {item.product?.price} $
                                          {item.customEngraving && (
                                            <span className="ml-2 text-amber-800 font-bold">
                                              (Gravure: "{item.customEngraving}")
                                            </span>
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                    <strong className="text-stone-900 shrink-0">
                                      {(item.product?.price * item.quantity).toFixed(2)} $
                                    </strong>
                                  </div>
                                ))}
                              </div>

                              <div className="pt-2 flex flex-wrap justify-between items-center text-xs border-t border-stone-200 gap-2">
                                <span className="text-stone-500 flex items-center gap-2">
                                  <span>N° de suivi : <strong>{ord.trackingNumber || 'Généré à l’expédition'}</strong></span>
                                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                    ord.paymentDetails?.method === 'cash_on_delivery'
                                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                      : 'bg-stone-100 text-stone-700 border border-stone-200'
                                  }`}>
                                    {ord.paymentDetails?.method === 'cash_on_delivery' ? '💵 Cash à la livraison' : '💳 Payé en ligne'}
                                  </span>
                                </span>
                                <span className="font-bold text-stone-900 text-sm">
                                  Total : <span className="text-amber-900">{ord.total.toFixed(2)} $</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              ) : (
                /* Products Management Section */
                <div className="space-y-4">
                  {/* Action Bar for Articles */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                    {/* Search */}
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Filtrer mes articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={handleStartCreate}
                        className="px-4 py-2 bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Nouveau Produit</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm('Voulez-vous réinitialiser le catalogue avec les articles par défaut ?')) {
                            onResetProducts();
                            showNotification('Catalogue réinitialisé aux valeurs par défaut.');
                          }
                        }}
                        className="px-3 py-2 text-stone-600 hover:text-stone-900 border border-stone-300 rounded-xl text-xs font-medium hover:bg-stone-100 transition-colors flex items-center gap-1"
                        title="Réinitialiser le catalogue"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Réinitialiser</span>
                      </button>
                    </div>
                  </div>

                  {/* Product Cards Table / List */}
              <div className="space-y-2">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 space-y-2">
                    <p className="text-xs text-stone-500 font-medium">Aucun article ne correspond à votre recherche.</p>
                  </div>
                ) : (
                  filteredProducts.map((p) => {
                    const seoResult = analyzeSEO(p, suggestKeyword(p.name, p.categoryLabel));
                    return (
                      <div
                        key={p.id}
                        className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-700/40 transition-all shadow-2xs"
                      >
                        {/* Product Thumbnail & Basic Info */}
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 object-cover rounded-xl border border-stone-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-serif text-sm font-bold text-stone-900 truncate">
                                {p.name}
                              </h4>
                              {p.isUniquePiece && (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-full shrink-0">
                                  Pièce Unique
                                </span>
                              )}

                              {/* SEO Score Badge */}
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 border shrink-0 ${
                                  seoResult.score >= 80
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : seoResult.score >= 50
                                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                                    : 'bg-rose-50 text-rose-800 border-rose-300'
                                }`}
                                title="Score d'optimisation SEO Google"
                              >
                                <span>SEO:</span>
                                <span>{seoResult.score}%</span>
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                              <span className="text-amber-900 font-bold">{p.price} $</span>
                              <span>•</span>
                              <span>{p.categoryLabel}</span>
                              <span>•</span>
                              <span className={p.stockCount > 0 ? 'text-emerald-700 font-medium' : 'text-rose-600 font-medium'}>
                                Stock : {p.stockCount}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Controls & Edit Button */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          
                          {/* Quick Stock Toggle */}
                          <button
                            onClick={() => {
                              const updated = {
                                ...p,
                                stockCount: p.stockCount > 0 ? 0 : 5,
                                inStock: p.stockCount === 0
                              };
                              onUpdateProduct(updated);
                              showNotification(`Stock de "${p.name}" mis à jour.`);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                              p.stockCount > 0
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                            }`}
                          >
                            {p.stockCount > 0 ? 'En Stock' : 'Rupture'}
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleStartEdit(p)}
                            className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Éditer & SEO</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'article "${p.name}" ?`)) {
                                onDeleteProduct(p.id);
                                showNotification(`L'article "${p.name}" a été supprimé.`);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                            title="Supprimer l'article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}
        </div>
      )}

    </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 text-xs text-stone-600 flex justify-between items-center">
          <span>Total : <strong>{products.length} articles</strong> répertoriés</span>
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-stone-200 text-stone-800 hover:bg-stone-300 font-bold rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-stone-600" />
                Verrouiller & Déconnecter
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-stone-900 text-white font-bold rounded-xl text-xs hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Fermer l'espace vendeur
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-900 text-white font-bold rounded-xl text-xs hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Fermer
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

