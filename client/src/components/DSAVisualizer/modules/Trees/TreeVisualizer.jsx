import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, RotateCcw, GitBranch } from 'lucide-react';

// Tree Node Class
class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// BST Operations
const insertNode = (root, value) => {
    if (!root) return new TreeNode(value);

    if (value < root.value) {
        root.left = insertNode(root.left, value);
    } else if (value > root.value) {
        root.right = insertNode(root.right, value);
    }
    return root;
};

const deleteNode = (root, value) => {
    if (!root) return null;

    if (value < root.value) {
        root.left = deleteNode(root.left, value);
    } else if (value > root.value) {
        root.right = deleteNode(root.right, value);
    } else {
        if (!root.left) return root.right;
        if (!root.right) return root.left;

        let minNode = root.right;
        while (minNode.left) minNode = minNode.left;
        root.value = minNode.value;
        root.right = deleteNode(root.right, minNode.value);
    }
    return root;
};

const inorderTraversal = (root, result = []) => {
    if (root) {
        inorderTraversal(root.left, result);
        result.push(root.value);
        inorderTraversal(root.right, result);
    }
    return result;
};

const preorderTraversal = (root, result = []) => {
    if (root) {
        result.push(root.value);
        preorderTraversal(root.left, result);
        preorderTraversal(root.right, result);
    }
    return result;
};

const postorderTraversal = (root, result = []) => {
    if (root) {
        postorderTraversal(root.left, result);
        postorderTraversal(root.right, result);
        result.push(root.value);
    }
    return result;
};

// Convert tree to visual nodes with positions and edges
const treeToNodes = (root, x = 400, y = 50, level = 0, offset = 200, parentId = null) => {
    if (!root) return { nodes: [], edges: [] };

    const nodeId = `${root.value}-${x}-${y}`;
    const nodes = [{ id: nodeId, value: root.value, x, y, level }];
    const edges = [];

    if (parentId) {
        edges.push({ from: parentId, to: nodeId });
    }

    const newOffset = offset / 2;

    if (root.left) {
        const leftResult = treeToNodes(root.left, x - offset, y + 80, level + 1, newOffset, nodeId);
        nodes.push(...leftResult.nodes);
        edges.push(...leftResult.edges);
    }
    if (root.right) {
        const rightResult = treeToNodes(root.right, x + offset, y + 80, level + 1, newOffset, nodeId);
        nodes.push(...rightResult.nodes);
        edges.push(...rightResult.edges);
    }

    return { nodes, edges };
};

const TreeVisualizer = () => {
    const [root, setRoot] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [deleteValue, setDeleteValue] = useState('');
    const [traversalResult, setTraversalResult] = useState([]);
    const [traversalType, setTraversalType] = useState('');

    useEffect(() => {
        // Initialize with sample tree
        let newRoot = null;
        [50, 30, 70, 20, 40, 60, 80].forEach(val => {
            newRoot = insertNode(newRoot, val);
        });
        setRoot(newRoot);
    }, []);

    const handleInsert = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) return;

        setRoot(insertNode(root, val));
        setInputValue('');
    };

    const handleDelete = () => {
        const val = parseInt(deleteValue);
        if (isNaN(val)) return;

        setRoot(deleteNode(root, val));
        setDeleteValue('');
    };

    const handleTraversal = (type) => {
        let result = [];
        if (type === 'inorder') result = inorderTraversal(root);
        else if (type === 'preorder') result = preorderTraversal(root);
        else if (type === 'postorder') result = postorderTraversal(root);

        setTraversalResult(result);
        setTraversalType(type);
        setTimeout(() => {
            setTraversalResult([]);
            setTraversalType('');
        }, 3000);
    };

    const handleReset = () => {
        let newRoot = null;
        [50, 30, 70, 20, 40, 60, 80].forEach(val => {
            newRoot = insertNode(newRoot, val);
        });
        setRoot(newRoot);
        setTraversalResult([]);
    };

    const { nodes, edges } = treeToNodes(root);

    return (
        <div className="flex flex-col h-full bg-zinc-950">
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-zinc-900/50">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <GitBranch size={24} className="text-indigo-400" />
                            Binary Search Tree
                        </h2>
                        <p className="text-xs text-zinc-500 font-mono mt-1">Insert: O(log n) • Delete: O(log n) • Search: O(log n)</p>
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
                {/* Insert */}
                <div className="flex items-center gap-2 bg-zinc-800/50 p-3 rounded-xl border border-white/5">
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                        placeholder="Value"
                        className="w-20 bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-indigo-500"
                    />
                    <button
                        onClick={handleInsert}
                        className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {/* Delete */}
                <div className="flex items-center gap-2 bg-zinc-800/50 p-3 rounded-xl border border-white/5">
                    <input
                        type="number"
                        value={deleteValue}
                        onChange={(e) => setDeleteValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleDelete()}
                        placeholder="Delete"
                        className="w-20 bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-red-500"
                    />
                    <button
                        onClick={handleDelete}
                        className="p-2 bg-red-600 hover:bg-red-500 rounded-lg text-white transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                {/* Traversals */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleTraversal('inorder')}
                        className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-white/5 rounded-lg text-xs font-bold text-zinc-300 transition-all"
                    >
                        Inorder
                    </button>
                    <button
                        onClick={() => handleTraversal('preorder')}
                        className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-white/5 rounded-lg text-xs font-bold text-zinc-300 transition-all"
                    >
                        Preorder
                    </button>
                    <button
                        onClick={() => handleTraversal('postorder')}
                        className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-white/5 rounded-lg text-xs font-bold text-zinc-300 transition-all"
                    >
                        Postorder
                    </button>
                </div>
            </div>

            {/* Traversal Result */}
            {traversalResult.length > 0 && (
                <div className="px-6 py-3 bg-indigo-500/10 border-b border-indigo-500/20">
                    <span className="text-xs text-indigo-400 font-bold uppercase mr-2">{traversalType}:</span>
                    <span className="text-sm text-white font-mono">[{traversalResult.join(', ')}]</span>
                </div>
            )}

            {/* Visualization */}
            <div className="flex-1 relative overflow-auto">
                <svg className="w-full h-full min-w-[800px] min-h-[600px]">
                    {/* Edges */}
                    {edges.map((edge, idx) => {
                        const fromNode = nodes.find(n => n.id === edge.from);
                        const toNode = nodes.find(n => n.id === edge.to);

                        if (!fromNode || !toNode) return null;

                        return (
                            <line
                                key={`edge-${idx}-${edge.from}-${edge.to}`}
                                x1={fromNode.x}
                                y1={fromNode.y}
                                x2={toNode.x}
                                y2={toNode.y}
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="2"
                            />
                        );
                    })}

                    {/* Nodes */}
                    <AnimatePresence>
                        {nodes.map((node) => (
                            <motion.g
                                key={node.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            >
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="24"
                                    fill="#27272a"
                                    stroke={node.level === 0 ? '#10b981' : '#6366f1'}
                                    strokeWidth="2"
                                />
                                <text
                                    x={node.x}
                                    y={node.y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="white"
                                    fontSize="16"
                                    fontWeight="bold"
                                >
                                    {node.value}
                                </text>
                            </motion.g>
                        ))}
                    </AnimatePresence>
                </svg>

                {!root && (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-600 font-mono text-sm">
                        Tree is empty
                    </div>
                )}
            </div>
        </div>
    );
};

export default TreeVisualizer;
