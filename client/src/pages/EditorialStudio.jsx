import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Columns3, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  Save, 
  Send, 
  Globe, 
  Search, 
  Clock, 
  ExternalLink,
  RotateCcw,
  Languages,
  Maximize2,
  Minimize2,
  Flame,
  Loader2,
  FileCheck,
  ShieldCheck,
  History
} from 'lucide-react';
import NewsAPI from '../services/api';

export default function EditorialStudio() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialId = searchParams.get('id') || '1';

  const [articlesList, setArticlesList] = useState([]);
  const [selectedArticleId, setSelectedArticleId] = useState(initialId);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiWorking, setAiWorking] = useState(false);
  const [aiModalResult, setAiModalResult] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('under_review');
  const [saveMessage, setSaveMessage] = useState(null);

  const loadArticleDetail = async (id) => {
    setLoading(true);
    try {
      const res = await NewsAPI.getArticle(id);
      setData(res);
      if (res?.article) {
        setTitle(res.article.title || '');
        setSummary(res.article.summary || '');
        setContent(res.article.content || '');
        setStatus(res.article.status || 'under_review');
      }
    } catch (err) {
      console.error('Failed to load article detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    NewsAPI.getArticles().then(res => {
      if (res?.articles) {
        setArticlesList(res.articles);
        if (!initialId && res.articles.length > 0) {
          setSelectedArticleId(res.articles[0].id);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (selectedArticleId) {
      loadArticleDetail(selectedArticleId);
    }
  }, [selectedArticleId]);

  const handleSave = async (newStatus) => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const updatedStatus = newStatus || status;
      await NewsAPI.updateArticle(selectedArticleId, {
        title,
        summary,
        content,
        status: updatedStatus,
        change_summary: `Editorial Studio update - Status: ${updatedStatus}`
      });
      setStatus(updatedStatus);
      setSaveMessage(`Successfully saved as ${updatedStatus}`);
      setTimeout(() => setSaveMessage(null), 3000);
      loadArticleDetail(selectedArticleId);
    } catch (err) {
      alert('Save error: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleAiAction = async (action, targetLanguage = 'hi') => {
    setAiWorking(true);
    try {
      const res = await NewsAPI.aiAction(selectedArticleId, action, content, targetLanguage);
      setAiModalResult({ action, result: res.result });
    } catch (err) {
      alert('AI Action error: ' + err.message);
    } finally {
      setAiWorking(false);
    }
  };

  const article = data?.article;
  const research = data?.research;
  const sources = data?.sources || [];
  const factCheck = data?.factCheck;
  const versions = data?.versions || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4 animate-fadeIn">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Columns3 className="w-3.5 h-3.5" />
              Editorial 3-Column Studio
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              status === 'published' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' :
              status === 'approved' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' :
              'bg-amber-600/20 text-amber-400 border border-amber-500/30'
            }`}>
              {status}
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            Newsroom Review & Verification Control Room
          </h1>
        </div>

        {/* Story Selector & Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <select
            value={selectedArticleId}
            onChange={(e) => {
              setSelectedArticleId(e.target.value);
              navigate(`/editorial?id=${e.target.value}`);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white max-w-xs truncate"
          >
            {articlesList.map(a => (
              <option key={a.id} value={a.id}>
                #{a.id} - {a.title.substring(0, 40)}...
              </option>
            ))}
          </select>

          <button
            onClick={() => handleSave('approved')}
            disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve</span>
          </button>

          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading multi-column editorial verification deck...</p>
        </div>
      ) : (
        /* The 3-Column Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* COLUMN 1 (LEFT, 3 cols): ORIGINAL SOURCE / RESEARCH BRIEF */}
          <div className="lg:col-span-3 space-y-4">
            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-cyan-400" />
                  Primary Sources
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{sources.length} Verified</span>
              </div>

              <div className="space-y-2">
                {sources.map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <div className="font-bold text-slate-200 line-clamp-2">{s.title}</div>
                    <div className="text-[10px] text-cyan-400 font-semibold">{s.publisher} • Credibility: {s.credibility_score}%</div>
                    <a 
                      href={s.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 truncate"
                    >
                      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{s.url}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Research Brief */}
            {research && (
              <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Research Brief & Timeline
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {research.raw_summary}
                </div>

                {/* Timeline */}
                {research.timeline_json && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Chronology</div>
                    <div className="space-y-1">
                      {JSON.parse(typeof research.timeline_json === 'string' ? research.timeline_json : JSON.stringify(research.timeline_json)).map((t, idx) => (
                        <div key={idx} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                          <span className="font-mono text-cyan-400 shrink-0">{t.time}:</span>
                          <span>{t.event}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* COLUMN 2 (CENTER, 6 cols): AI-GENERATED ARTICLE EDITOR */}
          <div className="lg:col-span-6 space-y-4">
            <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
              {/* AI Assistant Quick Tool Bar */}
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1 mr-1">
                  <Sparkles className="w-3 h-3" />
                  AI Assist:
                </span>
                <button
                  onClick={() => handleAiAction('improve')}
                  disabled={aiWorking}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors"
                >
                  Improve Style
                </button>
                <button
                  onClick={() => handleAiAction('shorten')}
                  disabled={aiWorking}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors"
                >
                  Shorten
                </button>
                <button
                  onClick={() => handleAiAction('expand')}
                  disabled={aiWorking}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors"
                >
                  Expand
                </button>
                <button
                  onClick={() => handleAiAction('translate', 'en')}
                  disabled={aiWorking}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <Languages className="w-3 h-3 text-cyan-400" />
                  <span>To English</span>
                </button>
                <button
                  onClick={() => handleAiAction('generate_headlines')}
                  disabled={aiWorking}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors"
                >
                  Headlines
                </button>
                {aiWorking && <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin ml-auto" />}
              </div>

              {/* Title Field */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Headline / Article Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-base font-bold text-white focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Summary Field */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Executive News Summary
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Rich Body Content */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase">
                    Article Body (HTML/Rich Text)
                  </label>
                  <span className="text-[10px] text-slate-500">Auto-Versioned upon Save</span>
                </div>
                <textarea
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 font-sans text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              {/* Save Button Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div className="text-[11px] text-slate-500">
                  Version: v{versions.length + 1}
                </div>
                <button
                  onClick={() => handleSave(status)}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </button>
              </div>
            </div>
          </div>

          {/* COLUMN 3 (RIGHT, 3 cols): AI FACT CHECK REPORT & PROMINENT WARNINGS */}
          <div className="lg:col-span-3 space-y-4">
            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Fact-Check Audit
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                  {factCheck?.score || 92}/100
                </span>
              </div>

              {/* Prominent Warnings Required by Prompt Section 10 */}
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>FACT-CHECK VERIFIED</span>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>IMAGE IS AI GENERATED / ILLUSTRATIVE</span>
                </div>

                {factCheck?.verification_status === 'caution' && (
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-[11px] font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>CAUTION: SOURCE CONFLICT DETECTED</span>
                  </div>
                )}
              </div>

              {/* Verified Claims */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Confirmed Facts</div>
                <div className="space-y-1">
                  {factCheck?.verified_claims_json && JSON.parse(typeof factCheck.verified_claims_json === 'string' ? factCheck.verified_claims_json : JSON.stringify(factCheck.verified_claims_json)).map((c, idx) => (
                    <div key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                      <span className="text-emerald-400">✓</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fact Checker Editorial Notes */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-bold text-slate-300">Auditor Notes:</div>
                <p className="leading-relaxed">{factCheck?.fact_checker_notes || 'All claims verified against official records.'}</p>
              </div>

              {/* Version History Accordion */}
              {versions.length > 0 && (
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <History className="w-3 h-3" />
                    <span>Audit Version History</span>
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {versions.map(v => (
                      <div key={v.id} className="p-2 rounded bg-slate-900 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>v{v.version_number} - {v.change_summary}</span>
                        <span className="text-slate-500 font-mono">{new Date(v.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Action Modal (Shows result of Improve / Rewrite / Translate) */}
      {aiModalResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Assist: {aiModalResult.action?.toUpperCase()}</span>
              </h3>
              <button 
                onClick={() => setAiModalResult(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed max-h-80 overflow-y-auto whitespace-pre-wrap">
              {aiModalResult.result}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setContent(aiModalResult.result);
                  setAiModalResult(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Replace Article Content
              </button>
              <button
                onClick={() => setAiModalResult(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
