import axios from 'axios';
// Defina VITE_API_URL no .env para usar a API real. Vazio = usa mocks.
export const API_URL = import.meta.env.VITE_API_URL as string | undefined;
export const USE_MOCKS = !API_URL;
export const TOKEN_KEY = 'pedeai_token';
export const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((c) => { const t = localStorage.getItem(TOKEN_KEY); if (t) c.headers.Authorization = `Bearer ${t}`; return c; });
api.interceptors.response.use((r) => r, (e) => { if (e.response?.status === 401 && location.pathname.startsWith('/admin') && !location.pathname.startsWith('/admin/login')) { localStorage.removeItem(TOKEN_KEY); location.href = '/admin/login'; } return Promise.reject(e); });
export const mock = async <T,>(fn: () => T, ms = 350): Promise<T> => { await new Promise((r) => setTimeout(r, ms)); return fn(); };
let n = 100; export const uid = () => `id${++n}${Date.now()}`;
