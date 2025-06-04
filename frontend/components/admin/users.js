// import AdminLayout from '../../components/admin/AdminLayout';
// import { useState, useEffect } from 'react';
// import api from '../../services/api';
// import { useRouter } from 'next/router';

// export default function UserManagement() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await api.get('/api/admin/users');
//         setUsers(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//         setLoading(false);
//       }
//     };
    
//     fetchUsers();
//   }, []);

//   const filteredUsers = users.filter(user => 
//     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const viewUserDetails = (userId) => {
//     router.push(`/admin/users/${userId}`);
//   };

//   return (
//     <AdminLayout title="User Management">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h1 className="h3 mb-0">User Management</h1>
//           <p className="text-muted">Manage all registered users</p>
//         </div>
//         <div className="d-flex">
//           <div className="me-2">
//             <div className="input-group">
//               <input 
//                 type="text" 
//                 className="form-control" 
//                 placeholder="Search users..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <button className="btn btn-outline-secondary" type="button">
//                 <i className="bi bi-search"></i>
//               </button>
//             </div>
//           </div>
//           <button className="btn btn-primary">
//             <i className="bi bi-plus-lg me-1"></i> Add User
//           </button>
//         </div>
//       </div>
      
//       {loading ? (
//         <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       ) : (
//         <div className="card shadow-sm">
//           <div className="card-body p-0">
//             <div className="table-responsive">
//               <table className="table table-hover mb-0">
//                 <thead className="table-light">
//                   <tr>
//                     <th>ID</th>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Join Date</th>
//                     <th>Status</th>
//                     <th>Balance</th>
//                     <th>Rank</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredUsers.map(user => (
//                     <tr key={user._id}>
//                       <td>{user._id.substring(0, 8)}</td>
//                       <td>{user.name}</td>
//                       <td>{user.email}</td>
//                       <td>{new Date(user.createdAt).toLocaleDateString()}</td>
//                       <td>
//                         {user.isActive ? 
//                           <span className="badge bg-success">Active</span> : 
//                           <span className="badge bg-danger">Inactive</span>
//                         }
//                       </td>
//                       <td>${user.balance?.toFixed(2) || '0.00'}</td>
//                       <td>{user.rank || 'Member'}</td>
//                       <td>
//                         <button 
//                           className="btn btn-sm btn-outline-primary me-1"
//                           onClick={() => viewUserDetails(user._id)}
//                         >
//                           <i className="bi bi-eye"></i>
//                         </button>
//                         <button className="btn btn-sm btn-outline-warning me-1">
//                           <i className="bi bi-pencil"></i>
//                         </button>
//                         <button className="btn btn-sm btn-outline-danger">
//                           <i className="bi bi-trash"></i>
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//     </AdminLayout>
//   );
// }