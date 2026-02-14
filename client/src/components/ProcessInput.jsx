import React, { useState } from 'react';
import { Plus, RotateCcw, Clock, Zap, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProcessInput = ({ processes, setProcesses, nextId, setNextId, algorithm, disabled }) => {
    const [arrivalTime, setArrivalTime] = useState(0);
    const [burstTime, setBurstTime] = useState(1);
    const [priority, setPriority] = useState(1);
    const [focusedField, setFocusedField] = useState(null);

    const showPriority = ['PRIORITY', 'PRIORITY_P'].includes(algorithm);

    const addProcess = (e) => {
        e.preventDefault();
        const newProcess = {
            id: nextId,
            arrivalTime: Number(arrivalTime),
            burstTime: Number(burstTime),
            priority: showPriority ? Number(priority) : 0,
        };
        setProcesses([...processes, newProcess]);
        setNextId(nextId + 1);
        setArrivalTime(Math.max(arrivalTime, newProcess.arrivalTime + 1));
    };

    const resetProcesses = () => {
        setProcesses([]);
        setNextId(1);
        setArrivalTime(0);
    };

    return (
        <div className={`relative group ${disabled ? 'opacity-50 pointer-events-none grayscale transition-all duration-500' : ''}`}>
            {/* Glassmorphism Card */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-white/20">
                <form onSubmit={addProcess} className="flex flex-col gap-5">

                    <div className="grid grid-cols-2 gap-4">
                        {/* Arrival Time Input */}
                        <div className="relative group/input">
                            <motion.label
                                animate={{ color: focusedField === 'arrival' ? '#60a5fa' : '#71717a' }}
                                className="block text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                            >
                                <Clock size={12} /> Arrival Time
                            </motion.label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    value={arrivalTime}
                                    onChange={(e) => setArrivalTime(e.target.value)}
                                    onFocus={() => setFocusedField('arrival')}
                                    onBlur={() => setFocusedField(null)}
                                    className="w-full bg-zinc-950/50 border border-zinc-700/50 rounded-xl p-3 text-zinc-100 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    required
                                />
                                {focusedField === 'arrival' && (
                                    <motion.div
                                        layoutId="highlight"
                                        className="absolute inset-0 border-2 border-blue-500 rounded-xl pointer-events-none"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Burst Time Input */}
                        <div className="relative group/input">
                            <motion.label
                                animate={{ color: focusedField === 'burst' ? '#a78bfa' : '#71717a' }}
                                className="block text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                            >
                                <Zap size={12} /> Burst Time
                            </motion.label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="1"
                                    value={burstTime}
                                    onChange={(e) => setBurstTime(e.target.value)}
                                    onFocus={() => setFocusedField('burst')}
                                    onBlur={() => setFocusedField(null)}
                                    className="w-full bg-zinc-950/50 border border-zinc-700/50 rounded-xl p-3 text-zinc-100 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                    required
                                />
                                {focusedField === 'burst' && (
                                    <motion.div
                                        layoutId="highlight"
                                        className="absolute inset-0 border-2 border-purple-500 rounded-xl pointer-events-none"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Priority Input (Conditional) */}
                    <AnimatePresence>
                        {showPriority && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <div className="relative">
                                    <motion.label
                                        animate={{ color: focusedField === 'priority' ? '#f472b6' : '#71717a' }}
                                        className="block text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                                    >
                                        <Layers size={12} /> Priority (Lower = Higher)
                                    </motion.label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        onFocus={() => setFocusedField('priority')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full bg-zinc-950/50 border border-zinc-700/50 rounded-xl p-3 text-zinc-100 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(59, 130, 246, 0.2)" }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-3 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 group/btn"
                        >
                            <div className="bg-white/20 p-1 rounded-full group-hover/btn:rotate-90 transition-transform">
                                <Plus size={14} strokeWidth={3} />
                            </div>
                            <span>Add Process</span>
                        </motion.button>

                        {processes.length > 0 && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={resetProcesses}
                                className="px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold border border-white/5 transition-colors flex items-center justify-center"
                            >
                                <RotateCcw size={16} />
                            </motion.button>
                        )}
                    </div>
                </form>

                {/* Footer Info */}
                <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
                    <span>Queue Size: <span className="text-zinc-300">{processes.length}</span></span>
                    <span className="bg-zinc-800/80 px-2 py-1 rounded border border-white/5 text-zinc-400">Next ID: {nextId}</span>
                </div>
            </div>
        </div>
    );
};

export default ProcessInput;
