import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DSALayout from './layout/DSALayout';
import DSAWelcome from './components/DSAWelcome';
import SortingVisualizer from './modules/Sorting/SortingVisualizer';
import LinkedListVisualizer from './modules/LinkedList/LinkedListVisualizer';
import ArrayVisualizer from './modules/Arrays/ArrayVisualizer';
import StackVisualizer from './modules/Stack/StackVisualizer';
import QueueVisualizer from './modules/Queue/QueueVisualizer';
import TreeVisualizer from './modules/Trees/TreeVisualizer';
import GraphVisualizer from './modules/Graphs/GraphVisualizer';
import HeapVisualizer from './modules/Heaps/HeapVisualizer';
import DPVisualizer from './modules/DP/DPVisualizer';

const DSAVisualizer = () => {
    return (
        <Routes>
            <Route element={<DSALayout />}>
                <Route index element={<DSAWelcome />} />
                <Route path="sorting" element={<SortingVisualizer />} />
                <Route path="arrays" element={<ArrayVisualizer />} />
                <Route path="linked-list" element={<LinkedListVisualizer />} />
                <Route path="stack-queue" element={
                    <div className="flex h-full">
                        <div className="flex-1 border-r border-white/5"><StackVisualizer /></div>
                        <div className="flex-1"><QueueVisualizer /></div>
                    </div>
                } />
                <Route path="trees" element={<TreeVisualizer />} />
                <Route path="graphs" element={<GraphVisualizer />} />
                <Route path="heaps" element={<HeapVisualizer />} />
                <Route path="dp" element={<DPVisualizer />} />
            </Route>
        </Routes>
    );
};

export default DSAVisualizer;
