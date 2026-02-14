import { useEffect } from 'react';
import useVisualizerStore from '../store/useVisualizerStore';

const useAnimationController = () => {
    const { isPlaying, playbackSpeed, nextStep, currentStep, totalSteps } = useVisualizerStore();

    useEffect(() => {
        let interval;
        if (isPlaying && currentStep < totalSteps - 1) {
            // Calculate delay based on speed: 1x = 500ms, 2x = 250ms, etc.
            // Adjust base delay as needed.
            const delay = 500 / playbackSpeed;
            interval = setInterval(() => {
                nextStep();
            }, delay);
        } else if (currentStep >= totalSteps - 1 && isPlaying) {
            // Auto pause at end
            useVisualizerStore.getState().pause();
        }
        return () => clearInterval(interval);
    }, [isPlaying, playbackSpeed, currentStep, totalSteps, nextStep]);
};

export default useAnimationController;
