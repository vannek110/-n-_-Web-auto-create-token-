import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Users, Globe, Twitter, Send, Copy } from 'lucide-react';
import { Token } from '../types';
import { NETWORKS } from '../data/networks';

interface TokenDetailProps {
  token: Token | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TokenDetail: React.FC<TokenDetailProps> = ({ token, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'trade' | 'holders' | 'info'>('trade');
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  if (!isOpen || !token) return null;

  const network = NETWORKS.find(n => n.id === token.network);
  const isPositive = token.priceChange24h >= 0;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toFixed(6);
    return price.toFixed(4);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(token.creator);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={token.image}
                alt={token.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div 
                className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-gray-900"
                style={{ backgroundColor: network?.color }}
              >
                {network?.icon}
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold text-white">{token.name}</h2>
                {token.isLive && (
                  <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                    LIVE
                  </div>
                )}
              </div>
              <p className="text-gray-400">{token.symbol}</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Left Column - Token Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Price</p>
                  <p className="text-white text-lg font-semibold">${formatPrice(token.price)}</p>
                  <div className={`flex items-center space-x-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span>{Math.abs(token.priceChange24h).toFixed(2)}%</span>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Market Cap</p>
                  <p className="text-white text-lg font-semibold">{formatNumber(token.marketCap)}</p>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Volume (24h)</p>
                  <p className="text-white text-lg font-semibold">{formatNumber(token.volume24h)}</p>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>Holders</span>
                  </p>
                  <p className="text-white text-lg font-semibold">{token.holders.toLocaleString()}</p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-white text-lg font-semibold mb-3">About</h3>
                <p className="text-gray-300 leading-relaxed">{token.description}</p>
                
                <div className="mt-4 flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">Contract:</span>
                  <button
                    onClick={copyAddress}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md flex items-center space-x-2 text-sm transition-colors"
                  >
                    <span className="text-white font-mono">{token.creator}</span>
                    <Copy className="h-3 w-3 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Progress */}
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-white text-lg font-semibold">Bonding Curve Progress</h3>
                  <span className="text-green-400 font-semibold">{token.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
                  <div
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${token.progress}%` }}
                  />
                </div>
                <p className="text-gray-400 text-sm">
                  When the market cap reaches $1M, all liquidity will be deposited to Raydium and LP tokens will be burned.
                </p>
              </div>
            </div>

            {/* Right Column - Trading */}
            <div className="space-y-6">
              {/* Trade Panel */}
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex space-x-2 mb-4">
                  <button
                    onClick={() => setTradeType('buy')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      tradeType === 'buy' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setTradeType('sell')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      tradeType === 'sell' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Sell
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {tradeType === 'buy' ? 'Spend' : 'Sell'} Amount
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                        placeholder="0.0"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {network?.symbol}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {['0.1', '0.5', '1.0', '5.0'].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setTradeAmount(amount)}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-3 rounded-md text-sm transition-colors"
                      >
                        {amount}
                      </button>
                    ))}
                  </div>

                  <button
                    className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors ${
                      tradeType === 'buy'
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white'
                        : 'bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white'
                    }`}
                  >
                    {tradeType === 'buy' ? 'Buy' : 'Sell'} {token.symbol}
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-white text-lg font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Created</span>
                    <span className="text-white">{token.createdAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network</span>
                    <span className="text-white">{network?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Creator</span>
                    <span className="text-white font-mono text-sm">{token.creator.slice(0, 8)}...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};