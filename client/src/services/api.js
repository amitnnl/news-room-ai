import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach Authorization Bearer token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('newsroom_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const NewsAPI = {
  // Authentication & Staff Access
  login: async (email, password) => (await api.post('/auth/login', { email, password })).data,
  getMe: async () => (await api.get('/auth/me')).data,
  register: async (userData) => (await api.post('/auth/register', userData)).data,
  getUsers: async () => (await api.get('/auth/users')).data,

  // Overview & Analytics
  getOverview: async () => (await api.get('/analytics/overview')).data,

  // Articles
  getArticles: async (params = {}) => (await api.get('/news', { params })).data,
  getArticle: async (id) => (await api.get(`/news/${id}`)).data,
  getCategories: async () => (await api.get('/news/categories')).data,
  updateArticle: async (id, data) => (await api.put(`/news/${id}`, data)).data,
  updateStatus: async (id, status, notes = '') => (await api.patch(`/news/${id}/status`, { status, notes })).data,
  aiAction: async (id, action, currentText = '', targetLanguage = 'hi') =>
    (await api.post(`/news/${id}/ai-action`, { action, currentText, targetLanguage })).data,
  deleteArticle: async (id) => (await api.delete(`/news/${id}`)).data,

  // AI Orchestration
  generateOneClickPackage: async (payload) => (await api.post('/agents/one-click-package', payload)).data,
  triggerBreakingNews: async (payload) => (await api.post('/agents/breaking', payload)).data,
  getAgents: async () => (await api.get('/agents')).data,
  getTasks: async () => (await api.get('/agents/tasks')).data,

  // Social Distribution & Unified Single Platform Config
  getSocialAccounts: async () => (await api.get('/social/accounts')).data,
  getUnifiedConfigs: async () => (await api.get('/social/accounts/unified-configs')).data,
  saveAllConfigs: async (payload) => (await api.post('/social/accounts/save-all', payload)).data,
  testConnection: async (payload) => (await api.post('/social/accounts/test-connection', payload)).data,
  toggleSocialAccount: async (id, status) => (await api.post('/social/accounts/toggle', { id, status })).data,
  getSocialPosts: async (params = {}) => (await api.get('/social/posts', { params })).data,
  publishSocialPost: async (id) => (await api.post(`/social/posts/${id}/publish`)).data,
  scheduleSocialPost: async (id, scheduledAt) => (await api.post(`/social/posts/${id}/schedule`, { scheduledAt })).data,
  publishFullPackage: async (articleId) => (await api.post(`/social/publish-package/${articleId}`)).data,

  // RSS & Trends
  getRssSources: async () => (await api.get('/rss/sources')).data,
  addRssSource: async (data) => (await api.post('/rss/sources', data)).data,
  getRssItems: async () => (await api.get('/rss/items')).data,
  fetchRssLive: async () => (await api.post('/rss/fetch')).data,
  convertRssItem: async (id) => (await api.post(`/rss/items/${id}/convert`)).data,

  getTrends: async () => (await api.get('/trends')).data,
  convertTrend: async (id) => (await api.post(`/trends/${id}/convert`)).data,

  // Calendar
  getCalendar: async () => (await api.get('/calendar')).data,
  rescheduleEvent: async (payload) => (await api.post('/calendar/reschedule', payload)).data,

  // AI Command Center
  executeCommand: async (prompt) => (await api.post('/command', { prompt })).data,

  // Settings & Audit
  getSettings: async () => (await api.get('/settings')).data,
  updateSettings: async (settings) => (await api.post('/settings', settings)).data,
  getAuditLogs: async () => (await api.get('/audit')).data
};

export default NewsAPI;

