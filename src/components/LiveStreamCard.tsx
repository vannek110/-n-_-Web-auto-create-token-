import React from 'react';
import { TrendingUp, TrendingDown, Users, Eye, Play, Heart } from 'lucide-react';
import { Token } from '../types';
import { NETWORKS } from '../data/networks';

interface LiveStreamCardProps {
  token: Token;
  isFollowed?: boolean;
  onToggleFollow?: (tokenId: string) => void;
  onOpenStream?: (token: Token) => void;
}

export const LiveStreamCard: React.FC<LiveStreamCardProps> = ({ 
  token, 
  isFollowed = false, 
  onToggleFollow,
  onOpenStream
}) => {
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

  const formatViewers = (viewers: number) => {
    if (viewers >= 1000) return `${(viewers / 1000).toFixed(1)}K`;
    return viewers.toString();
  };

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFollow) {
      onToggleFollow(token.id);
    }
  };

  const handleCardClick = () => {
    if (onOpenStream) {
      onOpenStream(token);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:bg-gray-750 hover:border-gray-600 transition-all duration-200 cursor-pointer group hover:transform hover:scale-105 relative"
    >
      {/* Stream Preview */}
      <div className="relative aspect-video bg-gray-900 overflow-hidden">
        <img
          src={token.image}
          alt={token.name}
          className="w-full h-full object-cover"
        />
        
        {/* Live Indicator */}
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold animate-pulse flex items-center space-x-1">
          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          <span>LIVE</span>
        </div>

        {/* Network Badge */}
        <div 
          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white"
          style={{ backgroundColor: network?.color }}
        >
          {network?.icon}
        </div>

        {/* Viewers Count */}
        {token.streamViewers && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs flex items-center space-x-1">
            <Eye className="h-3 w-3" />
            <span>{formatViewers(token.streamViewers)}</span>
          </div>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
          <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
      </div>

      {/* Token Info */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-white font-semibold text-lg truncate">{token.name}</h3>
            <p className="text-gray-400 text-sm">{token.symbol}</p>
          </div>
          
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
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{token.description}</p>

        {/* Stats */}
        <div className="space-y-2 mb-3">
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

        {/* Streamer Info */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs">Streamer</span>
            <span className="text-white font-medium text-sm">{token.creator.slice(0, 8)}...</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs">Stream Time</span>
            <span className="text-green-400 font-medium text-sm">
              {Math.floor(Math.random() * 3) + 1}h {Math.floor(Math.random() * 60)}m
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs">Current Price</span>
            <div className="flex items-center space-x-1">
              <span className="text-white font-semibold text-sm">${formatPrice(token.price)}</span>
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
        </div>
      </div>
    </div>
  );
};