import React, { useState } from 'react';
import { api } from '../services/api';
import { Lock, User, Mail, ArrowRight, Loader2, ShieldAlert, UserCircle, ChefHat } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: (user: { username: string, token: string }) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    latitude: 40.7128,
    longitude: -74.0060
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const res = await api.auth.login({
          username: formData.username,
          password: formData.password
        });
        onLoginSuccess(res);
      } else {
        const res = await api.auth.register({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          latitude: formData.latitude,
          longitude: formData.longitude
        });
        onLoginSuccess(res);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Authentication failed. Check API Gateway.");
    } finally {
      setLoading(false);
    }
  };

  const handleBypass = (role: 'user' | 'admin') => {
    onLoginSuccess({ 
      username: role === 'admin' ? 'Guest Admin' : 'Guest User', 
      token: 'BYPASS_TOKEN' 
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
       {/* Left Side - Image */}
       <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop" 
            alt="Restaurant Interior" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 flex flex-col justify-end p-16 text-white h-full pb-20">
             <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-orange-900/50">
               <ChefHat size={32} />
             </div>
             <h1 className="text-5xl font-bold mb-4 tracking-tight">Gourmet Gateway.</h1>
             <p className="text-xl text-slate-200 max-w-md leading-relaxed">Manage your restaurant empire with our comprehensive microservices architecture.</p>
          </div>
       </div>

       {/* Right Side - Form */}
       <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-slate-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-slate-500 mt-2">Enter your credentials to access the dashboard.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-center gap-2">
              <ShieldAlert size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 text-slate-400" size={18} />
                <input 
                  required
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition"
                  placeholder="e.g. chef_john"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 text-slate-400" size={18} />
                  <input 
                    required
                    type="email" 
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition"
                    placeholder="name@restaurant.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-slate-400" size={18} />
                <input 
                  required
                  type="password" 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 mt-4 shadow-lg shadow-orange-900/10"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  {isLogin ? 'Sign In' : 'Register'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center space-y-6">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="text-sm text-orange-600 hover:text-orange-700 font-semibold transition"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>

            <div className="relative border-t border-slate-100 pt-6">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-xs font-medium text-slate-400">
                DEVELOPER ACCESS
              </span>
              <div className="grid grid-cols-2 gap-3 mt-1">
                <button 
                  type="button"
                  onClick={() => handleBypass('user')}
                  className="group flex flex-col items-center justify-center gap-2 px-3 py-3 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-slate-600 hover:text-orange-700 rounded-xl transition-all"
                >
                  <UserCircle size={20} className="text-slate-400 group-hover:text-orange-500" />
                  <span className="text-xs font-bold">Bypass as User</span>
                </button>
                <button 
                  type="button"
                  onClick={() => handleBypass('admin')}
                  className="group flex flex-col items-center justify-center gap-2 px-3 py-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 text-slate-600 hover:text-amber-700 rounded-xl transition-all"
                >
                  <ShieldAlert size={20} className="text-slate-400 group-hover:text-amber-500" />
                  <span className="text-xs font-bold">Bypass as Admin</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};