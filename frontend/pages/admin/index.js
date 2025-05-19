import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill all required details');
      return;
    }
    setError('');
    // Proceed with admin login logic
    console.log('Admin logging in with:', username, password);
  };

  const handleUserLogin = () => {
    router.push('/auth/login');
  };

  // Initialize Bootstrap
  useEffect(() => {
    if (typeof window !== 'undefined') {
      require('bootstrap/dist/js/bootstrap.bundle.min');
    }
  }, []);

  return (
    <>
      <Head>
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
          rel="stylesheet"
        />
      </Head>
      
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center" style={{ 
        backgroundColor: '#FFFFFF',
        backgroundImage: 'radial-gradient(circle at 90% 20%, rgba(58, 134, 255, 0.1) 0%, rgba(10, 36, 99, 0.1) 90%)'
      }}>
        <div className="text-center mb-4">
          <h1 className="fw-bold display-4" style={{ 
            color: '#0A2463',
            textShadow: '2px 2px 4px rgba(58, 134, 255, 0.3)',
            letterSpacing: '2px'
          }}>
            BOT <span style={{ color: '#3A86FF' }}>ALPHA</span>
          </h1>
          <p className="lead" style={{ 
            color: '#0A2463',
            fontWeight: '500',
            textShadow: '1px 1px 2px rgba(0, 245, 255, 0.2)'
          }}>
            Admin Portal - Restricted Access
          </p>
        </div>

        <div className="card p-4 shadow-lg" style={{ 
          width: '100%', 
          maxWidth: '400px',
          backgroundColor: 'white',
          border: 'none',
          borderRadius: '15px',
          boxShadow: '0 10px 25px rgba(58, 134, 255, 0.2)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          ':hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 15px 30px rgba(58, 134, 255, 0.3)'
          }
        }}>
          <div className="dropdown mb-3">
            <button 
              className="btn dropdown-toggle w-100 py-3" 
              style={{ 
                background: 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                letterSpacing: '1px',
                boxShadow: '0 4px 15px rgba(58, 134, 255, 0.4)',
                transition: 'all 0.3s ease'
              }}
              type="button" 
              id="adminLoginDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 6px 20px rgba(58, 134, 255, 0.6)';
                e.target.style.background = 'linear-gradient(135deg, #0A2463 0%, #3A86FF 100%)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 4px 15px rgba(58, 134, 255, 0.4)';
                e.target.style.background = 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)';
              }}
            >
              Admin Login
            </button>
            <ul className="dropdown-menu w-100" aria-labelledby="adminLoginDropdown" style={{
              border: 'none',
              borderRadius: '10px',
              boxShadow: '0 10px 25px rgba(58, 134, 255, 0.2)'
            }}>
              <li>
                <button 
                  className="dropdown-item py-2" 
                  onClick={handleUserLogin}
                  style={{ 
                    color: '#0A2463',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#3A86FF';
                    e.target.style.backgroundColor = 'rgba(58, 134, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#0A2463';
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  User Login
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item py-2" 
                  style={{ 
                    color: '#0A2463',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#3A86FF';
                    e.target.style.backgroundColor = 'rgba(58, 134, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#0A2463';
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  Admin Login
                </button>
              </li>
            </ul>
          </div>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger" role="alert" style={{
                borderRadius: '10px',
                borderLeft: '4px solid #3A86FF',
                backgroundColor: 'rgba(255, 82, 82, 0.1)'
              }}>
                {error}
              </div>
            )}
            <div className="mb-4">
              <input 
                type="text" 
                className="form-control py-3" 
                placeholder="Admin Username"
                style={{ 
                  border: '2px solid #E0E0E0',
                  borderRadius: '10px',
                  color: '#0A2463',
                  backgroundColor: '#F5F5F5',
                  transition: 'all 0.3s'
                }}
                value={username}
                onChange={e => setUsername(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3A86FF';
                  e.target.style.boxShadow = '0 0 0 0.25rem rgba(58, 134, 255, 0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E0E0E0';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>
            <div className="mb-4">
              <input 
                type="password" 
                className="form-control py-3" 
                placeholder="Admin Password"
                style={{ 
                  border: '2px solid #E0E0E0',
                  borderRadius: '10px',
                  color: '#0A2463',
                  backgroundColor: '#F5F5F5',
                  transition: 'all 0.3s'
                }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3A86FF';
                  e.target.style.boxShadow = '0 0 0 0.25rem rgba(58, 134, 255, 0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E0E0E0';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn w-100 py-3 mb-3"
              style={{ 
                background: 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                letterSpacing: '1px',
                boxShadow: '0 4px 15px rgba(58, 134, 255, 0.4)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
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
              <span style={{ position: 'relative', zIndex: '2' }}>ADMIN LOGIN</span>
              <span style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.3) 0%, transparent 100%)',
                transform: 'rotate(45deg)',
                transition: 'all 0.5s ease',
                opacity: '0'
              }} 
              className="btn-shine"
              />
            </button>
          </form>
          
          <div className="text-center mt-3">
            <Link 
              href="/auth/forgot-password" 
              className="text-decoration-none small fw-medium"
              style={{ 
                color: '#0A2463',
                transition: 'all 0.2s',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#00F5FF';
                e.target.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#0A2463';
                e.target.style.transform = 'translateX(0)';
              }}
            >
              Forget admin credentials? →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}