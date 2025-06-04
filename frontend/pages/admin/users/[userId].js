import AdminLayout from '../../../../components/admin/AdminLayout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../../../../services/api';

export default function UserDetail() {
  const router = useRouter();
  const { userId } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionType, setTransactionType] = useState('credit');
  const [transactionNote, setTransactionNote] = useState('');

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const response = await api.get(`/api/admin/users/${userId}`);
          setUser(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user:', error);
          setLoading(false);
        }
      };
      
      fetchUser();
    }
  }, [userId]);

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/admin/users/${userId}/transactions`, {
        amount: parseFloat(transactionAmount),
        type: transactionType,
        note: transactionNote
      });
      // Refresh user data
      const response = await api.get(`/api/admin/users/${userId}`);
      setUser(response.data);
      // Reset form
      setTransactionAmount('');
      setTransactionNote('');
      alert('Transaction added successfully!');
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction. Please try again.');
    }
  };

  const updateUserRank = async (newRank) => {
    try {
      await api.put(`/api/admin/users/${userId}/rank`, { rank: newRank });
      // Refresh user data
      const response = await api.get(`/api/admin/users/${userId}`);
      setUser(response.data);
      alert('Rank updated successfully!');
    } catch (error) {
      console.error('Error updating rank:', error);
      alert('Failed to update rank. Please try again.');
    }
  };

  if (loading) {
    return (
      <AdminLayout title="User Details">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout title="User Details">
        <div className="alert alert-danger">User not found</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`User: ${user.name}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">{user.name}</h1>
          <p className="text-muted">User ID: {user._id}</p>
        </div>
        <div>
          <button 
            className="btn btn-outline-secondary me-2"
            onClick={() => router.back()}
          >
            <i className="bi bi-arrow-left me-1"></i> Back
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="text-center mb-4">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px' }}>
                  <i className="bi bi-person-circle fs-1 text-secondary"></i>
                </div>
                <h4 className="mt-3">{user.name}</h4>
                <p className="text-muted">{user.email}</p>
                <span className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="mb-3">
                <h6 className="text-uppercase text-muted">Account Information</h6>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span>Join Date:</span>
                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span>Account Balance:</span>
                    <span className="fw-bold">${user.balance?.toFixed(2) || '0.00'}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span>Current Rank:</span>
                    <span className="badge bg-info">{user.rank || 'Member'}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span>Referral Code:</span>
                    <span>{user.referralCode || 'N/A'}</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h6 className="text-uppercase text-muted">Update Rank</h6>
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => updateUserRank('Bronze')}
                  >
                    Set to Bronze
                  </button>
                  <button 
                    className="btn btn-outline-success"
                    onClick={() => updateUserRank('Silver')}
                  >
                    Set to Silver
                  </button>
                  <button 
                    className="btn btn-outline-warning"
                    onClick={() => updateUserRank('Gold')}
                  >
                    Set to Gold
                  </button>
                  <button 
                    className="btn btn-outline-danger"
                    onClick={() => updateUserRank('Platinum')}
                  >
                    Set to Platinum
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">Add Transaction</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleTransactionSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Transaction Type</label>
                    <select 
                      className="form-select"
                      value={transactionType}
                      onChange={(e) => setTransactionType(e.target.value)}
                    >
                      <option value="credit">Credit (Add Funds)</option>
                      <option value="debit">Debit (Deduct Funds)</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Amount</label>
                    <input 
                      type="number" 
                      className="form-control"
                      placeholder="Enter amount"
                      value={transactionAmount}
                      onChange={(e) => setTransactionAmount(e.target.value)}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Note</label>
                  <textarea 
                    className="form-control"
                    placeholder="Add a note for this transaction"
                    value={transactionNote}
                    onChange={(e) => setTransactionNote(e.target.value)}
                    rows="2"
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Add Transaction</button>
              </form>
            </div>
          </div>
          
          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Transaction History</h5>
              <div>
                <button className="btn btn-sm btn-outline-secondary">
                  <i className="bi bi-filter me-1"></i> Filter
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Note</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.transactions?.slice(0, 5).map((txn, index) => (
                      <tr key={index}>
                        <td>{new Date(txn.date).toLocaleString()}</td>
                        <td>
                          <span className={`badge ${txn.type === 'credit' ? 'bg-success' : 'bg-danger'}`}>
                            {txn.type}
                          </span>
                        </td>
                        <td>${txn.amount.toFixed(2)}</td>
                        <td>{txn.note || 'N/A'}</td>
                        <td>
                          <span className="badge bg-success">Completed</span>
                        </td>
                      </tr>
                    ))}
                    {(!user.transactions || user.transactions.length === 0) && (
                      <tr>
                        <td colSpan="5" className="text-center">No transactions found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}