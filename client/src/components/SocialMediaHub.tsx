import React, { useEffect, useState } from "react";
import { getUserFitnessPosts, FitnessPost } from "../services/fitnessPostService";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Share2, Calendar as CalendarIcon, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface SocialMediaHubProps {
  userId: string;
}

const SocialMediaHub: React.FC<SocialMediaHubProps> = ({ userId }) => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<FitnessPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scheduledDates, setScheduledDates] = useState<Date[]>([]);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const userPosts = await getUserFitnessPosts(userId);
        setPosts(userPosts);
        
        // Extract scheduled dates for the calendar
        const dates = userPosts
          .filter(post => post.scheduledAt !== null)
          .map(post => post.scheduledAt!.toDate());
        
        setScheduledDates(dates);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast({
          title: "Error",
          description: "Failed to load your social media posts.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [userId, toast]);
  
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Instagram":
        return "bg-pink-100 text-pink-800";
      case "TikTok":
        return "bg-black text-white";
      case "Facebook":
        return "bg-blue-100 text-blue-800";
      case "YouTube Shorts":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Posted":
        return "bg-green-100 text-green-800";
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const renderPostCard = (post: FitnessPost) => {
    return (
      <Card key={post.createdAt.toString()} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{post.routineType} Workout</CardTitle>
              <p className="text-sm text-slate-500">{post.fitnessLevel} level</p>
            </div>
            <div className="flex space-x-2">
              <Badge className={getPlatformColor(post.platform)}>{post.platform}</Badge>
              <Badge className={getStatusColor(post.status)}>{post.status}</Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="aspect-video bg-slate-100 rounded-md overflow-hidden">
                {post.mediaUrl && (
                  post.mediaUrl.includes('.mp4') ? (
                    <video 
                      src={post.mediaUrl} 
                      controls 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src={post.mediaUrl} 
                      alt="Post media" 
                      className="w-full h-full object-cover"
                    />
                  )
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Caption</h3>
              <p className="text-sm text-slate-700 line-clamp-3">{post.caption}</p>
              
              <h3 className="font-medium pt-2">Hashtags</h3>
              <div className="flex flex-wrap gap-1">
                {post.hashtags.slice(0, 5).map((tag, index) => (
                  <span key={index} className="bg-slate-100 px-2 py-1 rounded text-xs">
                    #{tag}
                  </span>
                ))}
                {post.hashtags.length > 5 && (
                  <span className="bg-slate-100 px-2 py-1 rounded text-xs">
                    +{post.hashtags.length - 5} more
                  </span>
                )}
              </div>
              
              {post.scheduledAt && (
                <div className="pt-2">
                  <h3 className="font-medium">Scheduled for</h3>
                  <p className="text-sm text-slate-700">
                    <CalendarIcon className="inline-block h-4 w-4 mr-1" />
                    {format(post.scheduledAt.toDate(), 'PPP')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <div className="flex space-x-2 w-full justify-end">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
            <Button size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  };
  
  const getPostsForDate = (date: Date) => {
    return posts.filter(post => {
      if (!post.scheduledAt) return false;
      
      const scheduledDate = post.scheduledAt.toDate();
      return (
        scheduledDate.getDate() === date.getDate() &&
        scheduledDate.getMonth() === date.getMonth() &&
        scheduledDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Social Media Hub</h1>
        <Button>Create New Post</Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-slate-500 mb-4">Create your first fitness post to get started!</p>
              <Button>Create Post</Button>
            </div>
          ) : (
            <div>
              {posts.map(renderPostCard)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="scheduled" className="pt-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : posts.filter(post => post.status === "Scheduled").length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-xl font-semibold mb-2">No scheduled posts</h3>
              <p className="text-slate-500 mb-4">Schedule a post to share your fitness journey later!</p>
              <Button>Schedule Post</Button>
            </div>
          ) : (
            <div>
              {posts
                .filter(post => post.status === "Scheduled")
                .map(renderPostCard)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="drafts" className="pt-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : posts.filter(post => post.status === "Draft").length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-xl font-semibold mb-2">No draft posts</h3>
              <p className="text-slate-500 mb-4">Save a post as draft to edit it later!</p>
              <Button>Create Draft</Button>
            </div>
          ) : (
            <div>
              {posts
                .filter(post => post.status === "Draft")
                .map(renderPostCard)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="calendar" className="pt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Post Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={new Date()}
                  onSelect={(date) => {
                    if (date) {
                      const postsForDate = getPostsForDate(date);
                      if (postsForDate.length > 0) {
                        toast({
                          title: `${postsForDate.length} posts scheduled`,
                          description: `for ${format(date, 'PPP')}`,
                        });
                      }
                    }
                  }}
                  className="rounded-md border"
                  modifiers={{
                    scheduled: scheduledDates
                  }}
                  modifiersClassNames={{
                    scheduled: "bg-blue-500 text-white font-bold"
                  }}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                {scheduledDates.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-slate-500">No upcoming posts scheduled</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {scheduledDates.slice(0, 5).map((date, index) => {
                      const postsForDate = getPostsForDate(date);
                      return (
                        <div key={index} className="flex justify-between items-center py-2 border-b">
                          <div>
                            <p className="font-medium">{format(date, 'PPP')}</p>
                            <p className="text-sm text-slate-500">{postsForDate.length} post(s)</p>
                          </div>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialMediaHub;