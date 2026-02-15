import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';

const AnimatedCounter = ({ value }) => {
    return (
        <span className="tabular-nums">
            {value}
        </span>
    );
}

const StatsCard = ({ title, value, color, formula, description, isPlaceholder }) => {
    const [isOpen, setIsOpen] = useState(false);

    const colorMap = {
        purple: { border: 'hover:border-purple-500/30', text: 'text-purple-400' },
        emerald: { border: 'hover:border-emerald-500/30', text: 'text-emerald-400' },
        blue: { border: 'hover:border-blue-500/30', text: 'text-blue-400' },
    };

    const activeColors = colorMap[color] || colorMap.blue;

    return (
        <div className="relative group h-full">
            <motion.div
                layout
                onMouseEnter={() => !isPlaceholder && setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                className={`
                    h-full border p-6 rounded-xl transition-all duration-300 relative overflow-hidden
                    ${isPlaceholder
                        ? 'bg-zinc-900/30 border-zinc-800/50 cursor-default grayscale opacity-60'
                        : `bg-zinc-800/50 border-zinc-700/50 cursor-help ${activeColors.border} hover:bg-zinc-800`
                    }
                `}
            >
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    {title}
                    {!isPlaceholder && <Info size={12} className="opacity-0 group-hover:opacity-50 transition-opacity" />}
                </h4>

                <div className={`text-3xl font-bold ${isPlaceholder ? 'text-zinc-700' : activeColors.text}`}>
                    {isPlaceholder ? "—" : <AnimatedCounter value={value} />}
                </div>

                {isPlaceholder && (
                    <div className="absolute inset-0 bg-zinc-950/10 backdrop-blur-[1px]"></div>
                )}
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-2 z-50 bg-zinc-900 border border-zinc-700 p-4 rounded-xl shadow-xl shadow-black/80 ring-1 ring-white/5"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h5 className="text-sm font-semibold text-zinc-200">{title}</h5>
                            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="text-zinc-500 hover:text-white">
                                <X size={14} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 font-mono text-xs text-blue-300 shadow-inner">
                                {formula}
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                                {description}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Stats = ({ metrics, status }) => {
    // If status is idle or running, we show placeholders or 0? 
    // Requirement: Count up only AFTER completion.
    // So if status !== 'finished', show placeholders.

    const isFinished = status === 'finished' && metrics;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
                title="Avg. Waiting Time"
                value={isFinished ? `${metrics.avgWaiting?.toFixed(2)} ms` : "—"}
                color="purple"
                formula="Σ (Start Time - Arrival Time) / N"
                description="The average time a process spends in the ready queue waiting for the CPU."
                isPlaceholder={!isFinished}
            />
            <StatsCard
                title="Avg. Turnaround Time"
                value={isFinished ? `${metrics.avgTurnaround?.toFixed(2)} ms` : "—"}
                color="emerald"
                formula="Σ (Completion Time - Arrival Time) / N"
                description="The average time taken to complete a process from submission to completion."
                isPlaceholder={!isFinished}
            />
            <StatsCard
                title="CPU Utilization"
                value={isFinished ? `${metrics.cpuUtilization?.toFixed(2)}%` : "—"}
                color="blue"
                formula="(Total Burst Time / Total Time) * 100"
                description="The percentage of time the CPU was busy executing processes."
                isPlaceholder={!isFinished}
            />
        </div>
    );
};

export default Stats;
