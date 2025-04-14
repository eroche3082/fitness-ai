import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Award, 
  Share2, 
  Trophy,
  Target,
  ChevronUp,
  ArrowRight,
  Twitter,
  Facebook,
  Mail,
  Download
} from 'lucide-react';
import { AchievementBadge } from '@/shared/types';

interface BadgeDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  badge: AchievementBadge | null;
  onShare?: (badgeId: string, platform: 'twitter' | 'facebook' | 'instagram' | 'whatsapp' | 'email') => void;
  onDownload?: (badgeId: string) => void;
}

export default function BadgeDetailsDialog({
  isOpen,
  onClose,
  badge,
  onShare,
  onDownload
}: BadgeDetailsDialogProps) {
  if (!badge) return null;

  // Get tier color and label
  const getTierDetails = (tier: string) => {
    switch (tier) {
      case 'bronze': return { color: 'bg-amber-600 text-white', label: 'Bronce' };
      case 'silver': return { color: 'bg-slate-400 text-white', label: 'Plata' };
      case 'gold': return { color: 'bg-yellow-500 text-black', label: 'Oro' };
      case 'platinum': return { color: 'bg-cyan-500 text-white', label: 'Platino' };
      case 'diamond': return { color: 'bg-purple-500 text-white', label: 'Diamante' };
      default: return { color: 'bg-slate-500 text-white', label: 'Estándar' };
    }
  };

  const { color, label } = getTierDetails(badge.tier);
  const formattedDate = badge.unlockedAt 
    ? new Date(badge.unlockedAt).toLocaleDateString() 
    : null;

  const categoryLabel = {
    'strength': 'Fuerza',
    'cardio': 'Cardio',
    'nutrition': 'Nutrición',
    'consistency': 'Consistencia',
    'milestone': 'Hito',
    'special': 'Especial'
  }[badge.category] || badge.category;

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{badge.name}</DialogTitle>
          <DialogDescription>
            {badge.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          {/* Badge Image */}
          <div className={`w-32 h-32 flex items-center justify-center rounded-full 
              ${badge.locked ? 'bg-gray-200 dark:bg-gray-700' : `${color}`}`}>
            {badge.locked ? (
              <Target className="h-16 w-16 text-gray-400 dark:text-gray-500" />
            ) : (
              <Award className="h-20 w-20 text-white" />
            )}
          </div>

          {/* Badge Metadata */}
          <div className="mt-4 w-full flex flex-wrap justify-center gap-2">
            <Badge className={color}>
              <Trophy className="h-3 w-3 mr-1" />
              Nivel {label}
            </Badge>
            <Badge variant="outline">
              <Target className="h-3 w-3 mr-1" />
              {categoryLabel}
            </Badge>
            {!badge.locked && (
              <Badge variant="secondary">
                <Calendar className="h-3 w-3 mr-1" />
                {formattedDate}
              </Badge>
            )}
          </div>

          <Separator className="my-4" />

          {/* Requirements & Progress */}
          <div className="w-full space-y-3">
            <h4 className="font-medium">Requisitos</h4>
            <p className="text-sm">{badge.requirements}</p>

            {badge.locked && badge.progress !== undefined && (
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Tu progreso actual</span>
                  <span>{badge.progressDescription}</span>
                </div>
                <Progress value={badge.progress} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {badge.progress < 30 && "¡Apenas empezando! Sigue así."}
                  {badge.progress >= 30 && badge.progress < 70 && "¡Buen progreso! Ya vas a mitad de camino."}
                  {badge.progress >= 70 && "¡Casi lo logras! Un poco más de esfuerzo."}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:justify-between">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cerrar
          </Button>
          
          <div className="flex gap-2">
            {!badge.locked && badge.shareable && (
              <>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="rounded-full"
                  onClick={() => onDownload?.(badge.id)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="rounded-full"
                  onClick={() => onShare?.(badge.id, 'twitter')}
                >
                  <Twitter className="h-4 w-4 text-sky-500" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="rounded-full"
                  onClick={() => onShare?.(badge.id, 'facebook')}
                >
                  <Facebook className="h-4 w-4 text-blue-600" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="rounded-full"
                  onClick={() => onShare?.(badge.id, 'email')}
                >
                  <Mail className="h-4 w-4 text-gray-600" />
                </Button>
                <Button onClick={() => onShare?.(badge.id, 'whatsapp')}>
                  <Share2 className="h-4 w-4 mr-2" /> Compartir
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}