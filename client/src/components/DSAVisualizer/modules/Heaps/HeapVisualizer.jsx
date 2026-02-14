import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, RotateCcw, TrendingDown } from 'lucide-react';

const HeapVisualizer = () => {
    const [heap, setHeap] = useState([10, 20, 15, 30, 40]);
    const [inputValue, setInputValue] = useState('');
    const [heapType, setHeapType] = useState('min'); // 'min' or 'max'

    const heapifyUp = (arr, idx, isMin) => {
        while (idx > 0) {
            const parentIdx = Math.floor((idx - 1) / 2);
            const shouldSwap = isMin
                ? arr[idx] < arr[parentIdx]
                : arr[idx] > arr[parentIdx];

            if (shouldSwap) {
                [arr[idx], arr[parentIdx]] = [arr[parentIdx], arr[idx]];
                idx = parentIdx;
            } else {
                break;
            }
        }
    };

    const heapifyDown = (arr, idx, isMin) => {
        const n = arr.length;
        while (true) {
            let targetIdx = idx;
            const leftIdx = 2 * idx + 1;
            const rightIdx = 2 * idx + 2;

            if (leftIdx < n) {
                const shouldSwap = isMin
                    ? arr[leftIdx] < arr[targetIdx]
                    : arr[leftIdx] > arr[targetIdx];
                if (shouldSwap) targetIdx = leftIdx;
            }

            if (rightIdx < n) {
                const shouldSwap = isMin
                    ? arr[rightIdx] < arr[targetIdx]
                    : arr[rightIdx] > arr[targetIdx];
                if (shouldSwap) targetIdx = rightIdx;
            }

            if (targetIdx !== idx) {
                [arr[idx], arr[targetIdx]] = [arr[targetIdx], arr[idx]];
                idx = targetIdx;
            } else {
                break;
            }
        }
    };

    const handleInsert = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) return;

        const newHeap = [...heap, val];
        heapifyUp(newHeap, newHeap.length - 1, heapType === 'min');
        setHeap(newHeap);
        setInputValue('');
    };

    const handleExtract = () => {
        if (heap.length === 0) return;

        const newHeap = [...heap];
        newHeap[0] = newHeap[newHeap.length - 1];
        newHeap.pop();

        if (newHeap.length > 0) {
            heapifyDown(newHeap, 0, heapType === 'min');
        }

        setHeap(newHeap);
    };

    const handleReset = () => {
        setHeap([10, 20, 15, 30, 40]);
    };

    const toggleHeapType = () => {
        const newType = heapType === 'min' ? 'max' : 'min';
        setHeapType(newType);

        // Rebuild heap with new type
        const newHeap = [...heap];
        for (let i = Math.floor(newHeap.length / 2) - 1; i >= 0; i--) {
            heapifyDown(newHeap, i, newType === 'min');
        }
        setHeap(newHeap);
    };

    // Calculate positions for tree visualization
    const getNodePosition = (idx, x = 400, y = 50, level = 0, offset = 150) => {
        if (idx >= heap.length) return null;

        const positions = [{ idx, x, y, value: heap[idx] }];
        const newOffset = offset / 2;

        const leftIdx = 2 * idx + 1;
        const rightIdx = 2 * idx + 2;

        if (leftIdx < heap.length) {
            positions.push(...getNodePosition(leftIdx, x - offset, y + 80, level + 1, newOffset));
        }
        if (rightIdx < heap.length) {
            positions.push(...getNodePosition(rightIdx, x + offset, y + 80, level + 1, newOffset));
        }

        return positions;
    };

    const nodes = getNodePosition(0) || [];

    return (
        <div className="flex flex-col h-full bg-zinc-950">
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-zinc-900/50">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <TrendingDown size={24} className="text-indigo-400" />
                            {heapType === 'min' ? 'Min' : 'Max'} Heap
                        </h2>
                        <p className="text-xs text-zinc-500 font-mono mt-1">Insert: O(log n) • Extract: O(log n) • Heapify: O(n)</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleHeapType}
                            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-white/5 rounded-lg text-xs font-bold text-zinc-300 transition-all"
                        >
                            Switch to {heapType === 'min' ? 'Max' : 'Min'}
                        </button>
                        <button
                            onClick={handleReset}
                            className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                        >
                            <RotateCcw size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="p-6 border-b border-white/5 bg-zinc-900/30 flex gap-4">
                <div className="flex items-center gap-2 bg-zinc-800/50 p-3 rounded-xl border border-white/5">
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                        placeholder="Value"
                        className="w-20 bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-indigo-500"
                    />
                    <button
                        onClick={handleInsert}
                        className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <button
                    onClick={handleExtract}
                    disabled={heap.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-lg text-white transition-colors"
                >
                    <Minus size={16} /> Extract {heapType === 'min' ? 'Min' : 'Max'}
                </button>
            </div>

            {/* Array Representation */}
            <div className="px-6 py-4 border-b border-white/5 bg-zinc-900/20">
                <span className="text-xs text-zinc-500 font-bold uppercase mr-2">Array:</span>
                <span className="text-sm text-white font-mono">[{heap.join(', ')}]</span>
            </div>

            {/* Visualization */}
            <div className="flex-1 relative overflow-auto">
                <svg className="w-full h-full min-w-[800px] min-h-[500px]">
                    {/* Edges */}
                    {nodes.map(node => {
                        const leftIdx = 2 * node.idx + 1;
                        const rightIdx = 2 * node.idx + 2;
                        const leftNode = nodes.find(n => n.idx === leftIdx);
                        const rightNode = nodes.find(n => n.idx === rightIdx);

                        return (
                            <g key={`edges-${node.idx}`}>
                                {leftNode && (
                                    <line
                                        x1={node.x}
                                        y1={node.y}
                                        x2={leftNode.x}
                                        y2={leftNode.y}
                                        stroke="rgba(255,255,255,0.2)"
                                        strokeWidth="2"
                                    />
                                )}
                                {rightNode && (
                                    <line
                                        x1={node.x}
                                        y1={node.y}
                                        x2={rightNode.x}
                                        y2={rightNode.y}
                                        stroke="rgba(255,255,255,0.2)"
                                        strokeWidth="2"
                                    />
                                )}
                            </g>
                        );
                    })}

                    {/* Nodes */}
                    <AnimatePresence>
                        {nodes.map(node => (
                            <motion.g
                                key={`node-${node.idx}-${node.value}`}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            >
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="28"
                                    fill="#27272a"
                                    stroke={node.idx === 0 ? (heapType === 'min' ? '#10b981' : '#f59e0b') : '#6366f1'}
                                    strokeWidth="2"
                                />
                                <text
                                    x={node.x}
                                    y={node.y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="white"
                                    fontSize="16"
                                    fontWeight="bold"
                                >
                                    {node.value}
                                </text>
                                {node.idx === 0 && (
                                    <text
                                        x={node.x}
                                        y={node.y - 45}
                                        textAnchor="middle"
                                        fill={heapType === 'min' ? '#10b981' : '#f59e0b'}
                                        fontSize="10"
                                        fontWeight="bold"
                                    >
                                        {heapType === 'min' ? 'MIN' : 'MAX'}
                                    </text>
                                )}
                            </motion.g>
                        ))}
                    </AnimatePresence>
                </svg>

                {heap.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-600 font-mono text-sm">
                        Heap is empty
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeapVisualizer;
