import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BarChart2,
    List,
    Link2,
    Layers,
    GitBranch,
    Network,
    TrendingDown,
    Zap,
    ArrowRight,
    Sparkles
} from 'lucide-react';

const DSAWelcome = () => {
    const navigate = useNavigate();

    const modules = [
        {
            id: 'sorting',
            name: 'Sorting',
            icon: BarChart2,
            color: 'indigo',
            desc: 'Bubble, Quick, Merge Sort',
            gradient: 'from-indigo-500 to-purple-500',
            textClass: 'text-indigo-400',
            bgClass: 'bg-indigo-500/10'
        },
        {
            id: 'arrays',
            name: 'Arrays',
            icon: List,
            color: 'blue',
            desc: 'Insert, Delete, Search',
            gradient: 'from-blue-500 to-cyan-500',
            textClass: 'text-blue-400',
            bgClass: 'bg-blue-500/10'
        },
        {
            id: 'linked-list',
            name: 'Linked Lists',
            icon: Link2,
            color: 'emerald',
            desc: 'Singly Linked Operations',
            gradient: 'from-emerald-500 to-teal-500',
            textClass: 'text-emerald-400',
            bgClass: 'bg-emerald-500/10'
        },
        {
            id: 'stack-queue',
            name: 'Stack & Queue',
            icon: Layers,
            color: 'amber',
            desc: 'LIFO & FIFO Operations',
            gradient: 'from-amber-500 to-orange-500',
            textClass: 'text-amber-400',
            bgClass: 'bg-amber-500/10'
        },
        {
            id: 'trees',
            name: 'Trees',
            icon: GitBranch,
            color: 'green',
            desc: 'BST & Traversals',
            gradient: 'from-green-500 to-emerald-500',
            textClass: 'text-green-400',
            bgClass: 'bg-green-500/10'
        },
        {
            id: 'graphs',
            name: 'Graphs',
            icon: Network,
            color: 'purple',
            desc: 'BFS, DFS Algorithms',
            gradient: 'from-purple-500 to-pink-500',
            textClass: 'text-purple-400',
            bgClass: 'bg-purple-500/10'
        },
        {
            id: 'heaps',
            name: 'Heaps',
            icon: TrendingDown,
            color: 'rose',
            desc: 'Min/Max Heap',
            gradient: 'from-rose-500 to-red-500',
            textClass: 'text-rose-400',
            bgClass: 'bg-rose-500/10'
        },
        {
            id: 'dp',
            name: 'Dynamic Prog.',
            icon: Zap,
            color: 'yellow',
            desc: 'Fibonacci, LCS, Coins',
            gradient: 'from-yellow-500 to-amber-500',
            textClass: 'text-yellow-400',
            bgClass: 'bg-yellow-500/10'
        }
    ];

    const popularModules = ['sorting', 'linked-list', 'trees'];

    return (
        <div className="flex-1 flex flex-col bg-zinc-950 overflow-y-auto no-scrollbar min-h-0">
            {/* Hero Section */}
            <div className="relative px-6 md:px-12 py-10 md:py-16 border-b border-white/5 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900">
                {/* Animated Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 max-w-4xl mx-auto text-center"
                >
                    <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles size={24} className="text-indigo-400 md:w-8 md:h-8" />
                        </motion.div>
                        <h1 className="text-2xl md:text-5xl font-bold text-white">
                            Welcome to <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">DSA Visualizer</span>
                        </h1>
                    </div>

                    <p className="text-sm md:text-xl text-zinc-400 mb-6 md:mb-8 max-w-2xl mx-auto">
                        Master Data Structures & Algorithms through interactive visualizations.
                        Watch algorithms come to life with step-by-step animations.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-[10px] md:text-sm text-zinc-500">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span>9 Modules</span>
                        </div>
                        <div className="hidden md:block w-px h-3 bg-zinc-700"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                            <span>Interactive Controls</span>
                        </div>
                        <div className="hidden md:block w-px h-3 bg-zinc-700"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-purple-500 animate-pulse"></div>
                            <span>Real-time Visualization</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Quick Start */}
            <div className="px-6 md:px-12 py-8 border-b border-white/5 bg-zinc-900/30">
                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">Quick Start</h2>
                <div className="flex flex-col md:flex-row gap-4">
                    {popularModules.map((moduleId, idx) => {
                        const module = modules.find(m => m.id === moduleId);
                        const Icon = module.icon;

                        return (
                            <motion.button
                                key={moduleId}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => navigate(`/dsa/${moduleId}`)}
                                className="flex-1 group relative overflow-hidden bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 hover:border-white/10 rounded-xl p-4 md:p-6 transition-all"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                                <div className="relative z-10">
                                    <Icon size={32} className={`${module.textClass} mb-3`} />
                                    <h3 className="text-base md:text-lg font-bold text-white mb-1 tracking-tight">{module.name}</h3>
                                    <p className="text-[10px] md:text-xs text-zinc-500">{module.desc}</p>
                                    <div className="flex items-center gap-2 mt-4 text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span>Let's dive in</span>
                                        <ArrowRight size={14} />
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* All Modules */}
            <div className="px-6 md:px-12 py-8 flex-1">
                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-6">All Modules</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {modules.map((module, idx) => {
                        const Icon = module.icon;

                        return (
                            <motion.button
                                key={module.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => navigate(`/dsa/${module.id}`)}
                                className="group relative overflow-hidden bg-zinc-900/50 hover:bg-zinc-800/50 border border-white/5 hover:border-white/10 rounded-xl p-4 md:p-6 transition-all text-left"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                                <div className="relative z-10">
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${module.bgClass} flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                                        <Icon size={20} className={module.textClass} />
                                    </div>
                                    <h3 className="text-sm md:text-base font-bold text-white mb-1">{module.name}</h3>
                                    <p className="text-[10px] md:text-xs text-zinc-500 mb-3">{module.desc}</p>
                                    <div className="flex items-center gap-1 text-[10px] text-zinc-600 group-hover:text-indigo-400 transition-colors">
                                        <span>Explore</span>
                                        <ArrowRight size={12} />
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Footer Tip */}
            <div className="px-6 md:px-12 py-4 md:py-6 border-t border-white/5 bg-zinc-900/30">
                <div className="flex items-center justify-center gap-2 md:gap-3 text-xs md:text-sm text-zinc-500 text-center">
                    <Sparkles size={14} className="text-indigo-400 shrink-0" />
                    <span>
                        <span className="text-zinc-400 font-semibold">Pro Tip:</span> Use the sidebar to quickly navigate between modules
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DSAWelcome;
