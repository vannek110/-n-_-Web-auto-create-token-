import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Users, Globe, Twitter, Send, Copy, Heart, Star, BarChart3, Activity, Settings } from 'lucide-react';
import { MOCK_TOKENS } from '../data/mockTokens';
import { NETWORKS } from '../data/networks';

interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TechnicalIndicators {
  ma20: number;
  ma50: number;
  macd: number;
  macdSignal: number;
  macdHistogram: number;
  rsi: number;
}

export const TokenDetailPage: React.FC = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | '4h' | '1d'>('5m');
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const [indicators, setIndicators] = useState<TechnicalIndicators[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [isFollowed, setIsFollowed] = useState(false);
  const [showIndicators, setShowIndicators] = useState({ ma: true, macd: true, rsi: false });

  const token = MOCK_TOKENS.find(t => t.id === tokenId);

  useEffect(() => {
    if (!token) return;

    // Generate mock candlestick data
    const generateCandlestickData = () => {
      const data: CandlestickData[] = [];
      const indicatorData: TechnicalIndicators[] = [];
      const basePrice = token.price;
      const now = new Date();
      const intervals = {
        '1m': 60,
        '5m': 12,
        '15m': 4,
        '1h': 1,
        '4h': 0.25,
        '1d': 0.04167
      };

      const points = 50;
      const interval = intervals[timeframe];
      let previousClose = basePrice;

      for (let i = points; i >= 0; i--) {
        const time = new Date(now.getTime() - i * interval * 60 * 60 * 1000);
        
        // Generate OHLC data
        const volatility = 0.02;
        const trend = (Math.random() - 0.5) * 0.01;
        
        const open = previousClose;
        const change = (Math.random() - 0.5) * volatility + trend;
        const close = Math.max(0.0001, open * (1 + change));
        
        const high = Math.max(open, close) * (1 + Math.random() * 0.01);
        const low = Math.min(open, close) * (1 - Math.random() * 0.01);
        const volume = Math.random() * 100000 + 50000;
        
        data.push({
          time: time.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          open,
          high,
          low,
          close,
          volume
        });
        
        // Calculate technical indicators
        const ma20 = data.length >= 20 ? 
          data.slice(-20).reduce((sum, d) => sum + d.close, 0) / 20 : close;
        const ma50 = data.length >= 50 ? 
          data.slice(-50).reduce((sum, d) => sum + d.close, 0) / 50 : close;
        
        // Simple MACD calculation
        const ema12 = close; // Simplified
        const ema26 = close * 0.95; // Simplified
        const macd = ema12 - ema26;
        const macdSignal = macd * 0.9; // Simplified
        const macdHistogram = macd - macdSignal;
        
        // Simple RSI calculation
        const rsi = 50 + (Math.random() - 0.5) * 40; // Simplified
        
        indicatorData.push({
          ma20,
          ma50,
          macd,
          macdSignal,
          macdHistogram,
          rsi
        });
        
        previousClose = close;
      }

      return { data, indicatorData };
    };

    const { data, indicatorData } = generateCandlestickData();
    setChartData(data);
    setIndicators(indicatorData);
    setCurrentPrice(data[data.length - 1]?.close || token.price);
    
    if (data.length > 1) {
      const change = ((data[data.length - 1].close - data[0].close) / data[0].close) * 100;
      setPriceChange(change);
    }
  }, [token, timeframe]);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (chartData.length > 0) {
        setCurrentPrice(prev => {
          const change = (Math.random() - 0.5) * 0.02;
          return Math.max(0, prev * (1 + change));
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [chartData]);

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Token not found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const network = NETWORKS.find(n => n.id === token.network);
  const isPositive = priceChange >= 0;

  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toFixed(6);
    return price.toFixed(4);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  const maxPrice = Math.max(...chartData.map(d => d.high));
  const minPrice = Math.min(...chartData.map(d => d.low));
  const priceRange = maxPrice - minPrice;
  
  const maxVolume = Math.max(...chartData.map(d => d.volume));

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={token.image}
                  alt={token.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div 
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-gray-900"
                  style={{ backgroundColor: network?.color }}
                >
                  {network?.icon}
                </div>
              </div>
              
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-white">{token.name}</h1>
                  <span className="text-gray-400">({token.symbol})</span>
                  {token.isLive && (
                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                      LIVE
                    </div>
                  )}
                </div>
                <p className="text-gray-400 text-sm">{network?.name}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-white">${formatPrice(currentPrice)}</span>
                <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                  <span className="text-lg font-semibold">{Math.abs(priceChange).toFixed(2)}%</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">24h Change</p>
            </div>

            <button
              onClick={() => setIsFollowed(!isFollowed)}
              className={`p-3 rounded-lg transition-all duration-200 ${
                isFollowed
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-red-400'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFollowed ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-3">
            {/* Chart Controls */}
            <div className="bg-gray-900 rounded-t-xl p-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-bold text-white">Price Chart</h2>
                    <div className="flex items-center space-x-1">
                      <Activity className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm font-medium">Live</span>
                    </div>
                  </div>
                  
                  {/* Indicators Toggle */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setShowIndicators(prev => ({ ...prev, ma: !prev.ma }))}
                      className={`text-sm px-3 py-1 rounded-md transition-colors ${
                        showIndicators.ma ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      MA
                    </button>
                    <button
                      onClick={() => setShowIndicators(prev => ({ ...prev, macd: !prev.macd }))}
                      className={`text-sm px-3 py-1 rounded-md transition-colors ${
                        showIndicators.macd ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      MACD
                    </button>
                    <button
                      onClick={() => setShowIndicators(prev => ({ ...prev, rsi: !prev.rsi }))}
                      className={`text-sm px-3 py-1 rounded-md transition-colors ${
                        showIndicators.rsi ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      RSI
                    </button>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  {(['1m', '5m', '15m', '1h', '4h', '1d'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        timeframe === tf
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Chart */}
            <div className="bg-gray-900 p-6" style={{ height: '400px' }}>
              <div className="relative w-full h-full mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#374151" strokeWidth="0.2" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Candlesticks */}
                  {chartData.length > 1 && (
                    <>
                      {chartData.map((candle, index) => {
                        const x = (index / (chartData.length - 1)) * 100;
                        const openY = 100 - ((candle.open - minPrice) / priceRange) * 100;
                        const closeY = 100 - ((candle.close - minPrice) / priceRange) * 100;
                        const highY = 100 - ((candle.high - minPrice) / priceRange) * 100;
                        const lowY = 100 - ((candle.low - minPrice) / priceRange) * 100;
                        
                        const isGreen = candle.close > candle.open;
                        const bodyHeight = Math.abs(closeY - openY);
                        const bodyTop = Math.min(openY, closeY);
                        
                        return (
                          <g key={index}>
                            {/* Wick */}
                            <line
                              x1={`${x}%`}
                              y1={`${highY}%`}
                              x2={`${x}%`}
                              y2={`${lowY}%`}
                              stroke={isGreen ? "#10B981" : "#EF4444"}
                              strokeWidth="0.2"
                            />
                            {/* Body */}
                            <rect
                              x={`${x - 0.4}%`}
                              y={`${bodyTop}%`}
                              width="0.8%"
                              height={`${bodyHeight}%`}
                              fill={isGreen ? "#10B981" : "#EF4444"}
                              opacity="0.8"
                            />
                          </g>
                        );
                      })}
                      
                      {/* Moving Averages */}
                      {showIndicators.ma && indicators.length > 0 && (
                        <>
                          {/* MA20 */}
                          <polyline
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="0.3"
                            opacity="0.8"
                            points={indicators.map((ind, index) => {
                              const x = (index / (indicators.length - 1)) * 100;
                              const y = 100 - ((ind.ma20 - minPrice) / priceRange) * 100;
                              return `${x},${y}`;
                            }).join(' ')}
                          />
                          {/* MA50 */}
                          <polyline
                            fill="none"
                            stroke="#F59E0B"
                            strokeWidth="0.3"
                            opacity="0.8"
                            points={indicators.map((ind, index) => {
                              const x = (index / (indicators.length - 1)) * 100;
                              const y = 100 - ((ind.ma50 - minPrice) / priceRange) * 100;
                              return `${x},${y}`;
                            }).join(' ')}
                          />
                        </>
                      )}
                    </>
                  )}
                </svg>
                
                {/* Price labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-2">
                  <span>${formatPrice(maxPrice)}</span>
                  <span>${formatPrice((maxPrice + minPrice) / 2)}</span>
                  <span>${formatPrice(minPrice)}</span>
                </div>
                
                {/* Time labels */}
                <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-400 px-4">
                  <span>{chartData[0]?.time}</span>
                  <span>{chartData[Math.floor(chartData.length / 2)]?.time}</span>
                  <span>{chartData[chartData.length - 1]?.time}</span>
                </div>
                
                {/* Legend */}
                {showIndicators.ma && (
                  <div className="absolute top-2 left-4 flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-0.5 bg-blue-500"></div>
                      <span className="text-blue-400">MA20</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-0.5 bg-yellow-500"></div>
                      <span className="text-yellow-400">MA50</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Volume Chart */}
            <div className="bg-gray-900 p-6 border-t border-gray-800" style={{ height: '100px' }}>
              <div className="relative w-full h-full">
                <div className="text-xs text-gray-400 mb-2">Volume</div>
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {chartData.map((candle, index) => {
                    const x = (index / (chartData.length - 1)) * 100;
                    const height = (candle.volume / maxVolume) * 100;
                    const isGreen = candle.close > candle.open;
                    
                    return (
                      <rect
                        key={index}
                        x={`${x - 0.4}%`}
                        y={`${100 - height}%`}
                        width="0.8%"
                        height={`${height}%`}
                        fill={isGreen ? "#10B981" : "#EF4444"}
                        opacity="0.6"
                      />
                    );
                  })}
                </svg>
              </div>
            </div>
            
            {/* MACD Indicator */}
            {showIndicators.macd && indicators.length > 0 && (
              <div className="bg-gray-900 rounded-b-xl p-6 border-t border-gray-800" style={{ height: '120px' }}>
                <div className="relative w-full h-full">
                  <div className="text-xs text-gray-400 mb-2">MACD</div>
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Zero line */}
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#374151" strokeWidth="0.2" />
                    
                    {/* MACD Histogram */}
                    {indicators.map((ind, index) => {
                      const x = (index / (indicators.length - 1)) * 100;
                      const histogramHeight = Math.abs(ind.macdHistogram) * 1000; // Scale for visibility
                      const y = ind.macdHistogram > 0 ? 50 - histogramHeight/2 : 50;
                      
                      return (
                        <rect
                          key={index}
                          x={`${x - 0.3}%`}
                          y={`${y}%`}
                          width="0.6%"
                          height={`${histogramHeight}%`}
                          fill={ind.macdHistogram > 0 ? "#10B981" : "#EF4444"}
                          opacity="0.7"
                        />
                      );
                    })}
                    
                    {/* MACD Line */}
                    <polyline
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="0.3"
                      points={indicators.map((ind, index) => {
                        const x = (index / (indicators.length - 1)) * 100;
                        const y = 50 + ind.macd * 500; // Scale and center
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    
                    {/* Signal Line */}
                    <polyline
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="0.3"
                      points={indicators.map((ind, index) => {
                        const x = (index / (indicators.length - 1)) * 100;
                        const y = 50 + ind.macdSignal * 500; // Scale and center
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                  </svg>
                  
                  {/* MACD Legend */}
                  <div className="absolute top-2 right-4 flex items-center space-x-3 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-0.5 bg-blue-500"></div>
                      <span className="text-blue-400">MACD</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-0.5 bg-yellow-500"></div>
                      <span className="text-yellow-400">Signal</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Token Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Market Cap</p>
                <p className="text-white text-lg font-semibold">{formatNumber(token.marketCap)}</p>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Volume (24h)</p>
                <p className="text-white text-lg font-semibold">{formatNumber(token.volume24h)}</p>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-gray-400 text-sm flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>Holders</span>
                </p>
                <p className="text-white text-lg font-semibold">{token.holders.toLocaleString()}</p>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Progress</p>
                <p className="text-green-400 text-lg font-semibold">{token.progress}%</p>
              </div>
            </div>

            {/* Token Description */}
            <div className="bg-gray-900 rounded-lg p-6 mt-6">
              <h3 className="text-white text-lg font-semibold mb-3">About {token.name}</h3>
              <p className="text-gray-300 leading-relaxed mb-4">{token.description}</p>
              
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-gray-400 text-sm">Contract:</span>
                <button className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md flex items-center space-x-2 text-sm transition-colors">
                  <span className="text-white font-mono">{token.creator}</span>
                  <Copy className="h-3 w-3 text-gray-400" />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-400 text-sm">Created:</span>
                  <span className="text-white ml-2">{token.createdAt.toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Network:</span>
                  <span className="text-white ml-2">{network?.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trading Panel */}
          <div className="space-y-6">
            {/* Trade Panel */}
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setTradeType('buy')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    tradeType === 'buy' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setTradeType('sell')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    tradeType === 'sell' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
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
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
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
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 px-3 rounded-md text-sm transition-colors"
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

            {/* Progress */}
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white text-lg font-semibold">Bonding Curve</h3>
                <span className="text-green-400 font-semibold">{token.progress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 mb-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${token.progress}%` }}
                />
              </div>
              <p className="text-gray-400 text-sm">
                When the market cap reaches $1M, all liquidity will be deposited to Raydium and LP tokens will be burned.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Price</span>
                  <span className="text-white font-semibold">${formatPrice(currentPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">24h High</span>
                  <span className="text-green-400">${formatPrice(maxPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">24h Low</span>
                  <span className="text-red-400">${formatPrice(minPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Creator</span>
                  <span className="text-white font-mono text-sm">{token.creator.slice(0, 8)}...</span>
                </div>
                {showIndicators.rsi && indicators.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">RSI (14)</span>
                    <span className={`font-semibold ${
                      indicators[indicators.length - 1]?.rsi > 70 ? 'text-red-400' :
                      indicators[indicators.length - 1]?.rsi < 30 ? 'text-green-400' : 'text-white'
                    }`}>
                      {indicators[indicators.length - 1]?.rsi.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};