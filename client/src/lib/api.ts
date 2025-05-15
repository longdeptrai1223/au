export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('firebaseToken');
  const headers = {
    ...options.headers,
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
  return fetch(url, { ...options, headers, credentials: 'include' });
};