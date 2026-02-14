export const rr = (processes, timeQuantum) => {
    let currentTime = 0;
    const timeline = [];
    const resultProcesses = processes.map(p => ({
        ...p,
        remainingTime: p.burstTime,
        waitingTime: 0,
        turnaroundTime: 0,
        completionTime: 0,
        startTime: -1
    }));

    let queue = [];
    let completed = 0;
    let n = processes.length;

    // Sort by arrival initially
    let sortedProcesses = [...resultProcesses].sort((a, b) => a.arrivalTime - b.arrivalTime);
    let processIdx = 0;

    // Add first process(es) that arrived at time 0
    while (processIdx < n && sortedProcesses[processIdx].arrivalTime <= currentTime) {
        queue.push(sortedProcesses[processIdx]);
        processIdx++;
    }

    while (completed < n) {
        if (queue.length === 0) {
            currentTime++;
            // Check for new arrivals
            while (processIdx < n && sortedProcesses[processIdx].arrivalTime <= currentTime) {
                queue.push(sortedProcesses[processIdx]);
                processIdx++;
            }
            continue;
        }

        const currentProcess = queue.shift();

        if (currentProcess.startTime === -1) {
            currentProcess.startTime = currentTime;
        }

        const runDuration = Math.min(currentProcess.remainingTime, timeQuantum);

        timeline.push({
            processId: currentProcess.id,
            startTime: currentTime,
            endTime: currentTime + runDuration
        });

        // Advance time incrementally to catch arrivals during the quantum
        for (let i = 0; i < runDuration; i++) {
            currentTime++;
            while (processIdx < n && sortedProcesses[processIdx].arrivalTime === currentTime) {
                queue.push(sortedProcesses[processIdx]);
                processIdx++;
            }
        }

        currentProcess.remainingTime -= runDuration;

        if (currentProcess.remainingTime === 0) {
            currentProcess.completionTime = currentTime;
            currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
            currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
            completed++;
        } else {
            queue.push(currentProcess);
        }
    }

    return { processes: resultProcesses, timeline };
};
