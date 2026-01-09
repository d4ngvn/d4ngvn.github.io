import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AuthService } from './services/mockDb';
import { User } from './types';
import { 
  Home as HomeIcon, 
  Utensils, 
  LayoutDashboard, 
  ShoppingBag, 
  User as UserIcon, 
  LogOut,
  Menu
} from 'lucide-react';

// Pages
import Home from './pages/Home';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import MealPlans from './pages/MealPlans';
import Order from './pages/Order';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

const NavBar = ({ user, onLogout }: { user: User | null, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? "text-emerald-600 font-semibold bg-emerald-50" : "text-slate-600 hover:text-emerald-500";
  const mobileLinkClass = (path: string) => `block px-4 py-2 rounded-md ${isActive(path)}`;
  const desktopLinkClass = (path: string) => `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive(path)}`;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
              <Utensils className="h-8 w-8" />
              GymMeal
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className={desktopLinkClass('/')}>
              <HomeIcon size={18} /> Trang Chủ
            </Link>
            <Link to="/meals" className={desktopLinkClass('/meals')}>
              <Utensils size={18} /> Thực Đơn
            </Link>
            {user && (
              <>
                <Link to="/order" className={desktopLinkClass('/order')}>
                  <ShoppingBag size={18} /> Đặt Ngay
                </Link>
                <Link to="/dashboard" className={desktopLinkClass('/dashboard')}>
                  <LayoutDashboard size={18} /> Theo Dõi
                </Link>
                <Link to="/profile" className={desktopLinkClass('/profile')}>
                  <UserIcon size={18} /> Hồ Sơ
                </Link>
                {user.isAdmin && (
                   <Link to="/admin" className="text-purple-600 hover:text-purple-800 font-medium px-3 py-2">
                     Quản Trị
                   </Link>
                )}
                <button 
                  onClick={onLogout}
                  className="ml-4 px-4 py-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-medium transition-colors"
                >
                  Đăng Xuất
                </button>
              </>
            )}
            {!user && (
              <Link to="/auth" className="ml-4 px-6 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 shadow-md text-sm font-medium transition-colors">
                Đăng Nhập
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-500 hover:text-slate-700">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 pb-4">
           <Link to="/" onClick={() => setIsOpen(false)} className={mobileLinkClass('/')}>Trang Chủ</Link>
           <Link to="/meals" onClick={() => setIsOpen(false)} className={mobileLinkClass('/meals')}>Thực Đơn</Link>
           {user && (
             <>
               <Link to="/order" onClick={() => setIsOpen(false)} className={mobileLinkClass('/order')}>Đặt Ngay</Link>
               <Link to="/dashboard" onClick={() => setIsOpen(false)} className={mobileLinkClass('/dashboard')}>Theo Dõi</Link>
               <Link to="/profile" onClick={() => setIsOpen(false)} className={mobileLinkClass('/profile')}>Hồ Sơ</Link>
               {user.isAdmin && (
                  <Link to="/admin" onClick={() => setIsOpen(false)} className={mobileLinkClass('/admin')}>Quản Trị</Link>
               )}
               <button onClick={() => { onLogout(); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-red-500 font-medium">
                 Đăng Xuất
               </button>
             </>
           )}
           {!user && (
              <Link to="/auth" onClick={() => setIsOpen(false)} className="block mx-4 mt-2 text-center py-2 bg-emerald-600 text-white rounded-md">
                Đăng Nhập
              </Link>
           )}
        </div>
      )}
    </nav>
  );
};

const ProtectedRoute = ({ user, children }: { user: User | null, children?: React.ReactNode }) => {
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-emerald-600">Đang tải GymMeal...</div>;

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <NavBar user={user} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/auth" element={!user ? <Auth onSuccess={(u) => setUser(u)} /> : <Navigate to="/dashboard" />} />
            <Route path="/onboarding" element={user ? <Onboarding onComplete={(u) => setUser(u)} /> : <Navigate to="/auth" />} />
            <Route path="/meals" element={<MealPlans />} />
            
            {/* Protected Routes */}
            <Route path="/order" element={<ProtectedRoute user={user}><Order user={user} /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard user={user!} /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute user={user}><Profile user={user!} /></ProtectedRoute>} />
            <Route path="/admin" element={user?.isAdmin ? <Admin /> : <Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
          <p>© 2026 GymMeal. Nạp năng lượng - Cháy đam mê.</p>
        </footer>
      </div>
    </HashRouter>
  );
}