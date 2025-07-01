// pages/_app.js
import '../styles/globals.css'; // custom styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
  
export default MyApp;
