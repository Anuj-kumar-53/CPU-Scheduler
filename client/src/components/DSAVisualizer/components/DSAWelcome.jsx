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
            gradient: 'from-indigo-500 to-purple-500'
        },
        {
            id: 'arrays',
            name: 'Arrays',
            icon: List,
            color: 'blue',
            desc: 'Insert, Delete, Search',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'linked-list',
            name: 'Linked Lists',
            icon: Link2,
            color: 'emerald',
            desc: 'Singly Linked Operations',
            gradient: 'from-emerald-500 to-teal-500'
        },
        {
            id: 'stack-queue',
            name: 'Stack & Queue',
            icon: Layers,
            color: 'amber',
            desc: 'LIFO & FIFO Operations',
            gradient: 'from-amber-500 to-orange-500'
        },
        {
            id: 'trees',
            name: 'Trees',
            icon: GitBranch,
            color: 'green',
            desc: 'BST & Traversals',
            gradient: 'from-green-500 to-emerald-500'
        },
        {
            id: 'graphs',
            name: 'Graphs',
            icon: Network,
            color: 'purple',
            desc: 'BFS, DFS Algorithms',
            gradient: 'from-purple-500 to-pink-500'
        },
        {
            id: 'heaps',
            name: 'Heaps',
            icon: TrendingDown,
            color: 'rose',
            desc: 'Min/Max Heap',
            gradient: 'from-rose-500 to-red-500'
        },
        {
            id: 'dp',
            name: 'Dynamic Prog.',
            icon: Zap,
            color: 'yellow',
            desc: 'Fibonacci, LCS, Coins',
            gradient: 'from-yellow-500 to-amber-500'
        }
    ];

    const popularModules = ['sorting', 'linked-list', 'trees'];

    return (
        <div className="flex flex-col h-full bg-zinc-950 overflow-auto">
            {/* Hero Section */}
            <div className="relative px-12 py-16 border-b border-white/5 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900">
                {/* Animated Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 max-w-4xl mx-auto text-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles size={32} className="text-indigo-400" />
                        </motion.div>
                        <h1 className="text-5xl font-bold text-white">
                            Welcome to <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">DSA Visualizer</span>
                        </h1>
                    </div>

                    <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
                        Master Data Structures & Algorithms through interactive visualizations.
                        Watch algorithms come to life with step-by-step animations.
                    </p>

                    <div className="flex items-center justify-center gap-4 text-sm text-zinc-500">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span>9 Modules</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-zinc-700"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                            <span>Interactive Controls</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-zinc-700"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                            <span>Real-time Visualization</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Quick Start */}
            <div className="px-12 py-8 border-b border-white/5 bg-zinc-900/30">
                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">Quick Start</h2>
                <div className="flex gap-4">
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
                                className="flex-1 group relative overflow-hidden bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 hover:border-white/10 rounded-xl p-6 transition-all"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                                <div className="relative z-10">
                                    <Icon size={32} className={`text-${module.color}-400 mb-3`} />
                                    <h3 className="text-lg font-bold text-white mb-1">{module.name}</h3>
                                    <p className="text-xs text-zinc-500">{module.desc}</p>
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
            <div className="px-12 py-8 flex-1">
                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-6">All Modules</h2>
                <div className="grid grid-cols-4 gap-4">
                    {modules.map((module, idx) => {
                        const Icon = module.icon;

                        return (
                            <motion.button
                                key={module.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => navigate(`/dsa/${module.id}`)}
                                className="group relative overflow-hidden bg-zinc-900/50 hover:bg-zinc-800/50 border border-white/5 hover:border-white/10 rounded-xl p-6 transition-all text-left"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                                <div className="relative z-10">
                                    <div className={`w-12 h-12 rounded-lg bg-${module.color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <Icon size={24} className={`text-${module.color}-400`} />
                                    </div>
                                    <h3 className="text-base font-bold text-white mb-1">{module.name}</h3>
                                    <p className="text-xs text-zinc-500 mb-3">{module.desc}</p>
                                    <div className="flex items-center gap-1 text-xs text-zinc-600 group-hover:text-indigo-400 transition-colors">
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
            <div className="px-12 py-6 border-t border-white/5 bg-zinc-900/30">
                <div className="flex items-center justify-center gap-3 text-sm text-zinc-500">
                    <Sparkles size={16} className="text-indigo-400" />
                    <span>
                        <span className="text-zinc-400 font-semibold">Pro Tip:</span> Use the sidebar to quickly navigate between modules
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DSAWelcome;
