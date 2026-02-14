export const mlq = (processes) => {
    // MLQ Strategy:
    // Queue 1: Priority 1-5 (High Priority) -> Round Robin (TQ=2)
    // Queue 2: Priority > 5 (Low Priority)  -> FCFS
    // 
    // Rules:
    // 1. Q1 has absolute priority over Q2. If Q1 is not empty, Q2 processes cannot run.
    // 2. Preemption: If a process arrives for Q1 while Q2 is running, Q2 is preempted immediately.

    let currentTime = 0;
    const timeline = [];
    const resultProcesses = [];
    const n = processes.length;
    let completed = 0;
    const tq1 = 2;

    // Deep copy and sorting
    // Lower priority number = Higher priority
    const activeProcesses = processes.map(p => ({
        ...p,
        remainingTime: p.burstTime,
        startTime: -1,
        inQueue: false
    })).sort((a, b) => a.arrivalTime - b.arrivalTime);

    const q1 = []; // RR
    const q2 = []; // FCFS

    // Helper to add new arrivals to queues
    const checkNewArrivals = (time) => {
        activeProcesses.forEach(p => {
            if (p.arrivalTime <= time && p.remainingTime > 0 && !p.inQueue) {
                if (p.priority <= 5) {
                    q1.push(p);
                } else {
                    q2.push(p);
                }
                p.inQueue = true;
            }
        });
    };

    checkNewArrivals(currentTime);

    while (completed < n) {
        // If both queues empty, jump to next arrival
        if (q1.length === 0 && q2.length === 0) {
            const remaining = activeProcesses.filter(p => !p.inQueue && p.remainingTime > 0);
            if (remaining.length === 0) break;

            // Find nearest arrival
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
            // Run Q1 (RR)
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
                q1.push(p);
            }

        } else if (q2.length > 0) {
            // Run Q2 (FCFS)
            // CRITICAL: Can be preempted by Q1 arrival.
            const p = q2[0]; // Peek

            if (p.startTime === -1) p.startTime = currentTime;

            // Calculate when the NEXT Q1 process arrives
            const nextQ1Arrivals = activeProcesses
                .filter(proc => !proc.inQueue && proc.priority <= 5 && proc.remainingTime > 0)
                .sort((a, b) => a.arrivalTime - b.arrivalTime);

            const nextQ1Time = nextQ1Arrivals.length > 0 ? nextQ1Arrivals[0].arrivalTime : Infinity;

            // Run until completion OR next Q1 arrival
            const runTime = Math.min(p.remainingTime, nextQ1Time - currentTime);

            // If runTime is 0, it means a Q1 process just arrived or is about to.
            if (runTime <= 0) {
                checkNewArrivals(currentTime);
                continue; // Loop will catch q1 change
            }

            timeline.push({
                processId: p.id,
                startTime: currentTime,
                endTime: currentTime + runTime,
                queueId: 2
            });

            currentTime += runTime;
            p.remainingTime -= runTime;

            checkNewArrivals(currentTime);

            // If Q1 has items now, we stop Q2 processing (Preempted)
            if (q1.length > 0) {
                // Preempted. p stays at head of q2.
                // Do nothing.
            } else {
                if (p.remainingTime === 0) {
                    q2.shift(); // Remove completed
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
