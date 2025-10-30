import React from 'react';
import { TokenCard } from './TokenCard';
import { Token } from '../types';
import { Coins } from 'lucide-react';

interface TokenGridProps {
  tokens: Token[];
  followedTokens?: Set<string>;
  onToggleFollow?: (tokenId: string) => void;
}

export const TokenGrid: React.FC<TokenGridProps> = ({ 
  tokens, 
  followedTokens = new Set(), 
  onToggleFollow 
}) => {
  if (tokens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Coins className="h-16 w-16 text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No tokens found</h3>
        <p className="text-gray-500 text-center max-w-md">
          No tokens match your search criteria. Try adjusting your filters or create a new token to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tokens.map((token) => (
        <TokenCard
          key={token.id}
          token={token}
          isFollowed={followedTokens.has(token.id)}
          onToggleFollow={onToggleFollow}
        />
      ))}
    </div>
  );
};