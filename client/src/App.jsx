import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CommandCenterModal from './components/CommandCenterModal';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OneClickStudio from './pages/OneClickStudio';
import EditorialStudio from './pages/EditorialStudio';
import BreakingNewsStudio from './pages/BreakingNewsStudio';
import ArticlesList from './pages/ArticlesList';
import SocialPublishing from './pages/SocialPublishing';
import VideoShortsStudio from './pages/VideoShortsStudio';
import TrendingRss from './pages/TrendingRss';
import ContentCalendar from './pages/ContentCalendar';
import UnifiedPlatformSetup from './pages/UnifiedPlatformSetup';
import SetupWizard from './pages/SetupWizard';
import SettingsAIBudget from './pages/SettingsAIBudget';
import AuditLogs from './pages/AuditLogs';
import PublicNewsPortal from './pages/PublicNewsPortal';

function AppLayout() {
  const location = useLocation();
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // If viewing the public news website, render standalone without admin shell
  const isPublicPortal = location.pathname.startsWith('/public');
  if (isPublicPortal) {
    return <PublicNewsPortal />;
  }

  // If viewing the login page, render standalone without editor shell
  const isLoginPage = location.pathname === '/login';
  if (isLoginPage) {
    return <Login />;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
        <Navbar onOpenCommandCenter={() => setIsCommandOpen(true)} />
        
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 overflow-x-hidden min-w-0 bg-slate-950/60">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/setup" element={<UnifiedPlatformSetup />} />
              <Route path="/integrations" element={<UnifiedPlatformSetup />} />
              <Route path="/wizard" element={<SetupWizard />} />
              <Route path="/setup-wizard" element={<SetupWizard />} />
              <Route path="/one-click" element={<OneClickStudio />} />
              <Route path="/editorial" element={<EditorialStudio />} />
              <Route path="/breaking-studio" element={<BreakingNewsStudio />} />
              <Route path="/articles" element={<ArticlesList />} />
              <Route path="/social" element={<SocialPublishing />} />
              <Route path="/video-studio" element={<VideoShortsStudio />} />
              <Route path="/rss-trends" element={<TrendingRss />} />
              <Route path="/calendar" element={<ContentCalendar />} />
              <Route path="/settings" element={<SettingsAIBudget />} />
              <Route path="/audit" element={<AuditLogs />} />
            </Routes>
          </main>
        </div>

        <CommandCenterModal 
          isOpen={isCommandOpen} 
          onClose={() => setIsCommandOpen(false)} 
        />
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/public/*" element={<PublicNewsPortal />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

