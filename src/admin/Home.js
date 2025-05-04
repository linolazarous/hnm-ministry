import React, { useState, useEffect } from 'react';
import DailyVerse from '../components/bible-verse/DailyVerse';
import HeroSection from '../components/HeroSection';
import EventCalendar from '../components/EventCalendar';
import Testimonials from '../components/Testimonials';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';
import useLiveStreamStatus from '../hooks/useLiveStreamStatus';
import '../css/HomePage.css';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { isLive, streamTitle } = useLiveStreamStatus();
  const [featuredEvents, setFeaturedEvents] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate loading featured events from API
        setTimeout(() => {
          setFeaturedEvents([
            {
              id: 1,
              title: "Sunday Worship Service",
              date: new Date(Date.now() + 86400000), // Tomorrow
              time: "09:00 AM",
              location: "Main Sanctuary"
            },
            {
              id: 2,
              title: "Bible Study",
              date: new Date(Date.now() + 2 * 86400000), // Day after tomorrow
              time: "06:00 PM",
              location: "Fellowship Hall"
            }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to load home data:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="home-page">
      <ErrorBoundary>
        <HeroSection 
          title="Transforming Lives Through Christ"
          subtitle="John 3:16 - For God so loved the world..."
          ctaText={isLive ? "Join Live Stream" : "Watch Sunday Service"}
          ctaLink={isLive ? "/live" : "/sermons"}
          isLive={isLive}
          liveLabel={streamTitle}
        />
      </ErrorBoundary>

      <main className="home-content">
        <section className="verse-section">
          <ErrorBoundary fallback={<p>Daily verse unavailable</p>}>
            <DailyVerse />
          </ErrorBoundary>
        </section>

        <section className="events-section">
          <h2>Upcoming Events</h2>
          <ErrorBoundary>
            <EventCalendar events={featuredEvents} compact />
          </ErrorBoundary>
          <a href="/events" className="view-all-link">View All Events →</a>
        </section>

        <section className="testimonials-section">
          <h2>Stories of Transformation</h2>
          <ErrorBoundary>
            <Testimonials />
          </ErrorBoundary>
        </section>

        <section className="quick-links">
          <h2 className="visually-hidden">Quick Links</h2>
          <div className="link-cards">
            <a href="/donate" className="link-card donate">
              <h3>Support Our Mission</h3>
              <p>Your generosity changes lives</p>
            </a>
            <a href="/ministries" className="link-card ministries">
              <h3>Join a Ministry</h3>
              <p>Find your place to serve</p>
            </a>
            <a href="/prayer" className="link-card prayer">
              <h3>Prayer Requests</h3>
              <p>Share your prayer needs</p>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
