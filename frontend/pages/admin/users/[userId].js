
// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import AdminLayout from '../../../components/admin/AdminLayout';
// import api from '../../../services/api';

// export default function UserDetails() {
//   const router = useRouter();
//   const { userId } = router.query;
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('referral');
//   const [topupRequests, setTopupRequests] = useState([]);
//   const [withdrawRequests, setWithdrawRequests] = useState([]);
//   const [purchaseRequests, setPurchaseRequests] = useState([]);
//   const [loadingTransactions, setLoadingTransactions] = useState(false);
//   const [loadingPurchases, setLoadingPurchases] = useState(false);
//   const [showApproveModal, setShowApproveModal] = useState(false);
//   const [showDeclineModal, setShowDeclineModal] = useState(false);
//   const [currentRequest, setCurrentRequest] = useState(null);
  
//   // Color theme variables from AdminLayout
//   const primaryColor = '#3A86FF';
//   const primaryDarkColor = '#0A2463';
//   const secondaryColor = '#FF5252';
//   const successColor = '#28a745';
//   const textColor = '#0A2463';
//   const lightBackground = 'rgba(58, 134, 255, 0.1)';
//   const cardGradient = 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)';
//   const sidebarGradient = 'linear-gradient(160deg, #0A2463 0%, #3A86FF 100%)';
//   const hoverGradient = 'linear-gradient(135deg, rgba(58, 134, 255, 0.3) 0%, rgba(10, 36, 99, 0.3) 100%)';

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       if (!userId) return;
//       try {
//         const response = await api.get(`/api/admin/user/${userId}`);
//         setUser(response.data);
//       } catch (error) {
//         console.error('Error fetching user details:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserDetails();
//   }, [userId]);

//   useEffect(() => {
//     if (activeTab === 'transactions' && userId) {
//       fetchPendingTransactions();
//     } else if (activeTab === 'products' && userId) {
//       fetchPendingPurchases();
//     }
//   }, [activeTab, userId]);

//   const fetchPendingTransactions = async () => {
//     setLoadingTransactions(true);
//     try {
//       const [topupRes, withdrawRes] = await Promise.all([
//         api.get(`/api/wallet/admin/user/${userId}/pending-topup-requests`),
//         api.get(`/api/wallet/admin/user/${userId}/pending-withdraw-requests`)
//       ]);
//       setTopupRequests(topupRes.data);
//       setWithdrawRequests(withdrawRes.data);
//     } catch (error) {
//       console.error('Error fetching transactions:', error);
//     } finally {
//       setLoadingTransactions(false);
//     }
//   };

//   const fetchPendingPurchases = async () => {
//     setLoadingPurchases(true);
//     try {
//       const response = await api.get(`/api/purchase/products/admin/user/${userId}/pending-purchases`);
//       setPurchaseRequests(response.data);
//     } catch (error) {
//       console.error('Error fetching purchase requests:', error);
//     } finally {
//       setLoadingPurchases(false);
//     }
//   };

//   const handleApproveClick = (request, type) => {
//     setCurrentRequest({ ...request, type });
//     setShowApproveModal(true);
//   };

//   const handleDeclineClick = (request, type) => {
//     setCurrentRequest({ ...request, type });
//     setShowDeclineModal(true);
//   };

//   const approveRequest = async () => {
//     if (!currentRequest) return;
    
//     try {
//       let endpoint;
//       if (currentRequest.type === 'topup') {
//         endpoint = `/api/wallet/admin/topup-request/${currentRequest._id}/approve`;
//       } else if (currentRequest.type === 'withdraw') {
//         endpoint = `/api/wallet/admin/withdraw-request/${currentRequest._id}/approve`;
//       } else if (currentRequest.type === 'purchase') {
//         endpoint = `/api/purchase/products/admin/${currentRequest._id}/approve`;
//       }
      
//       await api.put(endpoint);
      
//       // Remove approved request from state
//       if (currentRequest.type === 'topup') {
//         setTopupRequests(topupRequests.filter(req => req._id !== currentRequest._id));
//       } else if (currentRequest.type === 'withdraw') {
//         setWithdrawRequests(withdrawRequests.filter(req => req._id !== currentRequest._id));
//       } else if (currentRequest.type === 'purchase') {
//         setPurchaseRequests(purchaseRequests.filter(req => req._id !== currentRequest._id));
//       }
      
//       setShowApproveModal(false);
//       setCurrentRequest(null);
//     } catch (error) {
//       console.error('Error approving request:', error);
//     }
//   };

//   const declineRequest = async () => {
//     if (!currentRequest) return;
    
//     try {
//       let endpoint;
//       if (currentRequest.type === 'topup') {
//         endpoint = `/api/wallet/admin/topup-request/${currentRequest._id}/decline`;
//       } else if (currentRequest.type === 'withdraw') {
//         endpoint = `/api/wallet/admin/withdraw-request/${currentRequest._id}/decline`;
//       } else if (currentRequest.type === 'purchase') {
//         endpoint = `/api/purchase/products/admin/${currentRequest._id}/reject`;
//       }
      
//       await api.put(endpoint);
      
//       // Remove declined request from state
//       if (currentRequest.type === 'topup') {
//         setTopupRequests(topupRequests.filter(req => req._id !== currentRequest._id));
//       } else if (currentRequest.type === 'withdraw') {
//         setWithdrawRequests(withdrawRequests.filter(req => req._id !== currentRequest._id));
//       } else if (currentRequest.type === 'purchase') {
//         setPurchaseRequests(purchaseRequests.filter(req => req._id !== currentRequest._id));
//       }
      
//       setShowDeclineModal(false);
//       setCurrentRequest(null);
//     } catch (error) {
//       console.error('Error declining request:', error);
//     }
//   };

//   const renderTransactions = () => {
//     if (loadingTransactions) {
//       return (
//         <div className="d-flex justify-content-center align-items-center py-5">
//           <div className="spinner-border" style={{ color: primaryColor }} role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div>
//         {/* Pending Top-up Requests */}
//         <div className="mb-5">
//           <h5 className="mb-4 fw-bold" style={{ color: primaryDarkColor }}>Pending Top-up Requests</h5>
          
//           {topupRequests.length === 0 ? (
//             <div className="alert alert-info">
//               No pending top-up requests
//             </div>
//           ) : (
//             <div className="row g-3">
//               {topupRequests.map(request => (
//                 <div key={request._id} className="col-md-6">
//                   <div 
//                     className="card border-0 shadow-sm p-3" 
//                     style={{ borderRadius: '10px', backgroundColor: 'rgba(58, 134, 255, 0.05)' }}
//                   >
//                     <div className="d-flex justify-content-between align-items-center mb-2">
//                       <span className="fw-bold" style={{ color: primaryDarkColor }}>Amount: ${request.amount}</span>
//                       <span className="badge bg-warning text-dark">Pending</span>
//                     </div>
                    
//                     <div className="mb-2">
//                       <span className="fw-medium">Created: </span>
//                       <span>{new Date(request.createdAt).toLocaleString()}</span>
//                     </div>
                    
