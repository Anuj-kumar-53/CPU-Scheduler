import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, Layers, Trash2 } from 'lucide-react';

const Tooltip = ({ text }) => (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-950/90 border border-white/10 rounded text-[10px] text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        {text}
    </div>
);

const ProcessList = ({ processes, minimal, status, onDelete }) => {

    // Minimal View (Queue Preview in Sidebar)
    if (minimal) {
        return (
            <div className="mt-6">
                {processes.length === 0 ? (
                    <div className="text-xs text-zinc-600 italic px-1 text-center py-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
                        Queue is empty
                    </div>
                ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar p-1">
                        <AnimatePresence mode="popLayout">
                            {processes.map((p, i) => (
                                <motion.div
                                    key={p.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        y: 0,
                                        transition: { delay: i * 0.05, type: "spring", stiffness: 300, damping: 25 }
                                    }}
                                    exit={{ opacity: 0, scale: 0.9, x: -20, transition: { duration: 0.2 } }}
                                    className="group relative bg-zinc-900/60 hover:bg-zinc-800/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-all shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 overflow-hidden"
                                >
                                    {/* Subtle Gradient Glow */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:via-violet-500/5 group-hover:to-cyan-500/5 transition-all duration-500"></div>

                                    <div className="relative flex items-center justify-between z-10">
                                        <div className="flex items-center gap-3.5">
                                            {/* Process Avatar */}
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                                P{p.id}
                                            </div>

                                            {/* Details Layout */}
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Metrics</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {/* Arrival Badge */}
                                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-950/50 border border-white/5 text-[10px] text-zinc-400 font-mono" title="Arrival Time">
                                                        <Clock size={10} className="text-cyan-400" />
                                                        {p.arrivalTime}
                                                    </div>

                                                    {/* Burst Badge */}
                                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-950/50 border border-white/5 text-[10px] text-zinc-400 font-mono" title="Burst Time">
                                                        <Zap size={10} className="text-amber-400" />
                                                        {p.burstTime}
                                                    </div>

                                                    {/* Priority Badge (Optional) */}
                                                    {p.priority > 0 && (
                                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-950/50 border border-white/5 text-[10px] text-zinc-400 font-mono" title="Priority">
                                                            <Layers size={10} className="text-pink-400" />
                                                            {p.priority}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(p.id)}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all transform hover:rotate-12"
                                                title="Remove Process"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        );
    }

    // Detailed View (Results Table)
    if (status !== 'finished') return null;

    return (
        <div className="bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-6 gap-4 p-4 textxs font-bold text-zinc-500 uppercase tracking-wider bg-white/5 border-b border-white/5">
                <div className="pl-4">Process</div>
                <div>Arrival</div>
                <div>Burst</div>
                <div>Completion</div>
                <div>Turnaround</div>
                <div>Waiting</div>
            </div>

            <div className="divide-y divide-white/5">
                {processes.map((p, index) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="grid grid-cols-6 gap-4 p-4 text-sm hover:bg-white/5 transition-colors group"
                    >
                        <div className="pl-4 font-bold text-indigo-400 flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs">P{p.id}</span>
                        </div>
                        <div className="text-zinc-400 font-mono flex items-center">{p.arrivalTime}</div>
                        <div className="text-zinc-400 font-mono flex items-center">{p.burstTime}</div>
                        <div className="text-zinc-200 font-mono flex items-center font-bold">{p.completionTime}</div>
                        <div className="text-cyan-400 font-mono flex items-center font-bold bg-cyan-500/5 w-fit px-2 rounded relative cursor-help group/item">
                            {p.turnaroundTime}
                            <Tooltip text="Completion - Arrival" />
                        </div>
                        <div className="text-violet-400 font-mono flex items-center font-bold bg-violet-500/5 w-fit px-2 rounded relative cursor-help group/item">
                            {p.waitingTime}
                            <Tooltip text="Turnaround - Burst" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ProcessList;
