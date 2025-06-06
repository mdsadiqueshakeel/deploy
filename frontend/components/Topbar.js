import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { logout } from '../utils/auth';

const Topbar = ({ toggleSidebar, searchQuery, setSearchQuery, coins }) => {
  const router = useRouter();
  const coinRef = useRef(null); // Ref for the coin display div

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const baseLineColor = '#3A86FF';
  const hoverLineColor = '#0A2463';

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Effect to trigger coin update animation
useEffect(() => {
  const currentRef = coinRef.current; // Capture current value
  
  if (currentRef) {
    currentRef.classList.add('coin-update-animation');
    const handler = () => {
      currentRef.classList.remove('coin-update-animation');
    };
    currentRef.addEventListener('animationend', handler);
    
    return () => {
      currentRef.removeEventListener('animationend', handler);
    };
  }
}, [coins]); // Re-run effect when coins change

  return (
    <nav
      className="navbar navbar-light shadow-sm position-fixed"
      style={{
        left: '280px',
        right: 0,
        top: 0,
        zIndex: 1000,
        backgroundColor: 'white',
        height: '60px',
        transition: 'left 0.3s ease-in-out',
      }}
    >
      <div className="container-fluid px-3">
        <div className="d-flex align-items-center w-100">
          {/* Hamburger menu button for mobile */}
          <button
            className="btn navbar-toggler-icon-custom d-lg-none me-2"
            onClick={toggleSidebar}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              outline: 'none',
              gap: '4px',
            }}
            onMouseEnter={(e) => {
              const lines = e.currentTarget.querySelectorAll('.hamburger-line');
              lines.forEach((line) => (line.style.backgroundColor = hoverLineColor));
            }}
            onMouseLeave={(e) => {
              const lines = e.currentTarget.querySelectorAll('.hamburger-line');
              lines.forEach((line) => (line.style.backgroundColor = baseLineColor));
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(58, 134, 255, 0.5)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="hamburger-line"
                style={{
                  width: '18px',
                  height: '2px',
                  backgroundColor: baseLineColor,
                  borderRadius: '1px',
                  transition: 'background-color 0.2s ease-in-out',
                }}
              />
            ))}
          </button>

          {/* Search bar */}
          <div
            className="input-group flex-grow-1 position-relative"
            style={{
              maxWidth: '300px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #F5F5F5 0%, #E8EEFF 100%)',
              boxShadow: '0 2px 8px rgba(58, 134, 255, 0.2)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(58, 134, 255, 0.3)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(58, 134, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span className="input-group-text bg-transparent border-0 d-flex align-items-center justify-content-center" style={{ padding: '0 10px' }}>
              <i className="bi-search" style={{ color: '#3A86FF', fontSize: '1rem', transition: 'color 0.3s ease, transform 0.3s ease' }}></i>
            </span>
            <input
              className="form-control"
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                boxShadow: 'none',
                border: 'none',
                borderRadius: '12px',
                color: '#0A2463',
                backgroundColor: 'transparent',
                fontSize: '0.95rem',
                padding: '10px 12px',
                paddingRight: searchQuery ? '30px' : '12px',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.parentElement.style.border = '2px solid #3A86FF';
                e.target.parentElement.style.boxShadow = '0 0 0 0.2rem rgba(58, 134, 255, 0.3)';
                const icon = e.target.parentElement.querySelector('.bi-search');
                icon.style.color = '#0A2463';
                icon.style.transform = 'scale(1.1)';
              }}
              onBlur={(e) => {
                e.target.parentElement.style.border = 'none';
                e.target.parentElement.style.boxShadow = '0 2px 8px rgba(58, 134, 255, 0.2)';
                const icon = e.target.parentElement.querySelector('.bi-search');
                icon.style.color = '#3A86FF';
                icon.style.transform = 'scale(1)';
              }}
            />
            {searchQuery && (
              <button
                className="position-absolute"
                onClick={handleClearSearch}
                style={{
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#0A2463',
                  cursor: 'pointer',
                  padding: '0',
                  fontSize: '0.9rem',
                  zIndex: 2,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#3A86FF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#0A2463';
                }}
              >
                <i className="bi-x-lg"></i>
              </button>
            )}
          </div>

          {/* Coin Display - now with ref for animation */}
          <div
            ref={coinRef} // Attach ref here
            className="d-flex align-items-center me-3 ms-3"
            style={{
              background: 'linear-gradient(135deg, #FFF3B0 0%, #FFD700 100%)',
              boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)',
              borderRadius: '50px', // Apply rounded-pill via style for consistency
              padding: '8px 15px', // Adjust padding for better look
            }}
          >
            <i className="bi-coin me-2" style={{ color: '#0A2463', fontSize: '1.2rem' }}></i>
            <span className="fw-bold" style={{ color: '#0A2463' }}>
              {(coins ?? 0).toLocaleString()}
            </span>
          </div>

          {/* Logout button */}
          <div className="ms-auto">
            <button
              onClick={handleLogout}
              className="btn py-1 px-2"
              style={{
                background: 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)',
                color: 'white',
                borderRadius: '8px',
                fontWeight: '600',
                border: 'none',
                boxShadow: '0 2px 8px rgba(58, 134, 255, 0.3)',
                fontSize: '0.9rem',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 4px 12px rgba(58, 134, 255, 0.5)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 2px 8px rgba(58, 134, 255, 0.3)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <i className="bi-box-arrow-right me-1"></i>
              Logout
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .navbar-toggler-icon-custom {
          padding: 0 !important;
        }

        .input-group input::placeholder {
          color: #6B7280;
          opacity: 0.8;
          font-style: italic;
        }

        /* Coin update animation */
        @keyframes coinUpdate {
          0% { transform: scale(1); box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3); }
          25% { transform: scale(1.1); box-shadow: 0 0 15px #FFD700; }
          100% { transform: scale(1); box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3); }
        }

        .coin-update-animation {
          animation: coinUpdate 0.8s ease-out; /* Adjusted duration for quick feedback */
        }


        @media (max-width: 992px) {
          .navbar {
            left: 0 !important;
            height: 56px;
          }
          .container-fluid {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
          .input-group {
            maxWidth: 200px !important;
            padding: 8px !important;
          }
          .form-control {
            fontSize: 0.85rem !important;
            padding: 8px 10px !important;
            paddingRight: 8px !important;
          }
          .input-group-text {
            padding: 0 8px !important;
          }
          .bi-search {
            fontSize: 0.9rem !important;
          }
          .btn {
            padding: 0.3rem 0.6rem !important;
            fontSize: 0.85rem !important;
          }
        }

        @media (max-width: 576px) {
          .input-group {
            maxWidth: 150px !important;
            padding: 6px !important;
          }
          .form-control {
            fontSize: 0.8rem !important;
            padding: 6px 8px !important;
            paddingRight: 6px !important;
          }
          .input-group-text {
            padding: 0 6px !important;
          }
          .bi-search {
            fontSize: 0.85rem !important;
          }
          .btn {
            padding: 0.2rem 0.5rem !important;
            fontSize: 0.8rem !important;
          }
          .navbar-toggler-icon-custom {
            width: 30px !important;
            height: 30px !important;
            gap: 3px !important;
          }
          .navbar-toggler-icon-custom .hamburger-line {
            width: 16px !important;
            height: 2px !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Topbar;