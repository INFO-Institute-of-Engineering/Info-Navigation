import React from 'react'
import type { CampusCategory } from '../types/campus'
import { CAMPUS_CATEGORIES } from '../data/campusLocations'
import {
  GraduationCap,
  Building2,
  Compass,
  Utensils,
  Home,
  Trophy,
  DoorOpen,
  Car,
  Layers,
} from 'lucide-react'

interface CategoryFilterChipsProps {
  selectedCategory: CampusCategory | 'all'
  onSelectCategory: (category: CampusCategory | 'all') => void
}

export const CategoryFilterChips: React.FC<CategoryFilterChipsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const getIcon = (id: CampusCategory | 'all') => {
    switch (id) {
      case 'academic':
        return <GraduationCap className="w-3.5 h-3.5" />
      case 'admin':
        return <Building2 className="w-3.5 h-3.5" />
      case 'facility':
        return <Compass className="w-3.5 h-3.5" />
      case 'dining':
        return <Utensils className="w-3.5 h-3.5" />
      case 'hostel':
        return <Home className="w-3.5 h-3.5" />
      case 'sports':
        return <Trophy className="w-3.5 h-3.5" />
      case 'entrance':
        return <DoorOpen className="w-3.5 h-3.5" />
      case 'parking':
        return <Car className="w-3.5 h-3.5" />
      default:
        return <Layers className="w-3.5 h-3.5" />
    }
  }

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 -mx-1">
      <button
        onClick={() => onSelectCategory('all')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
          selectedCategory === 'all'
            ? 'bg-blue-600 text-white shadow-blue-200'
            : 'bg-white/90 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
        }`}
      >
        {getIcon('all')}
        <span>All Places</span>
      </button>

      {CAMPUS_CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
              isSelected
                ? 'bg-blue-600 text-white shadow-blue-200'
                : 'bg-white/90 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
            }`}
          >
            {getIcon(cat.id)}
            <span>{cat.label}</span>
          </button>
        )
      })}
    </div>
  )
}
