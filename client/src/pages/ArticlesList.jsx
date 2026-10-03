import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Flame, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus,
  RefreshCw
} from 'lucide-react';
import NewsAPI from '../services/api';

export default function ArticlesList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const [artRes, catRes] = await Promise.all([
        NewsAPI.getArticles({
          search: searchTerm,
          status: statusFilter,
          category: categoryFilter,
          is_breaking: searchParams.get('is_breaking') || undefined
        }),
        NewsAPI.getCategories()
      ]);
      setArticles(artRes.articles || []);
      setCategories(catRes.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadArticles();
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete article: "${title}"?`)) {
      try {
        await NewsAPI.deleteArticle(id);
        setArticles(articles.filter(a => a.id !== id));
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await NewsAPI.updateStatus(id, newStatus);
      setArticles(articles.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (err) {
      alert('Status update failed: ' + err.message);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-red-500" />
            News Articles CMS
          </h1>
          <p className="text-xs text-slate-400">
            Manage, verify, edit, and publish stories across web and syndicated feeds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/one-click')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-red-600/25"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Story</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search headline, keyword, or topic..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-red-500"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="approved">Approved</option>
            <option value="under_review">Under Review</option>
            <option value="draft">Drafts</option>
            <option value="scheduled">Scheduled</option>
          </select>

          {/* Category selector */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-red-500"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          <button
            onClick={loadArticles}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            title="Refresh articles"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Articles Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Views</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4 max-w-md">
                    <div className="flex items-start gap-3">
                      {art.featured_image && (
                        <img 
                          src={art.featured_image} 
                          alt="thumb" 
                          className="w-12 h-10 object-cover rounded-lg shrink-0"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          {art.is_breaking ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-red-600 text-white">
                              BREAKING
                            </span>
                          ) : null}
                          <span className="text-[10px] font-mono text-slate-500">#{art.id}</span>
                        </div>
                        <h4 
                          onClick={() => navigate(`/editorial?id=${art.id}`)}
                          className="font-bold text-slate-200 hover:text-red-400 cursor-pointer line-clamp-2 leading-snug"
                        >
                          {art.title}
                        </h4>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-300">
                    {art.category_name || 'General'}
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={art.status}
                      onChange={(e) => handleStatusChange(art.id, e.target.value)}
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase border bg-slate-950 ${
                        art.status === 'published' ? 'border-emerald-500/40 text-emerald-400' :
                        art.status === 'approved' ? 'border-blue-500/40 text-blue-400' :
                        art.status === 'under_review' ? 'border-amber-500/40 text-amber-400' :
                        'border-slate-700 text-slate-400'
                      }`}
                    >
                      <option value="draft">Draft</option>
                      <option value="under_review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="published">Published</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 uppercase font-mono text-slate-400 font-bold">
                    {art.language}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      {Number(art.view_count).toLocaleString()}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {new Date(art.created_at).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/editorial?id=${art.id}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Open in 3-Col Studio"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => navigate(`/public?slug=${art.slug}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300"
                        title="View Live Reader View"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(art.id, art.title)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600/30 text-red-400"
                        title="Delete article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
