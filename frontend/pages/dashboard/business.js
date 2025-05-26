import { useEffect, useState } from 'react';
import BusinessVolumeForm from '../../components/BusinessVolumeForm';
import BusinessVolumeStats from '../../components/BusinessVolumeStats';
import { fetchProfile } from '../../utils/profileService';

export default function BusinessPage() {
  const [userId, setUserId] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    // Try to get userId from localStorage profile data
    const savedUser = localStorage.getItem('userProfileData');
    let foundId = null;
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      console.log('Parsed user from localStorage:', parsed);
      if (parsed._id) foundId = parsed._id;
      else if (parsed.basicInfo && parsed.basicInfo._id) foundId = parsed.basicInfo._id;
    }
    if (foundId) {
      console.log('Found userId:', foundId);
      setUserId(foundId);
    } else {
      // Fallback: fetch profile from backend
      fetchProfile().then(profile => {
        console.log('Fetched profile from backend:', profile);
        if (profile.basicInfo && profile.basicInfo._id) setUserId(profile.basicInfo._id);
      }).catch(err => {
        console.error('Error fetching profile:', err);
      });
    }
  }, []);

  return (
    <div className="p-4">
      <h2 className="mb-4" style={{ color: '#0A2463', fontWeight: '600' }}>
        Business Volume
      </h2>
      {userId ? (
        <>
          <BusinessVolumeForm userId={userId} onSuccess={() => setRefresh(r => r + 1)} />
          <BusinessVolumeStats userId={userId} refreshTrigger={refresh} />
        </>
      ) : (
        <div>Loading user information...</div>
      )}
    </div>
  );
}
