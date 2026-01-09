import React, { useState, useEffect } from 'react';
import { User, DailyLog } from '../types';
import { TrackerService } from '../services/mockDb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { PlusCircle, MinusCircle, Flame, Dumbbell } from 'lucide-react';

export default function Dashboard({ user }: { user: User }) {
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<DailyLog[]>([]);
  const [refresh, setRefresh] = useState(0);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setTodayLog(TrackerService.getLog(user.id, todayStr));
    setWeeklyStats(TrackerService.getWeeklyStats(user.id));
  }, [user.id, refresh, todayStr]);

  const handleLog = (type: 'extra' | 'workout', amount: number) => {
    if (!todayLog) return;
    const update = type === 'extra' 
      ? { extraFoodCalories: (todayLog.extraFoodCalories || 0) + amount }
      : { workoutCalories: (todayLog.workoutCalories || 0) + amount };
    
    TrackerService.logDaily(user.id, todayStr, update);
    setRefresh(prev => prev + 1);
  };

  if (!todayLog) return null;

  const totalConsumed = (todayLog.consumedCalories || 0) + (todayLog.extraFoodCalories || 0);
  const netCalories = totalConsumed - (todayLog.workoutCalories || 0);
  const remaining = user.tdee - netCalories;
  
  // Format data for chart
  const chartData = weeklyStats.map(log => ({
      name: new Date(log.date).toLocaleDateString('vi-VN', {weekday: 'short'}),
      net: (log.consumedCalories || 0) + (log.extraFoodCalories || 0) - (log.workoutCalories || 0),
      limit: user.tdee
  }));

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Xin chào, {user.name}</h1>
          <p className="text-slate-500">Mục tiêu: {user.goal} • Chỉ tiêu: {user.tdee} kcal</p>
        </div>
        <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 text-emerald-800 font-medium">
            Chuỗi: 3 Ngày 🔥
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
         {/* Net Calories Card */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
             <h3 className="text-slate-500 font-medium mb-2">Net Calories</h3>
             <div className="text-4xl font-bold text-slate-800">{netCalories}</div>
             <div className={`text-sm mt-1 font-medium ${remaining >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                 {remaining >= 0 ? `Còn lại ${remaining}` : `Vượt quá ${Math.abs(remaining)}`}
             </div>
             <div className="absolute right-0 top-0 h-full w-2 bg-emerald-500 opacity-20"></div>
         </div>
         
         {/* Consumed Card */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="text-slate-500 font-medium mb-2 flex items-center gap-2"><Flame size={16}/> Đã Nạp</h3>
             <div className="text-4xl font-bold text-slate-800">{totalConsumed}</div>
             <div className="text-xs text-slate-400 mt-2">
                 Bữa chính: {todayLog.consumedCalories} | Ăn vặt: {todayLog.extraFoodCalories}
             </div>
         </div>

         {/* Burned Card */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="text-slate-500 font-medium mb-2 flex items-center gap-2"><Dumbbell size={16}/> Đã Đốt (Tập luyện)</h3>
             <div className="text-4xl font-bold text-slate-800">{todayLog.workoutCalories}</div>
             <div className="text-xs text-slate-400 mt-2">Không bao gồm BMR</div>
         </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-6">Biểu Đồ Tuần</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false}/>
                        <Tooltip 
                            cursor={{fill: '#f1f5f9'}}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <ReferenceLine y={user.tdee} stroke="#10b981" strokeDasharray="3 3" />
                        <Bar dataKey="net" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                </ResponsiveContainer>
              </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-6">Nhập Nhanh</h3>
              
              <div className="space-y-4">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Ăn thêm</label>
                      <div className="flex gap-2">
                          <button onClick={() => handleLog('extra', 100)} className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-sm font-medium transition-colors flex justify-center items-center gap-1">
                              <PlusCircle size={14}/> 100
                          </button>
                          <button onClick={() => handleLog('extra', 300)} className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-sm font-medium transition-colors flex justify-center items-center gap-1">
                              <PlusCircle size={14}/> 300
                          </button>
                      </div>
                  </div>

                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Tập luyện</label>
                      <div className="flex gap-2">
                          <button onClick={() => handleLog('workout', 200)} className="flex-1 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded text-sm font-medium transition-colors flex justify-center items-center gap-1">
                              <MinusCircle size={14}/> 200
                          </button>
                          <button onClick={() => handleLog('workout', 500)} className="flex-1 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded text-sm font-medium transition-colors flex justify-center items-center gap-1">
                              <MinusCircle size={14}/> 500
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}