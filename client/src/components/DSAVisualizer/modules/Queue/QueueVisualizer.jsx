import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Eye, RotateCcw } from 'lucide-react';

const QueueVisualizer = () => {
    const [queue, setQueue] = useState([10, 25, 8, 42]);
    const [inputValue, setInputValue] = useState('');
    const [peekedIndex, setPeekedIndex] = useState(null);
    const [operation, setOperation] = useState(null);

    const handleEnqueue = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) return;

        setOperation('enqueue');
        setQueue([...queue, val]);
        setInputValue('');

        setTimeout(() => setOperation(null), 500);
    };

    const handleDequeue = () => {
        if (queue.length === 0) return;

        setOperation('dequeue');
        setTimeout(() => {
            setQueue(queue.slice(1));
            setOperation(null);
        }, 500);
    };

    const handlePeek = () => {
        if (queue.length === 0) return;

        setPeekedIndex(0);
        setTimeout(() => setPeekedIndex(null), 1500);
    };

    const handleReset = () => {
        setQueue([10, 25, 8, 42]);
        setPeekedIndex(null);
        setOperation(null);
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950">
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-zinc-900/50">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">Queue (FIFO)</h2>
                        <p className="text-xs text-zinc-500 font-mono mt-1">Enqueue: O(1) • Dequeue: O(1) • Peek: O(1)</p>
                    </div>
                    <button
                        onClick={handleReset}
                        className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="p-6 border-b border-white/5 bg-zinc-900/30 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-zinc-800/50 p-3 rounded-xl border border-white/5">
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleEnqueue()}
                        placeholder="Value"
                        className="w-24 bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-indigo-500"
                    />
                    <button
                        onClick={handleEnqueue}
                        className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors"
                        title="Enqueue"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <button
                    onClick={handleDequeue}
                    disabled={queue.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-lg text-white transition-colors"
                >
                    <Minus size={16} /> Dequeue
                </button>

                <button
                    onClick={handlePeek}
                    disabled={queue.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-lg text-white transition-colors"
                >
                    <Eye size={16} /> Peek
                </button>
            </div>

            {/* Visualization */}
            <div className="flex-1 flex items-center justify-center p-12 overflow-x-auto">
                <div className="flex flex-col gap-6">
                    {/* Labels */}
                    <div className="flex items-center gap-2">
                        <div className="w-24 text-right">
                            <span className="text-xs text-emerald-400 font-bold uppercase">Front →</span>
                        </div>
                        <div className="flex-1"></div>
                        <div className="w-24 text-left">
                            <span className="text-xs text-amber-400 font-bold uppercase">← Rear</span>
                        </div>
                    </div>

                    {/* Queue Elements */}
                    <div className="flex items-center gap-2">
                        <AnimatePresence mode="popLayout">
                            {queue.map((value, idx) => (
                                <motion.div
                                    key={`${idx}-${value}`}
                                    layout
                                    initial={{ scale: 0, x: 100, opacity: 0 }}
                                    animate={{
                                        scale: 1,
                                        x: 0,
                                        opacity: 1,
                                        backgroundColor: peekedIndex === idx
                                            ? '#eab308'
                                            : (operation === 'dequeue' && idx === 0)
                                                ? '#dc2626'
                                                : '#27272a',
                                        borderColor: idx === 0
                                            ? '#10b981'
                                            : idx === queue.length - 1
                                                ? '#f59e0b'
                                                : 'rgba(255,255,255,0.1)'
                                    }}
                                    exit={{ scale: 0, x: -100, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="relative group"
                                >
                                    <div className="w-16 h-16 rounded-lg border-2 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                                        {value}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {queue.length === 0 && (
                        <div className="text-center text-zinc-600 font-mono text-sm">Queue is empty</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QueueVisualizer;
