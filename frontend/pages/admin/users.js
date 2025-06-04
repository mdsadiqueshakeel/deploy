import AdminLayout from '../../components/admin/AdminLayout';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useRouter } from 'next/router';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/admin/users');
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewUserDetails = (userId) => {
    router.push(`/admin/users/${userId}`);
  };

  return (
    <AdminLayout title="User Management">
      <div 
        className="p-4 min-vh-100"
        style={{
          background: '#FFFFFF',
          backgroundImage: 'radial-gradient(circle at 90% 20%, rgba(58, 134, 255, 0.1) 0%, rgba(10, 36, 99, 0.1) 90%)'
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 mb-0 fw-bold" style={{ color: '#0A2463' }}>User Management</h1>
            <p style={{ color: '#0A2463', opacity: 0.7 }}>Manage all registered users</p>
          </div>
          <div className="d-flex">
            <div className="me-2">
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
            <button 
              className="btn fw-medium"
              style={{ 
                background: 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(58, 134, 255, 0.4)',
              }}
            >
              <i className="bi bi-plus-lg me-1"></i> Add User
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
            <div className="spinner-border" style={{ color: '#3A86FF' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div 
            className="card shadow-sm"
            style={{ 
              border: 'none',
              borderRadius: '15px',
              boxShadow: '0 10px 25px rgba(58, 134, 255, 0.2)',
            }}
          >
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{ background: 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)', color: 'white' }}>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Join Date</th>
                      <th>Status</th>
                      <th>Balance</th>
                      <th>Rank</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user._id}>
                        <td style={{ color: '#0A2463' }}>{user._id.substring(0, 8)}</td>
                        <td style={{ color: '#0A2463' }}>{user.name}</td>
                        <td style={{ color: '#0A2463' }}>{user.email}</td>
                        <td style={{ color: '#0A2463' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          {user.isActive ? 
                            <span className="badge" style={{ 
                              background: '#3A86FF',
                              padding: '5px 10px',
                              borderRadius: '20px'
                            }}>Active</span> : 
                            <span className="badge" style={{ 
                              background: '#FF5252',
                              padding: '5px 10px',
                              borderRadius: '20px'
                            }}>Inactive</span>
                          }
                        </td>
                        <td style={{ color: '#0A2463' }}>${user.balance?.toFixed(2) || '0.00'}</td>
                        <td style={{ color: '#0A2463' }}>{user.rank || 'Member'}</td>
                        <td>
                          <button 
                            className="btn btn-sm me-1"
                            onClick={() => viewUserDetails(user._id)}
                            style={{ 
                              border: '1px solid #3A86FF',
                              color: '#3A86FF',
                              borderRadius: '8px'
                            }}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button 
                            className="btn btn-sm me-1"
                            style={{ 
                              border: '1px solid #0A2463',
                              color: '#0A2463',
                              borderRadius: '8px'
                            }}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-sm"
                            style={{ 
                              border: '1px solid #FF5252',
                              color: '#FF5252',
                              borderRadius: '8px'
                            }}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}