import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Sparkles, 
  X, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Flame,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NewsAPI from '../services/api';

const samplePrompts = [
  "Create a news story about today's Haryana rapid metro corridor",
  "Show articles waiting for fact checking or editorial review",
  "Find trending technology stories and convert highest score",
  "Draft a 60-second YouTube Short on ISRO engine hot-test",
  "Generate social media posts for today's published stories"
];

export default function CommandCenterModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (textToSubmit) => {
    const queryText = textToSubmit || prompt;
    if (!queryText.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await NewsAPI.executeCommand(queryText.trim());
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-black/80 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">AI Newsroom Command Center</h2>
              <p className="text-[11px] text-slate-400">Natural-language newsroom operation orchestrator</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800">
          <div className="relative flex items-center">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="What would you like the newsroom agents to do right now?..."
              className="w-full pl-4 pr-24 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              autoFocus
            />
            <button
              onClick={() => handleSubmit()}
              disabled={loading || !prompt.trim()}
              className="absolute right-2 px-4 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Thinking</span>
                </>
              ) : (
                <>
                  <span>Run</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Quick Suggestions */}
          {!result && !loading && (
            <div className="mt-4 space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Suggested Commands
              </div>
              <div className="flex flex-wrap gap-2">
                {samplePrompts.map((sp, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(sp);
                      handleSubmit(sp);
                    }}
                    className="text-left text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{sp}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Output Area */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-3">
          {loading && (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center animate-spin">
                <Sparkles className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-sm font-semibold text-white">Agent Team Orchestrating Command...</p>
              <p className="text-xs text-slate-400">Checking facts, querying databases, composing news assets</p>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span className="font-semibold">{result.message}</span>
                </div>
                {result.articleId && (
                  <button
                    onClick={() => {
                      onClose();
                      navigate(`/editorial?id=${result.articleId}`);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
                  >
                    <span>Open in Studio</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Created article details */}
              {result.data?.package && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white text-sm">{result.data.package.article.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{result.data.package.article.summary}</p>
                  <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-500 border-t border-slate-900">
                    <span>⚡ Processed in: {result.data.timeTakenSec}s</span>
                    <span>🛡️ Fact Check: {result.data.package.factCheck.verification_status}</span>
                    <span>📑 Key Points: {result.data.package.article.key_points?.length || 4}</span>
                  </div>
                </div>
              )}

              {/* Pending articles list */}
              {result.articles && (
                <div className="space-y-2">
                  {result.articles.map((art) => (
                    <div 
                      key={art.id}
                      onClick={() => {
                        onClose();
                        navigate(`/editorial?id=${art.id}`);
                      }}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="text-xs font-semibold text-white">{art.title}</div>
                        <div className="text-[10px] text-amber-400 font-mono mt-0.5">Status: {art.status}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Trends list */}
              {result.trends && (
                <div className="space-y-2">
                  {result.trends.map((t) => (
                    <div 
                      key={t.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-semibold text-white">{t.topic}</div>
                        <div className="text-[10px] text-slate-400">Score: {t.trend_score}/100 • {t.category}</div>
                      </div>
                      <button
                        onClick={async () => {
                          setLoading(true);
                          try {
                            const conv = await NewsAPI.convertTrend(t.id);
                            onClose();
                            navigate(`/editorial?id=${conv.result.articleId}`);
                          } catch (e) {
                            setError(e.message);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold"
                      >
                        Generate Story
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
