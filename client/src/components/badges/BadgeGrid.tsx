import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AchievementBadge } from '@/shared/types';
import AchievementBadgeItem from './AchievementBadgeItem';
import { InfoIcon } from 'lucide-react';

interface BadgeGridProps {
  earnedBadges: AchievementBadge[];
  inProgressBadges: AchievementBadge[];
  allBadges: Record<string, AchievementBadge[]>;
  onShare: (badgeId: string, platform: 'twitter' | 'facebook' | 'instagram' | 'whatsapp' | 'email') => void;
  onViewDetails: (badgeId: string) => void;
}

export default function BadgeGrid({
  earnedBadges,
  inProgressBadges,
  allBadges,
  onShare,
  onViewDetails
}: BadgeGridProps) {
  // Display categories in a specific order
  const categoryDisplayOrder = [
    { id: 'earned', label: 'Conseguidas' },
    { id: 'in-progress', label: 'En Progreso' },
    { id: 'strength', label: 'Fuerza' },
    { id: 'cardio', label: 'Cardio' },
    { id: 'nutrition', label: 'Nutrición' },
    { id: 'consistency', label: 'Consistencia' },
    { id: 'milestone', label: 'Hitos' },
    { id: 'special', label: 'Especiales' },
  ];
  
  // Format label names from category IDs
  const getCategoryLabel = (categoryId: string) => {
    const category = categoryDisplayOrder.find(c => c.id === categoryId);
    return category ? category.label : categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  };
  
  // Get all available category IDs
  const allCategoryIds = [
    'earned', 
    'in-progress',
    ...Object.keys(allBadges)
  ];
  
  // Order categories according to displayOrder
  const orderedCategories = categoryDisplayOrder
    .filter(category => allCategoryIds.includes(category.id))
    .map(category => category.id);
  
  return (
    <Tabs defaultValue="earned" className="w-full">
      <ScrollArea className="w-full pb-2">
        <TabsList className="flex w-max">
          {orderedCategories.map(categoryId => (
            <TabsTrigger 
              key={categoryId} 
              value={categoryId}
              className="px-4"
            >
              {getCategoryLabel(categoryId)}
              {categoryId === 'earned' && earnedBadges.length > 0 && (
                <span className="ml-2 rounded-full bg-green-500 px-2 py-0.5 text-xs text-white">
                  {earnedBadges.length}
                </span>
              )}
              {categoryId === 'in-progress' && inProgressBadges.length > 0 && (
                <span className="ml-2 rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                  {inProgressBadges.length}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </ScrollArea>
      
      {/* Earned Badges Tab */}
      <TabsContent value="earned" className="mt-4">
        {earnedBadges.length === 0 ? (
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>No tienes insignias conseguidas aún</AlertTitle>
            <AlertDescription>
              Completa entrenamientos y alcanza objetivos para desbloquear insignias.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {earnedBadges.map(badge => (
              <AchievementBadgeItem 
                key={badge.id}
                badge={badge}
                onShare={onShare}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </TabsContent>
      
      {/* In Progress Badges Tab */}
      <TabsContent value="in-progress" className="mt-4">
        {inProgressBadges.length === 0 ? (
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>No tienes insignias en progreso</AlertTitle>
            <AlertDescription>
              Comienza entrenamientos y actividades para ver tu progreso aquí.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {inProgressBadges.map(badge => (
              <AchievementBadgeItem 
                key={badge.id}
                badge={badge}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </TabsContent>
      
      {/* Category-based Tabs */}
      {Object.keys(allBadges).map(categoryId => (
        <TabsContent key={categoryId} value={categoryId} className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allBadges[categoryId].map(badge => (
              <AchievementBadgeItem 
                key={badge.id}
                badge={badge}
                onShare={!badge.locked ? onShare : undefined}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}