//                     {request.note && (
//                       <div className="mb-3">
//                         <span className="fw-medium">Note: </span>
//                         <span>{request.note}</span>
//                       </div>
//                     )}
                    
//                     <div className="d-flex gap-2">
//                       <button 
//                         className="btn btn-sm flex-grow-1"
//                         onClick={() => handleApproveClick(request, 'topup')}
//                         style={{
//                           backgroundColor: successColor,
//                           color: 'white',
//                           borderRadius: '8px',
//                           padding: '8px 12px',
//                           transition: 'all 0.2s ease',
//                         }}
//                         onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
//                         onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
//                       >
//                         Approve
//                       </button>
//                       <button 
//                         className="btn btn-sm flex-grow-1"
//                         onClick={() => handleDeclineClick(request, 'topup')}
//                         style={{
//                           backgroundColor: secondaryColor,
//                           color: 'white',
//                           borderRadius: '8px',
//                           padding: '8px 12px',
//                           transition: 'all 0.2s ease',
//                         }}
//                         onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
//                         onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
//                       >
//                         Decline
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Pending Withdrawal Requests */}
//         <div>
//           <h5 className="mb-4 fw-bold" style={{ color: primaryDarkColor }}>Pending Withdrawal Requests</h5>
          
//           {withdrawRequests.length === 0 ? (
//             <div className="alert alert-info">
//               No pending withdrawal requests
//             </div>
//           ) : (
//             <div className="row g-3">
//               {withdrawRequests.map(request => (
//                 <div key={request._id} className="col-md-6">
//                   <div 
//                     className="card border-0 shadow-sm p-3" 
//                     style={{ borderRadius: '10px', backgroundColor: 'rgba(255, 82, 82, 0.05)' }}
//                   >
//                     <div className="d-flex justify-content-between align-items-center mb-2">
//                       <span className="fw-bold" style={{ color: primaryDarkColor }}>Amount: ₹{request.amount}</span>
//                       <span className="badge bg-warning text-dark">Pending</span>
//                     </div>
                    
//                     <div className="mb-2">
//                       <span className="fw-medium">Created: </span>
//                       <span>{new Date(request.createdAt).toLocaleString()}</span>
//                     </div>
                    
//                     {request.updatedAt && (
//                       <div className="mb-3">
//                         <span className="fw-medium">Updated: </span>
//                         <span>{new Date(request.updatedAt).toLocaleString()}</span>
//                       </div>
//                     )}
                    
