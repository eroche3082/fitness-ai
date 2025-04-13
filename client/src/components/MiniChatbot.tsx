import React, { useState, useRef, useEffect } from 'react';

interface Question {
  id: number;
  text: string;
  type: 'text' | 'email' | 'select' | 'multiselect';
  options?: { value: string; label: string }[];
}

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

// Workout exercise interface
interface Exercise {
  name: string;
  reps: number;
  sets: number;
  restTime: number; // in seconds
  instructions: string;
}

// Definir las 10 preguntas para el onboarding
const questions: Question[] = [
  { id: 1, text: "What's your name?", type: 'text' },
  { id: 2, text: "What's your email address?", type: 'email' },
  { 
    id: 3, 
    text: "What's your fitness level?", 
    type: 'select',
    options: [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
    ]
  },
  { 
    id: 4, 
    text: "What are your fitness goals?", 
    type: 'multiselect',
    options: [
      { value: 'lose_weight', label: 'Lose Weight' },
      { value: 'build_muscle', label: 'Build Muscle' },
      { value: 'improve_endurance', label: 'Improve Endurance' },
      { value: 'increase_flexibility', label: 'Increase Flexibility' },
      { value: 'general_fitness', label: 'General Fitness' },
    ]
  },
  { 
    id: 5, 
    text: "Do you have any physical limitations or injuries?", 
    type: 'select',
    options: [
      { value: 'none', label: 'None' },
      { value: 'back_pain', label: 'Back Pain/Issues' },
      { value: 'knee_problems', label: 'Knee Problems' },
      { value: 'shoulder_issues', label: 'Shoulder Issues' },
      { value: 'other', label: 'Other (please specify)' },
    ]
  },
  { 
    id: 6, 
    text: "How many days per week can you dedicate to exercise?", 
    type: 'select',
    options: [
      { value: '1-2', label: '1-2 days' },
      { value: '3-4', label: '3-4 days' },
      { value: '5-6', label: '5-6 days' },
      { value: '7', label: 'Every day' },
    ]
  },
  { 
    id: 7, 
    text: "What types of workouts do you prefer?", 
    type: 'multiselect',
    options: [
      { value: 'cardio', label: 'Cardio' },
      { value: 'strength', label: 'Strength Training' },
      { value: 'hiit', label: 'HIIT' },
      { value: 'yoga', label: 'Yoga/Pilates' },
      { value: 'sports', label: 'Sports' },
      { value: 'outdoor', label: 'Outdoor Activities' },
    ]
  },
  { 
    id: 8, 
    text: "Do you have access to gym equipment?", 
    type: 'select',
    options: [
      { value: 'full_gym', label: 'Full Gym' },
      { value: 'home_equipment', label: 'Some Home Equipment' },
      { value: 'minimal', label: 'Minimal Equipment' },
      { value: 'none', label: 'No Equipment' },
    ]
  },
  { 
    id: 9, 
    text: "Any dietary preferences?", 
    type: 'multiselect',
    options: [
      { value: 'no_preference', label: 'No Specific Preference' },
      { value: 'vegetarian', label: 'Vegetarian' },
      { value: 'vegan', label: 'Vegan' },
      { value: 'keto', label: 'Keto' },
      { value: 'paleo', label: 'Paleo' },
      { value: 'low_carb', label: 'Low Carb' },
    ]
  },
  { 
    id: 10, 
    text: "When do you prefer to work out?", 
    type: 'select',
    options: [
      { value: 'morning', label: 'Morning' },
      { value: 'afternoon', label: 'Afternoon' },
      { value: 'evening', label: 'Evening' },
      { value: 'night', label: 'Night' },
      { value: 'no_preference', label: 'No Preference' },
    ]
  },
];

// Sample workout exercises
const exerciseList: Exercise[] = [
  {
    name: "Push-ups",
    reps: 10,
    sets: 3,
    restTime: 60,
    instructions: "Keep your body straight, lower yourself until your chest nearly touches the floor, then push back up."
  },
  {
    name: "Squats",
    reps: 15,
    sets: 3,
    restTime: 60,
    instructions: "Stand with feet shoulder-width apart, lower your body as if sitting in a chair, then return to standing."
  },
  {
    name: "Lunges",
    reps: 10,
    sets: 3,
    restTime: 45,
    instructions: "Take a step forward, lower your body until both knees are bent at 90-degree angles, then push back to start."
  },
  {
    name: "Plank",
    reps: 1,
    sets: 3,
    restTime: 45,
    instructions: "Hold position for 30 seconds, keeping your body in a straight line from head to heels."
  }
];

