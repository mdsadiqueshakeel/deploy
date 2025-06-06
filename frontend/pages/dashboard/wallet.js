import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const WalletPage = () => {
  const [walletData, setWalletData] = useState({
    balance: 0,
    transactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        // This is a placeholder - replace with actual API endpoint when available
        const response = await api.get('/api/user/wallet');
        setWalletData(response.data);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  return (
    <DashboardLayout title="Wallet">
      <div className="container-fluid">
        <h2 className="fw-bold mb-4" style={{ color: '#1E293B' }}>Wallet</h2>
        
        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="card shadow-sm border-0 rounded-3">
                <div className="card-body">
                  <h5 className="card-title">Available Balance</h5>
                  <h3 className="text-primary fw-bold">${walletData.balance.toFixed(2)}</h3>
                </div>
              </div>
            </div>
            
            <div className="col-12">
              <div className="card shadow-sm border-0 rounded-3">
                <div className="card-body">
                  <h5 className="card-title mb-4">Transaction History</h5>
                  
                  {walletData.transactions.length === 0 ? (
                    <p className="text-muted">No transactions found.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {walletData.transactions.map((transaction, index) => (
                            <tr key={index}>
                              <td>{new Date(transaction.date).toLocaleDateString()}</td>
                              <td>{transaction.description}</td>
                              <td className={transaction.amount > 0 ? 'text-success' : 'text-danger'}>
                                {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                              </td>
                              <td>
                                <span className={`badge ${transaction.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                                  {transaction.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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

export default WalletPage;