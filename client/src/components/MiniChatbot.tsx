import React, { useState, useRef, useEffect } from 'react';

interface Question {
  id: number;
  text: string;
  type: 'text' | 'email' | 'select' | 'multiselect';
  options?: { value: string; label: string }[];
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

export default function MiniChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [messages, setMessages] = useState([
    { text: 'Welcome to Vertex Flash AI!', sender: 'bot' },
    { text: `Step 1 of 10: ${questions[0].text}`, sender: 'bot' }
  ]);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    scrollToBottom();
  }, [isOpen, messages, currentStep]);

  const getCurrentQuestion = () => {
    return questions[currentStep - 1] || questions[0];
  };

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

  const handleMultiSelectSubmit = () => {
    if (selectedOptions.length > 0) {
      saveAnswer(selectedOptions);
      setSelectedOptions([]);
      goToNextStep();
    }
  };

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
      setMessages(prev => [...prev, { 
        text: 'Thanks for completing the onboarding! Your personalized fitness plan is being created by Fitness AI. You can now login to your dashboard.', 
        sender: 'bot' 
      }]);

      // Save answers to database (In a real app, this would be an API call)
      console.log('Onboarding answers:', answers);
      saveToDatabase(answers);
    }
  };

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
      
      // In a real app, this could redirect to login
    }, 1000);
  };

  const handleLoginRedirect = () => {
    // In a real app, this would navigate to the login page
    alert('Redirecting to login page...');
  };

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
          <div className="flex border-b border-gray-800">
            <button className="flex-1 py-2 px-4 bg-white text-green-700 font-medium">Chat</button>
            <button className="flex-1 py-2 px-4 text-gray-300 bg-gray-900">QR Code</button>
            <button className="flex-1 py-2 px-4 text-gray-300 bg-gray-900">AR/VR</button>
          </div>
          
          {/* Chat messages */}
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
          
          {/* Onboarding input box */}
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
        </div>
      )}
    </div>
  );
}