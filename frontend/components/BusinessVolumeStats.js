import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function BusinessVolumeStats({ userId, refreshTrigger }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    api.get(`/business/${userId}`)
      .then(res => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [userId, refreshTrigger]);

  if (loading) return <div>Loading business volume...</div>;
  if (!stats) return <div>No business volume data found.</div>;

  return (
    <div className="p-4 border rounded bg-gray-50">
      <div><strong>Personal Volume:</strong> {stats.personalVolume}</div>
      <div><strong>Left Subtree Volume:</strong> {stats.leftSubtreeVolume}</div>
      <div><strong>Right Subtree Volume:</strong> {stats.rightSubtreeVolume}</div>
    </div>
  );
} 