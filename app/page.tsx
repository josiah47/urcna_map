"use client";
import dynamic from 'next/dynamic';

// Dynamically import the WorldMap component to avoid SSR issues with Leaflet
const WorldMap = dynamic(() => import('./components/WorldMap'), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <WorldMap />
    </div>
  );
}