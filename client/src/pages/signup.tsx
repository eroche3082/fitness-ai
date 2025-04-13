import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Activity, CheckCircle, User } from 'lucide-react';
import { useAuth } from '../App';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validations
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success state
      setSuccess(true);
      
      // Auto login after 2 seconds
      setTimeout(() => {
        login(formData.username, formData.password);
        setLocation('/dashboard');
      }, 2000);
    } catch (err) {
      setError('An error occurred while registering your account');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="w-full py-4 fixed top-0 z-50">
          <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
            <div className="flex items-center">
              <Button 
                variant="link" 
                onClick={() => setLocation('/bridge')}
                className="flex items-center text-white hover:text-green-500 transition-colors"
              >
                <Activity className="h-6 w-6 mr-2" />
                <h1 className="text-3xl font-bold tracking-tighter">
                  <span className="text-white">FITNESS</span>
                  <span className="text-green-500">AI</span>
                </h1>
              </Button>
            </div>
          </div>
        </header>

        {/* Success Screen */}
        <main className="container mx-auto px-4 py-24 flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-500/20 p-3">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">Registration Successful!</h2>
            <p className="text-gray-400 mb-8">
              Your account has been created successfully. You are being redirected to the dashboard...
            </p>
            <div className="flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="w-full py-4 fixed top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="link" 
              onClick={() => setLocation('/bridge')}
              className="flex items-center text-white hover:text-green-500 transition-colors"
            >
              <Activity className="h-6 w-6 mr-2" />
              <h1 className="text-3xl font-bold tracking-tighter">
                <span className="text-white">FITNESS</span>
                <span className="text-green-500">AI</span>
              </h1>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-24 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Create Your Account</h2>
            <p className="text-gray-400">Join Fitness AI and start your transformation</p>
          </div>

          <div className="bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-800">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-900/40 text-red-200 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="username123"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Repeat your password"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 mt-6"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Crear Cuenta
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-400 mb-2">¿Ya tienes una cuenta?</p>
            <button
              onClick={() => setLocation('/login')}
              className="text-green-500 hover:text-green-400 font-medium"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}