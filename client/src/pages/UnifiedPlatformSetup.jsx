import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  HelpCircle,
  Eye,
  EyeOff,
  Sparkles,
  Radio,
  Sliders,
  Check,
  Send,
  MessageSquare,
  Video
} from 'lucide-react';
import NewsAPI from '../services/api';

function FacebookIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

function TwitterXIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

export default function UnifiedPlatformSetup() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showTokens, setShowTokens] = useState({});
  const [testingStatus, setTestingStatus] = useState({});

  // Form State for all platforms on single page
  const [platforms, setPlatforms] = useState({
    facebook: {
      accountName: 'Bharat Pulse Official (FB Page)',
      accountId: '104928172910',
      pageId: '104928172910',
      accessToken: '',
      appId: '8910283719',
      status: 'connected',
      followers: '128,400',
      accessMode: 'Meta Graph API v19.0'
    },
    instagram: {
      accountName: '@bharatpulse_news',
      accountId: '17841400291',
      accessToken: '',
      status: 'connected',
      followers: '84,200',
      accessMode: 'Instagram Graph API'
    },
    whatsapp: {
      accountName: 'Bharat Pulse News Alert (Cloud API)',
      accountId: '10982736451',
      phoneNumberId: '10982736451',
      wabaId: '29182374619',
      accessToken: '',
      status: 'connected',
      subscribers: '45,000+',
      verifiedBadge: true
    },
    youtube: {
      accountName: 'Bharat Pulse Media (YouTube)',
      accountId: 'UC_bharatpulse991',
      channelId: 'UC_bharatpulse991',
      apiKey: '',
      uploadPrivacy: 'public',
      status: 'connected',
      subscribers: '210,000'
    },
    twitter: {
      accountName: '@BharatPulseNews',
      accountId: 'BharatPulseNews',
      apiKey: '',
      apiSecret: '',
      bearerToken: '',
      accessToken: '',
      accessSecret: '',
      status: 'connected',
      followers: '67,800'
    },
    telegram: {
      accountName: 'Bharat Pulse Breaking Channel',
      accountId: '@bharatpulsenews',
      botToken: '',
      chatId: '@bharatpulsenews',
      status: 'connected',
      members: '32,500'
    }
  });

  const [aiConfigs, setAiConfigs] = useState({
    default_ai_provider: 'gemini',
    gemini_api_key: '',
    openai_api_key: '',
    gemini_model: 'gemini-2.5-flash',
    openai_model: 'gpt-4o-mini'
  });

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = async () => {
    setLoading(true);
    try {
      const res = await NewsAPI.getUnifiedConfigs();
      if (res?.success) {
        if (res.platforms) {
          setPlatforms(prev => {
            const merged = { ...prev };
            Object.keys(res.platforms).forEach(pKey => {
              if (merged[pKey]) {
                merged[pKey] = { ...merged[pKey], ...res.platforms[pKey] };
              }
            });
            return merged;
          });
        }
        if (res.aiConfigs) {
          setAiConfigs(prev => ({ ...prev, ...res.aiConfigs }));
        }
      }
    } catch (err) {
      console.warn('Failed to load platform configs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (platformKey, field, value) => {
    setPlatforms(prev => ({
      ...prev,
      [platformKey]: {
        ...prev[platformKey],
        [field]: value
      }
    }));
  };

  const toggleShowToken = (key) => {
    setShowTokens(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveAll = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await NewsAPI.saveAllConfigs({
        platforms,
        aiConfigs
      });
      if (res?.success) {
        setSuccessMsg(res.message || 'All platform configurations saved successfully!');
        setTimeout(() => setSuccessMsg(''), 6000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to save configurations');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async (platformKey) => {
    setTestingStatus(prev => ({
      ...prev,
      [platformKey]: { loading: true, result: null }
    }));

    try {
      const res = await NewsAPI.testConnection({
        platform: platformKey,
        config: platforms[platformKey]
      });

      if (res?.success && res.result) {
        setTestingStatus(prev => ({
          ...prev,
          [platformKey]: { loading: false, result: res.result }
        }));
      }
    } catch (err) {
      setTestingStatus(prev => ({
        ...prev,
        [platformKey]: {
          loading: false,
          result: {
            connected: false,
            mode: 'error',
            message: err.response?.data?.message || err.message || 'Connection test failed'
          }
        }
      }));
    }
  };

  const fillSampleCredentials = () => {
    setPlatforms({
      facebook: {
        accountName: 'Bharat Pulse Official (FB Page)',
        accountId: '104928172910',
        pageId: '104928172910',
        accessToken: 'EAABwzLIXnjkBAZCZCp70ZCHxQ2y9v4xP8u...',
        appId: '891028371901',
        status: 'connected',
        followers: '128,400',
        accessMode: 'Meta Graph API v19.0'
      },
      instagram: {
        accountName: '@bharatpulse_news',
        accountId: '17841400291982',
        accessToken: 'IGQVJYeE9qT1dZAWUZAWbXl...',
        status: 'connected',
        followers: '84,200',
        accessMode: 'Instagram Graph API'
      },
      whatsapp: {
        accountName: 'Bharat Pulse News Alert (Cloud API)',
        accountId: '10982736451',
        phoneNumberId: '10982736451',
        wabaId: '291823746198',
        accessToken: 'EAALk0qZ6uX01Zg1M9VdZgLd3H1Jt...',
        status: 'connected',
        subscribers: '45,000+',
        verifiedBadge: true
      },
      youtube: {
        accountName: 'Bharat Pulse Media (YouTube)',
        accountId: 'UC_bharatpulse99182',
        channelId: 'UC_bharatpulse99182',
        apiKey: 'AIzaSyDw5rL-9Vq0mX8t4zL1_eP7K',
        uploadPrivacy: 'public',
        status: 'connected',
        subscribers: '210,000'
      },
      twitter: {
        accountName: '@BharatPulseNews',
        accountId: 'BharatPulseNews',
        apiKey: 'tw_key_9918230198',
        apiSecret: 'tw_sec_K9p1B0iKx6Y7uP8',
        bearerToken: 'AAAAAAAAAAAAAAAAAAAAA...BPNews2026',
        accessToken: '179283710-9b6uY4z2W0xV6Z3iWz2gD8k1',
        accessSecret: 'sec_8bZzR1O3jC0xV6Z3iWz2gD',
        status: 'connected',
        followers: '67,800'
      },
      telegram: {
        accountName: 'Bharat Pulse Breaking Channel',
        accountId: '@bharatpulsenews',
        botToken: 'bot719283719:AAFP7yK9p1B0iKx6Y7uP8bZz',
        chatId: '@bharatpulsenews',
        status: 'connected',
        members: '32,500'
      }
    });

    setSuccessMsg('Sample sandbox credentials filled! Click "Save All Configurations" to commit them.');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-red-500 mb-3" />
        <p className="text-sm">Loading Unified Multi-Platform Configurations...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-red-400 text-xs font-semibold">
            <Share2 className="w-3.5 h-3.5" />
            <span>Single-Screen Broadcast Engine</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Unified Multi-Platform Configuration Hub
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Configure, manage and test all your news distribution channels on a <strong>single unified screen</strong>. When publishing via One-Click AI Studio or Breaking News, all connected channels dispatch simultaneously.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={fillSampleCredentials}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all cursor-pointer shadow-sm"
            title="Populate demo configurations for all platforms"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Auto-Fill Demo Credentials</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving All Platforms...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save All Configurations</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-400 hover:text-white text-xs">Dismiss</button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-red-400 hover:text-white text-xs">Dismiss</button>
        </div>
      )}

      {/* Main Single-Platform Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. FACEBOOK PAGE */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm space-y-5 hover:border-slate-700/80 transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1877F2]/20 border border-[#1877F2]/40 flex items-center justify-center text-[#1877F2]">
                  <FacebookIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Facebook Page</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/30">
                      Meta Graph API v19.0
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Publishes full-length articles, featured media & discussion link</p>
                </div>
              </div>

              <select
                value={platforms.facebook.status}
                onChange={(e) => handleFieldChange('facebook', 'status', e.target.value)}
                className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border transition-colors ${
                  platforms.facebook.status === 'connected'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <option value="connected">Active / Connected</option>
                <option value="disconnected">Paused / Disabled</option>
              </select>
            </div>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Page Name / Title</label>
                  <input
                    type="text"
                    value={platforms.facebook.accountName}
                    onChange={(e) => handleFieldChange('facebook', 'accountName', e.target.value)}
                    placeholder="Bharat Pulse Official"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Facebook Page ID</label>
                  <input
                    type="text"
                    value={platforms.facebook.pageId || platforms.facebook.accountId}
                    onChange={(e) => {
                      handleFieldChange('facebook', 'pageId', e.target.value);
                      handleFieldChange('facebook', 'accountId', e.target.value);
                    }}
                    placeholder="104928172910"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-400">Page Access Token (Permanent / System User)</label>
                  <span className="text-[10px] text-slate-500">Requires `pages_manage_posts`</span>
                </div>
                <div className="relative">
                  <input
                    type={showTokens['fb'] ? 'text' : 'password'}
                    value={platforms.facebook.accessToken || ''}
                    onChange={(e) => handleFieldChange('facebook', 'accessToken', e.target.value)}
                    placeholder="EAABwzLIXnjkBA..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowToken('fb')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showTokens['fb'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Meta App ID (Optional)</label>
                <input
                  type="text"
                  value={platforms.facebook.appId || ''}
                  onChange={(e) => handleFieldChange('facebook', 'appId', e.target.value)}
                  placeholder="8910283719"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Test & Status Bar */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleTestConnection('facebook')}
              disabled={testingStatus['facebook']?.loading}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {testingStatus['facebook']?.loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 text-[#1877F2]" />}
              <span>Test Connection</span>
            </button>

            {testingStatus['facebook']?.result ? (
              <span className={`text-[11px] font-medium flex items-center gap-1.5 ${
                testingStatus['facebook'].result.connected ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {testingStatus['facebook'].result.connected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                <span>{testingStatus['facebook'].result.mode === 'live' ? 'Live Meta Feed Active' : 'Sandbox Ready'}</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">Followers: {platforms.facebook.followers || '128K'}</span>
            )}
          </div>
        </div>

        {/* 2. INSTAGRAM PROFESSIONAL */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm space-y-5 hover:border-slate-700/80 transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Instagram Professional</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                      Graph API Carousels
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Auto-publishes 4:5 swipeable carousel cards & news highlights</p>
                </div>
              </div>

              <select
                value={platforms.instagram.status}
                onChange={(e) => handleFieldChange('instagram', 'status', e.target.value)}
                className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border transition-colors ${
                  platforms.instagram.status === 'connected'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <option value="connected">Active / Connected</option>
                <option value="disconnected">Paused / Disabled</option>
              </select>
            </div>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Instagram Handle</label>
                  <input
                    type="text"
                    value={platforms.instagram.accountName}
                    onChange={(e) => handleFieldChange('instagram', 'accountName', e.target.value)}
                    placeholder="@bharatpulse_news"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">IG Business Account ID</label>
                  <input
                    type="text"
                    value={platforms.instagram.accountId}
                    onChange={(e) => handleFieldChange('instagram', 'accountId', e.target.value)}
                    placeholder="17841400291"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-400">Instagram User Access Token</label>
                  <span className="text-[10px] text-slate-500">Requires `instagram_content_publish`</span>
                </div>
                <div className="relative">
                  <input
                    type={showTokens['ig'] ? 'text' : 'password'}
                    value={platforms.instagram.accessToken || ''}
                    onChange={(e) => handleFieldChange('instagram', 'accessToken', e.target.value)}
                    placeholder="IGQVJYeE9qT1dZAW..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowToken('ig')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showTokens['ig'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Auto-Format: 1080x1350 High-Contrast 3-Slide Carousel</span>
                <span className="text-rose-400 font-bold">Enabled</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleTestConnection('instagram')}
              disabled={testingStatus['instagram']?.loading}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {testingStatus['instagram']?.loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 text-rose-400" />}
              <span>Test Connection</span>
            </button>

            {testingStatus['instagram']?.result ? (
              <span className={`text-[11px] font-medium flex items-center gap-1.5 ${
                testingStatus['instagram'].result.connected ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {testingStatus['instagram'].result.connected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                <span>{testingStatus['instagram'].result.message}</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">Followers: {platforms.instagram.followers || '84K'}</span>
            )}
          </div>
        </div>

        {/* 3. WHATSAPP BUSINESS CLOUD API */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm space-y-5 hover:border-slate-700/80 transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>WhatsApp Cloud API</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30">
                      Meta Official
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Broadcasts instant Hindi headline alerts & bullet digests</p>
                </div>
              </div>

              <select
                value={platforms.whatsapp.status}
                onChange={(e) => handleFieldChange('whatsapp', 'status', e.target.value)}
                className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border transition-colors ${
                  platforms.whatsapp.status === 'connected'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <option value="connected">Active / Connected</option>
                <option value="disconnected">Paused / Disabled</option>
              </select>
            </div>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Broadcast Channel Name</label>
                  <input
                    type="text"
                    value={platforms.whatsapp.accountName}
                    onChange={(e) => handleFieldChange('whatsapp', 'accountName', e.target.value)}
                    placeholder="Bharat Pulse Alert"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Phone Number ID</label>
                  <input
                    type="text"
                    value={platforms.whatsapp.phoneNumberId || platforms.whatsapp.accountId}
                    onChange={(e) => {
                      handleFieldChange('whatsapp', 'phoneNumberId', e.target.value);
                      handleFieldChange('whatsapp', 'accountId', e.target.value);
                    }}
                    placeholder="10982736451"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">WhatsApp Business ID (WABA ID)</label>
                  <input
                    type="text"
                    value={platforms.whatsapp.wabaId || ''}
                    onChange={(e) => handleFieldChange('whatsapp', 'wabaId', e.target.value)}
                    placeholder="29182374619"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Target Subscribers</label>
                  <input
                    type="text"
                    value={platforms.whatsapp.subscribers || '45,000+'}
                    onChange={(e) => handleFieldChange('whatsapp', 'subscribers', e.target.value)}
                    placeholder="All Verified Channels"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-400">System User Permanent Token</label>
                  <span className="text-[10px] text-slate-500">Requires `whatsapp_business_messaging`</span>
                </div>
                <div className="relative">
                  <input
                    type={showTokens['wa'] ? 'text' : 'password'}
                    value={platforms.whatsapp.accessToken || ''}
                    onChange={(e) => handleFieldChange('whatsapp', 'accessToken', e.target.value)}
                    placeholder="EAALk0qZ6uX..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowToken('wa')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showTokens['wa'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleTestConnection('whatsapp')}
              disabled={testingStatus['whatsapp']?.loading}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {testingStatus['whatsapp']?.loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 text-[#25D366]" />}
              <span>Test Broadcast API</span>
            </button>

            {testingStatus['whatsapp']?.result ? (
              <span className={`text-[11px] font-medium flex items-center gap-1.5 ${
                testingStatus['whatsapp'].result.connected ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {testingStatus['whatsapp'].result.connected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                <span>{testingStatus['whatsapp'].result.message}</span>
              </span>
            ) : (
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Meta Channel</span>
              </span>
            )}
          </div>
        </div>

        {/* 4. YOUTUBE DATA & SHORTS STUDIO */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm space-y-5 hover:border-slate-700/80 transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>YouTube Studio & Shorts</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-600/10 text-red-400 border border-red-500/30">
                      Data API v3
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Registers 60-second shorts, AI voiceover scripts & scene timelines</p>
                </div>
              </div>

              <select
                value={platforms.youtube.status}
                onChange={(e) => handleFieldChange('youtube', 'status', e.target.value)}
                className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border transition-colors ${
                  platforms.youtube.status === 'connected'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <option value="connected">Active / Connected</option>
                <option value="disconnected">Paused / Disabled</option>
              </select>
            </div>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Channel Name</label>
                  <input
                    type="text"
                    value={platforms.youtube.accountName}
                    onChange={(e) => handleFieldChange('youtube', 'accountName', e.target.value)}
                    placeholder="Bharat Pulse Media"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">YouTube Channel ID</label>
                  <input
                    type="text"
                    value={platforms.youtube.channelId || platforms.youtube.accountId}
                    onChange={(e) => {
                      handleFieldChange('youtube', 'channelId', e.target.value);
                      handleFieldChange('youtube', 'accountId', e.target.value);
                    }}
                    placeholder="UC_bharatpulse991"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-400">Google Cloud / YouTube API Key</label>
                  <span className="text-[10px] text-slate-500">Google Cloud Console API Key</span>
                </div>
                <div className="relative">
                  <input
                    type={showTokens['yt'] ? 'text' : 'password'}
                    value={platforms.youtube.apiKey || ''}
                    onChange={(e) => handleFieldChange('youtube', 'apiKey', e.target.value)}
                    placeholder="AIzaSyDw5rL-9V..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowToken('yt')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showTokens['yt'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Default Video Privacy</label>
                  <select
                    value={platforms.youtube.uploadPrivacy || 'public'}
                    onChange={(e) => handleFieldChange('youtube', 'uploadPrivacy', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="public">Public (Immediate Live)</option>
                    <option value="unlisted">Unlisted (Review Draft)</option>
                    <option value="private">Private (Archive)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Shorts Aspect Ratio</label>
                  <input
                    type="text"
                    disabled
                    value="9:16 Vertical Video (60s)"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleTestConnection('youtube')}
              disabled={testingStatus['youtube']?.loading}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {testingStatus['youtube']?.loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 text-red-500" />}
              <span>Test Studio API</span>
            </button>

            {testingStatus['youtube']?.result ? (
              <span className={`text-[11px] font-medium flex items-center gap-1.5 ${
                testingStatus['youtube'].result.connected ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {testingStatus['youtube'].result.connected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                <span>{testingStatus['youtube'].result.message}</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">Subscribers: {platforms.youtube.subscribers || '210K'}</span>
            )}
          </div>
        </div>

        {/* 5. TWITTER / X API v2 */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm space-y-5 hover:border-slate-700/80 transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
                  <TwitterXIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Twitter / X</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 text-slate-200 border border-white/20">
                      API v2 Endpoint
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Rapid breaking alerts, 280-char tweets & threaded analysis</p>
                </div>
              </div>

              <select
                value={platforms.twitter.status}
                onChange={(e) => handleFieldChange('twitter', 'status', e.target.value)}
                className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border transition-colors ${
                  platforms.twitter.status === 'connected'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <option value="connected">Active / Connected</option>
                <option value="disconnected">Paused / Disabled</option>
              </select>
            </div>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">X / Twitter Handle</label>
                  <input
                    type="text"
                    value={platforms.twitter.accountName}
                    onChange={(e) => handleFieldChange('twitter', 'accountName', e.target.value)}
                    placeholder="@BharatPulseNews"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">API Consumer Key</label>
                  <input
                    type="text"
                    value={platforms.twitter.apiKey || ''}
                    onChange={(e) => handleFieldChange('twitter', 'apiKey', e.target.value)}
                    placeholder="tw_key_991823"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">API Consumer Secret</label>
                  <input
                    type="password"
                    value={platforms.twitter.apiSecret || ''}
                    onChange={(e) => handleFieldChange('twitter', 'apiSecret', e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Bearer Token (OAuth 2.0)</label>
                  <input
                    type="password"
                    value={platforms.twitter.bearerToken || ''}
                    onChange={(e) => handleFieldChange('twitter', 'bearerToken', e.target.value)}
                    placeholder="AAAAAA..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">User Access Token & Secret</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="password"
                    value={platforms.twitter.accessToken || ''}
                    onChange={(e) => handleFieldChange('twitter', 'accessToken', e.target.value)}
                    placeholder="Access Token"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                  <input
                    type="password"
                    value={platforms.twitter.accessSecret || ''}
                    onChange={(e) => handleFieldChange('twitter', 'accessSecret', e.target.value)}
                    placeholder="Access Secret"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleTestConnection('twitter')}
              disabled={testingStatus['twitter']?.loading}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {testingStatus['twitter']?.loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 text-cyan-400" />}
              <span>Test X / Twitter API</span>
            </button>

            {testingStatus['twitter']?.result ? (
              <span className={`text-[11px] font-medium flex items-center gap-1.5 ${
                testingStatus['twitter'].result.connected ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {testingStatus['twitter'].result.connected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                <span>{testingStatus['twitter'].result.message}</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">Followers: {platforms.twitter.followers || '67.8K'}</span>
            )}
          </div>
        </div>

        {/* 6. TELEGRAM BROADCAST CHANNEL */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm space-y-5 hover:border-slate-700/80 transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#229ED9]/20 border border-[#229ED9]/40 flex items-center justify-center text-[#229ED9]">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Telegram Channel Bot</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#229ED9]/10 text-[#229ED9] border border-[#229ED9]/30">
                      Telegram Bot API
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Push instant breaking news bulletins to Telegram subscribers</p>
                </div>
              </div>

              <select
                value={platforms.telegram.status}
                onChange={(e) => handleFieldChange('telegram', 'status', e.target.value)}
                className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border transition-colors ${
                  platforms.telegram.status === 'connected'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <option value="connected">Active / Connected</option>
                <option value="disconnected">Paused / Disabled</option>
              </select>
            </div>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Channel Username</label>
                  <input
                    type="text"
                    value={platforms.telegram.chatId || platforms.telegram.accountId}
                    onChange={(e) => {
                      handleFieldChange('telegram', 'chatId', e.target.value);
                      handleFieldChange('telegram', 'accountId', e.target.value);
                    }}
                    placeholder="@bharatpulsenews"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Active Subscribers</label>
                  <input
                    type="text"
                    value={platforms.telegram.members || '32,500'}
                    onChange={(e) => handleFieldChange('telegram', 'members', e.target.value)}
                    placeholder="32,500"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-400">Telegram Bot Token (from @BotFather)</label>
                  <span className="text-[10px] text-slate-500">e.g. 719283719:AAFP7y...</span>
                </div>
                <div className="relative">
                  <input
                    type={showTokens['tg'] ? 'text' : 'password'}
                    value={platforms.telegram.botToken || platforms.telegram.accessToken || ''}
                    onChange={(e) => {
                      handleFieldChange('telegram', 'botToken', e.target.value);
                      handleFieldChange('telegram', 'accessToken', e.target.value);
                    }}
                    placeholder="bot719283719:AAFP7..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowToken('tg')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showTokens['tg'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400">
                Tip: Add your bot as Administrator in your Telegram channel with "Post Messages" permission.
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleTestConnection('telegram')}
              disabled={testingStatus['telegram']?.loading}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {testingStatus['telegram']?.loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 text-[#229ED9]" />}
              <span>Test Bot Ping</span>
            </button>

            {testingStatus['telegram']?.result ? (
              <span className={`text-[11px] font-medium flex items-center gap-1.5 ${
                testingStatus['telegram'].result.connected ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {testingStatus['telegram'].result.connected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                <span>{testingStatus['telegram'].result.message}</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">Members: {platforms.telegram.members || '32.5K'}</span>
            )}
          </div>
        </div>

      </div>

      {/* Optional AI Engine Keys Section on the same page */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Engine & Newsroom Reasoning Providers</h3>
              <p className="text-xs text-slate-400">Select active AI engine for automatic translation, fact-checking, and script creation</p>
            </div>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
            Active: {aiConfigs.default_ai_provider?.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Google Gemini API Key</label>
            <input
              type="password"
              value={aiConfigs.gemini_api_key || ''}
              onChange={(e) => setAiConfigs(prev => ({ ...prev, gemini_api_key: e.target.value }))}
              placeholder="AIzaSy... (Gemini 2.5 Flash News Reasoning)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">OpenAI API Key (Fallback)</label>
            <input
              type="password"
              value={aiConfigs.openai_api_key || ''}
              onChange={(e) => setAiConfigs(prev => ({ ...prev, openai_api_key: e.target.value }))}
              placeholder="sk-proj-... (GPT-4o / GPT-4o-mini)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Bottom Sticky Save Bar */}
      <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>All tokens stored encrypted in MySQL database & synchronized with 7 live newsroom agents.</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving All Configurations...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save All Platform Configurations</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
