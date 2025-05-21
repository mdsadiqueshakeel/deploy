import { useState, useEffect } from 'react';
import Head from 'next/head';
import Topbar from '@components/Topbar';
import Sidebar from '@components/Sidebar';
import Products from './dashboard/products';
import ProfileCard from '@components/ProfileCard';

// Placeholder components for other sections
const DashboardOverview = () => (
  <div className="p-4">
    <h2 className="mb-4" style={{ color: '#0A2463', fontWeight: '600' }}>
      Dashboard Overview
    </h2>
    <p style={{ color: '#0A2463' }}>
      Welcome to your dashboard! Here you can manage your business, wallet, and more.
    </p>
  </div>
);

const Business = () => (
  <div className="p-4">
    <h2 className="mb-4" style={{ color: '#0A2463', fontWeight: '600' }}>
      Business
    </h2>
    <p style={{ color: '#0A2463' }}>Manage your business details here.</p>
  </div>
);

const Wallet = () => (
  <div className="p-4">
    <h2 className="mb-4" style={{ color: '#0A2463', fontWeight: '600' }}>
      Wallet
    </h2>
    <p style={{ color: '#0A2463' }}>View your wallet balance and transactions.</p>
  </div>
);

const Status = () => (
  <div className="p-4">
    <h2 className="mb-4" style={{ color: '#0A2463', fontWeight: '600' }}>
      Status
    </h2>
    <p style={{ color: '#0A2463' }}>Check your account status and progress.</p>
  </div>
);

const RankRewards = () => (
  <div className="p-4">
    <h2 className="mb-4" style={{ color: '#0A2463', fontWeight: '600' }}>
      Rank & Rewards
    </h2>
    <p style={{ color: '#0A2463' }}>View your rank and available rewards.</p>
  </div>
);

const Support = () => (
  <div className="p-4">
    <h2 className="mb-4" style={{ color: '#0A2463', fontWeight: '600' }}>
      Support
    </h2>
    <p style={{ color: '#0A2463' }}>Get help and support for your account.</p>
  </div>
);

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Mock user data (replace with actual user data from auth)
  const user = {
    name: 'sam',
    email: 'samreels22@gmail.com',
    avatar: null,
    country: 'India',
  };

  // Map sections to components
  const sectionComponents = {
    Dashboard: <DashboardOverview />,
    Products: <Products searchQuery={searchQuery} />,
    Business: <Business />,
    Wallet: <Wallet />,
    Status: <Status />,
    'Rank & Rewards': <RankRewards />,
    Support: <Support />,
    Profile: <ProfileCard />,
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard - Bot Alpha</title>
        <meta name="description" content="Manage your Bot Alpha account" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
          rel="stylesheet"
        />
      </Head>

      <div className="d-flex">
        {/* Sidebar */}
        <Sidebar
          user={user}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          setActiveSection={setActiveSection}
          activeSection={activeSection}
        />

        {/* Main Content */}
        <div
          className="flex-grow-1"
          style={{
            marginLeft: isSidebarOpen && window.innerWidth <= 992 ? '0' : '280px',
            transition: 'margin-left 0.3s ease-in-out',
            backgroundColor: '#FFFFFF',
            backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(58, 134, 255, 0.1) 0%, rgba(10, 36, 99, 0.1) 90%)',
            minHeight: '100vh',
            paddingTop: '60px',
          }}
        >
          <Topbar
            toggleSidebar={toggleSidebar}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <main className="p-4">
            {sectionComponents[activeSection] || <DashboardOverview />}
          </main>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 992px) {
          .flex-grow-1 {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </>
  );
}