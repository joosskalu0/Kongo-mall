import React, { useState } from 'react';
import { CartItem, OrderShippingAddress, PaymentMethodType, Order } from '../types';
import { PROMO_CODES } from '../data/promos';
import { 
  X, 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Printer, 
  Download, 
  PackageCheck, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Banknote,
  HandCoins
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedPromoCode?: string;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedPromoCode,
  onOrderCompleted
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Address State
  const [address, setAddress] = useState<OrderShippingAddress>({
    firstName: 'Joos',
    lastName: 'Kalu',
    email: 'joosskalu72@gmail.com',
    phone: '0845294616',
    address: 'Av. Kananga, Q/ Binza Pigeon',
    complement: 'C/ Ngaliema',
    postalCode: '99901',
    city: 'Kinshasa',
    country: 'République Démocratique du Congo (RDC)'
  });

  const [shippingMethod, setShippingMethod] = useState<'colissimo' | 'chronopost' | 'retrait_atelier'>('colissimo');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cash_on_delivery');
  const [cardHolder, setCardHolder] = useState('CAMILLE LAURENT');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8894');
  const [cardExpiry, setCardExpiry] = useState('09/28');
  const [cardCvv, setCardCvv] = useState('342');

  // Created Order Result
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Totals
  const subtotal = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);

  let discountAmount = 0;
  if (appliedPromoCode && PROMO_CODES[appliedPromoCode]) {
    const p = PROMO_CODES[appliedPromoCode];
    if (p.discountType === 'percentage') discountAmount = (subtotal * p.value) / 100;
    else if (p.discountType === 'fixed') discountAmount = p.value;
  }

  let shippingCost = 0;
  if (shippingMethod === 'chronopost') shippingCost = 9.90;
  else if (shippingMethod === 'colissimo') shippingCost = subtotal >= 80 ? 0 : 5.90;
  else shippingCost = 0; // retrait atelier

  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleFormatCardNumber = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleFormatExpiry = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingAddress: address,
          paymentDetails: { method: paymentMethod, cardNumberMasked: cardNumber.slice(-4) }
        })
      });

      const data = await response.json();

      const newOrder: Order = {
        id: data.orderId || ('ART-2026-' + Math.floor(1000 + Math.random() * 9000)),
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: 'confirmée',
        items,
        shippingAddress: address,
        shippingMethod,
        shippingCost,
        subtotal,
        discountAmount,
        promoCodeApplied: appliedPromoCode,
        taxAmount: total * 0.2, // 20% TVA
        total,
        paymentDetails: {
          method: paymentMethod,
          cardNumberMasked: '•••• ' + (cardNumber.slice(-4) || '8894'),
          cardHolder
        },
        trackingNumber: data.trackingNumber || ('FR' + Math.floor(100000000 + Math.random() * 900000000) + 'AT'),
        estimatedDelivery: '3 à 4 jours ouvrés'
      };

      setCreatedOrder(newOrder);
      onOrderCompleted(newOrder);
      setStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 my-auto flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-amber-50">
              Paiement Sécurisé SSL 256-bit
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-stone-100 px-6 py-3 border-b border-stone-200 flex items-center justify-around text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-amber-900 font-bold' : step > 1 ? 'text-emerald-700' : 'text-stone-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-amber-900 text-white' : step > 1 ? 'bg-emerald-700 text-white' : 'bg-stone-300 text-stone-600'}`}>
              1
            </span>
            <span>Livraison</span>
          </div>

          <div className="w-8 h-0.5 bg-stone-300" />

          <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-amber-900 font-bold' : step > 2 ? 'text-emerald-700' : 'text-stone-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-amber-900 text-white' : step > 2 ? 'bg-emerald-700 text-white' : 'bg-stone-300 text-stone-600'}`}>
              2
            </span>
            <span>Paiement</span>
          </div>

          <div className="w-8 h-0.5 bg-stone-300" />

          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-emerald-700 font-bold' : 'text-stone-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-emerald-700 text-white' : 'bg-stone-300 text-stone-600'}`}>
              3
            </span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: SHIPPING */}
          {step === 1 && (
            <div className="space-y-6">
              <h4 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-800" />
                Adresse de livraison & Coordonnées
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    value={address.firstName}
                    onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    value={address.lastName}
                    onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email de confirmation *</label>
                  <input
                    type="email"
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Téléphone mobile *</label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Adresse voie *</label>
                  <input
                    type="text"
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Code Postal *</label>
                  <input
                    type="text"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Ville *</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    required
                  />
                </div>
              </div>

              {/* Shipping Method */}
              <div className="space-y-3 pt-4 border-t border-stone-200">
                <h5 className="font-serif text-sm font-bold text-stone-900">
                  Mode de livraison
                </h5>

                <div className="space-y-2">
                  <label className={`flex items-center justify-between p-3.5 border rounded-2xl cursor-pointer transition-all ${shippingMethod === 'colissimo' ? 'border-amber-800 bg-amber-50/50 ring-1 ring-amber-800' : 'border-stone-200 bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'colissimo'}
                        onChange={() => setShippingMethod('colissimo')}
                        className="text-amber-900 focus:ring-amber-800"
                      />
                      <div>
                        <strong className="block text-xs font-bold text-stone-900">Livraison Domicile Kinshasa (24-48h)</strong>
                        <span className="text-[11px] text-stone-500">Livré à votre adresse à Gombe, Ngaliema, Limete, etc.</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-900">
                      {subtotal >= 80 ? 'Gratuit' : '5,90 $'}
                    </span>
                  </label>

                  <label className={`flex items-center justify-between p-3.5 border rounded-2xl cursor-pointer transition-all ${shippingMethod === 'chronopost' ? 'border-amber-800 bg-amber-50/50 ring-1 ring-amber-800' : 'border-stone-200 bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'chronopost'}
                        onChange={() => setShippingMethod('chronopost')}
                        className="text-amber-900 focus:ring-amber-800"
                      />
                      <div>
                        <strong className="block text-xs font-bold text-stone-900">Coursier Express Kinshasa (Même Jour)</strong>
                        <span className="text-[11px] text-stone-500">Remise en main propre par moto-coursier sécurisé</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-900">9,90 $</span>
                  </label>

                  <label className={`flex items-center justify-between p-3.5 border rounded-2xl cursor-pointer transition-all ${shippingMethod === 'retrait_atelier' ? 'border-amber-800 bg-amber-50/50 ring-1 ring-amber-800' : 'border-stone-200 bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'retrait_atelier'}
                        onChange={() => setShippingMethod('retrait_atelier')}
                        className="text-amber-900 focus:ring-amber-800"
                      />
                      <div>
                        <strong className="block text-xs font-bold text-stone-900">Retrait en Atelier (Binza Pigeon, Ngaliema)</strong>
                        <span className="text-[11px] text-stone-500">Retrait gratuit à notre siège : Av. Kananga, Q/ Binza Pigeon</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 uppercase">Gratuit</span>
                  </label>
                </div>
              </div>

              {/* Step 1 Footer */}
              <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
                <span className="text-sm font-bold font-serif text-stone-900">
                  Total à payer : {total.toFixed(2)} $
                </span>
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <span>Continuer vers le Paiement</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 2 && (
            <form onSubmit={handlePay} className="space-y-6">
              <h4 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-800" />
                Moyen de Paiement Sécurisé
              </h4>

              {/* Payment Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`p-3 border rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all text-center col-span-2 sm:col-span-1 ${paymentMethod === 'cash_on_delivery' ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-700/30' : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'}`}
                >
                  <HandCoins className="w-4 h-4 text-emerald-700" />
                  <span>Cash à la livraison 💵</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 border rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all text-center ${paymentMethod === 'card' ? 'border-amber-800 bg-amber-50 text-amber-900 ring-1 ring-amber-800' : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'}`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Carte Bancaire</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 border rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all text-center ${paymentMethod === 'apple_pay' ? 'border-amber-800 bg-amber-50 text-amber-900 ring-1 ring-amber-800' : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'}`}
                >
                  <span className="font-black"> Pay</span>
                  <span>Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 border rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all text-center ${paymentMethod === 'paypal' ? 'border-amber-800 bg-amber-50 text-amber-900 ring-1 ring-amber-800' : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'}`}
                >
                  <span className="font-bold text-blue-700">PayPal</span>
                  <span>Express</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('klarna')}
                  className={`p-3 border rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all text-center ${paymentMethod === 'klarna' ? 'border-amber-800 bg-amber-50 text-amber-900 ring-1 ring-amber-800' : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'}`}
                >
                  <span className="font-bold text-pink-600">Klarna.</span>
                  <span>3x</span>
                </button>
              </div>

              {/* Cash on Delivery Section */}
              {paymentMethod === 'cash_on_delivery' && (
                <div className="p-5 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-stone-800 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-emerald-700 text-white rounded-xl shrink-0">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-serif font-bold text-stone-900 text-sm">
                        Paiement Cash en Main Propre à la Livraison
                      </h5>
                      <p className="text-xs text-stone-600 mt-0.5">
                        Vous ne payez rien maintenant ! Vous réglerez le montant exact de <strong className="text-emerald-950 font-bold">{total.toFixed(2)} $</strong> en espèces directement au livreur ou à l'artisan lors de la remise de votre commande.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-emerald-200/60 font-medium text-emerald-900">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      Vérification du colis avant paiement
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      Reçu officiel remis en main propre
                    </span>
                  </div>
                </div>
              )}

              {/* Credit Card Form Section */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 bg-stone-50 p-5 rounded-2xl border border-stone-200">
                  
                  {/* Credit Card Visual Mock */}
                  <div className="w-full bg-gradient-to-tr from-stone-900 via-stone-850 to-stone-800 p-5 rounded-2xl text-stone-100 shadow-xl space-y-4 border border-stone-700">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-amber-400 font-bold uppercase tracking-widest">ATELIER ARTISANAL</span>
                      <CreditCard className="w-6 h-6 text-stone-300" />
                    </div>
                    <div className="font-mono text-lg font-bold tracking-widest text-amber-100 py-1">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-stone-300 uppercase">
                      <div>
                        <span className="block text-[9px] text-stone-400">Titulaire</span>
                        <span>{cardHolder || 'NOM DU TITULAIRE'}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-stone-400">Expire</span>
                        <span>{cardExpiry || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Nom sur la carte *</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        required
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Numéro de carte (16 chiffres) *</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => handleFormatCardNumber(e.target.value)}
                        placeholder="4532 0000 0000 0000"
                        maxLength={19}
                        required
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Expiration MM/YY *</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => handleFormatExpiry(e.target.value)}
                          placeholder="09/28"
                          maxLength={5}
                          required
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Cryptogramme CVV *</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.slice(0, 4))}
                          placeholder="123"
                          maxLength={4}
                          required
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {paymentMethod !== 'card' && paymentMethod !== 'cash_on_delivery' && (
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-2">
                  <p className="text-xs text-stone-700">
                    Vous allez être redirigé de manière sécurisée vers votre application <strong className="capitalize">{paymentMethod.replace('_', ' ')}</strong> pour valider le paiement.
                  </p>
                </div>
              )}

              {/* Order Cost Final Recap */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60 text-xs space-y-1.5 text-stone-700">
                <div className="flex justify-between">
                  <span>Sous-total créations ({items.length}) :</span>
                  <span>{subtotal.toFixed(2)} $</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Code promo Réduction :</span>
                    <span>- {discountAmount.toFixed(2)} $</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Livraison ({shippingMethod}) :</span>
                  <span>{shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(2)} $`}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-amber-200 font-serif font-bold text-base text-stone-950">
                  <span>{paymentMethod === 'cash_on_delivery' ? 'Montant à payer à la livraison :' : 'Montant Total Débité :'}</span>
                  <span className="text-amber-950">{total.toFixed(2)} $</span>
                </div>
              </div>

              {/* Step 2 Footer */}
              <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 border border-stone-300 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-100 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {isProcessing
                      ? 'Traitement en cours...'
                      : paymentMethod === 'cash_on_delivery'
                      ? `Confirmer la Commande (${total.toFixed(2)} $ à la livraison)`
                      : `Confirmer & Payer ${total.toFixed(2)} $`}
                  </span>
                </button>
              </div>

            </form>
          )}

          {/* STEP 3: ORDER CONFIRMATION RECEIPT */}
          {step === 3 && createdOrder && (
            <div className="space-y-6 text-center py-4">
              
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner animate-scale-in">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
                  Commande Confirmée & Transmise à l'Atelier
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Merci pour votre confiance, {createdOrder.shippingAddress.firstName} !
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Un e-mail de confirmation détaillé a été envoyé à <strong>{createdOrder.shippingAddress.email}</strong>.
                </p>
              </div>

              {/* Order Reference Box */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-left space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
                  <div>
                    <span className="text-[11px] text-stone-400 block uppercase font-bold">Référence de commande</span>
                    <strong className="font-serif text-lg font-bold text-amber-950">{createdOrder.id}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-400 block uppercase font-bold">N° de Suivi Colis</span>
                    <strong className="font-mono text-xs text-emerald-800 font-bold">{createdOrder.trackingNumber}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-600 pt-1">
                  <div>
                    <strong className="block text-stone-900">Adresse de Livraison :</strong>
                    <p>{createdOrder.shippingAddress.address}</p>
                    <p>{createdOrder.shippingAddress.postalCode} {createdOrder.shippingAddress.city}</p>
                  </div>
                  <div>
                    <strong className="block text-stone-900">Moyen de Paiement :</strong>
                    <p className="text-emerald-800 font-bold">
                      {createdOrder.paymentDetails.method === 'cash_on_delivery'
                        ? `Cash à la livraison (${createdOrder.total.toFixed(2)} $)`
                        : `Carte Bancaire (${createdOrder.paymentDetails.cardNumberMasked})`}
                    </p>
                    <p className="text-[11px] text-stone-400">
                      {createdOrder.paymentDetails.method === 'cash_on_delivery'
                        ? 'Règlement en main propre à la remise du colis'
                        : 'Paiement en ligne validé'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Status Progress Bar */}
              <div className="bg-stone-900 text-stone-100 rounded-2xl p-4 text-left space-y-3">
                <div className="flex justify-between text-xs font-bold text-amber-300">
                  <span>Suivi de préparation en direct</span>
                  <span>Étape 1 / 4</span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-medium text-stone-400">
                  <div className="text-amber-300 font-bold">1. Enregistrée</div>
                  <div>2. En Façonnage</div>
                  <div>3. En Transit</div>
                  <div>4. Livrée</div>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div className="w-1/4 h-full bg-amber-400 rounded-full" />
                </div>
              </div>

              {/* Actions: Print Invoice & Close */}
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 border border-stone-300 text-stone-800 rounded-xl text-xs font-bold hover:bg-stone-100 transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-amber-800" />
                  <span>Imprimer la Facture</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors"
                >
                  Retourner au Catalogue
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
