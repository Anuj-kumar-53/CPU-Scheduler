import React from 'react';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, FastForward, SkipBack as PrevStep, SkipForward as NextStep } from 'lucide-react';
import useVisualizerStore from '../store/useVisualizerStore';

const Controls = () => {
    const {
        isPlaying,
        play,
        pause,
        reset,
        nextStep,
        prevStep,
        playbackSpeed,
        setSpeed,
        currentStep,
        totalSteps
    } = useVisualizerStore();

    const handlePlayPause = () => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    };

    const calculateProgress = () => {
        if (totalSteps <= 1) return 0;
        return (currentStep / (totalSteps - 1)) * 100;
    };

    return (
        <div className="bg-zinc-900/80 backdrop-blur-md border-t border-white/5 p-4 flex items-center justify-between z-30 relative">
            <div className="flex items-center gap-4">
                <button
                    onClick={reset}
                    className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    title="Reset"
                >
                    <RotateCcw size={20} />
                </button>

                <div className="flex items-center gap-2 bg-zinc-800/50 rounded-xl p-1 shadow-inner border border-white/5">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <PrevStep size={20} fill='currentColor' />
                    </button>
                    <button
                        onClick={handlePlayPause}
                        className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                    >
                        {isPlaying ? <Pause size={24} fill='currentColor' /> : <Play size={24} fill='currentColor' />}
                    </button>
                    <button
                        onClick={nextStep}
                        disabled={currentStep >= totalSteps - 1}
                        className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <NextStep size={20} fill='currentColor' />
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 mx-8 flex flex-col gap-2">
                <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    <span>Step {currentStep}</span>
                    <span>{totalSteps} Steps</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden relative w-full">
                    <div
                        className="h-full bg-indigo-500 transition-all duration-300 ease-linear"
                        style={{ width: `${calculateProgress()}%` }}
                    ></div>
                </div>
            </div>

            {/* Speed Control */}
            <div className="flex items-center gap-3 w-48 bg-zinc-800/30 p-2 rounded-xl border border-white/5">
                <FastForward size={16} className="text-zinc-500" />
                <div className="flex flex-col flex-1">
                    <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase mb-1">
                        <span>Speed</span>
                        <span>{playbackSpeed}x</span>
                    </div>
                    <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.5"
                        value={playbackSpeed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default Controls;
