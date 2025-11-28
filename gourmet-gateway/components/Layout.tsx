import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  UtensilsCrossed, 
  CalendarDays, 
  MapPin, 
  LogOut, 
  Menu,
  X,
  User,
  ChefHat
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  user: { username: string } | null;
}

export const Layout: React.FC<LayoutProps> = ({ children, onLogout, user }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
    { name: 'Restaurants', path: '/restaurants', icon: <UtensilsCrossed size={20} /> },
    { name: 'Reservations', path: '/reservations', icon: <CalendarDays size={20} /> },
    { name: 'Places Search', path: '/places', icon: <MapPin size={20} /> },
  ];

  const getPageTitle = () => {
    const current = navItems.find(item => item.path === location.pathname);
    return current ? current.name : 'Gourmet Gateway';
  };

  return (
    <div className="flex h-screen bg-orange-50/30 overflow-hidden font-sans">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out lg:transform-none flex flex-col shadow-2xl
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20">
              <ChefHat size={22} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight block leading-tight">Gourmet</span>
              <span className="text-xs text-orange-400 font-medium tracking-widest uppercase">Gateway</span>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium duration-200
                ${isActive 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/30 translate-x-1' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'}
              `}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 mb-4 px-2 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-orange-400 border border-slate-600">
              <User size={18} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.username || 'Guest'}</p>
              <p className="text-xs text-slate-400">Admin Access</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent hover:border-red-900/30"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-orange-100 h-16 flex items-center justify-between px-6 lg:px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-slate-500 hover:text-orange-600 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-xs font-mono font-medium text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">v1.2.0</span>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};