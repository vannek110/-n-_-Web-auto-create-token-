import React, { useState, useMemo } from 'react';
import { Zap, Activity, Radio, Eye } from 'lucide-react';
import { LiveStreamCard } from '../components/LiveStreamCard';
import { LiveStreamDetail } from '../components/LiveStreamDetail';
import { MOCK_TOKENS } from '../data/mockTokens';
import { Token } from '../types';

interface LivePageProps {
  selectedNetwork: string;
  searchTerm: string;
  followedTokens?: Set<string>;
  onToggleFollow?: (tokenId: string) => void;
}

export const LivePage: React.FC<LivePageProps> = ({ 
  selectedNetwork, 
  searchTerm,
  followedTokens = new Set(),
  onToggleFollow
}) => {
  const [selectedStreamToken, setSelectedStreamToken] = useState<Token | null>(null);

  // Filter streaming tokens
  const streamingTokens = useMemo(() => {
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

    // Filter streaming tokens only
    tokens = tokens.filter(token => token.isStreaming);

    // Sort by viewers (descending)
    return tokens.sort((a, b) => (b.streamViewers || 0) - (a.streamViewers || 0));
  }, [searchTerm, selectedNetwork]);

  const handleOpenStream = (token: Token) => {
    setSelectedStreamToken(token);
  };

  const handleCloseStream = () => {
    setSelectedStreamToken(null);
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-xl">
            <Radio className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Live Streams</h1>
            <p className="text-gray-400">Watch live streams from token creators and communities</p>
          </div>
        </div>

        {/* Streaming Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Radio className="h-8 w-8 text-red-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h3 className="text-red-400 text-sm font-medium">Live Streams</h3>
                <p className="text-2xl font-bold text-white mt-1">{streamingTokens.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-gray-400 text-sm font-medium flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>Total Viewers</span>
            </h3>
            <p className="text-2xl font-bold text-white mt-1">
              {streamingTokens.reduce((sum, t) => sum + (t.streamViewers || 0), 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-gray-400 text-sm font-medium">Stream Volume</h3>
            <p className="text-2xl font-bold text-red-400 mt-1">
              ${streamingTokens.length > 0 
                ? (streamingTokens.reduce((sum, t) => sum + t.volume24h, 0) / 1000000).toFixed(1)
                : '0.0'
              }M
            </p>
          </div>
        </div>
      </div>

      {/* Live Streams Grid */}
      {streamingTokens.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Radio className="h-16 w-16 text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No live streams</h3>
          <p className="text-gray-500 text-center max-w-md">
            No tokens are currently streaming. Check back later or create your own token to start streaming!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {streamingTokens.map((token) => (
            <LiveStreamCard
              key={token.id}
              token={token}
              isFollowed={followedTokens.has(token.id)}
              onToggleFollow={onToggleFollow}
              onOpenStream={handleOpenStream}
            />
          ))}
        </div>
      )}

      {/* Live Stream Detail Modal */}
      <LiveStreamDetail
        token={selectedStreamToken}
        isOpen={!!selectedStreamToken}
        onClose={handleCloseStream}
      />
    </>
  );
};