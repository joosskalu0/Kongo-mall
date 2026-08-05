import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Award, 
  Send, 
  Check, 
  Heart, 
  MapPin, 
  Phone, 
  Mail,
  Lock
} from 'lucide-react';

interface FooterProps {
  onNavigate: (section: 'catalog' | 'atelier' | 'custom' | 'guarantee') => void;
  onOpenCustomOrder: () => void;
  onOpenOrderTracker: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenCustomOrder,
  onOpenOrderTracker
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800 font-sans">
      
      {/* Assurances Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-stone-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="flex gap-3">
            <div className="p-3 rounded-xl bg-amber-900/40 text-amber-400 border border-amber-700/30 shrink-0 h-fit">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-stone-100 mb-1">
                Garantie Réparation à Vie
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Toutes nos pièces d'artisanat sont remises à neuf dans notre atelier en cas d'usure.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="p-3 rounded-xl bg-amber-900/40 text-amber-400 border border-amber-700/30 shrink-0 h-fit">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-stone-100 mb-1">
                Livraison Offerte dès 80€
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Colissimo neutre en carbone et emballage zéro plastique biodégradable.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="p-3 rounded-xl bg-amber-900/40 text-amber-400 border border-amber-700/30 shrink-0 h-fit">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-stone-100 mb-1">
                Paiement à la Livraison (Cash)
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Règlement en main propre à la livraison ou retrait atelier, sans avance de frais.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="p-3 rounded-xl bg-amber-900/40 text-amber-400 border border-amber-700/30 shrink-0 h-fit">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-stone-100 mb-1">
                Retours sous 14 Jours
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Satisfait ou remboursé. Retour simplifié par étiquette prépayée.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-800 text-amber-100 flex items-center justify-center font-serif text-xl font-bold">
                K
              </div>
              <span className="font-serif text-2xl font-bold text-amber-50 tracking-tight">
                Kongo Mall
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Le premier marché en ligne dédié aux créations artisanales et fait-main de RDC. Mode Wax, ébénisterie d'art, poteries et bijoux précieux livrés avec paiement en main propre.
            </p>
          </div>

          {/* Col 2: Contact */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-amber-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              Contact
            </h4>
            <div className="space-y-3 text-xs text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-stone-400 font-medium text-[11px] uppercase tracking-wider">Adresse</span>
                  <p className="font-semibold text-stone-100 leading-snug">Av Kananga / Q/ Binzia Pigeon, C/ Ngaliema</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-stone-400 font-medium text-[11px] uppercase tracking-wider">Téléphone</span>
                  <a href="tel:0845294616" className="font-semibold text-stone-100 hover:text-amber-300 transition-colors">
                    0845294616
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-stone-400 font-medium text-[11px] uppercase tracking-wider">Email</span>
                  <a href="mailto:joosskalu72@gmail.com" className="font-semibold text-stone-100 hover:text-amber-300 transition-colors break-all">
                    joosskalu72@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="font-serif text-sm font-bold text-amber-200 uppercase tracking-wider mb-4">
              Explorer
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-amber-300 transition-colors">
                  Catalogue Général
                </button>
              </li>
              <li>
                <button onClick={onOpenCustomOrder} className="hover:text-amber-300 transition-colors">
                  Créations Sur-Mesure
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('atelier')} className="hover:text-amber-300 transition-colors">
                  L'Atelier & Les Artisans
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('guarantee')} className="hover:text-amber-300 transition-colors">
                  Nos Engagements Éco
                </button>
              </li>
              <li>
                <button onClick={onOpenOrderTracker} className="hover:text-amber-300 transition-colors">
                  Suivre une Commande
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Care */}
          <div>
            <h4 className="font-serif text-sm font-bold text-amber-200 uppercase tracking-wider mb-4">
              Service Clients
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><span className="hover:text-stone-200 cursor-pointer">Guide d'Entretien du Cuir & Grès</span></li>
              <li><span className="hover:text-stone-200 cursor-pointer">Conditions Générales de Vente</span></li>
              <li><span className="hover:text-stone-200 cursor-pointer">Politique de Confidentialité</span></li>
              <li><span className="hover:text-stone-200 cursor-pointer">Mentions Légales</span></li>
              <li><span className="hover:text-stone-200 cursor-pointer">FAQ & Aide</span></li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-amber-200 uppercase tracking-wider">
              Newsletter de l'Atelier
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Inscrivez-vous pour recevoir les invitations aux ventes privées de pièces uniques et recevez <strong>10% de réduction</strong> (Code: <code>ARTISAN10</code>).
            </p>

            {subscribed ? (
              <div className="p-3 bg-amber-900/60 border border-amber-700/50 rounded-xl text-amber-200 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400" />
                <span>Merci ! Votre code <strong>ARTISAN10</strong> est activé.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="votre@email.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-amber-800 hover:bg-amber-700 text-amber-100 rounded-xl transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
        <p className="flex items-center gap-1">
          © 2026 L'Atelier Artisanal. Façonné avec <Heart className="w-3.5 h-3.5 text-rose-600 fill-current" /> en France.
        </p>

        {/* Payment badges */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-stone-400">
          <span className="px-2 py-0.5 bg-stone-900 rounded border border-stone-800 font-bold">VISA</span>
          <span className="px-2 py-0.5 bg-stone-900 rounded border border-stone-800 font-bold">MASTERCARD</span>
          <span className="px-2 py-0.5 bg-stone-900 rounded border border-stone-800 font-bold"> PAY</span>
          <span className="px-2 py-0.5 bg-stone-900 rounded border border-stone-800 font-bold text-blue-400">PAYPAL</span>
          <span className="px-2 py-0.5 bg-stone-900 rounded border border-stone-800 font-bold text-pink-400">KLARNA</span>
        </div>
      </div>

    </footer>
  );
};
