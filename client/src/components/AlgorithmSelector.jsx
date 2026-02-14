import React from 'react';

const AlgorithmSelector = ({ selected, onSelect }) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">Scheduling Algorithm</label>
            <select
                value={selected}
                onChange={(e) => onSelect(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="FCFS">First-Come, First-Served (FCFS)</option>
                <option value="SJF">Shortest Job First (Non-Preemptive)</option>
                <option value="SJF_P">Shortest Job First (Preemptive)</option>
                <option value="PRIORITY">Priority (Non-Preemptive)</option>
                <option value="PRIORITY_P">Priority (Preemptive)</option>
                <option value="RR">Round Robin</option>
            </select>
        </div>
    );
};

export default AlgorithmSelector;
