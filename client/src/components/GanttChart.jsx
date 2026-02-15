import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu } from 'lucide-react';

const GanttChart = ({ timeline, isSimulating, isPaused, speed, status, onComplete, skipTrigger }) => {
    const [currentTime, setCurrentTime] = useState(0);
    const totalDuration = timeline?.length > 0 ? timeline[timeline.length - 1].endTime : 0;
    const scale = 50;

    // Track previous skip trigger to detect changes
    const prevSkipRef = useRef(skipTrigger);

    // Reset on new simulation
    useEffect(() => {
        if (status === 'idle') {
            setCurrentTime(0);
        }
    }, [status]);

    // Handle Skip
    useEffect(() => {
        if (skipTrigger > prevSkipRef.current && status === 'running') {
            setCurrentTime(totalDuration); // Instant jump
            if (onComplete) onComplete();
        }
        prevSkipRef.current = skipTrigger;
    }, [skipTrigger, totalDuration, status, onComplete]);

    // Animation Loop
    useEffect(() => {
        if (status === 'finished') {
            if (currentTime < totalDuration) setCurrentTime(totalDuration);
            return;
        }

        if (isPaused || status !== 'running') return;

        let animationFrame;
        let lastTimestamp;

        const animate = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const delta = timestamp - lastTimestamp;
            const increment = (delta / 1000) * speed;

            setCurrentTime(prev => {
                const nextTime = Math.min(prev + increment, totalDuration);
                if (nextTime >= totalDuration && onComplete) {
                    onComplete();
                }
                return nextTime;
            });

            lastTimestamp = timestamp;

            if (currentTime < totalDuration) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [status, isPaused, speed, totalDuration, onComplete, currentTime]); // Dependency on currentTime allows re-trigger if jumped

    // Ghost State
    if (status === 'idle') {
        return (
            <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8 shadow-inner flex flex-col items-center justify-center h-48 relative overflow-hidden group backdrop-blur-sm">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]"></div>

                <div className="relative z-10 p-4 bg-zinc-950 rounded-full border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)] animate-pulse">
                    <Cpu size={32} className="text-blue-500" />
                </div>
                <p className="mt-4 text-zinc-500 text-sm font-medium tracking-wide">Ready to Simulate</p>
                <div className="mt-6 w-full max-w-md h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-700/50 w-1/3 rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
                </div>
            </div>
        );
    }

    const ticks = [];
    const maxTick = Math.max(10, Math.ceil(totalDuration));
    for (let i = 0; i <= maxTick; i++) {
        ticks.push(i);
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-white/5 p-6 shadow-2xl relative overflow-hidden"
        >
            {/* Header */}
            <div className="flex justify-between items-end mb-6 md:mb-8 relative z-10">
                <div>
                    <h3 className="text-lg md:text-xl font-bold text-zinc-200 tracking-tight">Timeline</h3>
                    <p className="text-[10px] md:text-xs text-zinc-500 mt-1 font-medium">REAL-TIME EXECUTION</p>
                </div>
                <div className="text-xl md:text-2xl font-mono font-bold text-blue-500 tabular-nums flex items-baseline gap-1">
                    {currentTime.toFixed(2)} <span className="text-zinc-600 text-[10px] md:text-sm font-sans font-medium">/ {totalDuration}ms</span>
                </div>
            </div>

            {/* Chart Area */}
            <div className="overflow-x-auto pb-4 relative z-10 custom-scrollbar">
                <div className="relative h-32 bg-zinc-950/50 border border-white/5 rounded-xl min-w-full" style={{ width: Math.max(100 + maxTick * scale, '100%') }}>

                    {/* Grid Lines */}
                    {ticks.map(t => (
                        <div
                            key={t}
                            className="absolute top-0 bottom-0 border-l border-white/5"
                            style={{ left: t * scale }}
                        />
                    ))}

                    {/* Blocks Layer */}
                    <AnimatePresence>
                        {timeline && timeline.map((block, index) => {
                            if (block.startTime > currentTime) return null;

                            const progressEndTime = Math.min(block.endTime, currentTime);
                            const width = Math.max(0, (progressEndTime - block.startTime) * scale);

                            const isRunning = currentTime >= block.startTime && currentTime < block.endTime;
                            const isCompleted = currentTime >= block.endTime;

                            return (
                                <div key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`absolute top-4 bottom-10 rounded-md border flex items-center justify-center overflow-hidden transition-colors duration-200
                                                ${block.processId
                                                ? (isCompleted ? 'bg-zinc-800 border-zinc-700 opacity-80' : 'bg-gradient-to-b from-blue-600 to-blue-700 border-blue-500/50 shadow-lg shadow-blue-900/20')
                                                : 'bg-zinc-900/50 border-dashed border-zinc-800'}
                                            `}
                                        style={{
                                            left: block.startTime * scale,
                                            width: width,
                                            zIndex: 10
                                        }}
                                    >
                                        {width > 30 && (
                                            <span className="text-xs font-bold text-white shadow-black drop-shadow-md">
                                                {block.processId ? `P${block.processId}` : 'IDLE'}
                                            </span>
                                        )}
                                    </motion.div>

                                    {isRunning && block.processId && (
                                        <motion.div
                                            layoutId="activeGlow"
                                            className="absolute top-4 bottom-10 bg-blue-500/20 blur-xl z-0"
                                            style={{ left: block.startTime * scale, width: width }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </AnimatePresence>

                    {/* Playhead */}
                    <motion.div
                        className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-50 shadow-[0_0_15px_rgba(244,63,94,0.8)]"
                        style={{ left: currentTime * scale }}
                    >
                        <div className="absolute -top-1.5 -left-[4.5px] w-3 h-3 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,1)] border-2 border-zinc-950"></div>
                    </motion.div>

                    <div className="absolute bottom-0 w-full h-8 border-t border-white/5 flex items-end">
                        {ticks.map(t => (
                            <div key={t} className="absolute bottom-0 transform -translate-x-1/2 flex flex-col items-center pb-2" style={{ left: t * scale }}>
                                <div className="h-1.5 w-px bg-zinc-700 mb-1"></div>
                                <span className="text-[10px] text-zinc-500 font-mono font-medium">{t}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default GanttChart;
