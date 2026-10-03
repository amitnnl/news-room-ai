import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sparkles, 
  Columns3, 
  Flame, 
  FileText, 
  Share2, 
  Clapperboard, 
  Rss, 
  CalendarDays, 
  Sliders, 
  ShieldCheck, 
  Globe,
  Radio,
  Cpu,
  Rocket
} from 'lucide-react';

const navItems = [
  { group: 'CORE WORKFLOWS', items: [
    { label: 'Newsroom Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Setup Wizard', path: '/wizard', icon: Rocket, badge: 'WIZARD', badgeColor: 'bg-gradient-to-r from-red-600 to-amber-500' },
    { label: 'One-Click AI Studio', path: '/one-click', icon: Sparkles, badge: 'AUTO' },
    { label: 'Editorial 3-Col Studio', path: '/editorial', icon: Columns3 },
    { label: 'Breaking News Alert', path: '/breaking-studio', icon: Flame, badgeColor: 'bg-red-500' }
  ]},
  { group: 'CONTENT & PUBLISHING', items: [
    { label: 'Platform Integrations', path: '/setup', icon: Share2, badge: 'ALL-IN-1', badgeColor: 'bg-gradient-to-r from-emerald-500 to-teal-600' },
    { label: 'Articles CMS', path: '/articles', icon: FileText },
    { label: 'Social Distribution', path: '/social', icon: Radio },
    { label: 'Shorts & Video Studio', path: '/video-studio', icon: Clapperboard },
    { label: 'Trending & RSS Feeds', path: '/rss-trends', icon: Rss },
    { label: 'Content Calendar', path: '/calendar', icon: CalendarDays }
  ]},
  { group: 'SYSTEM & COMPLIANCE', items: [
    { label: 'AI Models & Budget', path: '/settings', icon: Sliders },
    { label: 'Audit Trail & Logs', path: '/audit', icon: ShieldCheck },
    { label: 'Public News Portal', path: '/public', icon: Globe, external: true }
  ]}
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/70 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 flex-1 space-y-6">
        {navItems.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1.5">
            <h3 className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {group.group}
            </h3>
            <div className="space-y-1">
              {group.items.map((item, iIdx) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={iIdx}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-red-600/15 text-red-400 border border-red-500/30 shadow-sm font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded text-white ${item.badgeColor || 'bg-gradient-to-r from-red-600 to-amber-500'}`}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-900 text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-400 font-medium">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            9 Agents Active
          </span>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            ONLINE
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-tight">
          Fact-Checked AI News Automation for WhatsApp, IG, FB & YT.
        </p>
      </div>
    </aside>
  );
}
