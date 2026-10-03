import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Rss, 
  TrendingUp, 
  RefreshCw, 
  Sparkles, 
  ExternalLink, 
  Plus, 
  CheckCircle2, 
  Flame,
  Radio,
  ArrowRight,
  Loader2
} from 'lucide-react';
import NewsAPI from '../services/api';

export default function TrendingRss() {
  const navigate = useNavigate();
  const [sources, setSources] = useState([]);
  const [items, setItems] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingRss, setFetchingRss] = useState(false);
  const [convertingId, setConvertingId] = useState(null);
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceName, setNewSourceName] = useState('');

  const loadAll = async () => {
    setLoading(true);
    try {
      const [srcRes, itemsRes, trendsRes] = await Promise.all([
        NewsAPI.getRssSources(),
        NewsAPI.getRssItems(),
        NewsAPI.getTrends()
      ]);
      setSources(srcRes.sources || []);
      setItems(itemsRes.items || []);
      setTrends(trendsRes.trends || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleFetchFeeds = async () => {
    setFetchingRss(true);
    try {
      const res = await NewsAPI.fetchRssLive();
      alert(res.message);
      loadAll();
    } catch (err) {
      alert('RSS Fetch error: ' + err.message);
    } finally {
      setFetchingRss(false);
    }
  };

  const handleConvertRss = async (id) => {
    setConvertingId(`rss_${id}`);
    try {
      const res = await NewsAPI.convertRssItem(id);
      navigate(`/editorial?id=${res.result.articleId}`);
    } catch (err) {
      alert('Conversion failed: ' + err.message);
    } finally {
      setConvertingId(null);
    }
  };

  const handleConvertTrend = async (id) => {
    setConvertingId(`trend_${id}`);
    try {
      const res = await NewsAPI.convertTrend(id);
      navigate(`/editorial?id=${res.result.articleId}`);
    } catch (err) {
      alert('Conversion failed: ' + err.message);
    } finally {
      setConvertingId(null);
    }
  };

  const handleAddSource = async (e) => {
    e.preventDefault();
    if (!newSourceName || !newSourceUrl) return;
    try {
      await NewsAPI.addRssSource({ name: newSourceName, url: newSourceUrl, category: 'National' });
      setNewSourceName('');
      setNewSourceUrl('');
      loadAll();
      alert('New RSS feed source registered!');
    } catch (err) {
      alert('Failed to add source: ' + err.message);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-amber-400" />
            Trending Radar & Automated RSS Ingestion
          </h1>
          <p className="text-xs text-slate-400">
            Continuously ingest real wire feeds and identify viral national topics for automated AI synthesis.
          </p>
        </div>

        <button
          onClick={handleFetchFeeds}
          disabled={fetchingRss}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-red-600/20 disabled:opacity-50"
        >
          {fetchingRss ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Ingesting Wire Feeds...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Fetch Live RSS Wire</span>
            </>
          )}
        </button>
      </div>

      {/* TOP SECTION: TRENDING TOPICS RADAR */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Flame className="w-4 h-4 text-red-500" />
          Active Trending Topics Radar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trends.map((t) => (
            <div
              key={t.id}
              className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Trend Score: {t.trend_score}/100
                  </span>
                  <span className="text-[10px] text-slate-400">{t.potential_audience} Reach</span>
                </div>
                <h3 className="font-bold text-sm text-white line-clamp-2">{t.topic}</h3>
                <div className="text-[11px] text-slate-400">Category: {t.category} • {t.source_count} Citations</div>
              </div>

              <button
                onClick={() => handleConvertTrend(t.id)}
                disabled={convertingId === `trend_${t.id}`}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-red-500 hover:bg-red-600/10 text-white font-bold text-xs transition-all"
              >
                {convertingId === `trend_${t.id}` ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>Convert to AI News Story</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM SECTION: RSS FEEDS & RECENT FEED ITEMS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 col: Registered RSS Sources & Quick Add */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Rss className="w-4 h-4 text-cyan-400" />
              Connected Wire Feeds
            </h3>

            <div className="space-y-2">
              {sources.map(s => (
                <div key={s.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-0.5">
                  <div className="font-bold text-white truncate">{s.name}</div>
                  <div className="text-[10px] text-cyan-400 font-mono truncate">{s.url}</div>
                </div>
              ))}
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleAddSource} className="space-y-2 pt-3 border-t border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Add RSS Source</div>
              <input
                type="text"
                value={newSourceName}
                onChange={e => setNewSourceName(e.target.value)}
                placeholder="Source Name (e.g. PIB Regional)"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
              <input
                type="url"
                value={newSourceUrl}
                onChange={e => setNewSourceUrl(e.target.value)}
                placeholder="Feed URL (https://...)"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
              <button
                type="submit"
                className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
              >
                Register Feed
              </button>
            </form>
          </div>
        </div>

        {/* Right 2 cols: Ingested Wire Items */}
        <div className="lg:col-span-2 space-y-3">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Live Ingested Wire Items</h3>
                <p className="text-xs text-slate-400">Click to convert wire item into verified news package</p>
              </div>
              <span className="text-xs text-slate-500 font-mono">{items.length} items logged</span>
            </div>

            <div className="space-y-3">
              {items.map(item => (
                <div 
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                        {item.source_name || 'Wire'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.published_date ? new Date(item.published_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-100 line-clamp-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{item.summary}</p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => handleConvertRss(item.id)}
                      disabled={convertingId === `rss_${item.id}`}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-[11px] flex items-center gap-1 shadow"
                    >
                      {convertingId === `rss_${item.id}` ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      <span>Draft AI Story</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
