import { create } from 'zustand';

const useVisualizerStore = create((set, get) => ({
    // Playback State
    isPlaying: false,
    playbackSpeed: 1, // 0.1x to 10x
    currentStep: 0,
    totalSteps: 0,
    frames: [], // Array of state snapshots

    // Algorithm State
    algorithm: null, // e.g., 'bubble', 'quick'
    dataStructure: null, // e.g., 'array', 'tree'

    // Actions
    setTrace: (frames) => set({ frames, totalSteps: frames.length, currentStep: 0, isPlaying: false }),
    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),
    reset: () => set({ currentStep: 0, isPlaying: false }),
    setSpeed: (speed) => set({ playbackSpeed: speed }),

    nextStep: () => {
        const { currentStep, totalSteps, isPlaying } = get();
        if (currentStep < totalSteps - 1) {
            set({ currentStep: currentStep + 1 });
        } else {
            set({ isPlaying: false });
        }
    },

    prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
            set({ currentStep: currentStep - 1 });
        }
    },

    setCurrentStep: (step) => set({ currentStep: step }),
}));

export default useVisualizerStore;
