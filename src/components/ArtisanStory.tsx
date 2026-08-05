import React from 'react';
import { ShieldCheck, Award, HeartHandshake, Recycle, MapPin } from 'lucide-react';
import workshopImg from '../assets/images/hero_artisan_workshop_1785824090012.jpg';

export const ArtisanStory: React.FC = () => {
  return (
    <section id="atelier-section" className="bg-stone-900 text-stone-100 py-20 border-t border-b border-stone-800 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text */}
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-700/50 text-amber-200 text-xs font-semibold tracking-wider uppercase">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Ateliers à Binza Pigeon, Ngaliema (Kinshasa, RDC)
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-amber-50 leading-tight">
              Des gestes ancestraux au service du beau au quotidien.
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Fondé par une communauté d'artisans d'art passionnés à Kinshasa, l'Atelier réunit des Maîtres potiers, maroquiniers, ébénistes et bijoutiers congolais. Chaque création est façonnée à la main à Kinshasa, sans sous-traitance ni fabrication industrielle.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-stone-850 border border-stone-800 rounded-2xl space-y-1">
                <strong className="text-amber-300 text-sm font-bold block flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  Garantie Réparation à Vie
                </strong>
                <p className="text-stone-400 text-xs">
                  Si un objet présente un défaut de couture ou d'assemblage, nous le réparons gratuitement dans nos ateliers de Kinshasa.
                </p>
              </div>

              <div className="p-4 bg-stone-850 border border-stone-800 rounded-2xl space-y-1">
                <strong className="text-emerald-300 text-sm font-bold block flex items-center gap-1.5">
                  <Recycle className="w-4 h-4 text-emerald-400" />
                  Matériaux Nobles & Durables
                </strong>
                <p className="text-stone-400 text-xs">
                  Argile naturelle de Maluku, bois précieux de Wengé et Noyer, cuir pleine fleur et pigments de la terre congolaise.
                </p>
              </div>
            </div>

          </div>

          {/* Right Image Grid */}
          <div className="relative">
            <div className="aspect-4/3 rounded-3xl overflow-hidden border-2 border-amber-900/40 shadow-2xl">
              <img
                src={workshopImg}
                alt="L'Atelier d'Artisanat"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute -bottom-6 -left-6 bg-amber-950/95 border border-amber-700/60 p-5 rounded-2xl shadow-2xl backdrop-blur-md max-w-xs text-xs space-y-1">
              <span className="text-amber-400 font-serif font-bold text-lg block">
                +1 800 pièces créées
              </span>
              <span className="text-stone-300 block">
                Chaque création porte le poinçon d'atelier et sa fiche d'authenticité signée par l'artisan.
              </span>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
