import DailyVerse from '../components/bible-verse/DailyVerse';
import HeroSection from '../components/HeroSection';

export default function Home() {
  return (
    <>
      <HeroSection 
        title="Transforming Lives Through Christ"
        subtitle="John 3:16 - For God so loved the world..."
        ctaText="Watch Sunday Service"
      />
      <DailyVerse />
    </>
  );
}