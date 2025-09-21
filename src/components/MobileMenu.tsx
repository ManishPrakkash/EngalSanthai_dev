
import React from 'react';
import type { User } from '../../types/types';
import { LogoutIcon, XMarkIcon, CogIcon } from './ui/Icon.tsx';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onLogout: () => void;
  onOpenSettings?: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, user, onLogout, onOpenSettings }) => {
  const handleSettingsClick = () => {
    if (onOpenSettings) {
      onOpenSettings();
      onClose();
    }
  };
  return (
    <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-title"
        className={`fixed inset-0 z-30 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Sliding Panel */}
      <div 
        className={`absolute top-0 right-0 h-full w-full max-w-xs bg-slate-100 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200">
                <h2 id="menu-title" className="text-lg font-bold text-slate-800">Account</h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
                    aria-label="Close menu"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>

            <div className="flex-1 p-4">
                <div className="text-left mb-6 p-4 rounded-lg bg-white">
                    <p className="font-semibold text-slate-800 truncate">{user.name}</p>
                    <p className="text-sm text-slate-500 capitalize">{user.role}</p>
                </div>

                <div className="space-y-2">
                    {onOpenSettings && (
                        <button
                            onClick={handleSettingsClick}
                            className="flex items-center w-full p-3 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-200 transition-colors duration-200"
                        >
                            <CogIcon className="h-5 w-5 mr-3" />
                            <span>Settings</span>
                        </button>
                    )}

                    <button
                        onClick={onLogout}
                        className="flex items-center w-full p-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-100 transition-colors duration-200"
                    >
                        <LogoutIcon className="h-5 w-5 mr-3" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            <div className="p-4 text-center text-xs text-slate-400 border-t border-slate-200">
                Engal Santhai &copy; {new Date().getFullYear()}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;