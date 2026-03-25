import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        if (formData.password !== formData.confirmPassword) {
            return setStatus({ type: 'error', message: 'Passwords do not match' });
        }
        if (formData.password.length < 6) {
            return setStatus({ type: 'error', message: 'Password must be at least 6 characters' });
        }

        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password/${token}`, {
                password: formData.password,
                confirmPassword: formData.confirmPassword
            });
            setStatus({ type: 'success', message: response.data.message });
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.error || 'An error occurred. The token might be invalid or expired.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
            >
                {/* Header */}
                <div className="p-8 pb-6 border-b border-white/10">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-sm text-zinc-400 hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft size={16} className="mr-2" /> Back to Home
                    </button>
                    <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
                    <p className="text-sm text-zinc-400">
                        Please enter your new password below.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Status Messages */}
                    {status.message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-start gap-2 p-4 rounded-lg text-sm border ${
                                status.type === 'error'
                                    ? 'bg-red-500/10 border-red-500/20 text-red-500'
                                    : 'bg-green-500/10 border-green-500/20 text-green-500'
                            }`}
                        >
                            {status.type === 'error' ? (
                                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                            ) : (
                                <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
                            )}
                            <div>
                                <p>{status.message}</p>
                                {status.type === 'success' && (
                                    <Link to="/" className="inline-block mt-2 font-medium underline text-green-400 hover:text-green-300">
                                        Click here to login
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* New Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={loading || status.type === 'success'}
                                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-colors disabled:opacity-50"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                disabled={loading || status.type === 'success'}
                                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-colors disabled:opacity-50"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || status.type === 'success'}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-zinc-700 disabled:to-zinc-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-indigo-600/20 disabled:shadow-none"
                    >
                        {loading ? 'Resetting password...' : 'Reset Password'}
                    </button>
                    
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
