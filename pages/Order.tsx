import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MealService, OrderService } from '../services/mockDb';
import { Meal, User, OrderItem } from '../types';
import { Check, X, ChevronRight } from 'lucide-react';
import { MOCK_PRICES } from '../constants';

export default function Order({ user }: { user: User | null }) {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [duration, setDuration] = useState<3 | 7 | 30>(7);
  const [selectedMeals, setSelectedMeals] = useState<OrderItem[]>([]);
  const meals = useMemo(() => MealService.getAll(), []);

  // Initialize random selection based on user goal when step 2 starts
  const initializeSelection = () => {
    // Basic recommendation logic
    const recommendedType = user?.goal === 'Tăng Cơ' ? 'Tăng Cơ (Fit+)' : 'Giảm Mỡ (Fit-)';
    const recommendedMeals = meals.filter(m => m.type === recommendedType);
    
    // Fill up the days (assuming 2 meals a day for this MVP combo)
    const mealCount = duration * 2;
    const initialItems: OrderItem[] = [];
    
    for (let i = 0; i < mealCount; i++) {
        const meal = recommendedMeals[i % recommendedMeals.length] || meals[i % meals.length];
        initialItems.push({
            mealId: meal.id,
            quantity: 1,
            removedIngredients: []
        });
    }
    setSelectedMeals(initialItems);
    setStep(2);
  };

  const handleRemoveIngredient = (itemIndex: number, ingredientName: string) => {
      const newItems = [...selectedMeals];
      const currentRemoved = newItems[itemIndex].removedIngredients;
      if (currentRemoved.includes(ingredientName)) {
          newItems[itemIndex].removedIngredients = currentRemoved.filter(i => i !== ingredientName);
      } else {
          newItems[itemIndex].removedIngredients.push(ingredientName);
      }
      setSelectedMeals(newItems);
  };

  const handlePlaceOrder = () => {
      if (!user) return;
      
      OrderService.create({
          id: Math.random().toString(36).substr(2, 9),
          userId: user.id,
          date: new Date().toISOString(),
          durationDays: duration,
          items: selectedMeals,
          totalPrice: MOCK_PRICES[duration],
          status: 'pending'
      });
      
      alert('Đặt hàng thành công! Calo giả lập đã được cập nhật vào dashboard của bạn.');
      navigate('/dashboard');
  };

  const formatCurrency = (amount: number) => {
      return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Chọn Gói Ăn Của Bạn</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {[3, 7, 30].map((days) => (
            <div key={days} 
                 onClick={() => setDuration(days as any)}
                 className={`cursor-pointer rounded-2xl p-6 border-2 transition-all ${duration === days ? 'border-emerald-500 bg-emerald-50 shadow-lg scale-105' : 'border-slate-200 hover:border-emerald-300'}`}>
               <h3 className="text-2xl font-bold text-slate-800 mb-2">{days} Ngày</h3>
               <p className="text-slate-500 mb-4">{days * 2} Bữa Ăn (Trưa & Tối)</p>
               <div className="text-xl font-bold text-emerald-600 mb-4">{formatCurrency(MOCK_PRICES[days as 3 | 7 | 30])}</div>
               <ul className="text-sm text-slate-600 space-y-2 mb-6">
                 <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500"/> Miễn phí giao hàng</li>
                 <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500"/> Tùy chỉnh món ăn</li>
               </ul>
               <button className={`w-full py-2 rounded-lg font-bold ${duration === days ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                 Chọn Gói Này
               </button>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
            <button onClick={initializeSelection} className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 flex items-center gap-2 mx-auto">
                Tiếp Theo: Chọn Món <ChevronRight size={20}/>
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-8">
            <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-800">← Quay lại</button>
            <h1 className="text-2xl font-bold">Thực Đơn {duration} Ngày</h1>
            <div className="text-emerald-600 font-bold">{formatCurrency(MOCK_PRICES[duration])}</div>
        </div>

        <div className="space-y-6 mb-8">
            {selectedMeals.map((item, idx) => {
                const meal = meals.find(m => m.id === item.mealId)!;
                return (
                    <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-4">
                        <img src={meal.imageUrl} alt={meal.name} className="w-24 h-24 object-cover rounded-lg bg-slate-100" />
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <h3 className="font-bold text-slate-800">Ngày {Math.floor(idx/2) + 1} - {idx % 2 === 0 ? 'Trưa' : 'Tối'}</h3>
                                <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-600">{meal.type}</span>
                            </div>
                            <div className="text-emerald-600 font-medium text-sm mb-2">{meal.name} - {meal.calories} kcal</div>
                            
                            {/* Ingredients Toggle */}
                            <div className="mt-2">
                                <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide font-bold">Bỏ thành phần:</p>
                                <div className="flex flex-wrap gap-2">
                                    {meal.ingredients.filter(i => i.removable).map(ing => (
                                        <button 
                                            key={ing.name}
                                            onClick={() => handleRemoveIngredient(idx, ing.name)}
                                            className={`text-xs px-2 py-1 rounded border transition-colors ${item.removedIngredients.includes(ing.name) ? 'bg-red-50 border-red-200 text-red-500 line-through' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-emerald-400'}`}
                                        >
                                            {ing.name}
                                        </button>
                                    ))}
                                    {meal.ingredients.filter(i => i.removable).length === 0 && <span className="text-xs text-slate-400 italic">Không có thành phần tùy chọn</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        <div className="sticky bottom-4 bg-white shadow-2xl p-4 rounded-xl border border-emerald-100 flex items-center justify-between">
            <div>
                <div className="text-sm text-slate-500">Tổng cộng</div>
                <div className="text-2xl font-bold text-emerald-900">{formatCurrency(MOCK_PRICES[duration])}</div>
            </div>
            <button onClick={handlePlaceOrder} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg">
                Xác Nhận Đặt Hàng
            </button>
        </div>
    </div>
  );
}