// Frontend Authentication & MongoDB Gateway Service

const TOKEN_KEY = 'orthomorph_auth_token';
const USER_KEY = 'orthomorph_auth_user';

export const getStoredToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setAuthSession = (token, user, remember = true) => {
  try {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to write auth storage', err);
  }
};

export const clearAuthSession = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  } catch (err) {
    console.error('Failed to clear auth storage', err);
  }
};

// API Calls
export const loginApi = async (email, password, remember = true) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Login failed. Please check credentials.');
  }

  if (data.token && data.user && !data.require2FA) {
    setAuthSession(data.token, data.user, remember);
  }
  return data;
};

export const registerApi = async (userData, remember = true) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Registration failed.');
  }

  if (data.token && data.user && !data.require2FA) {
    setAuthSession(data.token, data.user, remember);
  }
  return data;
};

export const demoLoginApi = async (profileKey = 'surgeon', remember = true, skip2FA = false) => {
  const response = await fetch('/api/auth/demo-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileKey, skip2FA }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Demo login failed.');
  }

  if (data.token && data.user && !data.require2FA) {
    setAuthSession(data.token, data.user, remember);
  }
  return data;
};

export const verify2faApi = async (tempToken, code, remember = true) => {
  const response = await fetch('/api/auth/verify-2fa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tempToken, code }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Invalid or expired 6-digit security code.');
  }

  setAuthSession(data.token, data.user, remember);
  return data;
};

export const resend2faApi = async (tempToken) => {
  const response = await fetch('/api/auth/resend-2fa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tempToken }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to generate new security code.');
  }
  return data;
};

export const getMeApi = async () => {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const response = await fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok && data.success) {
      return data.user;
    }
    clearAuthSession();
    return null;
  } catch (err) {
    console.warn('Could not verify token with server:', err);
    return getStoredUser();
  }
};

export const patientRegisterApi = async (biodata, remember = true) => {
  const response = await fetch('/api/auth/patient-register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(biodata),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Patient biodata registration failed.');
  }

  if (data.token && data.user && !data.require2FA) {
    setAuthSession(data.token, data.user, remember);
  }
  return data;
};

export const fetchDispatchOrdersApi = async () => {
  try {
    const res = await fetch('/api/dispatch');
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error('Failed to query dispatch orders:', err);
    return [];
  }
};

export const getDbStatusApi = async () => {
  try {
    const response = await fetch('/api/auth/status');
    const data = await response.json();
    return data?.database || { isConnected: false };
  } catch (err) {
    return { isConnected: false, mode: 'Offline' };
  }
};
