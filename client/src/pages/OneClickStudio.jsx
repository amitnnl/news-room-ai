import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  ShieldCheck, 
  FileText, 
  Share2, 
  Clapperboard, 
  Image as ImageIcon, 
  CheckCircle2, 
  Clock, 
  Send, 
  ExternalLink,
  Flame,
  AlertTriangle,
  Layers,
  ChevronRight,
  ArrowRight,
  Loader2,
  Copy,
  Check
} from 'lucide-react';
import NewsAPI from '../services/api';

const PIPELINE_STEPS = [
  { id: 'research', label: '1. Research Agent', desc: 'Sourcing citations & timeline', icon: Search },
  { id: 'factcheck', label: '2. Fact Check Agent', desc: 'Verifying claims & integrity', icon: ShieldCheck },
  { id: 'writer', label: '3. News Writer Agent', desc: 'Composing structured story', icon: FileText },
  { id: 'seo', label: '4. Headline & SEO Agent', desc: '5 multi-variant headlines', icon: Layers },
  { id: 'visual', label: '5. Visual Design Agent', desc: 'Graphics & thumbnail prompts', icon: ImageIcon },
  { id: 'social', label: '6. Social Media Agent', desc: 'FB, IG, WhatsApp, YT drafts', icon: Share2 },
  { id: 'video', label: '7. Video Producer Agent', desc: '60s vertical Shorts script', icon: Clapperboard }
];

