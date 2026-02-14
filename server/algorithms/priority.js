export const priority = (processes, preemptive = false) => {
    if (preemptive) {
        return priorityPreemptive(processes);
    } else {
        return priorityNonPreemptive(processes);
    }
};

const priorityNonPreemptive = (processes) => {
    // Lower number = Higher priority (usually, but let's assume Higher Number = Higher Priority? 
    // Standard varies. Linux uses lower=higher. Windows uses higher=higher.
    // Let's assume Lower Number = Higher Priority (1 is highest, 10 is lowest) for now, OR let user decide?
    // Common academic textbooks often use Lower = Higher. 
    // Let's document: Lower Value = Higher Priority.

    let currentTime = 0;
    let completed = 0;
    const n = processes.length;
    const timeline = [];
    const resultProcesses = [];
    const isCompleted = new Array(n).fill(false);

    // Sort by arrival
    let sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (completed < n) {
        let idx = -1;
        let bestPriority = Infinity; // Lower is better

        for (let i = 0; i < n; i++) {
            if (!isCompleted[i] && sortedProcesses[i].arrivalTime <= currentTime) {
                if (sortedProcesses[i].priority < bestPriority) {
                    bestPriority = sortedProcesses[i].priority;
                    idx = i;
                } else if (sortedProcesses[i].priority === bestPriority) {
                    // FCFS for same priority
                    if (idx !== -1 && sortedProcesses[i].arrivalTime < sortedProcesses[idx].arrivalTime) {
                        idx = i;
                    } else if (idx === -1) {
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
            let nextArrival = Infinity;
            for (let i = 0; i < n; i++) {
                if (!isCompleted[i] && sortedProcesses[i].arrivalTime < nextArrival) {
                    nextArrival = sortedProcesses[i].arrivalTime;
                }
            }
            if (nextArrival === Infinity) break;

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

const priorityPreemptive = (processes) => {
    let currentTime = 0;
    let completed = 0;
    const n = processes.length;
    const timeline = [];
    const activeProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime, startTime: -1 }));
    let completedList = [];

    while (completed < n) {
        const available = activeProcesses.filter(p => p.arrivalTime <= currentTime && p.remainingTime > 0);

        let selected = null;
        if (available.length > 0) {
            // Lowest value priority is highest priority
            available.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime);
            selected = available[0];
        }

        if (selected) {
            const futureArrivals = activeProcesses.filter(p => p.arrivalTime > currentTime).sort((a, b) => a.arrivalTime - b.arrivalTime);
            const nextArrival = futureArrivals.length > 0 ? futureArrivals[0].arrivalTime : Infinity;

            let runTime = Math.min(selected.remainingTime, nextArrival - currentTime);

            if (selected.startTime === -1) {
                selected.startTime = currentTime;
            }

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

            if (nextArrival === Infinity) break;

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
