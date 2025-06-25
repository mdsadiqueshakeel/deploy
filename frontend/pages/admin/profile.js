import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import API from '../../services/api';

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

        const res = await API.get('/api/admin/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [router]);

  return (
    <AdminLayout title="Profile">
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Admin Profile</h3>
        </div>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : profile ? (
          <div className="card shadow-sm p-4">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label text-muted">Admin ID</label>
                  <p className="form-control-plaintext">{profile._id}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted">Email</label>
                  <p className="form-control-plaintext">{profile.email}</p>
                </div>
              </div>
              
            </div>
          </div>
        ) : (
          <div className="alert alert-danger">Profile not found.</div>
        )}
      </div>
    </AdminLayout>
  );
}