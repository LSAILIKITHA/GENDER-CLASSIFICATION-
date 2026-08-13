import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Activity, Layers, Compass, BarChart2, Database,
  RefreshCw, Home, LogIn, User, LogOut, ChevronDown, ShieldCheck, Key
} from 'lucide-react';
import logoImg from '../namelens_logo.png';

export default function Navbar({
  viewMode,
  setViewMode,
  activeTab,
  setActiveTab,
  apiStatus,
  checkingHealth,
  onRefreshHealth,
  user,
  onOpenAuth,
  onOpenProfile,
  onLogout
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabs = [
    { id: 'single', label: 'Single Analysis', shortLabel: 'Single', icon: Sparkles },
    { id: 'batch', label: 'Batch Classifier', shortLabel: 'Batch', icon: Layers },
    { id: 'dataset', label: 'Retraining', shortLabel: 'Retrain', icon: Database },
    { id: 'explorer', label: 'Name Catalog', shortLabel: 'Catalog', icon: Compass },
    { id: 'analytics', label: 'Global Stats', shortLabel: 'Stats', icon: BarChart2 },
    { id: 'api', label: 'API', shortLabel: 'API', icon: Key },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 backdrop-blur-xl transition-all">
      <div className="w-full px-3 sm:px-6">
        <div className="flex items-center h-20 sm:h-24 lg:h-28">

          {/* Left: App Name & Brand Link (Positioned Extreme Far Left with Custom AI Logo) */}
          <div className="shrink-0 flex items-center justify-start pl-0">
            <div className="flex items-center space-x-3 sm:space-x-3.5 cursor-pointer select-none group" onClick={() => setViewMode('landing')}>
              <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[2px] shadow-xl shadow-indigo-500/30 group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
                <img src={logoImg} alt="NameLens AI Logo" className="w-full h-full object-cover rounded-[14px] shadow-inner" />
              </div>
              <div className="truncate">
                <h1 className="font-extrabold text-xl sm:text-2xl lg:text-3xl tracking-tight text-white font-['Outfit'] truncate">
                  Name<span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Lens</span>
                </h1>
                <p className="text-xs text-slate-400 font-medium hidden lg:block truncate">Spatial Name Intelligence Engine</p>
              </div>
            </div>
          </div>

          {/* Center: Navigation Controls (Slightly Increased Border Box Container Width) */}
          <div className="hidden md:flex flex-1 items-center justify-center mx-3 lg:mx-6">

            <nav className="flex items-center space-x-1.5 lg:space-x-2.5 bg-slate-900/95 p-2 lg:p-2.5 rounded-2xl border-2 border-slate-700/80 shadow-2xl shadow-indigo-950/40 w-full justify-between max-w-[1220px]">
              {/* ONLY Home Feature (Shifted right with dedicated margin) */}
              <button
                onClick={() => setViewMode('landing')}
                className={`ml-3 sm:ml-4 lg:ml-5 flex items-center space-x-2 px-3.5 lg:px-4.5 py-2.5 lg:py-3 rounded-xl text-xs sm:text-sm lg:text-base font-extrabold transition-all duration-200 whitespace-nowrap ${viewMode === 'landing'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
              >
                <Home className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-400 shrink-0" />
                <span>Home</span>
              </button>

              <div className="h-5.5 w-[1px] bg-slate-800 shrink-0 mx-1.5"></div>

              {/* Workspace Navigation Sub-Tabs */}
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = viewMode === 'app' && activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (!user) {
                        onOpenAuth('login');
                        return;
                      }
                      setViewMode('app');
                      setActiveTab(tab.id);
                    }}
                    className={`flex items-center space-x-2 px-3.5 lg:px-4.5 py-2.5 lg:py-3 rounded-xl text-xs sm:text-sm lg:text-base font-extrabold transition-all duration-200 whitespace-nowrap ${isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30 scale-[1.02]'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                  >
                    <Icon className={`w-4 h-4 lg:w-5 lg:h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="hidden xl:inline">{tab.label}</span>
                    <span className="xl:hidden">{tab.shortLabel}</span>
                  </button>
                );
              })}
            </nav>

          </div>

          {/* Right: User Auth Section & Profile (Positioned Far Right) */}
          <div className="shrink-0 flex items-center justify-end min-w-0 pr-1 sm:pr-2">

            {/* Auth User Menu or Sign In Button */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3.5 p-2.5 pl-3.5 sm:px-4 sm:py-3 rounded-2xl glass-panel border border-slate-700 hover:border-indigo-500/50 transition focus:outline-none shadow-lg hover:shadow-indigo-500/10"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-base font-bold shadow-md overflow-hidden shrink-0">
                    {user.avatar && (user.avatar.startsWith('data:image/') || user.avatar.startsWith('http')) ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user.avatar || (user.name ? user.name[0].toUpperCase() : 'U')
                    )}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-sm sm:text-base font-bold text-slate-100 leading-tight truncate max-w-[140px]">{user.name}</div>
                    <div className="text-xs text-indigo-400 font-medium truncate max-w-[140px]">{user.role || 'Member'}</div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu (Positioned Right) */}
                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2.5 w-56 glass-panel rounded-2xl p-2 border border-slate-700 shadow-2xl shadow-slate-950 z-50 animate-fadeIn"
                  >
                    <div className="px-3.5 py-2.5 border-b border-slate-800 mb-1 sm:hidden">
                      <div className="text-sm font-bold text-slate-200">{user.name}</div>
                      <div className="text-xs text-indigo-400">{user.role || 'Member'}</div>
                    </div>
                    <button
                      onClick={() => { onOpenProfile(); setUserMenuOpen(false); }}
                      className="w-full text-left px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white flex items-center space-x-2.5 transition"
                    >
                      <User className="w-4.5 h-4.5 text-indigo-400" />
                      <span>Profile Settings</span>
                    </button>

                    <div className="my-1 border-t border-slate-800"></div>

                    <button
                      onClick={() => { onLogout(); setUserMenuOpen(false); }}
                      className="w-full text-left px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2.5 transition"
                    >
                      <LogOut className="w-4.5 h-4.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition flex items-center space-x-2 shrink-0"
              >
                <LogIn className="w-4.5 h-4.5" />
                <span>Log In / Sign Up</span>
              </button>
            )}

          </div>

        </div>

        {/* Mobile Navigation Bar (Only for screen widths <768px) */}
        <div className="md:hidden flex items-center overflow-x-auto space-x-2 py-2 px-1 border-t border-slate-800/60 no-scrollbar">
          <button
            onClick={() => setViewMode('landing')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${viewMode === 'landing' ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = viewMode === 'app' && activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (!user) {
                    onOpenAuth('login');
                    return;
                  }
                  setViewMode('app');
                  setActiveTab(tab.id);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
