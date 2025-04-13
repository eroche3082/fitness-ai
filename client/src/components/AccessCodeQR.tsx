import React, { useState } from 'react';
import { Share2, Download, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfile } from '../shared/types';
import { useToast } from '@/hooks/use-toast';
import QRCodeDisplay from './QRCodeDisplay';

interface AccessCodeQRProps {
  userProfile: UserProfile;
}

const AccessCodeQR: React.FC<AccessCodeQRProps> = ({ userProfile }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const dashboardUrl = `${window.location.origin}/dashboard?code=${userProfile.uniqueCode}`;
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Fitness AI Access Code',
          text: `Join me on Fitness AI! Use my access code: ${userProfile.uniqueCode}`,
          url: dashboardUrl,
        });
        
        toast({
          title: 'Shared Successfully',
          description: 'Your access code has been shared!',
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      handleCopyLink();
    }
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(dashboardUrl);
    setCopied(true);
    
    toast({
      title: 'Link Copied',
      description: 'Your access link has been copied to clipboard!',
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownloadQR = () => {
    const canvas = document.getElementById('access-qr-code')?.querySelector('canvas');
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `fitness-ai-${userProfile.uniqueCode}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    toast({
      title: 'QR Code Downloaded',
      description: 'Your QR code has been downloaded successfully!',
    });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Your Access Code</h2>
      
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div id="access-qr-code" className="bg-white p-4 rounded-lg shadow-sm">
          <QRCodeDisplay code={dashboardUrl} size={180} />
        </div>
        
        <div className="flex-1">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-1">Access Code</h3>
            <div className="flex items-center">
              <span className="text-2xl font-bold tracking-wide">{userProfile.uniqueCode}</span>
              <Button
                size="sm"
                variant="ghost"
                className="ml-2"
                onClick={handleCopyLink}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Level: {userProfile.category} • Status: {userProfile.paymentStatus.charAt(0).toUpperCase() + userProfile.paymentStatus.slice(1)}
            </p>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Use this QR code to quickly access your personalized dashboard. 
            Share with friends to earn rewards!
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleShare}
            >
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDownloadQR}
            >
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-3">How to Use Your Access Code</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 mr-2">1</span>
            <span className="text-gray-700 dark:text-gray-300">Scan the QR code with your mobile device to access your dashboard instantly</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 mr-2">2</span>
            <span className="text-gray-700 dark:text-gray-300">Share your code with friends to earn referral points and unlock premium features</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 mr-2">3</span>
            <span className="text-gray-700 dark:text-gray-300">Use your code to activate premium features and access personalized content</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AccessCodeQR;