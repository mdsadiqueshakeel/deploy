import { useState, useEffect } from 'react';
import Head from 'next/head';
import Topbar from '@components/Topbar';
import Sidebar from '@components/Sidebar';
import ProfileCard from '@components/ProfileCard';
import Products from '@pages/dashboard/products'; // Keep this if Products page is used
import BusinessPage from './business';

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

const Wallet = () => (
  <div className="p-4">
    <h2 className="mb-4" style={{ color: '#0A2463', fontWeight: '600' }}>Wallet</h2>
  </div>
);

const Status = () => (
  <div className="p-4">
    <h2 className="mb-4" style={{ color: '#0A2463', fontWeight: '600' }}>Status</h2>
  </div>
);

const RankRewards = () => (
  <div className="p-4">
    <h2 className="mb-4" style={{ color: '#0A2463', fontWeight: '600' }}>Rank & Rewards</h2>
  </div>
);

const Support = () => (
  <div className="p-4">
    <h2 className="mb-4" style={{ color: '#0A2463', fontWeight: '600' }}>Support</h2>
  </div>
);

export default function Dashboard({ initialUser }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(initialUser);
  const [coins, setCoins] = useState(1000); // demo coins

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('userProfileData');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error loading user data from localStorage:', error);
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handlePurchase = (cost) => {
    setCoins(prevCoins => prevCoins - cost);
  };

  const sectionComponents = {
    Dashboard: <DashboardOverview />,
    Products: <Products searchQuery={searchQuery} coins={coins} onPurchase={handlePurchase} />,
    Business: <BusinessPage />, // ✅ Renders Binary Tree now
    Wallet: <Wallet />,
    Status: <Status />,
    'Rank & Rewards': <RankRewards />,
    Support: <Support />,
    Profile: <ProfileCard user={user} setUser={setUser} />,
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard - GROWTHAFFINITY</title>
        <meta name="description" content="Manage your GROWTHAFFINITY account" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
      </Head>

      <div className="d-flex">
        <Sidebar
          user={user}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          setActiveSection={setActiveSection}
          activeSection={activeSection}
        />

        <div className="flex-grow-1" style={{
          marginLeft: isSidebarOpen && window.innerWidth <= 992 ? '0' : '280px',
          transition: 'margin-left 0.3s ease-in-out',
          backgroundColor: '#FFFFFF',
          backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(58, 134, 255, 0.1) 0%, rgba(10, 36, 99, 0.1) 90%)',
          minHeight: '100vh',
          paddingTop: '60px',
        }}>
          <Topbar
            toggleSidebar={toggleSidebar}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            coins={coins}
          />
          <main className="p-4">
            {sectionComponents[activeSection] || <DashboardOverview />}
          </main>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 992px) {
          .flex-grow-1 { margin-left: 0 !important; }
        }
      `}</style>
    </>
  );
}

export async function getServerSideProps(context) {
  const initialUser = {
    name: 'sam',
    email: 'samreels22@gmail.com',
    avatar: null,
    country: 'India',
  };

  return {
    props: {
      initialUser,
    },
  };
}
