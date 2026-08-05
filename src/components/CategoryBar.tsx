import React from 'react';
import { CategoryId } from '../types';
import { CATEGORIES } from '../data/products';
import { 
  Sparkles, 
  CupSoda, 
  ShoppingBag, 
  Axe, 
  Gem, 
  Scissors, 
  Shirt,
  Footprints,
  Flame 
} from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (category: CategoryId | 'all') => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CupSoda': return <CupSoda className="w-4 h-4" />;
      case 'ShoppingBag': return <ShoppingBag className="w-4 h-4" />;
      case 'Axe': return <Axe className="w-4 h-4" />;
      case 'Gem': return <Gem className="w-4 h-4" />;
      case 'Scissors': return <Scissors className="w-4 h-4" />;
      case 'Shirt': return <Shirt className="w-4 h-4" />;
      case 'Footprints': return <Footprints className="w-4 h-4" />;
      case 'Flame': return <Flame className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-stone-100/80 border-b border-stone-200 py-4 px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as CategoryId | 'all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-amber-900 text-amber-50 shadow-sm ring-1 ring-amber-900 font-semibold scale-[1.02]'
                  : 'bg-white text-stone-700 hover:bg-stone-200/80 hover:text-stone-900 border border-stone-200'
              }`}
            >
              <span className={isSelected ? 'text-amber-300' : 'text-amber-800'}>
                {getIcon(cat.icon)}
              </span>
              <span>{cat.name}</span>
              <span 
                className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-amber-800 text-amber-100' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
