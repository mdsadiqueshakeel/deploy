import { useEffect, useState } from 'react';
import { fetchProfile } from '../../utils/profileService';
import axios from 'axios';

export default function BusinessPage() {
  const [userId, setUserId] = useState(null);
  const [levelStats, setLevelStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [leftTeam, setLeftTeam] = useState(0);
  const [rightTeam, setRightTeam] = useState(0);
  const [leftBusiness, setLeftBusiness] = useState(0);
  const [rightBusiness, setRightBusiness] = useState(0);
  const [matchingBusiness, setMatchingBusiness] = useState(0);

  const [activeView, setActiveView] = useState('direct'); // 'direct' or 'total'

  useEffect(() => {
    const savedUser = localStorage.getItem('userProfileData');
    let foundId = null;

    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed._id) foundId = parsed._id;
      else if (parsed.basicInfo && parsed.basicInfo._id) foundId = parsed.basicInfo._id;
    }

    const fetchBusinessReport = async (uid) => {
      try {
        const res = await axios.get(`http://localhost:5000/api/income/business/${uid}`);
        const data = res.data;

        setLevelStats(data.levelStats || []);
        setLeftTeam(data.totalLeftUsers || 0);
        setRightTeam(data.totalRightUsers || 0);
        setLeftBusiness(data.totalLeftCarry || 0);
        setRightBusiness(data.totalRightCarry || 0);
        setMatchingBusiness(data.totalMatchingIncome || 0);
      } catch (err) {
        console.error('Error fetching business report:', err);
      } finally {
        setLoading(false);
      }
    };

    if (foundId) {
      setUserId(foundId);
      fetchBusinessReport(foundId);
    } else {
      fetchProfile()
        .then((profile) => {
          const id = profile?.basicInfo?._id;
          if (id) {
            setUserId(id);
            fetchBusinessReport(id);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch profile:', err);
          setLoading(false);
        });
    }
  }, []);

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">📊 Business Overview</h2>
      </div>

      {/* Toggle buttons */}
      <div className="d-flex justify-content-center gap-3 mb-4">
        <button
          className={`btn ${activeView === 'direct' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setActiveView('direct')}
        >
          Direct Business
        </button>
        <button
          className={`btn ${activeView === 'total' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setActiveView('total')}
        >
          Total Business
        </button>
      </div>

      {/* Conditionally rendered sections */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : activeView === 'total' ? (
        // Total Business Team Overview
        <div className="card shadow p-4">
          <h5 className="mb-3 fw-semibold">👥 Team Overview</h5>
          <div className="row text-center">
            <div className="col-md-2 col-6 mb-3">
              <div className="border p-3 rounded shadow-sm">
                <h5 className="text-primary">Left Team</h5>
                <h2 className="fw-bold text-dark">{leftTeam}</h2>
                <small>Total members</small>
              </div>
            </div>
            <div className="col-md-2 col-6 mb-3">
              <div className="border p-3 rounded shadow-sm">
                <h5 className="text-success">₹ Left Business</h5>
                <h2 className="fw-bold text-dark">₹{leftBusiness.toFixed(2)}</h2>
                <small>Total volume</small>
              </div>
            </div>
            <div className="col-md-2 col-6 mb-3">
              <div className="border p-3 rounded shadow-sm">
                <h5 className="text-primary">Right Team</h5>
                <h2 className="fw-bold text-dark">{rightTeam}</h2>
                <small>Total members</small>
              </div>
            </div>
            <div className="col-md-2 col-6 mb-3">
              <div className="border p-3 rounded shadow-sm">
                <h5 className="text-success">₹ Right Business</h5>
                <h2 className="fw-bold text-dark">₹{rightBusiness.toFixed(2)}</h2>
                <small>Total volume</small>
              </div>
            </div>
            <div className="col-md-4 col-12 mb-3">
              <div className="border p-3 rounded shadow-sm">
                <h5 className="text-info">💼 Matching Business</h5>
                <h2 className="fw-bold text-dark">₹{matchingBusiness.toFixed(2)}</h2>
                <small>Total earning</small>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Direct Business Report Table
        <div className="card shadow p-4">
          <h5 className="mb-3 fw-semibold">📑 Direct Business Report</h5>
          <div className="table-responsive">
            <table className="table table-bordered text-center">
              <thead className="table-light">
                <tr>
                  <th>Level</th>
                  <th>Team Count</th>
                  <th>Commission Earned</th>
                </tr>
              </thead>
              <tbody>
                {levelStats.length > 0 ? (
                  levelStats.map((level) => (
                    <tr key={level.level}>
                      <td>Level {level.level}</td>
                      <td>{level.teamCount}</td>
                      <td>₹{level.commissionEarned?.toFixed(2) || '0.00'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
