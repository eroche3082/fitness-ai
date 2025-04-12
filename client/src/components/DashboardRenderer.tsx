import React, { useEffect, useState } from 'react';
import { SubscriberProfile } from '@/lib/subscriberSchema';
import profileService from '@/services/profileService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Activity, Flame, Clock, Footprints, Trophy, ChevronRight, Heart, LineChart, PlayCircle } from 'lucide-react';

interface DashboardRendererProps {
  userId: number;
  onResetOnboarding?: () => void;
}

export default function DashboardRenderer({ userId, onResetOnboarding }: DashboardRendererProps) {
  const [profile, setProfile] = useState<SubscriberProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Load user profile
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const userProfile = await profileService.fetchUserProfile(userId);
        setProfile(userProfile);
        setError(null);
      } catch (err) {
        setError('Failed to load user profile');
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [userId]);

  // Handle reset onboarding
  const handleResetOnboarding = async () => {
    try {
      await profileService.resetOnboarding(userId);
      if (onResetOnboarding) {
        onResetOnboarding();
      }
    } catch (err) {
      setError('Failed to reset onboarding');
      console.error('Error resetting onboarding:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your fitness data...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">{error || 'Could not load profile data'}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Helper function to get display name
  const getDisplayName = () => {
    return profile.name || 'Fitness Enthusiast';
  };

  // Helper function to get fitness level badge color
  const getLevelColor = () => {
    switch (profile.preferences?.fitnessLevel) {
      case 'beginner':
        return 'bg-green-500/20 text-green-700 hover:bg-green-500/30';
      case 'intermediate':
        return 'bg-blue-500/20 text-blue-700 hover:bg-blue-500/30';
      case 'advanced':
        return 'bg-purple-500/20 text-purple-700 hover:bg-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-700 hover:bg-gray-500/30';
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {getDisplayName()}!</h1>
        <p className="text-muted-foreground">
          Here's your personal fitness dashboard. 
          {profile.system.lastUpdated && (
            <span className="text-xs ml-2">
              Last updated: {new Date(profile.system.lastUpdated).toLocaleDateString()}
            </span>
          )}
        </p>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="settings" className="hidden lg:block">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Profile Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-primary" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Fitness Level</span>
                    <Badge className={getLevelColor()}>
                      {profile.preferences?.fitnessLevel?.charAt(0).toUpperCase() + profile.preferences?.fitnessLevel?.slice(1) || 'Not set'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Weekly Activity</span>
                    <span>{profile.stats?.activeHoursPerWeek || 0} hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Preferred Time</span>
                    <span>{profile.preferences?.workoutTimePreference?.charAt(0).toUpperCase() + profile.preferences?.workoutTimePreference?.slice(1) || 'Flexible'}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  Edit Profile <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-primary" />
                  Your Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profile.preferences?.fitnessGoals?.slice(0, 3).map((goal, index) => (
                    <div key={index} className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                      <span>
                        {goal.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </div>
                  )) || (
                    <div className="text-muted-foreground">No goals set yet</div>
                  )}
                  {profile.preferences?.fitnessGoals?.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{profile.preferences.fitnessGoals.length - 3} more goals
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  Update Goals <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Flame className="mr-2 h-5 w-5 text-primary" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Workouts</span>
                      <span>{profile.stats?.weeklyWorkouts || 0}/7 days</span>
                    </div>
                    <Progress value={(profile.stats?.weeklyWorkouts || 0) * 100 / 7} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Active Minutes</span>
                      <span>{profile.stats?.activeMinutesPerDay || 0}/30 min</span>
                    </div>
                    <Progress value={(profile.stats?.activeMinutesPerDay || 0) * 100 / 30} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Steps</span>
                      <span>{profile.stats?.averageSteps || 0}/10,000</span>
                    </div>
                    <Progress value={(profile.stats?.averageSteps || 0) * 100 / 10000} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  View Details <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Workouts</CardTitle>
              <CardDescription>Based on your fitness level and goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Workout cards would be generated based on user preferences */}
                <WorkoutCard 
                  title="Full Body Strength" 
                  duration={45} 
                  level={profile.preferences?.fitnessLevel || 'beginner'}
                  intensity="Medium"
                  equipment={["Dumbbells", "Resistance Bands"]}
                />
                <WorkoutCard 
                  title="HIIT Cardio" 
                  duration={30} 
                  level={profile.preferences?.fitnessLevel || 'beginner'}
                  intensity="High"
                  equipment={["None"]}
                />
                <WorkoutCard 
                  title="Yoga for Flexibility" 
                  duration={60} 
                  level={profile.preferences?.fitnessLevel || 'beginner'}
                  intensity="Low"
                  equipment={["Yoga Mat"]}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">View All Workouts</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Other tabs would be implemented with similar content structure */}
        <TabsContent value="workouts">
          <Card>
            <CardHeader>
              <CardTitle>Your Workout Library</CardTitle>
              <CardDescription>Personalized fitness programs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Dumbbell className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Coming Soon</h3>
                <p className="text-muted-foreground">Your workout library is being prepared.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Dashboard</CardTitle>
              <CardDescription>Meal plans and nutrition tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Flame className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Coming Soon</h3>
                <p className="text-muted-foreground">Nutrition features are under development.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>Track your fitness journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <LineChart className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Coming Soon</h3>
                <p className="text-muted-foreground">Progress tracking is being prepared.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>User Settings</CardTitle>
              <CardDescription>Manage your account and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-muted-foreground text-sm">Name</label>
                    <p>{profile.name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-sm">Email</label>
                    <p>{profile.email || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-sm">Language</label>
                    <p>{getLanguageName(profile.language)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Linked Devices</h3>
                <div className="space-y-2">
                  {profile.preferences?.usedDevices?.filter(d => d !== 'none').map((device, index) => (
                    <div key={index} className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      <span>
                        {device.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </div>
                  )) || (
                    <div className="text-muted-foreground">No devices connected</div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Onboarding</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  You can reset your onboarding process if you want to change your fitness profile.
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleResetOnboarding}
                >
                  Reset Onboarding
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper Components
interface WorkoutCardProps {
  title: string;
  duration: number;
  level: string;
  intensity: string;
  equipment: string[];
}

function WorkoutCard({ title, duration, level, intensity, equipment }: WorkoutCardProps) {
  return (
    <div className="flex items-center justify-between border rounded-lg p-4">
      <div className="flex items-center">
        <div className="bg-primary/10 rounded-full p-3 mr-4">
          <Dumbbell className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <div className="flex space-x-3 text-sm text-muted-foreground">
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" /> {duration} min
            </span>
            <span className="flex items-center">
              <Activity className="h-3 w-3 mr-1" /> {intensity}
            </span>
          </div>
        </div>
      </div>
      <Button size="sm" className="flex items-center">
        <PlayCircle className="h-4 w-4 mr-1" /> Start
      </Button>
    </div>
  );
}

// Helper function to get full language name
function getLanguageName(code: string): string {
  const languages = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    pt: 'Portuguese'
  };
  return languages[code as keyof typeof languages] || code;
}