import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Network, Plus } from 'lucide-react';

const GraphVisualizer = () => {
    const [nodes, setNodes] = useState([
        { id: 0, x: 200, y: 100, label: '0' },
        { id: 1, x: 400, y: 100, label: '1' },
        { id: 2, x: 300, y: 250, label: '2' },
        { id: 3, x: 500, y: 250, label: '3' },
        { id: 4, x: 400, y: 400, label: '4' }
    ]);

    const [edges, setEdges] = useState([
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 4 },
        { from: 3, to: 4 }
    ]);

    const [visited, setVisited] = useState([]);
    const [current, setCurrent] = useState(null);
    const [algorithm, setAlgorithm] = useState('');

    const [newNodeLabel, setNewNodeLabel] = useState('');
    const [edgeFrom, setEdgeFrom] = useState('');
    const [edgeTo, setEdgeTo] = useState('');

    // Build adjacency list from edges
    const buildGraph = () => {
        const graph = {};
        nodes.forEach(node => {
            graph[node.id] = [];
        });
        edges.forEach(edge => {
            if (graph[edge.from]) graph[edge.from].push(edge.to);
        });
        return graph;
    };

    const bfs = async (start) => {
        const graph = buildGraph();
        setAlgorithm('BFS');
        const visitedNodes = [];
        const queue = [start];
        const seen = new Set([start]);

        while (queue.length > 0) {
            const node = queue.shift();
            setCurrent(node);
            await new Promise(resolve => setTimeout(resolve, 800));

            visitedNodes.push(node);
            setVisited([...visitedNodes]);

            const neighbors = graph[node] || [];
            for (const neighbor of neighbors) {
                if (!seen.has(neighbor)) {
                    seen.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }

        setCurrent(null);
        setTimeout(() => {
            setVisited([]);
            setAlgorithm('');
        }, 2000);
    };

    const dfs = async (start, visitedNodes = [], seen = new Set()) => {
        const graph = buildGraph();
        if (visitedNodes.length === 0) setAlgorithm('DFS');

        seen.add(start);
        setCurrent(start);
        await new Promise(resolve => setTimeout(resolve, 800));

        visitedNodes.push(start);
        setVisited([...visitedNodes]);

        const neighbors = graph[start] || [];
        for (const neighbor of neighbors) {
            if (!seen.has(neighbor)) {
                await dfs(neighbor, visitedNodes, seen);
            }
        }

        if (visitedNodes.length === nodes.length) {
            setCurrent(null);
            setTimeout(() => {
                setVisited([]);
                setAlgorithm('');
            }, 2000);
        }
    };

    const handleAddNode = () => {
        if (!newNodeLabel.trim()) return;

        const newId = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 0;
        const newNode = {
            id: newId,
            x: 300 + Math.random() * 200,
            y: 150 + Math.random() * 200,
            label: newNodeLabel
        };

        setNodes([...nodes, newNode]);
        setNewNodeLabel('');
    };

    const handleAddEdge = () => {
        // Try to parse as numbers first (IDs)
        let fromId = parseInt(edgeFrom);
        let toId = parseInt(edgeTo);

        // If not numbers, try to find by label
        if (isNaN(fromId)) {
            const fromNode = nodes.find(n => n.label === edgeFrom.trim());
            if (fromNode) fromId = fromNode.id;
        }

        if (isNaN(toId)) {
            const toNode = nodes.find(n => n.label === edgeTo.trim());
            if (toNode) toId = toNode.id;
        }

        // Validation
        if (isNaN(fromId) || isNaN(toId)) {
            alert('Invalid node IDs or labels. Please enter valid node IDs or labels.');
            return;
        }

        if (!nodes.find(n => n.id === fromId)) {
            alert(`Node with ID/label "${edgeFrom}" not found`);
            return;
        }

        if (!nodes.find(n => n.id === toId)) {
            alert(`Node with ID/label "${edgeTo}" not found`);
            return;
        }

        if (edges.find(e => e.from === fromId && e.to === toId)) {
            alert('Edge already exists');
            return;
        }

        setEdges([...edges, { from: fromId, to: toId }]);
        setEdgeFrom('');
        setEdgeTo('');
    };

    const handleDeleteNode = (id) => {
        setNodes(nodes.filter(n => n.id !== id));
        setEdges(edges.filter(e => e.from !== id && e.to !== id));
    };

    const handleReset = () => {
        setNodes([
            { id: 0, x: 200, y: 100, label: '0' },
            { id: 1, x: 400, y: 100, label: '1' },
            { id: 2, x: 300, y: 250, label: '2' },
            { id: 3, x: 500, y: 250, label: '3' },
            { id: 4, x: 400, y: 400, label: '4' }
        ]);
        setEdges([
            { from: 0, to: 1 },
            { from: 0, to: 2 },
            { from: 1, to: 2 },
            { from: 1, to: 3 },
            { from: 2, to: 4 },
            { from: 3, to: 4 }
        ]);
        setVisited([]);
        setCurrent(null);
        setAlgorithm('');
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950">
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-zinc-900/50">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Network size={24} className="text-indigo-400" />
                            Graph Traversal
                        </h2>
                        <p className="text-xs text-zinc-500 font-mono mt-1">BFS: O(V+E) • DFS: O(V+E)</p>
                    </div>
                    <button
                        onClick={handleReset}
                        className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="p-6 border-b border-white/5 bg-zinc-900/30 flex flex-wrap gap-4">
                {/* Add Node */}
                <div className="flex items-center gap-2 bg-zinc-800/50 p-3 rounded-xl border border-white/5">
                    <input
                        type="text"
                        value={newNodeLabel}
                        onChange={(e) => setNewNodeLabel(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddNode()}
                        placeholder="Node Label"
                        className="w-24 bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-indigo-500"
                    />
                    <button
                        onClick={handleAddNode}
                        className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors"
                        title="Add Node"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {/* Add Edge */}
                <div className="flex items-center gap-2 bg-zinc-800/50 p-3 rounded-xl border border-white/5">
                    <input
                        type="text"
                        value={edgeFrom}
                        onChange={(e) => setEdgeFrom(e.target.value)}
                        placeholder="From (ID/Label)"
                        className="w-28 bg-zinc-950 border border-white/10 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-emerald-500"
                    />
                    <span className="text-zinc-600">→</span>
                    <input
                        type="text"
                        value={edgeTo}
                        onChange={(e) => setEdgeTo(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddEdge()}
                        placeholder="To (ID/Label)"
                        className="w-28 bg-zinc-950 border border-white/10 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-emerald-500"
                    />
                    <button
                        onClick={handleAddEdge}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white text-xs font-bold transition-colors"
                    >
                        Add Edge
                    </button>
                </div>

                {/* Algorithms */}
                <button
                    onClick={() => bfs(0)}
                    disabled={algorithm !== '' || nodes.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-lg text-white transition-colors"
                >
                    <Play size={16} /> BFS
                </button>
                <button
                    onClick={() => dfs(0)}
                    disabled={algorithm !== '' || nodes.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-lg text-white transition-colors"
                >
                    <Play size={16} /> DFS
                </button>
            </div>

            {/* Algorithm Status */}
            {algorithm && (
                <div className="px-6 py-3 bg-indigo-500/10 border-b border-indigo-500/20">
                    <span className="text-xs text-indigo-400 font-bold uppercase mr-2">Running {algorithm}:</span>
                    <span className="text-sm text-white font-mono">Visited: [{visited.join(', ')}]</span>
                </div>
            )}

            {/* Visualization */}
            <div className="flex-1 relative overflow-auto">
                <svg className="w-full h-full min-w-[700px] min-h-[500px]">
                    {/* Edges */}
                    {edges.map((edge, idx) => {
                        const fromNode = nodes.find(n => n.id === edge.from);
                        const toNode = nodes.find(n => n.id === edge.to);

                        if (!fromNode || !toNode) return null;

                        return (
                            <line
                                key={`edge-${idx}`}
                                x1={fromNode.x}
                                y1={fromNode.y}
                                x2={toNode.x}
                                y2={toNode.y}
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="2"
                                markerEnd="url(#arrowhead)"
                            />
                        );
                    })}

                    {/* Arrow marker */}
                    <defs>
                        <marker
                            id="arrowhead"
                            markerWidth="10"
                            markerHeight="10"
                            refX="9"
                            refY="3"
                            orient="auto"
                        >
                            <polygon points="0 0, 10 3, 0 6" fill="rgba(255,255,255,0.2)" />
                        </marker>
                    </defs>

                    {/* Nodes */}
                    {nodes.map(node => {
                        const isVisited = visited.includes(node.id);
                        const isCurrent = current === node.id;

                        return (
                            <g key={`node-${node.id}`}>
                                <motion.circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="30"
                                    fill={isCurrent ? '#6366f1' : isVisited ? '#10b981' : '#27272a'}
                                    stroke={isCurrent ? '#818cf8' : isVisited ? '#34d399' : 'rgba(255,255,255,0.2)'}
                                    strokeWidth="3"
                                    animate={{
                                        scale: isCurrent ? 1.2 : 1
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    style={{ cursor: 'pointer' }}
                                />
                                <text
                                    x={node.x}
                                    y={node.y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="white"
                                    fontSize="18"
                                    fontWeight="bold"
                                    style={{ pointerEvents: 'none' }}
                                >
                                    {node.label}
                                </text>
                                <g
                                    onClick={() => handleDeleteNode(node.id)}
                                    style={{ cursor: 'pointer' }}
                                    opacity="0"
                                    className="hover:opacity-100 transition-opacity"
                                >
                                    <circle
                                        cx={node.x + 25}
                                        cy={node.y - 25}
                                        r="12"
                                        fill="#dc2626"
                                    />
                                    <text
                                        x={node.x + 25}
                                        y={node.y - 25}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill="white"
                                        fontSize="14"
                                        fontWeight="bold"
                                    >
                                        ×
                                    </text>
                                </g>
                            </g>
                        );
                    })}
                </svg>

                {nodes.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-600 font-mono text-sm">
                        Add nodes to build your graph
                    </div>
                )}
            </div>
        </div>
    );
};

export default GraphVisualizer;
