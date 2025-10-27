import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Star, Settings, HelpCircle, Zap, FileText, Shield } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { id: '/', label: 'All Tokens', icon: Home },
    { id: '/trending', label: 'Trending', icon: TrendingUp },
    { id: '/live', label: 'Live Now', icon: Zap },
    { id: '/favorites', label: 'Favorites', icon: Star },
  ];

  const bottomItems = [
    { id: '/faq', label: 'FAQ', icon: HelpCircle },
    { id: '/terms', label: 'Terms', icon: FileText },
    { id: '/privacy', label: 'Privacy', icon: Shield },
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 h-screen sticky top-0 flex flex-col">
      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.id;
            return (
              <Link
                key={item.id}
                to={item.id}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-500/20 text-green-400 border-l-4 border-green-400'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.id;
            return (
              <Link
                key={item.id}
                to={item.id}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-500/20 text-green-400 border-l-4 border-green-400'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};