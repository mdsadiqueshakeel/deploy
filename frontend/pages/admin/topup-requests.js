import { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function TopupRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/wallet/admin/topup-requests');
      setRequests(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching top-up requests:', err);
      setError('Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/api/wallet/admin/topup-request/${id}/approve`);
      // Refresh the list after approval
      fetchRequests();
    } catch (err) {
      console.error('Error approving request:', err);
      alert('Failed to approve request.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Top-up Requests</h2>
      <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={styles.th}>User ID</th>
            <th style={styles.th}>Amount</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req._id}>
              <td style={styles.td}>{req.userId?.name || req.userId}</td>
              <td style={styles.td}>₹{req.amount.toFixed(2)}</td>
              <td style={styles.td}>{req.status}</td>
              <td style={styles.td}>{new Date(req.createdAt).toLocaleDateString()}</td>
              <td style={styles.td}>
                {req.status === 'pending' && (
                  <button onClick={() => handleApprove(req._id)} style={styles.button}>Approve</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  th: {
    borderBottom: '2px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
  },
  td: {
    borderBottom: '1px solid #ddd',
    padding: '12px',
  },
  button: {
    padding: '8px 12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};