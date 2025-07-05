import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { checkAuth, getToken, clearAllTokens } from '../utils/auth';

const ProtectedRoute = (WrappedComponent) => {
  const ComponentWithAuth = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
    const verifyAuth = async () => {
      try {
        // First check if we have a token in storage (with fallback)
        const token = getToken();
        
        if (!token) {
          console.log('No token found in any storage, redirecting to login');
          router.replace('/auth/login');
          return;
        }
        
        // Then verify with the server
        const user = await checkAuth();
        if (!user) {
          console.log('Token invalid or expired, redirecting to login');
          // Clear any invalid tokens from all storage types
          clearAllTokens();
          router.replace('/auth/login');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        // Clear any invalid tokens from all storage types
        clearAllTokens();
        router.replace('/auth/login');
      }
    };
    verifyAuth();
  }, [router]);

    if (loading) {
      // Optionally, show a spinner or nothing while checking auth
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  ComponentWithAuth.displayName = `ProtectedRoute(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return ComponentWithAuth;
};

export default ProtectedRoute;