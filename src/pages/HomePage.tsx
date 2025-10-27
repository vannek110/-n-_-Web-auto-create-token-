import React, { useState, useMemo } from 'react';
import { TokenGrid } from '../components/TokenGrid';
import { MOCK_TOKENS } from '../data/mockTokens';

interface HomePageProps {
  selectedNetwork: string;
  searchTerm: string;
  onCreateToken: () => void;
  followedTokens?: Set<string>;
  onToggleFollow?: (tokenId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  selectedNetwork, 
  searchTerm, 
  onCreateToken,
  followedTokens = new Set(),
  onToggleFollow
}) => {

  // Filter tokens based on search and network
  const filteredTokens = useMemo(() => {
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

    // Sort by market cap (descending)
    return tokens.sort((a, b) => b.marketCap - a.marketCap);
  }, [searchTerm, selectedNetwork]);

  return (
    <>
      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-gray-400 text-sm font-medium">Total Tokens</h3>
          <p className="text-2xl font-bold text-white mt-1">{filteredTokens.length}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-gray-400 text-sm font-medium">Live Tokens</h3>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {filteredTokens.filter(t => t.isLive).length}
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-gray-400 text-sm font-medium">Total Volume</h3>
          <p className="text-2xl font-bold text-white mt-1">
            ${(filteredTokens.reduce((sum, t) => sum + t.volume24h, 0) / 1000000).toFixed(1)}M
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-gray-400 text-sm font-medium">Network</h3>
          <p className="text-2xl font-bold text-purple-400 mt-1 capitalize">{selectedNetwork}</p>
        </div>
      </div>

      {/* Token Grid */}
      <TokenGrid
        tokens={filteredTokens}
        followedTokens={followedTokens}
        onToggleFollow={onToggleFollow}
      />
    </>
  );
};