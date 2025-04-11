import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Loader2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FormCheckAnalyzer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file (.jpg, .png, etc.)",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setResult(null); // Clear any previous results
    };
    reader.readAsDataURL(file);
  };

  // Handle camera capture
  const handleCameraCapture = async () => {
    try {
      if (!videoRef.current || !canvasRef.current) return;

      // Draw the current video frame to the canvas
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;

      context.drawImage(
        videoRef.current,
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Convert canvas to image
      const capturedImage = canvas.toDataURL("image/png");
      setImage(capturedImage);
      
      // Stop the camera stream
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      
      setResult(null); // Clear any previous results
    } catch (error) {
      console.error("Error capturing image:", error);
      toast({
        title: "Error",
        description: "Failed to capture image. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Start camera when the tab is selected
  const startCamera = async () => {
    try {
      if (!videoRef.current) return;

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions and try again.",
        variant: "destructive",
      });
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setImage(null);
    setResult(null);

    if (value === "camera") {
      startCamera();
    } else {
      // Stop camera if we're switching away from camera tab
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  };

  // Clear selected image
  const clearImage = () => {
    setImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Analyze image for form check
  const analyzeImage = async () => {
    if (!image) return;

    setAnalyzing(true);
    setResult(null);

    try {
      // In a real implementation, we would send the image to a server for analysis
      // For now, we'll simulate a delay and then provide a placeholder response
      
      setTimeout(() => {
        // Simulated analysis result - in production this would use Google Cloud Vision AI
        setResult(`
## Form Analysis Results

### Squat Form Assessment

✅ **Good elements:**
- Feet placement appears correctly at shoulder width
- Back is straight, avoiding excessive rounding
- Depth is appropriate (thighs parallel to ground)

⚠️ **Areas for improvement:**
- Your knees are slightly tracking inward - focus on pushing them outward in line with toes
- There appears to be some forward lean - try maintaining more upright torso
- Weight distribution may be favoring the front of foot - aim for midfoot/heel balance

### Recommendations

1. Try "box squats" to practice correct depth with better form control
2. Consider mobility work for ankles if heel lifting is an issue
3. Use the cue "spread the floor" to engage glutes and prevent knee cave

Would you like specific exercises to help with these form corrections?
        `);
        setAnalyzing(false);
      }, 2500);
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
      setAnalyzing(false);
    }
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setIsOpen(false);
    setImage(null);
    setResult(null);
    
    // Stop camera if it's running
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="flex items-center gap-2">
          <Camera className="h-4 w-4" />
          <span>Form Check</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Form Check Analysis</DialogTitle>
          <DialogDescription>
            Upload or capture a photo of your exercise form for AI analysis and get personalized feedback.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
            <TabsTrigger value="camera">Use Camera</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="pt-4">
            {image ? (
              <div className="relative">
                <img 
                  src={image} 
                  alt="Uploaded exercise form" 
                  className="rounded-md object-contain max-h-64 mx-auto" 
                />
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="absolute top-2 right-2 rounded-full p-2" 
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Select Image</span>
                </Button>
                <p className="text-sm text-muted-foreground">
                  For best results, upload a side-view of your exercise form.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="camera" className="pt-4">
            {image ? (
              <div className="relative">
                <img 
                  src={image} 
                  alt="Captured exercise form" 
                  className="rounded-md object-contain max-h-64 mx-auto"
                />
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="absolute top-2 right-2 rounded-full p-2" 
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="relative rounded-md overflow-hidden w-full aspect-video">
                  <video 
                    ref={videoRef} 
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    autoPlay 
                    playsInline 
                    muted
                  />
                  <canvas ref={canvasRef} className="hidden" width={640} height={480} />
                </div>
                <Button 
                  onClick={handleCameraCapture}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  <span>Capture Image</span>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {image && !result && !analyzing && (
          <Button 
            onClick={analyzeImage}
            className="w-full mt-4"
          >
            Analyze Form
          </Button>
        )}
        
        {analyzing && (
          <div className="flex flex-col items-center justify-center gap-2 py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Analyzing your form...</p>
          </div>
        )}
        
        {result && (
          <div className="mt-4 bg-muted p-4 rounded-md max-h-64 overflow-y-auto">
            <div className="prose prose-sm">
              <div dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br>') }} />
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={handleDialogClose}>Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}