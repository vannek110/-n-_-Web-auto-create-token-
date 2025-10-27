import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Users, BarChart3, Heart } from 'lucide-react';
import { Token } from '../types';
import { NETWORKS } from '../data/networks';

interface TokenCardProps {
  token: Token;
  isFollowed?: boolean;
  onToggleFollow?: (tokenId: string) => void;
}

export const TokenCard: React.FC<TokenCardProps> = ({ 
  token, 
  isFollowed = false, 
  onToggleFollow 
}) => {
  const navigate = useNavigate();
  const network = NETWORKS.find(n => n.id === token.network);
  const isPositive = token.priceChange24h >= 0;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toFixed(6);
    return price.toFixed(4);
  };

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking follow button
    if (onToggleFollow) {
      onToggleFollow(token.id);
    }
  };

  const handleCardClick = () => {
    navigate(`/token/${token.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:bg-gray-750 hover:border-gray-600 transition-all duration-200 cursor-pointer group hover:transform hover:scale-105"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={token.image}
              alt={token.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div 
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: network?.color }}
            >
              {network?.icon}
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{token.name}</h3>
            <p className="text-gray-400 text-sm">{token.symbol}</p>
          </div>
        </div>
        
        {token.isLive && (
          <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md text-xs font-medium animate-pulse">
            LIVE
          </div>
        )}
        
        <button
          onClick={handleFollowClick}
          className={`p-2 rounded-lg transition-all duration-200 ${
            isFollowed
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-red-400'
          }`}
          title={isFollowed ? 'Unfollow' : 'Follow'}
        >
          <Heart 
            className={`h-4 w-4 transition-all duration-200 ${
              isFollowed ? 'fill-current' : ''
            }`} 
          />
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{token.description}</p>

      {/* Stats */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">Market Cap</span>
          <span className="text-white font-medium text-sm">{formatNumber(token.marketCap)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">Price</span>
          <div className="flex items-center space-x-1">
            <span className="text-white font-medium text-sm">${formatPrice(token.price)}</span>
            <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span className="text-xs font-medium">{Math.abs(token.priceChange24h).toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>Holders</span>
          </span>
          <span className="text-white font-medium text-sm">{token.holders.toLocaleString()}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Bonding Progress</span>
          <span>{token.progress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${token.progress}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
          Buy
        </button>
        <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
          Sell
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors">
          <BarChart3 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};