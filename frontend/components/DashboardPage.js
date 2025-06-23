import { useState, useEffect } from 'react';
import api from '../utils/api';
import { fetchProfile } from '../utils/profileService';
import Image from 'next/image';

const DashboardPage = () => {
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState({
    incomeWallet: 0
  });
  const [incomeStats, setIncomeStats] = useState({
    totalIncome: 0,
    monthlyIncome: 0,
    monthlyLabel: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await fetchProfile();
        setProfile(profileData);

        let userId = profileData.basicInfo?._id;
        if (!userId) throw new Error('User ID not found');

        const incomeRes = await api.get(`/api/income/business/${userId}`);
        const incomeData = incomeRes.data;

        const now = new Date();
        const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const currentMonthEntry = (incomeData.monthlyStats || []).find(
          stat => stat.month === currentMonthKey
        );

        // Generate last month label
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const monthlyLabel = lastMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

        setIncomeStats({
          totalIncome: incomeData.totalIncome || 0,
          monthlyIncome: currentMonthEntry?.income || 0,
          monthlyLabel
        });

        const walletRes = await api.get(`/api/wallet/user/${userId}/wallet`);
        setWallet(walletRes.data);

      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-4" role="alert">
        {error}
      </div>
    );
  }

  if (!profile) {
    return <div>No profile data available</div>;
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 fw-bold" style={{ color: '#0A2463' }}>Dashboard Overview</h2>

      <div className="card mb-4 shadow-sm" style={{ borderRadius: '12px', backgroundColor: 'white' }}>
        <div className="card-body">
          <div className="row align-items-center">

            {/* Avatar and Basic Info */}
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  {profile.basicInfo?.avatar ? (
                    <Image 
                      src={profile.basicInfo.avatar} 
                      alt="User Avatar"
                      width={80}
                      height={80}
                      className="rounded-circle"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#3A86FF',
                        color: 'white',
                        fontSize: '30px',
                      }}
                    >
                      {profile.basicInfo?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="fw-bold mb-1" style={{ color: '#0A2463' }}>
                    {profile.basicInfo?.name || 'User Name'}
                  </h4>
                  <p className="mb-1" style={{ color: '#0A2463' }}>
                    <strong>Email:</strong> {profile.basicInfo?.email || 'N/A'}
                  </p>
                  <p className="mb-0" style={{ color: '#0A2463' }}>
                    <strong>Status:</strong> Active
                  </p>
                </div>
              </div>
            </div>

            {/* Referral Codes */}
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="border-start ps-4" style={{ borderColor: '#E0E0E0' }}>
                <h5 className="fw-bold" style={{ color: '#0A2463' }}>Referral Codes</h5>
                <div className="d-flex flex-column">
                  <div className="mb-2">
                    <span className="fw-medium" style={{ color: '#0A2463' }}>Left: </span>
                    <span style={{ color: '#3A86FF' }}>{profile.referralInfo?.referralCodeLeft || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="fw-medium" style={{ color: '#0A2463' }}>Right: </span>
                    <span style={{ color: '#3A86FF' }}>{profile.referralInfo?.referralCodeRight || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Summary */}
            <div className="col-md-4">
              <div className="border-start ps-4" style={{ borderColor: '#E0E0E0' }}>
                <h5 className="fw-bold" style={{ color: '#0A2463' }}>Wallet Summary</h5>
                <div className="d-flex flex-column">
                  <div className="mb-2">
                    <span className="fw-medium" style={{ color: '#0A2463' }}>Income Wallet: </span>
                    <span className="fw-bold" style={{ color: '#00b894' }}>₹ {wallet.incomeWallet?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm" style={{ borderRadius: '12px', backgroundColor: 'white' }}>
            <div className="card-body text-center">
              <h5 className="fw-bold" style={{ color: '#0A2463' }}>Total Earning</h5>
              <div className="display-5 fw-bold mt-3" style={{ color: '#3A86FF' }}>
                ₹ {incomeStats.totalIncome.toFixed(2)}
              </div>
              <p className="text-muted mt-2">Lifetime earnings</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm" style={{ borderRadius: '12px', backgroundColor: 'white' }}>
            <div className="card-body text-center">
              <h5 className="fw-bold" style={{ color: '#0A2463' }}>Last Month Earning</h5>
              <div className="display-5 fw-bold mt-3" style={{ color: '#00b894' }}>
                ₹ {incomeStats.monthlyIncome.toFixed(2)}
              </div>
              <p className="text-muted mt-2">{incomeStats.monthlyLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
