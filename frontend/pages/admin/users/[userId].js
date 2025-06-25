import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import api from '../../../services/api';

export default function UserDetails() {
  const router = useRouter();
  const { userId } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Color theme variables from AdminLayout
  const primaryColor = '#3A86FF';
  const primaryDarkColor = '#0A2463';
  const secondaryColor = '#FF5252'; // Used for danger/inactive
  const successColor = '#28a745'; // For active status and positive indicators
  const textColor = '#0A2463';
  const lightBackground = 'rgba(58, 134, 255, 0.1)';
  const cardGradient = 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)';
  const sidebarGradient = 'linear-gradient(160deg, #0A2463 0%, #3A86FF 100%)';
  const hoverGradient = 'linear-gradient(135deg, rgba(58, 134, 255, 0.3) 0%, rgba(10, 36, 99, 0.3) 100%)';

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      try {
        const response = await api.get(`/api/admin/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return (
      <AdminLayout title="User Details">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <div className="spinner-border" style={{ color: primaryColor }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout title="User Details">
        <div
          className="alert py-2 px-3 mb-0"
          style={{
            borderRadius: '10px',
            borderLeft: `4px solid ${secondaryColor}`,
            backgroundColor: 'rgba(255, 82, 82, 0.1)',
            color: secondaryColor,
            fontWeight: 'bold'
          }}
        >
          User not found.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`User: ${user.name}`}>
      {/* Back Button */}
      <div className="mb-4">
        <button
          className="btn btn-sm"
          onClick={() => router.back()}
          style={{
            backgroundColor: 'white',
            color: primaryDarkColor,
            border: `1px solid ${primaryColor}`,
            borderRadius: '8px',
            padding: '8px 15px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = primaryColor}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
        >
          <i className="bi bi-arrow-left me-2" style={{ color: primaryDarkColor }} />
          <span style={{ color: primaryDarkColor }}>Back to Users</span>
        </button>
      </div>

      <div className="row">
        {/* User Profile Card */}
        <div className="col-md-4 mb-4">
          <div
            className="card shadow-sm"
            style={{
              border: 'none',
              borderRadius: '15px',
              overflow: 'hidden',
              background: 'white',
              boxShadow: '0 10px 25px rgba(58, 134, 255, 0.1)'
            }}
          >
            <div
              className="card-header text-white text-center py-4"
              style={{
                background: cardGradient,
                borderTopLeftRadius: '15px',
                borderTopRightRadius: '15px'
              }}
            >
              <div
                className="bg-white rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                style={{ width: '100px', height: '100px', boxShadow: '0 0 15px rgba(0,0,0,0.2)' }}
              >
                <i className="bi bi-person-circle fs-1" style={{ color: primaryDarkColor }}></i>
              </div>
              <h4 className="mt-3 mb-1 fw-bold">{user.name}</h4>
              <p className="mb-1" style={{ opacity: 0.9 }}>{user.email}</p>
              <span
                className="badge fw-medium"
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  backgroundColor: user.isActive ? successColor : secondaryColor,
                  color: 'white',
                  marginTop: '5px'
                }}
              >
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="card-body p-4">
              <h6 className="text-uppercase mb-3 fw-bold" style={{ color: primaryDarkColor, opacity: 0.8 }}>
                Account Information
              </h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2 d-flex justify-content-between align-items-center">
                  <span className="fw-medium" style={{ color: textColor }}>User ID:</span>
                  <span style={{ color: textColor, opacity: 0.8 }}>{user._id}</span>
                </li>
                <li className="mb-2 d-flex justify-content-between align-items-center">
                  <span className="fw-medium" style={{ color: textColor }}>Phone:</span>
                  <span style={{ color: textColor, opacity: 0.8 }}>{user.phone || 'N/A'}</span>
                </li>
                <li className="mb-2 d-flex justify-content-between align-items-center">
                  <span className="fw-medium" style={{ color: textColor }}>Joined:</span>
                  <span style={{ color: textColor, opacity: 0.8 }}>{new Date(user.createdAt).toLocaleDateString()}</span>
                </li>
                <li className="mb-2 d-flex justify-content-between align-items-center">
                  <span className="fw-medium" style={{ color: textColor }}>Rank:</span>
                  <span className="badge" style={{ backgroundColor: primaryColor, color: 'white', borderRadius: '15px', padding: '4px 10px' }}>
                    {user.rank || 'Member'}
                  </span>
                </li>
                <li className="mb-2 d-flex justify-content-between align-items-center">
                  <span className="fw-medium" style={{ color: textColor }}>Balance:</span>
                  <span className="fw-bold" style={{ color: primaryColor }}>${user.balance?.toFixed(2) || '0.00'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* User Details Tabs */}
        <div className="col-md-8">
          <div
            className="card shadow-sm"
            style={{
              border: 'none',
              borderRadius: '15px',
              boxShadow: '0 10px 25px rgba(58, 134, 255, 0.1)'
            }}
          >
            <div
              className="card-header"
              style={{
                backgroundColor: 'white',
                borderBottom: `1px solid ${lightBackground}`,
                borderTopLeftRadius: '15px',
                borderTopRightRadius: '15px'
              }}
            >
              <ul className="nav nav-tabs card-header-tabs" style={{ borderBottom: 'none' }}>
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    href="#"
                    style={{
                      color: primaryDarkColor,
                      borderColor: `transparent transparent ${primaryColor} transparent`,
                      borderWidth: '2px',
                      fontWeight: 'bold',
                      backgroundColor: 'transparent'
                    }}
                  >
                    Referral Info
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#"
                    style={{
                      color: textColor,
                      opacity: 0.7,
                      borderColor: 'transparent',
                      fontWeight: 'normal'
                    }}
                  >
                    Transactions
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#"
                    style={{
                      color: textColor,
                      opacity: 0.7,
                      borderColor: 'transparent',
                      fontWeight: 'normal'
                    }}
                  >
                    Settings
                  </a>
                </li>
              </ul>
            </div>
            <div className="card-body p-4">
              {/* Referral Information */}
              <div>
                <h5 className="mb-4 fw-bold" style={{ color: primaryDarkColor }}>Referral Information</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div
                      className="border rounded p-3"
                      style={{
                        borderColor: lightBackground,
                        backgroundColor: 'white',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                        borderRadius: '10px'
                      }}
                    >
                      <h6 className="text-uppercase mb-2 small" style={{ color: textColor, opacity: 0.7 }}>
                        Referred By
                      </h6>
                      <p className="mb-0 fw-medium" style={{ color: primaryColor }}>
                        {user.parentId?.name || 'Root User'}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div
                      className="border rounded p-3"
                      style={{
                        borderColor: lightBackground,
                        backgroundColor: 'white',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                        borderRadius: '10px'
                      }}
                    >
                      <h6 className="text-uppercase mb-2 small" style={{ color: textColor, opacity: 0.7 }}>
                        Referral Codes
                      </h6>
                      <p className="mb-1" style={{ color: textColor }}>
                        <span className="fw-medium">Left:</span> {user.referralCodeLeft || 'N/A'}
                      </p>
                      <p className="mb-0" style={{ color: textColor }}>
                        <span className="fw-medium">Right:</span> {user.referralCodeRight || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Details Section */}
              <div className="mt-4">
                <h6 className="text-uppercase mb-3 fw-bold" style={{ color: primaryDarkColor, opacity: 0.8 }}>
                  Bank Information
                </h6>
                <ul className="list-unstyled mb-0">
                  {/* <li className="mb-2 d-flex justify-content-between align-items-center">
                    <span className="fw-medium" style={{ color: textColor }}>Account Holder:</span>
                    <span style={{ color: textColor, opacity: 0.8 }}>
                      {user.bankDetails?.accountHolderName || 'N/A'}
                    </span>
                  </li> */}
    
    <li className="mb-2 d-flex justify-content-between align-items-center">
  <span className="fw-medium" style={{ color: textColor }}>Account Number:</span>
  <span style={{ color: textColor, opacity: 0.8 }}>
    {user.bankDetails?.accountNumber || 'N/A'}
  </span>
</li>


                  <li className="mb-2 d-flex justify-content-between align-items-center">
                    <span className="fw-medium" style={{ color: textColor }}>Bank Name:</span>
                    <span style={{ color: textColor, opacity: 0.8 }}>
                      {user.bankDetails?.bankName || 'N/A'}
                    </span>
                  </li>
                  <li className="mb-2 d-flex justify-content-between align-items-center">
                    <span className="fw-medium" style={{ color: textColor }}>Account Number:</span>
                    <span style={{ color: textColor, opacity: 0.8 }}>
                      {user.bankDetails?.accountNumber 
                        ? `****${user.bankDetails.accountNumber.toString().slice(-4)}` 
                        : 'N/A'}
                    </span>
                  </li>
                  <li className="d-flex justify-content-between align-items-center">
                    <span className="fw-medium" style={{ color: textColor }}>IFSC Code:</span>
                    <span style={{ color: textColor, opacity: 0.8 }}>
                      {user.bankDetails?.ifscCode || 'N/A'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}