import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  ExternalLink,
  MessageSquare,
  Video,
  Copy,
  Check,
  RefreshCw,
  Calendar,
  Loader2
} from 'lucide-react';
import NewsAPI from '../services/api';

export default function SocialPublishing() {
  const [accounts, setAccounts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState(null);
  const [scheduleModalPost, setScheduleModalPost] = useState(null);
  const [scheduleTime, setScheduleTime] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [accRes, postRes] = await Promise.all([
        NewsAPI.getSocialAccounts(),
        NewsAPI.getSocialPosts({ platform: selectedPlatform !== 'all' ? selectedPlatform : undefined })
      ]);
      setAccounts(accRes.accounts || []);
      setPosts(postRes.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedPlatform]);

  const handlePublishNow = async (id) => {
    setPublishingId(id);
    try {
      const res = await NewsAPI.publishSocialPost(id);
      setPosts(posts.map(p => p.id === id ? { ...p, status: 'published', external_post_id: res.result.postId } : p));
      alert(`Published successfully to ${res.post.platform}! ID: ${res.result.postId}`);
    } catch (err) {
      alert('Publishing error: ' + err.message);
    } finally {
      setPublishingId(null);
    }
  };

  const handleScheduleSubmit = async () => {
    if (!scheduleModalPost || !scheduleTime) return;
    try {
      await NewsAPI.scheduleSocialPost(scheduleModalPost.id, scheduleTime);
      setPosts(posts.map(p => p.id === scheduleModalPost.id ? { ...p, status: 'scheduled', scheduled_at: scheduleTime } : p));
      setScheduleModalPost(null);
      alert(`Post scheduled for ${scheduleTime}`);
    } catch (err) {
      alert('Scheduling error: ' + err.message);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Share2 className="w-6 h-6 text-purple-400" />
            Multi-Platform Social Distribution Hub
          </h1>
          <p className="text-xs text-slate-400">
            Publish or schedule tailored content across Meta, WhatsApp Business Cloud, YouTube, and X.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Feeds</span>
        </button>
      </div>

      {/* Connected Social Accounts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {accounts.map((acc) => (
          <div key={acc.id} className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold capitalize text-white">{acc.platform}</span>
              <span className={`w-2 h-2 rounded-full ${acc.status === 'connected' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
            </div>
            <div className="text-[11px] text-slate-300 font-semibold truncate">{acc.account_name}</div>
            <div className="text-[10px] text-emerald-400 font-mono">Status: Connected</div>
          </div>
        ))}
      </div>

      {/* Platform Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-bold">
        {['all', 'facebook', 'instagram', 'whatsapp', 'youtube', 'telegram', 'twitter'].map((plat) => (
          <button
            key={plat}
            onClick={() => setSelectedPlatform(plat)}
            className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
              selectedPlatform === plat
                ? 'bg-red-600 text-white font-extrabold shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {plat}
          </button>
        ))}
      </div>

      {/* Posts Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">Loading social queue...</div>
      ) : posts.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800 space-y-2">
          <Share2 className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Social Posts Staged</h3>
          <p className="text-xs text-slate-400">Generate a news story from the One-Click Studio to automatically stage social media posts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <div 
              key={post.id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-lg"
            >
              <div className="space-y-3">
                {/* Platform Tag & Status */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    post.platform === 'facebook' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' :
                    post.platform === 'instagram' ? 'bg-pink-600/20 text-pink-400 border border-pink-500/30' :
                    post.platform === 'whatsapp' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' :
                    post.platform === 'youtube' ? 'bg-red-600/20 text-red-400 border border-red-500/30' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {post.platform} • {post.post_type}
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    post.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' :
                    post.status === 'scheduled' ? 'bg-cyan-500/10 text-cyan-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {post.status}
                  </span>
                </div>

                {/* Related Article Title */}
                {post.article_title && (
                  <div className="text-[10px] text-slate-500 line-clamp-1">
                    Story: {post.article_title}
                  </div>
                )}

                {/* Post Headline / Text */}
                {post.headline && (
                  <h4 className="text-xs font-bold text-white line-clamp-2">
                    {post.headline}
                  </h4>
                )}

                {/* Post Body Preview */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 whitespace-pre-line max-h-48 overflow-y-auto leading-relaxed">
                  {post.body}
                </div>

                {/* Hashtags or CTA */}
                {post.hashtags && (
                  <div className="text-[11px] text-cyan-400 font-mono truncate">
                    {post.hashtags}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500 font-mono">
                  {post.published_at ? `Pub: ${new Date(post.published_at).toLocaleDateString()}` : 'Ready to Dispatch'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setScheduleModalPost(post)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                    title="Schedule post"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handlePublishNow(post.id)}
                    disabled={publishingId === post.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-red-600/20"
                  >
                    {publishingId === post.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Publish</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      {scheduleModalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5 space-y-4">
            <h3 className="font-bold text-sm text-white">Schedule Social Post</h3>
            <p className="text-xs text-slate-400">Choose the target broadcast time for {scheduleModalPost.platform}:</p>
            <input
              type="datetime-local"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setScheduleModalPost(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleSubmit}
                disabled={!scheduleTime}
                className="px-4 py-1.5 rounded-lg bg-red-600 text-xs font-bold text-white disabled:opacity-50"
              >
                Confirm Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
