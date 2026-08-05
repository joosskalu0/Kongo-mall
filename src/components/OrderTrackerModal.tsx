import React, { useState } from 'react';
import { Order } from '../types';
import { X, Search, PackageCheck, Truck, CheckCircle2, Clock } from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentOrders: Order[];
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  recentOrders
}) => {
  if (!isOpen) return null;

  const [searchId, setSearchId] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(
    recentOrders.length > 0 ? recentOrders[0] : null
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchId.trim().toUpperCase();
    if (!clean) return;

    const match = recentOrders.find(
      (o) => o.id.toUpperCase() === clean || o.trackingNumber.toUpperCase() === clean
    );

    if (match) {
      setFoundOrder(match);
    } else {
      // Mock generated order if search demo
      setFoundOrder({
        id: clean.startsWith('ART') ? clean : 'ART-2026-8894',
        date: 'Aujourd’hui',
        status: 'en_preparation',
        items: [],
        shippingAddress: {
          firstName: 'Marie',
          lastName: 'Mbuyi',
          email: 'marie.m@example.cd',
          phone: '+243 82 111 2233',
          address: 'Av. Kananga, Q/ Binza Pigeon, C/ Ngaliema',
          postalCode: '99901',
          city: 'Kinshasa',
          country: 'République Démocratique du Congo (RDC)'
        },
        shippingMethod: 'colissimo',
        shippingCost: 0,
        subtotal: 68,
        discountAmount: 0,
        taxAmount: 13.6,
        total: 68,
        paymentDetails: { method: 'card', cardNumberMasked: '•••• 4242' },
        trackingNumber: 'FR889410293AT',
        estimatedDelivery: 'Dans 3 jours ouvrés'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 my-auto flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-amber-50">
              Suivi de Commande & Colis
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: ART-2026-8894 ou N° de Suivi FR..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-amber-900 text-white rounded-xl text-xs font-bold hover:bg-amber-950 transition-colors flex items-center gap-1"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {foundOrder ? (
            <div className="space-y-4 bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">Référence</span>
                  <strong className="font-serif text-base font-bold text-stone-900">{foundOrder.id}</strong>
                </div>
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                  {foundOrder.status.replace('_', ' ')}
                </span>
              </div>

              {/* Steps */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-6 h-6 bg-emerald-700 text-white rounded-full flex items-center justify-center font-bold text-[10px]">✓</div>
                  <div>
                    <strong className="text-stone-900 block">Commande confirmée</strong>
                    <span className="text-stone-400 text-[11px]">{foundOrder.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="w-6 h-6 bg-amber-800 text-white rounded-full flex items-center justify-center font-bold text-[10px]">2</div>
                  <div>
                    <strong className="text-amber-900 block">Préparation dans l'atelier</strong>
                    <span className="text-stone-500 text-[11px]">Inspection de qualité & emballage compostable</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs opacity-50">
                  <div className="w-6 h-6 bg-stone-300 text-stone-600 rounded-full flex items-center justify-center font-bold text-[10px]">3</div>
                  <div>
                    <strong className="text-stone-800 block">Remis au transporteur ({foundOrder.shippingMethod})</strong>
                    <span className="text-stone-500 text-[11px]">N° de suivi: {foundOrder.trackingNumber}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 text-xs text-stone-600">
                <span>Livraison estimée : <strong className="text-amber-900">{foundOrder.estimatedDelivery}</strong></span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-stone-500 text-center italic py-4">
              Entrez votre numéro de commande pour suivre son avancée en direct.
            </p>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 bg-stone-900 text-white font-bold rounded-xl text-xs hover:bg-stone-800 transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
