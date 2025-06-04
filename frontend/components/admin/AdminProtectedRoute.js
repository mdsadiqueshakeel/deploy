import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../services/api';

const AdminProtectedRoute = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          if (typeof window !== 'undefined') {
            const adminToken = localStorage.getItem('adminToken');
            
            if (!adminToken) {
              router.push('/admin/login');
              return;
            }

            // Changed from /admin/verify to /api/admin/verify
            await api.get('/api/admin/verify', {
              headers: { Authorization: `Bearer ${adminToken}` }
            });
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Auth error:', error);
          localStorage.removeItem('adminToken');
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

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
};

export default AdminProtectedRoute;