import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from '../utils/api';

export default function ResetPassword() {
  const router = useRouter();
  const { token, id } = router.query;
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/auth/reset-password?token=${token}&id=${id}`, { password });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          className="border p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          required
        />
        <button className="mt-2 bg-green-600 text-white w-full p-2">Reset</button>
      </form>
      {msg && <p className="mt-2">{msg}</p>}
    </div>
  );
}
