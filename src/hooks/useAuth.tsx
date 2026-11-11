import { createContext, useContext, useState, type ReactNode } from 'react';
import * as authApi from '../services/api/auth';
import { TOKEN_KEY } from '../services/api/client';
interface Ctx { token: string | null; isAuthenticated: boolean; login: (e: string, p: string) => Promise<void>; logout: () => void }
const AuthCtx = createContext<Ctx>(null!);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const login = async (email: string, password: string) => { const s = await authApi.login(email, password); localStorage.setItem(TOKEN_KEY, s.token); setToken(s.token); };
  const logout = () => { localStorage.removeItem(TOKEN_KEY); setToken(null); };
  return <AuthCtx.Provider value={{ token, isAuthenticated: !!token, login, logout }}>{children}</AuthCtx.Provider>;
};
export const useAuth = () => useContext(AuthCtx);
