export const sjf = (processes, preemptive = false) => {
    if (preemptive) {
        return sjfPreemptive(processes);
    } else {
        return sjfNonPreemptive(processes);
    }
};

const sjfNonPreemptive = (processes) => {
    let currentTime = 0;
    let completed = 0;
    const n = processes.length;
    const timeline = [];
    const resultProcesses = [];
    const isCompleted = new Array(n).fill(false);

    // Sort by arrival time primarily, ID secondarily for stability
    let sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime || a.id - b.id);
    // Map original IDs to indices in sorted array for easier management
    // Actually better to work with a pool

    // Using a loop until all completed
    while (completed < n) {
        // Find process arriving <= currentTime and not completed
        let idx = -1;
        let minBurst = Infinity;

        for (let i = 0; i < n; i++) {
            if (!isCompleted[i] && sortedProcesses[i].arrivalTime <= currentTime) {
                if (sortedProcesses[i].burstTime < minBurst) {
                    minBurst = sortedProcesses[i].burstTime;
                    idx = i;
                } else if (sortedProcesses[i].burstTime === minBurst) {
                    // Tie-breaker: Arrival time
                    if (sortedProcesses[i].arrivalTime < sortedProcesses[idx].arrivalTime) {
                        idx = i;
                    }
                }
            }
        }

        if (idx !== -1) {
            const process = sortedProcesses[idx];
            const startTime = currentTime;
            const completionTime = startTime + process.burstTime;
            const turnaroundTime = completionTime - process.arrivalTime;
            const waitingTime = turnaroundTime - process.burstTime;

            timeline.push({
                processId: process.id,
                startTime: startTime,
                endTime: completionTime
            });

            resultProcesses.push({
                ...process,
                startTime,
                completionTime,
                turnaroundTime,
                waitingTime
            });

            currentTime = completionTime;
            isCompleted[idx] = true;
            completed++;
        } else {
            // No process available, advance time
            // Find next arrival
            let nextArrival = Infinity;
            for (let i = 0; i < n; i++) {
                if (!isCompleted[i] && sortedProcesses[i].arrivalTime < nextArrival) {
                    nextArrival = sortedProcesses[i].arrivalTime;
                }
            }

            if (nextArrival === Infinity) break; // Should not happen if completed < n

            timeline.push({
                processId: null,
                startTime: currentTime,
                endTime: nextArrival
            });
            currentTime = nextArrival;
        }
    }

    return { processes: resultProcesses, timeline };
};

const sjfPreemptive = (processes) => {
    let currentTime = 0;
    let completed = 0;
    const n = processes.length;
    const timeline = [];
    // Deep copy to track remaining time
    const activeProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime, startTime: -1 }));
    let completedList = [];

    // Simulation requires stepping or event-based
    // simpler to step by unit time or next event?
    // Step by next event (arrival or completion of current) is better but complex for SRJF
    // Checking at every time unit is inefficient but easiest for correctness with small numbers.
    // Let's use event-based:
    // Events: Process Arrival, Current Process Completion.

    // Actually, simpler approach for SRJF:
    // Run 1 unit of time, then check ready queue.
    // Optimization: Run until next arrival or current process finishes.

    while (completed < n) {
        // Get available processes
        const available = activeProcesses.filter(p => p.arrivalTime <= currentTime && p.remainingTime > 0);

        let selected = null;
        if (available.length > 0) {
            // Pick shortest remaining time
            available.sort((a, b) => a.remainingTime - b.remainingTime || a.arrivalTime - b.arrivalTime);
            selected = available[0];
        }

        if (selected) {
            // Determine how long to run
            // Run until next arrival or completion
            // Find next arrival time > currentTime
            const futureArrivals = activeProcesses.filter(p => p.arrivalTime > currentTime).sort((a, b) => a.arrivalTime - b.arrivalTime);
            const nextArrival = futureArrivals.length > 0 ? futureArrivals[0].arrivalTime : Infinity;

            // Time we can run is min(remainingTime, nextArrival - currentTime)
            let runTime = Math.min(selected.remainingTime, nextArrival - currentTime);
            // Also if nextArrival is VERY far, run until completion

            // Wait, strict SRJF preemption happens EXACTLY at arrival.
            // But if `nextArrival - currentTime` > remainingTime, we finish before next arrival.
            // If `nextArrival - currentTime` < remainingTime, we run until next arrival, then re-evaluate.

            // Logic handled by `Math.min`.

            // Record start time if not set
            if (selected.startTime === -1) {
                selected.startTime = currentTime;
            }

            // check if we can merge functionality with previous timeline entry
            const lastEntry = timeline[timeline.length - 1];
            if (lastEntry && lastEntry.processId === selected.id && lastEntry.endTime === currentTime) {
                lastEntry.endTime += runTime;
            } else {
                timeline.push({
                    processId: selected.id,
                    startTime: currentTime,
                    endTime: currentTime + runTime
                });
            }

            selected.remainingTime -= runTime;
            currentTime += runTime;

            if (selected.remainingTime === 0) {
                completed++;
                const completionTime = currentTime;
                const turnaroundTime = completionTime - selected.arrivalTime;
                const waitingTime = turnaroundTime - selected.burstTime;

                completedList.push({
                    ...selected,
                    completionTime,
                    turnaroundTime,
                    waitingTime
                });
            }
        } else {
            // Idle
            const futureArrivals = activeProcesses.filter(p => p.arrivalTime > currentTime).sort((a, b) => a.arrivalTime - b.arrivalTime);
            const nextArrival = futureArrivals.length > 0 ? futureArrivals[0].arrivalTime : Infinity;

            if (nextArrival === Infinity) {
                // Should not happen if completed < n
                break;
            }

            const lastEntry = timeline[timeline.length - 1];
            if (lastEntry && lastEntry.processId === null && lastEntry.endTime === currentTime) {
                lastEntry.endTime = nextArrival;
            } else {
                timeline.push({
                    processId: null,
                    startTime: currentTime,
                    endTime: nextArrival
                });
            }
            currentTime = nextArrival;
        }
    }

    return { processes: completedList, timeline };
};
