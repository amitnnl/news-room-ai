import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, 
  AlertTriangle, 
  Send, 
  ShieldAlert, 
  CheckCircle2, 
  Radio, 
  Share2, 
  Sparkles,
  Loader2,
  Clock
} from 'lucide-react';
import NewsAPI from '../services/api';

export default function BreakingNewsStudio() {
  const navigate = useNavigate();
  const [breakingTopic, setBreakingTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [breakingResult, setBreakingResult] = useState(null);

  const handleStartEmergency = () => {
    if (!breakingTopic.trim()) return;
    setShowConfirmModal(true);
  };

  const handleConfirmPublish = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      const res = await NewsAPI.triggerBreakingNews({
        topic: breakingTopic.trim(),
        categoryId: 1,
        language: 'hi'
      });
      setBreakingResult(res);
    } catch (err) {
      alert('Breaking news dispatch failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Alert Header */}
      <div className="glass-panel p-6 rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-950 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/40 animate-pulse">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-red-600 text-white font-extrabold text-[10px] tracking-widest uppercase">
                EMERGENCY DESK
              </span>
              <span className="text-xs text-red-400 font-mono">Breaking News Fast-Track Workflow</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">
              High-Velocity Breaking Alert Broadcast
            </h1>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2 max-w-2xl">
          Instantly triggers fact verification, writes a high-urgency 1-line headline, formats WhatsApp Cloud broadcasts, staged social posts, and queues immediate alerts.
        </p>
      </div>

      {/* Input Form */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-bold text-red-400 uppercase tracking-wider mb-2">
            Breaking News Event or Wire Update:
          </label>
          <input
            type="text"
            value={breakingTopic}
            onChange={(e) => setBreakingTopic(e.target.value)}
            placeholder="e.g. Major accident on Delhi-Jaipur highway disrupts traffic; emergency response deployed..."
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-red-900/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span>
            Compliance Check: Dual-confirmation required prior to broadcast to prevent misinformation or panic.
          </span>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleStartEmergency}
            disabled={loading || !breakingTopic.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 disabled:opacity-50 text-white font-black text-sm shadow-xl shadow-red-600/40 transition-all transform hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Broadcasting Fast-Track...</span>
              </>
            ) : (
              <>
                <Flame className="w-4 h-4" />
                <span>INITIATE BREAKING NEWS PIPELINE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Broadcast Result Deck */}
      {breakingResult && (
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/10 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Breaking Package Assembled (# {breakingResult.articleId})</span>
            </div>
            <button
              onClick={() => navigate(`/editorial?id=${breakingResult.articleId}`)}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Open in Editorial Studio
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-[11px] font-mono text-red-400 font-bold uppercase">1-Line Breaking Alert:</div>
            <div className="text-base font-bold text-white">
              {breakingResult.package?.seo?.headlines?.breaking || breakingResult.package?.article?.title}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {breakingResult.package?.article?.summary}
            </p>
          </div>

          {/* Staged Broadcast Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-400">WhatsApp Broadcast</span>
              <p className="text-[11px] text-slate-300 line-clamp-3">
                {breakingResult.package?.social?.whatsapp?.message}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-blue-400">Facebook Alert</span>
              <p className="text-[11px] text-slate-300 line-clamp-3">
                {breakingResult.package?.social?.facebook?.post_text}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-red-400">YouTube Short</span>
              <p className="text-[11px] text-slate-300 line-clamp-3">
                {breakingResult.package?.video?.title}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-red-500/50 shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Confirm Breaking News Trigger?</h3>
              <p className="text-xs text-slate-400">
                You are about to launch an emergency breaking alert. AI will synthesize all sources and queue multi-channel distribution.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 text-xs text-slate-300 italic border border-slate-800 text-center">
              "{breakingTopic}"
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="w-1/2 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPublish}
                className="w-1/2 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg shadow-red-600/40"
              >
                Yes, Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
