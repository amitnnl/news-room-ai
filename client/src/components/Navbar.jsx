import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Sparkles, 
  Terminal, 
  Zap, 
  Globe, 
  Bell, 
  Coins, 
  Flame, 
  Cpu, 
  ShieldCheck,
  LogOut,
  Share2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NewsAPI from '../services/api';

export default function Navbar({ onOpenCommandCenter }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    activeProvider: 'gemini',
    model: 'gemini-2.5-flash',
    aiSpendToday: 0.42,
    aiDailyBudget: 15.00
  });

  useEffect(() => {
    NewsAPI.getOverview().then(res => {
      if (res?.stats) {
        setStats(res.stats);
      }
    }).catch(() => {});
  }, []);

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const spendPercent = Math.min(100, Math.round((stats.aiSpendToday / (stats.aiDailyBudget || 1)) * 100));

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Brand Identity */}
      <div className="flex items-center gap-4">
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                BHARAT PULSE
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-red-600/20 text-red-400 border border-red-500/30">
                AI NEWSROOM
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Live Multi-Agent Broadcast Engine
            </p>
          </div>
        </div>

        {/* AI Provider & Active Model Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Engine:</span>
          <span className="font-semibold text-slate-200 capitalize">
            {stats.activeProvider} ({stats.model})
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        </div>
      </div>

      {/* Center Search / Command Center Launcher */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <button
          onClick={onOpenCommandCenter}
          className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 text-xs hover:border-slate-700 hover:text-slate-200 transition-all shadow-inner group"
        >
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>AI Newsroom Command: "Create breaking story...", "Show pending"</span>
          </div>
          <kbd className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* All-in-One Social Setup Direct Link */}
        <button
          onClick={() => navigate('/setup')}
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 text-xs font-semibold transition-all"
          title="Single Platform Social Configurations"
        >
          <Share2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Platform Setup</span>
        </button>

        {/* AI Budget Meter */}
        <div 
          onClick={() => navigate('/settings')}
          className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
          title="Daily AI spending limit"
        >
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <div className="text-right">
            <div className="text-[10px] text-slate-400">AI Daily Spend</div>
            <div className="text-xs font-semibold text-slate-200">
              ${stats.aiSpendToday?.toFixed(2)} <span className="text-slate-500 font-normal">/ ${stats.aiDailyBudget?.toFixed(2)}</span>
            </div>
          </div>
          <div className="w-12 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                spendPercent > 80 ? 'bg-red-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${spendPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Breaking News Fast Trigger */}
        <button
          onClick={() => navigate('/breaking-studio')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-600/25 transition-all transform hover:-translate-y-0.5"
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Breaking Alert</span>
        </button>

        {/* Public Website Preview */}
        <button
          onClick={() => navigate('/public')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 text-xs font-medium transition-all"
          title="Open Public News Portal"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Public CMS</span>
        </button>

        {/* Authenticated Editor Profile & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <img 
            src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
            alt={user?.name || "Editor"} 
            className="w-8 h-8 rounded-full ring-2 ring-red-500/30 object-cover"
          />
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-200 leading-tight">
              {user?.name || 'Dev Sharma'}
            </div>
            <div className="text-[10px] text-red-400 font-semibold uppercase leading-none">
              {user?.role ? user.role.replace('_', ' ') : 'SUPER ADMIN'}
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
            title="Sign Out of Newsroom"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

