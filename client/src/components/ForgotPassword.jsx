import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`, { email });
            setStatus({ type: 'success', message: response.data.message });
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.error || 'An error occurred. Please try again later.' });
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
                    <h2 className="text-2xl font-bold text-white mb-2">Forgot Password</h2>
                    <p className="text-sm text-zinc-400">
                        Enter your email address and we'll send you a link to reset your password.
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
                            <span>{status.message}</span>
                        </motion.div>
                    )}

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-colors disabled:opacity-50"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || status.type === 'success'}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-zinc-700 disabled:to-zinc-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-indigo-600/20 disabled:shadow-none"
                    >
                        {loading ? 'Sending link...' : 'Send Reset Link'}
                    </button>
                    
                    {/* Back to Login Link */}
                    <div className="text-center">
                        <Link to="/" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                            Return to sign in
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