//                     <div className="d-flex gap-2">
//                       <button 
//                         className="btn btn-sm flex-grow-1"
//                         onClick={() => handleApproveClick(request, 'withdraw')}
//                         style={{
//                           backgroundColor: successColor,
//                           color: 'white',
//                           borderRadius: '8px',
//                           padding: '8px 12px',
//                           transition: 'all 0.2s ease',
//                         }}
//                         onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
//                         onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
//                       >
//                         Approve
//                       </button>
//                       <button 
//                         className="btn btn-sm flex-grow-1"
//                         onClick={() => handleDeclineClick(request, 'withdraw')}
//                         style={{
//                           backgroundColor: secondaryColor,
//                           color: 'white',
//                           borderRadius: '8px',
//                           padding: '8px 12px',
//                           transition: 'all 0.2s ease',
//                         }}
//                         onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
//                         onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
//                       >
//                         Decline
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderProductPurchases = () => {
//     if (loadingPurchases) {
//       return (
//         <div className="d-flex justify-content-center align-items-center py-5">
//           <div className="spinner-border" style={{ color: primaryColor }} role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div>
//         <h5 className="mb-4 fw-bold" style={{ color: primaryDarkColor }}>Pending Product Purchase Requests</h5>
        
//         {purchaseRequests.length === 0 ? (
//           <div className="alert alert-info">
//             No pending product purchase requests
//           </div>
//         ) : (
//           <div className="row g-3">
//             {purchaseRequests.map(request => (
//               <div key={request._id} className="col-md-6">
//                 <div 
//                   className="card border-0 shadow-sm p-3" 
//                   style={{ borderRadius: '10px', backgroundColor: 'rgba(255, 193, 7, 0.05)' }}
//                 >
//                   <div className="d-flex justify-content-between align-items-center mb-2">
//                     <span className="fw-bold" style={{ color: primaryDarkColor }}>
//                       {request.productName} (Code: {request.productCode})
//                     </span>
//                     <span className="badge bg-warning text-dark">Pending</span>
//                   </div>
                  
//                   <div className="mb-2">
//                     <span className="fw-medium">Quantity: </span>
//                     <span>{request.quantity}</span>
//                   </div>
                  
//                   <div className="mb-2">
//                     <span className="fw-medium">Unit Price: </span>
//                     <span>${request.unitPrice}</span>
//                   </div>
                  
//                   <div className="mb-2">
//                     <span className="fw-medium">Total Price: </span>
//                     <span className="fw-bold" style={{ color: primaryColor }}>${request.totalPrice}</span>
//                   </div>
                  
//                   <div className="mb-2">
//                     <span className="fw-medium">Requested At: </span>
//                     <span>{new Date(request.requestedAt).toLocaleString()}</span>
//                   </div>
                  
//                   {request.shippingAddress && (
//                     <div className="mb-3">
//                       <span className="fw-medium">Shipping Address: </span>
//                       <span>{request.shippingAddress}</span>
//                     </div>
//                   )}
                  
//                   <div className="d-flex gap-2">
//                     <button 
//                       className="btn btn-sm flex-grow-1"
//                       onClick={() => handleApproveClick(request, 'purchase')}
//                       style={{
//                         backgroundColor: successColor,
//                         color: 'white',
//                         borderRadius: '8px',
//                         padding: '8px 12px',
//                         transition: 'all 0.2s ease',
//                       }}
//                       onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
//                       onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
//                     >
//                       Approve
//                     </button>
//                     <button 
//                       className="btn btn-sm flex-grow-1"
//                       onClick={() => handleDeclineClick(request, 'purchase')}
//                       style={{
//                         backgroundColor: secondaryColor,
//                         color: 'white',
//                         borderRadius: '8px',
//                         padding: '8px 12px',
//                         transition: 'all 0.2s ease',
//                       }}
//                       onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
//                       onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
//                     >
//                       Reject
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <AdminLayout title="User Details">
//         <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
//           <div className="spinner-border" style={{ color: primaryColor }} role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       </AdminLayout>
//     );
//   }

//   if (!user) {
//     return (
//       <AdminLayout title="User Details">
//         <div
//           className="alert py-2 px-3 mb-0"
//           style={{
//             borderRadius: '10px',
//             borderLeft: `4px solid ${secondaryColor}`,
//             backgroundColor: 'rgba(255, 82, 82, 0.1)',
//             color: secondaryColor,
//             fontWeight: 'bold'
//           }}
//         >
//           User not found.
//         </div>
//       </AdminLayout>
//     );
//   }

//   return (
//     <AdminLayout title={`User: ${user.name}`}>
//       {/* Approval Confirmation Modal */}
//       {showApproveModal && (
//         <div 
//           className="modal"
//           style={{
//             display: 'block',
//             backgroundColor: 'rgba(0,0,0,0.5)',
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             zIndex: 1050
//           }}
//         >
//           <div 
//             className="modal-dialog modal-dialog-centered"
//             style={{ maxWidth: '500px' }}
//           >
//             <div 
//               className="modal-content"
//               style={{
//                 borderRadius: '15px',
//                 overflow: 'hidden',
//                 border: 'none',
//                 boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
//               }}
//             >
//               <div 
//                 className="modal-header"
//                 style={{
//                   backgroundColor: primaryColor,
//                   color: 'white',
//                   borderBottom: 'none'
//                 }}
//               >
//                 <h5 className="modal-title">Confirm Approval</h5>
//                 <button 
//                   type="button" 
//                   className="btn-close" 
//                   onClick={() => setShowApproveModal(false)}
//                   style={{ filter: 'invert(1)' }}
//                 ></button>
//               </div>
//               <div className="modal-body py-4">
//                 <p className="fs-5 mb-0 text-center">
//                   Are you sure you want to approve this request?
//                 </p>
//                 {currentRequest && (
//                   <div className="mt-3 text-center">
//                     {currentRequest.type === 'purchase' ? (
//                       <>
//                         <p className="mb-1">
//                           <strong>Product:</strong> {currentRequest.productName} (Code: {currentRequest.productCode})
//                         </p>
//                         <p className="mb-1">
//                           <strong>Quantity:</strong> {currentRequest.quantity}
//                         </p>
//                         <p className="mb-1">
//                           <strong>Unit Price:</strong> ${currentRequest.unitPrice}
//                         </p>
//                         <p className="mb-0">
//                           <strong>Total Price:</strong> ${currentRequest.totalPrice}
//                         </p>
//                       </>
//                     ) : (
//                       <>
//                         <p className="mb-1">
//                           <strong>Amount:</strong> ${currentRequest.amount}
//                         </p>
//                         <p className="mb-0">
//                           <strong>Type:</strong> {currentRequest.type === 'topup' ? 'Top-up' : 'Withdrawal'}
//                         </p>
//                       </>
//                     )}
//                   </div>
//                 )}
//               </div>
//               <div 
//                 className="modal-footer"
//                 style={{ borderTop: 'none' }}
//               >
//                 <button 
//                   type="button" 
//                   className="btn btn-secondary"
//                   onClick={() => setShowApproveModal(false)}
//                   style={{
//                     borderRadius: '8px',
//                     padding: '8px 20px',
//                     backgroundColor: secondaryColor,
//                     border: 'none'
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="button" 
//                   className="btn"
//                   onClick={approveRequest}
//                   style={{
//                     borderRadius: '8px',
//                     padding: '8px 20px',
//                     backgroundColor: successColor,
//                     color: 'white',
//                     border: 'none'
//                   }}
//                 >
//                   Yes, Approve
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Decline Confirmation Modal */}
//       {showDeclineModal && (
//         <div 
//           className="modal"
//           style={{
//             display: 'block',
//             backgroundColor: 'rgba(0,0,0,0.5)',
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             zIndex: 1050
//           }}
//         >
//           <div 
//             className="modal-dialog modal-dialog-centered"
//             style={{ maxWidth: '500px' }}
//           >
//             <div 
//               className="modal-content"
//               style={{
//                 borderRadius: '15px',
//                 overflow: 'hidden',
//                 border: 'none',
//                 boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
//               }}
//             >
//               <div 
//                 className="modal-header"
//                 style={{
//                   backgroundColor: secondaryColor,
//                   color: 'white',
//                   borderBottom: 'none'
//                 }}
//               >
//                 <h5 className="modal-title">Confirm Decline</h5>
//                 <button 
//                   type="button" 
//                   className="btn-close" 
//                   onClick={() => setShowDeclineModal(false)}
//                   style={{ filter: 'invert(1)' }}
//                 ></button>
//               </div>
//               <div className="modal-body py-4">
//                 <p className="fs-5 mb-0 text-center">
//                   Are you sure you want to decline this request?
//                 </p>
//                 {currentRequest && (
//                   <div className="mt-3 text-center">
//                     {currentRequest.type === 'purchase' ? (
//                       <>
//                         <p className="mb-1">
//                           <strong>Product:</strong> {currentRequest.productName} (Code: {currentRequest.productCode})
//                         </p>
//                         <p className="mb-1">
//                           <strong>Quantity:</strong> {currentRequest.quantity}
//                         </p>
//                         <p className="mb-1">
//                           <strong>Unit Price:</strong> ${currentRequest.unitPrice}
//                         </p>
//                         <p className="mb-0">
//                           <strong>Total Price:</strong> ${currentRequest.totalPrice}
//                         </p>
//                       </>
//                     ) : (
//                       <>
//                         <p className="mb-1">
//                           <strong>Amount:</strong> ${currentRequest.amount}
//                         </p>
//                         <p className="mb-0">
//                           <strong>Type:</strong> {currentRequest.type === 'topup' ? 'Top-up' : 'Withdrawal'}
//                         </p>
//                       </>
//                     )}
//                   </div>
//                 )}
//               </div>
//               <div 
//                 className="modal-footer"
//                 style={{ borderTop: 'none' }}
//               >
//                 <button 
//                   type="button" 
//                   className="btn btn-secondary"
//                   onClick={() => setShowDeclineModal(false)}
//                   style={{
//                     borderRadius: '8px',
//                     padding: '8px 20px',
//                     backgroundColor: primaryColor,
//                     border: 'none'
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="button" 
//                   className="btn"
//                   onClick={declineRequest}
//                   style={{
//                     borderRadius: '8px',
//                     padding: '8px 20px',
//                     backgroundColor: secondaryColor,
//                     color: 'white',
//                     border: 'none'
//                   }}
//                 >
//                   Yes, Decline
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Back Button */}
//       <div className="mb-4">
//         <button
//           className="btn btn-sm"
//           onClick={() => router.back()}
//           style={{
//             backgroundColor: 'white',
//             color: primaryDarkColor,
//             border: `1px solid ${primaryColor}`,
//             borderRadius: '8px',
//             padding: '8px 15px',
//             boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
//             transition: 'all 0.2s ease',
//           }}
//           onMouseEnter={(e) => e.currentTarget.style.backgroundColor = primaryColor}
//           onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
//         >
//           <i className="bi bi-arrow-left me-2" style={{ color: primaryDarkColor }} />
//           <span style={{ color: primaryDarkColor }}>Back to Users</span>
//         </button>
//       </div>

