import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import EntryScreen from './components/EntryScreen';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import SinglePredictor from './components/SinglePredictor';
import NameComparison from './components/NameComparison';
import BatchPredictor from './components/BatchPredictor';
import DatasetManager from './components/DatasetManager';
import FloatingAiAssistant from './components/FloatingAiAssistant';
import AiAssistant from './components/AiAssistant';
import MlLabCombinedView from './components/MlLabCombinedView';
import ApiMarketplace from './components/ApiMarketplace';
import NameExplorer from './components/NameExplorer';

export default function App() {
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'app'
  const [activeTab, setActiveTab] = useState('single'); // 'single' | 'batch' | 'dataset' | 'explorer' | 'analytics'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const [apiStatus, setApiStatus] = useState(false);
  const [checkingHealth, setCheckingHealth] = useState(false);

  // Load saved user from localStorage on mount or assign default ML Researcher profile
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('namelens_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        const demoUser = {
          id: 'usr-guest',
          name: 'ML Researcher',
          email: 'researcher@namelens.ai',
          role: 'ML Researcher',
          country: 'Global',
          avatar: 'M'
        };
        setUser(demoUser);
        localStorage.setItem('namelens_user', JSON.stringify(demoUser));
      }
    } catch (e) {
      console.warn('Failed to parse saved user from localStorage');
    }
  }, []);

  const checkBackendHealth = async () => {
    setCheckingHealth(true);
    try {
      const response = await fetch('/api/v1/health');
      const data = await response.json();
      if (response.ok && data.status === 'Operational') {
        setApiStatus(true);
      } else {
        setApiStatus(false);
      }
    } catch (err) {
      setApiStatus(false);
    } finally {
      setCheckingHealth(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStartAnalyzing = (tab = 'single') => {
    setActiveTab(tab);
    setViewMode('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = () => {
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (userProfile) => {
    setUser(userProfile);
    setAuthModalOpen(false);
    setViewMode('landing'); // Direct to Home Page upon OTP verification!
    setActiveTab('single');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('namelens_user');
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0D1117] text-[#F0F6FC] font-sans selection:bg-[#C7ED3D]/30 selection:text-[#C7ED3D] relative">
      
      {/* Top Navbar */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiStatus={apiStatus}
        checkingHealth={checkingHealth}
        onRefreshHealth={checkBackendHealth}
        user={user}
        onOpenAuth={handleOpenAuth}
        onOpenProfile={() => setProfileModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {viewMode === 'landing' ? (
          <EntryScreen
            onStartAnalyzing={handleStartAnalyzing}
            onOpenAuth={handleOpenAuth}
            user={user}
          />
        ) : (
          <div className="animate-fadeIn">
            {activeTab === 'single' && <SinglePredictor />}
            {activeTab === 'compare' && <NameComparison />}
            {activeTab === 'batch' && <BatchPredictor />}
            {activeTab === 'dataset' && <DatasetManager />}
            {activeTab === 'explorer' && <NameExplorer />}
            {activeTab === 'assistant' && <AiAssistant />}
            {['mllab', 'modellab', 'analytics', 'fairness'].includes(activeTab) && (
              <MlLabCombinedView initialSubTab={activeTab === 'mllab' ? 'modellab' : activeTab} />
            )}
            {activeTab === 'api' && <ApiMarketplace user={user} onOpenAuth={handleOpenAuth} />}
          </div>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
        onLogout={handleLogout}
        onUpdateUser={(updated) => setUser(updated)}
      />

      {/* Footer */}
      <footer className="bg-[#161B22] border-t border-[#30363D] py-8 mt-12 text-xs text-[#8B949E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#F0F6FC] font-['Outfit']">NameLens AI Engine</span>
            <span>•</span>
            <span>Developer Intelligence Architecture</span>
            <span>•</span>
            <span className="text-[#C7ED3D] font-mono font-bold">v2.4.0 (10.48M Ensemble)</span>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={() => setViewMode('landing')} className="hover:text-[#C7ED3D] transition font-medium">
              Entry Screen
            </button>
            <span>•</span>
            <button onClick={() => handleStartAnalyzing('single')} className="hover:text-[#C7ED3D] transition font-medium">
              Name Analyzing
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Action Button AI Assistant */}
      <FloatingAiAssistant />

    </div>
  );
}
