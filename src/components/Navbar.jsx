import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Activity, Layers, Compass, BarChart2, Database,
  RefreshCw, Home, LogIn, User, LogOut, ChevronDown, ShieldCheck, Key, Cpu, Video
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
    { id: 'video', label: 'Video Predictor', shortLabel: 'Video AI', icon: Video },
    { id: 'compare', label: 'Compare Names', shortLabel: 'Compare', icon: Layers },
    { id: 'batch', label: 'Batch Classifier', shortLabel: 'Batch', icon: Activity },
    { id: 'explorer', label: 'Name Catalog', shortLabel: 'Catalog', icon: Compass },
    { id: 'mllab', label: 'ML Lab & Stats', shortLabel: 'ML Lab', icon: Cpu },
    { id: 'dataset', label: 'Retraining', shortLabel: 'Retrain', icon: Database },
    { id: 'api', label: 'API Platform', shortLabel: 'API Docs', icon: Key },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#161B22]/90 border-b border-[#30363D] backdrop-blur-xl transition-all">
      <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2">

          {/* Left: Brand Logo & Title */}
          <div className="shrink-0 flex items-center">
            <div className="flex items-center space-x-2.5 cursor-pointer select-none group" onClick={() => setViewMode('landing')}>
              <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#21262D] border border-[#30363D] group-hover:border-[#C7ED3D] p-[2px] shadow-md group-hover:scale-105 transition-all shrink-0 overflow-hidden">
                <img src={logoImg} alt="NameLens AI Logo" className="w-full h-full object-cover rounded-[10px]" />
              </div>
              <div className="truncate">
                <h1 className="font-extrabold text-base sm:text-lg lg:text-xl tracking-tight text-[#F0F6FC] font-['Outfit'] truncate leading-none">
                  Name<span className="text-[#C7ED3D]">Lens</span>
                </h1>
                <p className="text-[10px] text-[#8B949E] font-medium hidden 2xl:block truncate">Developer Intelligence Platform</p>
              </div>
            </div>
          </div>

          {/* Center: Desktop Navigation Bar */}
          <div className="hidden md:flex flex-1 items-center justify-center min-w-0 px-1 sm:px-2">
            <nav className="flex items-center space-x-0.5 lg:space-x-1 bg-[#0D1117] p-1 rounded-2xl border border-[#30363D] shadow-xl max-w-full overflow-x-auto no-scrollbar">
              {/* Home Tab */}
              <button
                onClick={() => setViewMode('landing')}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap shrink-0 ${
                  viewMode === 'landing'
                    ? 'bg-[#21262D] text-[#C7ED3D] border border-[#C7ED3D]/50 shadow-sm'
                    : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#161B22]'
                }`}
              >
                <Home className="w-3.5 h-3.5 text-[#C7ED3D] shrink-0" />
                <span>Home</span>
              </button>

              <div className="h-3.5 w-[1px] bg-[#30363D] shrink-0 mx-0.5"></div>

              {/* Workspace Navigation Sub-Tabs */}
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = viewMode === 'app' && activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setViewMode('app');
                      setActiveTab(tab.id);
                    }}
                    className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#21262D] text-[#C7ED3D] border border-[#C7ED3D]/50 shadow-sm'
                        : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#161B22]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#C7ED3D]' : 'text-[#8B949E]'}`} />
                    <span className="hidden min-[1600px]:inline">{tab.label}</span>
                    <span className="min-[1600px]:hidden">{tab.shortLabel}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: User Auth Section & Profile */}
          <div className="shrink-0 flex items-center justify-end">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#161B22] border border-[#30363D] hover:border-[#C7ED3D] transition focus:outline-none shadow-md"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#21262D] border border-[#30363D] flex items-center justify-center text-[#C7ED3D] text-xs font-extrabold shadow-sm overflow-hidden shrink-0">
                    {user.avatar && (user.avatar.startsWith('data:image/') || user.avatar.startsWith('http')) ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user.avatar || (user.name ? user.name[0].toUpperCase() : 'U')
                    )}
                  </div>
                  <div className="text-left hidden lg:block">
                    <div className="text-xs font-bold text-[#F0F6FC] leading-tight truncate max-w-[100px]">{user.name}</div>
                    <div className="text-[10px] text-[#C7ED3D] font-medium truncate max-w-[100px]">{user.role || 'Member'}</div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#8B949E] transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#161B22] rounded-xl p-1.5 border border-[#30363D] shadow-2xl z-50 animate-fadeIn">
                    <div className="px-3 py-2 border-b border-[#30363D] mb-1 lg:hidden">
                      <div className="text-xs font-bold text-[#F0F6FC]">{user.name}</div>
                      <div className="text-[10px] text-[#C7ED3D]">{user.role || 'Member'}</div>
                    </div>
                    <button
                      onClick={() => { onOpenProfile(); setUserMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[#F0F6FC] hover:bg-[#21262D] hover:text-[#C7ED3D] flex items-center space-x-2 transition"
                    >
                      <User className="w-4 h-4 text-[#C7ED3D]" />
                      <span>Profile Settings</span>
                    </button>
                    <div className="my-1 border-t border-[#30363D]"></div>
                    <button
                      onClick={() => { onLogout(); setUserMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[#F85149] hover:bg-[#F85149]/10 flex items-center space-x-2 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-1.5 rounded-xl bg-[#C7ED3D] hover:bg-[#D4F455] text-[#0D1117] font-extrabold text-xs shadow-lg shadow-[#C7ED3D]/25 transition flex items-center space-x-1.5 shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 text-[#0D1117]" />
                <span>Log In</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile / Compact Navigation Bar (<768px) */}
        <div className="md:hidden flex items-center overflow-x-auto space-x-1.5 py-1.5 px-0.5 border-t border-[#30363D] no-scrollbar">
          <button
            onClick={() => setViewMode('landing')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition ${
              viewMode === 'landing' ? 'bg-[#21262D] text-[#C7ED3D] border border-[#C7ED3D]/50' : 'text-[#8B949E] hover:text-[#F0F6FC]'
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
                  setViewMode('app');
                  setActiveTab(tab.id);
                }}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition ${
                  isActive ? 'bg-[#21262D] text-[#C7ED3D] border border-[#C7ED3D]/50' : 'text-[#8B949E] hover:text-[#F0F6FC]'
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
