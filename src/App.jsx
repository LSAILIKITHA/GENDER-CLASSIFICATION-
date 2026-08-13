import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import EntryScreen from './components/EntryScreen';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import SinglePredictor from './components/SinglePredictor';
import BatchPredictor from './components/BatchPredictor';
import DatasetManager from './components/DatasetManager';
import NameExplorer from './components/NameExplorer';
import AnalyticsView from './components/AnalyticsView';
import ApiMarketplace from './components/ApiMarketplace';

export default function App() {
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'app'
  const [activeTab, setActiveTab] = useState('single'); // 'single' | 'batch' | 'dataset' | 'explorer' | 'analytics'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const [apiStatus, setApiStatus] = useState(false);
  const [checkingHealth, setCheckingHealth] = useState(false);

  // Load saved user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('namelens_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
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
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
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
    <div className="min-h-screen flex flex-col justify-between text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative">
      
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
            {activeTab === 'batch' && <BatchPredictor />}
            {activeTab === 'dataset' && <DatasetManager />}
            {activeTab === 'explorer' && <NameExplorer />}
            {activeTab === 'analytics' && <AnalyticsView />}
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
      <footer className="glass-panel border-t border-slate-800/80 py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300 font-['Outfit']">NameLens AI Engine</span>
            <span>•</span>
            <span>Scikit-Learn Naïve Bayes & Ground Truth Dataset</span>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={() => setViewMode('landing')} className="hover:text-indigo-400 transition font-medium">
              Entry Screen
            </button>
            <span>•</span>
            <button onClick={() => handleStartAnalyzing('single')} className="hover:text-indigo-400 transition font-medium">
              Name Analyzing
            </button>
            <span>•</span>
            <span className="hover:text-slate-300 transition">v2.4.0</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
