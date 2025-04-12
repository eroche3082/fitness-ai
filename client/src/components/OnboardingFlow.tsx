import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface OnboardingFlowProps {
  userId?: number;
  onComplete: (welcomeMessage: string) => void;
}

export default function OnboardingFlow({ userId = 1, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { 
    profile, 
    updateProfile, 
    onboardingQuestions, 
    currentQuestion, 
    completeOnboarding, 
    generateWelcomeMessage 
  } = useUserProfile(userId);

  // If profile has already completed onboarding, skip to the end
  useEffect(() => {
    if (profile?.onboardingCompleted) {
      const welcomeMessage = generateWelcomeMessage();
      onComplete(welcomeMessage);
    }
  }, [profile, generateWelcomeMessage, onComplete]);

  // Update current step when currentQuestion changes
  useEffect(() => {
    if (currentQuestion) {
      setCurrentStep(currentQuestion.step);
    }
  }, [currentQuestion]);

  const handleNext = () => {
    if (currentQuestion.step < onboardingQuestions.length) {
      updateProfile({ onboardingStep: currentQuestion.step + 1 });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion.step > 1) {
      updateProfile({ onboardingStep: currentQuestion.step - 1 });
    }
  };

  const handleComplete = () => {
    completeOnboarding().then((welcomeMessage) => {
      onComplete(welcomeMessage);
    });
  };

  const handleSingleChoice = (value: string) => {
    if (currentQuestion.step === 1) {
      updateProfile({ name: value });
    } else if (currentQuestion.step === 2) {
      updateProfile({ fitnessLevel: value as 'beginner' | 'intermediate' | 'advanced' });
    } else if (currentQuestion.step === 6) {
      updateProfile({ language: value });
    }
  };

  const handleMultipleChoice = (checked: boolean, value: string) => {
    if (currentQuestion.step === 3) {
      const currentGoals = [...(profile?.fitnessGoals || [])];
      if (checked) {
        if (!currentGoals.includes(value)) {
          updateProfile({ fitnessGoals: [...currentGoals, value] });
        }
      } else {
        updateProfile({ fitnessGoals: currentGoals.filter(goal => goal !== value) });
      }
    } else if (currentQuestion.step === 4) {
      const currentActivities = [...(profile?.preferredActivities || [])];
      if (checked) {
        if (!currentActivities.includes(value)) {
          updateProfile({ preferredActivities: [...currentActivities, value] });
        }
      } else {
        updateProfile({ preferredActivities: currentActivities.filter(activity => activity !== value) });
      }
    } else if (currentQuestion.step === 7) {
      const currentDevices = [...(profile?.usedDevices || [])];
      if (checked) {
        if (!currentDevices.includes(value)) {
          updateProfile({ usedDevices: [...currentDevices, value] });
        }
      } else {
        updateProfile({ usedDevices: currentDevices.filter(device => device !== value) });
      }
    }
  };

  const handleNumberInput = (value: number) => {
    if (currentQuestion.step === 5) {
      updateProfile({ activeHoursPerWeek: value });
    }
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome to Fitness AI</CardTitle>
        <CardDescription>
          Step {currentQuestion.step} of {currentQuestion.totalSteps}: {currentQuestion.question}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentQuestion.step === 1 && (
          <div className="space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="name">Your Name</Label>
              <Input 
                id="name" 
                placeholder="Enter your name" 
                value={profile?.name || ''} 
                onChange={(e) => handleSingleChoice(e.target.value)}
              />
            </div>
          </div>
        )}

        {currentQuestion.step === 2 && (
          <RadioGroup 
            value={profile?.fitnessLevel || ''}
            onValueChange={(value) => handleSingleChoice(value)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="beginner" id="beginner" />
              <Label htmlFor="beginner">Beginner</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="intermediate" id="intermediate" />
              <Label htmlFor="intermediate">Intermediate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="advanced" id="advanced" />
              <Label htmlFor="advanced">Advanced</Label>
            </div>
          </RadioGroup>
        )}

        {currentQuestion.step === 3 && currentQuestion.options && (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox 
                  id={`goal-${option}`} 
                  checked={(profile?.fitnessGoals || []).includes(option)}
                  onCheckedChange={(checked) => handleMultipleChoice(checked === true, option)}
                />
                <Label htmlFor={`goal-${option}`}>
                  {currentQuestion.optionLabels?.[index] || option.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Label>
              </div>
            ))}
          </div>
        )}

        {currentQuestion.step === 4 && currentQuestion.options && (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox 
                  id={`activity-${option}`} 
                  checked={(profile?.preferredActivities || []).includes(option)}
                  onCheckedChange={(checked) => handleMultipleChoice(checked === true, option)}
                />
                <Label htmlFor={`activity-${option}`}>
                  {currentQuestion.optionLabels?.[index] || option.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Label>
              </div>
            ))}
          </div>
        )}

        {currentQuestion.step === 5 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Hours per week: {profile?.activeHoursPerWeek || 0}</Label>
              <Slider 
                value={[profile?.activeHoursPerWeek || 0]} 
                onValueChange={(value) => handleNumberInput(value[0])}
                max={20}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>5</span>
                <span>10</span>
                <span>15</span>
                <span>20+</span>
              </div>
            </div>
          </div>
        )}

        {currentQuestion.step === 6 && (
          <RadioGroup 
            value={profile?.language || 'en'}
            onValueChange={(value) => handleSingleChoice(value)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="en" id="en" />
              <Label htmlFor="en">English</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="es" id="es" />
              <Label htmlFor="es">Spanish</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fr" id="fr" />
              <Label htmlFor="fr">French</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pt" id="pt" />
              <Label htmlFor="pt">Portuguese</Label>
            </div>
          </RadioGroup>
        )}

        {currentQuestion.step === 7 && currentQuestion.options && (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox 
                  id={`device-${option}`} 
                  checked={(profile?.usedDevices || []).includes(option)}
                  onCheckedChange={(checked) => handleMultipleChoice(checked === true, option)}
                />
                <Label htmlFor={`device-${option}`}>
                  {currentQuestion.optionLabels?.[index] || option.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Label>
              </div>
            ))}
          </div>
        )}

        {currentQuestion.step === 8 && (
          <div className="text-center py-4">
            <CheckCircle2 className="h-16 w-16 mx-auto text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2">All Set!</h3>
            <p className="text-muted-foreground">
              Thanks for completing your profile. Your customized fitness experience is ready.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentQuestion.step === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {currentQuestion.step < currentQuestion.totalSteps ? (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleComplete}>
            Get Started
            <CheckCircle2 className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}