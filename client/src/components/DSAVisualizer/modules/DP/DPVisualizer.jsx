import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Zap } from 'lucide-react';

const DPVisualizer = () => {
    const [problem, setProblem] = useState('fibonacci');
    const [inputValue, setInputValue] = useState('8');
    const [dpTable, setDpTable] = useState([]);
    const [result, setResult] = useState(null);
    const [steps, setSteps] = useState([]);
    const [isRunning, setIsRunning] = useState(false);

    // Fibonacci with memoization
    const fibonacci = (n) => {
        const table = Array(n + 1).fill(null);
        const stepLog = [];

        table[0] = 0;
        table[1] = 1;
        stepLog.push({ index: 0, value: 0, desc: 'Base case: F(0) = 0' });
        stepLog.push({ index: 1, value: 1, desc: 'Base case: F(1) = 1' });

        for (let i = 2; i <= n; i++) {
            table[i] = table[i - 1] + table[i - 2];
            stepLog.push({
                index: i,
                value: table[i],
                desc: `F(${i}) = F(${i - 1}) + F(${i - 2}) = ${table[i - 1]} + ${table[i - 2]} = ${table[i]}`
            });
        }

        return { table, result: table[n], steps: stepLog };
    };

    // Coin Change (minimum coins)
    const coinChange = (amount) => {
        const coins = [1, 5, 10, 25];
        const table = Array(amount + 1).fill(Infinity);
        const stepLog = [];

        table[0] = 0;
        stepLog.push({ index: 0, value: 0, desc: 'Base case: 0 coins needed for amount 0' });

        for (let i = 1; i <= amount; i++) {
            for (const coin of coins) {
                if (coin <= i) {
                    const prev = table[i];
                    table[i] = Math.min(table[i], table[i - coin] + 1);
                    if (table[i] !== prev) {
                        stepLog.push({
                            index: i,
                            value: table[i],
                            desc: `Amount ${i}: Using coin ${coin}, min = ${table[i]} coins`
                        });
                    }
                }
            }
        }

        return {
            table,
            result: table[amount] === Infinity ? -1 : table[amount],
            steps: stepLog
        };
    };

    // Longest Common Subsequence
    const lcs = (str1, str2) => {
        const m = str1.length;
        const n = str2.length;
        const table = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
        const stepLog = [];

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    table[i][j] = table[i - 1][j - 1] + 1;
                    stepLog.push({
                        i, j,
                        value: table[i][j],
                        desc: `Match: '${str1[i - 1]}' = '${str2[j - 1]}', LCS[${i}][${j}] = ${table[i][j]}`
                    });
                } else {
                    table[i][j] = Math.max(table[i - 1][j], table[i][j - 1]);
                    stepLog.push({
                        i, j,
                        value: table[i][j],
                        desc: `No match: max(${table[i - 1][j]}, ${table[i][j - 1]}) = ${table[i][j]}`
                    });
                }
            }
        }

        return { table, result: table[m][n], steps: stepLog };
    };

    const handleRun = () => {
        setIsRunning(true);
        let dpResult;

        if (problem === 'fibonacci') {
            const n = parseInt(inputValue) || 8;
            dpResult = fibonacci(Math.min(n, 20)); // Limit to prevent overflow
        } else if (problem === 'coinchange') {
            const amount = parseInt(inputValue) || 50;
            dpResult = coinChange(Math.min(amount, 100));
        } else if (problem === 'lcs') {
            const [str1 = 'ABCD', str2 = 'ACDB'] = inputValue.split(',').map(s => s.trim());
            dpResult = lcs(str1.substring(0, 10), str2.substring(0, 10));
        }

        setDpTable(dpResult.table);
        setResult(dpResult.result);
        setSteps(dpResult.steps);

        setTimeout(() => setIsRunning(false), 500);
    };

    const handleReset = () => {
        setDpTable([]);
        setResult(null);
        setSteps([]);
    };

    const getProblemInfo = () => {
        switch (problem) {
            case 'fibonacci':
                return {
                    title: 'Fibonacci Sequence',
                    complexity: 'O(n) Time • O(n) Space',
                    description: 'Calculate nth Fibonacci number using dynamic programming',
                    placeholder: 'Enter n (e.g., 8)'
                };
            case 'coinchange':
                return {
                    title: 'Coin Change',
                    complexity: 'O(n×m) Time • O(n) Space',
                    description: 'Minimum coins needed for amount (coins: 1, 5, 10, 25)',
                    placeholder: 'Enter amount (e.g., 50)'
                };
            case 'lcs':
                return {
                    title: 'Longest Common Subsequence',
                    complexity: 'O(m×n) Time • O(m×n) Space',
                    description: 'Find LCS length between two strings',
                    placeholder: 'Enter strings (e.g., ABCD, ACDB)'
                };
            default:
                return {};
        }
    };

    const info = getProblemInfo();

    return (
        <div className="flex flex-col h-full bg-zinc-950">
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-zinc-900/50">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Zap size={24} className="text-indigo-400" />
                            {info.title}
                        </h2>
                        <p className="text-xs text-zinc-500 font-mono mt-1">{info.complexity}</p>
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
                {/* Problem Selector */}
                <select
                    value={problem}
                    onChange={(e) => {
                        setProblem(e.target.value);
                        handleReset();
                    }}
                    className="bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-indigo-500 cursor-pointer"
                >
                    <option value="fibonacci">Fibonacci</option>
                    <option value="coinchange">Coin Change</option>
                    <option value="lcs">Longest Common Subsequence</option>
                </select>

                {/* Input */}
                <div className="flex items-center gap-2 bg-zinc-800/50 p-3 rounded-xl border border-white/5">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRun()}
                        placeholder={info.placeholder}
                        className="w-48 bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-indigo-500"
                    />
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 rounded-lg text-white transition-colors"
                    >
                        <Play size={16} /> Run
                    </button>
                </div>

                {/* Result */}
                {result !== null && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <span className="text-xs text-emerald-400 font-bold uppercase">Result:</span>
                        <span className="text-lg font-bold text-emerald-400">{result}</span>
                    </div>
                )}
            </div>

            {/* Description */}
            <div className="px-6 py-3 bg-zinc-900/20 border-b border-white/5">
                <p className="text-sm text-zinc-400">{info.description}</p>
            </div>

            {/* Visualization */}
            <div className="flex-1 flex overflow-hidden">
                {/* DP Table */}
                <div className="flex-1 p-6 overflow-auto">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase mb-4">Memoization Table</h3>

                    {problem === 'lcs' && dpTable.length > 0 ? (
                        // 2D Table for LCS
                        <div className="inline-block">
                            <table className="border-collapse">
                                <tbody>
                                    {dpTable.map((row, i) => (
                                        <tr key={i}>
                                            {row.map((cell, j) => (
                                                <td key={j} className="border border-white/10 p-0">
                                                    <motion.div
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ delay: (i * row.length + j) * 0.01 }}
                                                        className={`w-12 h-12 flex items-center justify-center text-sm font-bold ${cell > 0 ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-900 text-zinc-600'
                                                            }`}
                                                    >
                                                        {cell}
                                                    </motion.div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        // 1D Table for Fibonacci and Coin Change
                        <div className="flex flex-wrap gap-2">
                            <AnimatePresence>
                                {dpTable.map((value, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="relative group"
                                    >
                                        <div className="w-16 h-16 rounded-lg border-2 border-indigo-500/30 bg-zinc-900 flex flex-col items-center justify-center">
                                            <span className="text-[10px] text-zinc-500 font-bold">[{idx}]</span>
                                            <span className="text-lg font-bold text-indigo-400">
                                                {value === Infinity ? '∞' : value}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {dpTable.length === 0 && (
                        <div className="text-zinc-600 font-mono text-sm">
                            Run the algorithm to see the DP table
                        </div>
                    )}
                </div>

                {/* Steps Log */}
                <div className="w-96 border-l border-white/5 bg-zinc-900/30 p-6 overflow-auto">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase mb-4">Computation Steps</h3>
                    <div className="space-y-2">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.02 }}
                                className="p-3 bg-zinc-800/50 rounded-lg border border-white/5"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-indigo-400">Step {idx + 1}</span>
                                    {step.value !== undefined && (
                                        <span className="text-xs text-emerald-400 font-mono">= {step.value}</span>
                                    )}
                                </div>
                                <p className="text-xs text-zinc-400 font-mono">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {steps.length === 0 && (
                        <div className="text-zinc-600 font-mono text-sm">
                            Steps will appear here
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DPVisualizer;
