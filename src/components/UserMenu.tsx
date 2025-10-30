import React, { useState } from 'react';
import { User, LogOut, Settings, Star, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <div className="text-left">
          <p className="text-white text-sm font-medium">{user.name}</p>
          <p className="text-gray-400 text-xs">{user.role}</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-xl min-w-48 z-50">
          <div className="p-3 border-b border-gray-700">
            <p className="text-white font-medium">{user.name}</p>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
          
          <div className="py-2">
            <button className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors">
              <Star className="h-4 w-4" />
              <span>My Tokens</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors">
              <BarChart3 className="h-4 w-4" />
              <span>Portfolio</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>
          
          <div className="border-t border-gray-700 py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};