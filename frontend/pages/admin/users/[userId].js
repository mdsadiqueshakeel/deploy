import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import api from '../../../services/api';

export default function UserDetails() {
  const router = useRouter();
  const { userId } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('referral'); // 'referral', 'transactions', 'topup-requests', 'settings'
  const [topupRequests, setTopupRequests] = useState([]);
  const [topupRequestsLoading, setTopupRequestsLoading] = useState(false);

  useEffect(() => {
    const fetchTopupRequests = async () => {
      if (activeTab !== 'topup-requests' || !userId) return;
      setTopupRequestsLoading(true);
      try {
        const response = await api.get(`/api/wallet/user/${userId}/topup-requests`);
        setTopupRequests(response.data);
      } catch (error) {
        console.error('Error fetching top-up requests for user:', error);
      }
      finally {
        setTopupRequestsLoading(false);
      }
    };
    fetchTopupRequests();
  }, [userId, activeTab]);

  const handleApproveTopup = async (requestId) => {
    try {
      await api.put(`/api/wallet/admin/topup-request/${requestId}/approve`);
      // Refresh the list after approval
      const response = await api.get(`/api/wallet/user/${userId}/topup-requests`);
      setTopupRequests(response.data);
    } catch (err) {
      console.error('Error approving top-up request:', err);
      alert('Failed to approve top-up request.');
    }
  };

  const handleRejectTopup = async (requestId) => {
    try {
      // Assuming a reject endpoint exists or can be added
      // For now, we'll just remove it from the list or mark as rejected locally
      // You would typically have a backend endpoint for rejection as well
      alert('Reject functionality not yet implemented on backend.');
      // Example: await api.put(`/api/wallet/admin/topup-request/${requestId}/reject`);
      // Refresh the list after rejection
      const response = await api.get(`/api/wallet/user/${userId}/topup-requests`);
      setTopupRequests(response.data);
    } catch (err) {
      console.error('Error rejecting top-up request:', err);
      alert('Failed to reject top-up request.');
    }
  };

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
                    className={`nav-link ${activeTab === 'referral' ? 'active' : ''}`}
                    href="#"
                    onClick={() => setActiveTab('referral')}
                    style={{
                      color: activeTab === 'referral' ? primaryDarkColor : textColor,
                      borderColor: activeTab === 'referral' ? `transparent transparent ${primaryColor} transparent` : 'transparent',
                      borderWidth: '2px',
                      fontWeight: activeTab === 'referral' ? 'bold' : 'normal',
                      backgroundColor: 'transparent'
                    }}
                  >
                    Referral Info
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`}
                    href="#"
                    onClick={() => setActiveTab('transactions')}
                    style={{
                      color: activeTab === 'transactions' ? primaryDarkColor : textColor,
                      borderColor: activeTab === 'transactions' ? `transparent transparent ${primaryColor} transparent` : 'transparent',
                      borderWidth: '2px',
                      fontWeight: activeTab === 'transactions' ? 'bold' : 'normal',
                      backgroundColor: 'transparent'
                    }}
                  >
                    Transactions
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 'topup-requests' ? 'active' : ''}`}
                    href="#"
                    onClick={() => setActiveTab('topup-requests')}
                    style={{
                      color: activeTab === 'topup-requests' ? primaryDarkColor : textColor,
                      borderColor: activeTab === 'topup-requests' ? `transparent transparent ${primaryColor} transparent` : 'transparent',
                      borderWidth: '2px',
                      fontWeight: activeTab === 'topup-requests' ? 'bold' : 'normal',
                      backgroundColor: 'transparent'
                    }}
                  >
                    Top-up Requests
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                    href="#"
                    onClick={() => setActiveTab('settings')}
                    style={{
                      color: activeTab === 'settings' ? primaryDarkColor : textColor,
                      borderColor: activeTab === 'settings' ? `transparent transparent ${primaryColor} transparent` : 'transparent',
                      borderWidth: '2px',
                      fontWeight: activeTab === 'settings' ? 'bold' : 'normal',
                      backgroundColor: 'transparent'
                    }}
                  >
                    Settings
                  </a>
                </li>
              </ul>
            </div>
            <div className="card-body p-4">
              {activeTab === 'referral' && (
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
              )}

              {activeTab === 'transactions' && (
                <div>
                  <h5 className="mb-4 fw-bold" style={{ color: primaryDarkColor }}>Transactions</h5>
                  {/* Add transactions table here */}
                  <p>Transaction history will be displayed here.</p>
                </div>
              )}

              {activeTab === 'topup-requests' && (
                <div>
                  <h5 className="mb-4 fw-bold" style={{ color: primaryDarkColor }}>Top-up Requests</h5>
                  {topupRequestsLoading ? (
                    <p>Loading top-up requests...</p>
                  ) : topupRequests.length > 0 ? (
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topupRequests.map((request) => (
                          <tr key={request._id}>
                            <td>₹{request.amount.toFixed(2)}</td>
                            <td>{request.status}</td>
                            <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                            <td>
                              {request.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApproveTopup(request._id)}
                                    className="btn btn-success btn-sm me-2"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleRejectTopup(request._id)}
                                    className="btn btn-danger btn-sm"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No top-up requests found for this user.</p>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h5 className="mb-4 fw-bold" style={{ color: primaryDarkColor }}>Settings</h5>
                  {/* Add settings form/details here */}
                  <p>User settings will be displayed here.</p>
                </div>
              )}

              {/* Bank Details Section */}
              <div className="mt-4">
                <h6 className="text-uppercase mb-3 fw-bold" style={{ color: primaryDarkColor, opacity: 0.8 }}>
                  Bank Information
                </h6>
                <ul className="list-unstyled mb-0">
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