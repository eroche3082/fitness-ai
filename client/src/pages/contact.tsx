import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Activity, Send, MapPin, Phone, Mail, CheckCircle, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1000);
  };

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
          
          <nav className="hidden md:flex items-center space-x-6">
            <Button 
              variant="link" 
              onClick={() => setLocation('/bridge')}
              className="text-white hover:text-green-500 transition-colors uppercase font-medium"
            >
              Home
            </Button>
            <Button 
              variant="link" 
              onClick={() => setLocation('/about')}
              className="text-white hover:text-green-500 transition-colors uppercase font-medium"
            >
              About Us
            </Button>
            <Button 
              variant="link" 
              onClick={() => setLocation('/programs')}
              className="text-white hover:text-green-500 transition-colors uppercase font-medium"
            >
              Programs
            </Button>
            <Button 
              variant="link" 
              onClick={() => setLocation('/contact')}
              className="text-green-500 hover:text-green-400 transition-colors uppercase font-medium"
            >
              Contact Us
            </Button>
          </nav>
          
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => setLocation('/login')}
              className="border-green-500 text-white hover:bg-green-500 hover:text-black hidden md:block"
            >
              LOGIN
            </Button>
            <Button
              onClick={() => setLocation('/signup')}
              className="bg-green-500 text-black hover:bg-green-600 hidden md:block"
            >
              SIGN UP
            </Button>
            <Button
              variant="ghost"
              className="md:hidden text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/20 to-transparent"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
              <p className="text-xl text-gray-300 mb-8">
                We're here to help. Get in touch with our team for any questions or support you need.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                {isSubmitted ? (
                  <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
                    <div className="text-center">
                      <div className="flex justify-center mb-6">
                        <div className="rounded-full bg-green-500/20 p-3">
                          <CheckCircle className="h-12 w-12 text-green-500" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold mb-4">Message Sent!</h2>
                      <p className="text-gray-300 mb-6">
                        Thank you for contacting us. We have received your message and will respond as soon as possible.
                      </p>
                      <Button
                        onClick={() => setIsSubmitted(false)}
                        className="bg-green-500 hover:bg-green-600 text-black"
                      >
                        Send another message
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
                    <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="bg-gray-800 border-gray-700 text-white"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="bg-gray-800 border-gray-700 text-white"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone (optional)</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="bg-gray-800 border-gray-700 text-white"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          className="bg-gray-800 border-gray-700 text-white min-h-[150px]"
                          required
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-500 hover:bg-green-600 text-black"
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                            <span>Sending...</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Send className="mr-2 h-4 w-4" />
                            <span>Send Message</span>
                          </div>
                        )}
                      </Button>
                    </form>
                  </div>
                )}
              </div>
              
              {/* Contact Info */}
              <div>
                <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 mb-8">
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-4 flex-shrink-0">
                        <MapPin className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">Address</h3>
                        <p className="text-gray-300">
                          123 Innovation Avenue<br />
                          New York, NY 10001
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-4 flex-shrink-0">
                        <Phone className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">Phone</h3>
                        <p className="text-gray-300">
                          +1 (800) 123-4567<br />
                          Mon-Fri: 9:00 AM - 6:00 PM
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-4 flex-shrink-0">
                        <Mail className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">Email</h3>
                        <p className="text-gray-300">
                          info@fitnessai.com<br />
                          support@fitnessai.com
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
                  <h2 className="text-2xl font-bold mb-6">Service Hours</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-gray-800 pb-2">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-800 pb-2">
                      <span>Saturday</span>
                      <span>10:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-300">
                Answers to the most common questions about our services
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">How do I get started with Fitness AI?</h3>
                <p className="text-gray-300">
                  Simply register on our platform, complete the initial assessment questionnaire, and our system will automatically generate a personalized program for you.
                </p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Can I change programs once I've started?</h3>
                <p className="text-gray-300">
                  Yes, you can change programs at any time from your dashboard. However, we recommend completing at least 4 weeks of your current program to see significant results.
                </p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">How does device integration work?</h3>
                <p className="text-gray-300">
                  Fitness AI connects with major platforms like Google Fit, Apple Health, Fitbit, and Strava. You simply need to authorize the connection from your account and we'll automatically sync your activity data.
                </p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Do you offer support for specific diets?</h3>
                <p className="text-gray-300">
                  Yes, our nutritional plans can be adapted to various dietary needs, including vegetarian, vegan, ketogenic, paleo, gluten-free, and more. Simply indicate your preferences in your profile.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-green-500 text-black">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to transform your workout?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join our community and discover how artificial intelligence can enhance your results.
            </p>
            <Button
              onClick={() => setLocation('/signup')}
              size="lg"
              className="bg-black text-white hover:bg-gray-800"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Activity className="h-6 w-6 text-green-500 mr-2" />
              <span className="text-xl font-bold">
                <span className="text-white">FITNESS</span>
                <span className="text-green-500">AI</span>
              </span>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-6 mb-6 md:mb-0">
              <Button 
                variant="link" 
                onClick={() => setLocation('/bridge')}
                className="text-gray-300 hover:text-white"
              >
                Home
              </Button>
              <Button 
                variant="link" 
                onClick={() => setLocation('/about')}
                className="text-gray-300 hover:text-white"
              >
                About Us
              </Button>
              <Button 
                variant="link" 
                onClick={() => setLocation('/programs')}
                className="text-gray-300 hover:text-white"
              >
                Programs
              </Button>
              <Button 
                variant="link" 
                onClick={() => setLocation('/contact')}
                className="text-gray-300 hover:text-white"
              >
                Contact Us
              </Button>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Fitness AI. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}