/**
 * src/context/AuthContext.jsx
 *
 * FIX CRITIQUE :
 *   - Le backend retourne { access_token, token_type, user }
 *     → on lit data.access_token  (pas data.token)
 *   - Le 2FA retourne { two_factor_required: true, challenge_token }
 *     → on teste data.two_factor_required  (pas data.two_factor)
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi, tokenStorage } from '../service/api'; // ← adapte si ton chemin diffère

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaurer la session depuis le token stocké
  useEffect(() => {
    const token = tokenStorage.get();
    if (!token) { setLoading(false); return; }

    authApi.me()
      .then((data) => setUser(data.user ?? data))
      .catch(() => tokenStorage.remove())
      .finally(() => setLoading(false));
  }, []);

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);

    // Le backend répond 202 + two_factor_required:true quand 2FA est activé
    if (data.two_factor_required) {
      return { twoFactor: true, challengeToken: data.challenge_token };
    }

    // ✅ FIX : le champ est "access_token", pas "token"
    tokenStorage.set(data.access_token);
    setUser(data.user);
    return { twoFactor: false };
  }, []);

  // ─── Register ─────────────────────────────────────────────────────────────
  const register = useCallback(async (formData) => {
    const data = await authApi.register(formData);
    // Même convention : access_token
    tokenStorage.set(data.access_token ?? data.token);
    setUser(data.user);
  }, []);

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch (_) {}
    tokenStorage.remove();
    setUser(null);
  }, []);

  // ─── 2FA Challenge ────────────────────────────────────────────────────────
  const twoFactorChallenge = useCallback(async (challengeToken, code) => {
    const data = await authApi.twoFactorChallenge(challengeToken, code);
    tokenStorage.set(data.access_token ?? data.token);
    setUser(data.user);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      twoFactorChallenge,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>');
  return ctx;
}

export default AuthContext;