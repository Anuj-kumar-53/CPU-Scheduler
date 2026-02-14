export const rr = (processes, timeQuantum) => {
    let currentTime = 0;
    const timeline = [];
    const resultProcesses = [];
    const n = processes.length;

    // Queue for Round Robin
    const queue = [];

    // Deep copy to track remaining time
    const activeProcesses = processes.map(p => ({
        ...p,
        remainingTime: p.burstTime,
        startTime: -1,
        inQueue: false
    }));

    // Helper to add arriving processes to queue
    const checkArrivals = (time) => {
        // Sort by arrival time to ensure correct order of adding to queue for same arrival time?
        // Usually arrival time is enough.
        const arriving = activeProcesses.filter(p => p.arrivalTime <= time && p.remainingTime > 0 && !p.inQueue && !queue.includes(p));
        arriving.sort((a, b) => a.arrivalTime - b.arrivalTime);

        arriving.forEach(p => {
            queue.push(p);
            p.inQueue = true;
        });
    };

    // Initial check
    checkArrivals(currentTime);

    // If queue is empty but not all completed, jump to next arrival
    // But we need to handle "idle" properly.

    let completed = 0;

    while (completed < n) {
        if (queue.length === 0) {
            // Jump to next arrival
            const futureArrivals = activeProcesses.filter(p => p.arrivalTime > currentTime && p.remainingTime > 0).sort((a, b) => a.arrivalTime - b.arrivalTime);

            if (futureArrivals.length === 0) break; // All done or checked

            const nextArrival = futureArrivals[0].arrivalTime;

            timeline.push({
                processId: null,
                startTime: currentTime,
                endTime: nextArrival
            });
            currentTime = nextArrival;
            checkArrivals(currentTime);
        }

        if (queue.length > 0) {
            const currentProcess = queue.shift();
            // currentProcess.inQueue = false; // It's running now, effectively removed from queue but will be added back if not finished

            if (currentProcess.startTime === -1) {
                currentProcess.startTime = currentTime;
            }

            const runTime = Math.min(currentProcess.remainingTime, timeQuantum);

            timeline.push({
                processId: currentProcess.id,
                startTime: currentTime,
                endTime: currentTime + runTime
            });

            currentTime += runTime;
            currentProcess.remainingTime -= runTime;

            // CRITICAL: Check for new arrivals BEFORE adding current process back
            checkArrivals(currentTime);

            if (currentProcess.remainingTime > 0) {
                queue.push(currentProcess);
            } else {
                completed++;
                const completionTime = currentTime;
                const turnaroundTime = completionTime - currentProcess.arrivalTime;
                const waitingTime = turnaroundTime - currentProcess.burstTime;

                resultProcesses.push({
                    ...currentProcess,
                    completionTime,
                    turnaroundTime,
                    waitingTime
                });
            }
        }
    }

    return { processes: resultProcesses, timeline };
};
