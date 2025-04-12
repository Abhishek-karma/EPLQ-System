import { useState } from 'react';
import { api } from '../utils/api';
import { HiSearch, HiMap, HiFilter } from 'react-icons/hi';

export const Search = () => {
  const [searchParams, setSearchParams] = useState({
    name: '',
    type: '',
    lat: '',
    lng: '',
    radius: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const poiTypes = ['hospital', 'police', 'fire', 'landmark', 'general'];

  const validateGeoParams = () => {
    if (searchParams.radius && (!searchParams.lat || !searchParams.lng)) {
      setError('Latitude and Longitude are required for radius search');
      return false;
    }
    return true;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateGeoParams()) return;

    setLoading(true);
    try {
      const { data } = await api.post('/poi/search', {
        name: searchParams.name,
        type: searchParams.type,
        lat: parseFloat(searchParams.lat),
        lng: parseFloat(searchParams.lng),
        radius: parseFloat(searchParams.radius)
      });
      
      setResults(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="hero-content max-w-4xl mx-auto">
        <div className="card w-full shadow-2xl bg-base-100">
          <div className="card-body">
            <div className="text-center mb-8">
              <HiSearch className="text-4xl text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold">Advanced POI Search</h1>
              <p className="text-base-content/70 mt-2">Search using multiple criteria</p>
            </div>

            {error && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSearch} className="space-y-4">
              {/* Name Search */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name Search</span>
                </label>
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="input input-bordered"
                  value={searchParams.name}
                  onChange={(e) => setSearchParams({...searchParams, name: e.target.value})}
                />
              </div>

              {/* Type Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Filter by Type</span>
                </label>
                <select
                  className="select select-bordered"
                  value={searchParams.type}
                  onChange={(e) => setSearchParams({...searchParams, type: e.target.value})}
                >
                  <option value="">All Types</option>
                  {poiTypes.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Location Search */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <div className="flex items-center gap-2 mb-4">
                    <HiMap className="text-xl" />
                    <h3 className="card-title text-lg">Location Search</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Latitude</span>
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="40.7128"
                        className="input input-bordered"
                        value={searchParams.lat}
                        onChange={(e) => setSearchParams({...searchParams, lat: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Longitude</span>
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="-74.0060"
                        className="input input-bordered"
                        value={searchParams.lng}
                        onChange={(e) => setSearchParams({...searchParams, lng: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Radius (km)</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Search radius"
                        className="input input-bordered"
                        value={searchParams.radius}
                        onChange={(e) => setSearchParams({...searchParams, radius: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-control mt-6">
                <button 
                  type="submit" 
                  className="btn btn-primary w-full"
                  disabled={loading || (!searchParams.name && !searchParams.type && !searchParams.radius)}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="loading loading-spinner"></span>
                      Searching...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <HiFilter className="text-xl" />
                      Apply Filters
                    </span>
                  )}
                </button>
              </div>
            </form>

            {/* Search Results */}
            <div className="mt-8 space-y-4">
              {results.length > 0 ? (
                results.map(poi => (
                  <div key={poi._id} className="card bg-base-200">
                    <div className="card-body">
                      <h3 className="card-title">{poi.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <div className="badge badge-info">{poi.type}</div>
                        {poi.distance && (
                          <div className="badge badge-outline">
                            {poi.distance.toFixed(2)} km away
                          </div>
                        )}
                      </div>
                      {poi.description && (
                        <p className="text-base-content/70">{poi.description}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-base-content/70 py-4">
                  {loading ? 'Searching...' : 'No results found'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;