import React from 'react';
import { MenuIcon, UserCircleIcon } from './ui/Icon.tsx';
import type { User } from '../../types/types';

interface AdminHeaderProps {
  onMenuClick: () => void;
  title: string;
  user: User;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick, title, user }) => {
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
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-slate-600 hidden sm:block">
          {user.name}
        </span>
        <UserCircleIcon className="h-8 w-8 text-slate-400" />
      </div>
    </header>
  );
};

export default AdminHeader;