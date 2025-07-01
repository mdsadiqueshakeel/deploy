
// import { useState, useEffect } from 'react';
// import Head from 'next/head';
// import Topbar from '@components/Topbar';
// import Sidebar from '@components/Sidebar';
// import ProfileCard from '@components/ProfileCard';
// import Products from '@pages/dashboard/products';
// import BusinessPage from './business';
// import WalletPage from './wallet';
// import DashboardPage from '../../components/DashboardPage'; 
// import StatusPage from './status';

// const RankRewards = () => (
//   <div className="p-4">
//     <h2 className="mb-4" style={{ color: '#0A2463', fontWeight: '600' }}>Rank & Rewards</h2>
//   </div>
// );

// const Support = () => (
//   <div className="p-4">
//     <h2 className="mb-4" style={{ color: '#0A2463', fontWeight: '600' }}>Support</h2>
//   </div>
// );

// export default function Dashboard({ initialUser }) {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [activeSection, setActiveSection] = useState('Dashboard');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [user, setUser] = useState(initialUser);
//   const [coins, setCoins] = useState(1000);

//   useEffect(() => {
//     try {
//       const savedUser = localStorage.getItem('userProfileData');
//       if (savedUser) {
//         setUser(JSON.parse(savedUser));
//       }
//     } catch (error) {
//       console.error('Error loading user data from localStorage:', error);
//     }
//   }, []);

//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

//   const handlePurchase = (cost) => {
//     setCoins(prevCoins => prevCoins - cost);
//   };

//   const sectionComponents = {
//     Dashboard: <DashboardPage />,
//     Products: <Products searchQuery={searchQuery} coins={coins} onPurchase={handlePurchase} />,
//     Business: <BusinessPage />,
//     Wallet: <WalletPage />,
//     Status: <StatusPage />,
//     'Rank & Rewards': <RankRewards />,
//     Support: <Support />,
//     Profile: <ProfileCard user={user} setUser={setUser} />,
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth > 992) setIsSidebarOpen(false);
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return (
//     <>
//       <Head>
//         <title>Dashboard - GROWTHAFFINITY</title>
//         <meta name="description" content="Manage your GROWTHAFFINITY account" />
//         <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
//         <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
//       </Head>

//       <div className="d-flex">
//         <Sidebar
//           user={user}
//           isSidebarOpen={isSidebarOpen}
//           toggleSidebar={toggleSidebar}
//           setActiveSection={setActiveSection}
//           activeSection={activeSection}
//         />

//         <div
//           className="flex-grow-1"
//           style={{
//             marginLeft: isSidebarOpen && window.innerWidth <= 992 ? '0' : '280px',
//             transition: 'margin-left 0.3s ease-in-out',
//             backgroundColor: '#FFFFFF',
//             backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(58, 134, 255, 0.1) 0%, rgba(10, 36, 99, 0.1) 90%)',
//             minHeight: '100vh',
//             paddingTop: '60px',
//           }}
//         >
//           <Topbar
//             toggleSidebar={toggleSidebar}
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//             coins={coins}
//           />
//           <main className="p-4">
//             {sectionComponents[activeSection] || <DashboardPage />}
//           </main>
//         </div>
//       </div>

//       <style jsx>{`
//         @media (max-width: 992px) {
//           .flex-grow-1 {
//             margin-left: 0 !important;
//           }
//         }
//       `}</style>
//     </>
//   );
// }

// export async function getServerSideProps(context) {
//   const initialUser = {
//     name: 'ERROR',
//     email: 'error@gmail.com',
//     avatar: null,
//     country: 'India',
//   };

//   return {
//     props: {
//       initialUser,
//     },
//   };
// }
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Topbar from '@components/Topbar';
import Sidebar from '@components/Sidebar';
import ProfileCard from '@components/ProfileCard';
import Products from '@pages/dashboard/products';
import BusinessPage from './business';
import WalletPage from './wallet';
import DashboardPage from '../../components/DashboardPage'; 
import StatusPage from './status';

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
  const [coins, setCoins] = useState(1000);

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
    Dashboard: <DashboardPage />,
    Products: <Products searchQuery={searchQuery} coins={coins} onPurchase={handlePurchase} />,
    Business: <BusinessPage />,
    Wallet: <WalletPage />,
    Status: <StatusPage />,
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
        {/* Removed Bootstrap CSS and icons links from here */}
      </Head>

      <div className="d-flex">
        <Sidebar
          user={user}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          setActiveSection={setActiveSection}
          activeSection={activeSection}
        />

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
            coins={coins}
          />
          <main className="p-4">
            {sectionComponents[activeSection] || <DashboardPage />}
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

export async function getServerSideProps(context) {
  const initialUser = {
    name: 'ERROR',
    email: 'error@gmail.com',
    avatar: null,
    country: 'India',
  };

  return {
    props: {
      initialUser,
    },
  };
}