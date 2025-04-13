import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Heart,
  MessageSquare,
  Share2,
  Award,
  Users,
  TrendingUp,
  Calendar,
  Plus,
  Search,
  Filter,
  BarChart,
  ChevronUp,
  ChevronDown,
  BookOpen,
  Video,
  Image as ImageIcon,
  Smile
} from 'lucide-react';

// Types
interface User {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  level: string;
  joinDate: Date;
  role?: 'member' | 'coach' | 'admin';
}

interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
}

interface Post {
  id: string;
  userId: string;
  content: string;
  images?: string[];
  video?: string;
  workoutData?: {
    type: string;
    duration: number;
    calories: number;
    exercises: { name: string; sets: number; reps: number }[];
  };
  likes: number;
  comments: Comment[];
  timestamp: Date;
  tags?: string[];
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  participants: number;
  category: 'strength' | 'cardio' | 'flexibility' | 'nutrition' | 'habit';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  reward?: string;
  joined?: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string;
  attendees: number;
  type: 'webinar' | 'workout' | 'challenge' | 'qa';
  registered?: boolean;
}

// Sample data
const sampleUsers: { [key: string]: User } = {
  'user-1': {
    id: 'user-1',
    name: 'Alex Johnson',
    username: 'alexfit',
    avatar: 'https://ui.shadcn.com/avatars/01.png',
    level: 'PRO',
    joinDate: new Date('2024-12-01')
  },
  'user-2': {
    id: 'user-2',
    name: 'Samantha Lee',
    username: 'samlee',
    avatar: 'https://ui.shadcn.com/avatars/02.png',
    level: 'INT',
    joinDate: new Date('2025-01-15')
  },
  'user-3': {
    id: 'user-3',
    name: 'Marcus Wright',
    username: 'mwright',
    avatar: 'https://ui.shadcn.com/avatars/03.png',
    level: 'BEG',
    joinDate: new Date('2025-02-10')
  },
  'user-4': {
    id: 'user-4',
    name: 'Coach Emma',
    username: 'coachemma',
    avatar: 'https://ui.shadcn.com/avatars/04.png',
    level: 'VIP',
    joinDate: new Date('2024-09-21'),
    role: 'coach'
  },
  'current-user': {
    id: 'current-user',
    name: 'You',
    username: 'current_user',
    level: 'ADV',
    joinDate: new Date('2025-01-01')
  }
};

const samplePosts: Post[] = [
  {
    id: 'post-1',
    userId: 'user-1',
    content: 'Just crushed my leg day workout! 💪 Feeling stronger every week. The progressive overload approach is really paying off. How's everyone else's training going this week?',
    workoutData: {
      type: 'Strength',
      duration: 65,
      calories: 420,
      exercises: [
        { name: 'Squats', sets: 4, reps: 10 },
        { name: 'Deadlifts', sets: 3, reps: 8 },
        { name: 'Leg Press', sets: 3, reps: 12 }
      ]
    },
    likes: 24,
    comments: [
      {
        id: 'comment-1',
        userId: 'user-2',
        text: 'Amazing progress! What's your squat PR now?',
        timestamp: new Date('2025-04-13T10:30:00')
      },
      {
        id: 'comment-2',
        userId: 'user-4',
        text: 'Great work! Make sure you're focusing on proper form with those heavy lifts.',
        timestamp: new Date('2025-04-13T11:15:00')
      }
    ],
    timestamp: new Date('2025-04-13T09:45:00'),
    tags: ['LegDay', 'StrengthTraining']
  },
  {
    id: 'post-2',
    userId: 'user-2',
    content: 'Completed my first 10K run today! So proud of this achievement. Six months ago I couldn't even run 1K without stopping. Consistency really is key! Thanks to this community for all the motivation.',
    images: ['https://placehold.co/600x400/png'],
    likes: 56,
    comments: [
      {
        id: 'comment-3',
        userId: 'user-3',
        text: 'That's incredible progress! What's your next goal?',
        timestamp: new Date('2025-04-12T15:10:00')
      }
    ],
    timestamp: new Date('2025-04-12T14:30:00'),
    tags: ['Running', 'Milestone', 'Progress']
  },
  {
    id: 'post-3',
    userId: 'user-4',
    content: 'NEW WORKOUT GUIDE: "Building Core Strength for Beginners" is now available in the Resources section. This 4-week program focuses on building a solid foundation with progressive exercises. Let me know if you have any questions!',
    likes: 42,
    comments: [],
    timestamp: new Date('2025-04-11T11:00:00'),
    tags: ['WorkoutGuide', 'CoreStrength', 'Beginners']
  }
];

