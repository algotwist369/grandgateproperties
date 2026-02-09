import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from './Input';
import Button from './Button';
import { signupUser } from '../apis/user_api';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'user',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            // Prepare FormData for the backend (which expects multipart/form-data)
            const submissionData = new FormData();
            submissionData.append('user_name', formData.name);
            submissionData.append('user_email', formData.email);
            submissionData.append('user_phone', formData.phone);
            submissionData.append('password', formData.password);
            submissionData.append('role', formData.role);

            // Add a default blank profile picture if none provided (backend requires it in schema)
            // submissionData.append('profile_picture', ''); 

            const data = await signupUser(submissionData);

            // Store user info in localStorage (token is now in HttpOnly cookie)
            localStorage.setItem('userInfo', JSON.stringify(data));

            // Navigate based on role or to home
            if (data.role === 'agent') {
                navigate('/agent/profile'); // Agents might need to complete profile
            } else {
                navigate('/');
            }
        } catch (err) {
            setErrors({ server: err || 'Registration failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#111010] p-4 font-sans">
            <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl shadow-xl border border-[#333] p-8 animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#BD9B5F] mb-2">Create Account</h1>
                    <p className="text-gray-400">Join Grand Gate Properties today</p>
                </div>

                {errors.server && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-900 rounded-lg text-red-200 text-sm">
                        {errors.server}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        error={errors.name}
                        required
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        error={errors.email}
                        required
                    />

                    <Input
                        label="Phone Number"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        error={errors.phone}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        error={errors.password}
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        error={errors.confirmPassword}
                    />

                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-300">Register as:</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, role: 'user' }))}
                                className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-all duration-200 ${formData.role === 'user'
                                    ? 'bg-[#BD9B5F] border-[#BD9B5F] text-white'
                                    : 'bg-[#1a1a1a] border-[#333] text-gray-400 hover:border-[#BD9B5F]'
                                    }`}
                            >
                                Regular User
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, role: 'agent' }))}
                                className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-all duration-200 ${formData.role === 'agent'
                                    ? 'bg-[#BD9B5F] border-[#BD9B5F] text-white'
                                    : 'bg-[#1a1a1a] border-[#333] text-gray-400 hover:border-[#BD9B5F]'
                                    }`}
                            >
                                Real Estate Agent
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        isLoading={loading}
                        variant="primary"
                        className="mt-4"
                    >
                        Sign Up
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#BD9B5F] hover:text-[#a68650] font-medium transition-colors">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
