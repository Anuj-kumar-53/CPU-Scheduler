export const fcfs = (processes) => {
    let currentTime = 0;
    const timeline = [];
    const resultProcesses = [];

    // Sort by arrival time
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    for (const process of sortedProcesses) {
        if (currentTime < process.arrivalTime) {
            timeline.push({
                processId: null,
                startTime: currentTime,
                endTime: process.arrivalTime
            });
            currentTime = process.arrivalTime;
        }

        const startTime = currentTime;
        const completionTime = startTime + process.burstTime;
        const turnaroundTime = completionTime - process.arrivalTime;
        const waitingTime = turnaroundTime - process.burstTime;

        timeline.push({
            processId: process.id,
            startTime: startTime,
            endTime: completionTime
        });

        // Update process object (creating a new one to avoid mutating original if needed, but here we can return enhanced objects)
        resultProcesses.push({
            ...process,
            startTime,
            completionTime,
            turnaroundTime,
            waitingTime
        });

        currentTime = completionTime;
    }

    return { processes: resultProcesses, timeline };
};