const sampleChallenges: Challenge[] = [
  {
    id: 'challenge-1',
    title: '30-Day Pushup Challenge',
    description: 'Progressively increase your pushup reps over 30 days. Start with what you can do and build from there!',
    startDate: new Date('2025-04-15'),
    endDate: new Date('2025-05-15'),
    participants: 187,
    category: 'strength',
    difficulty: 'intermediate',
    reward: 'Digital Badge + Featured in our newsletter',
    joined: true
  },
  {
    id: 'challenge-2',
    title: 'Spring 5K Virtual Race',
    description: 'Run a 5K (3.1 miles) at your own pace, anywhere, anytime during the event period. Submit your time to see how you rank!',
    startDate: new Date('2025-04-20'),
    endDate: new Date('2025-04-30'),
    participants: 312,
    category: 'cardio',
    difficulty: 'beginner',
    reward: 'Customized Finisher Certificate'
  },
  {
    id: 'challenge-3',
    title: 'Mobility Master Challenge',
    description: 'Complete daily 15-minute mobility routines for better flexibility, less pain, and improved performance.',
    startDate: new Date('2025-05-01'),
    endDate: new Date('2025-05-21'),
    participants: 134,
    category: 'flexibility',
    difficulty: 'beginner'
  }
];

const sampleEvents: Event[] = [
  {
    id: 'event-1',
    title: 'Nutrition for Performance Webinar',
    description: 'Learn how to optimize your nutrition for better workout performance and recovery with our nutrition expert.',
    date: new Date('2025-04-20T18:00:00'),
    location: 'Online (Zoom)',
    organizer: 'Fitness AI Team',
    attendees: 124,
    type: 'webinar',
    registered: true
  },
  {
    id: 'event-2',
    title: 'HIIT Workout Session',
    description: 'Join us for a live 45-minute high-intensity interval training session suitable for all fitness levels.',
    date: new Date('2025-04-22T19:30:00'),
    location: 'Online (Zoom)',
    organizer: 'Coach Emma',
    attendees: 89,
    type: 'workout'
  },
  {
    id: 'event-3',
    title: 'Ask a Trainer: Q&A Session',
    description: 'Have your fitness and nutrition questions answered by our certified trainers in this interactive session.',
    date: new Date('2025-04-25T17:00:00'),
    location: 'Online (Discord)',
    organizer: 'Fitness AI Coaches',
    attendees: 56,
    type: 'qa'
  }
];

