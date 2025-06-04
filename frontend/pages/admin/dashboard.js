import Head from 'next/head';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminProtectedRoute from '../../components/admin/AdminProtectedRoute';
import api from '../../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    transactions: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/api/admin/dashboard');
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      
      <div className="mb-4">
        <h1 className="h3 mb-0">Dashboard</h1>
        <p className="text-muted">Overview of the system</p>
      </div>
      
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card border-primary">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title text-primary">Total Users</h5>
                  <h2 className="card-text">{stats.totalUsers}</h2>
                </div>
                <div className="display-4 text-primary">
                  <i className="bi bi-people"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-4">
          <div className="card border-success">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title text-success">Active Users</h5>
                  <h2 className="card-text">{stats.activeUsers}</h2>
                </div>
                <div className="display-4 text-success">
                  <i className="bi bi-person-check"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-4">
          <div className="card border-info">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title text-info">Transactions</h5>
                  <h2 className="card-text">{stats.transactions}</h2>
                </div>
                <div className="display-4 text-info">
                  <i className="bi bi-currency-exchange"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-4">
          <div className="card border-warning">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title text-warning">Revenue</h5>
                  <h2 className="card-text">${stats.revenue.toFixed(2)}</h2>
                </div>
                <div className="display-4 text-warning">
                  <i className="bi bi-cash-stack"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">Recent Activity</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>user@example.com</td>
                  <td>Account Upgrade</td>
                  <td>2023-06-15 14:30</td>
                  <td><span className="badge bg-success">Completed</span></td>
                </tr>
                <tr>
                  <td>another@user.com</td>
                  <td>Withdrawal Request</td>
                  <td>2023-06-15 12:45</td>
                  <td><span className="badge bg-warning">Pending</span></td>
                </tr>
                <tr>
                  <td>test@user.com</td>
                  <td>Rank Promotion</td>
                  <td>2023-06-14 18:20</td>
                  <td><span className="badge bg-success">Completed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminProtectedRoute(AdminDashboard);