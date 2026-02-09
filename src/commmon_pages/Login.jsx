import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from './Input';
import Button from './Button';
import { loginUser } from '../apis/user_api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Backend expects 'login_id' for email or phone
      const credentials = {
        login_id: formData.loginId,
        password: formData.password
      };

      const data = await loginUser(credentials);

      // Store user info in localStorage (token is now in HttpOnly cookie)
      localStorage.setItem('userInfo', JSON.stringify(data));

      // Redirect based on role or to home
      if (data.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (data.role === 'agent') {
        navigate('/agent/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111010] p-4 font-sans">
      <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl shadow-xl border border-[#333] p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#BD9B5F] mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to access your account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-900 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email or Phone Number"
            type="text"
            name="loginId"
            value={formData.loginId}
            onChange={handleChange}
            placeholder="Enter email or phone"
            required
            autoComplete="username"
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-[#BD9B5F] hover:text-[#a68650] transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={loading}
            variant="primary"
            className="mt-2"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#BD9B5F] hover:text-[#a68650] font-medium transition-colors">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;