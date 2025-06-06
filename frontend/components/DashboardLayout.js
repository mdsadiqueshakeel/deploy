import { useState } from 'react';
import Head from 'next/head';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ProtectedRoute from './ProtectedRoute';

const DashboardLayout = ({ children, title = 'Dashboard' }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [coins, setCoins] = useState(0);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ProtectedRoute>
      <div className="dashboard-layout">
        <Head>
          <title>{title} | MLM System</title>
        </Head>
        
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        
        <div 
          className="main-content"
          style={{
            marginLeft: isOpen ? '280px' : '0',
            transition: 'margin-left 0.3s ease',
            minHeight: '100vh',
            paddingTop: '60px',
            backgroundColor: '#f8f9fa'
          }}
        >
          <Topbar 
            toggleSidebar={toggleSidebar} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            coins={coins}
          />
          
          <div className="content-wrapper p-4">
            {children}
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 991.98px) {
            .main-content {
              margin-left: 0 !important;
            }
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;