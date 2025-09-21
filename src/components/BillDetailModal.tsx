import React from 'react';
import type { Bill, Vegetable } from '../../types/types';
import { XMarkIcon, EyeIcon, ArrowDownTrayIcon } from './ui/Icon.tsx';
import ImagePreviewModal from './ui/ImagePreviewModal.tsx';
import Button from './ui/Button.tsx';

// Let TypeScript know that jspdf is available on the window object
declare global {
    interface Window {
        jspdf: any;
    }
}

interface BillDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill | null;
  vegetableMap: Map<string, Vegetable>;
}

const BillDetailModal: React.FC<BillDetailModalProps> = ({ isOpen, onClose, bill, vegetableMap }) => {
  const [isImagePreviewOpen, setIsImagePreviewOpen] = React.useState(false);
  
  if (!isOpen || !bill) return null;

  const handleDownload = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const centerX = doc.internal.pageSize.getWidth() / 2;
    let y = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Engal Santhai', centerX, y, { align: 'center' });
    y += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Your Fresh Vegetable Partner', centerX, y, { align: 'center' });
    y += 15;
    
    // Bill Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 14, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(`Bill ID: ${bill.id}`, 14, y);
    doc.text(`Date: ${new Date(bill.date).toLocaleString()}`, doc.internal.pageSize.getWidth() - 14, y, { align: 'right' });
    y += 6;
    doc.text(`Customer: ${bill.customerName}`, 14, y);
    y += 10;
    
    // Table Header
    doc.setDrawColor(150); // a light grey
    doc.line(14, y, doc.internal.pageSize.getWidth() - 14, y); // top line
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Item', 16, y);
    doc.text('Qty (kg)', 110, y, { align: 'right' });
    doc.text('Rate (Rs.)', 150, y, { align: 'right' });
    doc.text('Amount (Rs.)', 195, y, { align: 'right' });
    y += 2;
    doc.line(14, y, doc.internal.pageSize.getWidth() - 14, y); // bottom line
    y += 8;

    // Table Items
    doc.setFont('courier', 'normal');
    bill.items.forEach(item => {
        const vegetable = vegetableMap.get(item.vegetableId);
        const name = vegetable?.name || 'Unknown Item';
        const qty = item.quantityKg.toFixed(2);
        const rate = (vegetable?.pricePerKg || 0).toFixed(2);
        const amount = item.subtotal.toFixed(2);

        doc.text(name, 16, y);
        doc.text(qty, 110, y, { align: 'right' });
        doc.text(rate, 150, y, { align: 'right' });
        doc.text(amount, 195, y, { align: 'right' });
        y += 7;
    });

    // Total
    const totalY = y + 5;
    doc.line(120, totalY, doc.internal.pageSize.getWidth() - 14, totalY);
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('TOTAL:', 122, y);
    doc.text(`Rs. ${bill.total.toFixed(2)}`, 195, y, { align: 'right' });
    
    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for your purchase!', centerX, footerY, { align: 'center' });

    // Save the PDF
    doc.save(`EngalSanthai-Bill-${bill.id}.pdf`);
};

  return (
    <>
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in-down"
    >
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-slate-50 rounded-t-lg">
            <h2 className="text-xl font-bold text-slate-800">Bill Details</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200">
                <XMarkIcon className="h-6 w-6 text-slate-600" />
            </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <p className="text-sm text-slate-500">Bill ID</p>
                    <p className="font-mono text-sm text-slate-800">{bill.id}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500">Customer</p>
                    <p className="font-semibold text-slate-800">{bill.customerName}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500">Date</p>
                    <p className="font-semibold text-slate-800">{new Date(bill.date).toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500">Payment Screenshot</p>
                    {bill.paymentScreenshot ? (
                        <button 
                            onClick={() => setIsImagePreviewOpen(true)} 
                            className="text-sm font-semibold text-primary-600 hover:underline flex items-center"
                        >
                            <EyeIcon className="h-4 w-4 mr-1"/> View Screenshot
                        </button>
                    ) : (
                        <p className="text-sm text-slate-400">Not provided</p>
                    )}
                </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
                 <h3 className="text-lg font-bold text-slate-800 mb-2">Order Items</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-4 py-2">Item</th>
                            <th scope="col" className="px-4 py-2 text-right">Qty (kg)</th>
                            <th scope="col" className="px-4 py-2 text-right">Rate</th>
                            <th scope="col" className="px-4 py-2 text-right">Subtotal</th>
                        </tr>
                        </thead>
                        <tbody>
                            {bill.items.map((item, index) => {
                                const vegetable = vegetableMap.get(item.vegetableId);
                                return (
                                    <tr key={index} className="bg-white border-b last:border-0">
                                        <td className="px-4 py-3 font-medium text-slate-900">
                                            {vegetable?.icon} {vegetable?.name || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-right">{item.quantityKg.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right">₹{vegetable?.pricePerKg.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right font-semibold">₹{item.subtotal.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                 </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
                <Button onClick={handleDownload} className="bg-slate-600 hover:bg-slate-700">
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    Download Bill
                </Button>
                <div className="text-right">
                    <p className="text-sm text-slate-500">Total Amount</p>
                    <p className="text-2xl font-bold text-slate-800">₹{bill.total.toFixed(2)}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
    <ImagePreviewModal 
        isOpen={isImagePreviewOpen} 
        onClose={() => setIsImagePreviewOpen(false)} 
        imageUrl={bill.paymentScreenshot || ''} 
    />
    </>
  );
};

export default BillDetailModal;