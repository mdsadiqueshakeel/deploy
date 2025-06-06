import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { fetchProfile } from "../utils/profileService";
import api from "../utils/api";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define navigation items
  const navItems = [
    {
      title: "Dashboard",
      icon: "bi-speedometer2",
      path: "/dashboard",
      roles: ["user", "admin"],
    },
    {
      title: "My Network",
      icon: "bi-diagram-3",
      path: "/network",
      roles: ["user"],
    },
    {
      title: "Income",
      icon: "bi-cash-stack",
      path: "/income",
      roles: ["user"],
    },
    {
      title: "Wallet",
      icon: "bi-wallet2",
      path: "/wallet",
      roles: ["user"],
    },
    {
      title: "Packages",
      icon: "bi-box",
      path: "/packages",
      roles: ["user"],
    },
    {
      title: "Support",
      icon: "bi-headset",
      path: "/support",
      roles: ["user", "admin"],
    },
    {
      title: "Admin Dashboard",
      icon: "bi-shield-lock",
      path: "/admin/dashboard",
      roles: ["admin"],
    },
    {
      title: "User Management",
      icon: "bi-people",
      path: "/admin/users",
      roles: ["admin"],
    },
    {
      title: "Package Management",
      icon: "bi-box-seam",
      path: "/admin/packages",
      roles: ["admin"],
    },
    {
      title: "Withdrawal Requests",
      icon: "bi-cash-coin",
      path: "/admin/withdrawals",
      roles: ["admin"],
    },
    {
      title: "Support Tickets",
      icon: "bi-ticket-detailed",
      path: "/admin/support",
      roles: ["admin"],
    },
  ];

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchProfile();
        setUserProfile(profile);
        console.log("Profile loaded successfully:", profile);
      } catch (error) {
        console.error("Error loading profile:", error.response?.data || error.message);
        // Don't set userProfile to null if it failed to load - keep any existing data
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    // Set active item based on current path
    const path = router.pathname;
    const matchedItem = navItems.find((item) => path.startsWith(item.path));
    if (matchedItem) {
      setActiveItem(matchedItem.path);
    }
  }, [router.pathname, navItems]);

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter((item) => {
    // If profile is loading, show nothing yet
    if (loading) return false;
    
    // If no profile but path is dashboard, show dashboard items for all users
    if (!userProfile && item.path === "/dashboard") return true;
    
    // If no profile, show only items that don't require specific roles
    if (!userProfile) return item.roles.includes("guest");
    
    // Normal filtering based on user role
    return item.roles.includes(userProfile.role);
  });

  // Handle navigation item click
  const handleNavClick = (path) => {
    setActiveItem(path);
    if (window.innerWidth < 992) {
      toggleSidebar();
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await api.post('/api/auth/logout');
      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div
      className={`sidebar ${isOpen ? "open" : ""}`}
      style={{
        width: isOpen ? "280px" : "0",
        position: "fixed",
        height: "100vh",
        backgroundColor: "#0A2463",
        color: "white",
        transition: "all 0.3s ease",
        zIndex: 1000,
        overflowX: "hidden",
        boxShadow: isOpen ? "0 0 20px rgba(0, 0, 0, 0.3)" : "none",
      }}
    >
      <div className="sidebar-header p-4 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <div
            className="logo-container me-2"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              backgroundColor: "#3A86FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            M
          </div>
          <h5 className="mb-0 fw-bold" style={{ color: "#ffffff" }}>
            MLM System
          </h5>
        </div>
        <button
          className="btn-close btn-close-white d-lg-none"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        ></button>
      </div>

      <div className="user-profile p-4 border-top border-bottom border-secondary">
        {loading ? (
          <div className="text-center">
            <div className="spinner-border spinner-border-sm text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 mb-0 small">Loading profile...</p>
          </div>
        ) : userProfile ? (
          <div className="d-flex align-items-center">
            <div
              className="avatar me-3"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: "#3A86FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: "bold",
                overflow: "hidden",
              }}
            >
              {userProfile.avatar ? (
                <Image
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  width={50}
                  height={50}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              ) : (
                userProfile.name?.charAt(0) || "U"
              )}
            </div>
            <div>
              <h6 className="mb-0 fw-bold">{userProfile.name}</h6>
              <small className="text-light opacity-75">{userProfile.role}</small>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div 
              className="avatar mx-auto mb-3"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: "#6c757d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              <i className="bi bi-person"></i>
            </div>
            <p className="mb-1">Welcome, Guest</p>
            <small className="d-block text-light opacity-75">
              <Link href="/login" passHref>
                <span style={{ cursor: "pointer", textDecoration: "underline" }}>
                  Login to continue
                </span>
              </Link>
            </small>
          </div>
        )}
      </div>

      <div className="sidebar-menu p-3">
        <ul className="nav flex-column">
          {filteredNavItems.map((item) => (
            <li className="nav-item mb-2" key={item.path}>
              <Link href={item.path} passHref>
                <div
                  className={`nav-link d-flex align-items-center ${
                    activeItem === item.path ? "active" : ""
                  }`}
                  onClick={() => handleNavClick(item.path)}
                  style={{
                    color: activeItem === item.path ? "#ffffff" : "#B0C4DE",
                    backgroundColor:
                      activeItem === item.path ? "#3A86FF" : "transparent",
                    borderRadius: "8px",
                    padding: "10px 15px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <i
                    className={`bi ${item.icon} me-3`}
                    style={{ fontSize: "1.1rem" }}
                  ></i>
                  <span>{item.title}</span>
                </div>
              </Link>
            </li>
          ))}

          <li className="nav-item mt-4">
            <div
              className="nav-link d-flex align-items-center"
              onClick={handleLogout}
              style={{
                color: "#B0C4DE",
                borderRadius: "8px",
                padding: "10px 15px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <i
                className="bi bi-box-arrow-right me-3"
                style={{ fontSize: "1.1rem" }}
              ></i>
              <span>Logout</span>
            </div>
          </li>
        </ul>
      </div>

      <style jsx>{`
        .sidebar .nav-link:hover {
          background-color: rgba(58, 134, 255, 0.2);
          color: white;
        }
        .sidebar .nav-link.active {
          font-weight: 600;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        @media (max-width: 991.98px) {
          .sidebar {
            width: 0;
            padding: 0;
          }
          .sidebar.open {
            width: 280px;
          }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;