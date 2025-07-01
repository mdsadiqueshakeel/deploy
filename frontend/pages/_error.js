// pages/_error.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function ErrorPage({ statusCode }) {
  const router = useRouter();
  const [userType, setUserType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check auth status and user type when component mounts
    const checkAuth = () => {
      try {
        const userData = typeof window !== 'undefined' && 
          (sessionStorage.getItem('userProfileData') || 
          localStorage.getItem('userProfileData');
        
        if (userData) {
          const parsedData = JSON.parse(userData);
          // Check if user is admin
          const isAdmin = parsedData?.role === 'admin' || 
                         parsedData?.isAdmin;
          setIsLoggedIn(true);
          setUserType(isAdmin ? 'admin' : 'user');
        } else {
          setIsLoggedIn(false);
          setUserType(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsLoggedIn(false);
        setUserType(null);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Head>
        <title>Error {statusCode} | GROWTHAFFINITY</title>
      </Head>

      <div className="text-center p-4" style={{ maxWidth: '600px' }}>
        <h1 className="display-1 fw-bold mb-4" style={{ color: '#0A2463' }}>
          {statusCode || 'Error'}
        </h1>
        
        <h2 className="mb-4">
          {statusCode === 404 
            ? 'Page Not Found' 
            : 'Something went wrong'}
        </h2>

        <p className="lead mb-4">
          {statusCode === 404
            ? "The page you're looking for doesn't exist."
            : "We're working to fix the issue. Please try again later."}
        </p>

        <div className="d-flex gap-3 justify-content-center">
          <Link href="/" className="btn btn-outline-primary">
            Go to Home
          </Link>
          
          {isLoggedIn ? (
            userType === 'admin' ? (
              <Link href="/admin/dashboard" className="btn btn-primary">
                Go to Admin Dashboard
              </Link>
            ) : (
              <Link href="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            )
          ) : (
            <Link href="/auth/login" className="btn btn-primary">
              Go to Login Page
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};