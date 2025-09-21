import React, { useMemo } from 'react';
import type { Bill, Vegetable } from '../../types/types';
import Card from './ui/Card.tsx';
import { ChartBarIcon, ShoppingBagIcon, CubeIcon } from './ui/Icon.tsx';

interface StatisticsProps {
    bills: Bill[];
    vegetables: Vegetable[];
}

const Statistics: React.FC<StatisticsProps> = ({ bills, vegetables }) => {
    const stats = useMemo(() => {
        const totalRevenue = bills.reduce((sum, bill) => sum + bill.total, 0);
        const totalOrders = bills.length;
        const lowStockItems = vegetables.filter(v => v.stockKg < 10).length;
        
        return { totalRevenue, totalOrders, lowStockItems };
    }, [bills, vegetables]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card 
                title="Total Revenue"
                value={`₹${stats.totalRevenue.toFixed(2)}`}
                icon={<ChartBarIcon className="h-8 w-8 text-primary-600" />}
            />
            <Card 
                title="Total Orders"
                value={stats.totalOrders.toString()}
                icon={<ShoppingBagIcon className="h-8 w-8 text-primary-600" />}
            />
            <Card 
                title="Low Stock Items"
                value={stats.lowStockItems.toString()}
                icon={<CubeIcon className="h-8 w-8 text-primary-600" />}
            />
        </div>
    );
};

export default Statistics;
