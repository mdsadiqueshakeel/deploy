import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Custom404() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = countdown > 0 && setInterval(() => setCountdown(countdown - 1), 1000);
    if (countdown === 0) {
      router.push('/dashboard');
    }
    return () => clearInterval(timer);
  }, [countdown, router]);

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#F0F2F5' }}>
      <Head>
        <title>Page Not Found - GROWTHAFFINITY</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container d-flex flex-column align-items-center justify-content-center flex-grow-1 py-5">
        <div 
          className="card shadow-lg border-0 p-4 p-md-5 text-center" 
          style={{
            maxWidth: '600px',
            borderRadius: '15px',
            backgroundColor: 'white',
            border: '2px solid #E0E0E0',
            boxShadow: '0 10px 25px rgba(58, 134, 255, 0.2)',
          }}
        >
          <div className="mb-4">
            <span 
              className="display-1 fw-bold" 
              style={{ 
                color: '#0A2463',
                textShadow: '2px 2px 4px rgba(0, 245, 255, 0.2)'
              }}
            >
              404
            </span>
          </div>
          
          <h1 className="mb-4 fw-bold" style={{ color: '#0A2463' }}>
            Page Not Found
          </h1>
          
          <div 
            className="alert alert-info mb-4" 
            style={{
              backgroundColor: 'rgba(58, 134, 255, 0.1)',
              border: '1px solid rgba(58, 134, 255, 0.3)',
              color: '#0A2463'
            }}
          >
            <p className="mb-0">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <p className="mb-4">
            You will be redirected to the dashboard in <strong>{countdown}</strong> seconds.
          </p>
          
          <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
            <Link href="/dashboard" passHref>
              <button
                className="btn btn-primary px-4 py-2"
                style={{
                  background: 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  letterSpacing: '1px',
                  boxShadow: '0 4px 15px rgba(58, 134, 255, 0.4)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow = '0 6px 20px rgba(58, 134, 255, 0.6)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = '0 4px 15px rgba(58, 134, 255, 0.4)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Go to Dashboard
              </button>
            </Link>
            
            <button
              onClick={() => router.back()}
              className="btn btn-outline-secondary px-4 py-2"
              style={{
                borderRadius: '10px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
      
      <footer className="py-3 text-center" style={{ backgroundColor: '#0A2463', color: 'white' }}>
        <div className="container">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} GROWTHAFFINITY. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}