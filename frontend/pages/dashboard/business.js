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
    // Try to get userId from localStorage first
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
      // fallback: fetch from backend
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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-[#0A2463]">My Binary Tree</h2>

      {userId ? (
        <BinaryTree userId={userId} />
      ) : (
        <p className="text-gray-500">Loading your tree...</p>
      )}
    </div>
  );
}
