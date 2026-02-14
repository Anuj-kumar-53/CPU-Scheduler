import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Eye, RotateCcw } from 'lucide-react';

const StackVisualizer = () => {
    const [stack, setStack] = useState([10, 25, 8, 42]);
    const [inputValue, setInputValue] = useState('');
    const [peekedIndex, setPeekedIndex] = useState(null);
    const [operation, setOperation] = useState(null);

    const handlePush = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) return;

        setOperation('push');
        setStack([...stack, val]);
        setInputValue('');

        setTimeout(() => setOperation(null), 500);
    };

    const handlePop = () => {
        if (stack.length === 0) return;

        setOperation('pop');
        setTimeout(() => {
            setStack(stack.slice(0, -1));
            setOperation(null);
        }, 500);
    };

    const handlePeek = () => {
        if (stack.length === 0) return;

        setPeekedIndex(stack.length - 1);
        setTimeout(() => setPeekedIndex(null), 1500);
    };

    const handleReset = () => {
        setStack([10, 25, 8, 42]);
        setPeekedIndex(null);
        setOperation(null);
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950">
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-zinc-900/50">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">Stack (LIFO)</h2>
                        <p className="text-xs text-zinc-500 font-mono mt-1">Push: O(1) • Pop: O(1) • Peek: O(1)</p>
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
            <div className="p-6 border-b border-white/5 bg-zinc-900/30 flex gap-4">
                <div className="flex items-center gap-2 bg-zinc-800/50 p-3 rounded-xl border border-white/5">
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handlePush()}
                        placeholder="Value"
                        className="w-24 bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-indigo-500"
                    />
                    <button
                        onClick={handlePush}
                        className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors"
                        title="Push"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <button
                    onClick={handlePop}
                    disabled={stack.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-lg text-white transition-colors"
                >
                    <Minus size={16} /> Pop
                </button>

                <button
                    onClick={handlePeek}
                    disabled={stack.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-lg text-white transition-colors"
                >
                    <Eye size={16} /> Peek
                </button>
            </div>

            {/* Visualization */}
            <div className="flex-1 flex flex-col items-center justify-end p-12 gap-2">
                {/* Stack Base */}
                <div className="w-48 h-2 bg-zinc-700 rounded-t-none rounded-b-lg"></div>

                {/* Stack Elements */}
                <div className="flex flex-col-reverse gap-0.5">
                    <AnimatePresence mode="popLayout">
                        {stack.map((value, idx) => (
                            <motion.div
                                key={`${idx}-${value}`}
                                layout
                                initial={{ scale: 0, y: -50, opacity: 0 }}
                                animate={{
                                    scale: 1,
                                    y: 0,
                                    opacity: 1,
                                    backgroundColor: peekedIndex === idx
                                        ? '#eab308'
                                        : (operation === 'pop' && idx === stack.length - 1)
                                            ? '#dc2626'
                                            : '#27272a',
                                    borderColor: idx === stack.length - 1 ? '#6366f1' : 'rgba(255,255,255,0.1)'
                                }}
                                exit={{ scale: 0, y: -50, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="relative group"
                            >
                                <div className="w-48 h-14 rounded-lg border-2 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                                    {value}
                                    {idx === stack.length - 1 && (
                                        <span className="absolute -right-16 text-xs text-indigo-400 font-bold uppercase">← Top</span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {stack.length === 0 && (
                    <div className="text-zinc-600 font-mono text-sm">Stack is empty</div>
                )}
            </div>
        </div>
    );
};

export default StackVisualizer;
