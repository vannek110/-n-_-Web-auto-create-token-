import React, { useState, useMemo } from 'react';
import { TrendingUp, Siren as Fire } from 'lucide-react';
import { TokenGrid } from '../components/TokenGrid';
import { MOCK_TOKENS } from '../data/mockTokens';

interface TrendingPageProps {
  selectedNetwork: string;
  searchTerm: string;
  followedTokens?: Set<string>;
  onToggleFollow?: (tokenId: string) => void;
}

export const TrendingPage: React.FC<TrendingPageProps> = ({ 
  selectedNetwork, 
  searchTerm,
  followedTokens = new Set(),
  onToggleFollow
}) => {

  // Filter and sort trending tokens
  const trendingTokens = useMemo(() => {
    let tokens = MOCK_TOKENS;

    // Filter by search term
    if (searchTerm) {
      tokens = tokens.filter(token => 
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by network
    if (selectedNetwork) {
      tokens = tokens.filter(token => token.network === selectedNetwork);
    }

    // Filter trending tokens (positive price change > 10%)
    tokens = tokens.filter(token => token.priceChange24h > 10);

    // Sort by price change (descending)
    return tokens.sort((a, b) => b.priceChange24h - a.priceChange24h);
  }, [searchTerm, selectedNetwork]);

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-orange-400 to-red-500 p-3 rounded-xl">
            <Fire className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Trending Tokens</h1>
            <p className="text-gray-400">Tokens with the highest price increases in the last 24 hours</p>
          </div>
        </div>

        {/* Trending Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-orange-400" />
              <div>
                <h3 className="text-orange-400 text-sm font-medium">Trending Tokens</h3>
                <p className="text-2xl font-bold text-white mt-1">{trendingTokens.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-gray-400 text-sm font-medium">Avg Price Change</h3>
            <p className="text-2xl font-bold text-green-400 mt-1">
              +{trendingTokens.length > 0 
                ? (trendingTokens.reduce((sum, t) => sum + t.priceChange24h, 0) / trendingTokens.length).toFixed(1)
                : '0.0'
              }%
            </p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-gray-400 text-sm font-medium">Total Volume</h3>
            <p className="text-2xl font-bold text-white mt-1">
              ${trendingTokens.length > 0 
                ? (trendingTokens.reduce((sum, t) => sum + t.volume24h, 0) / 1000000).toFixed(1)
                : '0.0'
              }M
            </p>
          </div>
        </div>
      </div>

      {/* Token Grid */}
      <TokenGrid
        tokens={trendingTokens}
        followedTokens={followedTokens}
        onToggleFollow={onToggleFollow}
      />
    </>
  );
};