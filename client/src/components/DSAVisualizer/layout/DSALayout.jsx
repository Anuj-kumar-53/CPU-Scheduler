import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, BarChart2, List, Network, ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import useVisualizerStore from '../store/useVisualizerStore';
import { motion } from 'framer-motion';

const SidebarItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`
        }
    >
        <Icon size={18} />
        <span>{label}</span>
    </NavLink>
);

const DSALayout = () => {
    const navigate = useNavigate();

    return (
        <div className="flex h-screen bg-zinc-950 text-white overflow-hidden selection:bg-indigo-500/30">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900/80 border-r border-white/5 flex flex-col z-20 backdrop-blur-xl">
                <button
                    onClick={() => navigate('/dsa')}
                    className="p-6 border-b border-white/5 flex items-center gap-3 w-full hover:bg-white/5 transition-colors cursor-pointer text-left"
                >
                    <div className="p-2 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg shadow-lg shadow-indigo-900/20">
                        <Network size={20} className="text-white" />
                    </div>
                    <h1 className="font-bold text-lg tracking-tight">DSA Viz</h1>
                </button>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    <div className="mb-4">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 px-4 py-2 w-full text-sm text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={16} /> Back to Home
                        </button>
                    </div>

                    <div className="px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 mt-6">Linear</div>
                    <SidebarItem to="/dsa/arrays" icon={List} label="Arrays" />
                    <SidebarItem to="/dsa/sorting" icon={BarChart2} label="Sorting" />
                    <SidebarItem to="/dsa/linked-list" icon={Network} label="Linked List" />
                    <SidebarItem to="/dsa/stack-queue" icon={List} label="Stack & Queue" />

                    <div className="px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 mt-6">Non-Linear</div>
                    <SidebarItem to="/dsa/trees" icon={Network} label="Trees (BST/AVL)" />
                    <SidebarItem to="/dsa/graphs" icon={Network} label="Graphs" />
                    <SidebarItem to="/dsa/heaps" icon={List} label="Heaps" />

                    <div className="px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 mt-6">Advanced</div>
                    <SidebarItem to="/dsa/dp" icon={List} label="Dynamic Prog." />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-zinc-950">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20"></div>

                <Outlet />
            </main>
        </div>
    );
};

export default DSALayout;
