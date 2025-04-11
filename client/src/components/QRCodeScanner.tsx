import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { QrCode, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

// Note: In a real implementation, you would install and import a QR code scanner library
// For example: import { Html5Qrcode } from "html5-qrcode";

export default function QRCodeScanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  // Start camera for QR scanning
  const startScanner = async () => {
    try {
      if (!videoRef.current) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      
      setScanning(true);
      
      // In a real implementation, we would use a QR code scanning library here
      // For the demo, we'll simulate finding a QR code after a delay
      
      setTimeout(() => {
        // Simulate finding a QR code
        const simulatedQRValue = "fitness-plan:advanced-hiit-workout-12345";
        handleScanResult(simulatedQRValue);
      }, 3000);
      
    } catch (error) {
      console.error("Error accessing camera for QR scanning:", error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera for QR scanning. Please check permissions and try again.",
        variant: "destructive",
      });
      setScanning(false);
    }
  };

  // Stop scanner
  const stopScanner = () => {
    setScanning(false);
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Handle scan result
  const handleScanResult = (qrCode: string) => {
    setScanResult(qrCode);
    stopScanner();
    
    // Process the QR code
    processQRCode(qrCode);
  };

  // Process QR code
  const processQRCode = async (qrCode: string) => {
    setProcessing(true);
    
    try {
      // In a real implementation, we would make an API call to fetch data based on the QR code
      // For now, we'll simulate a delay and then provide a placeholder response
      
      setTimeout(() => {
        // Parse the QR code (assuming format: "fitness-plan:type-id")
        const [prefix, content] = qrCode.split(':');
        
        if (prefix === 'fitness-plan') {
          // Simulated response for a fitness plan QR code
          setResult(`
## Advanced HIIT Workout Plan

This high-intensity interval training workout is designed to improve cardiovascular fitness, build strength and burn calories efficiently.

### Workout Details
- **Duration**: 30 minutes
- **Difficulty**: Advanced
- **Equipment**: Minimal (dumbbells optional)
- **Focus Areas**: Full body, cardio, core

### Circuit (Repeat 4x)
1. **Burpees** - 45 seconds (15 seconds rest)
2. **Mountain Climbers** - 45 seconds (15 seconds rest)
3. **Jump Squats** - 45 seconds (15 seconds rest)
4. **Push-ups** - 45 seconds (15 seconds rest)
5. **Plank Jacks** - 45 seconds (15 seconds rest)

### Rest between circuits: 60 seconds

This workout has been added to your routines. Would you like to schedule it now?
          `);
        } else {
          // Unknown QR code format
          setResult("Unknown QR code format. Please scan a valid Fitness AI QR code.");
        }
        
        setProcessing(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error processing QR code:", error);
      toast({
        title: "Error",
        description: "Failed to process the QR code. Please try again.",
        variant: "destructive",
      });
      setProcessing(false);
    }
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setIsOpen(false);
    setScanning(false);
    setScanResult(null);
    setResult(null);
    stopScanner();
  };

  // Reset scanner
  const resetScanner = () => {
    setScanResult(null);
    setResult(null);
    setProcessing(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="flex items-center gap-2">
          <QrCode className="h-4 w-4" />
          <span>Scan QR</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code Scanner</DialogTitle>
          <DialogDescription>
            Scan a Fitness AI QR code to unlock workout plans, nutrition info, or special challenges.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          {!scanResult && !result && (
            <>
              <div className="relative rounded-md overflow-hidden w-full aspect-video bg-muted">
                {scanning ? (
                  <>
                    <video 
                      ref={videoRef} 
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      autoPlay 
                      playsInline 
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="border-2 border-primary w-48 h-48 rounded-md"></div>
                    </div>
                    <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-white bg-black/50 py-1">
                      Position QR code in the center
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <QrCode className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              {!scanning ? (
                <Button 
                  onClick={startScanner}
                  className="flex items-center gap-2"
                >
                  <QrCode className="h-4 w-4" />
                  <span>Start Scanning</span>
                </Button>
              ) : (
                <Button 
                  onClick={stopScanner}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel Scanning</span>
                </Button>
              )}
            </>
          )}
          
          {processing && (
            <div className="flex flex-col items-center justify-center gap-2 py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Processing QR code...</p>
            </div>
          )}
          
          {result && (
            <>
              <div className="bg-muted p-4 rounded-md max-h-64 overflow-y-auto w-full">
                <div className="prose prose-sm">
                  <div dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br>') }} />
                </div>
              </div>
              
              <Button 
                onClick={resetScanner}
                variant="outline"
                className="flex items-center gap-2"
              >
                <QrCode className="h-4 w-4" />
                <span>Scan Another</span>
              </Button>
            </>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={handleDialogClose}>Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}