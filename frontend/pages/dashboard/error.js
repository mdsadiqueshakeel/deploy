import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import DashboardLayout from '../../components/DashboardLayout';

export default function DashboardError() {
  const router = useRouter();
  const { message } = router.query;

  return (
    <DashboardLayout title="Error">
      <div className="container-fluid px-4 py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div 
              className="card shadow-lg border-0 p-4 p-md-5 text-center" 
              style={{
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
                  Error
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
                  {message || 'An unexpected error occurred in the dashboard'}
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
        </div>
      </div>
    </DashboardLayout>
  );
}