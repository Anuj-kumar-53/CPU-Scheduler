import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, BarChart2, Play } from 'lucide-react';
import useVisualizerStore from '../../store/useVisualizerStore';
import Controls from '../../components/Controls';
import useAnimationController from '../../hooks/useAnimationController';
import { bubbleSort } from './algorithms/bubbleSort';
import { selectionSort } from './algorithms/selectionSort';
import { quickSort } from './algorithms/quickSort';
import { mergeSort } from './algorithms/mergeSort';

const ALGORITHMS = {
    'bubble': { name: 'Bubble Sort', func: bubbleSort, complexity: 'O(n²)', space: 'O(1)' },
    'selection': { name: 'Selection Sort', func: selectionSort, complexity: 'O(n²)', space: 'O(1)' },
    'quick': { name: 'Quick Sort', func: quickSort, complexity: 'O(n log n)', space: 'O(log n)' },
    'merge': { name: 'Merge Sort', func: mergeSort, complexity: 'O(n log n)', space: 'O(n)' },
};

const SortingVisualizer = () => {
    const {
        currentStep,
        frames,
        setTrace,
        reset,
        isPlaying
    } = useVisualizerStore();

    const [arraySize, setArraySize] = useState(20);
    const [localArray, setLocalArray] = useState([]);
    const [selectedAlgo, setSelectedAlgo] = useState('bubble');
    const [customInput, setCustomInput] = useState('');
    const [inputError, setInputError] = useState(null);

    useAnimationController();

    const runAlgorithm = (arr, algoKey) => {
        const algo = ALGORITHMS[algoKey].func;
        const trace = algo([...arr]);
        setTrace(trace);
    };

    const generateArray = () => {
        const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 10);
        setLocalArray(newArray);
        setCustomInput('');
        setInputError(null);
        reset();
        runAlgorithm(newArray, selectedAlgo);
    };

    const handleCustomInput = (e) => {
        const val = e.target.value;
        setCustomInput(val);
    };

    const submitCustomInput = () => {
        try {
            const numbers = customInput.split(',')
                .map(num => num.trim())
                .filter(num => num !== '')
                .map(num => {
                    const n = Number(num);
                    if (isNaN(n)) throw new Error('Invalid number');
                    return n;
                });

            if (numbers.length === 0) throw new Error('Array cannot be empty');
            if (numbers.length > 50) throw new Error('Max 50 elements');

            setLocalArray(numbers);
            setArraySize(numbers.length);
            setInputError(null);
            reset();
            runAlgorithm(numbers, selectedAlgo);
        } catch (err) {
            setInputError(err.message || 'Invalid input. Use comma-separated numbers.');
        }
    };

    useEffect(() => {
        if (localArray.length > 0) {
            reset();
            runAlgorithm(localArray, selectedAlgo);
        }
    }, [selectedAlgo]);

    useEffect(() => {
        generateArray();
    }, []);

    const frame = frames[currentStep] || { array: localArray, comparing: [], swapped: [], sorted: [] };
    const { array, comparing, swapped, sorted } = frame;
    const currentAlgoInfo = ALGORITHMS[selectedAlgo];

    return (
        <div className="flex flex-col h-full bg-zinc-950">
            <div className="flex flex-col md:flex-row items-center justify-between p-6 border-b border-white/5 bg-zinc-900/50 gap-4">

                <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="p-2 bg-indigo-500/10 rounded-lg shrink-0">
                        <BarChart2 size={24} className="text-indigo-400" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <select
                                value={selectedAlgo}
                                onChange={(e) => setSelectedAlgo(e.target.value)}
                                disabled={isPlaying}
                                className="bg-transparent text-xl font-bold text-white outline-none cursor-pointer hover:text-indigo-400 transition-colors"
                            >
                                {Object.entries(ALGORITHMS).map(([key, val]) => (
                                    <option key={key} value={key} className="bg-zinc-900 text-sm">{val.name}</option>
                                ))}
                            </select>
                        </div>
                        <p className="text-xs text-zinc-500 font-mono">{currentAlgoInfo.complexity} Avg • {currentAlgoInfo.space} Space</p>
                    </div>
                </div>

                <div className="flex-1 max-w-lg w-full">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Enter numbers (e.g., 5, 12, 8, 30)..."
                            value={customInput}
                            onChange={handleCustomInput}
                            onKeyDown={(e) => e.key === 'Enter' && submitCustomInput()}
                            disabled={isPlaying}
                            className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-zinc-700"
                        />
                        <button
                            onClick={submitCustomInput}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-indigo-400 transition-colors"
                            title="Visualize"
                        >
                            <Play size={14} fill="currentColor" />
                        </button>
                    </div>
                    {inputError && <p className="text-[10px] text-red-500 mt-1 ml-1 absolute">{inputError}</p>}
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                    <div className="flex flex-col w-24">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Random: {arraySize}</span>
                        <input
                            type="range"
                            min="5"
                            max="50"
                            value={arraySize}
                            onChange={(e) => setArraySize(Number(e.target.value))}
                            onMouseUp={generateArray}
                            onTouchEnd={generateArray}
                            disabled={isPlaying}
                            className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-50"
                        />
                    </div>

                    <button
                        onClick={generateArray}
                        disabled={isPlaying}
                        className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-white/5 rounded-lg text-xs font-bold text-zinc-300 transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                        <RefreshCw size={14} /> Random
                    </button>
                </div>
            </div>

            <div className="flex-1 flex items-end justify-center px-12 py-12 gap-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                <AnimatePresence>
                    {array.map((value, idx) => {
                        let bgClass = "bg-zinc-700";
                        if (comparing.includes(idx)) bgClass = "bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]";
                        if (swapped.includes(idx)) bgClass = "bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]";
                        if (sorted.includes(idx)) bgClass = "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]";

                        const maxVal = Math.max(...array, 100);
                        const height = `${(value / maxVal) * 90}%`;

                        return (
                            <motion.div
                                key={`${idx}-${value}`}
                                layout
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className={`rounded-t-md flex-1 max-w-[40px] min-w-[4px] transition-colors duration-200 ${bgClass} relative group`}
                            >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap border border-white/10">
                                    Value: {value}
                                </div>
                                {array.length <= 25 && (
                                    <span className="block text-center text-[10px] font-bold text-black/50 mt-1 truncate px-0.5">{value}</span>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <Controls />
        </div>
    );
};

export default SortingVisualizer;
