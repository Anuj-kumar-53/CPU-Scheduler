import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
            const payload = isSignUp
                ? formData
                : { email: formData.email, password: formData.password };

            const response = await axios.post(`http://localhost:5000${endpoint}`, payload);

            login(response.data.user, response.data.token);
            onClose();
            setFormData({ name: '', email: '', password: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/google', {
                credential: credentialResponse.credential
            });

            login(response.data.user, response.data.token);
            onClose();
            setFormData({ name: '', email: '', password: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Google authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError('');
        setFormData({ name: '', email: '', password: '' });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-zinc-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
                    >
                        <X size={20} className="text-zinc-400" />
                    </button>

                    {/* Header */}
                    <div className="p-8 pb-6">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-sm text-zinc-400">
                            {isSignUp
                                ? 'Sign up to access CPU Scheduler & DSA Visualizer'
                                : 'Sign in to continue your learning journey'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
                            >
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        {/* Name Field (Sign Up Only) */}
                        {isSignUp && (
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required={isSignUp}
                                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-colors"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                            {isSignUp && (
                                <p className="mt-1 text-xs text-zinc-500">Must be at least 6 characters</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-zinc-700 disabled:to-zinc-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-indigo-600/20 disabled:shadow-none"
                        >
                            {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                        </button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-zinc-900 text-zinc-500">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Login */}
                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google login failed')}
                                theme="filled_black"
                                size="large"
                                width="100%"
                            />
                        </div>

                        {/* Toggle Sign In/Sign Up */}
                        <p className="text-center text-sm text-zinc-400 mt-6">
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button
                                type="button"
                                onClick={toggleMode}
                                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                            >
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
