import React, { useState } from 'react';
import { Product, FilterState } from '../types';
import { ProductCard } from './ProductCard';
import { 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Grid, 
  List, 
  Sparkles, 
  Check, 
  Filter
} from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  filterState: FilterState;
  onFilterChange: (newFilterState: FilterState) => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const ALL_MATERIALS = [
  'Argile Grès naturel',
  'Cuir pleine fleur collet',
  'Noyer français massif',
  'Argent Sterling 925 recyclé',
  'Laine Mérinos pure',
  'Cire de Soja 100% végétale'
];

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  filterState,
  onFilterChange,
  wishlistIds,
  onToggleWishlist,
  onQuickView,
  onAddToCart
}) => {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter Logic
  const filteredProducts = products.filter((p) => {
    // Search
    if (filterState.searchQuery) {
      const q = filterState.searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchMat = p.materials.some((m) => m.toLowerCase().includes(q));
      const matchCity = p.artisanCity.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchMat && !matchCity) return false;
    }

    // Category
    if (filterState.category !== 'all' && p.category !== filterState.category) {
      return false;
    }

    // Price
    if (p.price < filterState.minPrice || p.price > filterState.maxPrice) {
      return false;
    }

    // Materials
    if (filterState.selectedMaterials.length > 0) {
      const hasSelectedMat = filterState.selectedMaterials.some((m) =>
        p.materials.some((pMat) => pMat.toLowerCase().includes(m.toLowerCase()))
      );
      if (!hasSelectedMat) return false;
    }

    // In Stock
    if (filterState.inStockOnly && !p.inStock) {
      return false;
    }

    // Unique Piece
    if (filterState.uniquePieceOnly && !p.isUniquePiece) {
      return false;
    }

    // Eco Only
    if (filterState.ecoOnly && !p.isEcoResponsible) {
      return false;
    }

    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filterState.sortBy) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'crafting-time': return b.craftingTimeHours - a.craftingTimeHours;
      default: return 0; // featured
    }
  });

  const activeFilterCount =
    (filterState.category !== 'all' ? 1 : 0) +
    filterState.selectedMaterials.length +
    (filterState.inStockOnly ? 1 : 0) +
    (filterState.uniquePieceOnly ? 1 : 0) +
    (filterState.ecoOnly ? 1 : 0) +
    (filterState.maxPrice < 300 ? 1 : 0);

  const handleResetFilters = () => {
    onFilterChange({
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
  };

  const toggleMaterial = (mat: string) => {
    const exists = filterState.selectedMaterials.includes(mat);
    const updated = exists
      ? filterState.selectedMaterials.filter((m) => m !== mat)
      : [...filterState.selectedMaterials, mat];
    onFilterChange({ ...filterState, selectedMaterials: updated });
  };

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header bar: Count & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Créations d'Atelier
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {sortedProducts.length} {sortedProducts.length > 1 ? 'objets façonnés' : 'objet façonné'} disponible{sortedProducts.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          
          {/* Filter Trigger Button */}
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold border border-stone-300 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-800" />
            <span>Filtres</span>
            {activeFilterCount > 0 && (
              <span className="bg-amber-900 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={filterState.sortBy}
              onChange={(e) =>
                onFilterChange({
                  ...filterState,
                  sortBy: e.target.value as FilterState['sortBy']
                })
              }
              className="px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
            >
              <option value="featured">Tri : En vedette</option>
              <option value="price-asc">Prix : croissant</option>
              <option value="price-desc">Prix : décroissant</option>
              <option value="rating">Les mieux notées</option>
              <option value="crafting-time">Heures de façonnage</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="hidden sm:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Vue grille"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Vue liste"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <span className="text-xs font-medium text-stone-500">Filtres actifs :</span>
          
          {filterState.category !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-medium">
              Catégorie: {filterState.category}
              <button onClick={() => onFilterChange({ ...filterState, category: 'all' })}>
                <X className="w-3 h-3 text-amber-800 hover:text-amber-950" />
              </button>
            </span>
          )}

          {filterState.selectedMaterials.map((mat) => (
            <span key={mat} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200 text-stone-800 text-xs font-medium">
              Matière: {mat}
              <button onClick={() => toggleMaterial(mat)}>
                <X className="w-3 h-3 hover:text-stone-950" />
              </button>
            </span>
          ))}

          {filterState.uniquePieceOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 text-amber-300 text-xs font-medium">
              Pièce Unique
              <button onClick={() => onFilterChange({ ...filterState, uniquePieceOnly: false })}>
                <X className="w-3 h-3 text-amber-200 hover:text-white" />
              </button>
            </span>
          )}

          {filterState.inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-medium">
              En stock
              <button onClick={() => onFilterChange({ ...filterState, inStockOnly: false })}>
                <X className="w-3 h-3 hover:text-emerald-950" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-xs text-amber-900 font-semibold underline underline-offset-2 ml-2 hover:text-amber-950 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Réinitialiser tout
          </button>
        </div>
      )}

      {/* Main Grid or Empty State */}
      <div className="mt-8">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16 bg-stone-50 rounded-2xl border border-dashed border-stone-300 p-8">
            <Filter className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-stone-800 mb-1">
              Aucune création ne correspond à vos critères
            </h3>
            <p className="text-stone-500 text-sm mb-6 max-w-md mx-auto">
              Essayez d’élargir vos filtres de recherche ou réinitialisez la sélection pour découvrir nos autres créations artisanales.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-4'
            }
          >
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Filter Sidebar Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-900" />
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Filtres de Sélection
                </h3>
              </div>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-6 flex-1">
              
              {/* Price Range Slider */}
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Prix maximum : <span className="text-amber-900 font-serif text-base font-bold">{filterState.maxPrice} $</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="300"
                  step="5"
                  value={filterState.maxPrice}
                  onChange={(e) =>
                    onFilterChange({
                      ...filterState,
                      maxPrice: Number(e.target.value)
                    })
                  }
                  className="w-full accent-amber-900"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-1 font-medium">
                  <span>20 $</span>
                  <span>300 $</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterState.uniquePieceOnly}
                    onChange={(e) =>
                      onFilterChange({
                        ...filterState,
                        uniquePieceOnly: e.target.checked
                      })
                    }
                    className="w-4 h-4 rounded-md text-amber-900 focus:ring-amber-800 border-stone-300"
                  />
                  <span className="text-xs font-medium text-stone-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Pièce Unique uniquement
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterState.inStockOnly}
                    onChange={(e) =>
                      onFilterChange({
                        ...filterState,
                        inStockOnly: e.target.checked
                      })
                    }
                    className="w-4 h-4 rounded-md text-amber-900 focus:ring-amber-800 border-stone-300"
                  />
                  <span className="text-xs font-medium text-stone-800">
                    Disponibilité immédiate (En Stock)
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterState.ecoOnly}
                    onChange={(e) =>
                      onFilterChange({
                        ...filterState,
                        ecoOnly: e.target.checked
                      })
                    }
                    className="w-4 h-4 rounded-md text-amber-900 focus:ring-amber-800 border-stone-300"
                  />
                  <span className="text-xs font-medium text-stone-800">
                    Matériaux écoresponsables & locaux
                  </span>
                </label>
              </div>

              {/* Material Filter */}
              <div className="pt-2 border-t border-stone-100">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
                  Matière d'Artisanat
                </label>
                <div className="space-y-2">
                  {ALL_MATERIALS.map((mat) => {
                    const isChecked = filterState.selectedMaterials.includes(mat);
                    return (
                      <label key={mat} className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-700">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleMaterial(mat)}
                          className="w-4 h-4 rounded-md text-amber-900 focus:ring-amber-800 border-stone-300"
                        />
                        <span>{mat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Footer buttons */}
            <div className="pt-4 border-t border-stone-200 flex gap-3">
              <button
                onClick={handleResetFilters}
                className="w-1/2 py-3 border border-stone-300 text-stone-800 text-xs font-bold rounded-xl hover:bg-stone-100 transition-colors"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-1/2 py-3 bg-amber-900 text-amber-50 text-xs font-bold rounded-xl hover:bg-amber-950 transition-colors shadow-sm"
              >
                Appliquer
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
