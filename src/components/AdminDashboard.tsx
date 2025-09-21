import React, { useState } from 'react';
import type { User, Bill, Vegetable } from '../../types/types';
import Sidebar from './Sidebar.tsx';
import AdminHeader from './AdminHeader.tsx';
import Dashboard from './Dashboard.tsx';
import Inventory from './Inventory.tsx';
import Orders from './Orders.tsx';
import Settings from './Settings.tsx';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  vegetables: Vegetable[];
  addVegetable: (newVegetable: Omit<Vegetable, 'id'>) => void;
  updateVegetable: (updatedVegetable: Vegetable) => void;
  deleteVegetable: (vegId: string) => void;
  bills: Bill[];
}

type AdminPage = 'dashboard' | 'inventory' | 'orders' | 'settings';

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [initialBillId, setInitialBillId] = useState<string | null>(null);

  const handleViewOrder = (billId: string) => {
    setInitialBillId(billId);
    setCurrentPage('orders');
  };

  const handleUpdateProfile = (profile: { name: string; email: string }) => {
    // Handle profile update logic here
    console.log('Profile updated:', profile);
    // You can add API calls or state updates here
  };

  const handleChangePassword = (passwords: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    // Handle password change logic here
    console.log('Password change requested');
    // You can add API calls or validation here
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard bills={props.bills} vegetables={props.vegetables} onViewOrder={handleViewOrder} />;
      case 'inventory':
        return <Inventory 
                  vegetables={props.vegetables} 
                  addVegetable={props.addVegetable} 
                  updateVegetable={props.updateVegetable}
                  deleteVegetable={props.deleteVegetable}
               />;
      case 'orders':
        return <Orders 
                  bills={props.bills} 
                  vegetables={props.vegetables} 
                  initialBillId={initialBillId} 
                  onClearInitialBill={() => setInitialBillId(null)}
               />;
      case 'settings':
        return <Settings 
                  user={props.user}
                  onUpdateProfile={handleUpdateProfile}
                  onChangePassword={handleChangePassword}
               />;
      default:
        return <Dashboard bills={props.bills} vegetables={props.vegetables} onViewOrder={handleViewOrder} />;
    }
  };

  const pageTitles: Record<AdminPage, string> = {
      dashboard: 'Dashboard',
      inventory: 'Inventory',
      orders: 'Order History',
      settings: 'Settings',
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Sidebar 
        user={props.user} 
        onLogout={props.onLogout} 
        currentPage={currentPage}
        setCurrentPage={(page) => {
            setCurrentPage(page);
            setSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} title={pageTitles[currentPage]} user={props.user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-4 sm:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;