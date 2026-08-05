import React, { useState } from 'react';
import { CustomOrderRequest, CategoryId } from '../types';
import { CATEGORIES } from '../data/products';
import { X, Palette, Send, CheckCircle2, Sparkles, Clock, ShieldCheck } from 'lucide-react';

interface CustomOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomOrderModal: React.FC<CustomOrderModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [form, setForm] = useState<CustomOrderRequest>({
    clientName: '',
    clientEmail: '',
    category: 'ceramique',
    budgetRange: '100$ - 250$',
    desiredDimensions: '',
    materialsPreference: [],
    description: '',
    deadline: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 my-auto flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-amber-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-800/60 rounded-xl border border-amber-600/40">
              <Palette className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold">
                Commande Sur-Mesure
              </h3>
              <p className="text-xs text-amber-200/80">
                Co-créez une pièce unique avec nos artisans
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-stone-900">
                Demande de Sur-Mesure Envoyée !
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                Merci {form.clientName}. Notre maître artisan étudie votre projet et vous transmettra un devis personnalisé sous 24 à 48 heures à l'adresse <strong>{form.clientEmail}</strong>.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-6 py-3 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Votre Nom & Prénom *</label>
                  <input
                    type="text"
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    required
                    placeholder="Jean Dupont"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Adresse Email *</label>
                  <input
                    type="email"
                    value={form.clientEmail}
                    onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                    required
                    placeholder="jean.dupont@example.fr"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Domaine d'Artisanat *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as CategoryId })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Budget Estimé</label>
                  <select
                    value={form.budgetRange}
                    onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                  >
                    <option value="< 100$">Moins de 100 $</option>
                    <option value="100$ - 250$">100 $ à 250 $</option>
                    <option value="250$ - 500$">250 $ à 500 $</option>
                    <option value="> 500$">Plus de 500 $</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Dimensions Souhaitées (Optionnel)</label>
                  <input
                    type="text"
                    placeholder="Ex: Hauteur 30 cm, Largeur 15 cm"
                    value={form.desiredDimensions}
                    onChange={(e) => setForm({ ...form, desiredDimensions: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Délai / Date Souhaitée</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Description détaillée du projet sur-mesure *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Décrivez votre idée : formes, teintes, gravures particulières, usage souhaité (cadeau de mariage, pièce de décoration d'intérieur...)"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 border border-stone-300 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-100 transition-colors"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold rounded-xl transition-colors shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Envoyer la demande
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
