import React from 'react';
import { Play, RotateCcw, Pause } from 'lucide-react';

const SimulationControls = ({ onSimulate, onReset, isSimulating, isPaused, togglePause, speed, setSpeed }) => {
    return (
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="flex gap-2 w-full md:w-auto">
                {!isSimulating ? (
                    <button
                        onClick={onSimulate}
                        className="flex-1 md:flex-none py-2 px-6 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center justify-center gap-2"
                    >
                        <Play size={18} /> Simulate
                    </button>
                ) : (
                    <>
                        <button
                            onClick={togglePause}
                            className="flex-1 md:flex-none py-2 px-6 bg-yellow-600 hover:bg-yellow-700 text-white rounded font-medium flex items-center justify-center gap-2"
                        >
                            {isPaused ? <Play size={18} /> : <Pause size={18} />}
                            {isPaused ? "Resume" : "Pause"}
                        </button>
                        <button
                            onClick={onReset}
                            className="flex-1 md:flex-none py-2 px-6 bg-red-600 hover:bg-red-700 text-white rounded font-medium flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={18} /> Reset
                        </button>
                    </>
                )}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-sm text-slate-300 whitespace-nowrap">Speed: {speed}x</span>
                <input
                    type="range"
                    min="0.5"
                    max="50"
                    step="0.5"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full md:w-32 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>
    );
};

export default SimulationControls;
