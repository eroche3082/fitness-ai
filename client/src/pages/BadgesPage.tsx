import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Medal, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AchievementBadge, UserBadges } from '@/shared/types';
import { getBadgesByCategories, getBadgeById } from '@/data/badges';
import BadgeGrid from '@/components/badges/BadgeGrid';
import BadgeDetailsDialog from '@/components/badges/BadgeDetailsDialog';
import badgeService from '@/services/badgeService';
import html2canvas from 'html2canvas';

export default function BadgesPage() {
  const { toast } = useToast();
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Fetch user badges from API
  const { data: userBadges, isLoading, error } = useQuery({
    queryKey: ['/api/badges/current'],
    // Fallback to user ID 1 for demo purposes
    queryFn: async () => await badgeService.fetchUserBadges('1')
  });

  // Prepare badges data for display
  const earnedBadges = userBadges ? badgeService.getEarnedBadges(userBadges) : [];
  const inProgressBadges = userBadges ? badgeService.getInProgressBadges(userBadges) : [];
  const allBadgesByCategory = getBadgesByCategories();

  // Handle share badge
  const handleShareBadge = async (badgeId: string, platform: 'twitter' | 'facebook' | 'instagram' | 'whatsapp' | 'email') => {
    if (!userBadges) return;
    
    try {
      const success = await badgeService.shareBadgeOnSocial(userBadges.userId, badgeId, platform);
      
      if (success) {
        toast({
          title: "¡Insignia compartida!",
          description: `Has compartido esta insignia en ${platform}.`,
        });
      }
    } catch (error) {
      console.error('Error sharing badge:', error);
      toast({
        title: "Error al compartir",
        description: "No se pudo compartir la insignia. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  // Handle view badge details
  const handleViewBadgeDetails = (badgeId: string) => {
    const badge = getBadgeById(badgeId);
    if (badge) {
      setSelectedBadge(badge);
      setIsDetailsOpen(true);
    }
  };

  // Handle download badge
  const handleDownloadBadge = async (badgeId: string) => {
    try {
      // Get badge element
      const badgeElement = document.getElementById(`badge-${badgeId}`);
      
      if (!badgeElement) {
        console.error('Badge element not found');
        return;
      }
      
      // Create canvas from badge
      const canvas = await html2canvas(badgeElement);
      
      // Convert to data URL and download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `fitness-ai-badge-${badgeId}.png`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "¡Insignia descargada!",
        description: "La insignia se ha descargado correctamente.",
      });
    } catch (error) {
      console.error('Error downloading badge:', error);
      toast({
        title: "Error al descargar",
        description: "No se pudo descargar la insignia. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  // Close details dialog
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedBadge(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="mb-6">
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Insignias y Logros</CardTitle>
            <CardDescription>Error cargando insignias</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-red-500">No se pudieron cargar las insignias. Por favor, intenta de nuevo más tarde.</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <Medal className="w-6 h-6 mr-2" />
                Insignias y Logros
              </CardTitle>
              <CardDescription>
                Colecciona insignias al completar entrenamientos y alcanzar objetivos
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Compartir Colección
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {userBadges && (
            <BadgeGrid
              earnedBadges={earnedBadges}
              inProgressBadges={inProgressBadges}
              allBadges={allBadgesByCategory}
              onShare={handleShareBadge}
              onViewDetails={handleViewBadgeDetails}
            />
          )}
        </CardContent>
      </Card>

      {/* Badge Details Dialog */}
      {selectedBadge && (
        <BadgeDetailsDialog
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
          badge={selectedBadge}
          onShare={handleShareBadge}
          onDownload={handleDownloadBadge}
        />
      )}
    </div>
  );
}