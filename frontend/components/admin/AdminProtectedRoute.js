import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../services/api';

const AdminProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const checkAuth = async () => {
    try {
      await api.get('/api/admin/verify'); // ✅ sends cookie automatically
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, [router]);


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

AdminProtectedRoute.displayName = 'AdminProtectedRoute';

export default AdminProtectedRoute;
