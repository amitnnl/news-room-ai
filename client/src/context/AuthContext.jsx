import React, { createContext, useContext, useState, useEffect } from 'react';
import NewsAPI from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('newsroom_auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('newsroom_auth_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function verifySession() {
      const storedToken = localStorage.getItem('newsroom_auth_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await NewsAPI.getMe();
        if (res?.success && res.user) {
          setUser(res.user);
          localStorage.setItem('newsroom_auth_user', JSON.stringify(res.user));
        } else {
          logout();
        }
      } catch (err) {
        // Token might have expired
        console.warn('Session verification error:', err.message);
        logout();
      } finally {
        setIsLoading(false);
      }
    }

    verifySession();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await NewsAPI.login(email, password);
      if (res?.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('newsroom_auth_token', res.token);
        localStorage.setItem('newsroom_auth_user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      throw new Error(res?.message || 'Login failed');
    } catch (err) {
      // Graceful fallback for static hosting / Netlify previews when backend URL is not yet connected
      if (!err.response && (email === 'admin@newsroom.ai' || email === 'editor@newsroom.ai')) {
        const demoUser = {
          id: email.startsWith('admin') ? 1 : 2,
          name: email.startsWith('admin') ? 'Dev Sharma' : 'Priya Verma',
          email,
          role: email.startsWith('admin') ? 'super_admin' : 'editor',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        };
        const demoToken = 'demo_session_token_newsroom_ai_2026';
        setToken(demoToken);
        setUser(demoUser);
        localStorage.setItem('newsroom_auth_token', demoToken);
        localStorage.setItem('newsroom_auth_user', JSON.stringify(demoUser));
        return { success: true, user: demoUser };
      }
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('newsroom_auth_token');
    localStorage.removeItem('newsroom_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
