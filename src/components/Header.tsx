import React, { useState } from 'react';
import { Search, Plus, Zap, TrendingUp } from 'lucide-react';
import { NETWORKS } from '../data/networks';
import { useAuth } from '../contexts/AuthContext';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  onCreateToken: () => void;
  onOpenLogin: () => void;
  selectedNetwork: string;
  onNetworkChange: (network: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onCreateToken,
  onOpenLogin,
  selectedNetwork,
  onNetworkChange,
  searchTerm,
  onSearchChange,
}) => {
  const [showNetworks, setShowNetworks] = useState(false);
  const { user } = useAuth();

  const currentNetwork = NETWORKS.find(n => n.id === selectedNetwork) || NETWORKS[0];

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-green-400" />
              <h1 className="text-xl font-bold text-white">TokenLaunch</h1>
            </div>
          </div>

          {/* Network Selector */}
          <div className="relative">
            <button
              onClick={() => setShowNetworks(!showNetworks)}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
              style={{ borderLeft: `4px solid ${currentNetwork.color}` }}
            >
              <span className="text-lg">{currentNetwork.icon}</span>
              <span className="text-white font-medium">{currentNetwork.name}</span>
            </button>

            {showNetworks && (
              <div className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-xl min-w-48 z-50">
                {NETWORKS.map((network) => (
                  <button
                    key={network.id}
                    onClick={() => {
                      onNetworkChange(network.id);
                      setShowNetworks(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors"
                    style={{ borderLeft: `4px solid ${network.color}` }}
                  >
                    <span className="text-lg">{network.icon}</span>
                    <span className="text-white font-medium">{network.name}</span>
                    <span className="text-gray-400 text-sm ml-auto">{network.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={onCreateToken}
                  className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-green-500/25"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Token</span>
                </button>
                <UserMenu />
              </>
            ) : (
              <button
                onClick={onOpenLogin}
                className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-green-500/25"
              >
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};