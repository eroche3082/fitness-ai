import React, { useState, useRef, useEffect } from "react";
import { uploadWorkoutMedia } from "../services/uploadWorkoutMedia";
import { generateFitnessPost, FitnessPostParams, FitnessPostContent } from "../services/generateFitnessPost";
import { createFitnessPost } from "../services/fitnessPostService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Camera, Upload, Share2, Copy, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FitnessRoutineSocialStudioProps {
  userId: string;
}

const routineTypes = ["Cardio", "Strength", "Flexibility", "HIIT", "Custom"];
const fitnessLevels = ["Beginner", "Intermediate", "Pro"];
const toneOptions = ["Energetic", "Inspiring", "Educational", "Bold"];
const platformOptions = ["Instagram", "TikTok", "Facebook", "YouTube Shorts"];
const postTypeOptions = ["Reel", "Story", "Post"];

const FitnessRoutineSocialStudio: React.FC<FitnessRoutineSocialStudioProps> = ({ userId }) => {
  const { toast } = useToast();
  const [step, setStep] = useState<number>(1);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const [mediaUploadedUrl, setMediaUploadedUrl] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<FitnessPostContent | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  
  // Form values
  const [routineType, setRoutineType] = useState<string>("Cardio");
  const [fitnessLevel, setFitnessLevel] = useState<string>("Beginner");
  const [userNotes, setUserNotes] = useState<string>("");
  const [tone, setTone] = useState<string>("Inspiring");
  const [platform, setPlatform] = useState<string>("Instagram");
  const [postType, setPostType] = useState<string>("Reel");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  
  // Clean up media stream when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const previewUrl = URL.createObjectURL(file);
      setMediaPreviewUrl(previewUrl);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
        chunksRef.current = [];
        
        const file = new File([blob], 'workout-recording.mp4', { type: 'video/mp4' });
        setMediaFile(file);
        
        const url = URL.createObjectURL(blob);
        setMediaPreviewUrl(url);
        
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting video recording:", error);
      toast({
        title: "Recording Error",
        description: "Could not access camera and microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      setIsRecording(false);
    }
  };

  const uploadMedia = async () => {
    if (!mediaFile) {
      toast({
        title: "Upload Error",
        description: "Please record or upload a media file first.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const downloadUrl = await uploadWorkoutMedia(mediaFile, userId);
      setMediaUploadedUrl(downloadUrl);
      setStep(3);
      
      toast({
        title: "Media Uploaded",
        description: "Your workout media has been uploaded successfully!",
      });
    } catch (error) {
      console.error("Error uploading media:", error);
      toast({
        title: "Upload Error",
        description: "Failed to upload media. Please try again.",
        variant: "destructive"
      });
    }
  };

  const generatePost = async () => {
    if (!mediaUploadedUrl) {
      toast({
        title: "Generation Error",
        description: "Please upload your media first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const params: FitnessPostParams = {
        routineType,
        fitnessLevel,
        tone,
        notes: userNotes,
        platform
      };
      
      const content = await generateFitnessPost(params);
      setGeneratedContent(content);
      setStep(4);
      
      toast({
        title: "Post Generated",
        description: "Your fitness post has been generated successfully!",
      });
    } catch (error) {
      console.error("Error generating post:", error);
      toast({
        title: "Generation Error",
        description: "Failed to generate post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const savePost = async () => {
    if (!mediaUploadedUrl || !generatedContent) {
      toast({
        title: "Save Error",
        description: "Media upload and post generation must be completed first.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await createFitnessPost(
        userId,
        routineType,
        fitnessLevel,
        mediaUploadedUrl,
        generatedContent,
        platform,
        postType as "Reel" | "Story" | "Post",
        tone,
        scheduledDate
      );
      
      toast({
        title: "Post Saved",
        description: scheduledDate 
          ? `Your post has been scheduled for ${format(scheduledDate, 'PPP')}` 
          : "Your post has been saved as a draft.",
      });
      
      // Reset form after successful save
      setStep(1);
      setMediaFile(null);
      setMediaPreviewUrl(null);
      setMediaUploadedUrl(null);
      setGeneratedContent(null);
      setScheduledDate(null);
      setUserNotes("");
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Save Error",
        description: "Failed to save your post. Please try again.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = () => {
    if (!generatedContent) return;
    
    const text = `${generatedContent.caption}\n\n${generatedContent.hashtags.map(tag => `#${tag}`).join(' ')}\n\n${generatedContent.callToAction}`;
    
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to Clipboard",
        description: "Post content has been copied to clipboard!",
      });
    }).catch(err => {
      console.error("Error copying to clipboard:", err);
      toast({
        title: "Copy Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive"
      });
    });
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Step 1: Choose Your Workout</h2>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="routine-type">Routine Type</Label>
                <Select value={routineType} onValueChange={setRoutineType}>
                  <SelectTrigger id="routine-type">
                    <SelectValue placeholder="Select routine type" />
                  </SelectTrigger>
                  <SelectContent>
                    {routineTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fitness-level">Fitness Level</Label>
                <Select value={fitnessLevel} onValueChange={setFitnessLevel}>
                  <SelectTrigger id="fitness-level">
                    <SelectValue placeholder="Select fitness level" />
                  </SelectTrigger>
                  <SelectContent>
                    {fitnessLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={() => setStep(2)}
            >
              Next: Record or Upload
            </Button>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Step 2: Record or Upload</h2>
            
            <Tabs defaultValue="record" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="record">Record Video</TabsTrigger>
                <TabsTrigger value="upload">Upload Media</TabsTrigger>
              </TabsList>
              
              <TabsContent value="record" className="space-y-4 py-4">
                <div className="aspect-video bg-slate-100 rounded-md overflow-hidden">
                  {!mediaPreviewUrl && (
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {mediaPreviewUrl && !isRecording && (
                    <video 
                      src={mediaPreviewUrl} 
                      controls 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                <div className="flex justify-center space-x-4">
                  {!isRecording && !mediaPreviewUrl && (
                    <Button onClick={startRecording}>
                      <Camera className="mr-2 h-4 w-4" />
                      Start Recording
                    </Button>
                  )}
                  
                  {isRecording && (
                    <Button 
                      variant="destructive" 
                      onClick={stopRecording}
                    >
                      Stop Recording
                    </Button>
                  )}
                  
                  {mediaPreviewUrl && !isRecording && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setMediaPreviewUrl(null);
                        setMediaFile(null);
                      }}
                    >
                      Record Again
                    </Button>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="upload" className="space-y-4 py-4">
                <div className="aspect-video bg-slate-100 rounded-md overflow-hidden flex items-center justify-center">
                  {!mediaPreviewUrl ? (
                    <div className="text-center p-6">
                      <Upload className="mx-auto h-12 w-12 text-slate-400" />
                      <p className="mt-2 text-sm text-slate-500">Upload image or video</p>
                    </div>
                  ) : (
                    mediaFile?.type.startsWith('video/') ? (
                      <video 
                        src={mediaPreviewUrl} 
                        controls 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img 
                        src={mediaPreviewUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    )
                  )}
                </div>
                
                <div className="flex flex-col items-center space-y-2">
                  <Input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="media-upload"
                  />
                  <Label 
                    htmlFor="media-upload"
                    className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {mediaPreviewUrl ? "Change File" : "Upload File"}
                  </Label>
                  
                  {mediaPreviewUrl && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setMediaPreviewUrl(null);
                        setMediaFile(null);
                      }}
                    >
                      Remove File
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="pt-4 space-y-4">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about your workout..."
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              
              <Button 
                onClick={uploadMedia}
                disabled={!mediaFile}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload and Continue
              </Button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Step 3: Social Media Settings</h2>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tone">Post Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger id="tone">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {toneOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platformOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="post-type">Post Type</Label>
                <Select value={postType} onValueChange={setPostType}>
                  <SelectTrigger id="post-type">
                    <SelectValue placeholder="Select post type" />
                  </SelectTrigger>
                  <SelectContent>
                    {postTypeOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={() => setStep(2)}
              >
                Back
              </Button>
              
              <Button 
                onClick={generatePost}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>Generate Post</>
                )}
              </Button>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Step 4: Your Generated Post</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="aspect-video bg-slate-100 rounded-md overflow-hidden">
                  {mediaFile?.type.startsWith('video/') ? (
                    <video 
                      src={mediaPreviewUrl || ""} 
                      controls 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src={mediaPreviewUrl || ""} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-lg mb-2">Caption</h3>
                    <p className="text-slate-700">{generatedContent?.caption}</p>
                    
                    <h3 className="font-bold text-lg mt-4 mb-2">Hashtags</h3>
                    <div className="flex flex-wrap gap-1">
                      {generatedContent?.hashtags.map((tag, index) => (
                        <span key={index} className="bg-slate-100 px-2 py-1 rounded text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <h3 className="font-bold text-lg mt-4 mb-2">Call to Action</h3>
                    <p className="text-slate-700">{generatedContent?.callToAction}</p>
                  </CardContent>
                </Card>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Text
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-center">
                <Label htmlFor="schedule-date" className="mr-4">Schedule Post (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="schedule-date"
                      variant="outline"
                      className="w-[240px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduledDate ? format(scheduledDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={scheduledDate}
                      onSelect={(date) => {
                        setScheduledDate(date);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={() => setStep(3)}
              >
                Back
              </Button>
              
              <div className="space-x-2">
                <Button 
                  variant="outline"
                  onClick={savePost}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {scheduledDate ? "Schedule Post" : "Save Draft"}
                </Button>
                
                <Button>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Now
                </Button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Fitness Goal Visualization Wizard</h1>
      
      <div className="mb-8">
        <div className="flex items-center">
          <div className="flex-1">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-slate-200'}`}>
                1
              </div>
              <div className={`h-1 w-full ${step > 1 ? 'bg-primary' : 'bg-slate-200'}`}></div>
            </div>
            <p className="text-sm mt-1 text-center">Choose Workout</p>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-slate-200'}`}>
                2
              </div>
              <div className={`h-1 w-full ${step > 2 ? 'bg-primary' : 'bg-slate-200'}`}></div>
            </div>
            <p className="text-sm mt-1 text-center">Record/Upload</p>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-slate-200'}`}>
                3
              </div>
              <div className={`h-1 w-full ${step > 3 ? 'bg-primary' : 'bg-slate-200'}`}></div>
            </div>
            <p className="text-sm mt-1 text-center">Social Settings</p>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 4 ? 'bg-primary text-white' : 'bg-slate-200'}`}>
                4
              </div>
            </div>
            <p className="text-sm mt-1 text-center">Share</p>
          </div>
        </div>
      </div>
      
      <Card className="w-full">
        <CardContent className="pt-6">
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default FitnessRoutineSocialStudio;