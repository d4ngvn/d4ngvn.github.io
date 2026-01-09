import React, { useState, useMemo } from 'react';
import { MealService } from '../services/mockDb';
import { Meal, MealType } from '../types';
import { Flame, Info } from 'lucide-react';

export default function MealPlans() {
  const [filter, setFilter] = useState<'ALL' | MealType>('ALL');
  const meals = useMemo(() => MealService.getAll(), []);

  const filteredMeals = meals.filter(m => filter === 'ALL' || m.type === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Lựa Chọn Của Đầu Bếp</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Những bữa ăn giàu dinh dưỡng được thiết kế cho hiệu suất cao. Chọn <span className="text-emerald-600 font-bold">Tăng Cơ</span> để bulk hoặc <span className="text-emerald-600 font-bold">Giảm Mỡ</span> để siết.
        </p>
      </div>

      <div className="flex flex-wrap justify-center mb-8 gap-4">
        <button 
          onClick={() => setFilter('ALL')} 
          className={`px-6 py-2 rounded-full font-medium transition-colors ${filter === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-600'}`}
        >
          Tất cả
        </button>
        <button 
          onClick={() => setFilter(MealType.FIT_PLUS)} 
          className={`px-6 py-2 rounded-full font-medium transition-colors ${filter === MealType.FIT_PLUS ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}
        >
          Tăng Cơ (Fit+)
        </button>
        <button 
          onClick={() => setFilter(MealType.FIT_MINUS)} 
          className={`px-6 py-2 rounded-full font-medium transition-colors ${filter === MealType.FIT_MINUS ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700'}`}
        >
          Giảm Mỡ (Fit-)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMeals.map(meal => (
          <div key={meal.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-shadow group">
            <div className="relative h-48 overflow-hidden">
              <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {meal.calories} kcal
              </div>
              <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${meal.type === MealType.FIT_PLUS ? 'bg-emerald-600' : 'bg-orange-500'}`}>
                {meal.type}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-2">{meal.name}</h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{meal.description}</p>
              
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg text-center mb-4">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Đạm</div>
                  <div className="font-bold text-slate-700">{meal.protein}g</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Carb</div>
                  <div className="font-bold text-slate-700">{meal.carbs}g</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Béo</div>
                  <div className="font-bold text-slate-700">{meal.fat}g</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {meal.ingredients.slice(0, 3).map((ing, i) => (
                  <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                    {ing.name}
                  </span>
                ))}
                {meal.ingredients.length > 3 && (
                   <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">+{meal.ingredients.length - 3}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}