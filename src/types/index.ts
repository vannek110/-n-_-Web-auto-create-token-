export interface Network {
  id: string;
  name: string;
  symbol: string;
  color: string;
  icon: string;
}

export interface Token {
  id: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
  network: string;
  creator: string;
  marketCap: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  holders: number;
  createdAt: Date;
  isLive: boolean;
  progress: number;
  isStreaming?: boolean;
  streamViewers?: number;
}

export interface Trade {
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: Date;
  user: string;
}