export const mlfq = (processes) => {
    // MLFQ Strategy:
    // Q1: RR, TQ=2 (Highest)
    // Q2: RR, TQ=4 (Medium)
    // Q3: FCFS (Lowest)

    const tq1 = 2;
    const tq2 = 4;

    let currentTime = 0;
    const timeline = [];
    const resultProcesses = [];
    const n = processes.length;
    let completed = 0;

    const activeProcesses = processes.map(p => ({
        ...p,
        remainingTime: p.burstTime,
        startTime: -1,
        inQueue: false,
        priorityLevel: 1 // 1=Q1, 2=Q2, 3=Q3
    })).sort((a, b) => a.arrivalTime - b.arrivalTime);

    const q1 = [];
    const q2 = [];
    const q3 = [];

    const checkNewArrivals = (time) => {
        activeProcesses.forEach(p => {
            if (p.arrivalTime <= time && !p.inQueue && p.remainingTime > 0) {
                p.priorityLevel = 1;
                q1.push(p);
                p.inQueue = true;
            }
        });
    };

    checkNewArrivals(currentTime);

    while (completed < n) {
        if (q1.length === 0 && q2.length === 0 && q3.length === 0) {
            const remaining = activeProcesses.filter(p => !p.inQueue && p.remainingTime > 0);
            if (remaining.length === 0) break;

            const nextArrival = remaining.reduce((min, p) => Math.min(min, p.arrivalTime), Infinity);

            timeline.push({
                processId: null,
                startTime: currentTime,
                endTime: nextArrival
            });
            currentTime = nextArrival;
            checkNewArrivals(currentTime);
            continue;
        }

        if (q1.length > 0) {
            const p = q1.shift();
            if (p.startTime === -1) p.startTime = currentTime;

            const runTime = Math.min(p.remainingTime, tq1);

            timeline.push({
                processId: p.id,
                startTime: currentTime,
                endTime: currentTime + runTime,
                queueId: 1
            });

            currentTime += runTime;
            p.remainingTime -= runTime;

            checkNewArrivals(currentTime);

            if (p.remainingTime === 0) {
                completed++;
                p.completionTime = currentTime;
                p.turnaroundTime = p.completionTime - p.arrivalTime;
                p.waitingTime = p.turnaroundTime - p.burstTime;
                resultProcesses.push(p);
            } else {
                if (runTime === tq1) {
                    p.priorityLevel = 2;
                    q2.push(p);
                } else {
                    q1.push(p);
                }
            }
        }
        else if (q2.length > 0) {
            const p = q2.shift();
            if (p.startTime === -1) p.startTime = currentTime;

            const nextNewArrivals = activeProcesses.filter(proc => !proc.inQueue && proc.remainingTime > 0);
            const nextNewTime = nextNewArrivals.length > 0 ?
                nextNewArrivals.reduce((min, proc) => Math.min(min, proc.arrivalTime), Infinity) : Infinity;

            const maxRun = Math.min(p.remainingTime, tq2);
            const timeToNextArrival = nextNewTime - currentTime;

            const actualRun = Math.min(maxRun, timeToNextArrival);

            if (actualRun <= 0) {
                q2.unshift(p);
                checkNewArrivals(currentTime);
                continue;
            }

            timeline.push({
                processId: p.id,
                startTime: currentTime,
                endTime: currentTime + actualRun,
                queueId: 2
            });

            currentTime += actualRun;
            p.remainingTime -= actualRun;
            checkNewArrivals(currentTime);

            if (q1.length > 0) {
                q2.push(p);
            } else {
                if (p.remainingTime === 0) {
                    completed++;
                    p.completionTime = currentTime;
                    p.turnaroundTime = p.completionTime - p.arrivalTime;
                    p.waitingTime = p.turnaroundTime - p.burstTime;
                    resultProcesses.push(p);
                } else if (actualRun === tq2) {
                    p.priorityLevel = 3;
                    q3.push(p);
                } else {
                    q2.push(p);
                }
            }
        }
        else if (q3.length > 0) {
            const p = q3[0];
            if (p.startTime === -1) p.startTime = currentTime;

            const nextNewArrivals = activeProcesses.filter(proc => !proc.inQueue && proc.remainingTime > 0);
            const nextNewTime = nextNewArrivals.length > 0 ?
                nextNewArrivals.reduce((min, proc) => Math.min(min, proc.arrivalTime), Infinity) : Infinity;

            const runTime = Math.min(p.remainingTime, nextNewTime - currentTime);

            if (runTime <= 0) {
                checkNewArrivals(currentTime);
                continue;
            }

            timeline.push({
                processId: p.id,
                startTime: currentTime,
                endTime: currentTime + runTime,
                queueId: 3
            });

            currentTime += runTime;
            p.remainingTime -= runTime;
            checkNewArrivals(currentTime);

            if (q1.length > 0 || q2.length > 0) {
                // Preempted.
            } else {
                if (p.remainingTime === 0) {
                    q3.shift();
                    completed++;
                    p.completionTime = currentTime;
                    p.turnaroundTime = p.completionTime - p.arrivalTime;
                    p.waitingTime = p.turnaroundTime - p.burstTime;
                    resultProcesses.push(p);
                }
            }
        }
    }

    return { processes: resultProcesses, timeline };
};
