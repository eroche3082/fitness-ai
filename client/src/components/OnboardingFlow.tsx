import { useState, useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Check, ChevronRight } from 'lucide-react';

interface OnboardingFlowProps {
  userId?: number;
  onComplete: (welcomeMessage: string) => void;
}

export default function OnboardingFlow({ userId = 1, onComplete }: OnboardingFlowProps) {
  const {
    isOnboarding,
    currentQuestion,
    submitAnswer,
    loading
  } = useUserProfile(userId);
  
  const [textValue, setTextValue] = useState<string>('');
  const [numberValue, setNumberValue] = useState<number | ''>('');
  const [booleanValue, setBooleanValue] = useState<boolean>(false);
  const [singleSelectValue, setSingleSelectValue] = useState<string>('');
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);

  // Reset form values when the question changes
  useEffect(() => {
    setTextValue('');
    setNumberValue('');
    setBooleanValue(false);
    setSingleSelectValue('');
    setMultiSelectValue([]);
  }, [currentQuestion?.step]);

  // If onboarding is complete, trigger the onComplete callback
  useEffect(() => {
    if (!isOnboarding && currentQuestion?.welcomeMessage) {
      onComplete(currentQuestion.welcomeMessage);
    }
  }, [isOnboarding, currentQuestion, onComplete]);

  if (!isOnboarding || !currentQuestion) {
    return null;
  }

  const handleSubmit = async () => {
    if (loading) return;

    let answerValue: any;
    
    // Determine the type of answer based on the current question
    if (currentQuestion.options && currentQuestion.options.length > 0) {
      if (multiSelectValue.length > 0) {
        answerValue = multiSelectValue;
      } else {
        answerValue = singleSelectValue;
      }
    } else if (typeof booleanValue === 'boolean' && currentQuestion.question.toLowerCase().includes('would you like')) {
      answerValue = booleanValue;
    } else if (numberValue !== '') {
      answerValue = numberValue;
    } else {
      answerValue = textValue;
    }
    
    await submitAnswer(answerValue);
  };

  // Determine input type based on question content
  const getInputType = () => {
    const question = currentQuestion.question.toLowerCase();
    
    // Email input
    if (question.includes('email')) {
      return 'email';
    }
    
    // Number input
    if (
      question.includes('age') || 
      question.includes('height') || 
      question.includes('weight') ||
      question.includes('hours')
    ) {
      return 'number';
    }
    
    // Boolean input
    if (question.includes('would you like')) {
      return 'boolean';
    }
    
    // Multi-select
    if (
      currentQuestion.options && 
      currentQuestion.options.length > 0 && 
      (question.includes('goals') || question.includes('preferences') || question.includes('activities'))
    ) {
      return 'multi-select';
    }
    
    // Single-select
    if (currentQuestion.options && currentQuestion.options.length > 0) {
      return 'single-select';
    }
    
    // Default to text
    return 'text';
  };

  const inputType = getInputType();
  const progress = ((currentQuestion.step) / currentQuestion.totalSteps) * 100;

  return (
    <div className="flex flex-col gap-4 p-4 bg-card border rounded-lg shadow-sm">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Welcome to Fitness AI</h3>
          <span className="text-sm text-muted-foreground">
            Step {currentQuestion.step + 1} of {currentQuestion.totalSteps}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <p className="text-base">{currentQuestion.question}</p>
        
        {inputType === 'text' && (
          <Input
            placeholder="Type your answer here..."
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            className="w-full"
          />
        )}
        
        {inputType === 'email' && (
          <Input
            type="email"
            placeholder="Enter your email address..."
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            className="w-full"
          />
        )}
        
        {inputType === 'number' && (
          <Input
            type="number"
            placeholder="Enter a number..."
            value={numberValue === '' ? '' : numberValue}
            onChange={(e) => setNumberValue(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full"
          />
        )}
        
        {inputType === 'boolean' && (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="boolean-input" 
              checked={booleanValue}
              onCheckedChange={(checked) => setBooleanValue(checked as boolean)} 
            />
            <label
              htmlFor="boolean-input"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Yes, I would like this
            </label>
          </div>
        )}
        
        {inputType === 'single-select' && currentQuestion.options && (
          <RadioGroup value={singleSelectValue} onValueChange={setSingleSelectValue}>
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${option}`} />
                  <Label htmlFor={`option-${option}`}>
                    {currentQuestion.optionLabels?.[index] || option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}
        
        {inputType === 'multi-select' && currentQuestion.options && (
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`option-${option}`}
                  checked={multiSelectValue.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setMultiSelectValue([...multiSelectValue, option]);
                    } else {
                      setMultiSelectValue(multiSelectValue.filter(item => item !== option));
                    }
                  }}
                />
                <label
                  htmlFor={`option-${option}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {currentQuestion.optionLabels?.[index] || option}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={
            loading || 
            (inputType === 'text' && !textValue) ||
            (inputType === 'email' && !textValue) || 
            (inputType === 'number' && numberValue === '') ||
            (inputType === 'single-select' && !singleSelectValue) ||
            (inputType === 'multi-select' && multiSelectValue.length === 0)
          }
        >
          {currentQuestion.step === currentQuestion.totalSteps - 1 ? (
            <>
              Complete <Check className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}