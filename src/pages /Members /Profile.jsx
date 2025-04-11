import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../components/auth/AuthContext';
import DonationHistory from '../../components/donation/DonationHistory';
import EventCalendar from '../../components/events/EventCalendar';
import ProfileForm from '../../components/profile/ProfileForm';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { fetchUserProfile } from '../../services/userService';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('donations');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const profileData = await fetchUserProfile(user.id);
        setProfile(profileData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    updateUser({ ...user, ...updatedProfile });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="profile-avatar">
          {profile?.avatar ? (
            <img src={profile.avatar} alt={`${user.name}'s avatar`} />
          ) : (
            <div className="avatar-placeholder">
              {user?.name?.charAt(0) || user?.email?.charAt(0)}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h1>{profile?.name || user?.email}</h1>
          <p className="profile-email">{user?.email}</p>
          {profile?.bio && <p className="profile-bio">{profile.bio}</p>}
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{profile?.donationCount || 0}</span>
              <span className="stat-label">Donations</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                ${profile?.totalDonated?.toFixed(2) || 0}
              </span>
              <span className="stat-label">Total Given</span>
            </div>
          </div>
        </div>
      </header>

      <nav className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'donations' ? 'active' : ''}`}
          onClick={() => setActiveTab('donations')}
        >
          Donation History
        </button>
        <button
          className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          My Events
        </button>
        <button
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Profile Settings
        </button>
      </nav>

      <div className="profile-content">
        {activeTab === 'donations' && (
          <DonationHistory userId={user?.id} />
        )}
        {activeTab === 'events' && (
          <EventCalendar userId={user?.id} />
        )}
        {activeTab === 'settings' && (
          <ProfileForm 
            profile={profile} 
            onUpdate={handleProfileUpdate} 
          />
        )}
      </div>
    </div>
  );
}