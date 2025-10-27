import React, { useState, useMemo } from 'react';
import { Star, Heart } from 'lucide-react';
import { TokenGrid } from '../components/TokenGrid';
import { MOCK_TOKENS } from '../data/mockTokens';

interface FavoritesPageProps {
  selectedNetwork: string;
  searchTerm: string;
  followedTokens?: Set<string>;
  onToggleFollow?: (tokenId: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ 
  selectedNetwork, 
  searchTerm,
  followedTokens = new Set(),
  onToggleFollow
}) => {

  // Show actually followed tokens instead of demo data
  const favoriteTokens = useMemo(() => {
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

    // Show only followed tokens
    tokens = tokens.filter(token => followedTokens.has(token.id));

    // Sort by market cap
    return tokens
      .sort((a, b) => b.marketCap - a.marketCap);
  }, [searchTerm, selectedNetwork, followedTokens]);

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-3 rounded-xl">
            <Star className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Favorite Tokens</h1>
            <p className="text-gray-400">Your saved tokens and watchlist</p>
          </div>
        </div>

        {/* Favorites Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-purple-400" />
              <div>
                <h3 className="text-purple-400 text-sm font-medium">Saved Tokens</h3>
                <p className="text-2xl font-bold text-white mt-1">{favoriteTokens.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-gray-400 text-sm font-medium">Avg Performance</h3>
            <p className="text-2xl font-bold text-green-400 mt-1">
              +{favoriteTokens.length > 0 
                ? (favoriteTokens.reduce((sum, t) => sum + Math.abs(t.priceChange24h), 0) / favoriteTokens.length).toFixed(1)
                : '0.0'
              }%
            </p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-gray-400 text-sm font-medium">Total Value</h3>
            <p className="text-2xl font-bold text-white mt-1">
              ${favoriteTokens.length > 0 
                ? (favoriteTokens.reduce((sum, t) => sum + t.marketCap, 0) / 1000000).toFixed(1)
                : '0.0'
              }M
            </p>
          </div>
        </div>
      </div>

      {/* Empty State or Token Grid */}
      {favoriteTokens.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-gray-800 p-6 rounded-full mb-6">
            <Star className="h-12 w-12 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No favorites yet</h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            Start adding tokens to your favorites by clicking the heart icon on any token card.
          </p>
          <button className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200">
            Browse Tokens
          </button>
        </div>
      ) : (
        <TokenGrid
          tokens={favoriteTokens}
        followedTokens={followedTokens}
        onToggleFollow={onToggleFollow}
        />
      )}
    </>
  );
};