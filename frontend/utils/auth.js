// export const setToken = (token) => {
//   localStorage.setItem('token', token);
// };

// export const getToken = () => {
//   return localStorage.getItem('token');
// };

// export const removeToken = () => {
//   localStorage.removeItem('token');
// };

export const checkAuth = async () => {
  try {
    const response = await api.get('/api/auth/check-auth');
    return response.data.authenticated ? response.data.user : null;
  } catch (error) {
    return null;
  }
};

// Usage in component
const currentUser = await checkAuth();
if (!currentUser) {
  router.push('/login');
}