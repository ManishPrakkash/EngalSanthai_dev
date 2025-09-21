import React from 'react';
import type { Bill } from '../../types/types';
import Button from './ui/Button.tsx';

interface RecentTransactionsProps {
  bills: Bill[];
  title?: string;
  onViewOrder: (billId: string) => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ bills, title = "All Transactions", onViewOrder }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3">Bill ID</th>
              <th scope="col" className="px-6 py-3">Customer</th>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3 text-right">Total</th>
              <th scope="col" className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
                <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-500">No transactions found.</td>
                </tr>
            ) : (
                bills.map((bill) => (
                <tr key={bill.id} className="bg-white border-b hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-xs text-slate-700">{bill.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{bill.customerName}</td>
                    <td className="px-6 py-4">{new Date(bill.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-800">
                        ₹{bill.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                        <Button onClick={() => onViewOrder(bill.id)} className="px-3 py-1 text-xs">
                           View
                        </Button>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;