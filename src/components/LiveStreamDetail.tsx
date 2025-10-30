import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Heart, Users, Eye, Share2, Gift, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { Token } from '../types';
import { NETWORKS } from '../data/networks';

interface LiveStreamDetailProps {
  token: Token | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'tip' | 'follow';
  amount?: number;
}

export const LiveStreamDetail: React.FC<LiveStreamDetailProps> = ({ token, isOpen, onClose }) => {
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Mock chat messages
  useEffect(() => {
    if (!token || !isOpen) return;

    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        user: 'CryptoKing',
        message: 'This stream is amazing! 🚀',
        timestamp: new Date(Date.now() - 300000),
        type: 'message'
      },
      {
        id: '2',
        user: 'MoonWalker',
        message: 'Just bought 1000 tokens!',
        timestamp: new Date(Date.now() - 240000),
        type: 'message'
      },
      {
        id: '3',
        user: 'DiamondHands',
        message: '',
        timestamp: new Date(Date.now() - 180000),
        type: 'tip',
        amount: 0.5
      },
      {
        id: '4',
        user: 'TokenLover',
        message: 'When moon? 🌙',
        timestamp: new Date(Date.now() - 120000),
        type: 'message'
      },
      {
        id: '5',
        user: 'HODLer2024',
        message: '',
        timestamp: new Date(Date.now() - 60000),
        type: 'follow'
      }
    ];

    setMessages(mockMessages);
    setLikes(Math.floor(Math.random() * 500) + 100);
  }, [token, isOpen]);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate new messages
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      const randomMessages = [
        'Great stream! 🔥',
        'Price is pumping! 📈',
        'LFG! 🚀',
        'Diamond hands! 💎',
        'To the moon! 🌙',
        'Best token ever!',
        'Keep it up!',
        'Amazing project! ⭐'
      ];

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        user: `User${Math.floor(Math.random() * 1000)}`,
        message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        timestamp: new Date(),
        type: 'message'
      };

      setMessages(prev => [...prev, newMessage]);
    }, 8000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !token) return null;

  const network = NETWORKS.find(n => n.id === token.network);
  const isPositive = token.priceChange24h >= 0;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      message: chatMessage,
      timestamp: new Date(),
      type: 'message'
    };

    setMessages(prev => [...prev, newMessage]);
    setChatMessage('');
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toFixed(6);
    return price.toFixed(4);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex">
      {/* Main Stream Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={token.image}
              alt={token.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-xl font-bold text-white">{token.name}</h2>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">{token.symbol}</span>
                <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold animate-pulse flex items-center space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  <span>LIVE</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white">
              <Eye className="h-5 w-5" />
              <span className="font-semibold">{token.streamViewers?.toLocaleString()}</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Stream Video Area */}
        <div className="flex-1 bg-gray-950 flex items-center justify-center relative">
          <img
            src={token.image}
            alt={token.name}
            className="max-w-full max-h-full object-contain"
          />
          
          {/* Stream Overlay Info */}
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 rounded-lg p-3">
            <div className="text-white text-sm space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">Price:</span>
                <span className="font-semibold">${formatPrice(token.price)}</span>
                <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span className="text-xs">{Math.abs(token.priceChange24h).toFixed(2)}%</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">Market Cap:</span>
                <span className="font-semibold">${(token.marketCap / 1000000).toFixed(2)}M</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stream Controls */}
        <div className="bg-gray-900 border-t border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  hasLiked 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Heart className={`h-5 w-5 ${hasLiked ? 'fill-current' : ''}`} />
                <span>{likes}</span>
              </button>

              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isFollowing
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>

              <button className="flex items-center space-x-2 bg-gray-800 text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: network?.color }}
              >
                {network?.icon}
              </div>
              <span className="text-gray-300">{network?.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-white font-semibold flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Live Chat</span>
            <span className="text-gray-400 text-sm">({token.streamViewers})</span>
          </h3>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="text-sm">
              {msg.type === 'message' && (
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-white">{msg.user}</span>
                    <span className="text-gray-500 text-xs">{formatTime(msg.timestamp)}</span>
                  </div>
                  <p className="text-gray-300">{msg.message}</p>
                </div>
              )}
              
              {msg.type === 'tip' && (
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-2">
                  <div className="flex items-center space-x-2">
                    <Gift className="h-4 w-4 text-yellow-400" />
                    <span className="font-semibold text-yellow-400">{msg.user}</span>
                    <span className="text-gray-300 text-xs">tipped {msg.amount} SOL</span>
                  </div>
                </div>
              )}
              
              {msg.type === 'follow' && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-2">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-green-400" />
                    <span className="font-semibold text-green-400">{msg.user}</span>
                    <span className="text-gray-300 text-xs">started following</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-800">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm"
            />
            <button
              type="submit"
              disabled={!chatMessage.trim()}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Be respectful in chat</span>
            <div className="flex items-center space-x-2">
              <Zap className="h-3 w-3" />
              <span>Powered by {network?.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};