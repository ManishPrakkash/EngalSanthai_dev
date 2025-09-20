import React from 'react';
import { MenuIcon } from './ui/Icon.tsx';

interface AdminHeaderProps {
  onMenuClick: () => void;
  title: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick, title }) => {
  return (
    <header className="lg:hidden sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white shadow-sm">
      <button
        onClick={onMenuClick}
        className="p-2 text-slate-500 hover:text-slate-800"
        aria-label="Open sidebar menu"
      >
        <MenuIcon className="h-6 w-6" />
      </button>
      <h1 className="text-lg font-bold text-slate-800 capitalize">{title}</h1>
      <div className="w-8"></div> {/* Spacer to center title */}
    </header>
  );
};

export default AdminHeader;