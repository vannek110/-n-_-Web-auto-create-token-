import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CreateTokenModal } from './components/CreateTokenModal';
import { LoginModal } from './components/LoginModal';
import { HomePage } from './pages/HomePage';
import { TrendingPage } from './pages/TrendingPage';
import { LivePage } from './pages/LivePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { TokenDetailPage } from './pages/TokenDetailPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { FAQPage } from './pages/FAQPage';

function App() {
  const [selectedNetwork, setSelectedNetwork] = useState('solana');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [followedTokens, setFollowedTokens] = useState<Set<string>>(new Set());

  const handleToggleFollow = (tokenId: string) => {
    setFollowedTokens(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tokenId)) {
        newSet.delete(tokenId);
      } else {
        newSet.add(tokenId);
      }
      return newSet;
    });
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-950">
          <Routes>
            <Route path="/token/:tokenId" element={<TokenDetailPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="*" element={
              <>
                <Header
                  onCreateToken={() => setIsCreateModalOpen(true)}
                  onOpenLogin={() => setIsLoginModalOpen(true)}
                  selectedNetwork={selectedNetwork}
                  onNetworkChange={setSelectedNetwork}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                />
                
                <div className="flex">
                  <Sidebar />
                  
                  <main className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto">
                      <Routes>
                        <Route 
                          path="/" 
                          element={
                            <HomePage 
                              selectedNetwork={selectedNetwork}
                              searchTerm={searchTerm}
                              onCreateToken={() => setIsCreateModalOpen(true)}
                              followedTokens={followedTokens}
                              onToggleFollow={handleToggleFollow}
                            />
                          } 
                        />
                        <Route 
                          path="/trending" 
                          element={
                            <TrendingPage 
                              selectedNetwork={selectedNetwork}
                              searchTerm={searchTerm}
                              followedTokens={followedTokens}
                              onToggleFollow={handleToggleFollow}
                            />
                          } 
                        />
                        <Route 
                          path="/live" 
                          element={
                            <LivePage 
                              selectedNetwork={selectedNetwork}
                              searchTerm={searchTerm}
                              followedTokens={followedTokens}
                              onToggleFollow={handleToggleFollow}
                            />
                          } 
                        />
                        <Route 
                          path="/favorites" 
                          element={
                            <FavoritesPage 
                              selectedNetwork={selectedNetwork}
                              searchTerm={searchTerm}
                              followedTokens={followedTokens}
                              onToggleFollow={handleToggleFollow}
                            />
                          } 
                        />
                      </Routes>
                    </div>
                  </main>
                </div>
              </>
            } />
          </Routes>

          {/* Modals */}
          <CreateTokenModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            selectedNetwork={selectedNetwork}
            onNetworkChange={setSelectedNetwork}
          />
          
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;