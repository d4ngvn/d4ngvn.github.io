import React from 'react';
import { User } from '../types';

export default function Profile({ user }: { user: User }) {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Hồ Sơ Của Tôi</h1>
        
        <div className="space-y-6">
            <div className="flex justify-between border-b pb-4">
                <span className="text-slate-500">Email</span>
                <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between border-b pb-4">
                <span className="text-slate-500">Mục tiêu hiện tại</span>
                <span className="font-medium px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-sm">{user.goal}</span>
            </div>
            <div className="flex justify-between border-b pb-4">
                <span className="text-slate-500">Mức vận động</span>
                <span className="font-medium">{user.activityLevel}</span>
            </div>
             <div className="flex justify-between border-b pb-4">
                <span className="text-slate-500">TDEE (Mục tiêu Calo ngày)</span>
                <span className="font-bold text-emerald-600">{user.tdee} kcal</span>
            </div>
            <div className="flex justify-between pb-4">
                <span className="text-slate-500">Dị ứng</span>
                <span className="font-medium">{user.allergies.length ? user.allergies.join(', ') : 'Không có'}</span>
            </div>
        </div>
      </div>
    </div>
  );
}