import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Restaurant } from '../types';
import { MapPin, Star, Plus, Trash2, Edit2, Loader2, Utensils, X, Check, Search, Map as MapIcon, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RestaurantsProps {
  user: { username: string } | null;
  isAdmin: boolean;
}

export const Restaurants: React.FC<RestaurantsProps> = ({ user, isAdmin }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [showFormModal, setShowFormModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Data States
  const [formData, setFormData] = useState<Partial<Restaurant>>({
    name: '', address: '', cuisine: '', rating: 4.5, latitude: 40.7128, longitude: -74.0060
  });
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  
  // User Location for distance calc
  const [userLat, setUserLat] = useState<number>(40.7128); // Default NY
  const [userLng, setUserLng] = useState<number>(-74.0060);
  
  const navigate = useNavigate();

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const data = await api.restaurants.getAll();
      const list = Array.isArray(data) ? data : [];
      setRestaurants(list);
      setFilteredRestaurants(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
    // Try getting user location for map distance
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLat(pos.coords.latitude);
          setUserLng(pos.coords.longitude);
        },
        () => console.log("Loc permission denied, using defaults")
      );
    }
  }, []);

  useEffect(() => {
    const lower = searchQuery.toLowerCase();
    const filtered = restaurants.filter(r => 
      r.name.toLowerCase().includes(lower) || 
      r.cuisine.toLowerCase().includes(lower)
    );
    setFilteredRestaurants(filtered);
  }, [searchQuery, restaurants]);

  // --- HANDLERS ---
  
  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.restaurants.delete(id);
      loadRestaurants();
    } catch (e) {
      console.error(e);
      alert("Delete failed.");
    }
  };

  const handleOpenCreate = () => {
    setFormData({ name: '', address: '', cuisine: '', rating: 4.5, latitude: 40.7128, longitude: -74.0060 });
    setIsEditing(false);
    setShowFormModal(true);
  };

  const handleOpenEdit = (restaurant: Restaurant) => {
    setFormData({ ...restaurant });
    setIsEditing(true);
    setShowFormModal(true);
  };

  const handleOpenMap = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowMapModal(true);
  };

  const handleBookTable = (id: number) => {
    // Navigate to Reservations page but passing the ID could be handled via URL params or Context. 
    // For simplicity, we just guide them there.
    navigate('/reservations', { state: { preselectId: id } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && formData.id) {
        await api.restaurants.update(formData.id, formData as Omit<Restaurant, 'id'>);
      } else {
        await api.restaurants.create(formData as Omit<Restaurant, 'id'>);
      }
      setShowFormModal(false);
      loadRestaurants();
    } catch (e) {
      console.error(e);
      alert(`Failed to ${isEditing ? 'update' : 'create'} restaurant.`);
    }
  };

  // Helper for Haversine distance
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Restaurants</h2>
          <p className="text-slate-500 mt-1">
            {isAdmin ? "Manage your venues" : "Explore and book tables"}
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
             <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="Search name or cuisine..." 
               className="pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition w-full md:w-64"
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
             />
          </div>
          {isAdmin && (
            <button 
              onClick={handleOpenCreate}
              className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow-lg shadow-orange-900/20 font-medium whitespace-nowrap"
            >
              <Plus size={20} />
              <span className="hidden md:inline">Add Restaurant</span>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="animate-spin text-orange-500" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredRestaurants.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
              <div className="h-40 bg-slate-100 relative overflow-hidden shrink-0">
                 <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-50"></div>
                 <div className="absolute inset-0 flex items-center justify-center text-orange-200 group-hover:scale-110 transition-transform duration-500">
                    <Utensils size={64} opacity={0.6} />
                 </div>
                 <div className="absolute top-4 right-4 bg-white/95 backdrop-blur shadow-sm px-2.5 py-1 rounded-lg text-sm font-bold text-amber-500 flex items-center gap-1.5 border border-amber-100">
                    <Star size={14} fill="currentColor" />
                    {r.rating}
                 </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                   <h3 className="font-bold text-xl text-slate-800 line-clamp-1 group-hover:text-orange-600 transition-colors">{r.name}</h3>
                   <span className="text-[10px] uppercase font-bold tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100 shrink-0">{r.cuisine}</span>
                </div>
                
                <div className="flex items-start gap-2 text-slate-500 text-sm mb-6 min-h-[40px]">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
                  <span className="line-clamp-2 leading-relaxed">{r.address}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                  {isAdmin ? (
                    <>
                      <button onClick={() => handleOpenEdit(r)} className="py-2.5 text-sm font-bold text-slate-600 hover:text-orange-600 bg-slate-50 hover:bg-orange-50 rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <Edit2 size={16} /> Edit
                      </button>
                      <button onClick={() => handleDelete(r.id!, r.name)} className="py-2.5 text-sm font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <Trash2 size={16} /> Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleOpenMap(r)} className="py-2.5 text-sm font-bold text-slate-600 hover:text-orange-600 bg-slate-50 hover:bg-orange-50 rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <MapIcon size={16} /> Map
                      </button>
                      <button onClick={() => handleBookTable(r.id!)} className="py-2.5 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md shadow-orange-900/10">
                        <Calendar size={16} /> Book
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {filteredRestaurants.length === 0 && (
             <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
                <Utensils size={48} className="mb-4 opacity-20" />
                <p className="font-medium">No restaurants found matching your criteria.</p>
                {isAdmin && <button onClick={handleOpenCreate} className="mt-4 text-orange-600 hover:text-orange-700 font-medium">Add one now</button>}
             </div>
          )}
        </div>
      )}

      {/* FORM MODAL (Admin Only) */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">{isEditing ? 'Edit Restaurant' : 'Add New Restaurant'}</h3>
              <button onClick={() => setShowFormModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="restaurant-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Restaurant Name</label>
                  <input required type="text" className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-orange-500 outline-none" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. The Golden Spoon" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Address</label>
                  <input required type="text" className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-orange-500 outline-none"
                    value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="e.g. 123 Culinary Ave" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Cuisine</label>
                    <input required type="text" className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-orange-500 outline-none"
                      value={formData.cuisine} onChange={e => setFormData({...formData, cuisine: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Rating (0-5)</label>
                    <input type="number" step="0.1" min="0" max="5" className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-orange-500 outline-none"
                      value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} />
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Location Coordinates</p>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Latitude</label>
                        <input type="number" step="any" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:border-orange-500 outline-none text-sm"
                          value={formData.latitude} onChange={e => setFormData({...formData, latitude: parseFloat(e.target.value)})} />
                     </div>
                     <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Longitude</label>
                        <input type="number" step="any" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:border-orange-500 outline-none text-sm"
                          value={formData.longitude} onChange={e => setFormData({...formData, longitude: parseFloat(e.target.value)})} />
                     </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button onClick={() => setShowFormModal(false)} className="flex-1 px-4 py-2.5 text-slate-600 font-medium hover:bg-white rounded-xl">Cancel</button>
              <button type="submit" form="restaurant-form" className="flex-1 px-4 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 flex items-center justify-center gap-2">
                <Check size={18} /> {isEditing ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAP MODAL (User View) */}
      {showMapModal && selectedRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedRestaurant.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                     <MapPin size={12} />
                     {selectedRestaurant.address}
                  </p>
               </div>
               <button onClick={() => setShowMapModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            
            <div className="h-[400px] bg-slate-100 relative w-full">
               <iframe 
                 width="100%" 
                 height="100%" 
                 frameBorder="0" 
                 scrolling="no" 
                 marginHeight={0} 
                 marginWidth={0} 
                 src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedRestaurant.longitude-0.01}%2C${selectedRestaurant.latitude-0.01}%2C${selectedRestaurant.longitude+0.01}%2C${selectedRestaurant.latitude+0.01}&layer=mapnik&marker=${selectedRestaurant.latitude}%2C${selectedRestaurant.longitude}`}
                 className="w-full h-full"
               ></iframe>
            </div>

            <div className="p-6 bg-slate-50 flex items-center justify-between">
               <div>
                  <p className="text-sm font-bold text-slate-700">Estimated Distance</p>
                  <p className="text-2xl font-extrabold text-orange-600">
                     {getDistance(userLat, userLng, selectedRestaurant.latitude, selectedRestaurant.longitude)} km
                  </p>
                  <p className="text-xs text-slate-400">From your current location</p>
               </div>
               <div className="flex gap-3">
                  <button onClick={() => setShowMapModal(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition">Close</button>
                  <button onClick={() => handleBookTable(selectedRestaurant.id!)} className="px-5 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 shadow-md shadow-orange-900/10 flex items-center gap-2">
                     <Calendar size={18} /> Book Table
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};