import { fcfs } from '../algorithms/fcfs.js';
import { sjf } from '../algorithms/sjf.js';
import { priority } from '../algorithms/priority.js';
import { rr } from '../algorithms/rr.js';
import { mlq } from '../algorithms/mlq.js';
import { mlfq } from '../algorithms/mlfq.js';

export const simulateScheduler = (req, res) => {
    const { algorithm, processes, timeQuantum } = req.body;

    if (!processes || !Array.isArray(processes)) {
        return res.status(400).json({ error: 'Invalid processes input' });
    }

    // Convert string inputs to numbers if necessary
    const parsedProcesses = processes.map(p => ({
        ...p,
        id: Number(p.id) || p.id,
        arrivalTime: Number(p.arrivalTime),
        burstTime: Number(p.burstTime),
        priority: Number(p.priority) || 0
    }));

    let result;

    switch (algorithm) {
        case 'FCFS':
            result = fcfs(parsedProcesses);
            break;
        case 'SJF':
            result = sjf(parsedProcesses, false); // Non-preemptive
            break;
        case 'SJF_P':
            result = sjf(parsedProcesses, true); // Preemptive
            break;
        case 'PRIORITY':
            result = priority(parsedProcesses, false); // Non-preemptive
            break;
        case 'PRIORITY_P':
            result = priority(parsedProcesses, true); // Preemptive
            break;
        case 'RR':
            if (!timeQuantum || Number(timeQuantum) <= 0) {
                return res.status(400).json({ error: 'Invalid time quantum' });
            }
            result = rr(parsedProcesses, Number(timeQuantum));
            break;
        case 'MLQ':
            result = mlq(parsedProcesses);
            break;
        case 'MLFQ':
            result = mlfq(parsedProcesses);
            break;
        default:
            return res.status(400).json({ error: 'Invalid algorithm selected' });
    }

    // Calculate Averages
    const totalWaiting = result.processes.reduce((sum, p) => sum + p.waitingTime, 0);
    const totalTurnaround = result.processes.reduce((sum, p) => sum + p.turnaroundTime, 0);
    const avgWaiting = totalWaiting / result.processes.length;
    const avgTurnaround = totalTurnaround / result.processes.length;

    const maxCompletion = Math.max(...result.processes.map(p => p.completionTime));
    const totalBurst = result.processes.reduce((sum, p) => sum + p.burstTime, 0);

    const cpuUtilization = (totalBurst / maxCompletion) * 100;

    res.json({
        ...result,
        metrics: {
            avgWaiting,
            avgTurnaround,
            cpuUtilization
        }
    });
};
