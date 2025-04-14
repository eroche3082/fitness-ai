import React from 'react';
import { Medal, Share2, Award, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AchievementBadgeFeature() {
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight">Achievement Badge System</h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Track your fitness journey milestones with our comprehensive achievement system that rewards your progress and dedication.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Achievement Badge System */}
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Award className="h-6 w-6 mr-2 text-primary" />
              <CardTitle className="text-lg">Achievement Badges</CardTitle>
            </div>
            <CardDescription>
              Earn badges that showcase your fitness accomplishments across various categories.
            </CardDescription>
          </CardHeader>
        </Card>
        
        {/* Badge Categories */}
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Trophy className="h-6 w-6 mr-2 text-primary" />
              <CardTitle className="text-lg">Categorized Progress</CardTitle>
            </div>
            <CardDescription>
              Track progress in strength, cardio, nutrition, consistency, and special achievements.
            </CardDescription>
          </CardHeader>
        </Card>
        
        {/* Sharable Achievements */}
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Share2 className="h-6 w-6 mr-2 text-primary" />
              <CardTitle className="text-lg">Social Sharing</CardTitle>
            </div>
            <CardDescription>
              Share your achievements on social media platforms to inspire others and celebrate your progress.
            </CardDescription>
          </CardHeader>
        </Card>
        
        {/* Progress Tracking */}
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Medal className="h-6 w-6 mr-2 text-primary" />
              <CardTitle className="text-lg">Tiered Rewards</CardTitle>
            </div>
            <CardDescription>
              Progress through bronze, silver, gold, platinum, and diamond tiers for each achievement type.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      {/* Visual example */}
      <div className="mt-12 bg-muted rounded-lg p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold">Featured Achievement Badges</h3>
          <p className="text-muted-foreground">Examples of badges you can earn on your fitness journey</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-card rounded-lg p-4 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-amber-600 flex items-center justify-center mb-3">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-medium">Fuerza Inicial</h4>
            <p className="text-xs text-muted-foreground mt-1">Complete your first strength training</p>
          </div>
          
          <div className="bg-card rounded-lg p-4 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-400 flex items-center justify-center mb-3">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-medium">Maratonista</h4>
            <p className="text-xs text-muted-foreground mt-1">Run a total of 25km</p>
          </div>
          
          <div className="bg-card rounded-lg p-4 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center mb-3">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-medium">Nutrición Perfecta</h4>
            <p className="text-xs text-muted-foreground mt-1">Maintain balanced nutrition for 30 days</p>
          </div>
          
          <div className="bg-card rounded-lg p-4 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center mb-3">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-medium">Compromiso Firme</h4>
            <p className="text-xs text-muted-foreground mt-1">Complete 15 workouts in a month</p>
          </div>
          
          <div className="bg-card rounded-lg p-4 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center mb-3">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-medium">Pionero Fitness</h4>
            <p className="text-xs text-muted-foreground mt-1">Early user of Fitness AI</p>
          </div>
        </div>
      </div>
    </div>
  );
}