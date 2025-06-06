import { useState, useEffect } from 'react';
import Head from 'next/head';
import Topbar from '@components/Topbar';
import Sidebar from '@components/Sidebar';
import ProfileCard from '@components/ProfileCard';
import Products from '@pages/dashboard/products'; // Correct import path
import BusinessVolumeForm from '@components/BusinessVolumeForm';
import BusinessVolumeStats from '@components/BusinessVolumeStats';
import BusinessPage from './business';
import { fetchProfile } from '@utils/profileService';

// Placeholder components for other sections
const DashboardOverview = ({ user, refresh, setRefresh }) => (
  <div className="p-4">
    <h2 className="mb-4" style={{ color: '#0A2463', fontWeight: '600' }}>
      Dashboard Overview
    </h2>
    <p style={{ color: '#0A2463' }}>
      Welcome to your dashboard! Here you can manage your business, wallet, and more.
    </p>
    {user && user._id && (
      <>
        <h4 className="mt-4 mb-2">Business Volume</h4>
        <BusinessVolumeForm userId={user._id} onSuccess={() => setRefresh(r => r + 1)} />
        <BusinessVolumeStats userId={user._id} refreshTrigger={refresh} />
      </>
    )}
  </div>
);

const Business = () => <div className="p-4"><h2 className="mb-4" style={{ color: '#0A2463', fontWeight: '600' }}>Business</h2></div>;
const Wallet = () => <div className="p-4"><h2 className="mb-4" style={{ color: '#0A2463', fontWeight: '600' }}>Wallet</h2></div>;
const Status = () => <div className="p-4"><h2 className="mb-4" style={{ color: '#0A2463', fontWeight: '600' }}>Status</h2></div>;
const RankRewards = () => <div className="p-4"><h2 className="mb-4" style={{ color: '#0A2463', fontWeight: '600' }}>Rank & Rewards</h2></div>;
const Support = () => <div className="p-4"><h2 className="mb-4" style={{ color: '#0A2463', fontWeight: '600' }}>Support</h2></div>;

export default function Dashboard({ initialUser }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(initialUser);
  const [coins, setCoins] = useState(1000); // Initialize coins to 1000
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load user data from API instead of localStorage
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const profileData = await fetchProfile();
        setUser(profileData);
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserProfile();
  }, [refresh]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Function to handle coin deduction
  const handlePurchase = (cost) => {
    setCoins(prevCoins => prevCoins - cost); // Deduct the exact cost of the product
  };

  const sectionComponents = {
    Dashboard: <DashboardOverview user={user} refresh={refresh} setRefresh={setRefresh} />,
    Products: <Products searchQuery={searchQuery} coins={coins} onPurchase={handlePurchase} />, // Pass coins and handlePurchase
    Business: <BusinessPage />,
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

  // Show loading state while fetching user data
  if (loading && !user) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  return (
    <>
      <Head>
        <title>Dashboard - Bot Alpha</title>
        <meta name="description" content="Manage your Bot Alpha account" />
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
          marginLeft: isSidebarOpen ? '280px' : '0',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
          backgroundColor: '#F5F5F5',
        }}>
          <Topbar
            toggleSidebar={toggleSidebar}
            activeSection={activeSection}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            coins={coins}
          />

          <div className="container-fluid py-4">
            {sectionComponents[activeSection]}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  // Simulate fetching user data (replace with your actual API call)
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