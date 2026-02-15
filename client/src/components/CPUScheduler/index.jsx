import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings2, Play, Activity, RotateCcw, Pause, SkipForward, Cpu, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AlgorithmSelector from '../AlgorithmSelector';
import ProcessInput from '../ProcessInput';
import ProcessList from '../ProcessList';
import GanttChart from '../GanttChart';
import Stats from '../Stats';

const CPUScheduler = ({ onBack }) => {
    const [processes, setProcesses] = useState([]);
    const [nextId, setNextId] = useState(1);
    const [algorithm, setAlgorithm] = useState('FCFS');
    const [timeQuantum, setTimeQuantum] = useState(2);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [status, setStatus] = useState('idle');
    const [speed, setSpeed] = useState(1);
    const [skipTrigger, setSkipTrigger] = useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [simulationResult, setSimulationResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSimulate = async () => {
        if (processes.length === 0) {
            setError("Please add at least one process.");
            return;
        }

        setError(null);
        try {
            const payload = {
                algorithm,
                processes,
                timeQuantum: algorithm === 'RR' ? timeQuantum : undefined
            };

            const response = await axios.post('http://localhost:5000/simulate', payload);
            setSimulationResult(response.data);
            setStatus('running');
            setSkipTrigger(0);
            setIsSidebarOpen(false); // Close sidebar on mobile when starting
        } catch (err) {
            console.error(err);
            setError("Simulation failed. Check backend connection.");
        }
    };

    const handleReset = () => {
        setStatus('idle');
        setSimulationResult(null);
        setError(null);
        setSkipTrigger(0);
    };

    const togglePause = () => {
        if (status === 'running') setStatus('paused');
        else if (status === 'paused') setStatus('running');
    };

    const handleSkip = () => {
        setSkipTrigger(prev => prev + 1);
    };

    const onSimulationComplete = () => {
        setStatus('finished');
    };

    const isRunning = status === 'running';
    const isPaused = status === 'paused';
    const isFinished = status === 'finished';

    return (
        <div className="flex flex-col md:flex-row h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 w-full relative overflow-hidden">

            {/* Mobile Sidebar Toggle */}
            <div className="md:hidden fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-90"
                >
                    {isSidebarOpen ? <RotateCcw size={24} className="rotate-45" /> : <Settings2 size={24} />}
                </button>
            </div>

            {/* Left Panel: Configuration */}
            <motion.aside
                initial={false}
                animate={{
                    x: (isSidebarOpen || windowWidth >= 1024) ? 0 : -400,
                    opacity: 1,
                    // Lock ONLY when running. Pause/Idle/Finished = Interactive.
                    filter: (isRunning && !isSidebarOpen) ? 'blur(2px) grayscale(50%)' : 'none',
                    pointerEvents: (isRunning && !isSidebarOpen) ? 'none' : 'auto'
                }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`fixed lg:relative top-0 left-0 h-screen w-80 md:w-96 bg-zinc-900/95 md:bg-zinc-900/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-40 shadow-2xl overflow-hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300 lg:transition-none`}
            >
                {/* Floating Background Blobs in Sidebar */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -ml-20 -mb-20 animate-pulse pointer-events-none text-cyan-500" style={{ animationDelay: '1s' }}></div>

                <div className="p-6 border-b border-white/5 relative z-10">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-4 py-2.5 mb-4 w-full text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"
                    >
                        <ArrowLeft size={16} /> Back to Home
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-900/20">
                            <Cpu size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg tracking-tight text-white">AlgoFlow</h1>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Process Visualization</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative z-10">
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-zinc-400 mb-2">
                            <Settings2 size={16} />
                            <h2 className="text-xs font-bold uppercase tracking-wider">Configuration</h2>
                        </div>

                        <AlgorithmSelector selected={algorithm} onSelect={setAlgorithm} disabled={isRunning} />

                        <AnimatePresence>
                            {algorithm === 'RR' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`bg-zinc-950/30 p-4 rounded-xl border border-white/5 overflow-hidden backdrop-blur-sm ${isRunning ? 'opacity-50' : ''}`}
                                >
                                    <label className="text-xs font-bold text-zinc-400 block mb-2 uppercase tracking-wide">Time Quantum (ms)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={timeQuantum}
                                        onChange={(e) => setTimeQuantum(e.target.value)}
                                        disabled={isRunning}
                                        className="w-full bg-zinc-900/50 border border-white/10 rounded-lg p-2.5 text-zinc-100 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-colors"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-zinc-400 mb-2">
                            <Activity size={16} />
                            <h2 className="text-xs font-bold uppercase tracking-wider">Process Queue</h2>
                        </div>
                        <ProcessInput
                            processes={processes}
                            setProcesses={setProcesses}
                            nextId={nextId}
                            setNextId={setNextId}
                            algorithm={algorithm}
                            disabled={isRunning}
                        />
                    </section>

                    <div className="opacity-100">
                        <ProcessList processes={processes} minimal={true} onDelete={(id) => setProcesses(processes.filter(p => p.id !== id))} />
                    </div>
                </div>
            </motion.aside>

            {/* Center Panel: Visualization */}
            <main className="flex-1 flex flex-col bg-zinc-950 relative overflow-hidden h-screen">
                {/* Animated Floating Elements Background */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-20 left-20 w-32 h-32 bg-indigo-500/5 rounded-full blur-[50px] animate-bounce duration-[10s]"></div>
                    <div className="absolute bottom-40 right-40 w-48 h-48 bg-cyan-500/5 rounded-full blur-[60px] animate-bounce duration-[12s]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(79,70,229,0.05)_0%,transparent_70%)] rounded-full blur-3xl opacity-50"></div>
                </div>

                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20"></div>

                {/* Header / Top Controls */}
                <header className="min-h-[6rem] md:h-24 flex flex-col md:flex-row items-start md:items-center justify-between px-6 md:px-10 py-4 md:py-0 z-10 relative gap-4">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{algorithm}</h2>
                            <p className="text-xs md:text-sm text-zinc-500 font-medium tracking-wide">Ready to optimize</p>
                        </div>

                        <AnimatePresence>
                            {status === 'running' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, x: -20 }}
                                    className="flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.1)]"
                                >
                                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                                    <span className="text-[10px] md:text-xs font-bold text-cyan-300 tracking-wider">EXECUTING</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Unified Controls */}
                    <div className="flex flex-wrap items-center gap-4 md:gap-6 bg-zinc-900/60 backdrop-blur-md p-2 rounded-2xl border border-white/5 shadow-xl w-full md:w-auto overflow-x-auto no-scrollbar">
                        {status !== 'idle' && (
                            <div className="flex items-center gap-3 px-3 md:px-4 md:border-r border-white/5 md:pr-6 shrink-0">
                                <div className="flex flex-col gap-1 w-24 md:w-32">
                                    <div className="flex justify-between text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase">
                                        <span>Speed</span>
                                        <span>{speed.toFixed(1)}x</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0.25"
                                        max="10"
                                        step="0.25"
                                        value={speed}
                                        onChange={(e) => setSpeed(Number(e.target.value))}
                                        className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                </div>
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            {status === 'idle' ? (
                                <motion.button
                                    key="start"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    onClick={handleSimulate}
                                    className="px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-bold text-[13px] md:text-sm shadow-lg shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 flex-1 md:flex-none"
                                >
                                    <Play size={16} fill="currentColor" /> SIMULATE
                                </motion.button>
                            ) : (
                                <div className="flex items-center gap-2 md:gap-3 shrink-0" key="controls">
                                    {status !== 'finished' && (
                                        <>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={togglePause}
                                                className="w-10 h-10 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl border border-white/5 transition-all shadow-md"
                                                title={status === 'paused' ? "Resume" : "Pause"}
                                            >
                                                {status === 'paused' ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleSkip}
                                                className="h-10 px-3 md:px-4 flex items-center justify-center bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-bold text-[10px] md:text-xs rounded-xl border border-cyan-500/20 transition-all shadow-md gap-2"
                                                title="Instant Result"
                                            >
                                                <SkipForward size={14} fill="currentColor" /> <span className="hidden sm:inline">FINISH NOW</span>
                                            </motion.button>
                                        </>
                                    )}

                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        onClick={handleReset}
                                        className={`px-4 md:px-5 py-2 md:py-2.5 ${status === 'finished' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'} rounded-xl font-bold text-[10px] md:text-xs transition-all flex items-center gap-2 h-10 justify-center`}
                                    >
                                        <RotateCcw size={16} /> <span>{status === 'finished' ? 'RESET' : 'STOP'}</span>
                                    </motion.button>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 custom-scrollbar">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 text-sm flex items-center gap-3 w-fit"
                        >
                            <div className="p-1 bg-red-500/20 rounded"><Activity size={16} /></div>
                            {error}
                        </motion.div>
                    )}

                    <div className={`max-w-6xl mx-auto space-y-8 transition-all duration-700 ${status !== 'idle' ? 'transform-none opacity-100' : ''}`}>

                        {/* Gantt Chart Section */}
                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Timeline Visualization</h3>
                            </div>
                            <GanttChart
                                timeline={simulationResult?.timeline}
                                isSimulating={status === 'running'}
                                isPaused={status === 'paused'}
                                speed={speed}
                                status={status}
                                onComplete={onSimulationComplete}
                                skipTrigger={skipTrigger}
                            />
                        </section>

                        {/* Metrics Section */}
                        <section>
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">Performance Analytics</h3>
                            <Stats metrics={simulationResult?.metrics} status={status} />
                        </section>

                        {/* Detailed Table */}
                        <section>
                            <AnimatePresence>
                                {status === 'finished' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                    >
                                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">Detailed Process Logs</h3>
                                        <ProcessList processes={simulationResult?.processes} status={status} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CPUScheduler;
