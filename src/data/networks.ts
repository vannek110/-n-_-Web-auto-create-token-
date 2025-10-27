import { Network } from '../types';

export const NETWORKS: Network[] = [
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    color: '#9945FF',
    icon: '◎'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    color: '#627EEA',
    icon: 'Ξ'
  },
  {
    id: 'tron',
    name: 'Tron',
    symbol: 'TRX',
    color: '#FF060A',
    icon: 'T'
  },
  {
    id: 'binance',
    name: 'BNB Chain',
    symbol: 'BNB',
    color: '#F3BA2F',
    icon: 'B'
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    color: '#F7931A',
    icon: '₿'
  }
];