import React from 'react';
import VoiceCoaching from '../components/VoiceCoaching';
import Header from '../components/Header';

export default function VoiceCoachingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Voice Coaching & Rep Counter</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <VoiceCoaching />
          </div>
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">How It Works</h2>
              <ol className="space-y-3 list-decimal list-inside text-sm">
                <li>Select an exercise from the dropdown list</li>
                <li>Click "Start Workout" to begin a 3-set routine</li>
                <li>Press "Start" to begin recording your exercise</li>
                <li>The AI will count your repetitions via sound</li>
                <li>Press "Stop" when you finish your set</li>
                <li>Rest between sets as guided by the voice coach</li>
                <li>Complete all 3 sets to finish your workout</li>
              </ol>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Supported Exercises</h2>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 p-1 rounded">Push-ups</span>
                  <span className="text-muted-foreground">Best with clear up/down motion sounds</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 p-1 rounded">Squats</span>
                  <span className="text-muted-foreground">Works with audible breathing patterns</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-orange-100 text-orange-800 p-1 rounded">Jumping Jacks</span>
                  <span className="text-muted-foreground">Detects landing sounds</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-800 p-1 rounded">Crunches</span>
                  <span className="text-muted-foreground">Works with rhythmic movement</span>
                </li>
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                Note: The rep counting feature works best in quiet environments with distinct exercise sounds.
                Adjust the sensitivity slider to optimize for your environment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}