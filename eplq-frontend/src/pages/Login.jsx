import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      navigate(user.role === 'admin' ? '/admin-home' : '/search');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body">
          <div className="text-center space-y-4 mb-6">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-16">
                <span className="text-3xl">🔒</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-base-content/70">Login to your account</p>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Row */}
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <label className="label md:w-1/3">
                <span className="label-text font-medium">Email Address</span>
              </label>
              <div className="flex-1 w-full">
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered w-full"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password Row */}
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <label className="label md:w-1/3">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="flex-1 w-full">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Submit Button Row */}
            <div className="flex justify-end mt-8">
              <button 
                type="submit" 
                className="btn btn-primary w-full md:w-auto"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="loading loading-spinner"></span>
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;