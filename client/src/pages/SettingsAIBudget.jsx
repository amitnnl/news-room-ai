import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Coins, 
  Cpu, 
  Key, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  Bot,
  Layers,
  Sparkles
} from 'lucide-react';
import NewsAPI from '../services/api';

export default function SettingsAIBudget() {
  const [settings, setSettings] = useState({
    default_ai_provider: 'gemini',
    gemini_api_key: '',
    openai_api_key: '',
    gemini_model: 'gemini-2.5-flash',
    openai_model: 'gpt-4o-mini',
    daily_budget_usd: '15.00',
    brand_name: 'Bharat Pulse AI Newsroom',
    brand_tagline: 'Real-Time Fact-Checked Newsroom Engine'
  });
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    Promise.all([NewsAPI.getSettings(), NewsAPI.getAgents()]).then(([sRes, aRes]) => {
      if (sRes?.settings) {
        setSettings(prev => ({ ...prev, ...sRes.settings }));
      }
      if (aRes?.agents) {
        setAgents(aRes.agents);
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      await NewsAPI.updateSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Sliders className="w-6 h-6 text-cyan-400" />
          AI Provider, Models & Cost Control Settings
        </h1>
        <p className="text-xs text-slate-400">
          Configure model parameters, secure API keys, token spend limits, and newsroom brand metadata.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Newsroom settings and credentials saved successfully to MySQL database.</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Primary AI Provider */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>AI Provider Selection & Models</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Active Default AI Provider:
              </label>
              <select
                value={settings.default_ai_provider}
                onChange={e => setSettings({ ...settings, default_ai_provider: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="gemini">Google Gemini (Recommended - High Speed & Native Reasoning)</option>
                <option value="openai">OpenAI (GPT-4o & GPT-4o-mini)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Daily Budget Limit (USD):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-500">$</span>
                <input
                  type="text"
                  value={settings.daily_budget_usd}
                  onChange={e => setSettings({ ...settings, daily_budget_usd: e.target.value })}
                  className="w-full pl-7 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Gemini Model Variant:
              </label>
              <select
                value={settings.gemini_model || 'gemini-2.5-flash'}
                onChange={e => setSettings({ ...settings, gemini_model: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="gemini-2.5-flash">gemini-2.5-flash (Fastest & Latest)</option>
                <option value="gemini-1.5-flash">gemini-1.5-flash (High Throughput)</option>
                <option value="gemini-1.5-pro">gemini-1.5-pro (Deep Investigative Analysis)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                OpenAI Model Variant:
              </label>
              <select
                value={settings.openai_model || 'gpt-4o-mini'}
                onChange={e => setSettings({ ...settings, openai_model: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="gpt-4o-mini">gpt-4o-mini (Cost-Efficient)</option>
                <option value="gpt-4o">gpt-4o (Flagship Model)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: API Keys Management */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
            <Key className="w-4 h-4 text-amber-400" />
            <span>API Credentials (Encrypted Server Storage)</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Google Gemini API Key:</span>
                {settings.gemini_api_key_configured && (
                  <span className="text-[10px] text-emerald-400 font-mono">● LIVE KEY CONFIGURED</span>
                )}
              </label>
              <input
                type="password"
                value={settings.gemini_api_key || ''}
                onChange={e => setSettings({ ...settings, gemini_api_key: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>OpenAI API Key:</span>
                {settings.openai_api_key_configured && (
                  <span className="text-[10px] text-emerald-400 font-mono">● LIVE KEY CONFIGURED</span>
                )}
              </label>
              <input
                type="password"
                value={settings.openai_api_key || ''}
                onChange={e => setSettings({ ...settings, openai_api_key: e.target.value })}
                placeholder="sk-..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Brand Metadata */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-red-500" />
            <span>Newsroom Branding & Meta</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Editorial Brand Name:
              </label>
              <input
                type="text"
                value={settings.brand_name || ''}
                onChange={e => setSettings({ ...settings, brand_name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Platform Sub-Header / Tagline:
              </label>
              <input
                type="text"
                value={settings.brand_tagline || ''}
                onChange={e => setSettings({ ...settings, brand_tagline: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-red-600/30"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>

      {/* AI Agents Roster */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Bot className="w-4 h-4 text-emerald-400" />
          Active Multi-Agent Roster ({agents.length} Specialized Roles)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {agents.map(a => (
            <div key={a.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">{a.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <div className="text-[11px] text-cyan-400 font-medium">{a.role}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">Model: {a.default_model}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
