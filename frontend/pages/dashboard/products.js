
// import { useEffect, useState } from 'react';
// import styles from './Products.module.css';
// import Image from 'next/image';
// import api from '../../utils/api';

// const products = [
//   {
//     productCode: 1025,
//     name: 'Neem Extract',
//     dp: 350,
//     mrp: 500,
//     image: '/assets/images/i1.png',
//   },
//   {
//     productCode: 8014,
//     name: 'Mix Multi Berries Capsules',
//     dp: 520,
//     mrp: 700,
//     image: '/assets/images/i2.png',
//   },
//   {
//     productCode: 1103,
//     name: 'Tropica Multifruits Face Wash',
//     dp: 160,
//     mrp: 250,
//     image: '/assets/images/i3.png',
//   },
//   {
//     productCode: 2065,
//     name: 'Coconut & Aloe-Vera Hair Oil',
//     dp: 280,
//     mrp: 350,
//     image: '/assets/images/i4.jpg',
//   },
//   {
//     productCode: 1145,
//     name: 'Onion & Blackseed Shampoo',
//     dp: 300,
//     mrp: 400,
//     image: '/assets/images/i5.jpg',
//   },
//   {
//     productCode: 1001,
//     name: 'Aloe-Vera Extract',
//     dp: 350,
//     mrp: 500,
//     image: '/assets/images/i6.jpg',
//   },
// ];

// export default function Products({ searchQuery }) {
//   const [purchaseError, setPurchaseError] = useState('');
//   const [purchaseSuccess, setPurchaseSuccess] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const cards = document.querySelectorAll(`.${styles.productCard}`);
//     cards.forEach((card, index) => {
//       card.style.animationDelay = `${index * 0.1}s`;
//       card.classList.add(styles.fadeInUp);
//     });
//   }, [searchQuery]);

//   const handleBuyClick = (product) => {
//     setSelectedProduct(product);
//     setQuantity(1);
//     setIsModalOpen(true);
//     setPurchaseError('');
//   };

//   const handleQuantityChange = (e) => {
//     const value = parseInt(e.target.value);
//     if (!isNaN(value) && value > 0) {
//       setQuantity(value);
//     }
//   };

//  const handlePurchase = async () => {
//   if (!selectedProduct || quantity < 1) return;

//   setIsSubmitting(true);
//   setPurchaseError('');
//   setPurchaseSuccess('');

//   try {
//     let userId = null;
//     const savedUser = localStorage.getItem('userProfileData');

//     if (savedUser) {
//       const parsed = JSON.parse(savedUser);
//       if (parsed._id) userId = parsed._id;
//       else if (parsed.basicInfo && parsed.basicInfo._id) userId = parsed.basicInfo._id;
//     }

//     // Fallback: fetch profile if localStorage data is missing or incomplete
//     if (!userId) {
//       const { fetchProfile } = await import('../../utils/profileService');
//       const profile = await fetchProfile();
//       userId = profile?.basicInfo?._id;
//     }

//     if (!userId) {
//       throw new Error("Could not identify your account. Please contact support.");
//     }

//     const totalAmount = selectedProduct.dp * quantity;

//     const purchaseData = {
//       productCode: selectedProduct.productCode,
//       productName: selectedProduct.name,
//       quantity: quantity,
//       amount: totalAmount,
//       note: `Purchase request for ${quantity} ${selectedProduct.name}`,
//       userId: userId
//     };

//     const response = await api.post('/api/purchase/products/request', purchaseData);

//     if (response.status === 201) {
//   const successMessage = response.data?.message || 'Purchase request submitted successfully';
//   setPurchaseSuccess(successMessage);
//   setTimeout(() => {
//     setPurchaseSuccess('');
//     setIsModalOpen(false);
//   }, 3000);
// } else {
//   throw new Error(response.data?.message || 'Purchase request failed');
// }
//   } catch (error) {
//     console.error("Purchase error:", error);
//     setPurchaseError(error.response?.data?.message || error.message || 'Failed to process purchase');
//     setTimeout(() => setPurchaseError(''), 3000);
//   } finally {
//     setIsSubmitting(false);
//   }
// };


//   const filteredProducts = products.filter((product) =>
//     product.name.toLowerCase().includes((searchQuery || '').toLowerCase())
//   );

//   return (
//     <div className="container-fluid py-4">
//       <h1 className="mb-5 fw-bold" style={{ color: '#0A2463', textShadow: '1px 1px 2px rgba(0, 245, 255, 0.2)' }}>
//         Our Product Collection 🧴✨
//       </h1>

