import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Network, ArrowRight } from 'lucide-react';

const LandingPage = ({ onSelect }) => {
    return (
        <div className="flex flex-col h-screen bg-zinc-950 text-white relative overflow-hidden items-center justify-center p-8">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[80px] animate-pulse"></div>
                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[80px] animate-pulse delay-1000"></div>
            </div>

            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20"></div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 text-center mb-16"
            >
                <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    AlgoVisualizer
                </h1>
                <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
                    Interactive visualizations for complex algorithms. Select a module to begin exploring execution flows and performance metrics.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 z-10 max-w-4xl w-full">
                {/* CPU Scheduler Card */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => onSelect('cpu')}
                    className="group relative bg-zinc-900/50 hover:bg-zinc-900/80 border border-white/5 hover:border-indigo-500/30 rounded-3xl p-8 text-left transition-all duration-300 shadow-xl hover:shadow-indigo-500/10 flex flex-col gap-6"
                >
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
                        LAUNCH SIMULATOR <ArrowRight size={16} />
                    </div>
                </motion.button>

                {/* DSA Visualizer Card */}
                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => onSelect('dsa')}
                    className="group relative bg-zinc-900/50 hover:bg-zinc-900/80 border border-white/5 hover:border-cyan-500/30 rounded-3xl p-8 text-left transition-all duration-300 shadow-xl hover:shadow-cyan-500/10 flex flex-col gap-6"
                >
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
                        OPEN VISUALIZER <ArrowRight size={16} />
                    </div>
                </motion.button>
            </div>
        </div>
    );
};

export default LandingPage;
