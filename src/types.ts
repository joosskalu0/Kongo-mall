export type CategoryId = 'ceramique' | 'maroquinerie' | 'ebenisterie' | 'bijoux' | 'textile' | 'vetements' | 'chaussures' | 'senteurs';

export interface Review {
  id: string;
  author: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  craftVariant?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: CategoryId;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  description: string;
  story: string; // The artisan's story behind the item
  materials: string[];
  dimensions: string;
  weight: string;
  craftingTimeHours: number;
  artisanCity: string;
  images: string[];
  inStock: boolean;
  stockCount: number;
  isUniquePiece: boolean; // Pièce unique
  isLimitedEdition: boolean; // Série limitée
  isEcoResponsible: boolean;
  isBestseller?: boolean;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  customizable: boolean;
  customizationPlaceholder?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customEngraving?: string;
  selectedColor?: string;
}

export interface FilterState {
  searchQuery: string;
  category: CategoryId | 'all';
  minPrice: number;
  maxPrice: number;
  selectedMaterials: string[];
  inStockOnly: boolean;
  uniquePieceOnly: boolean;
  ecoOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'crafting-time';
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  value: number; // e.g. 10 for 10% or 15 for 15€
  minOrderValue?: number;
  description: string;
}

export interface OrderShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  complement?: string;
  postalCode: string;
  city: string;
  country: string;
}

export type ShippingMethod = 'colissimo' | 'chronopost' | 'retrait_atelier';

export type PaymentMethodType = 'cash_on_delivery' | 'card' | 'apple_pay' | 'paypal' | 'klarna';

export interface PaymentDetails {
  method: PaymentMethodType;
  cardNumberMasked?: string;
  cardHolder?: string;
  expiryDate?: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'confirmée' | 'en_preparation' | 'expédiée' | 'livrée';
  items: CartItem[];
  shippingAddress: OrderShippingAddress;
  shippingMethod: ShippingMethod;
  shippingCost: number;
  subtotal: number;
  discountAmount: number;
  promoCodeApplied?: string;
  taxAmount: number;
  total: number;
  paymentDetails: PaymentDetails;
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface CustomOrderRequest {
  id?: string;
  clientName: string;
  clientEmail: string;
  category: CategoryId;
  budgetRange: string;
  desiredDimensions?: string;
  materialsPreference: string[];
  description: string;
  deadline?: string;
  status?: 'soumis' | 'en_etude' | 'devis_envoye';
}

export interface AIAdvisorMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  recommendedProductIds?: string[];
}
