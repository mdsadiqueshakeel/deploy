import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const RankRewardsPage = () => {
  const [rankData, setRankData] = useState({
    currentRank: 'Bronze',
    rewards: [
      { rank: 'Bronze', description: 'Access to basic training materials', achieved: true },
      { rank: 'Silver', description: '5% bonus on team volume', achieved: false },
      { rank: 'Gold', description: '10% bonus on team volume + exclusive webinars', achieved: false },
      { rank: 'Platinum', description: '15% bonus + quarterly business retreat', achieved: false },
      { rank: 'Diamond', description: '20% bonus + luxury car program', achieved: false },
    ],
    upcomingRewards: [
      { rank: 'Silver', requirement: 'Achieve 500 PV and 3,000 TV', bonus: '5% team bonus' }
    ]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankData = async () => {
      try {
        setLoading(true);
        // This is a placeholder - replace with actual API endpoint when available
        const response = await api.get('/api/user/rank-rewards');
        setRankData(response.data);
      } catch (error) {
        console.error('Error fetching rank data:', error);
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
    // fetchRankData();
  }, []);

  return (
    <DashboardLayout title="Rank & Rewards">
      <div className="container-fluid">
        <h2 className="fw-bold mb-4" style={{ color: '#1E293B' }}>Rank & Rewards</h2>
        
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
                  <h5 className="card-title mb-4">Current Rank: {rankData.currentRank}</h5>
                  
                  <div className="timeline">
                    {rankData.rewards.map((reward, index) => (
                      <div key={index} className="timeline-item mb-4">
                        <div className="d-flex">
                          <div 
                            className="timeline-marker me-3" 
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: reward.achieved ? '#28a745' : '#e9ecef',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '12px'
                            }}
                          >
                            {reward.achieved && <i className="bi bi-check"></i>}
                          </div>
                          <div>
                            <h6 className="mb-1">{reward.rank}</h6>
                            <p className="mb-0 text-muted">{reward.description}</p>
                          </div>
                        </div>
                        {index < rankData.rewards.length - 1 && (
                          <div 
                            className="timeline-connector" 
                            style={{
                              width: '2px',
                              height: '30px',
                              backgroundColor: '#e9ecef',
                              marginLeft: '12px',
                              marginTop: '5px',
                              marginBottom: '5px'
                            }}
                          ></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6 mb-4">
              <div className="card shadow-sm border-0 rounded-3">
                <div className="card-body">
                  <h5 className="card-title mb-4">Next Rank Benefits</h5>
                  
                  {rankData.upcomingRewards.map((reward, index) => (
                    <div key={index} className="upcoming-reward p-3 mb-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                      <h6 className="mb-2">{reward.rank} Rank</h6>
                      <p className="mb-2"><strong>Requirement:</strong> {reward.requirement}</p>
                      <p className="mb-0"><strong>Bonus:</strong> {reward.bonus}</p>
                    </div>
                  ))}
                  
                  <div className="mt-4">
                    <h6>How to Advance?</h6>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Increase your personal sales volume
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Recruit and train new team members
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Help your team members advance in rank
                      </li>
                      <li>
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Maintain consistent monthly activity
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RankRewardsPage;