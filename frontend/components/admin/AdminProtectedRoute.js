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
      // First check if we have an admin token in sessionStorage
      const adminToken = sessionStorage.getItem('adminToken');
      
      if (!adminToken) {
        console.log('No admin token found in sessionStorage, redirecting to login');
        router.push('/admin/login');
        return;
      }
      
      // Then verify with the server
      await api.get('/api/admin/verify');
      console.log('Admin authentication verified with server');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Admin auth error:', error);
      // Clear any invalid tokens
      sessionStorage.removeItem('adminToken');
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