export default function MiniChatbot() {
  // States
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'qr' | 'ar' | 'workout'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Welcome to Fitness AI!', sender: 'bot' },
    { text: `Step 1 of 10: ${questions[0].text}`, sender: 'bot' }
  ]);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  
  // Workout-specific states
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [currentSet, setCurrentSet] = useState(1);
  const [repCount, setRepCount] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  
  // Speech synthesis
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Create a new speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice settings
      utterance.rate = 1.0;  // Speech rate
      utterance.pitch = 1.0; // Speech pitch
      utterance.volume = 1.0; // Speech volume
      
      // Select a voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try to find a female English voice
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Female') && voice.lang.includes('en')
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }
      
      // Speak the text
      window.speechSynthesis.speak(utterance);
    } else {
      console.log("Speech synthesis not supported in this browser");
    }
  };
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Toggle chat open/close
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll when messages change
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    scrollToBottom();
  }, [isOpen, messages, currentStep]);

  // Get current question
  const getCurrentQuestion = () => {
    return questions[currentStep - 1] || questions[0];
  };

  // Handle option selection
  const handleOptionSelect = (value: string) => {
    const question = getCurrentQuestion();
    
    if (question.type === 'multiselect') {
      // Toggle the selection
      if (selectedOptions.includes(value)) {
        setSelectedOptions(selectedOptions.filter(option => option !== value));
      } else {
        setSelectedOptions([...selectedOptions, value]);
      }
    } else {
      // For single select, store and proceed
      saveAnswer(value);
      goToNextStep();
    }
  };

  // Save answer
  const saveAnswer = (answer: any) => {
    setAnswers({
      ...answers,
      [currentStep]: answer
    });

    // Add user's answer to chat
    const formattedAnswer = Array.isArray(answer) 
      ? answer.join(', ') 
      : answer;
    setMessages(prev => [...prev, { text: formattedAnswer, sender: 'user' }]);
  };

  // Generate unique code based on user answers
  const generateUniqueCode = (): string => {
    // Get user's fitness level from answers (question 3)
    const fitnessLevel = answers[3] || 'beginner';
    
    // Generate random 4-digit number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    
    // Create code pattern: FIT-[LEVEL]-[RANDOM]
    let levelCode = 'BEG'; // Default
    
    if (typeof fitnessLevel === 'string') {
      if (fitnessLevel.includes('intermediate')) levelCode = 'INT';
      else if (fitnessLevel.includes('advanced')) levelCode = 'ADV';
    }
    
    return `FIT-${levelCode}-${randomNum}`;
  };

  // Handle multi-select submit
  const handleMultiSelectSubmit = () => {
    if (selectedOptions.length > 0) {
      saveAnswer(selectedOptions);
      setSelectedOptions([]);
      goToNextStep();
    }
  };

  // Go to next step
  const goToNextStep = () => {
    if (currentStep < questions.length) {
      // Move to next question
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Add bot message with next question
      const nextQuestion = questions[nextStep - 1];
      setMessages(prev => [...prev, { 
        text: `Step ${nextStep} of 10: ${nextQuestion.text}`, 
        sender: 'bot' 
      }]);
      
      // Clear input for next question
      setInput('');
    } else {
      // Onboarding complete
      setOnboardingComplete(true);
      
      // Generate unique code
      const userCode = generateUniqueCode();
      
      // Show loading message
      setMessages(prev => [...prev, { 
        text: 'Thanks for completing the onboarding! Analyzing your responses...', 
        sender: 'bot' 
      }]);
      
      // Simulate AI analysis (In a real app, this would call Vertex AI)
      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: 'Loading your personalized dashboard...',
          sender: 'bot'
        }]);
        
        // Simulate completion and show code
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: `Your unique access code is: ${userCode}\n\nYou can use this code to unlock your personalized fitness dashboard. Scan the QR code or click the button below to access your dashboard.`,
            sender: 'bot'
          }]);
          
          // Save answers to database with the generated code
          saveToDatabase({
            ...answers,
            uniqueCode: userCode,
            timestamp: new Date().toISOString()
          });
        }, 1000);
      }, 1500);
    }
  };

  // Go to previous step
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      // Remove last two messages (bot question and user answer)
      setMessages(messages.slice(0, -2));

      // Reset selectedOptions
      setSelectedOptions([]);
    }
  };

  // Send message
  const sendMessage = () => {
    if (input.trim() === '') return;
    
    const currentQuestion = getCurrentQuestion();
    
    // Handle different question types
    if (currentQuestion.type === 'text' || currentQuestion.type === 'email') {
      // Add user message
      saveAnswer(input);
      
      // Move to next step
      goToNextStep();
    }
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Simulating database save
  const saveToDatabase = (data: Record<number, any>) => {
    // In a real app, this would be an API call
    setTimeout(() => {
      console.log('User profile saved:', data);
      
      // After saving, prompt user to log in
      setMessages(prev => [...prev, { 
        text: 'Your profile has been saved! Click the button below to log in to your dashboard.', 
        sender: 'bot' 
      }]);
    }, 1000);
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    // In a real app, this would navigate to the login page
    alert('Redirecting to login page...');
  };

  // Render the appropriate input for the current question
  const renderQuestionInput = () => {
    const question = getCurrentQuestion();
    
    switch (question.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={question.type}
            className="w-full p-2 rounded border border-gray-700 bg-black text-white"
            placeholder={question.type === 'email' ? "your@email.com" : "Your answer"}
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            ref={inputRef}
          />
        );
      case 'select':
        return (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {question.options?.map(option => (
              <button
                key={option.value}
                className="w-full text-left p-2 rounded bg-gray-800 hover:bg-gray-700 text-white"
                onClick={() => handleOptionSelect(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        );
      case 'multiselect':
        return (
          <div className="space-y-3">
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {question.options?.map(option => (
                <div
                  key={option.value}
                  className={`w-full text-left p-2 rounded ${
                    selectedOptions.includes(option.value) 
                      ? 'bg-green-700' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  } text-white cursor-pointer`}
                  onClick={() => handleOptionSelect(option.value)}
                >
                  {selectedOptions.includes(option.value) ? '✓ ' : ''}{option.label}
                </div>
              ))}
            </div>
            <button
              className="w-full p-2 bg-green-600 hover:bg-green-700 text-white rounded"
              onClick={handleMultiSelectSubmit}
              disabled={selectedOptions.length === 0}
            >
              Continue
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat icon button when closed */}
      {!isOpen ? (
        <button 
          onClick={toggleChat}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-green-600 shadow-lg hover:bg-green-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      ) : (
        /* Chat window when open */
        <div className="w-[350px] h-[500px] bg-black rounded-lg shadow-xl flex flex-col border border-green-600">
          {/* Chat header */}
          <div className="bg-green-600 p-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className="font-bold">Fitness AI Assistant</span>
            </div>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          {/* Tab navigation */}
          <div className="flex flex-wrap border-b border-gray-800">
            <button 
              className={`flex-1 py-2 px-2 ${activeTab === 'chat' ? 'bg-white text-green-700 font-medium' : 'text-gray-300 bg-gray-900 hover:bg-gray-800'}`}
              onClick={() => setActiveTab('chat')}
            >
              Chat
            </button>
            <button 
              className={`flex-1 py-2 px-2 ${activeTab === 'workout' ? 'bg-white text-green-700 font-medium' : 'text-gray-300 bg-gray-900 hover:bg-gray-800'}`}
              onClick={() => setActiveTab('workout')}
            >
              Workout
            </button>
            <button 
              className={`flex-1 py-2 px-2 ${activeTab === 'qr' ? 'bg-white text-green-700 font-medium' : 'text-gray-300 bg-gray-900 hover:bg-gray-800'}`}
              onClick={() => setActiveTab('qr')}
            >
              QR Code
            </button>
            <button 
              className={`flex-1 py-2 px-2 ${activeTab === 'ar' ? 'bg-white text-green-700 font-medium' : 'text-gray-300 bg-gray-900 hover:bg-gray-800'}`}
              onClick={() => setActiveTab('ar')}
            >
              AR/VR
            </button>
          </div>
          
          {/* Tab Content */}
          {activeTab === 'chat' && (
            // Chat messages
            <div className="flex-1 overflow-y-auto p-3 bg-black">
              <div className="space-y-3">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-2 rounded-lg ${
                      msg.sender === 'user' ? 'bg-green-600 text-white' : 'bg-gray-800 text-white'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
          
          {activeTab === 'qr' && (
            // QR Code content
            <div className="flex-1 overflow-y-auto p-3 bg-black flex flex-col items-center justify-center">
              <div className="bg-white p-4 rounded-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 29 29">
                  <path d="M4 4h1v1H4zm1 0h1v1H5zm1 0h1v1H6zm1 0h1v1H7zm1 0h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zM4 5h1v1H4zm4 0h1v1H8zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm5 0h1v1h-1zm4 0h1v1h-1zM4 6h1v1H4zm2 0h1v1H6zm1 0h1v1H7zm1 0h1v1H8zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zM4 7h1v1H4zm2 0h1v1H6zm1 0h1v1H7zm1 0h1v1H8zm2 0h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zM4 8h1v1H4zm2 0h1v1H6zm1 0h1v1H7zm1 0h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm4 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zM4 9h1v1H4zm4 0h1v1H8zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm4 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zM4 10h1v1H4zm1 0h1v1H5zm1 0h1v1H6zm1 0h1v1H7zm1 0h1v1H8zm1 0h1v1H9zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm0 1h1v1h-1zm-3 1h1v1h-1zm-2 1h1v1h-1zm-9 0h1v1h-1zm-5 1h1v1H4zm1 0h1v1H5zm1 0h1v1H6zm1 0h1v1H7zm1 0h1v1H8zm1 0h1v1H9zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm4 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 1h1v1h-1zm-1 1h1v1h-1zm-5 0h1v1h-1zm-10 0h1v1h-1zm-3 0h1v1H9zm-1 0h1v1H8zm-2 0h1v1H6zm-2 0h1v1H4zm8 1h1v1h-1zm4 0h1v1h-1zm3 0h1v1h-1zm-15 1h1v1H4zm4 0h1v1H8zm1 0h1v1H9zm2 0h1v1h-1zm3 0h1v1h-1zm3 0h1v1h-1zm6 0h1v1h-1zM4 20h1v1H4zm2 0h1v1H6zm1 0h1v1H7zm1 0h1v1H8zm1 0h1v1H9zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zM4 21h1v1H4zm4 0h1v1H8zm2 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zM4 22h1v1H4zm2 0h1v1H6zm1 0h1v1H7zm1 0h1v1H8zm2 0h1v1h-1zm4 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm4 0h1v1h-1zm1 0h1v1h-1zM4 23h1v1H4zm2 0h1v1H6zm1 0h1v1H7zm1 0h1v1H8zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zM4 24h1v1H4zm4 0h1v1H8zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zM4 25h1v1H4zm1 0h1v1H5zm1 0h1v1H6zm1 0h1v1H7zm1 0h1v1H8zm1 0h1v1H9zm1 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1z" fill="currentColor"/>
                </svg>
              </div>
              <div className="text-center text-white">
                <h4 className="text-lg font-bold mb-2">Download Fitness AI App</h4>
                <p className="text-sm text-gray-300 mb-4">Scan this QR code with your phone's camera to download our mobile app</p>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                  Share QR Code
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'workout' && (
            // Voice Coach with Rep Counter
            <div className="flex-1 overflow-y-auto p-3 bg-black flex flex-col">
              <div className="text-center mb-4">
                <h3 className="text-lg text-white font-bold">Voice Coached Workout</h3>
                <p className="text-sm text-gray-300">Follow along with voice instructions and automatic rep counting</p>
              </div>
              
              {!currentExercise && !workoutComplete ? (
                // Exercise selection
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="text-white text-center mb-4">Select a workout to begin</h4>
                  <div className="space-y-2">
                    {exerciseList.map((exercise, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentExercise(exercise);
                          setCurrentSet(1);
                          setRepCount(0);
                          setIsResting(false);
                          setWorkoutComplete(false);
                        }}
                        className="w-full p-3 bg-gray-800 hover:bg-gray-700 text-white text-left rounded flex justify-between items-center"
                      >
                        <span>{exercise.name}</span>
                        <span>{exercise.sets} sets × {exercise.reps} reps</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : workoutComplete ? (
                // Workout complete screen
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="bg-green-800 rounded-full p-4 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <h3 className="text-xl text-white font-bold mb-2">Workout Complete!</h3>
                  <p className="text-gray-300 mb-6 text-center">Great job! You've finished your workout session.</p>
                  <button 
                    onClick={() => {
                      setCurrentExercise(null);
                      setWorkoutComplete(false);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Start New Workout
                  </button>
                </div>
              ) : isResting ? (
                // Rest timer screen
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="mb-4 text-white text-center">
                    <h3 className="text-xl font-bold mb-2">Rest Time</h3>
                    <p className="text-5xl font-bold">{restTimeLeft}s</p>
                    <p className="mt-2 text-gray-300">Next: Set {currentSet + 1} of {currentExercise.sets}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setIsResting(false);
                      setCurrentSet(currentSet + 1);
                      setRepCount(0);
                    }}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    Skip Rest
                  </button>
                </div>
              ) : (
                // Active exercise screen
                <div className="flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-xl text-white font-bold">{currentExercise.name}</h3>
                    <p className="text-sm text-gray-300">{currentExercise.instructions}</p>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="relative mb-8">
                      <div className="text-7xl font-bold text-white mb-2 text-center">{repCount}</div>
                      <div className="text-gray-400 text-center">of {currentExercise.reps} reps</div>
                      <div className="text-sm text-green-500 mt-2 text-center">Set {currentSet} of {currentExercise.sets}</div>
                    </div>
                    
                    <div className="space-y-3 w-full">
                      {isListening ? (
                        <button 
                          onClick={() => {
                            setIsListening(false);
                            
                            // Stop any ongoing speech
                            if ('speechSynthesis' in window) {
                              window.speechSynthesis.cancel();
                            }
                            
                            // Say goodbye
                            speak("Workout stopped.");
                            
                            // Simulate completing the set
                            if (currentSet < currentExercise.sets) {
                              setIsResting(true);
                              setRestTimeLeft(currentExercise.restTime);
                              // Simulate rest timer (in a real app, this would be a proper interval)
                              const timer = setInterval(() => {
                                setRestTimeLeft(prev => {
                                  if (prev <= 1) {
                                    clearInterval(timer);
                                    setIsResting(false);
                                    setCurrentSet(currentSet + 1);
                                    setRepCount(0);
                                    return 0;
                                  }
                                  return prev - 1;
                                });
                              }, 1000);
                            } else {
                              // Workout complete
                              setWorkoutComplete(true);
                              setCurrentExercise(null);
                            }
                          }}
                          className="w-full p-3 bg-red-600 hover:bg-red-700 text-white rounded flex items-center justify-center gap-2"
                        >
                          <span>Stop Listening</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="6" y="4" width="4" height="16"/>
                            <rect x="14" y="4" width="4" height="16"/>
                          </svg>
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            setIsListening(true);
                            
                            // Speak initial instructions
                            if (currentExercise) {
                              speak(`Let's start with ${currentExercise.name}. Set ${currentSet} of ${currentExercise.sets}. ${currentExercise.instructions}`);
                            }
                            
                            // Simulate rep counting (in a real app, this would use voice recognition)
                            const repInterval = setInterval(() => {
                              setRepCount(prev => {
                                const newRepCount = prev + 1;
                                
                                // Speak the rep count
                                if (currentExercise) {
                                  speak(`${newRepCount}`);
                                  
                                  // For the last few reps, add encouragement
                                  if (newRepCount >= currentExercise.reps - 2 && newRepCount < currentExercise.reps) {
                                    setTimeout(() => speak("Almost there! Keep pushing!"), 800);
                                  }
                                
                                  // When all reps are completed
                                  if (newRepCount >= currentExercise.reps) {
                                    clearInterval(repInterval);
                                    setIsListening(false);
                                    
                                    // Speak completion message
                                    setTimeout(() => {
                                      speak("Great job! Set completed.");
                                      
                                      if (currentSet < currentExercise.sets) {
                                        setIsResting(true);
                                        setRestTimeLeft(currentExercise.restTime);
                                        speak(`Take a ${currentExercise.restTime} second rest.`);
                                        
                                        // Simulate rest timer
                                        const timer = setInterval(() => {
                                          setRestTimeLeft(prev => {
                                            // Speak countdown at specific intervals
                                            if (prev === 30 || prev === 20 || prev === 10 || prev === 5) {
                                              speak(`${prev} seconds remaining.`);
                                            } else if (prev === 3) {
                                              speak("Get ready. 3 seconds left.");
                                            }
                                            
                                            if (prev <= 1) {
                                              clearInterval(timer);
                                              setIsResting(false);
                                              setCurrentSet(currentSet + 1);
                                              setRepCount(0);
                                              // Announce next set
                                              setTimeout(() => {
                                                speak(`Starting set ${currentSet + 1}. Get ready!`);
                                              }, 500);
                                              return 0;
                                            }
                                            return prev - 1;
                                          });
                                        }, 1000);
                                      } else {
                                        // Workout complete
                                        speak("Congratulations! You've completed all sets of this exercise!");
                                        setWorkoutComplete(true);
                                        setCurrentExercise(null);
                                      }
                                    }, 500);
                                    
                                    return currentExercise.reps;
                                  }
                                }
                                return newRepCount;
                              });
                            }, 1500); // Count a rep every 1.5 seconds for demo purposes
                          }}
                          className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded flex items-center justify-center gap-2"
                        >
                          <span>Start Voice Counting</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                            <line x1="12" y1="19" x2="12" y2="23"/>
                            <line x1="8" y1="23" x2="16" y2="23"/>
                          </svg>
                        </button>
                      )}
                      
                      <button 
                        onClick={() => {
                          // Cancel any ongoing speech
                          if ('speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                          }
                          
                          // Announce exit
                          speak("Exiting workout mode.");
                          
                          setCurrentExercise(null);
                          setWorkoutComplete(false);
                        }}
                        className="w-full p-3 bg-gray-700 hover:bg-gray-600 text-white rounded"
                      >
                        Exit Workout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'ar' && (
            // AR/VR content
            <div className="flex-1 overflow-y-auto p-3 bg-black flex flex-col items-center justify-center">
              <div className="mb-4 bg-gray-800 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mx-auto">
                  <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0M4 12a8 8 0 1 1 16 0M12 2v2M12 20v2M2 12h2M20 12h2"/>
                  <path d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0M9.5 9.5l5 5M9.5 14.5l5-5"/>
                </svg>
              </div>
              <div className="text-center text-white">
                <h4 className="text-lg font-bold mb-2">AR Workout Experience</h4>
                <p className="text-sm text-gray-300 mb-4">Experience personalized workouts in augmented reality with a virtual trainer</p>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mb-2 w-full">
                  Launch AR Workout
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded w-full">
                  View VR Gym Tour
                </button>
              </div>
            </div>
          )}
          
          {/* Onboarding input box - only show for chat tab */}
          {activeTab === 'chat' && (
            <div className="p-3 border-t border-gray-800 bg-gray-900">
              {onboardingComplete ? (
                <div className="bg-[#131313] rounded-lg p-3">
                  <button
                    className="w-full p-2 bg-green-600 hover:bg-green-700 text-white rounded"
                    onClick={handleLoginRedirect}
                  >
                    Login to Dashboard
                  </button>
                </div>
              ) : (
                <div className="bg-[#131313] rounded-lg p-3 mb-3">
                  <h3 className="text-white text-lg mb-1">Welcome to Fitness AI</h3>
                  <p className="text-gray-300 text-sm mb-2">
                    Step {currentStep} of 10: {getCurrentQuestion().text}
                  </p>
                  
                  {renderQuestionInput()}
                  
                  {currentStep > 1 && (
                    <div className="mt-3 flex justify-start">
                      <button 
                        className="bg-gray-700 text-white px-3 py-1 rounded text-sm"
                        onClick={goToPreviousStep}
                      >
                        Back
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {!onboardingComplete && (getCurrentQuestion().type === 'text' || getCurrentQuestion().type === 'email') && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 p-2 rounded-l-lg border border-gray-700 bg-black text-white"
                    placeholder="Message Fitness AI..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                  />
                  <button 
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-r-lg"
                    onClick={sendMessage}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Footer for QR and AR tabs */}
          {activeTab !== 'chat' && (
            <div className="p-3 border-t border-gray-800 bg-gray-900">
              <button
                className="w-full p-2 bg-green-600 hover:bg-green-700 text-white rounded"
                onClick={() => {
                  // Cancel any ongoing speech when switching tabs
                  if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                  setActiveTab('chat');
                }}
              >
                Return to Chat
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}