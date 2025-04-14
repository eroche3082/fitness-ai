import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Share2, 
  Lock, 
  Unlock, 
  Calendar,
  Award,
  Twitter,
  Facebook,
  Mail,
  MessageSquare
} from 'lucide-react';
import { AchievementBadge } from '@/shared/types';

interface AchievementBadgeItemProps {
  badge: AchievementBadge;
  onShare?: (badgeId: string, platform: 'twitter' | 'facebook' | 'instagram' | 'whatsapp' | 'email') => void;
  onViewDetails?: (badgeId: string) => void;
}

export default function AchievementBadgeItem({ 
  badge, 
  onShare,
  onViewDetails
}: AchievementBadgeItemProps) {
  // Determine badge tier color
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-amber-600';
      case 'silver': return 'bg-slate-400';
      case 'gold': return 'bg-yellow-500';
      case 'platinum': return 'bg-cyan-500';
      case 'diamond': return 'bg-purple-500';
      default: return 'bg-slate-500';
    }
  };

  const tierColor = getTierColor(badge.tier);
  
  // Get formatted date if badge is unlocked
  const formattedDate = badge.unlockedAt 
    ? new Date(badge.unlockedAt).toLocaleDateString() 
    : null;
  
  return (
    <Card className={`overflow-hidden transition-all ${!badge.locked ? 'border-green-500 shadow-md' : 'opacity-85'}`}>
      <div className={`h-2 w-full ${tierColor}`}></div>
      <CardHeader className="relative pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{badge.name}</CardTitle>
          <Badge variant={badge.locked ? "outline" : "secondary"} className="ml-2">
            {badge.locked ? (
              <Lock className="h-3 w-3 mr-1" />
            ) : (
              <Unlock className="h-3 w-3 mr-1" />
            )}
            {badge.locked ? "Por desbloquear" : "Desbloqueado"}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {badge.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex items-center justify-center my-2">
          {/* This would be the badge image */}
          <div className={`w-24 h-24 flex items-center justify-center rounded-full 
              ${badge.locked ? 'bg-gray-200 dark:bg-gray-700' : `bg-green-100 dark:bg-green-900 ${tierColor}`}`}>
            {badge.locked ? (
              <Lock className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            ) : (
              <Award className="h-12 w-12 text-white" />
            )}
          </div>
        </div>
        
        {badge.locked && badge.progress !== undefined && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progreso</span>
              <span>{badge.progressDescription}</span>
            </div>
            <Progress value={badge.progress} className="h-2" />
          </div>
        )}
        
        {!badge.locked && formattedDate && (
          <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Conseguido el {formattedDate}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex flex-wrap justify-between">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onViewDetails?.(badge.id)}
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          Detalles
        </Button>
        
        {!badge.locked && badge.shareable && (
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => onShare?.(badge.id, 'twitter')}
            >
              <Twitter className="h-4 w-4 text-sky-500" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => onShare?.(badge.id, 'facebook')}
            >
              <Facebook className="h-4 w-4 text-blue-600" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => onShare?.(badge.id, 'email')}
            >
              <Mail className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}