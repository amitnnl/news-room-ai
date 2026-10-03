import React, { useState, useEffect } from 'react';
import { 
  Clapperboard, 
  Play, 
  Pause, 
  Volume2, 
  Smartphone, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Share2,
  Subtitles,
  Film
} from 'lucide-react';
import NewsAPI from '../services/api';

export default function VideoShortsStudio() {
  const [articles, setArticles] = useState([]);
  const [selectedArticleId, setSelectedArticleId] = useState('');
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  useEffect(() => {
    NewsAPI.getArticles().then(res => {
      if (res?.articles?.length > 0) {
        setArticles(res.articles);
        setSelectedArticleId(res.articles[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedArticleId) {
      NewsAPI.getArticle(selectedArticleId).then(res => {
        if (res?.videos && res.videos.length > 0) {
          setCurrentVideo(res.videos[0]);
        } else {
          setCurrentVideo(null);
        }
      });
    }
  }, [selectedArticleId]);

  // Voiceover TTS Simulation using Web Speech API
  const handlePlayVoiceover = () => {
    if (!currentVideo?.voiceover_text) return;

    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentVideo.voiceover_text);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.lang = 'hi-IN'; // Hindi voice
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    } else {
      alert('Speech Synthesis is not supported in this browser.');
    }
  };

  const scenes = currentVideo?.scene_list_json 
    ? (typeof currentVideo.scene_list_json === 'string' ? JSON.parse(currentVideo.scene_list_json) : currentVideo.scene_list_json)
    : [
      { timestamp: "00:00 - 00:03", cue: "HOOK", visual: "Breaking banner overlay", voiceover: "क्या आपको पता है? बड़ी खबर सामने आई है!" },
      { timestamp: "00:03 - 00:15", cue: "MAIN FACT", visual: "Official documents & map", voiceover: "अधिकारियों ने नई योजना को अंतिम मंजूरी दे दी है।" },
      { timestamp: "00:15 - 00:35", cue: "DETAILS", visual: "Infographic with key points", voiceover: "इससे लाखों नागरिकों को सीधा लाभ मिलेगा।" },
      { timestamp: "00:35 - 00:48", cue: "CONTEXT", visual: "Ground report visual", voiceover: "विशेषज्ञों ने इसे मील का पत्थर करार दिया है।" },
      { timestamp: "00:48 - 00:58", cue: "CTA", visual: "Logo animation & Subscribe", voiceover: "अपनी राय कमेंट में बताएं और भारत पल्स को सब्सक्राइब करें!" }
    ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Clapperboard className="w-6 h-6 text-red-500" />
            AI Video Shorts & Reels Producer Studio
          </h1>
          <p className="text-xs text-slate-400">
            Automated 9:16 vertical video scripts, scene visual prompts, voiceover cues, and subtitle generation for YouTube Shorts & Instagram Reels.
          </p>
        </div>

        {/* Story Selector */}
        <select
          value={selectedArticleId}
          onChange={(e) => setSelectedArticleId(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white max-w-xs"
        >
          {articles.map(a => (
            <option key={a.id} value={a.id}>
              #{a.id} - {a.title.substring(0, 35)}...
            </option>
          ))}
        </select>
      </div>

      {/* Main Studio View: Phone Simulator on Left, Scene Director on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 4 cols: Interactive 9:16 Mobile Simulator */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="w-72 h-[520px] rounded-[38px] bg-slate-950 border-4 border-slate-700 shadow-2xl shadow-red-600/10 p-3 relative overflow-hidden flex flex-col justify-between">
            {/* Top Phone Speaker / Notch */}
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto shrink-0 mb-2"></div>

            {/* Video Background Simulation */}
            <div className="absolute inset-3 rounded-[28px] overflow-hidden bg-slate-900 flex flex-col justify-between p-4 z-0">
              <img 
                src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80" 
                alt="Background" 
                className="absolute inset-0 w-full h-full object-cover opacity-30 blur-xs"
              />

              {/* Breaking Overlay Banner */}
              <div className="z-10 bg-red-600/90 text-white font-black text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md text-center shadow-lg animate-pulse">
                🔴 BHARAT PULSE SHORTS
              </div>

              {/* Center Animated Subtitle Simulation */}
              <div className="z-10 my-auto text-center space-y-2">
                <div className="bg-black/75 px-3 py-1.5 rounded-lg border border-white/20 inline-block">
                  <span className="text-amber-300 font-extrabold text-xs">
                    {scenes[activeSceneIndex]?.cue}:
                  </span>
                  <p className="text-white font-bold text-xs mt-0.5 leading-snug">
                    "{scenes[activeSceneIndex]?.voiceover}"
                  </p>
                </div>
              </div>

              {/* Bottom Video Metadata */}
              <div className="z-10 space-y-1.5 bg-gradient-to-t from-black via-black/80 to-transparent p-2 rounded-xl">
                <div className="text-[11px] font-bold text-white line-clamp-2">
                  {currentVideo?.title || 'Breaking News Short 9:16'}
                </div>
                <div className="text-[10px] text-red-400 font-mono">
                  #Shorts #BreakingNews #BharatPulse
                </div>
              </div>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handlePlayVoiceover}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-600/30"
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'Stop Speech' : 'Simulate Voiceover (TTS)'}</span>
            </button>
          </div>
        </div>

        {/* Right 8 cols: Scene-by-Scene Director Timeline */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">60-Second Video Script Timeline</h3>
                <p className="text-xs text-slate-400">Structured high-retention pacing (Hook → Fact → Details → CTA)</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold">
                Total: 58 Seconds
              </span>
            </div>

            {/* Scenes List */}
            <div className="space-y-3">
              {scenes.map((scene, sIdx) => (
                <div
                  key={sIdx}
                  onClick={() => setActiveSceneIndex(sIdx)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    activeSceneIndex === sIdx
                      ? 'border-red-500 bg-red-600/10 shadow-lg'
                      : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-cyan-400 font-bold">
                      {scene.timestamp}
                    </span>
                    <span className="text-[10px] font-black uppercase text-amber-400">
                      {scene.cue}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="font-bold text-slate-400">Visual Cue:</span>{' '}
                      <span className="text-slate-300">{scene.visual}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200">
                      <span className="font-bold text-red-400">Voiceover Text:</span>{' '}
                      <span>"{scene.voiceover}"</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Full Script Box */}
            {currentVideo?.voiceover_text && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-xs font-bold text-slate-300 uppercase">Complete Teleprompter Script</div>
                <p className="text-xs text-slate-400 leading-relaxed font-mono">
                  {currentVideo.voiceover_text}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
