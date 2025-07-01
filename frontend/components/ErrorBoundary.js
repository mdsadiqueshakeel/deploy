import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} resetError={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}

// Separate component for the error UI
function ErrorFallback({ error, resetError }) {
  const router = useRouter();

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center py-5">
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
            Oops!
          </span>
        </div>
        
        <h1 className="mb-4 fw-bold" style={{ color: '#0A2463' }}>
          Something went wrong
        </h1>
        
        <div 
          className="alert alert-danger mb-4" 
          style={{
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            border: '1px solid rgba(220, 53, 69, 0.3)',
            color: '#721c24'
          }}
        >
          <p className="mb-0">
            {error?.message || 'An unexpected error occurred'}
          </p>
        </div>
        
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
            onClick={() => {
              resetError();
              router.reload();
            }}
            className="btn btn-outline-secondary px-4 py-2"
            style={{
              borderRadius: '10px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;