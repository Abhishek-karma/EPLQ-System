import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { HiCheckCircle, HiEye, HiEyeOff, HiInformationCircle } from 'react-icons/hi';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  // Password strength calculator
  const calculateStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;
    return strength;
  };

  const passwordStrength = calculateStrength(formData.password);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100 transition-all duration-300 hover:shadow-xl">
        <div className="card-body p-6 md:p-8">
          <div className="text-center space-y-2">
            <div className="avatar placeholder">
              <div className="bg-gradient-to-r from-primary to-secondary text-primary-content rounded-full w-16 h-16">
                <span className="text-3xl">👤</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-primary">Create Your Account</h2>
            <p className="text-sm text-base-content/70">Join our secure community</p>
          </div>

          {error && (
            <div className="alert alert-error mt-4 animate-fade-in">
              <HiInformationCircle className="text-xl" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            {/* Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered input-primary focus:ring-2"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email Address</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="john@example.com"
                  className={`input input-bordered w-full pr-10 ${
                    touched.email && !isEmailValid ? 'input-error' : 'input-primary'
                  }`}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setTouched({ ...touched, email: true });
                  }}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  required
                />
                {isEmailValid && (
                  <HiCheckCircle className="absolute right-3 top-3 text-xl text-success" />
                )}
              </div>
              {touched.email && !isEmailValid && (
                <span className="text-xs text-error mt-1">Please enter a valid email</span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input input-bordered input-primary w-full pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 btn btn-ghost btn-sm p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <HiEyeOff className="text-xl text-base-content/70" />
                  ) : (
                    <HiEye className="text-xl text-base-content/70" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              <div className="mt-2">
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 w-full rounded-full transition-all ${
                        passwordStrength > i ? 'bg-primary' : 'bg-base-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs mt-1 text-base-content/70">
                  {[
                    'Very Weak',
                    'Weak',
                    'Good',
                    'Strong',
                    'Very Strong'
                  ][passwordStrength]}
                </div>
              </div>
            </div>

            {/* Account Type Selector */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Account Type</span>
              </label>
              <div className="btn-group w-full">
                <button
                  type="button"
                  className={`btn flex-1 ${
                    formData.role === 'user' ? 'btn-primary' : 'btn-outline'
                  }`}
                  onClick={() => setFormData({ ...formData, role: 'user' })}
                >
                  Standard User
                </button>
                <button
                  type="button"
                  className={`btn flex-1 ${
                    formData.role === 'admin' ? 'btn-primary' : 'btn-outline'
                  }`}
                  onClick={() => setFormData({ ...formData, role: 'admin' })}
                >
                  Administrator
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-8">
              <button
                type="submit"
                className="btn btn-primary w-full gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <HiCheckCircle className="text-xl" />
                    Get Started
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-sm text-base-content/70 mt-4">
              Already have an account?{' '}
              <a href="/login" className="link link-primary font-semibold">
                Sign In
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;