import React from 'react';
import HeroSection from '@/components/HeroSection';
import DailyVerse from '@/components/DailyVerse';
import LivestreamOverlay from '@/components/LivestreamOverlay';
import CountdownTimer from '@/components/CountdownTimer';
import { useBroadcast } from '@/hooks/useBroadcast';
import { useAuth } from '@/components/AuthContext';

export default function Home({ livestreamActive }) {
  const { user } = useAuth();
  const { isLive, streamDetails } = useBroadcast();
  
  // Sunday service countdown (9AM CAT)
  const nextSundayAt10AM = new Date();
  nextSundayAt9AM.setDate(nextSundayAt10AM.getDate() + (7 - nextSundayAt10AM.getDay()) % 7);
  nextSundayAt9AM.setHours(8, 0, 0, 0); // 8AM UTC = 9AM CAT

  return (
    <div className="home-page">
      <HeroSection 
        title="Transforming Lives Through Christ"
        subtitle="John 3:16 - For God so loved the world..."
        backgroundImage="/children-home.jpg"
        ctaText={isLive ? "Join Live Service" : "Watch Sunday Service"}
        ctaLink={isLive ? "/livestream" : null}
      >
        {!isLive && (
          <div className="service-countdown">
            <h3>Next Service Starts In:</h3>
            <CountdownTimer targetDate={nextSundayAt9AM} />
          </div>
        )}
      </HeroSection>

      <section className="content-section">
        <DailyVerse showFullVerse={true} />
        
        {livestreamActive && (
          <LivestreamOverlay 
            sermonTitle={streamDetails?.title || "Sunday Worship Service"}
            preacherName={streamDetails?.preacher || "Pastor John Mundari"}
          />
        )}
      </section>

      {user && (
        <section className="user-greeting">
          <h3>Welcome back, {user.name}</h3>
          <p>Your last visit was {user.lastLogin}</p>
        </section>
      )}
    </div>
  );
}
