import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminProtectedRoute from '../../components/admin/AdminProtectedRoute';
import api from '../../services/api';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Date formatting error:', error);
      return '-';
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError(null);
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }
        const response = await api.get('/api/admin/users');
        setUsers(response.data);
      } catch (error) {
        setError(error.response?.data?.message || error.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [router]);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <AdminProtectedRoute>
    <AdminLayout title="Dashboard">
      <Head>
        <title>Admin Dashboard | User Management</title>
      </Head>
      
      <div 
        className="p-4 min-vh-100"
        style={{
          background: '#FFFFFF',
          backgroundImage: 'radial-gradient(circle at 90% 20%, rgba(58, 134, 255, 0.1) 0%, rgba(10, 36, 99, 0.1) 90%)'
        }}
      >
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 mb-0 fw-bold" style={{ color: '#0A2463' }}>Dashboard</h1>
            <p style={{ color: '#0A2463', opacity: 0.7 }}>Overview of the system</p>
          </div>
          {error && (
            <div 
              className="alert py-2 px-3 mb-0"
              style={{
                borderRadius: '10px',
                borderLeft: '4px solid #3A86FF',
                backgroundColor: 'rgba(255, 82, 82, 0.1)',
                color: '#FF5252'
              }}
            >
              {error}
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
            <div className="spinner-border" style={{ color: '#3A86FF' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-4">
                <div 
                  className="card"
                  style={{
                    border: 'none',
                    borderRadius: '15px',
                    background: 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)',
                    boxShadow: '0 4px 15px rgba(58, 134, 255, 0.4)',
                    color: 'white'
                  }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h5 className="card-title">Total Users</h5>
                        <h2 className="card-text fw-bold">{users.length}</h2>
                      </div>
                      <div className="display-4">
                        <i className="bi bi-people"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              className="card shadow-sm"
              style={{
                border: 'none',
                borderRadius: '15px',
                boxShadow: '0 10px 25px rgba(58, 134, 255, 0.2)',
              }}
            >
              <div 
                className="card-header d-flex justify-content-between align-items-center"
                style={{
                  background: 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)',
                  color: 'white',
                  borderTopLeftRadius: '15px',
                  borderTopRightRadius: '15px'
                }}
              >
                <h5 className="mb-0 fw-medium">User List</h5>
                <div className="d-flex">
                  <div className="input-group" style={{ width: '250px' }}>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Search users..."
                      aria-label="Search users"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      style={{ 
                        border: '2px solid #E0E0E0',
                        borderRadius: '10px 0 0 10px',
                        color: '#0A2463',
                        backgroundColor: '#F5F5F5',
                      }}
                    />
                    <button 
                      className="btn" 
                      type="button"
                      style={{ 
                        background: '#3A86FF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0 10px 10px 0',
                      }}
                    >
                      <i className="bi bi-search"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead style={{ 
                      background: 'linear-gradient(135deg, rgba(58, 134, 255, 0.8) 0%, rgba(10, 36, 99, 0.8) 100%)', 
                      color: 'white' 
                    }}>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Joined</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                          <tr 
                            key={user._id} 
                            onClick={() => router.push(`/admin/users/${user._id}`)}
                            style={{ 
                              cursor: 'pointer',
                              transition: 'background-color 0.2s',
                              color: '#0A2463'
                            }}
                            className="hover-highlight"
                          >
                            <td>{user.name || '-'}</td>
                            <td>{user.email || '-'}</td>
                            <td>{user.phone || '-'}</td>
                            <td>{formatDate(user.createdAt)}</td>
                            <td>
                              <span 
                                className="badge" 
                                style={{ 
                                  padding: '5px 10px',
                                  borderRadius: '20px',
                                  background: user.isActive ? '#3A86FF' : '#FF5252'
                                }}
                              >
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td 
                            colSpan="5" 
                            className="text-center py-4"
                            style={{ color: '#0A2463' }}
                          >
                            {searchTerm ? 'No users found matching your search' : 'No users found'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div 
                className="card-footer"
                style={{ 
                  backgroundColor: 'rgba(10, 36, 99, 0.05)',
                  borderBottomLeftRadius: '15px',
                  borderBottomRightRadius: '15px'
                }}
              >
                <nav aria-label="User list pagination">
                  <ul className="pagination justify-content-end mb-0">
                    <li className="page-item disabled">
                      <a 
                        className="page-link" 
                        href="#" 
                        tabIndex="-1"
                        style={{ color: '#0A2463' }}
                      >
                        Previous
                      </a>
                    </li>
                    <li className="page-item active">
                      <a 
                        className="page-link" 
                        href="#"
                        style={{ 
                          background: '#3A86FF',
                          borderColor: '#3A86FF'
                        }}
                      >
                        1
                      </a>
                    </li>
                    <li className="page-item">
                      <a 
                        className="page-link" 
                        href="#"
                        style={{ color: '#0A2463' }}
                      >
                        2
                      </a>
                    </li>
                    <li className="page-item">
                      <a 
                        className="page-link" 
                        href="#"
                        style={{ color: '#0A2463' }}
                      >
                        3
                      </a>
                    </li>
                    <li className="page-item">
                      <a 
                        className="page-link" 
                        href="#"
                        style={{ color: '#0A2463' }}
                      >
                        Next
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
    </AdminProtectedRoute>
  );
}

export default AdminDashboard;