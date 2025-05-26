import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { checkAuth } from '../utils/auth';

const ProtectedRoute = (WrappedComponent) => {
  const ComponentWithAuth = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const verifyAuth = async () => {
        const user = await checkAuth();
        if (!user) {
          router.replace('/auth/login');
        } else {
          setLoading(false);
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