//       {purchaseError && (
//         <div className="alert alert-danger position-fixed top-0 start-50 translate-middle mt-3"
//           style={{ zIndex: 2000, minWidth: '300px' }}>
//           {purchaseError}
//         </div>
//       )}
      
//       {purchaseSuccess && (
//         <div className="alert alert-success position-fixed top-0 start-50 translate-middle mt-3"
//           style={{ zIndex: 2000, minWidth: '300px' }}>
//           {purchaseSuccess}
//         </div>
//       )}

//       {/* Purchase Modal */}
//       {isModalOpen && selectedProduct && (
//         <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content" style={{ borderRadius: '15px', overflow: 'hidden' }}>
//               <div className="modal-header" style={{ backgroundColor: '#0A2463', color: 'white' }}>
//                 <h5 className="modal-title">Purchase {selectedProduct.name}</h5>
//                 <button 
//                   type="button" 
//                   className="btn-close btn-close-white"
//                   onClick={() => setIsModalOpen(false)}
//                   disabled={isSubmitting}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <div className="d-flex mb-4">
//                   <Image
//                     src={selectedProduct.image}
//                     alt={selectedProduct.name}
//                     width={100}
//                     height={100}
//                     className="rounded me-3"
//                     style={{ objectFit: 'cover' }}
//                   />
//                   <div>
//                     <h5>{selectedProduct.name}</h5>
//                     <p className="mb-1">
//                       <strong>DP Price:</strong> ₹{selectedProduct.dp}
//                     </p>
//                     <p className="mb-1">
//                       <strong>Product Code:</strong> {selectedProduct.productCode}
//                     </p>
//                   </div>
//                 </div>
                
//                 <div className="mb-3">
//                   <label className="form-label fw-medium">Quantity:</label>
//                   <div className="d-flex align-items-center">
//                     <button 
//                       className="btn btn-outline-primary me-2"
//                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                       disabled={quantity <= 1 || isSubmitting}
//                     >
//                       -
//                     </button>
//                     <input
//                       type="number"
//                       className="form-control text-center"
//                       value={quantity}
//                       onChange={handleQuantityChange}
//                       min="1"
//                       style={{ maxWidth: '70px' }}
//                       disabled={isSubmitting}
//                     />
//                     <button 
//                       className="btn btn-outline-primary ms-2"
//                       onClick={() => setQuantity(quantity + 1)}
//                       disabled={isSubmitting}
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>
                
