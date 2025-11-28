import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Reservation, Restaurant } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Store, Calendar, TrendingUp, AlertCircle, ChefHat, PlusCircle, Navigation, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  user: { username: string } | null;
  isAdmin: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, isAdmin }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rests, resvs] = await Promise.all([
          api.restaurants.getAll(),
          api.reservations.getAll()
        ]);
        setRestaurants(rests || []); 
        setReservations(resvs || []);
        setError(null);
      } catch (err: any) {
        console.error("Dashboard Load Error:", err);
        setError("Failed to connect to microservices. Using fallback data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center text-slate-400 font-medium animate-pulse">Loading Kitchen Data...</div>;

  // --- ADMIN VIEW ---
  if (isAdmin) {
    const chartData = restaurants.map(r => {
      const count = reservations.filter(res => res.restaurantId === r.id).length;
      return {
        name: r.name,
        reservations: count
      };
    }).filter(d => d.reservations > 0).slice(0, 10);

    const stats = [
      { label: 'Total Venues', value: restaurants.length, icon: <Store className="text-orange-600" />, bg: 'bg-orange-50', border: 'border-orange-100' },
      { label: 'Active Bookings', value: reservations.length, icon: <Calendar className="text-amber-600" />, bg: 'bg-amber-50', border: 'border-amber-100' },
      { label: 'Avg Rating', value: (restaurants.reduce((acc, curr) => acc + curr.rating, 0) / (restaurants.length || 1)).toFixed(1), icon: <TrendingUp className="text-emerald-600" />, bg: 'bg-emerald-50', border: 'border-emerald-100' },
    ];

    return (
      <div className="space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Admin Dashboard</h2>
          <p className="text-slate-500 mt-1">System-wide overview and analytics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className={`bg-white p-6 rounded-2xl shadow-sm border ${stat.border} flex items-center gap-5 transition-all hover:shadow-md hover:-translate-y-1`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg} shadow-inner`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-3xl font-extrabold text-slate-800 mt-0.5">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <ChefHat size={20} className="text-orange-500" />
                Popular Venues
              </h3>
              <span className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Top 10 by Reservations</span>
            </div>
            <div className="h-80 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: '#fff7ed' }}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #fed7aa', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="reservations" radius={[6, 6, 0, 0]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#f97316' : '#fb923c'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200">
                  <Calendar size={32} className="mb-2 opacity-50" />
                  No reservation data to display yet
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h3>
            <div className="flex-1 space-y-4">
               <Link to="/restaurants" className="group flex items-center gap-4 p-4 rounded-xl border border-orange-100 bg-orange-50/50 hover:bg-orange-50 hover:border-orange-200 transition cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-orange-600 shadow-sm border border-orange-100 group-hover:scale-110 transition-transform">
                    <PlusCircle size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Add Restaurant</p>
                    <p className="text-xs text-slate-500 mt-0.5">Register a new venue</p>
                  </div>
               </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- USER VIEW ---
  const myReservations = reservations.filter(r => r.customerName === user?.username);
  const getRestaurantName = (id: number) => restaurants.find(r => r.id === id)?.name || "Unknown";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Hello, {user?.username}!</h2>
        <p className="text-slate-500 mt-1">Here is what's happening with your dining plans.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar size={20} className="text-orange-500" />
              My Upcoming Reservations
            </h3>
            <Link to="/reservations" className="text-sm font-medium text-orange-600 hover:text-orange-700">View All</Link>
          </div>
          
          <div className="space-y-4">
            {myReservations.length > 0 ? (
              myReservations.slice(0, 3).map(res => (
                <div key={res.id} className="flex items-center gap-4 p-4 rounded-xl bg-orange-50/50 border border-orange-100">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-orange-600 shadow-sm border border-orange-100 shrink-0">
                    <ChefHat size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800">{getRestaurantName(res.restaurantId)}</h4>
                    <p className="text-xs text-slate-500">{new Date(res.reservationTime).toLocaleString()}</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">Confirmed</span>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400">
                <p>No upcoming bookings.</p>
                <Link to="/restaurants" className="text-orange-600 font-bold mt-2 inline-block">Find a place to eat</Link>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <MapPin size={20} className="text-orange-500" />
            Discover
          </h3>
          <div className="space-y-4">
             <Link to="/restaurants" className="block p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-orange-50 hover:border-orange-100 transition group">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 group-hover:text-orange-700">Browse Restaurants</span>
                  <Navigation size={18} className="text-slate-400 group-hover:text-orange-500" />
                </div>
                <p className="text-xs text-slate-500 mt-1">Explore our curated list of dining venues.</p>
             </Link>
             <Link to="/places" className="block p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-orange-50 hover:border-orange-100 transition group">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 group-hover:text-orange-700">Geolocation Search</span>
                  <Navigation size={18} className="text-slate-400 group-hover:text-orange-500" />
                </div>
                <p className="text-xs text-slate-500 mt-1">Find what's nearby your current location.</p>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};