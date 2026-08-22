import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Cpu, 
  Layers, 
  BarChart3, 
  BookOpen, 
  FileSpreadsheet, 
  ShieldCheck,
  Radio,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

export type NavTab = 
  | 'playground' 
  | 'spectrum' 
  | 'fuzzy-engine' 
  | 'neural-net' 
  | 'live-stream' 
  | 'benchmarks' 
  | 'theory' 
  | 'batch' 
  | 'mitigation';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  systemStatus: {
    threatLevel: 'Low' | 'Elevated' | 'Critical';
    activePacketsCount: number;
  };
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, systemStatus }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string; desc: string }[] = [
    { id: 'playground', label: 'Classifier Sandbox', icon: <Cpu className="w-4 h-4" />, badge: 'Live AI', desc: 'Real-time soft computing testing' },
    { id: 'spectrum', label: 'Attack Spectrum', icon: <Layers className="w-4 h-4" />, desc: 'MITRE mapped taxonomy matrix' },
    { id: 'neural-net', label: 'Neural Graph', icon: <Activity className="w-4 h-4" />, desc: 'Live MLP activations' },
    { id: 'fuzzy-engine', label: 'Fuzzy Logic (FIS)', icon: <Layers className="w-4 h-4" />, desc: 'Mamdani membership curves' },
    { id: 'live-stream', label: 'Threat Radar', icon: <Radio className="w-4 h-4 animate-pulse text-cyan-400" />, badge: 'Live', desc: 'Real-time packet stream' },
    { id: 'benchmarks', label: 'Benchmarks', icon: <BarChart3 className="w-4 h-4" />, desc: 'Soft vs Crisp model comparisons' },
    { id: 'batch', label: 'Batch Audit', icon: <FileSpreadsheet className="w-4 h-4" />, desc: 'Multi-flow CSV evaluations' },
    { id: 'mitigation', label: 'Defense Playbook', icon: <ShieldCheck className="w-4 h-4" />, desc: 'Automated firewall & rules' },
    { id: 'theory', label: 'Theory Blueprint', icon: <BookOpen className="w-4 h-4" />, desc: 'Mathematical formulations' },
  ];

  const handleTabClick = (id: NavTab) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#070b14]/95 backdrop-blur-xl border-b border-cyan-500/20 shadow-2xl shadow-cyan-950/30">
      {/* Top Banner / System Ticker */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-3 sm:px-4 py-1.5 border-b border-cyan-500/10 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 sm:gap-3 truncate">
          <span className="flex h-2 w-2 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-cyan-400 font-semibold tracking-wider truncate">CYBERSPECTRUM-AI</span>
          <span className="text-slate-500 hidden md:inline">|</span>
          <span className="text-slate-400 hidden lg:inline">SOFT COMPUTING CYBER ATTACK CLASSIFIER</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-500 hidden sm:inline">STATE:</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              systemStatus.threatLevel === 'Critical' 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse' 
                : systemStatus.threatLevel === 'Elevated'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {systemStatus.threatLevel}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-slate-400 text-[11px]">
            <span className="text-cyan-400 font-semibold">{systemStatus.activePacketsCount.toLocaleString()} pkts/s</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-2">
        <div className="flex items-center gap-2.5 cursor-pointer flex-shrink-0" onClick={() => handleTabClick('playground')}>
          <div className="p-2 bg-cyan-950/60 rounded-lg border border-cyan-500/40 shadow-lg shadow-cyan-500/10">
            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 animate-pulse-glow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold tracking-wider text-base sm:text-lg bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                CyberSpectrum<span className="text-cyan-400">.AI</span>
              </h1>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                v2.4
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono hidden sm:block">
              Soft Computing Cyber Attack Spectrum Classification
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap relative ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono uppercase ${
                    isActive ? 'bg-cyan-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile & Tablet Hamburger Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Active Tab Pill Indicator on Mobile */}
          <div className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="truncate max-w-[110px] sm:max-w-[180px]">
              {navItems.find(n => n.id === activeTab)?.label}
            </span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0f1d]/98 border-b border-cyan-500/30 px-4 py-4 max-h-[80vh] overflow-y-auto space-y-2 shadow-2xl backdrop-blur-2xl">
          <div className="text-[11px] font-mono text-slate-500 uppercase px-2 pb-1">
            Select Module Navigation:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`p-3 rounded-xl text-left transition-all flex items-center justify-between border ${
                    isActive
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-cyan-500/30 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${
                      isActive ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-900 text-cyan-400 border-slate-800'
                    }`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono">{item.label}</span>
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block">{item.desc}</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