//       <div className="row">
//         {/* User Profile Card */}
//         <div className="col-md-4 mb-4">
//           <div
//             className="card shadow-sm"
//             style={{
//               border: 'none',
//               borderRadius: '15px',
//               overflow: 'hidden',
//               background: 'white',
//               boxShadow: '0 10px 25px rgba(58, 134, 255, 0.1)'
//             }}
//           >
//             <div
//               className="card-header text-white text-center py-4"
//               style={{
//                 background: cardGradient,
//                 borderTopLeftRadius: '15px',
//                 borderTopRightRadius: '15px'
//               }}
//             >
//               <div
//                 className="bg-white rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
//                 style={{ width: '100px', height: '100px', boxShadow: '0 0 15px rgba(0,0,0,0.2)' }}
//               >
//                 <i className="bi bi-person-circle fs-1" style={{ color: primaryDarkColor }}></i>
//               </div>
//               <h4 className="mt-3 mb-1 fw-bold">{user.name}</h4>
//               <p className="mb-1" style={{ opacity: 0.9 }}>{user.email}</p>
//               <span
//                 className="badge fw-medium"
//                 style={{
//                   padding: '6px 12px',
//                   borderRadius: '20px',
//                   backgroundColor: user.isActive ? successColor : secondaryColor,
//                   color: 'white',
//                   marginTop: '5px'
//                 }}
//               >
//                 {user.isActive ? 'Active' : 'Inactive'}
//               </span>
//             </div>

//             <div className="card-body p-4">
//               <h6 className="text-uppercase mb-3 fw-bold" style={{ color: primaryDarkColor, opacity: 0.8 }}>
//                 Account Information
//               </h6>
//               <ul className="list-unstyled mb-0">
//                 <li className="mb-2 d-flex justify-content-between align-items-center">
//                   <span className="fw-medium" style={{ color: textColor }}>Phone:</span>
//                   <span style={{ color: textColor, opacity: 0.8 }}>{user.phone || 'N/A'}</span>
//                 </li>
//                 <li className="mb-2 d-flex justify-content-between align-items-center">
//                   <span className="fw-medium" style={{ color: textColor }}>Joined:</span>
//                   <span style={{ color: textColor, opacity: 0.8 }}>{new Date(user.createdAt).toLocaleDateString()}</span>
//                 </li>
//                 <li className="mb-2 d-flex justify-content-between align-items-center">
//                   <span className="fw-medium" style={{ color: textColor }}>Status:</span>
//                   <span style={{ color: textColor, opacity: 0.8 }}>{user.status}</span>
//                 </li>
//                 <li className="mb-2 d-flex justify-content-between align-items-center">
//                   <span className="fw-medium" style={{ color: textColor }}>Rank:</span>
//                   <span className="badge" style={{ backgroundColor: primaryColor, color: 'white', borderRadius: '15px', padding: '4px 10px' }}>
//                     {user.rank || 'Member'}
//                   </span>
//                 </li>
//                 <li className="mb-2 d-flex justify-content-between align-items-center">
//                   <span className="fw-medium" style={{ color: textColor }}>Balance:</span>
//                   <span className="fw-bold" style={{ color: primaryColor }}>${user.balance?.toFixed(2) || '0.00'}</span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* User Details Tabs */}
//         <div className="col-md-8">
//           <div
//             className="card shadow-sm"
//             style={{
//               border: 'none',
//               borderRadius: '15px',
//               boxShadow: '0 10px 25px rgba(58, 134, 255, 0.1)'
//             }}
//           >
//             <div
//               className="card-header"
//               style={{
//                 backgroundColor: 'white',
//                 borderBottom: `1px solid ${lightBackground}`,
//                 borderTopLeftRadius: '15px',
//                 borderTopRightRadius: '15px'
//               }}
//             >
//               <ul className="nav nav-tabs card-header-tabs" style={{ borderBottom: 'none' }}>
//                 <li className="nav-item">
//                   <a
//                     className={`nav-link ${activeTab === 'referral' ? 'active' : ''}`}
//                     href="#"
//                     onClick={(e) => { e.preventDefault(); setActiveTab('referral'); }}
//                     style={{
//                       color: activeTab === 'referral' ? primaryDarkColor : textColor,
//                       borderColor: activeTab === 'referral' ? `transparent transparent ${primaryColor} transparent` : 'transparent',
//                       borderWidth: '2px',
//                       fontWeight: activeTab === 'referral' ? 'bold' : 'normal',
//                       backgroundColor: 'transparent',
//                       opacity: activeTab === 'referral' ? 1 : 0.7
//                     }}
//                   >
//                     Referral Info
//                   </a>
//                 </li>
//                 <li className="nav-item">
//                   <a
//                     className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`}
//                     href="#"
//                     onClick={(e) => { e.preventDefault(); setActiveTab('transactions'); }}
//                     style={{
//                       color: activeTab === 'transactions' ? primaryDarkColor : textColor,
//                       borderColor: activeTab === 'transactions' ? `transparent transparent ${primaryColor} transparent` : 'transparent',
//                       borderWidth: '2px',
//                       fontWeight: activeTab === 'transactions' ? 'bold' : 'normal',
//                       backgroundColor: 'transparent',
//                       opacity: activeTab === 'transactions' ? 1 : 0.7
//                     }}
//                   >
//                     Transactions
//                   </a>
//                 </li>
//                 <li className="nav-item">
//                   <a
//                     className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
//                     href="#"
//                     onClick={(e) => { e.preventDefault(); setActiveTab('products'); }}
//                     style={{
//                       color: activeTab === 'products' ? primaryDarkColor : textColor,
//                       borderColor: activeTab === 'products' ? `transparent transparent ${primaryColor} transparent` : 'transparent',
//                       borderWidth: '2px',
//                       fontWeight: activeTab === 'products' ? 'bold' : 'normal',
//                       backgroundColor: 'transparent',
//                       opacity: activeTab === 'products' ? 1 : 0.7
//                     }}
//                   >
//                     Product Purchases
//                   </a>
//                 </li>
//                 <li className="nav-item">
//                   <a
//                     className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
//                     href="#"
//                     onClick={(e) => { e.preventDefault(); setActiveTab('settings'); }}
//                     style={{
//                       color: activeTab === 'settings' ? primaryDarkColor : textColor,
//                       borderColor: activeTab === 'settings' ? `transparent transparent ${primaryColor} transparent` : 'transparent',
//                       borderWidth: '2px',
//                       fontWeight: activeTab === 'settings' ? 'bold' : 'normal',
//                       backgroundColor: 'transparent',
//                       opacity: activeTab === 'settings' ? 1 : 0.7
//                     }}
//                   >
//                     Settings
//                   </a>
//                 </li>
//               </ul>
//             </div>
//             <div className="card-body p-4">
//               {activeTab === 'referral' ? (
//                 <>
//                   {/* Referral Information */}
//                   <div>
//                     <h5 className="mb-4 fw-bold" style={{ color: primaryDarkColor }}>Referral Information</h5>
//                     <div className="row g-3">
//                       <div className="col-md-6">
//                         <div
//                           className="border rounded p-3"
//                           style={{
//                             borderColor: lightBackground,
//                             backgroundColor: 'white',
//                             boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
//                             borderRadius: '10px'
//                           }}
//                         >
//                           <h6 className="text-uppercase mb-2 small" style={{ color: textColor, opacity: 0.7 }}>
//                             Referred By
//                           </h6>
//                           <p className="mb-0 fw-medium" style={{ color: primaryColor }}>
//                             {user.parentId?.name || 'Root User'}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="col-md-6">
//                         <div
//                           className="border rounded p-3"
//                           style={{
//                             borderColor: lightBackground,
//                             backgroundColor: 'white',
//                             boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
//                             borderRadius: '10px'
//                           }}
//                         >
//                           <h6 className="text-uppercase mb-2 small" style={{ color: textColor, opacity: 0.7 }}>
//                             Referral Codes
//                           </h6>
//                           <p className="mb-1" style={{ color: textColor }}>
//                             <span className="fw-medium">Left:</span> {user.referralCodeLeft || 'N/A'}
//                           </p>
//                           <p className="mb-0" style={{ color: textColor }}>
//                             <span className="fw-medium">Right:</span> {user.referralCodeRight || 'N/A'}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Bank Details Section */}
//                   <div className="mt-4">
//                     <h6 className="text-uppercase mb-3 fw-bold" style={{ color: primaryDarkColor, opacity: 0.8 }}>
//                       Bank Information
//                     </h6>
//                     <ul className="list-unstyled mb-0">
//                       <li className="mb-2 d-flex justify-content-between align-items-center">
//                         <span className="fw-medium" style={{ color: textColor }}>Account Number:</span>
//                         <span style={{ color: textColor, opacity: 0.8 }}>
//                           {user.bankDetails?.accountNumber || 'N/A'}
//                         </span>
//                       </li>
//                       <li className="mb-2 d-flex justify-content-between align-items-center">
//                         <span className="fw-medium" style={{ color: textColor }}>Bank Name:</span>
//                         <span style={{ color: textColor, opacity: 0.8 }}>
//                           {user.bankDetails?.bankName || 'N/A'}
//                         </span>
//                       </li>
//                       <li className="mb-2 d-flex justify-content-between align-items-center">
//                         <span className="fw-medium" style={{ color: textColor }}>Account Number:</span>
//                         <span style={{ color: textColor, opacity: 0.8 }}>
//                           {user.bankDetails?.accountNumber 
//                             ? `****${user.bankDetails.accountNumber.toString().slice(-4)}` 
//                             : 'N/A'}
//                         </span>
//                       </li>
//                       <li className="d-flex justify-content-between align-items-center">
//                         <span className="fw-medium" style={{ color: textColor }}>IFSC Code:</span>
//                         <span style={{ color: textColor, opacity: 0.8 }}>
//                           {user.bankDetails?.ifscCode || 'N/A'}
//                         </span>
//                       </li>
//                     </ul>
//                   </div>
//                 </>
//               ) : activeTab === 'transactions' ? (
//                 renderTransactions()
//               ) : activeTab === 'products' ? (
//                 renderProductPurchases()
//               ) : (
//                 <div className="text-center py-5">
//                   <i className="bi bi-gear fs-1 mb-3" style={{ color: primaryColor }}></i>
//                   <h5 style={{ color: primaryDarkColor }}>User Settings</h5>
//                   <p className="text-muted">User settings will be available soon</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// }
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import api from '../../../services/api';

