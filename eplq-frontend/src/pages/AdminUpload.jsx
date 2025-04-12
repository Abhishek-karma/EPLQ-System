import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';
import { validateCoordinates } from '../utils/validators';

const AdminUpload = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'general',
    description: '',
    lat: '',
    lng: ''
  });
  const [status, setStatus] = useState({
    loading: false,
    error: '',
    success: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    lat: '',
    lng: ''
  });

  useEffect(() => {
    if (status.success) {
      const timer = setTimeout(() => setStatus(s => ({ ...s, success: '' })), 3000);
      return () => clearTimeout(timer);
    }
  }, [status.success]);

  const validateForm = () => {
    const errors = {
      lat: validateCoordinates({ lat: formData.lat, lng: formData.lng }) ? '' : 'Invalid coordinates',
      lng: ''
    };
    setFieldErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus({ loading: true, error: '', success: '' });
    
    try {
      await api.post('/poi/upload', {
        ...formData,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng)
      });
      
      setStatus({ loading: false, error: '', success: 'POI created successfully' });
      setFormData({
        name: '',
        type: 'general',
        description: '',
        lat: '',
        lng: ''
      });
    } catch (err) {
      setStatus({
        loading: false,
        error: err.response?.data?.message || 'Creation failed',
        success: ''
      });
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content w-full max-w-3xl">
        <div className="card w-full shadow-2xl bg-base-100">
          <div className="card-body">
            <h1 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2">
              <FaMapMarkerAlt className="text-primary" />
              Create New POI
            </h1>

            {/* Status Alerts (keep existing alert code) */}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-4">
                {/* Name Row */}
                <div className="flex flex-row items-center gap-4">
                  <div className="w-32">
                    <label className="label">
                      <span className="label-text">Name</span>
                    </label>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Location name"
                      required
                    />
                  </div>
                </div>

                {/* Type Row */}
                <div className="flex flex-row items-center gap-4">
                  <div className="w-32">
                    <label className="label">
                      <span className="label-text">Type</span>
                    </label>
                  </div>
                  <div className="flex-1">
                    <select
                      className="select select-bordered w-full"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="general">General</option>
                      <option value="hospital">Hospital</option>
                      <option value="police">Police Station</option>
                      <option value="fire">Fire Station</option>
                      <option value="landmark">Landmark</option>
                    </select>
                  </div>
                </div>

                {/* Description Row */}
                <div className="flex flex-row items-start gap-4">
                  <div className="w-32">
                    <label className="label">
                      <span className="label-text">Description</span>
                    </label>
                  </div>
                  <div className="flex-1">
                    <textarea
                      className="textarea textarea-bordered w-full h-32"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Additional details..."
                      maxLength="200"
                    ></textarea>
                    <div className="text-right text-sm text-base-content/50 mt-1">
                      {formData.description.length}/200
                    </div>
                  </div>
                </div>

                {/* Coordinates Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Latitude */}
                  <div className="flex flex-row items-center gap-4">
                    <div className="w-32">
                      <label className="label">
                        <span className="label-text">Latitude</span>
                      </label>
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        step="any"
                        className={`input input-bordered w-full ${fieldErrors.lat && 'input-error'}`}
                        value={formData.lat}
                        onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                        placeholder="40.7128"
                        required
                      />
                      {fieldErrors.lat && (
                        <span className="text-xs text-error mt-1">{fieldErrors.lat}</span>
                      )}
                    </div>
                  </div>

                  {/* Longitude */}
                  <div className="flex flex-row items-center gap-4">
                    <div className="w-32">
                      <label className="label">
                        <span className="label-text">Longitude</span>
                      </label>
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        step="any"
                        className={`input input-bordered w-full ${fieldErrors.lng && 'input-error'}`}
                        value={formData.lng}
                        onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                        placeholder="-74.0060"
                        required
                      />
                      {fieldErrors.lng && (
                        <span className="text-xs text-error mt-1">{fieldErrors.lng}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-6">
                  <button 
                    type="submit" 
                    className="btn btn-primary gap-2 w-full md:w-1/2"
                    disabled={status.loading}
                  >
                    {status.loading ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <FaMapMarkerAlt />
                        Create POI
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;