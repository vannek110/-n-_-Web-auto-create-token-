import React, { useState } from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';
import { NETWORKS } from '../data/networks';

interface CreateTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNetwork: string;
  onNetworkChange: (network: string) => void;
}

export const CreateTokenModal: React.FC<CreateTokenModalProps> = ({
  isOpen,
  onClose,
  selectedNetwork,
  onNetworkChange,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    image: '',
    initialSupply: '1000000',
    website: '',
    twitter: '',
    telegram: '',
  });
  const [dragActive, setDragActive] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const currentNetwork = NETWORKS.find(n => n.id === selectedNetwork) || NETWORKS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    // Simulate token creation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsCreating(false);
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      symbol: '',
      description: '',
      image: '',
      initialSupply: '1000000',
      website: '',
      twitter: '',
      telegram: '',
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, image: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Create New Token</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Network Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3">
              Select Network
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {NETWORKS.map((network) => (
                <button
                  key={network.id}
                  type="button"
                  onClick={() => onNetworkChange(network.id)}
                  className={`p-3 rounded-lg border transition-all ${
                    selectedNetwork === network.id
                      ? 'border-green-400 bg-green-400/10'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span 
                      className="text-lg"
                      style={{ color: network.color }}
                    >
                      {network.icon}
                    </span>
                    <span className="text-white text-sm font-medium">{network.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Token Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="e.g. My Awesome Token"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Token Symbol *
              </label>
              <input
                type="text"
                required
                value={formData.symbol}
                onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="e.g. MAT"
                maxLength={10}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none"
              placeholder="Describe your token and its purpose..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Token Image
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                dragActive
                  ? 'border-green-400 bg-green-400/5'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-400">
                  Drop your image here or{' '}
                  <label className="text-green-400 cursor-pointer hover:text-green-300">
                    browse
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setFormData(prev => ({ ...prev, image: e.target?.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
              {formData.image && (
                <div className="mt-4 text-center">
                  <img
                    src={formData.image}
                    alt="Token preview"
                    className="mx-auto h-16 w-16 rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Initial Supply */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Initial Supply
            </label>
            <input
              type="number"
              value={formData.initialSupply}
              onChange={(e) => setFormData(prev => ({ ...prev, initialSupply: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              placeholder="1000000"
              min="1"
            />
          </div>

          {/* Optional Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Social Links (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="Website URL"
              />
              <input
                type="text"
                value={formData.twitter}
                onChange={(e) => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="Twitter handle"
              />
              <input
                type="text"
                value={formData.telegram}
                onChange={(e) => setFormData(prev => ({ ...prev, telegram: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="Telegram group"
              />
            </div>
          </div>

          {/* Warning */}
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-orange-200 font-medium mb-1">Important Notice</p>
                <p className="text-orange-300">
                  Creating tokens involves blockchain transaction fees. Make sure you have sufficient {currentNetwork.symbol} in your wallet to cover gas fees.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isCreating || !formData.name || !formData.symbol || !formData.description}
            className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating Token...</span>
              </>
            ) : (
              <span>Create Token on {currentNetwork.name}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};