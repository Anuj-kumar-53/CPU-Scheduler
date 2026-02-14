import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Search, RotateCcw, ArrowLeftRight } from 'lucide-react';

const ArrayVisualizer = () => {
    const [array, setArray] = useState([10, 25, 8, 42, 15, 33, 7]);
    const [inputValue, setInputValue] = useState('');
    const [indexValue, setIndexValue] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(null);
    const [operation, setOperation] = useState(null); // 'insert', 'delete', 'search'

    const handleInsert = () => {
        const val = parseInt(inputValue);
        const idx = parseInt(indexValue);

        if (isNaN(val)) return;

        setOperation('insert');
        if (isNaN(idx) || idx < 0 || idx > array.length) {
            // Insert at end
            setArray([...array, val]);
            setHighlightedIndex(array.length);
        } else {
            const newArray = [...array];
            newArray.splice(idx, 0, val);
            setArray(newArray);
            setHighlightedIndex(idx);
        }

        setInputValue('');
        setIndexValue('');
        setTimeout(() => {
            setHighlightedIndex(null);
            setOperation(null);
        }, 1000);
    };

    const handleDelete = () => {
        const idx = parseInt(indexValue);
        if (isNaN(idx) || idx < 0 || idx >= array.length) return;

        setOperation('delete');
        setHighlightedIndex(idx);

        setTimeout(() => {
            const newArray = [...array];
            newArray.splice(idx, 1);
            setArray(newArray);
            setHighlightedIndex(null);
            setOperation(null);
            setIndexValue('');
        }, 500);
    };

    const handleSearch = () => {
        const val = parseInt(searchValue);
        if (isNaN(val)) return;

        setOperation('search');
        const idx = array.indexOf(val);

        if (idx !== -1) {
            setHighlightedIndex(idx);
            setTimeout(() => {
                setHighlightedIndex(null);
                setOperation(null);
            }, 2000);
        } else {
            setOperation(null);
        }
        setSearchValue('');
    };

    const handleReverse = () => {
        setOperation('reverse');
        setArray([...array].reverse());
        setTimeout(() => setOperation(null), 500);
    };

    const handleReset = () => {
        setArray([10, 25, 8, 42, 15, 33, 7]);
        setHighlightedIndex(null);
        setOperation(null);
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950">
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-zinc-900/50">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">Array Operations</h2>
                        <p className="text-xs text-zinc-500 font-mono mt-1">Insert: O(n) • Delete: O(n) • Search: O(n)</p>
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
                    <input
                        type="number"
                        value={indexValue}
                        onChange={(e) => setIndexValue(e.target.value)}
                        placeholder="Index"
                        className="w-20 bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-indigo-500"
                    />
                    <button
                        onClick={handleInsert}
                        className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors"
                        title="Insert"
                    >
                        <Plus size={16} />
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
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                {/* Search */}
                <div className="flex items-center gap-2 bg-zinc-800/50 p-3 rounded-xl border border-white/5">
                    <input
                        type="number"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search"
                        className="w-20 bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-yellow-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="p-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white transition-colors"
                        title="Search"
                    >
                        <Search size={16} />
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
                <div className="flex items-center gap-2">
                    <AnimatePresence mode="popLayout">
                        {array.map((value, idx) => (
                            <motion.div
                                key={`${idx}-${value}`}
                                layout
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                    backgroundColor: highlightedIndex === idx
                                        ? (operation === 'delete' ? '#dc2626' : operation === 'search' ? '#eab308' : '#6366f1')
                                        : '#27272a'
                                }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="relative group"
                            >
                                {/* Index Label */}
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-zinc-500 uppercase">
                                    {idx}
                                </div>

                                {/* Array Cell */}
                                <div className="w-16 h-16 rounded-lg border-2 border-white/10 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                                    {value}
                                </div>

                                {/* Tooltip */}
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap border border-white/10">
                                    arr[{idx}] = {value}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ArrayVisualizer;
