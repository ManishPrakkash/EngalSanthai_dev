import React from 'react';
import Statistics from './Statistics.tsx';
import RecentTransactions from './RecentTransactions.tsx';
import type { Bill, Vegetable } from '../../types/types';

interface DashboardProps {
    bills: Bill[];
    vegetables: Vegetable[];
    onViewOrder: (billId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ bills, vegetables, onViewOrder }) => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <Statistics bills={bills} vegetables={vegetables} />
            <RecentTransactions 
                bills={bills.slice(0, 7)} 
                title="Recent Transactions"
                onViewOrder={onViewOrder}
            />
        </div>
    );
};

export default Dashboard;