import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getStoredToken,
  getStoredUser,
  loginApi,
  registerApi,
  patientRegisterApi,
  demoLoginApi,
  verify2faApi,
  resend2faApi,
  getMeApi,
  getDbStatusApi,
  clearAuthSession,
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getStoredToken());
  const [isLoading, setIsLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState({
    isConnected: false,
    mode: 'Connecting...',
    dbName: 'orthomorph_db',
  });

  const [twoFactorState, setTwoFactorState] = useState({
    isPending: false,
    tempToken: null,
    emailMasked: '',
    simulatedCode: '',
    userSummary: null,
  });

  const refreshDbStatus = useCallback(async () => {
    try {
      const status = await getDbStatusApi();
      setDbStatus(status);
    } catch {
      setDbStatus({ isConnected: false, mode: 'Offline' });
    }
  }, []);

  // Check auth session & DB status on startup
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        await refreshDbStatus();
        const activeUser = await getMeApi();
        if (isMounted && activeUser) {
          setUser(activeUser);
        }
      } catch (err) {
        console.warn('Auth initialization error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initializeAuth();

    // Heartbeat DB check every 30 seconds
    const interval = setInterval(refreshDbStatus, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [refreshDbStatus]);

  const login = async (email, password, remember = true) => {
    setIsLoading(true);
    try {
      const res = await loginApi(email, password, remember);
      if (res.require2FA) {
        setTwoFactorState({
          isPending: true,
          tempToken: res.tempToken,
          emailMasked: res.emailMasked,
          simulatedCode: res.simulatedCode,
          userSummary: res.userSummary,
        });
      } else {
        setUser(res.user);
        setToken(res.token);
      }
      await refreshDbStatus();
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData, remember = true) => {
    setIsLoading(true);
    try {
      const res = await registerApi(userData, remember);
      if (res.require2FA) {
        setTwoFactorState({
          isPending: true,
          tempToken: res.tempToken,
          emailMasked: res.emailMasked,
          simulatedCode: res.simulatedCode,
          userSummary: res.userSummary,
        });
      } else {
        setUser(res.user);
        setToken(res.token);
      }
      await refreshDbStatus();
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const patientRegister = async (biodata, remember = true) => {
    setIsLoading(true);
    try {
      const res = await patientRegisterApi(biodata, remember);
      if (res.require2FA) {
        setTwoFactorState({
          isPending: true,
          tempToken: res.tempToken,
          emailMasked: res.emailMasked,
          simulatedCode: res.simulatedCode,
          userSummary: res.userSummary,
        });
      } else {
        setUser(res.user);
        setToken(res.token);
      }
      await refreshDbStatus();
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (profileKey = 'surgeon', remember = true, skip2FA = false) => {
    setIsLoading(true);
    try {
      const res = await demoLoginApi(profileKey, remember, skip2FA);
      if (res.require2FA) {
        setTwoFactorState({
          isPending: true,
          tempToken: res.tempToken,
          emailMasked: res.emailMasked,
          simulatedCode: res.simulatedCode,
          userSummary: res.userSummary,
        });
      } else {
        setUser(res.user);
        setToken(res.token);
      }
      await refreshDbStatus();
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const verify2FA = async (code, remember = true) => {
    if (!twoFactorState.tempToken) {
      throw new Error('No active two-step verification challenge found.');
    }
    setIsLoading(true);
    try {
      const res = await verify2faApi(twoFactorState.tempToken, code, remember);
      setUser(res.user);
      setToken(res.token);
      setTwoFactorState({
        isPending: false,
        tempToken: null,
        emailMasked: '',
        simulatedCode: '',
        userSummary: null,
      });
      await refreshDbStatus();
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const resend2FA = async () => {
    if (!twoFactorState.tempToken) return null;
    const res = await resend2faApi(twoFactorState.tempToken);
    setTwoFactorState(prev => ({
      ...prev,
      simulatedCode: res.simulatedCode || prev.simulatedCode,
      emailMasked: res.emailMasked || prev.emailMasked,
    }));
    return res;
  };

  const cancel2FA = () => {
    setTwoFactorState({
      isPending: false,
      tempToken: null,
      emailMasked: '',
      simulatedCode: '',
      userSummary: null,
    });
  };

  const logout = () => {
    clearAuthSession();
    setUser(null);
    setToken(null);
    cancel2FA();
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user),
    isLoading,
    dbStatus,
    twoFactorState,
    login,
    register,
    patientRegister,
    demoLogin,
    verify2FA,
    resend2FA,
    cancel2FA,
    logout,
    refreshDbStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
