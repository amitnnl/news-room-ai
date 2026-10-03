import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Radio, 
  Flame, 
  Search, 
  Share2, 
  Eye, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import NewsAPI from '../services/api';

export default function PublicNewsPortal() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialSlug = searchParams.get('slug');

  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      NewsAPI.getArticles({ status: 'published' }),
      NewsAPI.getCategories()
    ]).then(([artRes, catRes]) => {
      const pubArts = artRes.articles || [];
      setArticles(pubArts);
      setCategories(catRes.categories || []);

      if (initialSlug) {
        const found = pubArts.find(a => a.slug === initialSlug);
        if (found) setSelectedArticle(found);
      }
      setLoading(false);
    });
  }, [initialSlug]);

  const filteredArticles = activeCategory
    ? articles.filter(a => a.category_name?.toLowerCase().includes(activeCategory.toLowerCase()))
    : articles;

  const breakingStory = articles.find(a => a.is_breaking) || articles[0];
  const heroStory = selectedArticle || breakingStory;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Breaking News Ticker */}
      {breakingStory && (
        <div className="bg-red-600 text-white px-4 py-2 flex items-center gap-3 text-xs font-bold overflow-hidden shadow-md">
          <div className="flex items-center gap-1.5 shrink-0 uppercase tracking-widest bg-black/30 px-2 py-0.5 rounded">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>BREAKING NEWS</span>
          </div>
          <div className="truncate flex-1 font-semibold">
            {breakingStory.breaking_headline || breakingStory.title}
          </div>
          <button
            onClick={() => setSelectedArticle(breakingStory)}
            className="shrink-0 text-white/90 hover:text-white underline text-[11px]"
          >
            Read Story →
          </button>
        </div>
      )}

      {/* Public Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => { setSelectedArticle(null); setActiveCategory(''); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                BHARAT PULSE
              </span>
              <p className="text-[10px] text-slate-400 font-medium">100% Fact-Checked Digital News</p>
            </div>
          </div>
        </div>

        {/* Back to Admin Newsroom Link */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Editor Control Room</span>
        </button>
      </header>

      {/* Category Navigation Bar */}
      <nav className="border-b border-slate-800 bg-slate-950 px-6 py-2.5 overflow-x-auto flex items-center gap-3 text-xs font-semibold">
        <button
          onClick={() => { setActiveCategory(''); setSelectedArticle(null); }}
          className={`px-3 py-1 rounded-full transition-all ${
            !activeCategory ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Top Stories
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => { setActiveCategory(c.name); setSelectedArticle(null); }}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              activeCategory === c.name ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {c.name}
          </button>
        ))}
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto p-6 w-full space-y-8">
        {selectedArticle ? (
          /* DETAILED ARTICLE READER VIEW */
          <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <button
              onClick={() => setSelectedArticle(null)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Headlines</span>
            </button>

            {/* Article Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase">
                  {selectedArticle.category_name || 'National'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(selectedArticle.created_at).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Fact-Check
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {selectedArticle.title}
              </h1>

              <p className="text-base text-slate-300 font-medium leading-relaxed border-l-4 border-red-500 pl-4 py-1 italic bg-slate-900/40 rounded-r-xl">
                {selectedArticle.summary}
              </p>
            </div>

            {/* Featured Image */}
            {selectedArticle.featured_image && (
              <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
                <img 
                  src={selectedArticle.featured_image} 
                  alt={selectedArticle.image_alt || selectedArticle.title} 
                  className="w-full h-80 md:h-[450px] object-cover"
                />
                <div className="p-3 bg-slate-900/90 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800">
                  <span>{selectedArticle.image_caption || 'Newsroom Photojournalism Desk'}</span>
                  <span className="text-[10px] text-amber-400 font-semibold">AI Illustrative Visual</span>
                </div>
              </div>
            )}

            {/* Article Body */}
            <div 
              className="text-base text-slate-200 leading-relaxed space-y-4 prose prose-invert max-w-none pt-4"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            />

            {/* FAQs if present */}
            {selectedArticle.faq_json && (
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 mt-8">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-red-500" />
                  Frequently Asked Questions
                </h3>
                <div className="space-y-3">
                  {JSON.parse(typeof selectedArticle.faq_json === 'string' ? selectedArticle.faq_json : JSON.stringify(selectedArticle.faq_json)).map((faq, fIdx) => (
                    <div key={fIdx} className="space-y-1">
                      <div className="text-sm font-bold text-slate-200">Q: {faq.q}</div>
                      <div className="text-xs text-slate-400 leading-relaxed pl-4">A: {faq.a}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* HOMEPAGE VIEW: HERO STORY + LATEST GRID */
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Story Banner */}
            {heroStory && (
              <div 
                onClick={() => setSelectedArticle(heroStory)}
                className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all grid grid-cols-1 lg:grid-cols-12 gap-6 items-center group shadow-2xl"
              >
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold uppercase">
                      FEATURED STORY
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(heroStory.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h2 className="text-xl md:text-3xl font-extrabold text-white group-hover:text-red-400 transition-colors leading-tight">
                    {heroStory.title}
                  </h2>

                  <p className="text-xs md:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                    {heroStory.summary}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-bold text-red-400 pt-2">
                    <span>Read Full Investigative Report</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-800">
                  <img 
                    src={heroStory.featured_image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'} 
                    alt="Hero" 
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            )}

            {/* Articles Grid */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <span>Latest Verified Reporting</span>
                <span className="text-xs text-slate-400 font-normal">({filteredArticles.length} stories)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map(art => (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArticle(art)}
                    className="glass-panel rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 cursor-pointer flex flex-col justify-between transition-all group shadow-lg"
                  >
                    <div>
                      {art.featured_image && (
                        <div className="h-44 overflow-hidden">
                          <img 
                            src={art.featured_image} 
                            alt={art.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-bold uppercase text-red-400">{art.category_name || 'National'}</span>
                          <span>{new Date(art.created_at).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-bold text-sm text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                          {art.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {art.summary}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-slate-900/80 flex items-center justify-between text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {Number(art.view_count).toLocaleString()} reads
                      </span>
                      <span className="text-red-400 font-bold group-hover:underline">Read →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 p-6 text-center text-xs text-slate-500">
        <p>© 2026 Bharat Pulse AI Newsroom. Production Automated Multi-Agent Journalism.</p>
      </footer>
    </div>
  );
}
