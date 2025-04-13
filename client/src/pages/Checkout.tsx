import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  amount: number;
  plan: string;
}

const CheckoutForm = ({ amount, plan }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      toast({
        title: "Error",
        description: "Stripe has not initialized yet. Please try again in a moment.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success?plan=${plan}`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: "Thank you for your purchase!",
        });
        // Payment is successful, redirect is automatic from Stripe
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      <PaymentElement />
      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3"
          disabled={!stripe || isLoading}
        >
          {isLoading ? "Processing..." : `Pay $${(amount/100).toFixed(2)}`}
        </Button>
      </div>
      <div className="text-center text-sm text-gray-400">
        By completing this purchase, you agree to our Terms and Conditions and Privacy Policy.
      </div>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [searchParams, setLocation] = useLocation();
  const [planDetails, setPlanDetails] = useState({ name: "Pro Plan", amount: 1999, interval: "month" });
  const { toast } = useToast();
  
  // Extract plan from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan") || "pro";
    
    // Set the correct plan details based on URL param
    if (plan === "elite") {
      setPlanDetails({ name: "Elite Plan", amount: 4999, interval: "month" });
    } else {
      setPlanDetails({ name: "Pro Plan", amount: 1999, interval: "month" });
    }
  }, []);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads and plan is determined
    if (planDetails.amount > 0) {
      apiRequest("POST", "/api/create-payment-intent", { 
        amount: planDetails.amount,
        plan: planDetails.name
      }, undefined)
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            toast({
              title: "Error",
              description: "Could not initialize payment. Please try again later.",
              variant: "destructive",
            });
          }
        })
        .catch(err => {
          toast({
            title: "Error",
            description: "Could not connect to the server. Please try again later.",
            variant: "destructive",
          });
        });
    }
  }, [planDetails]);

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mr-2" aria-label="Loading"/>
        <span>Initializing payment...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center">Checkout</h1>
          <p className="text-center text-gray-400 mb-8">Complete your payment to access premium features</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription className="text-gray-400">
                    Enter your card information to complete the purchase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                    <CheckoutForm amount={planDetails.amount} plan={planDetails.name.toLowerCase().replace(" plan", "")} />
                  </Elements>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-1">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">{planDetails.name}</span>
                      <span>${(planDetails.amount/100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Billing Interval</span>
                      <span className="capitalize">{planDetails.interval}</span>
                    </div>
                    <Separator className="my-3 bg-gray-700" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${(planDetails.amount/100).toFixed(2)}/{planDetails.interval}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col text-sm text-gray-400 space-y-2">
                  <p>
                    Your subscription will automatically renew each {planDetails.interval}.
                  </p>
                  <p>
                    You can cancel anytime from your account.
                  </p>
                </CardFooter>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700 mt-6">
                <CardHeader>
                  <CardTitle className="text-sm">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-400">
                  <p className="mb-2">
                    If you have any questions, please contact our support team:
                  </p>
                  <p className="text-green-500">
                    support@fitnessai.com
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};