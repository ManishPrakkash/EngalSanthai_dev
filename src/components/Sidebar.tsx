import React from 'react';
import type { User } from'../../types/types';
import { HomeIcon, CubeIcon, ShoppingCartIcon, LogoutIcon, XMarkIcon, CogIcon } from './ui/Icon.tsx';

type AdminPage = 'dashboard' | 'inventory' | 'orders' | 'settings';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  currentPage: AdminPage;
  setCurrentPage: (page: AdminPage) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  const navItems: { id: AdminPage; name: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', name: 'Dashboard', icon: <HomeIcon className="h-6 w-6" /> },
    { id: 'inventory', name: 'Inventory', icon: <CubeIcon className="h-6 w-6" /> },
    { id: 'orders', name: 'Orders', icon: <ShoppingCartIcon className="h-6 w-6" /> },
    { id: 'settings', name: 'Settings', icon: <CogIcon className="h-6 w-6" /> },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between h-16 px-4 border-b border-primary-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          🥬 Engal Santhai
        </h1>
        <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-primary-200 hover:text-white">
            <XMarkIcon className="h-6 w-6"/>
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map(item => (
          <a
            key={item.name}
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentPage(item.id); }}
            className={`flex items-center px-4 py-2.5 text-base font-semibold rounded-lg transition-colors duration-200 ${
              currentPage === item.id
                ? 'bg-primary-700 text-white'
                : 'text-primary-100 hover:bg-primary-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="ml-4">{item.name}</span>
          </a>
        ))}
      </nav>
      <div className="px-2 py-4 border-t border-primary-800">
        <div className="p-4 rounded-lg bg-primary-800/50 mb-4">
            <p className="font-semibold text-white truncate">{user.name}</p>
            <p className="text-sm text-primary-300 capitalize">{user.role}</p>
        </div>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onLogout(); }}
          className="flex items-center w-full px-4 py-2.5 text-base font-semibold text-primary-100 rounded-lg hover:bg-primary-800 hover:text-white transition-colors duration-200"
        >
          <LogoutIcon className="h-6 w-6" />
          <span className="ml-4">Logout</span>
        </a>
      </div>
    </div>
  );

  return (
    <>
        {/* Mobile Sidebar */}
        <div className={`fixed inset-0 z-30 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
             <div className="absolute inset-0 bg-black/60" onClick={() => setIsOpen(false)}></div>
             <div className={`absolute top-0 left-0 h-full w-72 bg-primary-900 text-white transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {sidebarContent}
             </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:inset-y-0 bg-primary-900 text-white">
            {sidebarContent}
        </div>
    </>
  );
};

export default Sidebar;