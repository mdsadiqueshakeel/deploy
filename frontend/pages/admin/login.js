// import Head from 'next/head';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import api from '../../utils/api';

// export default function AdminLogin() {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       require('bootstrap/dist/js/bootstrap.bundle.min');
//     }
//   }, []);

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError('');
//   try {
//     const response = await api.post('/api/admin/login', { email, password });
//     localStorage.setItem('adminToken', response.data.token); // Store token in localStorage
//     router.push('/admin/dashboard');
//   } catch (error) {
//     setError(error.response?.data?.message || 'Login failed. Please try again.');
//   }
// };

//   const handleUserLogin = () => {
//     router.push('/auth/login');
//   };

//   return (
//     <>
//       <Head>
//         <title>Admin Login</title>
//         <link 
//           href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
//           rel="stylesheet"
//         />
//       </Head>
      
//       <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center" style={{ 
//         backgroundColor: '#FFFFFF',
//         backgroundImage: 'radial-gradient(circle at 90% 20%, rgba(58, 134, 255, 0.1) 0%, rgba(10, 36, 99, 0.1) 90%)'
//       }}>
//         <div className="text-center mb-4">
//           <h1 className="fw-bold display-4" style={{ 
//             color: '#0A2463',
//             textShadow: '2px 2px 4px rgba(58, 134, 255, 0.3)',
//             letterSpacing: '2px'
//           }}>
//             GROWTHAFFINITY <span style={{ color: '#3A86FF' }}></span>
//           </h1>
//           <p className="lead" style={{ 
//             color: '#0A2463',
//             fontWeight: '500',
//             textShadow: '1px 1px 2px rgba(0, 245, 255, 0.2)'
//           }}>
//             Admin Portal - Restricted Access
//           </p>
//         </div>

//         <div className="card p-4 shadow-lg" style={{ 
//           width: '100%', 
//           maxWidth: '400px',
//           backgroundColor: 'white',
//           border: 'none',
//           borderRadius: '15px',
//           boxShadow: '0 10px 25px rgba(58, 134, 255, 0.2)',
//           transition: 'transform 0.3s, box-shadow 0.3s'
//         }}>
//           <div className="dropdown mb-3">
//             <button 
//               className="btn dropdown-toggle w-100 py-3" 
//               style={{ 
//                 background: 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '10px',
//                 fontWeight: '600',
//                 letterSpacing: '1px',
//                 boxShadow: '0 4px 15px rgba(58, 134, 255, 0.4)',
//                 transition: 'all 0.3s ease'
//               }}
//               type="button" 
//               id="adminLoginDropdown"
//               data-bs-toggle="dropdown"
//               aria-expanded="false"
//               onMouseEnter={(e) => {
//                 e.target.style.boxShadow = '0 6px 20px rgba(58, 134, 255, 0.6)';
//                 e.target.style.background = 'linear-gradient(135deg, #0A2463 0%, #3A86FF 100%)';
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.boxShadow = '0 4px 15px rgba(58, 134, 255, 0.4)';
//                 e.target.style.background = 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)';
//               }}
//             >
//               Admin Login
//             </button>
//             <ul className="dropdown-menu w-100" aria-labelledby="adminLoginDropdown" style={{
//               border: 'none',
//               borderRadius: '10px',
//               boxShadow: '0 10px 25px rgba(58, 134, 255, 0.2)'
//             }}>
//               <li>
//                 <button 
//                   className="dropdown-item py-2" 
//                   onClick={handleUserLogin}
//                   style={{ 
//                     color: '#0A2463',
//                     fontWeight: '500',
//                     transition: 'all 0.2s'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.color = '#3A86FF';
//                     e.target.style.backgroundColor = 'rgba(58, 134, 255, 0.1)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.color = '#0A2463';
//                     e.target.style.backgroundColor = 'transparent';
//                   }}
//                 >
//                   User Login
//                 </button>
//               </li>
//               <li>
//                 <button 
//                   className="dropdown-item py-2" 
//                   style={{ 
//                     color: '#0A2463',
//                     fontWeight: '500',
//                     transition: 'all 0.2s'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.color = '#3A86FF';
//                     e.target.style.backgroundColor = 'rgba(58, 134, 255, 0.1)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.color = '#0A2463';
//                     e.target.style.backgroundColor = 'transparent';
//                   }}
//                 >
//                   Admin Login
//                 </button>
//               </li>
//             </ul>
//           </div>
          
