import { useContext } from 'react';
import { AuthContext } from '../../components/auth/AuthContext';
import DonationHistory from '../../components/donation/DonationHistory';

export default function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <div className="profile">
      <h2>Welcome, {user?.email}</h2>
      <DonationHistory userId={user?.id} />
      <EventCalendar />
    </div>
  );
}