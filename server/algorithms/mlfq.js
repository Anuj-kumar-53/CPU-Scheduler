export const mlfq = (processes) => {
    // MLFQ Strategy:
    // Q1: RR, TQ=2 (Highest)
    // Q2: RR, TQ=4 (Medium)
    // Q3: FCFS (Lowest)
    //
    // Rules:
    // 1. All NEW processes enter Q1.
    // 2. If blocked/yields, stays in same Q? (We assume CPU bound).
    // 3. If runTime == TQ, downgrade to next queue.
    // 4. Q1 > Q2 > Q3 (Strict Priority).
    // 5. Preemption: Higher queue arrival preempts lower queue execution.

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
            // Only add if not already in system (tracked by inQueue)
            if (p.arrivalTime <= time && !p.inQueue && p.remainingTime > 0) {
                // New arrivals ALWAYS go to Q1
                p.priorityLevel = 1;
                q1.push(p);
                p.inQueue = true;
            }
        });
    };

    checkNewArrivals(currentTime);

    while (completed < n) {
        // Idle check
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

        // Q1 Execution (RR TQ=2)
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
                // Used TQ, Demote to Q2
                if (runTime === tq1) {
                    p.priorityLevel = 2;
                    q2.push(p);
                } else {
                    // Preempted? (Not possible since we ran strictly), 
                    // or finished (handled above).
                    // Logic safety: if remaining > 0 and runTime < TQ, it implies...
                    // Wait, runTime = min(rem, tq). If rem < tq, then p finishes.
                    // So this else block is only for runTime == tq.
                    q1.push(p); // Should not happen given logic, but safe fallback
                }
            }
        }
        // Q2 Execution (RR TQ=4)
        else if (q2.length > 0) {
            // Can be preempted by Q1 arrival.
            const p = q2.shift();
            if (p.startTime === -1) p.startTime = currentTime;

            // Calculate max safe runtime before next Q1 arrival
            const nextNewArrivals = activeProcesses.filter(proc => !proc.inQueue && proc.remainingTime > 0);
            const nextNewTime = nextNewArrivals.length > 0 ?
                nextNewArrivals.reduce((min, proc) => Math.min(min, proc.arrivalTime), Infinity) : Infinity;

            // We perform the run in one go, but if runTime > (nextNewTime - currentTime), we must split/preempt.
            const maxRun = Math.min(p.remainingTime, tq2);
            const timeToNextArrival = nextNewTime - currentTime;

            const actualRun = Math.min(maxRun, timeToNextArrival);

            // If arrival is happening NOW
            if (actualRun <= 0) {
                q2.unshift(p); // Put back
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

            // Check preemption
            if (q1.length > 0) {
                // Preempted. Return to HEAD of Q2 or TAIL?
                // Standard: Preemption -> Tail of Ready Queue (for that level).
                q2.push(p);
            } else {
                if (p.remainingTime === 0) {
                    completed++;
                    p.completionTime = currentTime;
                    p.turnaroundTime = p.completionTime - p.arrivalTime;
                    p.waitingTime = p.turnaroundTime - p.burstTime;
                    resultProcesses.push(p);
                } else if (actualRun === tq2) {
                    // Used full quantum
                    p.priorityLevel = 3;
                    q3.push(p);
                } else {
                    // Ran partial quantum (due to preemption check that didn't trigger? or logic?)
                    // If we are here, q1 is empty. 
                    // If actualRun < maxRun, it means we stopped for an arrival.
                    // But if q1 is empty, the arrival didn't add to q1? (Maybe finished process?)
                    // Safe to push back to Q2 end.
                    q2.push(p);
                }
            }
        }
        // Q3 Execution (FCFS)
        else if (q3.length > 0) {
            const p = q3[0]; // Peek
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
                // Stays at head of Q3 (FCFS).
            } else {
                if (p.remainingTime === 0) {
                    q3.shift();
                    completed++;
                    p.completionTime = currentTime;
                    p.turnaroundTime = p.completionTime - p.arrivalTime;
                    p.waitingTime = p.turnaroundTime - p.burstTime;
                    resultProcesses.push(p);
                }
                // Else continue
            }
        }
    }

    return { processes: resultProcesses, timeline };
};
