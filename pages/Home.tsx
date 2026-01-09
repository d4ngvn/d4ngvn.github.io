import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { ArrowRight, CheckCircle, TrendingUp } from 'lucide-react';

export default function Home({ user }: { user: User | null }) {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-emerald-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Ăn Sạch. <span className="text-emerald-400">Tập Sung.</span>
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto mb-10">
            Thực đơn cá nhân hóa cho mọi mục tiêu thể hình. Dù bạn muốn giảm mỡ hay tăng cơ, chúng tôi cung cấp năng lượng bạn cần.
          </p>
          <div className="flex justify-center gap-4">
            <Link to={user ? "/order" : "/auth"} className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-full transition-all shadow-lg flex items-center gap-2">
              {user ? 'Đặt Ngay' : 'Bắt Đầu Ngay'} <ArrowRight size={20} />
            </Link>
            <Link to="/meals" className="px-8 py-3 bg-transparent border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-800 font-bold rounded-full transition-all">
              Xem Thực Đơn
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Tại sao chọn GymMeal?</h2>
            <p className="text-slate-500 mt-2">Hơn cả giao đồ ăn. Đó là lối sống.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-6 bg-slate-50 rounded-2xl text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Định Hướng Mục Tiêu</h3>
              <p className="text-slate-600">Chọn giữa Tăng Cơ (Fit+) và Giảm Mỡ (Fit-). Chúng tôi tính toán Macro để bạn không phải lo nghĩ.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Theo Dõi Macro</h3>
              <p className="text-slate-600">Mọi bữa ăn tự động được lưu vào Dashboard của bạn. Theo dõi lượng calo nạp vào dễ dàng.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <UtensilsIcon />
              </div>
              <h3 className="text-xl font-bold mb-3">Chế Biến Tươi Ngon</h3>
              <p className="text-slate-600">Đầu bếp nấu mới mỗi ngày. Nguyên liệu tươi, không chất bảo quản, 100% hương vị.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const UtensilsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
);