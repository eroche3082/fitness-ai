import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import QRCodeDisplay from './QRCodeDisplay';
import { Smartphone, ArrowRight, QrCode, Dumbbell, Award } from 'lucide-react';

const QRCodeDemoSection: React.FC = () => {
  // Example access codes for different levels
  const accessCodes = {
    beginner: 'FIT-BEG-2748',
    intermediate: 'FIT-INT-3951',
    advanced: 'FIT-ADV-4287',
    pro: 'FIT-PRO-6529',
    vip: 'FIT-VIP-9872'
  };

  return (
    <div className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Access Your Workouts Anywhere</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Scan your personalized QR code to instantly access your AI-generated fitness routines on any device. 
            Share with your trainer or training partner in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-green-900/30 p-3 rounded-lg">
                <QrCode className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-green-500">Personalized Access Codes</h3>
                <p className="text-gray-400">
                  Every user receives a unique access code based on their fitness level, 
                  unlocking features and workouts tailored to their needs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-green-900/30 p-3 rounded-lg">
                <Smartphone className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-green-500">Cross-Device Compatibility</h3>
                <p className="text-gray-400">
                  Access your workouts on any device - scan once and continue your session 
                  from your phone, tablet, or computer seamlessly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-green-900/30 p-3 rounded-lg">
                <Dumbbell className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-green-500">Complete Workout Details</h3>
                <p className="text-gray-400">
                  Each code unlocks full workout instructions, including sets, reps, 
                  rest periods, form guidance, and video demonstrations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-green-900/30 p-3 rounded-lg">
                <Award className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-green-500">Level-Based Progression</h3>
                <p className="text-gray-400">
                  As you advance from Beginner to VIP, your QR code unlocks more advanced
                  features, workouts, and premium content.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <Card className="bg-black border border-gray-800 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-green-500">Advanced Level</h3>
                    <p className="text-sm text-gray-400">Full-Body Strength Program</p>
                  </div>
                  <div className="flex justify-center">
                    <QRCodeDisplay 
                      code={accessCodes.advanced} 
                      size={180}
                      foreground="#10b981" // green-500
                      background="#000000"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="font-mono bg-gray-900 text-green-500 py-1 px-2 rounded text-sm inline-block">
                      {accessCodes.advanced}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black border border-gray-800 shadow-md">
              <CardContent className="p-4">
                <div className="text-center mb-2">
                  <h3 className="text-sm font-semibold text-green-500">Beginner</h3>
                </div>
                <div className="flex justify-center">
                  <QRCodeDisplay 
                    code={accessCodes.beginner} 
                    size={100}
                    foreground="#10b981" // green-500
                    background="#000000"
                  />
                </div>
                <div className="mt-2 text-center">
                  <p className="font-mono bg-gray-900 text-green-500 py-1 px-2 rounded text-xs inline-block">
                    {accessCodes.beginner}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black border border-gray-800 shadow-md">
              <CardContent className="p-4">
                <div className="text-center mb-2">
                  <h3 className="text-sm font-semibold text-green-500">VIP</h3>
                </div>
                <div className="flex justify-center">
                  <QRCodeDisplay 
                    code={accessCodes.vip} 
                    size={100}
                    foreground="#10b981" // green-500
                    background="#000000"
                  />
                </div>
                <div className="mt-2 text-center">
                  <p className="font-mono bg-gray-900 text-green-500 py-1 px-2 rounded text-xs inline-block">
                    {accessCodes.vip}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDemoSection;