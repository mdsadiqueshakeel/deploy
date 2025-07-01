
// import Head from 'next/head';
// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import AdminLayout from '../../components/admin/AdminLayout';
// import AdminProtectedRoute from '../../components/admin/AdminProtectedRoute';
// import api from '../../services/api';

// function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [pendingRequests, setPendingRequests] = useState({ topup: { count: 0 }, withdraw: { count: 0 } });
//   const [usersWithPending, setUsersWithPending] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         // Fetch all data in parallel
//         const [usersRes, pendingRes] = await Promise.all([
//           api.get('/api/admin/users'),
//           api.get('/api/wallet/admin/pending-requests')
//         ]);

//         // Get pendingquests count
//         setPendingRequests(pendingRes.data);

//         // Enrich users with their details and check for pending requests
//         const enrichedUsers = await Promise.all(
//           usersRes.data.map(async (user) => {
//             try {
//               // Get user details and pending requests in parallel
//               const [detailsRes, topupRes, withdrawRes] = await Promise.all([
//                 api.get(`/api/admin/user/${user._id}`),
//                 api.get(`/api/wallet/admin/user/${user._id}/pending-topup-requests`),
//                 api.get(`/api/wallet/admin/user/${user._id}/pending-withdraw-requests`)
//               ]);

//               const hasPendingTopup = topupRes.data.length > 0;
//               const hasPendingWithdraw = withdrawRes.data.length > 0;
//               const hasPending = hasPendingTopup || hasPendingWithdraw;

//               return { 
//                 ...user, 
//                 ...detailsRes.data,
//                 hasPending 
//               };
//             } catch (error) {
//               console.error(`Error fetching details for user ${user._id}:`, error);
//               return { ...user, hasPending: false };
//             }
//           })
//         );

//         setUsers(enrichedUsers);
//       } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//         setError(error.response?.data?.message || 'Failed to fetch dashboard data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     try {
//       const date = new Date(dateString);
//       return new Intl.DateTimeFormat('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       }).format(date);
//     } catch {
//       return '-';
//     }
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const filteredUsers = users.filter((user) => {
//     const name = String(user?.name || '').toLowerCase();
//     const email = String(user?.email || '').toLowerCase();
//     const phone = String(user?.phone || '').toLowerCase();
//     const term = searchTerm.toLowerCase();
//     return name.includes(term) || email.includes(term) || phone.includes(term);
//   });

//   const totalPendingRequests = pendingRequests?.topup?.count + pendingRequests?.withdraw?.count;

//   return (
//     <AdminProtectedRoute>
//       <AdminLayout title="Dashboard">
//         <Head>
//           <title>Admin Dashboard | User Management</title>
//         </Head>

//         <div className="p-4 min-vh-100" style={{
//           background: '#FFFFFF',
//           backgroundImage: 'radial-gradient(circle at 90% 20%, rgba(58, 134, 255, 0.1) 0%, rgba(10, 36, 99, 0.1) 90%)'
//         }}>
//           <div className="mb-4 d-flex justify-content-between align-items-center">
//             <div>
//               <h1 className="h3 mb-0 fw-bold" style={{ color: '#0A2463' }}>Dashboard</h1>
//               <p style={{ color: '#0A2463', opacity: 0.7 }}>Overview of the system</p>
//             </div>
//             {error && (
//               <div className="alert py-2 px-3 mb-0" style={{
//                 borderRadius: '10px',
//                 borderLeft: '4px solid #3A86FF',
//                 backgroundColor: 'rgba(255, 82, 82, 0.1)',
//                 color: '#FF5252'
//               }}>
//                 {error}
//               </div>
//             )}
//           </div>

//           {loading ? (
//             <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
//               <div className="spinner-border" style={{ color: '#3A86FF' }} role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//             </div>
//           ) : (
//             <>
//               <div className="row mb-4">
//                 <div className="col-md-3">
//                   <div className="card text-white" style={{
//                     borderRadius: '15px',
//                     background: 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)',
//                     boxShadow: '0 4px 15px rgba(58, 134, 255, 0.4)'
//                   }}>
//                     <div className="card-body">
//                       <h5 className="card-title">Total Users</h5>
//                       <h2 className="fw-bold">{users.length}</h2>
//                       <i className="bi bi-people fs-3 float-end"></i>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="col-md-3">
//                   <div className="card text-white" style={{
//                     borderRadius: '15px',
//                     background: 'linear-gradient(135deg, #FF7F50 0%, #FF4500 100%)',
//                     boxShadow: '0 4px 15px rgba(255, 99, 71, 0.4)'
//                   }}>
//                     <div className="card-body">
//                       <h5 className="card-title">Pending Requests</h5>
//                       <h2 className="fw-bold">{totalPendingRequests}</h2>
//                       <i className="bi bi-hourglass-split fs-3 float-end"></i>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="card shadow-sm" style={{ borderRadius: '15px' }}>
//                 <div className="card-header d-flex justify-content-between align-items-center text-white" style={{
//                   background: 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)',
//                   borderTopLeftRadius: '15px',
//                   borderTopRightRadius: '15px'
//                 }}>
//                   <h5 className="mb-0 fw-medium">User List</h5>
//                   <div className="input-group" style={{ width: '250px' }}>
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="Search users..."
//                       value={searchTerm}
//                       onChange={handleSearchChange}
//                       style={{
//                         borderRadius: '10px 0 0 10px',
//                         backgroundColor: '#F5F5F5',
//                         border: '1px solid #ccc'
//                       }}
//                     />
//                     <button className="btn btn-light" style={{ borderRadius: '0 10px 10px 0' }}>
//                       <i className="bi bi-search"></i>
//                     </button>
//                   </div>
//                 </div>

//                 <div className="table-responsive">
//                   <table className="table table-hover mb-0">
//                     <thead style={{
//                       background: 'linear-gradient(135deg, rgba(58, 134, 255, 0.8), rgba(10, 36, 99, 0.8))',
//                       color: 'white'
//                     }}>
//                       <tr>
//                         <th>Name</th>
//                         <th>Email</th>
//                         <th>Phone</th>
//                         <th>Joined</th>
//                         <th>Status</th>
//                         <th>Request</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredUsers.length > 0 ? (
//                         filteredUsers.map(user => (
//                           <tr
//                             key={user._id}
//                             onClick={() => router.push(`/admin/users/${user._id}`)}
//                             style={{ cursor: 'pointer', color: '#0A2463' }}
//                           >
//                             <td>{user.name || '-'}</td>
//                             <td>{user.email || '-'}</td>
//                             <td>{user.phone || '-'}</td>
//                             <td>{formatDate(user.createdAt)}</td>
//                             <td>
//                               <span className="badge" style={{
//                                 backgroundColor: user.isActive ? '#28a745' : '#FF5252',
//                                 color: 'white',
//                                 borderRadius: '15px',
//                                 padding: '5px 10px'
//                               }}>
//                                 {user.isActive ? 'Active' : 'Inactive'}
//                               </span>
//                             </td>
//                             <td>
//                               {user.hasPending ? (
//                                 <i
//                                   className="bi bi-bell-fill"
//                                   style={{ color: '#ff9800', fontSize: '1.2rem' }}
//                                   title="User has pending requests"
//                                 ></i>
//                               ) : (
//                                 <span className="text-muted">—</span>
//                               )}
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan="6" className="text-center py-4">
//                             {searchTerm ? 'No users found matching your search' : 'No users found'}
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </AdminLayout>
//     </AdminProtectedRoute>
//   );
// }

// export default AdminDashboard;
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
  const [pendingRequests, setPendingRequests] = useState({ topup: { count: 0 }, withdraw: { count: 0 } });
  const [pendingProductCount, setPendingProductCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, pendingRes] = await Promise.all([
          api.get('/api/admin/users'),
          api.get('/api/wallet/admin/pending-requests')
        ]);

        setPendingRequests(pendingRes.data || { topup: { count: 0 }, withdraw: { count: 0 } });

        let productCount = 0;

        const enrichedUsers = await Promise.all(
          (Array.isArray(usersRes.data) ? usersRes.data : []).map(async (user) => {
            try {
              const [detailsRes, topupRes, withdrawRes, productRes] = await Promise.all([
                api.get(`/api/admin/user/${user._id}`),
                api.get(`/api/wallet/admin/user/${user._id}/pending-topup-requests`),
                api.get(`/api/wallet/admin/user/${user._id}/pending-withdraw-requests`),
                api.get(`/api/purchase/products/admin/user/${user._id}/pending-purchases`)
              ]);

              const hasPendingTopup = Array.isArray(topupRes.data) && topupRes.data.length > 0;
              const hasPendingWithdraw = Array.isArray(withdrawRes.data) && withdrawRes.data.length > 0;
              const hasPendingProduct = Array.isArray(productRes.data) && productRes.data.length > 0;

              if (hasPendingProduct) productCount += productRes.data.length;

              return {
                ...user,
                ...(detailsRes.data || {}),
                hasPending: hasPendingTopup || hasPendingWithdraw || hasPendingProduct
              };
            } catch (error) {
              console.error(`Error fetching details for user ${user._id}:`, error);
              return { ...user, hasPending: false };
            }
          })
        );

        setUsers(enrichedUsers);
        setPendingProductCount(productCount);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch {
      return '-';
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const name = String(user?.name || '').toLowerCase();
    const email = String(user?.email || '').toLowerCase();
    const phone = String(user?.phone || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || email.includes(term) || phone.includes(term);
  });

  const totalPendingRequests = pendingRequests?.topup?.count + pendingRequests?.withdraw?.count;

  return (
    <AdminProtectedRoute>
      <AdminLayout title="Dashboard">
        <Head>
          <title>Admin Dashboard | User Management</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>

        <div className="p-3 p-sm-4 p-md-5 min-vh-100" style={{
          background: '#FFFFFF',
          backgroundImage: 'radial-gradient(circle at 90% 20%, rgba(58, 134, 255, 0.1) 0%, rgba(10, 36, 99, 0.1) 90%)'
        }}>
          <div className="mb-4 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
            <div>
              <h1 className="h3 mb-0 fw-bold" style={{ color: '#0A2463' }}>Dashboard</h1>
              <p className="mb-0" style={{ color: '#0A2463', opacity: 0.7 }}>Overview of the system</p>
            </div>
            {error && (
              <div className="alert py-2 px-3 mb-0" style={{
                borderRadius: '10px',
                borderLeft: '4px solid #3A86FF',
                backgroundColor: 'rgba(255, 82, 82, 0.1)',
                color: '#FF5252',
                width: '100%',
                maxWidth: '400px'
              }}>
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
              <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <div className="card text-white h-100" style={{
                    borderRadius: '15px',
                    background: 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)',
                    boxShadow: '0 4px 15px rgba(58, 134, 255, 0.4)'
                  }}>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">Total Users</h5>
                      <div className="d-flex justify-content-between align-items-end mt-auto">
                        <h2 className="fw-bold mb-0">{users.length}</h2>
                        <i className="bi bi-people fs-3"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <div className="card text-white h-100" style={{
                    borderRadius: '15px',
                    background: 'linear-gradient(135deg, #FF7F50 0%, #FF4500 100%)',
                    boxShadow: '0 4px 15px rgba(255, 99, 71, 0.4)'
                  }}>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">Pending Requests</h5>
                      <div className="d-flex justify-content-between align-items-end mt-auto">
                        <h2 className="fw-bold mb-0">{totalPendingRequests}</h2>
                        <i className="bi bi-hourglass-split fs-3"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <div className="card text-white h-100" style={{
                    borderRadius: '15px',
                    background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                    boxShadow: '0 4px 15px rgba(0, 184, 148, 0.4)'
                  }}>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">Pending Product Requests</h5>
                      <div className="d-flex justify-content-between align-items-end mt-auto">
                        <h2 className="fw-bold mb-0">{pendingProductCount}</h2>
                        <i className="bi bi-cart-check fs-3"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card shadow-sm" style={{ borderRadius: '15px' }}>
                <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 text-white" style={{
                  background: 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)',
                  borderTopLeftRadius: '15px',
                  borderTopRightRadius: '15px'
                }}>
                  <h5 className="mb-0 fw-medium">User List</h5>
                  <div className="input-group w-100" style={{ maxWidth: '400px' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      style={{
                        borderRadius: '10px 0 0 10px',
                        backgroundColor: '#F5F5F5',
                        border: '1px solid #ccc'
                      }}
                    />
                    <button className="btn btn-light" style={{ borderRadius: '0 10px 10px 0' }}>
                      <i className="bi bi-search"></i>
                    </button>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead style={{
                      background: 'linear-gradient(135deg, rgba(58, 134, 255, 0.8), rgba(10, 36, 99, 0.8))',
                      color: 'white'
                    }}>
                      <tr>
                        <th className="d-none d-sm-table-cell">Name</th>
                        <th>Email</th>
                        <th className="d-none d-md-table-cell">Phone</th>
                        <th className="d-none d-lg-table-cell">Joined</th>
                        <th>Status</th>
                        <th>Request</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                          <tr
                            key={user._id}
                            onClick={() => router.push(`/admin/users/${user._id}`)}
                            style={{ cursor: 'pointer', color: '#0A2463' }}
                          >
                            <td className="d-none d-sm-table-cell">{user.name || '-'}</td>
                            <td>
                              <span className="d-sm-none fw-bold">{user.name || '-'}</span>
                              <div>{user.email || '-'}</div>
                              {user.phone && <div className="d-sm-none text-muted small">{user.phone}</div>}
                            </td>
                            <td className="d-none d-md-table-cell">{user.phone || '-'}</td>
                            <td className="d-none d-lg-table-cell">{formatDate(user.createdAt)}</td>
                            <td>
                              <span className="badge" style={{
                                backgroundColor: user.isActive ? '#28a745' : '#FF5252',
                                color: 'white',
                                borderRadius: '15px',
                                padding: '5px 10px',
                                fontSize: '0.8rem'
                              }}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>
                              {user.hasPending ? (
                                <i
                                  className="bi bi-bell-fill"
                                  style={{ color: '#ff9800', fontSize: '1.2rem' }}
                                  title="User has pending requests"
                                ></i>
                              ) : (
                                <span className="text-muted">—</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            {searchTerm ? 'No users found matching your search' : 'No users found'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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