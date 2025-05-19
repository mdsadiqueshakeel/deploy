import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getToken } from '../utils/auth';

const ProtectedRoute = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    
    useEffect(() => {
  const checkAuth = async () => {
    const token = getToken();
    if (!token) {
      router.push('/auth/login');
    }
    // Add token verification API call if needed
  };
  checkAuth();
}, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default ProtectedRoute;