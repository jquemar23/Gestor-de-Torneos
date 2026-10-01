const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token');

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message ?? 'Error en la petición');
  }

  return data as T;
}

export const api = {
  auth: {
    login: (payload: { email: string; password: string }) =>
      apiRequest<{ token: string; user: { id: string; email: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    register: (payload: { email: string; password: string }) =>
      apiRequest<{ token: string; user: { id: string; email: string } }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    me: () => apiRequest<{ user: { id: string; email: string } }>('/auth/me'),
  },
  tournaments: {
    getAll: () =>
      apiRequest<{ tournaments: any[] }>('/tournaments', {
        method: 'GET',
      }),
    create: (payload: any) =>
      apiRequest<{ tournament: any }>('/tournaments', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    update: (id: string, payload: any) =>
      apiRequest<{ tournament: any }>(`/tournaments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    remove: (id: string) =>
      apiRequest<{ message: string }>(`/tournaments/${id}`, {
        method: 'DELETE',
      }),
  },
};
