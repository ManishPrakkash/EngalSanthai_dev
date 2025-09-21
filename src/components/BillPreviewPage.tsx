
import React, { useMemo } from 'react';
import type { Bill, Vegetable } from '../../types/types';
import Button from './ui/Button.tsx';
import { ArrowDownTrayIcon, CheckCircleIcon } from './ui/Icon.tsx';

// Let TypeScript know that jspdf is available on the window object
declare global {
    interface Window {
        jspdf: any;
    }
}

interface BillPreviewPageProps {
  bill: Bill;
  vegetables: Vegetable[];
  onLogout: () => void;
}

const BillPreviewPage: React.FC<BillPreviewPageProps> = ({ bill, vegetables, onLogout }) => {
    const vegetableMap = useMemo(() => new Map(vegetables.map(v => [v.id, v])), [vegetables]);

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
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center">
                <CheckCircleIcon className="h-16 w-16 text-primary-500 mx-auto" />
                <h1 className="mt-4 text-2xl font-bold text-slate-800">Order Placed Successfully!</h1>
                <p className="text-slate-500 mt-2">Your receipt is ready to be downloaded.</p>

                <div className="mt-8 space-y-3">
                     <Button onClick={handleDownload} className="w-full bg-slate-600 hover:bg-slate-700">
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                        Download Bill (PDF)
                    </Button>
                    <Button onClick={onLogout} size="lg" className="w-full">
                        Place Another Order
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BillPreviewPage;