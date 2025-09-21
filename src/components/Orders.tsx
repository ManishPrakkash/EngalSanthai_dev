import React, { useState, useMemo, useEffect } from 'react';
import type { Bill, Vegetable } from '../../types/types';
import { MagnifyingGlassIcon, DocumentMagnifyingGlassIcon } from './ui/Icon.tsx';
import BillDetailModal from './BillDetailModal.tsx';

interface OrdersProps {
  bills: Bill[];
  vegetables: Vegetable[];
  initialBillId?: string | null;
  onClearInitialBill: () => void;
}

const Orders: React.FC<OrdersProps> = ({ bills, vegetables, initialBillId, onClearInitialBill }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingBill, setViewingBill] = useState<Bill | null>(null);
  
  const vegetableMap = useMemo(() => new Map(vegetables.map(v => [v.id, v])), [vegetables]);

  const filteredBills = useMemo(() => {
    if (!searchTerm) return bills;
    return bills.filter(bill =>
      bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bills, searchTerm]);

  useEffect(() => {
    if (initialBillId) {
      const billToView = bills.find(b => b.id === initialBillId);
      if (billToView) {
        setViewingBill(billToView);
      }
      onClearInitialBill();
    }
  }, [initialBillId, bills, onClearInitialBill]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Order History</h1>
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <input
            type="text"
            placeholder="Search by customer or Bill ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full sm:w-64 rounded-md border-slate-300 bg-white pl-10 py-2 text-slate-900 focus:ring-primary-500 focus:border-primary-500"
            />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3">Bill ID</th>
                <th scope="col" className="px-6 py-3">Customer</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3 text-right">Total</th>
                <th scope="col" className="px-6 py-3 text-center">View Bill</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.length === 0 ? (
                  <tr>
                      <td colSpan={5} className="text-center py-10 text-slate-500">No transactions found.</td>
                  </tr>
              ) : (
                  filteredBills.map((bill) => (
                  <tr key={bill.id} className="bg-white border-b hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-xs text-slate-700">{bill.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{bill.customerName}</td>
                      <td className="px-6 py-4">{new Date(bill.date).toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-800">
                          ₹{bill.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                            onClick={() => setViewingBill(bill)}
                            className="p-2 text-slate-500 hover:text-primary-600 rounded-full hover:bg-slate-100"
                        >
                            <DocumentMagnifyingGlassIcon className="h-5 w-5" />
                        </button>
                      </td>
                  </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <BillDetailModal 
        isOpen={!!viewingBill} 
        onClose={() => setViewingBill(null)} 
        bill={viewingBill}
        vegetableMap={vegetableMap}
      />
    </div>
  );
};

export default Orders;