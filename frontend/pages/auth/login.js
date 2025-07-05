// import { useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import Head from 'next/head';
// import api from "../../utils/api";

// export default function Login() {

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   // Initialize Bootstrap dropdown when component mounts
//   if (typeof window !== 'undefined') {
//     require('bootstrap/dist/js/bootstrap.bundle.min');
//   }

//   const handleLogin = async (e) => {
//   e.preventDefault();
  
//   try {
//     const response = await api.post("/api/auth/login", { email, password });
    
//     // No need to handle token - it's in HTTP-only cookie
//     console.log("Login success:", response.data);
//     router.push("/dashboard");
//   } catch (error) {
//     setError(error.response?.data?.message || "Login failed");
//   }
// };

//   const handleAdminLogin = () => {
//     router.push('/admin/login');
//   };


//   return (
//     <>
//       <Head>
//         <link 
//           href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
//           rel="stylesheet"
//         />
//       </Head>
      
//       <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center" style={{ 
//         backgroundColor: '#FFFFFF',
//         backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(58, 134, 255, 0.1) 0%, rgba(10, 36, 99, 0.1) 90%)'
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
//             Welcome to <span style={{ color: '#3A86FF' }}>GROWTHAFFINITY </span> MARKETING PVT LTD
//           </p>
//         </div>

//         <div className="card p-4 shadow-lg" style={{ 
//           width: '100%', 
//           maxWidth: '400px',
//           backgroundColor: 'white',
//           border: 'none',
//           borderRadius: '15px',
//           boxShadow: '0 10px 25px rgba(58, 134, 255, 0.2)',
//           transition: 'transform 0.3s, box-shadow 0.3s',
//           ':hover': {
//             transform: 'translateY(-5px)',
//             boxShadow: '0 15px 30px rgba(58, 134, 255, 0.3)'
//           }
//         }}>
//           <div className="dropdown mb-3">
//             <button 
//               className="btn dropdown-toggle w-100 py-3" 
//               style={{ 
//                 background: 'linear-gradient(135deg, #0A2463 0%, #3A86FF 100%)',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '10px',
//                 fontWeight: '600',
//                 letterSpacing: '1px',
//                 boxShadow: '0 4px 15px rgba(10, 36, 99, 0.4)',
//                 transition: 'all 0.3s ease'
//               }}
//               type="button" 
//               id="loginTypeDropdown"
//               data-bs-toggle="dropdown"
//               aria-expanded="false"
//               onMouseEnter={(e) => e.target.style.boxShadow = '0 6px 20px rgba(10, 36, 99, 0.6)'}
//               onMouseLeave={(e) => e.target.style.boxShadow = '0 4px 15px rgba(10, 36, 99, 0.4)'}
//             >
//               User Login
//             </button>
//             <ul className="dropdown-menu w-100" aria-labelledby="loginTypeDropdown" style={{
//               border: 'none',
//               borderRadius: '10px',
//               boxShadow: '0 10px 25px rgba(58, 134, 255, 0.2)'
//             }}>
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
//                   User Login
//                 </button>
//               </li>
//               <li>
//                 <button 
//                   className="dropdown-item py-2" 
//                   onClick={handleAdminLogin}
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
          