//           <form onSubmit={handleSubmit}>
//             {error && (
//               <div className="alert alert-danger" role="alert" style={{
//                 borderRadius: '10px',
//                 borderLeft: '4px solid #3A86FF',
//                 backgroundColor: 'rgba(255, 82, 82, 0.1)'
//               }}>
//                 {error}
//               </div>
//             )}
//             <div className="mb-4">
//               <input 
//                 type="text" 
//                 className="form-control py-3" 
//                 placeholder="Admin Email"
//                 style={{ 
//                   border: '2px solid #E0E0E0',
//                   borderRadius: '10px',
//                   color: '#0A2463',
//                   backgroundColor: '#F5F5F5',
//                   transition: 'all 0.3s'
//                 }}
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <input 
//                 type="password" 
//                 className="form-control py-3" 
//                 placeholder="Admin Password"
//                 style={{ 
//                   border: '2px solid #E0E0E0',
//                   borderRadius: '10px',
//                   color: '#0A2463',
//                   backgroundColor: '#F5F5F5',
//                   transition: 'all 0.3s'
//                 }}
//                 value={password}
//                 onChange={e => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <button 
//               type="submit" 
//               className="btn w-100 py-3 mb-3"
//               style={{ 
//                 background: 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '10px',
//                 fontWeight: '600',
//                 letterSpacing: '1px',
//                 boxShadow: '0 4px 15px rgba(58, 134, 255, 0.4)',
//                 transition: 'all 0.3s ease',
//               }}
//             >
//               ADMIN LOGIN
//             </button>
//           </form>
          
//           <div className="text-center mt-3">
//             <Link 
//               href="/admin/forgot-credentials" 
//               className="text-decoration-none small fw-medium"
//               style={{ 
//                 color: '#0A2463',
//                 transition: 'all 0.2s',
//                 display: 'inline-block'
//               }}
//             >
//               Forget admin credentials? →
//             </Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import api from '../../utils/api';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/api/admin/login', { email, password });
      localStorage.setItem('adminToken', response.data.token);
      router.push('/admin/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleUserLogin = () => {
    router.push('/auth/login');
  };

  return (
    <>
      <Head>
        <title>Admin Login</title>
      </Head>
      
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center" style={{ 
        backgroundColor: '#FFFFFF',
        backgroundImage: 'radial-gradient(circle at 90% 20%, rgba(58, 134, 255, 0.1) 0%, rgba(10, 36, 99, 0.1) 90%)'
      }}>
        <div className="text-center mb-4">
          <h1 className="fw-bold display-4" style={{ 
            color: '#0A2463',
            textShadow: '2px 2px 4px rgba(58, 134, 255, 0.3)',
            letterSpacing: '2px'
          }}>
            GROWTHAFFINITY
          </h1>
          <p className="lead" style={{ 
            color: '#0A2463',
            fontWeight: '500',
            textShadow: '1px 1px 2px rgba(0, 245, 255, 0.2)'
          }}>
            Admin Portal - Restricted Access
          </p>
        </div>

        <div className="card p-4 shadow-lg" style={{ 
          width: '100%', 
          maxWidth: '400px',
          backgroundColor: 'white',
          border: 'none',
          borderRadius: '15px',
          boxShadow: '0 10px 25px rgba(58, 134, 255, 0.2)'
        }}>
          <div className="dropdown mb-3">
            <button 
              className="btn dropdown-toggle w-100 py-3" 
              style={{ 
                background: 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                letterSpacing: '1px',
                boxShadow: '0 4px 15px rgba(58, 134, 255, 0.4)'
              }}
              type="button" 
              id="adminLoginDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Admin Login
            </button>
            <ul className="dropdown-menu w-100" aria-labelledby="adminLoginDropdown">
              <li>
                <button 
                  className="dropdown-item py-2" 
                  onClick={handleUserLogin}
                  style={{ color: '#0A2463', fontWeight: '500' }}
                >
                  User Login
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item py-2" 
                  style={{ color: '#0A2463', fontWeight: '500' }}
                >
                  Admin Login
                </button>
              </li>
            </ul>
          </div>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <div className="mb-4">
              <input 
                type="text" 
                className="form-control py-3" 
                placeholder="Admin Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <input 
                type="password" 
                className="form-control py-3" 
                placeholder="Admin Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn w-100 py-3 mb-3"
              style={{ 
                background: 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                letterSpacing: '1px',
                boxShadow: '0 4px 15px rgba(58, 134, 255, 0.4)'
              }}
            >
              ADMIN LOGIN
            </button>
          </form>
          
          <div className="text-center mt-3">
            <Link 
              href="/admin/forgot-credentials" 
              className="text-decoration-none small fw-medium"
              style={{ color: '#0A2463' }}
            >
              Forget admin credentials? →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}