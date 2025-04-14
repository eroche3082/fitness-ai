import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Activity, Check } from 'lucide-react';
import { generateUniqueCode } from '../lib/userCodeGenerator';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [loginMethod, setLoginMethod] = useState<'credentials' | 'accessCode'>('credentials');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [generatedCode, setGeneratedCode] = useState('FIT-VIP-' + Math.floor(1000 + Math.random() * 9000));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (loginMethod === 'credentials') {
      try {
        const success = login(username, password);
        if (success) {
          setLocation('/dashboard');
        } else {
          setError('Invalid credentials. Try with demo/demo123');
        }
      } catch (err) {
        setError('An error occurred while logging in');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Handle access code login
      try {
        // For demo purposes, any code starting with FIT- will work
        if (accessCode && accessCode.startsWith('FIT-')) {
          setLocation('/dashboard');
        } else {
          setError('Invalid access code. Try with ' + generatedCode);
        }
      } catch (err) {
        setError('An error occurred while processing your access code');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDemoLogin = async () => {
    setUsername('demo');
    setPassword('demo123');
    setLoginMethod('credentials');
    setIsLoading(true);
    
    // Short timeout to ensure the state updates before login attempt
    setTimeout(() => {
      try {
        const success = login('demo', 'demo123');
        if (success) {
          setLocation('/dashboard');
        } else {
          setError('Error using demo account. Please try again.');
          console.error('Demo login failed');
        }
      } catch (err) {
        setError('An unexpected error occurred with the demo account');
        console.error('Demo login error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="w-full py-4 fixed top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="link" 
              onClick={() => setLocation('/bridge')}
              className="flex items-center text-gray-900 hover:text-green-500 transition-colors"
            >
              <Activity className="h-6 w-6 mr-2" />
              <h1 className="text-2xl font-bold tracking-tighter">
                <span className="text-gray-900">FITNESS</span>
                <span className="text-blue-600">AI</span>
              </h1>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-24 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">AI Assistant</h2>
            <p className="text-gray-600">Log in to access your fitness platform</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            {/* Tab Navigation */}
            <div className="flex rounded-md bg-gray-100 p-1 mb-6">
              <button
                onClick={() => setLoginMethod('credentials')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors 
                  ${loginMethod === 'credentials'
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'hover:bg-gray-200 text-gray-700'
                  }`}
              >
                Credentials
              </button>
              <button
                onClick={() => setLoginMethod('accessCode')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors 
                  ${loginMethod === 'accessCode'
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'hover:bg-gray-200 text-gray-700'
                  }`}
              >
                Access Code
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 text-red-800 p-3 rounded-md text-sm mb-6">
                {error}
              </div>
            )}

            {/* Credentials Form */}
            {loginMethod === 'credentials' ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm mb-4">
                  <p className="font-semibold mb-1">Login with any of these accounts:</p>
                  <ul className="list-disc list-inside text-xs space-y-1">
                    <li><strong>Username:</strong> demo | <strong>Password:</strong> demo123</li>
                    <li><strong>Username:</strong> admin | <strong>Password:</strong> admin123456</li>
                    <li><strong>Username:</strong> testuser | <strong>Password:</strong> password</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border-gray-300"
                    placeholder="example: admin"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-300"
                    placeholder="example: admin123456"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Login
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            ) : (
              // Access Code Form
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Your Access Code</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Enter the access code generated during onboarding.
                  </p>
                  
                  <form onSubmit={handleSubmit}>
                    <Input
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      className="border-gray-300 mb-4"
                      placeholder={`Example: ${generatedCode}`}
                      required
                    />
                    
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
                    >
                      Access Dashboard
                    </Button>
                  </form>
                </div>
                
                <div className="bg-blue-50 rounded-md p-4 text-center">
                  <p className="text-sm text-blue-800 mb-2">Your code from onboarding:</p>
                  <p className="text-xl font-bold text-blue-700">{generatedCode}</p>
                </div>
                
                <div className="text-center text-sm text-gray-600">
                  <p>Access your personalized dashboard using the code generated during onboarding.</p>
                </div>
              </div>
            )}

            {loginMethod === 'credentials' && (
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-600 mb-4">Don't have an account? Try the demo</p>
                <Button
                  variant="outline"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  Use Demo Account
                </Button>
              </div>
            )}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => setLocation('/bridge')}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              ← Back to main page
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}