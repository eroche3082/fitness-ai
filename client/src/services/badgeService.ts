import { AchievementBadge, UserBadges } from '../shared/types';
import { ACHIEVEMENT_BADGES, getBadgeById } from '../data/badges';

/**
 * Fetch user badges from the server
 * @param userId User ID to fetch badges for
 */
export async function fetchUserBadges(userId: string): Promise<UserBadges> {
  try {
    // For now, we simulate a server response with a fixed set of badges
    // In a real implementation, this would make an API call
    
    // Simulate a network request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return a default badges object
    return {
      userId,
      earnedBadges: ['special-early-adopter'], // Early adopter badge by default
      progress: {
        'strength-intermediate': {
          currentValue: 3,
          targetValue: 10,
          updatedAt: new Date().toISOString()
        },
        'cardio-intermediate': {
          currentValue: 12,
          targetValue: 25,
          updatedAt: new Date().toISOString()
        }
      },
      sharedBadges: {}
    };
  } catch (error) {
    console.error('Error fetching user badges:', error);
    
    // Return a default badges object in case of error
    return {
      userId,
      earnedBadges: ['special-early-adopter'], // Early adopter badge by default
      progress: {},
      sharedBadges: {}
    };
  }
}

/**
 * Update user badge progress
 * @param userId User ID
 * @param badgeId Badge ID to update
 * @param progressValue Current progress value
 */
export async function updateBadgeProgress(userId: string, badgeId: string, progressValue: number): Promise<void> {
  try {
    // For demo purposes, we just log the progress update
    console.log(`[Badge Service] Updated progress for badge ${badgeId}: ${progressValue}`);
    // In a real implementation, this would make an API call
  } catch (error) {
    console.error(`Error updating badge progress for ${badgeId}:`, error);
    throw error;
  }
}

/**
 * Unlock a badge for a user
 * @param userId User ID
 * @param badgeId Badge ID to unlock
 */
export async function unlockBadge(userId: string, badgeId: string): Promise<void> {
  try {
    // For demo purposes, we just log the badge unlock
    console.log(`[Badge Service] Unlocked badge ${badgeId} for user ${userId}`);
    // In a real implementation, this would make an API call
  } catch (error) {
    console.error(`Error unlocking badge ${badgeId}:`, error);
    throw error;
  }
}

/**
 * Record a badge being shared on social media
 * @param userId User ID
 * @param badgeId Badge ID that was shared
 * @param platform The social platform where it was shared
 */
export async function recordBadgeShare(
  userId: string, 
  badgeId: string, 
  platform: 'twitter' | 'facebook' | 'instagram' | 'whatsapp' | 'email'
): Promise<void> {
  try {
    // For demo purposes, we just log the badge share
    console.log(`[Badge Service] Shared badge ${badgeId} on ${platform}`);
    // In a real implementation, this would make an API call
  } catch (error) {
    console.error(`Error recording share for badge ${badgeId}:`, error);
    throw error;
  }
}

/**
 * Get badges that user has earned
 * @param userBadges User's badge collection
 */
export function getEarnedBadges(userBadges: UserBadges): AchievementBadge[] {
  return ACHIEVEMENT_BADGES
    .filter(badge => userBadges.earnedBadges.includes(badge.id))
    .map(badge => ({
      ...badge,
      locked: false,
      unlockedAt: userBadges.progress[badge.id]?.updatedAt
    }));
}

/**
 * Get badges that user is still working towards
 * @param userBadges User's badge collection
 */
export function getInProgressBadges(userBadges: UserBadges): AchievementBadge[] {
  const inProgress = ACHIEVEMENT_BADGES.filter(badge => {
    // Badge not earned yet
    if (userBadges.earnedBadges.includes(badge.id)) {
      return false;
    }
    
    // Has progress on this badge
    return userBadges.progress[badge.id] !== undefined;
  });
  
  return inProgress.map(badge => {
    const progressData = userBadges.progress[badge.id];
    
    if (progressData) {
      const progressPercentage = Math.round((progressData.currentValue / progressData.targetValue) * 100);
      
      return {
        ...badge,
        progress: progressPercentage,
        progressDescription: `${progressData.currentValue}/${progressData.targetValue}`
      };
    }
    
    return badge;
  });
}

/**
 * Check if a user has shared a badge
 * @param userBadges User's badge collection
 * @param badgeId Badge ID to check
 */
export function hasSharedBadge(userBadges: UserBadges, badgeId: string): boolean {
  return !!userBadges.sharedBadges[badgeId] && userBadges.sharedBadges[badgeId].length > 0;
}

/**
 * Generate a shareable URL for a badge
 * @param userId User ID
 * @param badgeId Badge ID
 */
export function generateShareableUrl(userId: string, badgeId: string): string {
  const badge = getBadgeById(badgeId);
  if (!badge) return '';
  
  // Base URL for the app
  const baseUrl = window.location.origin;
  
  // Generate a deep link
  return `${baseUrl}/badge/${userId}/${badgeId}`;
}

/**
 * Share badge on social media
 * @param userId User ID
 * @param badgeId Badge ID
 * @param platform Platform to share on
 */
export async function shareBadgeOnSocial(
  userId: string, 
  badgeId: string, 
  platform: 'twitter' | 'facebook' | 'instagram' | 'whatsapp' | 'email'
): Promise<boolean> {
  const badge = getBadgeById(badgeId);
  if (!badge) return false;
  
  const shareUrl = generateShareableUrl(userId, badgeId);
  const shareText = `¡He desbloqueado la insignia "${badge.name}" en Fitness AI! ${badge.description}`;
  
  let shareWindowUrl = '';
  
  switch (platform) {
    case 'twitter':
      shareWindowUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      break;
    case 'facebook':
      shareWindowUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
      break;
    case 'whatsapp':
      shareWindowUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
      break;
    case 'email':
      shareWindowUrl = `mailto:?subject=${encodeURIComponent('Mi logro en Fitness AI')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
      break;
    default:
      return false;
  }
  
  // Open share dialog
  window.open(shareWindowUrl, '_blank', 'width=600,height=400');
  
  // Record the share
  try {
    await recordBadgeShare(userId, badgeId, platform);
    return true;
  } catch (error) {
    console.error('Failed to record share:', error);
    return false;
  }
}

export default {
  fetchUserBadges,
  updateBadgeProgress,
  unlockBadge,
  recordBadgeShare,
  getEarnedBadges,
  getInProgressBadges,
  hasSharedBadge,
  generateShareableUrl,
  shareBadgeOnSocial
};