//           <form onSubmit={handleLogin}>
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
//                 placeholder="Email"
//                 style={{ 
//                   border: '2px solid #E0E0E0',
//                   borderRadius: '10px',
//                   color: '#0A2463',
//                   backgroundColor: '#F5F5F5',
//                   transition: 'all 0.3s'
//                 }}
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 onFocus={(e) => {
//                   e.target.style.borderColor = '#3A86FF';
//                   e.target.style.boxShadow = '0 0 0 0.25rem rgba(58, 134, 255, 0.25)';
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor = '#E0E0E0';
//                   e.target.style.boxShadow = 'none';
//                 }}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <input 
//                 type="password" 
//                 className="form-control py-3" 
//                 placeholder="Password"
//                 style={{ 
//                   border: '2px solid #E0E0E0',
//                   borderRadius: '10px',
//                   color: '#0A2463',
//                   backgroundColor: '#F5F5F5',
//                   transition: 'all 0.3s'
//                 }}
//                 value={password}
//                 onChange={e => setPassword(e.target.value)}
//                 onFocus={(e) => {
//                   e.target.style.borderColor = '#3A86FF';
//                   e.target.style.boxShadow = '0 0 0 0.25rem rgba(58, 134, 255, 0.25)';
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor = '#E0E0E0';
//                   e.target.style.boxShadow = 'none';
//                 }}
//                 required
//               />
//             </div>
//             <button 
//               type="submit" 
//               className="btn w-100 py-3"
//               style={{ 
//                 background: 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '10px',
//                 fontWeight: '600',
//                 letterSpacing: '1px',
//                 boxShadow: '0 4px 15px rgba(58, 134, 255, 0.4)',
//                 transition: 'all 0.3s ease',
//                 position: 'relative',
//                 overflow: 'hidden'
//               }}
//               onMouseEnter={(e) => {
//                 e.target.style.boxShadow = '0 6px 20px rgba(58, 134, 255, 0.6)';
//                 e.target.style.transform = 'translateY(-2px)';
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.boxShadow = '0 4px 15px rgba(58, 134, 255, 0.4)';
//                 e.target.style.transform = 'translateY(0)';
//               }}
//             >
//               <span style={{ position: 'relative', zIndex: '2' }}>LOGIN</span>
//               <span style={{
//                 position: 'absolute',
//                 top: '-50%',
//                 left: '-50%',
//                 width: '200%',
//                 height: '200%',
//                 background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.3) 0%, transparent 100%)',
//                 transform: 'rotate(45deg)',
//                 transition: 'all 0.5s ease',
//                 opacity: '0'
//               }} 
//               className="btn-shine"
//               />
//             </button>
//           </form>
          
//           <div className="text-center mt-4">
//             <Link 
//               href="/auth/forgot-password" 
//               className="text-decoration-none small fw-medium"
//               style={{ 
//                 color: '#0A2463',
//                 transition: 'all 0.2s',
//                 display: 'inline-block'
//               }}
//               onMouseEnter={(e) => {
//                 e.target.style.color = '#00F5FF';
//                 e.target.style.transform = 'translateX(5px)';
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.color = '#0A2463';
//                 e.target.style.transform = 'translateX(0)';
//               }}
//             >
//               Forget password? →
//             </Link>
//           </div>
          
//           <div className="text-center mt-4 pt-3" style={{ borderTop: '1px dashed rgba(10, 36, 99, 0.2)' }}>
//             <Link 
//               href="/auth/signup" 
//               className="text-decoration-none fw-bold"
//               style={{ 
//                 color: '#0A2463',
//                 transition: 'all 0.2s',
//                 display: 'inline-flex',
//                 alignItems: 'center'
//               }}
//               onMouseEnter={(e) => {
//                 e.target.style.color = '#3A86FF';
//                 e.target.style.transform = 'scale(1.05)';
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.color = '#0A2463';
//                 e.target.style.transform = 'scale(1)';
//               }}
//             >
//               Create Your Account
//               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right ms-2" viewBox="0 0 16 16">
//                 <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
//               </svg>
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
import api from "../../utils/api";
import { setToken, getToken } from '../../utils/auth';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting user login...');
      const response = await api.post("/api/auth/login", { email, password });
      
      // Detect Safari/iOS
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      
      console.log(`Login from browser: ${isSafari ? 'Safari' : isIOS ? 'iOS' : 'Other'}`);
      
      // Verify token was stored successfully
      const token = response.data?.token;
      if (token) {
        const storageSuccess = setToken(token);
        if (!storageSuccess) {
          throw new Error('Failed to store authentication token');
        }
        
        // Verify token was actually stored
        const storedToken = getToken();
        if (!storedToken) {
          console.warn('Token storage verification failed');
          throw new Error('Token storage verification failed');
        }
      }
      
      console.log("Login success:", response.data);
      
      // For Safari/iOS, add a small delay before redirecting to ensure cookie is properly set
      if (isSafari || isIOS) {
        console.log('Safari/iOS detected, adding delay before redirect');
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || error.message || "Login failed");
    }
  };

  const handleAdminLogin = () => {
    router.push('/admin/login');
  };

  return (
    <>
      <Head>
        <title>User Login</title>
      </Head>
      
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center" style={{ 
        backgroundColor: '#FFFFFF',
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(58, 134, 255, 0.1) 0%, rgba(10, 36, 99, 0.1) 90%)'
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
            Welcome to <span style={{ color: '#3A86FF' }}>GROWTHAFFINITY</span>
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
                background: 'linear-gradient(135deg, #0A2463 0%, #3A86FF 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                letterSpacing: '1px',
                boxShadow: '0 4px 15px rgba(10, 36, 99, 0.4)'
              }}
              type="button" 
              id="loginTypeDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              User Login
            </button>
            <ul className="dropdown-menu w-100" aria-labelledby="loginTypeDropdown">
              <li>
                <button 
                  className="dropdown-item py-2" 
                  style={{ color: '#0A2463', fontWeight: '500' }}
                >
                  User Login
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item py-2" 
                  onClick={handleAdminLogin}
                  style={{ color: '#0A2463', fontWeight: '500' }}
                >
                  Admin Login
                </button>
              </li>
            </ul>
          </div>
          
          <form onSubmit={handleLogin}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <div className="mb-4">
              <input 
                type="text" 
                className="form-control py-3" 
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <input 
                type="password" 
                className="form-control py-3" 
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn w-100 py-3"
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
              LOGIN
            </button>
          </form>
          
          <div className="text-center mt-4">
            <Link 
              href="/auth/forgot-password" 
              className="text-decoration-none small fw-medium"
              style={{ color: '#0A2463' }}
            >
              Forget password? →
            </Link>
          </div>
          
          <div className="text-center mt-4 pt-3" style={{ borderTop: '1px dashed rgba(10, 36, 99, 0.2)' }}>
            <Link 
              href="/auth/signup" 
              className="text-decoration-none fw-bold"
              style={{ color: '#0A2463' }}
            >
              Create Your Account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}