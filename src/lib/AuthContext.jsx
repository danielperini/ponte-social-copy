import React, { createContext, useState, useContext, useEffect } from 'react';
import { request, site } from '@/api/siteClient';

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setLoading] = useState(true);
  const [appPublicSettings, setSettings] = useState({ public_settings: { auth_required: false }, google_enabled: false });
  const checkUserAuth = async () => {
    try { setUser(await site.auth.me()); } catch { setUser(null); }
  };
  const checkAppState = async () => {
    try {
      const session = await request('session');
      setUser(session.user);
      setSettings(session.settings);
    } catch { setUser(null); } finally { setLoading(false); }
  };
  useEffect(() => { checkAppState(); }, []);
  const logout = async (redirect = true) => {
    await site.auth.logout();
    setUser(null);
    if (redirect) window.location.href = '/';
  };
  return <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoadingAuth,
    isLoadingPublicSettings: false, authError: null, appPublicSettings, authChecked: !isLoadingAuth,
    logout, navigateToLogin: site.auth.redirectToLogin, checkUserAuth, checkAppState }}>
    {children}
  </AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
