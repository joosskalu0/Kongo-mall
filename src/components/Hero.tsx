import React from 'react';
import { Sparkles, Palette, ShieldCheck, Clock, Award, Leaf } from 'lucide-react';
import heroWorkshopImg from '../assets/images/hero_artisan_workshop_1785824090012.jpg';

interface HeroProps {
  onExploreClick: () => void;
  onCustomOrderClick: () => void;
  onAIAdvisorClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onCustomOrderClick,
  onAIAdvisorClick
}) => {
  return (
    <div className="relative overflow-hidden bg-stone-900 text-stone-100 py-16 lg:py-24 border-b border-stone-800">
      
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroWorkshopImg}
          alt="Atelier d'artisanat"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/80 to-stone-950/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-900/50 border border-amber-600/40 text-amber-200 text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Kongo Mall — Le Grand Marché Artisanal Congolais</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-amber-50 leading-[1.15] mb-6">
            L'authenticité du fait-main congolais.<br />
            <span className="italic font-normal text-amber-200/90">Paiement Cash à la livraison.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
            Sur Kongo Mall, découvrez le meilleur du savoir-faire congolais : sculptures sur bois de wengé, tenues en pagne Wax, maroquinerie faite-main, bijoux en malachite et créations sur-mesure confectionnées à Kinshasa et en RDC.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-950/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              Découvrir le Catalogue
            </button>

            <button
              onClick={onCustomOrderClick}
              className="px-6 py-3.5 bg-stone-800/90 hover:bg-stone-700/90 text-stone-100 font-semibold rounded-xl text-sm transition-all border border-stone-600/80 flex items-center gap-2 hover:border-amber-500/50"
            >
              <Palette className="w-4 h-4 text-amber-400" />
              Commande Sur-Mesure
            </button>

            <button
              onClick={onAIAdvisorClick}
              className="px-5 py-3.5 bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 font-medium rounded-xl text-sm transition-all border border-amber-700/50 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              Conseiller Cadeaux AI
            </button>
          </div>

          {/* Assurances Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-stone-800/80 text-xs text-stone-300">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-900/40 border border-amber-700/30 text-amber-400">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <strong className="block font-semibold text-stone-100">100% Fait-main</strong>
                <span className="text-stone-400">Pièces d'exception</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-900/40 border border-amber-700/30 text-amber-400">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <strong className="block font-semibold text-stone-100">Écoresponsable</strong>
                <span className="text-stone-400">Matériaux locaux</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-900/40 border border-amber-700/30 text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <strong className="block font-semibold text-stone-100">Expédition 48h</strong>
                <span className="text-stone-400">Emballage sécurisé</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-900/40 border border-amber-700/30 text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <strong className="block font-semibold text-stone-100">Garantie à vie</strong>
                <span className="text-stone-400">Réparation atelier</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
