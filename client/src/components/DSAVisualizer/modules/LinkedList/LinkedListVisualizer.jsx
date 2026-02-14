import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowLeftRight, RotateCcw, ArrowRight } from 'lucide-react';

const LinkedListVisualizer = () => {
    const [nodes, setNodes] = useState([
        { id: 1, value: 10 },
        { id: 2, value: 25 },
        { id: 3, value: 8 },
        { id: 4, value: 42 }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [indexValue, setIndexValue] = useState('');
    const [highlightedId, setHighlightedId] = useState(null);

    const handleInsertHead = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) return;

        const newNode = { id: Date.now(), value: val };
        setNodes([newNode, ...nodes]);
        setHighlightedId(newNode.id);
        setInputValue('');

        setTimeout(() => setHighlightedId(null), 1000);
    };

    const handleInsertTail = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) return;

        const newNode = { id: Date.now(), value: val };
        setNodes([...nodes, newNode]);
        setHighlightedId(newNode.id);
        setInputValue('');

        setTimeout(() => setHighlightedId(null), 1000);
    };

    const handleDelete = () => {
        const idx = parseInt(indexValue);
        if (isNaN(idx) || idx < 0 || idx >= nodes.length) return;

        setHighlightedId(nodes[idx].id);

        setTimeout(() => {
            const newNodes = [...nodes];
            newNodes.splice(idx, 1);
            setNodes(newNodes);
            setHighlightedId(null);
            setIndexValue('');
        }, 500);
    };

    const handleReverse = () => {
        setNodes([...nodes].reverse());
    };

    const handleReset = () => {
        setNodes([
            { id: 1, value: 10 },
            { id: 2, value: 25 },
            { id: 3, value: 8 },
            { id: 4, value: 42 }
        ]);
        setHighlightedId(null);
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950">
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-zinc-900/50">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">Singly Linked List</h2>
                        <p className="text-xs text-zinc-500 font-mono mt-1">Insert: O(1) • Delete: O(n) • Search: O(n)</p>
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
                {/* Insert */}
                <div className="flex items-center gap-2 bg-zinc-800/50 p-3 rounded-xl border border-white/5">
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Value"
                        className="w-20 bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-indigo-500"
                    />
                    <button
                        onClick={handleInsertHead}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-xs font-bold transition-colors"
                    >
                        + Head
                    </button>
                    <button
                        onClick={handleInsertTail}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-xs font-bold transition-colors"
                    >
                        + Tail
                    </button>
                </div>

                {/* Delete */}
                <div className="flex items-center gap-2 bg-zinc-800/50 p-3 rounded-xl border border-white/5">
                    <span className="text-xs text-zinc-500 font-bold">Delete at:</span>
                    <input
                        type="number"
                        value={indexValue}
                        onChange={(e) => setIndexValue(e.target.value)}
                        placeholder="Index"
                        className="w-20 bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-red-500"
                    />
                    <button
                        onClick={handleDelete}
                        className="p-2 bg-red-600 hover:bg-red-500 rounded-lg text-white transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                {/* Reverse */}
                <button
                    onClick={handleReverse}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-white/5 rounded-lg text-sm font-bold text-zinc-300 transition-all"
                >
                    <ArrowLeftRight size={16} /> Reverse
                </button>
            </div>

            {/* Visualization */}
            <div className="flex-1 flex items-center justify-center p-12 overflow-x-auto">
                <div className="flex items-center gap-4">
                    <AnimatePresence mode="popLayout">
                        {nodes.map((node, idx) => (
                            <React.Fragment key={node.id}>
                                <motion.div
                                    layout
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: 1,
                                        opacity: 1,
                                        borderColor: highlightedId === node.id
                                            ? '#6366f1'
                                            : idx === 0
                                                ? '#10b981'
                                                : idx === nodes.length - 1
                                                    ? '#f59e0b'
                                                    : 'rgba(255,255,255,0.1)'
                                    }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="relative group"
                                >
                                    {/* Index Label */}
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-zinc-500 uppercase">
                                        {idx}
                                    </div>

                                    {/* Node */}
                                    <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center text-xl font-bold text-white shadow-lg bg-zinc-900">
                                        {node.value}
                                    </div>

                                    {/* Labels */}
                                    {idx === 0 && (
                                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
                                            Head
                                        </span>
                                    )}
                                    {idx === nodes.length - 1 && (
                                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                                            Tail
                                        </span>
                                    )}
                                </motion.div>

                                {/* Arrow */}
                                {idx < nodes.length - 1 && (
                                    <motion.div
                                        layout
                                        className="text-zinc-600"
                                    >
                                        <ArrowRight size={24} />
                                    </motion.div>
                                )}
                            </React.Fragment>
                        ))}
                    </AnimatePresence>

                    {nodes.length === 0 && (
                        <div className="text-zinc-600 font-mono text-sm">List is empty</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LinkedListVisualizer;
