import React, { useState, useEffect } from 'react';
import { UserProfile } from '../shared/types';
import { PremiumLevel, getPremiumLevels, createCheckoutSession } from '../services/stripeService';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Lock, Unlock, Check, Star, Crown, ExternalLink } from 'lucide-react';

interface PremiumLevelsProps {
  userProfile: UserProfile;
  onLevelUnlock: (levelId: string) => void;
}

const PremiumLevels: React.FC<PremiumLevelsProps> = ({ userProfile, onLevelUnlock }) => {
  const [levels, setLevels] = useState<PremiumLevel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingLevel, setProcessingLevel] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const premiumLevels = await getPremiumLevels();
        setLevels(premiumLevels);
      } catch (error) {
        console.error('Failed to fetch premium levels:', error);
        toast({
          title: 'Error',
          description: 'Failed to load premium levels. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, [toast]);

  const handleUnlockLevel = async (level: PremiumLevel) => {
    if (!userProfile) return;
    
    setProcessingLevel(level.id);
    
    try {
      // Check if the level is already unlocked
      if (userProfile.unlockedLevels.includes(level.id)) {
        toast({
          title: 'Already Unlocked',
          description: `You've already unlocked ${level.name}!`,
        });
        return;
      }
      
      // Create checkout session
      const checkoutUrl = await createCheckoutSession(level.id, userProfile.uniqueCode);
      
      // Redirect to Stripe
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Failed to unlock level:', error);
      toast({
        title: 'Error',
        description: 'Failed to process payment. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setProcessingLevel(null);
    }
  };

  const isLevelUnlocked = (levelId: string) => {
    return userProfile?.unlockedLevels.includes(levelId) || false;
  };

  const canUnlockLevel = (requiredLevel: string) => {
    const levelMap = { 'BEG': 1, 'INT': 2, 'ADV': 3, 'PRO': 4, 'VIP': 5 };
    const userLevelValue = levelMap[userProfile.category] || 0;
    const requiredLevelValue = levelMap[requiredLevel] || 0;
    
    return userLevelValue >= requiredLevelValue;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2">Premium Fitness Levels</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Unlock advanced features and personalized coaching with premium levels
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {levels.map((level) => (
            <Card key={level.id} className={`
              overflow-hidden border-2 transition-all
              ${isLevelUnlocked(level.id) ? 'border-green-500 dark:border-green-600' : 'border-gray-200 dark:border-gray-700'}
            `}>
              <div className={`
                h-2 w-full 
                ${isLevelUnlocked(level.id) ? 'bg-green-500 dark:bg-green-600' : 'bg-primary'}
              `}></div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{level.name}</CardTitle>
                  {isLevelUnlocked(level.id) ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <Unlock className="h-3 w-3 mr-1" /> Unlocked
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                      <Lock className="h-3 w-3 mr-1" /> Locked
                    </Badge>
                  )}
                </div>
                <CardDescription>{level.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <p className="text-2xl font-bold">${level.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">One-time payment</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Features:</p>
                  <ul className="space-y-1">
                    {level.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {!canUnlockLevel(level.requiredLevel) && (
                  <div className="mt-4 bg-amber-50 dark:bg-amber-900/30 p-3 rounded-md">
                    <p className="text-sm text-amber-800 dark:text-amber-200 flex items-center">
                      <Crown className="h-4 w-4 mr-2" />
                      Requires {level.requiredLevel} level or higher
                    </p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full"
                  variant={isLevelUnlocked(level.id) ? "outline" : "default"}
                  onClick={() => handleUnlockLevel(level)}
                  disabled={isLevelUnlocked(level.id) || !canUnlockLevel(level.requiredLevel) || processingLevel === level.id}
                >
                  {processingLevel === level.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : isLevelUnlocked(level.id) ? (
                    <>
                      <Star className="h-4 w-4 mr-2" />
                      Access Content
                    </>
                  ) : !canUnlockLevel(level.requiredLevel) ? (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Upgrade Your Level First
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Unlock Now
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium mb-4">Your Access Code Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <div className="text-blue-600 dark:text-blue-300 mb-2">
              <Crown className="h-6 w-6" />
            </div>
            <h4 className="font-medium mb-1">Premium Access</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Unlock advanced features with your unique code
            </p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
            <div className="text-purple-600 dark:text-purple-300 mb-2">
              <Star className="h-6 w-6" />
            </div>
            <h4 className="font-medium mb-1">Personalized Journey</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tailored workouts based on your level and goals
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
            <div className="text-green-600 dark:text-green-300 mb-2">
              <ExternalLink className="h-6 w-6" />
            </div>
            <h4 className="font-medium mb-1">Quick Login</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use your QR code for instant dashboard access
            </p>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg">
            <div className="text-amber-600 dark:text-amber-300 mb-2">
              <Check className="h-6 w-6" />
            </div>
            <h4 className="font-medium mb-1">Referral Rewards</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Share your code with friends to earn rewards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumLevels;