import React, { useState, useEffect } from 'react';
import { MealService } from '../services/mockDb';
import { Meal, MealType } from '../types';

export default function Admin() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Simple form state for adding meal
  const [newMeal, setNewMeal] = useState<Partial<Meal>>({
      name: '', calories: 500, type: MealType.FIT_PLUS, protein: 0, carbs: 0, fat: 0
  });

  useEffect(() => {
    setMeals(MealService.getAll());
  }, [showForm]);

  const handleToggle = (id: string) => {
      MealService.toggleActive(id);
      setMeals(MealService.getAll()); // Refresh
  };

  const handleAddMeal = (e: React.FormEvent) => {
      e.preventDefault();
      MealService.save({
          id: Math.random().toString(36).substr(2, 9),
          isActive: true,
          ingredients: [{name: 'Thành phần cơ bản', removable: false}], // simplified for mvp
          imageUrl: 'https://picsum.photos/400/300',
          description: 'Món mới của đầu bếp.',
          ...newMeal
      } as Meal);
      setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Quản Lý Bếp</h1>
            <button onClick={() => setShowForm(!showForm)} className="bg-slate-900 text-white px-4 py-2 rounded-lg">
                {showForm ? 'Hủy Bỏ' : 'Thêm Món Mới'}
            </button>
        </div>

        {showForm && (
            <div className="bg-slate-100 p-6 rounded-xl mb-8">
                <form onSubmit={handleAddMeal} className="grid grid-cols-2 gap-4">
                    <input className="p-2 bg-white rounded border" placeholder="Tên món ăn" value={newMeal.name} onChange={e => setNewMeal({...newMeal, name: e.target.value})} required/>
                    <select className="p-2 bg-white rounded border" value={newMeal.type} onChange={e => setNewMeal({...newMeal, type: e.target.value as MealType})}>
                        <option value={MealType.FIT_PLUS}>Tăng Cơ (Fit+)</option>
                        <option value={MealType.FIT_MINUS}>Giảm Mỡ (Fit-)</option>
                    </select>
                    <input className="p-2 bg-white rounded border" type="number" placeholder="Calories" value={newMeal.calories} onChange={e => setNewMeal({...newMeal, calories: parseInt(e.target.value)})} required/>
                    <div className="flex gap-2">
                        <input className="p-2 bg-white rounded border w-1/3" type="number" placeholder="Đạm" value={newMeal.protein} onChange={e => setNewMeal({...newMeal, protein: parseInt(e.target.value)})}/>
                        <input className="p-2 bg-white rounded border w-1/3" type="number" placeholder="Carb" value={newMeal.carbs} onChange={e => setNewMeal({...newMeal, carbs: parseInt(e.target.value)})}/>
                        <input className="p-2 bg-white rounded border w-1/3" type="number" placeholder="Béo" value={newMeal.fat} onChange={e => setNewMeal({...newMeal, fat: parseInt(e.target.value)})}/>
                    </div>
                    <button type="submit" className="col-span-2 bg-emerald-600 text-white py-2 rounded font-bold">Lưu Món Ăn</button>
                </form>
            </div>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                    <tr>
                        <th className="p-4 font-semibold text-slate-600">Món Ăn</th>
                        <th className="p-4 font-semibold text-slate-600">Loại</th>
                        <th className="p-4 font-semibold text-slate-600">Calories</th>
                        <th className="p-4 font-semibold text-slate-600">Macro (P/C/F)</th>
                        <th className="p-4 font-semibold text-slate-600">Trạng Thái</th>
                        <th className="p-4 font-semibold text-slate-600">Hành Động</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {meals.map(meal => (
                        <tr key={meal.id} className="hover:bg-slate-50">
                            <td className="p-4 font-medium">{meal.name}</td>
                            <td className="p-4">
                                <span className={`text-xs px-2 py-1 rounded font-bold ${meal.type === MealType.FIT_PLUS ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}`}>
                                    {meal.type}
                                </span>
                            </td>
                            <td className="p-4 text-slate-600">{meal.calories}</td>
                            <td className="p-4 text-slate-500 text-sm">{meal.protein} / {meal.carbs} / {meal.fat}</td>
                            <td className="p-4">
                                {meal.isActive ? <span className="text-emerald-600 font-bold text-xs">Hoạt động</span> : <span className="text-slate-400 text-xs">Vô hiệu</span>}
                            </td>
                            <td className="p-4">
                                <button onClick={() => handleToggle(meal.id)} className="text-sm underline text-blue-600">
                                    {meal.isActive ? 'Tắt' : 'Bật'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}