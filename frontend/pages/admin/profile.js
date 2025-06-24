import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const res = await axios.get('http://localhost:5000/api/admin/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err.message);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  return (
    <AdminLayout title="Profile">
      <div className="container mt-4">
        <h3 className="mb-4">Admin Profile</h3>
        {loading ? (
          <p>Loading...</p>
        ) : profile ? (
          <div className="card shadow-sm p-4">
            <p><strong>ID:</strong> {profile._id}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>
        ) : (
          <p>Profile not found.</p>
        )}
      </div>
    </AdminLayout>
  );
}
