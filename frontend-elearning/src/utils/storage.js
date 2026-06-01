export const tokenStorage = {
  get: () => localStorage.getItem('token'),
  set: (token) => localStorage.setItem('token', token),
  clear: () => localStorage.removeItem('token'),
};