//                 <div className="alert alert-info">
//                   <p className="mb-0">
//                     <strong>Total Cost:</strong> ₹{selectedProduct.dp * quantity}
//                   </p>  
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button 
//                   type="button" 
//                   className="btn btn-secondary"
//                   onClick={() => setIsModalOpen(false)}
//                   disabled={isSubmitting}
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="button" 
//                   className="btn btn-primary"
//                   onClick={handlePurchase}
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                       Processing...
//                     </>
//                   ) : (
//                     'Confirm Purchase'
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {filteredProducts.length > 0 ? (
//         <div className="row g-4">
//           {filteredProducts.map((product) => (
//             <div key={product.productCode} className="col-12 col-sm-6 col-md-4 col-lg-3">
//               <div className={`card h-100 ${styles.productCard}`}
//                 style={{
//                   backgroundColor: '#F5F5F5',
//                   border: '2px solid #E0E0E0',
//                   borderRadius: '15px',
//                   boxShadow: '0 10px 25px rgba(58, 134, 255, 0.2)',
//                 }}
//               >
//                 <Image
//                   src={product.image}
//                   className={`card-img-top ${styles.productImage}`}
//                   alt={product.name}
//                   style={{ borderRadius: '15px 15px 0 0', height: '200px', objectFit: 'cover' }}
//                   width={500}
//                   height={200}
//                 />
//                 <div className="card-body d-flex flex-column p-4">
//                   <h5 className="card-title mb-2" style={{ color: '#0A2463', fontWeight: '600' }}>
//                     {product.name}
//                   </h5>
//                   <p className="mb-1 text-muted" style={{ fontSize: '0.9rem' }}>
//                     <strong>Product Code:</strong> {product.productCode}
//                   </p>
//                   <p className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
//                     <strong>MRP:</strong> ₹{product.mrp} / <strong>DP:</strong> ₹{product.dp}
//                   </p>

//                   <button
//                     onClick={() => handleBuyClick(product)}
//                     className="btn mt-auto"
//                     style={{
//                       background: 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '10px',
//                       fontWeight: '600',
//                       letterSpacing: '1px',
//                       boxShadow: '0 4px 15px rgba(58, 134, 255, 0.4)',
//                       transition: 'all 0.3s ease',
//                       position: 'relative',
//                       overflow: 'hidden',
//                       cursor: 'pointer',
//                     }}
//                     onMouseEnter={(e) => {
//                       e.target.style.boxShadow = '0 6px 20px rgba(58, 134, 255, 0.6)';
//                       e.target.style.transform = 'translateY(-2px)';
//                     }}
//                     onMouseLeave={(e) => {
//                       e.target.style.boxShadow = '0 4px 15px rgba(58, 134, 255, 0.4)';
//                       e.target.style.transform = 'translateY(0)';
//                     }}
//                   >
//                     <span style={{ position: 'relative', zIndex: '2' }}>
//                       Buy Now (₹{product.dp})
//                     </span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center">
//           <p style={{ color: '#0A2463', fontSize: '1.1rem' }}>
//             No products found matching &quot;{searchQuery}&quot;.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import styles from './Products.module.css';
import Image from 'next/image';
import api from '../../utils/api';

const products = [
  {
    productCode: 1025,
    name: 'Neem Extract',
    dp: 350,
    mrp: 500,
    image: '/assets/images/i1.png',
  },
  {
    productCode: 8014,
    name: 'Mix Multi Berries Capsules',
    dp: 520,
    mrp: 700,
    image: '/assets/images/i2.png',
  },
  {
    productCode: 1103,
    name: 'Tropica Multifruits Face Wash',
    dp: 160,
    mrp: 250,
    image: '/assets/images/i3.png',
  },
  {
    productCode: 2065,
    name: 'Coconut & Aloe-Vera Hair Oil',
    dp: 280,
    mrp: 350,
    image: '/assets/images/i4.jpg',
  },
  {
    productCode: 1145,
    name: 'Onion & Blackseed Shampoo',
    dp: 300,
    mrp: 400,
    image: '/assets/images/i5.jpg',
  },
  {
    productCode: 1001,
    name: 'Aloe-Vera Extract',
    dp: 350,
    mrp: 500,
    image: '/assets/images/i6.jpg',
  },
];

export default function Products({ searchQuery }) {
  const [purchaseError, setPurchaseError] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const cards = document.querySelectorAll(`.${styles.productCard}`);
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add(styles.fadeInUp);
    });

    // Fetch purchase history when component mounts
    fetchPurchaseHistory();
  }, [searchQuery]);

  const fetchPurchaseHistory = async () => {
    setLoadingHistory(true);
    try {
      let userId = null;
      const savedUser = localStorage.getItem('userProfileData');

      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed._id) userId = parsed._id;
        else if (parsed.basicInfo && parsed.basicInfo._id) userId = parsed.basicInfo._id;
      }

      // Fallback: fetch profile if localStorage data is missing or incomplete
      if (!userId) {
        const { fetchProfile } = await import('../../utils/profileService');
        const profile = await fetchProfile();
        userId = profile?.basicInfo?._id;
      }

      if (userId) {
        const response = await api.get(`/api/purchase/products/admin/user/${userId}/pending-purchases`);
        setPurchaseHistory(response.data);
      }
    } catch (error) {
      console.error('Error fetching purchase history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleBuyClick = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsModalOpen(true);
    setPurchaseError('');
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handlePurchase = async () => {
    if (!selectedProduct || quantity < 1) return;

    setIsSubmitting(true);
    setPurchaseError('');
    setPurchaseSuccess('');

    try {
      let userId = null;
      const savedUser = localStorage.getItem('userProfileData');

      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed._id) userId = parsed._id;
        else if (parsed.basicInfo && parsed.basicInfo._id) userId = parsed.basicInfo._id;
      }

      // Fallback: fetch profile if localStorage data is missing or incomplete
      if (!userId) {
        const { fetchProfile } = await import('../../utils/profileService');
        const profile = await fetchProfile();
        userId = profile?.basicInfo?._id;
      }

      if (!userId) {
        throw new Error("Could not identify your account. Please contact support.");
      }

      const totalAmount = selectedProduct.dp * quantity;

      const purchaseData = {
        productCode: selectedProduct.productCode,
        productName: selectedProduct.name,
        quantity: quantity,
        amount: totalAmount,
        note: `Purchase request for ${quantity} ${selectedProduct.name}`,
        userId: userId
      };

      const response = await api.post('/api/purchase/products/request', purchaseData);

      if (response.status === 201) {
        const successMessage = response.data?.message || 'Purchase request submitted successfully';
        setPurchaseSuccess(successMessage);
        // Refresh purchase history after successful purchase
        await fetchPurchaseHistory();
        setTimeout(() => {
          setPurchaseSuccess('');
          setIsModalOpen(false);
        }, 3000);
      } else {
        throw new Error(response.data?.message || 'Purchase request failed');
      }
    } catch (error) {
      console.error("Purchase error:", error);
      setPurchaseError(error.response?.data?.message || error.message || 'Failed to process purchase');
      setTimeout(() => setPurchaseError(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
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

  return (
    <div className="container-fluid py-4">
      <h1 className="mb-5 fw-bold" style={{ color: '#0A2463', textShadow: '1px 1px 2px rgba(0, 245, 255, 0.2)' }}>
        Our Product Collection 🧴✨
      </h1>

      {purchaseError && (
        <div className="alert alert-danger position-fixed top-0 start-50 translate-middle mt-3"
          style={{ zIndex: 2000, minWidth: '300px' }}>
          {purchaseError}
        </div>
      )}
      
      {purchaseSuccess && (
        <div className="alert alert-success position-fixed top-0 start-50 translate-middle mt-3"
          style={{ zIndex: 2000, minWidth: '300px' }}>
          {purchaseSuccess}
        </div>
      )}

      {/* Purchase Modal */}
      {isModalOpen && selectedProduct && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <div className="modal-header" style={{ backgroundColor: '#0A2463', color: 'white' }}>
                <h5 className="modal-title">Purchase {selectedProduct.name}</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                ></button>
              </div>
              <div className="modal-body">
                <div className="d-flex mb-4">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    width={100}
                    height={100}
                    className="rounded me-3"
                    style={{ objectFit: 'cover' }}
                  />
                  <div>
                    <h5>{selectedProduct.name}</h5>
                    <p className="mb-1">
                      <strong>DP Price:</strong> ₹{selectedProduct.dp}
                    </p>
                    <p className="mb-1">
                      <strong>Product Code:</strong> {selectedProduct.productCode}
                    </p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-medium">Quantity:</label>
                  <div className="d-flex align-items-center">
                    <button 
                      className="btn btn-outline-primary me-2"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || isSubmitting}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="form-control text-center"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                      style={{ maxWidth: '70px' }}
                      disabled={isSubmitting}
                    />
                    <button 
                      className="btn btn-outline-primary ms-2"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={isSubmitting}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="alert alert-info">
                  <p className="mb-0">
                    <strong>Total Cost:</strong> ₹{selectedProduct.dp * quantity}
                  </p>  
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handlePurchase}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    'Confirm Purchase'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <div key={product.productCode} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className={`card h-100 ${styles.productCard}`}
                style={{
                  backgroundColor: '#F5F5F5',
                  border: '2px solid #E0E0E0',
                  borderRadius: '15px',
                  boxShadow: '0 10px 25px rgba(58, 134, 255, 0.2)',
                }}
              >
                <Image
                  src={product.image}
                  className={`card-img-top ${styles.productImage}`}
                  alt={product.name}
                  style={{ borderRadius: '15px 15px 0 0', height: '200px', objectFit: 'cover' }}
                  width={500}
                  height={200}
                />
                <div className="card-body d-flex flex-column p-4">
                  <h5 className="card-title mb-2" style={{ color: '#0A2463', fontWeight: '600' }}>
                    {product.name}
                  </h5>
                  <p className="mb-1 text-muted" style={{ fontSize: '0.9rem' }}>
                    <strong>Product Code:</strong> {product.productCode}
                  </p>
                  <p className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
                    <strong>MRP:</strong> ₹{product.mrp} / <strong>DP:</strong> ₹{product.dp}
                  </p>

                  <button
                    onClick={() => handleBuyClick(product)}
                    className="btn mt-auto"
                    style={{
                      background: 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '600',
                      letterSpacing: '1px',
                      boxShadow: '0 4px 15px rgba(58, 134, 255, 0.4)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.boxShadow = '0 6px 20px rgba(58, 134, 255, 0.6)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.boxShadow = '0 4px 15px rgba(58, 134, 255, 0.4)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <span style={{ position: 'relative', zIndex: '2' }}>
                      Buy Now (₹{product.dp})
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p style={{ color: '#0A2463', fontSize: '1.1rem' }}>
            No products found matching &quot;{searchQuery}&quot;.
          </p>
        </div>
      )}

      {/* Purchase History Section */}
      <div className="mt-5">
        <h2 className="mb-4 fw-bold" style={{ color: '#0A2463' }}>Your Purchase History</h2>
        
        {loadingHistory ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : purchaseHistory.length === 0 ? (
          <div className="alert alert-info">
            You haven't made any purchases yet.
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
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {purchaseHistory.map((purchase) => (
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
}