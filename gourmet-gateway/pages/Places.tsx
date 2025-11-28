import React, { useState } from 'react';
import { api } from '../services/api';
import { PlaceResult } from '../types';
import { Search, MapPin, Navigation, Loader2 } from 'lucide-react';

export const Places: React.FC = () => {
  const [query, setQuery] = useState('restaurant');
  const [radius, setRadius] = useState(5000);
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Default to New York coordinates if geolocation fails
  const [lat, setLat] = useState(40.7128);
  const [lng, setLng] = useState(-74.0060);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.places.search(query, lat, lng, radius);
      setResults(data || []);
    } catch (e) {
      console.error(e);
      alert("Search failed. Ensure Places Service is running.");
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
        },
        (error) => {
          alert("Could not get location: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Places Search</h2>
        <p className="text-slate-500 mt-1">Discover culinary hotspots near you</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
          <div className="md:col-span-4">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Search Query</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <input 
                type="text" 
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                placeholder="e.g. coffee, pizza, sushi"
              />
            </div>
          </div>
          
          <div className="md:col-span-3">
             <label className="block text-sm font-bold text-slate-700 mb-1.5">Coordinates (Lat/Lng)</label>
             <div className="flex gap-2">
               <input 
                 type="number" step="any"
                 value={lat} onChange={e => setLat(parseFloat(e.target.value))}
                 className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:border-orange-500"
               />
               <input 
                 type="number" step="any"
                 value={lng} onChange={e => setLng(parseFloat(e.target.value))}
                 className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:border-orange-500"
               />
             </div>
          </div>

          <div className="md:col-span-1">
             <button type="button" onClick={getUserLocation} title="Use My Location" className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center transition border border-slate-200">
                <Navigation size={20} />
             </button>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Radius (m)</label>
            <input 
              type="number" 
              value={radius}
              onChange={e => setRadius(parseInt(e.target.value))}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-900/10">
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <div className="flex-1">
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((place, idx) => (
              <div key={place.id || idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-slate-800 text-lg leading-tight">{place.name}</h3>
                  <div className="bg-orange-50 text-orange-600 p-2 rounded-lg">
                    <MapPin size={18} />
                  </div>
                </div>
                {place.address && <p className="text-sm text-slate-500 mb-4">{place.address}</p>}
                
                <div className="flex items-center justify-between text-xs font-medium text-slate-400 pt-4 border-t border-slate-100">
                  <div className="flex gap-2">
                     <span className="bg-slate-100 px-2 py-1 rounded">Lat: {place.location?.latitude.toFixed(3)}</span>
                     <span className="bg-slate-100 px-2 py-1 rounded">Lng: {place.location?.longitude.toFixed(3)}</span>
                  </div>
                  {place.distance && <span className="text-orange-500">{place.distance}m away</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
              <MapPin size={48} className="mb-4 text-slate-300" />
              <p className="font-medium">No places found. Try adjusting your search or location.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};