import { useEffect, useState } from 'react';
import { fetchProfile } from '../../utils/profileService';
import dynamic from 'next/dynamic';

// Lazy load BinaryTree (no SSR)
const BinaryTree = dynamic(() => import('../../components/BinaryTree'), {
  ssr: false,
});

export default function BusinessPage() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('userProfileData');
    let foundId = null;

    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed._id) foundId = parsed._id;
      else if (parsed.basicInfo && parsed.basicInfo._id) foundId = parsed.basicInfo._id;
    }

    if (foundId) {
      setUserId(foundId);
    } else {
      fetchProfile()
        .then((profile) => {
          if (profile?.basicInfo?._id) {
            setUserId(profile.basicInfo._id);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch profile:', err);
        });
    }
  }, []);

  return (
    <div className="container py-1">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">🌳 My Binary Tree</h2>
        <p className="text-muted">Here’s how your team structure looks!</p>
      </div>

      <div className="card shadow-md p-4">
        {userId ? (
          <BinaryTree userId={userId} />
        ) : (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading your tree...</span>
            </div>
          </div>
        )}
      </div>
    </div>

    
  );
}