export default function UserDetails() {
  const router = useRouter();
  const { userId } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('referral');
  const [topupRequests, setTopupRequests] = useState([]);
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [approvedPurchases, setApprovedPurchases] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [loadingApprovedPurchases, setLoadingApprovedPurchases] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  
  // Color theme variables from AdminLayout
  const primaryColor = '#3A86FF';
  const primaryDarkColor = '#0A2463';
  const secondaryColor = '#FF5252';
  const successColor = '#28a745';
  const textColor = '#0A2463';
  const lightBackground = 'rgba(58, 134, 255, 0.1)';
  const cardGradient = 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)';
  const sidebarGradient = 'linear-gradient(160deg, #0A2463 0%, #3A86FF 100%)';
  const hoverGradient = 'linear-gradient(135deg, rgba(58, 134, 255, 0.3) 0%, rgba(10, 36, 99, 0.3) 100%)';

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      try {
        const response = await api.get(`/api/admin/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    if (activeTab === 'transactions' && userId) {
      fetchPendingTransactions();
    } else if (activeTab === 'products' && userId) {
      fetchPendingPurchases();
      fetchApprovedPurchases();
    }
  }, [activeTab, userId]);

  const fetchPendingTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const [topupRes, withdrawRes] = await Promise.all([
        api.get(`/api/wallet/admin/user/${userId}/pending-topup-requests`),
        api.get(`/api/wallet/admin/user/${userId}/pending-withdraw-requests`)
      ]);
      setTopupRequests(topupRes.data);
      setWithdrawRequests(withdrawRes.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const fetchPendingPurchases = async () => {
    setLoadingPurchases(true);
    try {
      const response = await api.get(`/api/purchase/products/admin/user/${userId}/pending-purchases`);
      setPurchaseRequests(response.data);
    } catch (error) {
      console.error('Error fetching purchase requests:', error);
    } finally {
      setLoadingPurchases(false);
    }
  };

  const fetchApprovedPurchases = async () => {
    setLoadingApprovedPurchases(true);
    try {
      const response = await api.get(`/api/purchase/products/admin/user/${userId}/approved-purchases`);
      setApprovedPurchases(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching approved purchases:', error);
      setApprovedPurchases([]);
    } finally {
      setLoadingApprovedPurchases(false);
    }
  };

  const handleApproveClick = (request, type) => {
    setCurrentRequest({ ...request, type });
    setShowApproveModal(true);
  };

  const handleDeclineClick = (request, type) => {
    setCurrentRequest({ ...request, type });
    setShowDeclineModal(true);
  };

  const approveRequest = async () => {
    if (!currentRequest) return;
    
    try {
      let endpoint;
      if (currentRequest.type === 'topup') {
        endpoint = `/api/wallet/admin/topup-request/${currentRequest._id}/approve`;
      } else if (currentRequest.type === 'withdraw') {
        endpoint = `/api/wallet/admin/withdraw-request/${currentRequest._id}/approve`;
      } else if (currentRequest.type === 'purchase') {
        endpoint = `/api/purchase/products/admin/${currentRequest._id}/approve`;
      }
      
      await api.put(endpoint);
      
      // Remove approved request from state
      if (currentRequest.type === 'topup') {
        setTopupRequests(topupRequests.filter(req => req._id !== currentRequest._id));
      } else if (currentRequest.type === 'withdraw') {
        setWithdrawRequests(withdrawRequests.filter(req => req._id !== currentRequest._id));
      } else if (currentRequest.type === 'purchase') {
        setPurchaseRequests(purchaseRequests.filter(req => req._id !== currentRequest._id));
        // Refresh approved purchases after approval
        await fetchApprovedPurchases();
      }
      
      setShowApproveModal(false);
      setCurrentRequest(null);
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const declineRequest = async () => {
    if (!currentRequest) return;
    
    try {
      let endpoint;
      if (currentRequest.type === 'topup') {
        endpoint = `/api/wallet/admin/topup-request/${currentRequest._id}/decline`;
      } else if (currentRequest.type === 'withdraw') {
        endpoint = `/api/wallet/admin/withdraw-request/${currentRequest._id}/decline`;
      } else if (currentRequest.type === 'purchase') {
        endpoint = `/api/purchase/products/admin/${currentRequest._id}/reject`;
      }
      
      await api.put(endpoint);
      
      // Remove declined request from state
      if (currentRequest.type === 'topup') {
        setTopupRequests(topupRequests.filter(req => req._id !== currentRequest._id));
      } else if (currentRequest.type === 'withdraw') {
        setWithdrawRequests(withdrawRequests.filter(req => req._id !== currentRequest._id));
      } else if (currentRequest.type === 'purchase') {
        setPurchaseRequests(purchaseRequests.filter(req => req._id !== currentRequest._id));
      }
      
      setShowDeclineModal(false);
      setCurrentRequest(null);
    } catch (error) {
      console.error('Error declining request:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <span className="badge bg-warning text-dark">Pending</span>;
      case 'approved':
        return <span className="badge bg-success">Approved</span>;
      case 'rejected':
        return <span className="badge bg-danger">Rejected</span>;
      case 'shipped':
        return <span className="badge bg-info">Shipped</span>;
      case 'delivered':
        return <span className="badge bg-primary">Delivered</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const renderTransactions = () => {
    if (loadingTransactions) {
      return (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border" style={{ color: primaryColor }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    return (
      <div>
        {/* Pending Top-up Requests */}
        <div className="mb-5">
          <h5 className="mb-4 fw-bold" style={{ color: primaryDarkColor }}>Pending Top-up Requests</h5>
          
          {topupRequests.length === 0 ? (
            <div className="alert alert-info">
              No pending top-up requests
            </div>
          ) : (
            <div className="row g-3">
              {topupRequests.map(request => (
                <div key={request._id} className="col-md-6">
                  <div 
                    className="card border-0 shadow-sm p-3" 
                    style={{ borderRadius: '10px', backgroundColor: 'rgba(58, 134, 255, 0.05)' }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold" style={{ color: primaryDarkColor }}>Amount: ₹{request.amount}</span>
                      <span className="badge bg-warning text-dark">Pending</span>
                    </div>
                    
                    <div className="mb-2">
                      <span className="fw-medium">Created: </span>
                      <span>{new Date(request.createdAt).toLocaleString()}</span>
                    </div>
                    
                    {request.note && (
                      <div className="mb-3">
                        <span className="fw-medium">Note: </span>
                        <span>{request.note}</span>
                      </div>
                    )}
                    
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-sm flex-grow-1"
                        onClick={() => handleApproveClick(request, 'topup')}
                        style={{
                          backgroundColor: successColor,
                          color: 'white',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn btn-sm flex-grow-1"
                        onClick={() => handleDeclineClick(request, 'topup')}
                        style={{
                          backgroundColor: secondaryColor,
                          color: 'white',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Withdrawal Requests */}
        <div>
          <h5 className="mb-4 fw-bold" style={{ color: primaryDarkColor }}>Pending Withdrawal Requests</h5>
          
          {withdrawRequests.length === 0 ? (
            <div className="alert alert-info">
              No pending withdrawal requests
            </div>
          ) : (
            <div className="row g-3">
              {withdrawRequests.map(request => (
                <div key={request._id} className="col-md-6">
                  <div 
                    className="card border-0 shadow-sm p-3" 
                    style={{ borderRadius: '10px', backgroundColor: 'rgba(255, 82, 82, 0.05)' }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold" style={{ color: primaryDarkColor }}>Amount: ₹{request.amount}</span>
                      <span className="badge bg-warning text-dark">Pending</span>
                    </div>
                    
                    <div className="mb-2">
                      <span className="fw-medium">Created: </span>
                      <span>{new Date(request.createdAt).toLocaleString()}</span>
                    </div>
                    
                    {request.updatedAt && (
                      <div className="mb-3">
                        <span className="fw-medium">Updated: </span>
                        <span>{new Date(request.updatedAt).toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-sm flex-grow-1"
                        onClick={() => handleApproveClick(request, 'withdraw')}
                        style={{
                          backgroundColor: successColor,
                          color: 'white',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn btn-sm flex-grow-1"
                        onClick={() => handleDeclineClick(request, 'withdraw')}
                        style={{
                          backgroundColor: secondaryColor,
                          color: 'white',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProductPurchases = () => {
    if (loadingPurchases || loadingApprovedPurchases) {
      return (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border" style={{ color: primaryColor }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    return (
      <div>
        {/* Pending Product Purchase Requests */}
        <div className="mb-5">
          <h5 className="mb-4 fw-bold" style={{ color: primaryDarkColor }}>Pending Product Purchase Requests</h5>
          
          {purchaseRequests.length === 0 ? (
            <div className="alert alert-info">
              No pending product purchase requests
            </div>
          ) : (
            <div className="row g-3">
              {purchaseRequests.map(request => (
                <div key={request._id} className="col-md-6">
                  <div 
                    className="card border-0 shadow-sm p-3" 
                    style={{ borderRadius: '10px', backgroundColor: 'rgba(255, 193, 7, 0.05)' }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold" style={{ color: primaryDarkColor }}>
                        {request.productName} (Code: {request.productCode})
                      </span>
                      <span className="badge bg-warning text-dark">Pending</span>
                    </div>
                    
                    <div className="mb-2">
                      <span className="fw-medium">Quantity: </span>
                      <span>{request.quantity}</span>
                    </div>
                    
                    <div className="mb-2">
                      <span className="fw-medium">Unit Price: </span>
                      <span>₹{request.unitPrice}</span>
                    </div>
                    
                    <div className="mb-2">
                      <span className="fw-medium">Total Price: </span>
                      <span className="fw-bold" style={{ color: primaryColor }}>₹{request.totalPrice}</span>
                    </div>
                    
                    <div className="mb-2">
                      <span className="fw-medium">Requested At: </span>
                      <span>{new Date(request.requestedAt).toLocaleString()}</span>
                    </div>
                    
                    {request.shippingAddress && (
                      <div className="mb-3">
                        <span className="fw-medium">Shipping Address: </span>
                        <span>{request.shippingAddress}</span>
                      </div>
                    )}
                    
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-sm flex-grow-1"
                        onClick={() => handleApproveClick(request, 'purchase')}
                        style={{
                          backgroundColor: successColor,
                          color: 'white',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn btn-sm flex-grow-1"
                        onClick={() => handleDeclineClick(request, 'purchase')}
                        style={{
                          backgroundColor: secondaryColor,
                          color: 'white',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approved Product Purchases */}
        <div>
          <h5 className="mb-4 fw-bold" style={{ color: primaryDarkColor }}>Approved Product Purchases</h5>
          
          {approvedPurchases.length === 0 ? (
            <div className="alert alert-info">
              No approved product purchases
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Product</th>
                    <th>Code</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedPurchases.map((purchase) => (
                    <tr key={purchase._id}>
                      <td>{purchase.productName}</td>
                      <td>{purchase.productCode}</td>
                      <td>{purchase.quantity}</td>
                      <td>₹{purchase.unitPrice}</td>
                      <td>₹{purchase.totalPrice}</td>
                      <td>{getStatusBadge(purchase.status)}</td>
                      <td>{new Date(purchase.requestedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout title="User Details">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <div className="spinner-border" style={{ color: primaryColor }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout title="User Details">
        <div
          className="alert py-2 px-3 mb-0"
          style={{
            borderRadius: '10px',
            borderLeft: `4px solid ${secondaryColor}`,
            backgroundColor: 'rgba(255, 82, 82, 0.1)',
            color: secondaryColor,
            fontWeight: 'bold'
          }}
        >
          User not found.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`User: ${user.name}`}>
      {/* Approval Confirmation Modal */}
      {showApproveModal && (
        <div 
          className="modal"
          style={{
            display: 'block',
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050
          }}
        >
          <div 
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: '500px' }}
          >
            <div 
              className="modal-content"
              style={{
                borderRadius: '15px',
                overflow: 'hidden',
                border: 'none',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }}
            >
              <div 
                className="modal-header"
                style={{
                  backgroundColor: primaryColor,
                  color: 'white',
                  borderBottom: 'none'
                }}
              >
                <h5 className="modal-title">Confirm Approval</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowApproveModal(false)}
                  style={{ filter: 'invert(1)' }}
                ></button>
              </div>
              <div className="modal-body py-4">
                <p className="fs-5 mb-0 text-center">
                  Are you sure you want to approve this request?
                </p>
                {currentRequest && (
                  <div className="mt-3 text-center">
                    {currentRequest.type === 'purchase' ? (
                      <>
                        <p className="mb-1">
                          <strong>Product:</strong> {currentRequest.productName} (Code: {currentRequest.productCode})
                        </p>
                        <p className="mb-1">
                          <strong>Quantity:</strong> {currentRequest.quantity}
                        </p>
                        <p className="mb-1">
                          <strong>Unit Price:</strong> ₹{currentRequest.unitPrice}
                        </p>
                        <p className="mb-0">
                          <strong>Total Price:</strong> ₹{currentRequest.totalPrice}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="mb-1">
                          <strong>Amount:</strong> ₹{currentRequest.amount}
                        </p>
                        <p className="mb-0">
                          <strong>Type:</strong> {currentRequest.type === 'topup' ? 'Top-up' : 'Withdrawal'}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div 
                className="modal-footer"
                style={{ borderTop: 'none' }}
              >
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowApproveModal(false)}
                  style={{
                    borderRadius: '8px',
                    padding: '8px 20px',
                    backgroundColor: secondaryColor,
                    border: 'none'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn"
                  onClick={approveRequest}
                  style={{
                    borderRadius: '8px',
                    padding: '8px 20px',
                    backgroundColor: successColor,
                    color: 'white',
                    border: 'none'
                  }}
                >
                  Yes, Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decline Confirmation Modal */}
      {showDeclineModal && (
        <div 
          className="modal"
          style={{
            display: 'block',
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050
          }}
        >
          <div 
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: '500px' }}
          >
            <div 
              className="modal-content"
              style={{
                borderRadius: '15px',
                overflow: 'hidden',
                border: 'none',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }}
            >
              <div 
                className="modal-header"
                style={{
                  backgroundColor: secondaryColor,
                  color: 'white',
                  borderBottom: 'none'
                }}
              >
                <h5 className="modal-title">Confirm Decline</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDeclineModal(false)}
                  style={{ filter: 'invert(1)' }}
                ></button>
              </div>
              <div className="modal-body py-4">
                <p className="fs-5 mb-0 text-center">
                  Are you sure you want to decline this request?
                </p>
                {currentRequest && (
                  <div className="mt-3 text-center">
                    {currentRequest.type === 'purchase' ? (
                      <>
                        <p className="mb-1">
                          <strong>Product:</strong> {currentRequest.productName} (Code: {currentRequest.productCode})
                        </p>
                        <p className="mb-1">
                          <strong>Quantity:</strong> {currentRequest.quantity}
                        </p>
                        <p className="mb-1">
                          <strong>Unit Price:</strong> ₹{currentRequest.unitPrice}
                        </p>
                        <p className="mb-0">
                          <strong>Total Price:</strong> ₹{currentRequest.totalPrice}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="mb-1">
                          <strong>Amount:</strong> ₹{currentRequest.amount}
                        </p>
                        <p className="mb-0">
                          <strong>Type:</strong> {currentRequest.type === 'topup' ? 'Top-up' : 'Withdrawal'}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div 
                className="modal-footer"
                style={{ borderTop: 'none' }}
              >
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowDeclineModal(false)}
                  style={{
                    borderRadius: '8px',
                    padding: '8px 20px',
                    backgroundColor: primaryColor,
                    border: 'none'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn"
                  onClick={declineRequest}
                  style={{
                    borderRadius: '8px',
                    padding: '8px 20px',
                    backgroundColor: secondaryColor,
                    color: 'white',
                    border: 'none'
                  }}
                >
                  Yes, Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="mb-4">
        <button
          className="btn btn-sm"
          onClick={() => router.back()}
          style={{
            backgroundColor: 'white',
            color: primaryDarkColor,
            border: `1px solid ${primaryColor}`,
            borderRadius: '8px',
            padding: '8px 15px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = primaryColor}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
        >
          <i className="bi bi-arrow-left me-2" style={{ color: primaryDarkColor }} />
          <span style={{ color: primaryDarkColor }}>Back to Users</span>
        </button>
      </div>

      <div className="row">
        {/* User Profile Card */}
        <div className="col-md-4 mb-4">
          <div
            className="card shadow-sm"
            style={{
              border: 'none',
              borderRadius: '15px',
              overflow: 'hidden',
              background: 'white',
              boxShadow: '0 10px 25px rgba(58, 134, 255, 0.1)'
            }}
          >
            <div
              className="card-header text-white text-center py-4"
              style={{
                background: cardGradient,
                borderTopLeftRadius: '15px',
                borderTopRightRadius: '15px'
              }}
            >
              <div
                className="bg-white rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                style={{ width: '100px', height: '100px', boxShadow: '0 0 15px rgba(0,0,0,0.2)' }}
              >
                <i className="bi bi-person-circle fs-1" style={{ color: primaryDarkColor }}></i>
              </div>
              <h4 className="mt-3 mb-1 fw-bold">{user.name}</h4>
              <p className="mb-1" style={{ opacity: 0.9 }}>{user.email}</p>
              <span
                className="badge fw-medium"
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  backgroundColor: user.isActive ? successColor : secondaryColor,
                  color: 'white',
                  marginTop: '5px'
                }}
              >
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="card-body p-4">
              <h6 className="text-uppercase mb-3 fw-bold" style={{ color: primaryDarkColor, opacity: 0.8 }}>
                Account Information
              </h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2 d-flex justify-content-between align-items-center">
                  <span className="fw-medium" style={{ color: textColor }}>Phone:</span>
                  <span style={{ color: textColor, opacity: 0.8 }}>{user.phone || 'N/A'}</span>
                </li>
                <li className="mb-2 d-flex justify-content-between align-items-center">
                  <span className="fw-medium" style={{ color: textColor }}>Joined:</span>
                  <span style={{ color: textColor, opacity: 0.8 }}>{new Date(user.createdAt).toLocaleDateString()}</span>
                </li>
                <li className="mb-2 d-flex justify-content-between align-items-center">
                  <span className="fw-medium" style={{ color: textColor }}>Status:</span>
                  <span style={{ color: textColor, opacity: 0.8 }}>{user.status}</span>
                </li>
                <li className="mb-2 d-flex justify-content-between align-items-center">
                  <span className="fw-medium" style={{ color: textColor }}>Rank:</span>
                  <span className="badge" style={{ backgroundColor: primaryColor, color: 'white', borderRadius: '15px', padding: '4px 10px' }}>
                    {user.rank || 'Member'}
                  </span>
                </li>
                <li className="mb-2 d-flex justify-content-between align-items-center">
                  <span className="fw-medium" style={{ color: textColor }}>Balance:</span>
                  <span className="fw-bold" style={{ color: primaryColor }}>₹{user.balance?.toFixed(2) || '0.00'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* User Details Tabs */}
        <div className="col-md-8">
          <div
            className="card shadow-sm"
            style={{
              border: 'none',
              borderRadius: '15px',
              boxShadow: '0 10px 25px rgba(58, 134, 255, 0.1)'
            }}
          >
            <div
              className="card-header"
              style={{
                backgroundColor: 'white',
                borderBottom: `1px solid ${lightBackground}`,
                borderTopLeftRadius: '15px',
                borderTopRightRadius: '15px'
              }}
            >
              <ul className="nav nav-tabs card-header-tabs" style={{ borderBottom: 'none' }}>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 'referral' ? 'active' : ''}`}
                    href="#"
                    onClick={(e) => { e.preventDefault(); setActiveTab('referral'); }}
                    style={{
                      color: activeTab === 'referral' ? primaryDarkColor : textColor,
                      borderColor: activeTab === 'referral' ? `transparent transparent ${primaryColor} transparent` : 'transparent',
                      borderWidth: '2px',
                      fontWeight: activeTab === 'referral' ? 'bold' : 'normal',
                      backgroundColor: 'transparent',
                      opacity: activeTab === 'referral' ? 1 : 0.7
                    }}
                  >
                    Referral Info
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`}
                    href="#"
                    onClick={(e) => { e.preventDefault(); setActiveTab('transactions'); }}
                    style={{
                      color: activeTab === 'transactions' ? primaryDarkColor : textColor,
                      borderColor: activeTab === 'transactions' ? `transparent transparent ${primaryColor} transparent` : 'transparent',
                      borderWidth: '2px',
                      fontWeight: activeTab === 'transactions' ? 'bold' : 'normal',
                      backgroundColor: 'transparent',
                      opacity: activeTab === 'transactions' ? 1 : 0.7
                    }}
                  >
                    Transactions
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
                    href="#"
                    onClick={(e) => { e.preventDefault(); setActiveTab('products'); }}
                    style={{
                      color: activeTab === 'products' ? primaryDarkColor : textColor,
                      borderColor: activeTab === 'products' ? `transparent transparent ${primaryColor} transparent` : 'transparent',
                      borderWidth: '2px',
                      fontWeight: activeTab === 'products' ? 'bold' : 'normal',
                      backgroundColor: 'transparent',
                      opacity: activeTab === 'products' ? 1 : 0.7
                    }}
                  >
                    Product Purchases
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                    href="#"
                    onClick={(e) => { e.preventDefault(); setActiveTab('settings'); }}
                    style={{
                      color: activeTab === 'settings' ? primaryDarkColor : textColor,
                      borderColor: activeTab === 'settings' ? `transparent transparent ${primaryColor} transparent` : 'transparent',
                      borderWidth: '2px',
                      fontWeight: activeTab === 'settings' ? 'bold' : 'normal',
                      backgroundColor: 'transparent',
                      opacity: activeTab === 'settings' ? 1 : 0.7
                    }}
                  >
                    Settings
                  </a>
                </li>
              </ul>
            </div>
            <div className="card-body p-4">
              {activeTab === 'referral' ? (
                <>
                  {/* Referral Information */}
                  <div>
                    <h5 className="mb-4 fw-bold" style={{ color: primaryDarkColor }}>Referral Information</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div
                          className="border rounded p-3"
                          style={{
                            borderColor: lightBackground,
                            backgroundColor: 'white',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                            borderRadius: '10px'
                          }}
                        >
                          <h6 className="text-uppercase mb-2 small" style={{ color: textColor, opacity: 0.7 }}>
                            Referred By
                          </h6>
                          <p className="mb-0 fw-medium" style={{ color: primaryColor }}>
                            {user.parentId?.name || 'Root User'}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div
                          className="border rounded p-3"
                          style={{
                            borderColor: lightBackground,
                            backgroundColor: 'white',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                            borderRadius: '10px'
                          }}
                        >
                          <h6 className="text-uppercase mb-2 small" style={{ color: textColor, opacity: 0.7 }}>
                            Referral Codes
                          </h6>
                          <p className="mb-1" style={{ color: textColor }}>
                            <span className="fw-medium">Left:</span> {user.referralCodeLeft || 'N/A'}
                          </p>
                          <p className="mb-0" style={{ color: textColor }}>
                            <span className="fw-medium">Right:</span> {user.referralCodeRight || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bank Details Section */}
                  <div className="mt-4">
                    <h6 className="text-uppercase mb-3 fw-bold" style={{ color: primaryDarkColor, opacity: 0.8 }}>
                      Bank Information
                    </h6>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2 d-flex justify-content-between align-items-center">
                        <span className="fw-medium" style={{ color: textColor }}>Account Number:</span>
                        <span style={{ color: textColor, opacity: 0.8 }}>
                          {user.bankDetails?.accountNumber || 'N/A'}
                        </span>
                      </li>
                      <li className="mb-2 d-flex justify-content-between align-items-center">
                        <span className="fw-medium" style={{ color: textColor }}>Bank Name:</span>
                        <span style={{ color: textColor, opacity: 0.8 }}>
                          {user.bankDetails?.bankName || 'N/A'}
                        </span>
                      </li>
                      <li className="mb-2 d-flex justify-content-between align-items-center">
                        <span className="fw-medium" style={{ color: textColor }}>Account Number:</span>
                        <span style={{ color: textColor, opacity: 0.8 }}>
                          {user.bankDetails?.accountNumber 
                            ? `****${user.bankDetails.accountNumber.toString().slice(-4)}` 
                            : 'N/A'}
                        </span>
                      </li>
                      <li className="d-flex justify-content-between align-items-center">
                        <span className="fw-medium" style={{ color: textColor }}>IFSC Code:</span>
                        <span style={{ color: textColor, opacity: 0.8 }}>
                          {user.bankDetails?.ifscCode || 'N/A'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </>
              ) : activeTab === 'transactions' ? (
                renderTransactions()
              ) : activeTab === 'products' ? (
                renderProductPurchases()
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-gear fs-1 mb-3" style={{ color: primaryColor }}></i>
                  <h5 style={{ color: primaryDarkColor }}>User Settings</h5>
                  <p className="text-muted">User settings will be available soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}