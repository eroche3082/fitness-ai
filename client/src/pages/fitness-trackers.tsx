import React from 'react';
import FitnessTrackers from '../components/FitnessTrackers';
import Header from '../components/Header';

export default function FitnessTrackersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Connect Your Fitness Devices</h1>
        <FitnessTrackers />
      </div>
    </div>
  );
}