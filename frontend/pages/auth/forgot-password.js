import { useState } from 'react';
import axios from '../../utils/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/forgot-password', { email });
      setMsg(res.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset email');
      setMsg('');
      console.error("Forgot password error:", err.response);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="border p-2 w-full mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button 
          type="submit"
          className="mt-2 bg-blue-600 text-white w-full p-2 hover:bg-blue-700"
        >
          Send Reset Link
        </button>
      </form>
      {msg && <p className="mt-2 text-green-600">{msg}</p>}
      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
}