import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function AdminLayout({ children, title }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Head>
        <title>{title} | Admin Dashboard</title>
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
          rel="stylesheet"
        />
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.0/font/bootstrap-icons.css"
        />
      </Head>

      {/* Sidebar */}
      <div 
        className={`bg-dark text-white ${sidebarOpen ? 'col-md-3 col-lg-2' : 'col-md-1'} p-0 d-flex flex-column`}
        style={{ transition: 'all 0.3s' }}
      >
        <div className="p-3 d-flex justify-content-between align-items-center">
          {sidebarOpen && <h5 className="mb-0">Admin Panel</h5>}
          <button 
            className="btn btn-sm btn-outline-light"
            onClick={toggleSidebar}
          >
            <i className={`bi bi-${sidebarOpen ? 'arrow-left' : 'arrow-right'}`}></i>
          </button>
        </div>
        <hr className="my-0" />
        <ul className="nav nav-pills flex-column mb-auto p-2">
          <li className="nav-item">
            <Link href="/admin/dashboard" className="nav-link text-white">
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/admin/users"
              className={`nav-link text-white ${router.pathname === '/admin/users' ? 'active' : ''}`}
            >
              <i className="bi bi-people me-2"></i>
              {sidebarOpen && 'User Management'}
            </Link>
          </li>
          <li>
            <Link
              href="/admin/transactions"
              className={`nav-link text-white ${router.pathname.startsWith('/admin/transactions') ? 'active' : ''}`}
            >
              <i className="bi bi-cash-coin me-2"></i>
              {sidebarOpen && 'Transactions'}
            </Link>
          </li>
          <li>
            <Link
              href="/admin/reports"
              className={`nav-link text-white ${router.pathname === '/admin/reports' ? 'active' : ''}`}
            >
              <i className="bi bi-graph-up me-2"></i>
              {sidebarOpen && 'Reports'}
            </Link>
          </li>
        </ul>
        <div className="mt-auto p-3 border-top">
          <button 
            onClick={handleLogout}
            className="btn btn-outline-light w-100"
          >
            <i className="bi bi-box-arrow-left me-2"></i>
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light">
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
          <div className="container-fluid">
            <button 
              className="btn btn-sm"
              onClick={toggleSidebar}
            >
              <i className="bi bi-list"></i>
            </button>
            <div className="d-flex align-items-center">
              <span className="me-3 d-none d-md-block">Admin User</span>
              <div className="dropdown">
                <button 
                  className="btn dropdown-toggle"
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle fs-4"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><a className="dropdown-item" href="#">Profile</a></li>
                  <li><a className="dropdown-item" href="#">Settings</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}