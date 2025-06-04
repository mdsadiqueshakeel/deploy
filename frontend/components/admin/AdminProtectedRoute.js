import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../services/api';


const AdminProtectedRoute = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          // Check if we're in the browser environment
          if (typeof window !== 'undefined') {
            const adminToken = localStorage.getItem('adminToken');
            
            if (!adminToken) {
              router.push('/admin/login');
              return;
            }

            // Verify token with backend
            await api.get('/admin/verify', {
  headers: { Authorization: `Bearer ${adminToken}` }
});
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Admin authentication error:', error);
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

// Add this inside the checkAuth function
const checkAuth = async () => {
  try {
    if (typeof window !== "undefined") {
      const adminToken = localStorage.getItem("adminToken");
      console.log('[Frontend] AdminToken from localStorage:', adminToken);
      
      if (!adminToken) {
        console.log('[Frontend] No token - redirecting to login');
        router.push("/admin/login");
        return;
      }

      // Add token to request headers
      api.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
      
      try {
        console.log('[Frontend] Verifying token with backend');
        await api.get("/admin/verify", {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('[Frontend] Verification error:', error);
        // ... rest of error handling ...
      }
    }
  } catch (error) {
    console.error('[Frontend] Auth check error:', error);
    // ... rest of error handling ...
  } finally {
    setLoading(false);
  }
};

export default AdminProtectedRoute;