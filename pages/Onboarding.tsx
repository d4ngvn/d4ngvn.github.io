import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/mockDb';
import { User, Goal, ActivityLevel, Gender } from '../types';

export default function Onboarding({ onComplete }: { onComplete: (user: User) => void }) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: 25,
    gender: Gender.MALE,
    height: 175,
    weight: 75,
    goal: Goal.MAINTAIN,
    activityLevel: ActivityLevel.MEDIUM,
    allergies: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newUser = await AuthService.register({
        email: state?.email || `user_${Date.now()}@example.com`,
        password: state?.password || 'password',
        ...formData,
        allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()) : [],
        dislikedIngredients: []
      });
      onComplete(newUser);
      navigate('/dashboard');
    } catch (error) {
      alert('Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-emerald-900 mb-2">Tạo Hồ Sơ</h2>
        <p className="text-slate-500 mb-8">Chúng tôi dùng thông tin này để tính toán nhu cầu calo hàng ngày của bạn.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Họ Tên</label>
              <input name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-white border rounded-lg focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tuổi</label>
              <input name="age" type="number" required value={formData.age} onChange={handleChange} className="w-full px-4 py-2 bg-white border rounded-lg focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Giới tính</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 bg-white border rounded-lg focus:ring-emerald-500 outline-none">
                {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mục tiêu</label>
              <select name="goal" value={formData.goal} onChange={handleChange} className="w-full px-4 py-2 bg-white border rounded-lg focus:ring-emerald-500 outline-none">
                {Object.values(Goal).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Chiều cao (cm)</label>
              <input name="height" type="number" required value={formData.height} onChange={handleChange} className="w-full px-4 py-2 bg-white border rounded-lg focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cân nặng (kg)</label>
              <input name="weight" type="number" required value={formData.weight} onChange={handleChange} className="w-full px-4 py-2 bg-white border rounded-lg focus:ring-emerald-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mức độ vận động</label>
            <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full px-4 py-2 bg-white border rounded-lg focus:ring-emerald-500 outline-none">
              {Object.values(ActivityLevel).map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <p className="text-xs text-slate-400 mt-1">Hãy trung thực! Điều này ảnh hưởng đến lượng calo cho phép.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Dị ứng (cách nhau bởi dấu phẩy)</label>
            <input name="allergies" type="text" value={formData.allergies} onChange={handleChange} placeholder="Đậu phộng, Hải sản..." className="w-full px-4 py-2 bg-white border rounded-lg focus:ring-emerald-500 outline-none" />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg transition-all"
          >
            {isLoading ? 'Đang tạo hồ sơ...' : 'Bắt Đầu Hành Trình'}
          </button>
        </form>
      </div>
    </div>
  );
}