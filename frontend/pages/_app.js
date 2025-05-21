// pages/_app.js
import '../styles/globals.css'; // custom styles

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
  
export default MyApp;
