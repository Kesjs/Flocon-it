"use client";

import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

interface FiltersProps {
  onFiltersChange: (filters: {
    category: string[];
    priceRange: [number, number];
    ambiance: string[];
  }) => void;
  className?: string;
}

export default function Filters({ onFiltersChange, className = "" }: FiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    ambiance: true
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedAmbiances, setSelectedAmbiances] = useState<string[]>([]);

  const categories = ['Hiver', 'Saint-Valentin'];
  const ambiances = ['Cocooning', 'Romantique'];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    onFiltersChange({
      category: newCategories,
      priceRange,
      ambiance: selectedAmbiances
    });
  };

  const handleAmbianceChange = (ambiance: string) => {
    const newAmbiances = selectedAmbiances.includes(ambiance)
      ? selectedAmbiances.filter(a => a !== ambiance)
      : [...selectedAmbiances, ambiance];
    
    setSelectedAmbiances(newAmbiances);
    onFiltersChange({
      category: selectedCategories,
      priceRange,
      ambiance: newAmbiances
    });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    const newRange: [number, number] = type === 'min' 
      ? [numValue, priceRange[1]]
      : [priceRange[0], numValue];
    
    setPriceRange(newRange);
    onFiltersChange({
      category: selectedCategories,
      priceRange: newRange,
      ambiance: selectedAmbiances
    });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedAmbiances([]);
    setPriceRange([0, 200]);
    onFiltersChange({
      category: [],
      priceRange: [0, 200],
      ambiance: []
    });
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
                          selectedAmbiances.length > 0 || 
                          priceRange[0] > 0 || 
                          priceRange[1] < 200;

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-textDark">Filtri</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-rose-custom hover:text-rose-custom-600 transition-colors"
          >
            Cancella tutto
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full text-left mb-3 group"
        >
          <h4 className="font-medium text-textDark group-hover:text-rose-custom transition-colors">
            Categoria
          </h4>
          {expandedSections.category ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.category && (
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="w-4 h-4 text-rose-custom border-gray-300 rounded focus:ring-rose focus:ring-2"
                />
                <span className="text-gray-700 group-hover:text-textDark transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left mb-3 group"
        >
          <h4 className="font-medium text-textDark group-hover:text-rose-custom transition-colors">
            Prezzo
          </h4>
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.price && (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0] || ''}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1] < 200 ? priceRange[1] : ''}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose"
              />
              <span className="text-gray-500">€</span>
            </div>
            <div className="text-sm text-gray-600">
              {priceRange[0]}€ - {priceRange[1]}€
            </div>
          </div>
        )}
      </div>

      {/* Ambiance Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('ambiance')}
          className="flex items-center justify-between w-full text-left mb-3 group"
        >
          <h4 className="font-medium text-textDark group-hover:text-rose-custom transition-colors">
            Ambienza
          </h4>
          {expandedSections.ambiance ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.ambiance && (
          <div className="space-y-2">
            {ambiances.map((ambiance) => (
              <label key={ambiance} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedAmbiances.includes(ambiance)}
                  onChange={() => handleAmbianceChange(ambiance)}
                  className="w-4 h-4 text-rose-custom border-gray-300 rounded focus:ring-rose focus:ring-2"
                />
                <span className="text-gray-700 group-hover:text-textDark transition-colors">
                  {ambiance}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Filtri attivi:</div>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((cat) => (
              <span
                key={cat}
                className="px-2 py-1 bg-rose-custom-100 text-rose-custom-800 text-xs rounded-full flex items-center space-x-1"
              >
                <span>{cat}</span>
                <button
                  onClick={() => handleCategoryChange(cat)}
                  className="hover:text-rose-custom-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedAmbiances.map((amb) => (
              <span
                key={amb}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center space-x-1"
              >
                <span>{amb}</span>
                <button
                  onClick={() => handleAmbianceChange(amb)}
                  className="hover:text-blue-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
