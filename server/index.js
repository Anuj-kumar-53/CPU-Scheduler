import express from 'express';
import cors from 'cors';
import { fcfs } from './algorithms/fcfs.js';
import { sjf } from './algorithms/sjf.js';
import { priority } from './algorithms/priority.js';
import { rr } from './algorithms/rr.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/simulate', (req, res) => {
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
        default:
            return res.status(400).json({ error: 'Invalid algorithm selected' });
    }

    // Calculate Averages
    const totalWaiting = result.processes.reduce((sum, p) => sum + p.waitingTime, 0);
    const totalTurnaround = result.processes.reduce((sum, p) => sum + p.turnaroundTime, 0);
    const avgWaiting = totalWaiting / result.processes.length;
    const avgTurnaround = totalTurnaround / result.processes.length;

    // CPU Utilization (Total Burst / Max Completion Time)
    // Actually CPU Utilization = (Total Busy Time / Total Time) * 100
    // Total Busy Time = Sum of burst times
    // Total Time = Max Completion Time - First Arrival Time (or 0?) usually 0 to max completion? or First Arrival?
    // Depends on definition. Usually "Total time the CPU was busy" vs "Total time elapsed".
    // If CPU was idle between 0 and first arrival, that counts as idle.
    // Let's use 0 to Last Completion Time.

    const maxCompletion = Math.max(...result.processes.map(p => p.completionTime));
    const minArrival = Math.min(...result.processes.map(p => p.arrivalTime));
    const totalBurst = result.processes.reduce((sum, p) => sum + p.burstTime, 0);

    // Utilization over the specific tracking period [minArrival, maxCompletion] or [0, maxCompletion]?
    // Standard is usually over the period of activity.
    // Let's use [0, maxCompletion] if we assume system starts at 0.
    const cpuUtilization = (totalBurst / maxCompletion) * 100;

    res.json({
        ...result,
        metrics: {
            avgWaiting,
            avgTurnaround,
            cpuUtilization
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
