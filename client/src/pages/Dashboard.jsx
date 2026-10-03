import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Flame, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Eye, 
  TrendingUp, 
  Share2, 
  ArrowRight, 
  AlertTriangle, 
  ExternalLink,
  Coins,
  Cpu,
  RefreshCw,
  Plus
} from 'lucide-react';
import NewsAPI from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await NewsAPI.getOverview();
      setData(res);
    } catch (err) {
      console.error('Failed to load overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading && !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-medium">Syncing AI Newsroom State...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const topStories = data?.topStories || [];
  const recentActivity = data?.recentActivity || [];
  const platforms = data?.platformMetrics || {};

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Banner / Newsroom Status Bar */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px] tracking-wider uppercase">
              LIVE OPERATION
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Engine: {stats.activeProvider?.toUpperCase()} • {stats.model}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            AI Newsroom Central Command
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Autonomous multi-agent news verification, automated bilingual writing, graphics & short video production, and multi-channel publishing to WhatsApp, Instagram, Facebook & YouTube.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3 z-10 shrink-0">
          <button
            onClick={() => navigate('/one-click')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>One-Click AI Studio</span>
          </button>
          <button
            onClick={() => navigate('/breaking-studio')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-red-500/40 hover:bg-red-950/40 text-red-400 font-bold text-xs transition-all"
          >
            <Flame className="w-4 h-4" />
            <span>Breaking Alert</span>
          </button>
        </div>
      </div>

      {/* Unified Multi-Platform Quick Status Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Single-Platform Social & Broadcast Network</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Facebook, Instagram, WhatsApp Cloud API, YouTube & Twitter/X configurations managed on 1 unified hub.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1877F2]"></span>
            <span>Facebook</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Instagram</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]"></span>
            <span>WhatsApp</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            <span>YouTube</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>Twitter/X</span>
          </div>

          <button
            onClick={() => navigate('/setup')}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-600/15 hover:bg-red-600/25 border border-red-500/30 text-red-400 hover:text-red-300 text-[11px] font-bold transition-all ml-1 cursor-pointer"
          >
            <span>Single-Platform Setup</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Total Articles */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Stories</span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.totalArticles}</div>
          <div className="text-[11px] text-slate-500">{stats.publishedArticles} Published</div>
        </div>

        {/* Pending Approval */}
        <div 
          onClick={() => navigate('/articles?status=under_review')}
          className="glass-panel glass-panel-hover p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 cursor-pointer space-y-1"
        >
          <div className="flex items-center justify-between text-amber-400 text-xs font-semibold">
            <span>Needs Review</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-amber-300">{stats.pendingReview}</div>
          <div className="text-[11px] text-amber-400/80">Pending Editor Approval</div>
        </div>

        {/* Breaking News */}
        <div 
          onClick={() => navigate('/articles?is_breaking=true')}
          className="glass-panel glass-panel-hover p-4 rounded-xl border border-red-500/30 bg-red-500/5 cursor-pointer space-y-1"
        >
          <div className="flex items-center justify-between text-red-400 text-xs font-semibold">
            <span>Breaking Alerts</span>
            <Flame className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-red-300">{stats.breakingNews}</div>
          <div className="text-[11px] text-red-400/80">Fast-Track Stories</div>
        </div>

        {/* Social Posts */}
        <div 
          onClick={() => navigate('/social')}
          className="glass-panel glass-panel-hover p-4 rounded-xl border border-slate-800 cursor-pointer space-y-1"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Social Posts</span>
            <Share2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.totalSocialPosts}</div>
          <div className="text-[11px] text-emerald-400">{stats.publishedSocial} Dispatched</div>
        </div>

        {/* Total Views */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Readers</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{Number(stats.totalViews).toLocaleString()}</div>
          <div className="text-[11px] text-slate-500">Across Portal & RSS</div>
        </div>

        {/* AI Daily Spend */}
        <div 
          onClick={() => navigate('/settings')}
          className="glass-panel glass-panel-hover p-4 rounded-xl border border-slate-800 cursor-pointer space-y-1"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>AI Cost Today</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">
            ${stats.aiSpendToday?.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500">Limit: ${stats.aiDailyBudget?.toFixed(2)}</div>
        </div>
      </div>

      {/* Social Media Distribution Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Share2 className="w-4 h-4 text-red-500" />
            Connected Distribution Channels
          </h2>
          <button 
            onClick={() => navigate('/social')}
            className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
          >
            <span>Manage Adapters & Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Meta Facebook */}
          <div className="glass-panel p-3.5 rounded-xl border border-blue-600/30 bg-blue-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-blue-400">Facebook</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="text-lg font-black text-white">{platforms.facebook?.reach || '184.2K'}</div>
            <div className="text-[10px] text-slate-400">{platforms.facebook?.followers} page fans</div>
          </div>

          {/* Instagram */}
          <div className="glass-panel p-3.5 rounded-xl border border-pink-600/30 bg-pink-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-pink-400">Instagram</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="text-lg font-black text-white">{platforms.instagram?.reach || '242.0K'}</div>
            <div className="text-[10px] text-slate-400">{platforms.instagram?.likes} likes</div>
          </div>

          {/* WhatsApp Cloud API */}
          <div className="glass-panel p-3.5 rounded-xl border border-emerald-600/30 bg-emerald-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-emerald-400">WhatsApp</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="text-lg font-black text-white">{platforms.whatsapp?.delivered || '44.1K'}</div>
            <div className="text-[10px] text-slate-400">{platforms.whatsapp?.subscribers} alerts</div>
          </div>

          {/* YouTube Shorts */}
          <div className="glass-panel p-3.5 rounded-xl border border-red-600/30 bg-red-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-red-400">YouTube</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="text-lg font-black text-white">{platforms.youtube?.views || '310.5K'}</div>
            <div className="text-[10px] text-slate-400">{platforms.youtube?.subscribers} subs</div>
          </div>

          {/* Telegram */}
          <div className="glass-panel p-3.5 rounded-xl border border-sky-600/30 bg-sky-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-sky-400">Telegram</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="text-lg font-black text-white">{platforms.telegram?.views || '68.0K'}</div>
            <div className="text-[10px] text-slate-400">{platforms.telegram?.members} members</div>
          </div>

          {/* Twitter / X */}
          <div className="glass-panel p-3.5 rounded-xl border border-slate-700 bg-slate-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-300">Twitter / X</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="text-lg font-black text-white">{platforms.twitter?.impressions || '94.2K'}</div>
            <div className="text-[10px] text-slate-400">{platforms.twitter?.followers} followers</div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Split: Top Stories & Live Agent Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Top Performing News Stories */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Top Performing Stories
              </h2>
              <p className="text-xs text-slate-400">Most engaged fact-checked publications</p>
            </div>
            <button
              onClick={() => navigate('/articles')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium"
            >
              <span>View All CMS Stories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topStories.map((story) => (
              <div
                key={story.id}
                onClick={() => navigate(`/editorial?id=${story.id}`)}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 cursor-pointer transition-all flex items-start justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    {story.is_breaking ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-600 text-white">
                        BREAKING
                      </span>
                    ) : null}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      story.status === 'published' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      story.status === 'under_review' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {story.status}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(story.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-red-400 transition-colors line-clamp-2">
                    {story.title}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-white flex items-center justify-end gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>{Number(story.view_count).toLocaleString()}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Direct Reads</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Live AI Newsroom Activity Stream */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Newsroom Audit Feed
              </h2>
              <p className="text-xs text-slate-400">Accountability & compliance trail</p>
            </div>
            <button
              onClick={() => navigate('/audit')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Full Log
            </button>
          </div>

          <div className="space-y-3">
            {recentActivity.slice(0, 6).map((log) => (
              <div 
                key={log.id}
                className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-300">{log.user_name || 'System Agent'}</span>
                  <span className="text-slate-500">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-cyan-400 uppercase">{log.action}</div>
                <p className="text-slate-400 text-[11px] line-clamp-2 leading-relaxed">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
