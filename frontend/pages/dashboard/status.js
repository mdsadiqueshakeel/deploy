import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const StatusPage = () => {
  const [statusData, setStatusData] = useState({
    currentRank: 'Bronze',
    nextRank: 'Silver',
    progressPercent: 45,
    requirements: {
      personalVolume: { current: 250, required: 500 },
      teamVolume: { current: 1200, required: 3000 },
      directReferrals: { current: 3, required: 5 }
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        setLoading(true);
        // This is a placeholder - replace with actual API endpoint when available
        const response = await api.get('/api/user/status');
        setStatusData(response.data);
      } catch (error) {
        console.error('Error fetching status data:', error);
        // Using default data if API fails
      } finally {
        setLoading(false);
      }
    };

    // Simulate API call with timeout
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    // Uncomment when API is ready
    // fetchStatusData();
  }, []);

  const renderProgressBar = (current, required, label) => {
    const percent = Math.min(Math.round((current / required) * 100), 100);
    return (
      <div className="mb-3">
        <div className="d-flex justify-content-between mb-1">
          <span>{label}</span>
          <span>{current} / {required}</span>
        </div>
        <div className="progress" style={{ height: '10px' }}>
          <div 
            className="progress-bar" 
            role="progressbar" 
            style={{ 
              width: `${percent}%`,
              backgroundColor: percent >= 100 ? '#28a745' : '#3A86FF'
            }}
            aria-valuenow={percent} 
            aria-valuemin="0" 
            aria-valuemax="100"
          ></div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout title="Status">
      <div className="container-fluid">
        <h2 className="fw-bold mb-4" style={{ color: '#1E293B' }}>Your Status</h2>
        
        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-6 mb-4">
              <div className="card shadow-sm border-0 rounded-3">
                <div className="card-body">
                  <h5 className="card-title">Current Rank</h5>
                  <div className="d-flex align-items-center mt-3">
                    <div 
                      className="rank-badge me-3 d-flex align-items-center justify-content-center" 
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: '#3A86FF',
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold'
                      }}
                    >
                      {statusData.currentRank.charAt(0)}
                    </div>
                    <div>
                      <h3 className="mb-0">{statusData.currentRank}</h3>
                      <p className="text-muted mb-0">Next: {statusData.nextRank}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6 mb-4">
              <div className="card shadow-sm border-0 rounded-3">
                <div className="card-body">
                  <h5 className="card-title">Rank Progress</h5>
                  <div className="mt-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Progress to {statusData.nextRank}</span>
                      <span>{statusData.progressPercent}%</span>
                    </div>
                    <div className="progress mb-4" style={{ height: '20px' }}>
                      <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{ width: `${statusData.progressPercent}%` }}
                        aria-valuenow={statusData.progressPercent} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-12">
              <div className="card shadow-sm border-0 rounded-3">
                <div className="card-body">
                  <h5 className="card-title mb-4">Rank Requirements</h5>
                  
                  {renderProgressBar(
                    statusData.requirements.personalVolume.current,
                    statusData.requirements.personalVolume.required,
                    'Personal Volume'
                  )}
                  
                  {renderProgressBar(
                    statusData.requirements.teamVolume.current,
                    statusData.requirements.teamVolume.required,
                    'Team Volume'
                  )}
                  
                  {renderProgressBar(
                    statusData.requirements.directReferrals.current,
                    statusData.requirements.directReferrals.required,
                    'Direct Referrals'
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StatusPage;