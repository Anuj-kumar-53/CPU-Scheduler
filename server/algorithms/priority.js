export const priority = (processes, preemptive = false) => {
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

    let completed = 0;
    let n = processes.length;
    let lastProcessId = null;

    while (completed < n) {
        const available = resultProcesses.filter(p => p.arrivalTime <= currentTime && p.remainingTime > 0);

        if (available.length === 0) {
            if (lastProcessId !== null) {
                timeline[timeline.length - 1].endTime = currentTime;
                lastProcessId = null;
            }
            currentTime++;
            continue;
        }

        // Lower value = Higher Priority
        available.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime);
        const currentProcess = available[0];

        if (currentProcess.id !== lastProcessId) {
            if (lastProcessId !== null) {
                timeline[timeline.length - 1].endTime = currentTime;
            }
            if (currentProcess.startTime === -1) {
                currentProcess.startTime = currentTime;
            }
            timeline.push({
                processId: currentProcess.id,
                startTime: currentTime,
                endTime: currentTime
            });
            lastProcessId = currentProcess.id;
        }

        if (preemptive) {
            currentProcess.remainingTime--;
            currentTime++;

            if (currentProcess.remainingTime === 0) {
                currentProcess.completionTime = currentTime;
                currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
                currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
                completed++;
                timeline[timeline.length - 1].endTime = currentTime;
                lastProcessId = null;
            }
        } else {
            const runDuration = currentProcess.remainingTime;
            currentTime += runDuration;
            currentProcess.remainingTime = 0;
            currentProcess.completionTime = currentTime;
            currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
            currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
            completed++;
            timeline[timeline.length - 1].endTime = currentTime;
            lastProcessId = null;
        }
    }

    return { processes: resultProcesses, timeline };
};