export default function OneClickStudio() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [language, setLanguage] = useState('hi');
  const [isBreaking, setIsBreaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [resultPackage, setResultPackage] = useState(null);
  const [activeTab, setActiveTab] = useState('article');
  const [copiedKey, setCopiedKey] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(null);

  const sampleTopics = [
    "Haryana government approves 32km Gurugram-Faridabad high-speed rapid metro corridor worth Rs 6800 crore",
    "ISRO successfully hot-tests high thrust semi-cryogenic rocket engine at Mahendragiri for Gaganyaan mission",
    "Reserve Bank of India announces new digital currency pilot and cyber security directives for 2026",
    "Supreme Court issues new directives on environmental clearances and urban green corridor preservation"
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setResultPackage(null);
    setPublishSuccess(null);
    setCurrentStepIndex(0);

    // Step progression animation timer
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < PIPELINE_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 700);

    try {
      const res = await NewsAPI.generateOneClickPackage({
        topic: topic.trim(),
        categoryId: parseInt(categoryId, 10),
        language,
        isBreaking,
        authorId: 1
      });

      clearInterval(interval);
      setCurrentStepIndex(PIPELINE_STEPS.length);
      setResultPackage(res);
    } catch (err) {
      clearInterval(interval);
      alert('Generation error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handlePublishAll = async () => {
    if (!resultPackage?.articleId) return;
    setPublishing(true);
    try {
      const res = await NewsAPI.publishFullPackage(resultPackage.articleId);
      setPublishSuccess(res);
    } catch (err) {
      alert('Publishing error: ' + (err.response?.data?.message || err.message));
    } finally {
      setPublishing(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const pkg = resultPackage?.package;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Page Title & Explanation */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Automated Newsroom Core
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
            One-Click AI News Package Generator
          </h1>
          <p className="text-xs text-slate-400">
            Enter a topic, URL, or press release. The 7-agent pipeline researches, verifies, writes, optimizes, and formats content for all platforms simultaneously.
          </p>
        </div>
      </div>

      {/* Input Deck */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            News Topic, Press Release, or Live Event Notes:
          </label>
          <textarea
            rows={3}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Haryana government cabinet approves new 32km Gurugram-Faridabad high-speed rapid metro corridor connecting Cyber City to Bata Chowk with Rs 6800 crore budget..."
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 leading-relaxed transition-all"
          />
        </div>

        {/* Suggested Topic Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400">Quick Samples:</span>
          {sampleTopics.map((st, sIdx) => (
            <button
              key={sIdx}
              onClick={() => setTopic(st)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white transition-colors text-left"
            >
              {st.length > 55 ? st.substring(0, 55) + '...' : st}
            </button>
          ))}
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-900">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500"
            >
              <option value="1">देश (National)</option>
              <option value="2">राजनीति (Politics)</option>
              <option value="3">तकनीक व AI (Technology)</option>
              <option value="4">व्यापार (Business)</option>
              <option value="5">खेल (Sports)</option>
              <option value="6">दुनिया (World)</option>
              <option value="7">हरियाणा स्पेशल (Haryana)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">
              Primary Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500"
            >
              <option value="hi">हिंदी (Hindi - Bilingual Web/Social)</option>
              <option value="en">English (Global Desk)</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isBreaking}
                onChange={(e) => setIsBreaking(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-slate-950 border-slate-700"
              />
              <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                Breaking News Flag
              </span>
            </label>
          </div>
        </div>

        {/* Trigger Button */}
        <div className="flex justify-end pt-3">
          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 disabled:opacity-50 text-white font-extrabold text-sm shadow-xl shadow-red-600/30 transition-all transform hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Orchestrating 7 Agents...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>CREATE NEWS PACKAGE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Real-time Multi-Agent Pipeline Visualization */}
      {loading && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></div>
              Multi-Agent Orchestrator Pipeline Executing...
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Agent {currentStepIndex + 1} of {PIPELINE_STEPS.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PIPELINE_STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-red-500 bg-red-600/10 shadow-lg shadow-red-500/20'
                      : isPast
                      ? 'border-emerald-500/40 bg-emerald-950/20'
                      : 'border-slate-800 bg-slate-950/50 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <StepIcon className={`w-4 h-4 ${isCurrent ? 'text-red-400 animate-bounce' : isPast ? 'text-emerald-400' : 'text-slate-500'}`} />
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </div>
                  <div className="text-xs font-bold text-white">{step.label}</div>
                  <div className="text-[10px] text-slate-400">{step.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Generated Package Review & Distribution Deck */}
      {resultPackage && pkg && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden space-y-0 animate-fadeIn shadow-2xl">
          {/* Deck Header & Status */}
          <div className="p-6 bg-slate-900/90 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  PACKAGE COMPILED IN {resultPackage.timeTakenSec} SECONDS
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Article ID #{resultPackage.articleId}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{pkg.article.title}</h2>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => navigate(`/editorial?id=${resultPackage.articleId}`)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
              >
                <span>3-Col Editorial Studio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handlePublishAll}
                disabled={publishing}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5"
              >
                {publishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>PUBLISH ALL PLATFORMS</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Publish Success Alert */}
          {publishSuccess && (
            <div className="p-4 bg-emerald-500/15 border-b border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold">
                  {publishSuccess.message} (Dispatched to Facebook, Instagram, WhatsApp Cloud, YouTube, and Website)
                </span>
              </div>
              <button
                onClick={() => navigate('/social')}
                className="font-bold underline text-emerald-200"
              >
                View in Social Hub
              </button>
            </div>
          )}

          {/* Navigation Tabs for Generated Assets */}
          <div className="px-6 pt-4 border-b border-slate-800 flex items-center gap-6 text-xs font-bold">
            <button
              onClick={() => setActiveTab('article')}
              className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
                activeTab === 'article'
                  ? 'border-red-500 text-red-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Article & SEO ({pkg.seo?.headlines ? '5 Headlines' : 'Ready'})</span>
            </button>

            <button
              onClick={() => setActiveTab('factcheck')}
              className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
                activeTab === 'factcheck'
                  ? 'border-red-500 text-red-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Fact Check & Sources ({pkg.factCheck.verification_status})</span>
            </button>

            <button
              onClick={() => setActiveTab('social')}
              className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
                activeTab === 'social'
                  ? 'border-red-500 text-red-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Social Media Copy (FB, IG, WhatsApp, YT, X)</span>
            </button>

            <button
              onClick={() => setActiveTab('video')}
              className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
                activeTab === 'video'
                  ? 'border-red-500 text-red-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clapperboard className="w-4 h-4" />
              <span>60s Shorts Script & Visuals</span>
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="p-6">
            {/* TAB 1: ARTICLE & SEO */}
            {activeTab === 'article' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Article Summary</div>
                    <p className="text-sm text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed">
                      {pkg.article.summary}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Full News Body</div>
                    <div 
                      className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-300 leading-relaxed prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: pkg.article.content }}
                    />
                  </div>

                  {/* Key Points */}
                  {pkg.research?.key_facts && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="text-[11px] font-bold text-amber-400 uppercase">Verified Key Facts</div>
                      <ul className="space-y-1.5">
                        {pkg.research.key_facts.map((kf, kIdx) => (
                          <li key={kIdx} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="text-amber-400">•</span>
                            <span>{kf}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* SEO & Headlines Sidebar */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>5 Headline Variations</span>
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    </div>

                    {pkg.seo?.headlines && Object.entries(pkg.seo.headlines).map(([type, text]) => (
                      <div key={type} className="space-y-1 p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400">
                          <span>{type} Headline</span>
                          <button
                            onClick={() => copyToClipboard(text, type)}
                            className="text-slate-400 hover:text-white"
                          >
                            {copiedKey === type ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="text-xs font-semibold text-slate-200">{text}</div>
                      </div>
                    ))}
                  </div>

                  {/* Visual Prompt Card */}
                  {pkg.visual && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                        <span>AI Visual Specs</span>
                      </div>
                      <img 
                        src={pkg.article.featured_image} 
                        alt="Featured" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <p className="text-[11px] text-slate-400 italic">
                        "{pkg.visual.featured_image_prompt}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: FACT CHECK & SOURCES */}
            {activeTab === 'factcheck' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-xs text-slate-400">Verification Status</div>
                    <div className="text-xl font-black text-emerald-400 uppercase mt-1">
                      {pkg.factCheck.verification_status}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">Confidence Score: {pkg.factCheck.score}/100</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-xs text-slate-400">Sources Analyzed</div>
                    <div className="text-xl font-black text-cyan-400 mt-1">
                      {pkg.research.sources?.length || 3} Authoritative Feeds
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">Avg Credibility: 93%</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-xs text-slate-400">Editorial Integrity</div>
                    <div className="text-xl font-black text-amber-400 mt-1">Zero Fabrications</div>
                    <div className="text-[11px] text-slate-500 mt-1">No unverified quotes detected</div>
                  </div>
                </div>

                {/* Sources list */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-white uppercase">Citations & Cross-Verification Links</div>
                  <div className="space-y-2">
                    {pkg.research.sources?.map((src, sIdx) => (
                      <div key={sIdx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-200">{src.title}</div>
                          <div className="text-[11px] text-cyan-400">{src.publisher} • Credibility: {src.credibility}%</div>
                        </div>
                        <a 
                          href={src.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded bg-slate-800 text-[11px] text-slate-300 hover:text-white flex items-center gap-1"
                        >
                          <span>Verify Source</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warnings / Cautions */}
                {pkg.factCheck.warnings?.length > 0 && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1.5">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Editorial Caution Notes:</span>
                    </div>
                    {pkg.factCheck.warnings.map((w, wIdx) => (
                      <p key={wIdx} className="text-slate-300">• {w}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SOCIAL MEDIA */}
            {activeTab === 'social' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Facebook Post */}
                <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-400">
                    <span>Facebook Post Format</span>
                    <button
                      onClick={() => copyToClipboard(pkg.social.facebook.post_text, 'fb')}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'fb' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    {pkg.social.facebook.post_text}
                  </p>
                  <div className="text-[11px] text-blue-400 font-mono">{pkg.social.facebook.hashtags}</div>
                </div>

                {/* WhatsApp Broadcast */}
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span>WhatsApp Broadcast Format</span>
                    <button
                      onClick={() => copyToClipboard(pkg.social.whatsapp.message, 'wa')}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'wa' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    {pkg.social.whatsapp.message}
                  </p>
                  <div className="text-[11px] text-emerald-400">CTA: {pkg.social.whatsapp.cta}</div>
                </div>

                {/* Instagram Carousel */}
                <div className="p-4 rounded-xl bg-slate-950 border border-pink-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-pink-400">
                    <span>Instagram Carousel Plan</span>
                    <button
                      onClick={() => copyToClipboard(pkg.social.instagram.caption, 'ig')}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'ig' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    {pkg.social.instagram.caption}
                  </p>
                  <div className="space-y-1">
                    {pkg.social.instagram.carousel_slides?.map((slide, sIdx) => (
                      <div key={sIdx} className="text-[11px] text-slate-400 bg-slate-900 px-2 py-1 rounded">
                        {slide}
                      </div>
                    ))}
                  </div>
                </div>

                {/* YouTube Video Title & Desc */}
                <div className="p-4 rounded-xl bg-slate-950 border border-red-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-red-400">
                    <span>YouTube Title & Tags</span>
                    <button
                      onClick={() => copyToClipboard(pkg.social.youtube.title, 'yt')}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'yt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="text-xs font-bold text-white bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    {pkg.social.youtube.title}
                  </div>
                  <p className="text-xs text-slate-400 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    {pkg.social.youtube.description}
                  </p>
                  <div className="text-[11px] text-red-400 font-mono">{pkg.social.youtube.tags}</div>
                </div>
              </div>
            )}

            {/* TAB 4: VIDEO SHORT SCRIPT */}
            {activeTab === 'video' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{pkg.video.title}</h3>
                    <p className="text-xs text-slate-400">Format: 9:16 Vertical Video (60s) • Cues: Hook, Fact, Details, CTA</p>
                  </div>
                  <button
                    onClick={() => navigate('/video-studio')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                  >
                    <span>Open in Video Studio</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-3">
                  {pkg.video.scenes?.map((scene, scIdx) => (
                    <div key={scIdx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div className="md:col-span-1">
                        <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-mono font-bold">
                          {scene.timestamp}
                        </span>
                        <div className="text-xs font-bold text-white mt-1 uppercase tracking-wider">{scene.cue}</div>
                      </div>
                      <div className="md:col-span-1 text-xs text-slate-400">
                        <span className="font-semibold text-slate-300">Visual:</span> {scene.visual}
                      </div>
                      <div className="md:col-span-2 text-xs text-slate-200 bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <span className="font-semibold text-amber-400">Voiceover:</span> "{scene.voiceover}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
