import type { AuthSession } from '../../types';
import { api, mock, USE_MOCKS } from './client';
const E = { login: '/auth/login', forgot: '/auth/forgot-password' }; // ajuste os endpoints aqui
export async function login(email: string, password: string): Promise<AuthSession> {
  if (USE_MOCKS) return mock(() => ({ token: 'mock-jwt', user: { name: 'Admin Demo', email } }));
  return (await api.post<AuthSession>(E.login, { email, password })).data;
}
export async function forgotPassword(email: string): Promise<void> {
  if (USE_MOCKS) return mock(() => undefined);
  await api.post(E.forgot, { email });
}
