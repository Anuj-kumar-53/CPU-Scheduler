import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Network, ArrowRight, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const LandingPage = ({ onSelect }) => {
    const { isAuthenticated, user, logout } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleCardClick = (type) => {
        if (!isAuthenticated) {
            setShowAuthModal(true);
        } else {
            onSelect(type);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-zinc-950 text-white relative overflow-hidden items-center justify-center p-4 md:p-8 py-20 md:py-0">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-500/10 rounded-full blur-[80px] animate-pulse"></div>
                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-cyan-500/10 rounded-full blur-[80px] animate-pulse delay-1000"></div>
            </div>

            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20"></div>

            {/* Auth Buttons - Top Right */}
            <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20 flex flex-wrap items-center justify-end gap-2 md:gap-4 max-w-[calc(100%-2rem)]">
                {isAuthenticated ? (
                    <>
                        <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-zinc-900/50 border border-white/10 rounded-lg shrink-0">
                            <User size={14} className="text-zinc-400" />
                            <span className="text-xs md:text-sm text-zinc-300 truncate max-w-[100px]">{user?.name}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 rounded-lg transition-all text-red-400 hover:text-red-300"
                        >
                            <LogOut size={14} />
                            <span className="text-xs md:text-sm font-medium">Logout</span>
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="px-4 py-1.5 md:px-6 md:py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-lg text-xs md:text-sm font-bold transition-all shadow-lg shadow-indigo-600/20"
                        >
                            Sign Up
                        </button>
                    </>
                )}
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 text-center mb-10 md:mb-16 mt-16 md:mt-0"
            >
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    AlgoVisualizer
                </h1>
                <p className="text-zinc-500 text-base md:text-lg max-w-2xl mx-auto px-4">
                    Interactive visualizations for complex algorithms. {!isAuthenticated && 'Sign in to'} explore execution flows and performance metrics.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 z-10 max-w-4xl w-full">
                {/* CPU Scheduler Card */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => handleCardClick('cpu')}
                    className={`group relative bg-zinc-900/50 hover:bg-zinc-900/80 border border-white/5 hover:border-indigo-500/30 rounded-3xl p-8 text-left transition-all duration-300 shadow-xl hover:shadow-indigo-500/10 flex flex-col gap-6 ${!isAuthenticated ? 'cursor-pointer' : ''}`}
                >
                    {!isAuthenticated && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-xs font-bold text-yellow-400">
                            Login Required
                        </div>
                    )}
                    <div className="p-4 bg-indigo-500/10 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                        <Cpu size={32} className="text-indigo-400 group-hover:text-indigo-300" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">CPU Scheduler</h2>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            Simulate process scheduling algorithms including FCFS, SJF, Priority, and Round Robin. Visual Gantt charts and performance metrics.
                        </p>
                    </div>
                    <div className="mt-auto flex items-center gap-2 text-sm font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                        {isAuthenticated ? 'LAUNCH SIMULATOR' : 'SIGN IN TO ACCESS'} <ArrowRight size={16} />
                    </div>
                </motion.button>

                {/* DSA Visualizer Card */}
                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => handleCardClick('dsa')}
                    className={`group relative bg-zinc-900/50 hover:bg-zinc-900/80 border border-white/5 hover:border-cyan-500/30 rounded-3xl p-8 text-left transition-all duration-300 shadow-xl hover:shadow-cyan-500/10 flex flex-col gap-6 ${!isAuthenticated ? 'cursor-pointer' : ''}`}
                >
                    {!isAuthenticated && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-xs font-bold text-yellow-400">
                            Login Required
                        </div>
                    )}
                    <div className="p-4 bg-cyan-500/10 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                        <Network size={32} className="text-cyan-400 group-hover:text-cyan-300" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">DSA Visualizer</h2>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            Explore data structures and algorithms with step-by-step animations. Trees, Graphs, Sorting, and more.
                        </p>
                    </div>
                    <div className="mt-auto flex items-center gap-2 text-sm font-bold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                        {isAuthenticated ? 'OPEN VISUALIZER' : 'SIGN IN TO ACCESS'} <ArrowRight size={16} />
                    </div>
                </motion.button>
            </div>

            {/* Auth Modal */}
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
    );
};

export default LandingPage;
