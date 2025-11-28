import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { Reservation, Restaurant } from '../types';
import { Clock, Calendar, User, Plus, Loader2, X, CheckCircle, Utensils, Trash2 } from 'lucide-react';

interface ReservationsProps {
  user: { username: string } | null;
  isAdmin: boolean;
}

export const Reservations: React.FC<ReservationsProps> = ({ user, isAdmin }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // URL Params for pre-selection from Restaurant page
  const location = useLocation();
  const preselectId = location.state?.preselectId;

  // Form States
  const [formRestaurantId, setFormRestaurantId] = useState<number>(0);
  const [formName, setFormName] = useState('');
  const [formTime, setFormTime] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [resData, restData] = await Promise.all([
        api.reservations.getAll(),
        api.restaurants.getAll()
      ]);
      setReservations(Array.isArray(resData) ? resData : []);
      setRestaurants(Array.isArray(restData) ? restData : []);
      
      // Handle pre-selection
      if (preselectId) {
        setFormRestaurantId(preselectId);
        setShowModal(true);
      } else if (Array.isArray(restData) && restData.length > 0) {
        setFormRestaurantId(restData[0].id!);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto-fill user name if logged in
    if (user?.username) {
       setFormName(user.username);
    }
  }, [user]); // Re-run if user context loads late

  const getRestaurantName = (id: number) => {
    return restaurants.find(r => r.id === id)?.name || `Unknown Venue (ID: ${id})`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formRestaurantId) return alert("Please select a restaurant");
    
    try {
      await api.reservations.create({
        restaurantId: formRestaurantId,
        customerName: formName,
        reservationTime: new Date(formTime).toISOString()
      });
      setShowModal(false);
      setFormTime('');
      loadData();
      alert("Reservation booked successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to create reservation.");
    }
  };

  const handleCancel = async (id: number) => {
    if(!window.confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      await api.reservations.cancel(id);
      loadData();
    } catch (e) {
      console.error(e);
      alert("Failed to cancel reservation.");
    }
  };

  // Filter reservations based on role
  const displayReservations = isAdmin 
    ? reservations 
    : reservations.filter(r => r.customerName === user?.username);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
             {isAdmin ? 'All Reservations' : 'My Reservations'}
          </h2>
          <p className="text-slate-500 mt-1">
             {isAdmin ? 'Manage all incoming bookings' : 'Track your upcoming dining plans'}
          </p>
        </div>
        <button 
          onClick={() => { setFormRestaurantId(restaurants[0]?.id || 0); setShowModal(true); }}
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow-lg shadow-orange-900/20 font-medium"
        >
          <Plus size={20} />
          New Booking
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="animate-spin text-orange-500" size={40} /></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Restaurant</th>
                {isAdmin && <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Customer</th>}
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Date & Time</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayReservations.map((res) => {
                const date = new Date(res.reservationTime);
                const isPast = date < new Date();
                
                return (
                  <tr key={res.id} className="hover:bg-orange-50/30 transition duration-150">
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">#{res.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                          <Utensils size={14} />
                        </div>
                        <span className="font-semibold text-slate-800">{getRestaurantName(res.restaurantId)}</span>
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-slate-400" />
                          {res.customerName}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex flex-col text-sm">
                        <div className="flex items-center gap-2 font-medium">
                           <Calendar size={12} className="text-slate-400" />
                           {date.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs mt-0.5">
                           <Clock size={12} />
                           {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        isPast ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {isPast ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {isPast ? 'Completed' : 'Upcoming'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       {!isPast && (
                          <button 
                             onClick={() => handleCancel(res.id!)}
                             className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition" 
                             title="Cancel Reservation"
                          >
                             <Trash2 size={18} />
                          </button>
                       )}
                    </td>
                  </tr>
                );
              })}
              {displayReservations.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center">
                      <Calendar size={32} className="mb-3 opacity-30" />
                      {isAdmin ? 'No reservations found in the system.' : 'You have no upcoming reservations.'}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <h3 className="text-xl font-bold text-slate-800">New Table Booking</h3>
               <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Select Restaurant</label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-orange-500 outline-none appearance-none"
                    value={formRestaurantId}
                    onChange={e => setFormRestaurantId(Number(e.target.value))}
                  >
                    <option value={0} disabled>-- Choose a Venue --</option>
                    {restaurants.map(r => (
                      <option key={r.id} value={r.id}>{r.name} ({r.cuisine})</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-3.5 pointer-events-none text-slate-500">
                    <Utensils size={14} />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Customer Name</label>
                <input required type="text" className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-orange-500 outline-none placeholder:text-slate-300" 
                  value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. John Doe" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Date & Time</label>
                <input required type="datetime-local" className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-orange-500 outline-none"
                  value={formTime} onChange={e => setFormTime(e.target.value)} />
              </div>
              
              <button type="submit" className="w-full mt-2 px-4 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-900/10 transition-all flex items-center justify-center gap-2">
                 <CheckCircle size={18} />
                 Confirm Reservation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};