// Post component
const Post: React.FC<{ post: Post }> = ({ post }) => {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const user = sampleUsers[post.userId];
  
  const formattedDate = post.timestamp.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  const formattedTime = post.timestamp.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
  
  const handleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(!liked);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <CardTitle className="text-base mr-2">{user?.name}</CardTitle>
                {user?.role === 'coach' && (
                  <Badge variant="outline" className="text-xs">Coach</Badge>
                )}
              </div>
              <CardDescription className="text-xs">
                {formattedDate} at {formattedTime}
              </CardDescription>
            </div>
          </div>
          <Badge 
            variant="secondary" 
            className={`
              ${user?.level === 'BEG' ? 'bg-green-100 text-green-800' : ''}
              ${user?.level === 'INT' ? 'bg-blue-100 text-blue-800' : ''}
              ${user?.level === 'ADV' ? 'bg-purple-100 text-purple-800' : ''}
              ${user?.level === 'PRO' ? 'bg-red-100 text-red-800' : ''}
              ${user?.level === 'VIP' ? 'bg-amber-100 text-amber-800' : ''}
            `}
          >
            {user?.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 whitespace-pre-line">{post.content}</p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        
        {post.workoutData && (
          <Card className="bg-slate-50 dark:bg-slate-900 mb-4">
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-sm flex items-center">
                <Dumbbell className="h-4 w-4 mr-1" />
                Workout Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-3">
              <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="font-medium">{post.workoutData.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-medium">{post.workoutData.duration} min</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Calories</p>
                  <p className="font-medium">{post.workoutData.calories} kcal</p>
                </div>
              </div>
              
              {!expanded && post.workoutData.exercises.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs w-full"
                  onClick={() => setExpanded(true)}
                >
                  Show exercises
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              )}
              
              {expanded && (
                <>
                  <div className="text-xs font-medium mb-1">Exercises:</div>
                  <div className="space-y-1">
                    {post.workoutData.exercises.map((exercise, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span>{exercise.name}</span>
                        <span>{exercise.sets} sets × {exercise.reps} reps</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs w-full mt-2"
                    onClick={() => setExpanded(false)}
                  >
                    Hide exercises
                    <ChevronUp className="h-3 w-3 ml-1" />
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}
        
        {post.images && post.images.length > 0 && (
          <div className="mb-4">
            {post.images.map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`Post image ${index + 1}`} 
                className="rounded-md w-full object-cover mb-2 last:mb-0" 
              />
            ))}
          </div>
        )}
        
        {post.video && (
          <div className="relative pt-[56.25%] mb-4">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-md"
              src={post.video}
              title="Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
            <span>{likesCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments.length}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch pt-0">
        <div className="flex border-y dark:border-gray-800 my-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1"
            onClick={handleLike}
          >
            <Heart className="h-4 w-4 mr-1" fill={liked ? "currentColor" : "none"} />
            Like
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <MessageSquare className="h-4 w-4 mr-1" />
            Comment
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
        
        {post.comments.length > 0 && (
          <div className="mt-2 space-y-3">
            {post.comments.map((comment) => {
              const commentUser = sampleUsers[comment.userId];
              return (
                <div key={comment.id} className="flex gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={commentUser?.avatar} />
                    <AvatarFallback>{commentUser?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-2">
                      <div className="font-medium text-xs">{commentUser?.name}</div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      <button>Like</button>
                      <button>Reply</button>
                      <span>
                        {comment.timestamp.toLocaleString('en-US', { 
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="flex items-center gap-2 mt-3">
          <Avatar className="h-7 w-7">
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          <Input 
            placeholder="Write a comment..." 
            className="flex-1 h-8 text-sm"
          />
          <Button size="sm" className="h-8">Post</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Challenge component
const ChallengeCard: React.FC<{ challenge: Challenge }> = ({ challenge }) => {
  const [joined, setJoined] = useState(challenge.joined || false);
  
  const startDate = challenge.startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  const endDate = challenge.endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'strength': return 'bg-red-100 text-red-700';
      case 'cardio': return 'bg-blue-100 text-blue-700';
      case 'flexibility': return 'bg-purple-100 text-purple-700';
      case 'nutrition': return 'bg-green-100 text-green-700';
      case 'habit': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{challenge.title}</CardTitle>
          <Badge className={getCategoryColor(challenge.category)}>
            {challenge.category.charAt(0).toUpperCase() + challenge.category.slice(1)}
          </Badge>
        </div>
        <CardDescription>{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Dates</p>
            <p className="font-medium">{startDate} - {endDate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Participants</p>
            <p className="font-medium">{challenge.participants + (joined && !challenge.joined ? 1 : 0)}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Difficulty</p>
          <div className="flex gap-1 mt-1">
            <Badge variant={challenge.difficulty === 'beginner' || challenge.difficulty === 'intermediate' || challenge.difficulty === 'advanced' ? 'default' : 'outline'}>
              Beginner
            </Badge>
            <Badge variant={challenge.difficulty === 'intermediate' || challenge.difficulty === 'advanced' ? 'default' : 'outline'}>
              Intermediate
            </Badge>
            <Badge variant={challenge.difficulty === 'advanced' ? 'default' : 'outline'}>
              Advanced
            </Badge>
          </div>
        </div>
        
        {challenge.reward && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">Reward</p>
            <div className="flex items-center mt-1">
              <Award className="h-4 w-4 mr-2 text-amber-500" />
              <p className="text-sm">{challenge.reward}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={joined ? "outline" : "default"}
          onClick={() => setJoined(!joined)}
        >
          {joined ? 'Leave Challenge' : 'Join Challenge'}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Event component
const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const [registered, setRegistered] = useState(event.registered || false);
  
  const formattedDate = event.date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  
  const formattedTime = event.date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
  
  const getEventTypeIcon = (type: string) => {
    switch(type) {
      case 'webinar': return <Video className="h-5 w-5" />;
      case 'workout': return <Dumbbell className="h-5 w-5" />;
      case 'challenge': return <Award className="h-5 w-5" />;
      case 'qa': return <MessageSquare className="h-5 w-5" />;
      default: return <Calendar className="h-5 w-5" />;
    }
  };
  
  const getEventTypeColor = (type: string) => {
    switch(type) {
      case 'webinar': return 'bg-purple-100 text-purple-700';
      case 'workout': return 'bg-red-100 text-red-700';
      case 'challenge': return 'bg-amber-100 text-amber-700';
      case 'qa': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{event.title}</CardTitle>
          <Badge className={getEventTypeColor(event.type)}>
            <div className="flex items-center gap-1">
              {getEventTypeIcon(event.type)}
              <span>{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
            </div>
          </Badge>
        </div>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Date & Time</p>
            <p className="font-medium">{formattedDate}, {formattedTime}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium">{event.location}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Organizer</p>
            <p className="font-medium">{event.organizer}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Attendees</p>
            <p className="font-medium">{event.attendees + (registered && !event.registered ? 1 : 0)}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={registered ? "outline" : "default"}
          onClick={() => setRegistered(!registered)}
        >
          {registered ? 'Cancel Registration' : 'Register Now'}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Create new post component
const NewPostCard: React.FC = () => {
  const [postContent, setPostContent] = useState('');
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Create Post</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          <Textarea 
            placeholder="What's on your fitness journey today?"
            className="resize-none flex-1"
            rows={3}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ImageIcon className="h-4 w-4" />
            <span>Photo</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Video className="h-4 w-4" />
            <span>Video</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Dumbbell className="h-4 w-4" />
            <span>Workout</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Smile className="h-4 w-4" />
            <span>Feeling</span>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button disabled={!postContent.trim()}>Post</Button>
      </CardFooter>
    </Card>
  );
};

// Main Community Page Component
const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('feed');
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Fitness Community</h1>
      
      <Tabs defaultValue="feed" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <NewPostCard />
              
              {samplePosts.map(post => (
                <Post key={post.id} post={post} />
              ))}
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">My Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">You</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{sampleUsers['current-user'].name}</p>
                      <Badge 
                        variant="secondary" 
                        className="bg-purple-100 text-purple-800 mt-1"
                      >
                        {sampleUsers['current-user'].level}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center border-t border-b py-2 mb-2">
                    <div>
                      <p className="text-xl font-bold">12</p>
                      <p className="text-xs text-muted-foreground">Posts</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">28</p>
                      <p className="text-xs text-muted-foreground">Friends</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">4</p>
                      <p className="text-xs text-muted-foreground">Badges</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    View Full Profile
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Trending Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">#30DayChallenge</Badge>
                      <span className="text-xs text-muted-foreground">326 posts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">#MealPrep</Badge>
                      <span className="text-xs text-muted-foreground">214 posts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">#MorningWorkout</Badge>
                      <span className="text-xs text-muted-foreground">187 posts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">#ProgressPic</Badge>
                      <span className="text-xs text-muted-foreground">165 posts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">#RunningTips</Badge>
                      <span className="text-xs text-muted-foreground">129 posts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Active Challenges</CardTitle>
                </CardHeader>
                <CardContent className="px-3">
                  <div className="space-y-4">
                    {sampleChallenges.slice(0, 2).map(challenge => (
                      <div key={challenge.id} className="border rounded-md p-3">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium text-sm">{challenge.title}</h3>
                          <Badge className={`text-xs ${
                            challenge.category === 'strength' ? 'bg-red-100 text-red-700' :
                            challenge.category === 'cardio' ? 'bg-blue-100 text-blue-700' :
                            challenge.category === 'flexibility' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {challenge.category.charAt(0).toUpperCase() + challenge.category.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{challenge.participants} participants</p>
                        <Button size="sm" variant="outline" className="w-full text-xs">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="ghost" className="w-full mt-3 text-sm">
                    See All Challenges
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="challenges">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Fitness Challenges</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Create Challenge
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleChallenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="events">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Upcoming Events</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-1" />
                Calendar View
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Create Event
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="members">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Community Members</h2>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9 w-64" placeholder="Search members..." />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.values(sampleUsers).map((user) => (
              <Card key={user.id}>
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <Avatar className="h-20 w-20 mx-auto mb-3">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                    <div className="mt-2">
                      <Badge 
                        variant="secondary" 
                        className={`
                          ${user.level === 'BEG' ? 'bg-green-100 text-green-800' : ''}
                          ${user.level === 'INT' ? 'bg-blue-100 text-blue-800' : ''}
                          ${user.level === 'ADV' ? 'bg-purple-100 text-purple-800' : ''}
                          ${user.level === 'PRO' ? 'bg-red-100 text-red-800' : ''}
                          ${user.level === 'VIP' ? 'bg-amber-100 text-amber-800' : ''}
                        `}
                      >
                        {user.level}
                      </Badge>
                      {user.role === 'coach' && (
                        <Badge variant="outline" className="ml-1">Coach</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-center border-t border-b py-2 mb-4">
                    <div>
                      <p className="text-xl font-bold">28</p>
                      <p className="text-xs text-muted-foreground">Workouts</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">4</p>
                      <p className="text-xs text-muted-foreground">Badges</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">View Profile</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Custom Dumbbell Icon
const Dumbbell: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M6.5 6.5h11"></path>
      <path d="M6.5 17.5h11"></path>
      <path d="M4 10h2.5a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H4v10h2.5a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H4"></path>
      <path d="M20 10h-2.5a2 2 0 0 0-2-2v-1a2 2 0 0 0 2-2H20v10h-2.5a2 2 0 0 0-2-2v-1a2 2 0 0 0 2-2H20"></path>
    </svg>
  );
};

export default CommunityPage;