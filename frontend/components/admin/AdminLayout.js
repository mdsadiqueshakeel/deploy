import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import API from '../../services/api';

export default function AdminLayout({ children, title }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 992);
      setSidebarOpen(window.innerWidth >= 992);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // 🔄 Load Bootstrap JS for dropdown support
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('adminToken');
      await API.post('/api/admin/logout', {}, { withCredentials: true });
    } catch (err) {
      // Ignore logout failure
    }
    window.location.href = '/admin/login';
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => {
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Head>
        <title>{title} | Admin Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.0/font/bootstrap-icons.css"
        />
      </Head>

      {/* Mobile Backdrop */}
      {isMobile && sidebarOpen && (
        <div
          className="position-fixed w-100 h-100 bg-dark bg-opacity-50 z-index-1000"
          style={{ top: 0, left: 0 }}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`text-white d-flex flex-column position-lg-static ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        style={{
          background: 'linear-gradient(180deg, #0A2463 0%, #3A86FF 100%)',
          boxShadow: '2px 0 10px rgba(10, 36, 99, 0.5)',
          zIndex: 1100,
          position: isMobile ? 'fixed' : 'static',
          top: 0,
          bottom: 0,
          left: isMobile ? (sidebarOpen ? '0' : '-100%') : '0',
          width: isMobile ? '80%' : sidebarOpen ? '250px' : '80px',
          transition: 'all 0.3s ease',
        }}
      >
        <div className="p-3 d-flex justify-content-between align-items-center">
          {sidebarOpen && <h5 className="mb-0 fw-bold">Admin Panel</h5>}
          <button className="btn btn-sm" onClick={toggleSidebar} style={{ color: 'white' }}>
            <i className={`bi bi-${sidebarOpen ? 'arrow-left-circle' : 'arrow-right-circle'} fs-5`}></i>
          </button>
        </div>
        <hr style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }} className="my-0" />

        <ul className="nav nav-pills flex-column mb-auto p-2">
          <li className="nav-item">
            <Link href="/admin/dashboard" className={`nav-link ${router.pathname === '/admin/dashboard' ? 'active' : 'text-white'}`}
              style={{
                borderRadius: '8px',
                marginBottom: '5px',
                backgroundColor: router.pathname === '/admin/dashboard' ? '#3A86FF' : 'transparent',
                fontWeight: router.pathname === '/admin/dashboard' ? 'bold' : 'normal',
              }}>
              <i className="bi bi-speedometer2 me-2"></i>
              {sidebarOpen && 'Dashboard'}
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className={`nav-link ${router.pathname === '/admin/users' ? 'active' : 'text-white'}`}
              style={{
                borderRadius: '8px',
                marginBottom: '5px',
                backgroundColor: router.pathname === '/admin/users' ? '#3A86FF' : 'transparent',
                fontWeight: router.pathname === '/admin/users' ? 'bold' : 'normal',
              }}>
              <i className="bi bi-people me-2"></i>
              {sidebarOpen && 'User Management'}
            </Link>
          </li>
          <li>
            <Link href="/admin/transactions" className={`nav-link ${router.pathname.startsWith('/admin/transactions') ? 'active' : 'text-white'}`}
              style={{
                borderRadius: '8px',
                marginBottom: '5px',
                backgroundColor: router.pathname.startsWith('/admin/transactions') ? '#3A86FF' : 'transparent',
                fontWeight: router.pathname.startsWith('/admin/transactions') ? 'bold' : 'normal',
              }}>
              <i className="bi bi-cash-coin me-2"></i>
              {sidebarOpen && 'Transactions'}
            </Link>
          </li>
          <li>
            <Link href="/admin/reports" className={`nav-link ${router.pathname === '/admin/reports' ? 'active' : 'text-white'}`}
              style={{
                borderRadius: '8px',
                marginBottom: '5px',
                backgroundColor: router.pathname === '/admin/reports' ? '#3A86FF' : 'transparent',
                fontWeight: router.pathname === '/admin/reports' ? 'bold' : 'normal',
              }}>
              <i className="bi bi-graph-up me-2"></i>
              {sidebarOpen && 'Reports'}
            </Link>
          </li>
        </ul>

        <div className="mt-auto p-3 border-top">
          <button onClick={handleLogout} className="btn w-100"
            style={{
              background: 'linear-gradient(90deg, #FF5252 0%, #CC0000 100%)',
              color: 'white',
              borderRadius: '8px',
              fontWeight: 'bold',
              border: 'none'
            }}>
            <i className="bi bi-box-arrow-left me-2"></i>
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{
          background: '#FFFFFF',
          backgroundImage: 'radial-gradient(circle at 90% 20%, rgba(58, 134, 255, 0.1) 0%, rgba(10, 36, 99, 0.1) 90%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          width: isMobile ? '100%' : sidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 80px)',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Top Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light shadow-sm"
          style={{
            background: 'linear-gradient(90deg, #FFFFFF 0%, #E0E0E0 100%)',
            borderBottom: '1px solid #E0E0E0'
          }}
        >
          <div className="container-fluid">
            <div className="d-flex align-items-center w-100">
              <div className="d-flex align-items-center me-auto">
                <button className="btn btn-sm d-lg-none me-3" onClick={toggleSidebar} style={{ color: '#0A2463' }}>
                  <i className="bi bi-list fs-4"></i>
                </button>
                <span className="me-3 d-none d-md-block" style={{ color: '#0A2463' }}>Admin User</span>
              </div>
              <div className="dropdown">
                <button className="btn dropdown-toggle" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: '#0A2463' }}>
                  <i className="bi bi-person-circle fs-4"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg" aria-labelledby="profileDropdown" style={{ borderRadius: '10px' }}>
                  <li>
                    <Link href="/admin/profile" className="dropdown-item" style={{ color: '#0A2463' }}>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#" style={{ color: '#0A2463' }}>
                      Settings
                    </a>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout} style={{ color: '#FF5252' }}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="p-3 p-md-4 fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
