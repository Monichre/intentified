import type { EnrichmentResult } from "../enrichment/types";

interface Database {
  from: (table: string) => any;
}

export interface SocialProfile {
  id: string;
  platform: 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'tiktok' | 'youtube';
  profileUrl: string;
  username?: string;
  handle?: string;
  verified: boolean;
  followerCount?: number;
  followingCount?: number;
  postCount?: number;
  bio?: string;
  profileImageUrl?: string;
  lastScrapedAt: string;
  isActive: boolean;
  scrapedData: Record<string, any>;
}

export interface SocialContent {
  id: string;
  platformPostId: string;
  postType: 'post' | 'tweet' | 'story' | 'video' | 'reel' | 'short';
  contentText?: string;
  mediaUrls: string[];
  postUrl?: string;
  likesCount: number;
  sharesCount: number;
  commentsCount: number;
  viewsCount: number;
  sentimentScore?: number;
  engagementRate?: number;
  topics: string[];
  mentions: string[];
  hashtags: string[];
  postedAt: string;
  scrapedAt: string;
}

export interface SocialInsights {
  totalFollowers: number;
  totalPosts: number;
  avgEngagementRate: number;
  sentimentTrend: 'positive' | 'neutral' | 'negative';
  topTopics: string[];
  growthMetrics: {
    followerGrowth: number;
    postFrequency: number;
    engagementTrend: number;
  };
  platformBreakdown: Record<string, {
    followers: number;
    posts: number;
    engagement: number;
  }>;
}

export const makeSocialMediaService = (db: Database) => {
  
  /**
   * Save social profiles for a company
   */
  const saveSocialProfiles = async (
    companyProfileId: string,
    socialData: Record<string, any>
  ): Promise<void> => {
    const profiles: any[] = [];

    // Extract social profiles from enrichment data
    if (socialData.linkedin) {
      profiles.push({
        company_profile_id: companyProfileId,
        platform: 'linkedin',
        profile_url: socialData.linkedin.url || '',
        username: socialData.linkedin.username,
        bio: socialData.linkedin.description,
        follower_count: socialData.linkedin.followerCount,
        scraped_data: socialData.linkedin
      });
    }

    if (socialData.twitter) {
      profiles.push({
        company_profile_id: companyProfileId,
        platform: 'twitter',
        profile_url: socialData.twitter.url || '',
        username: socialData.twitter.username,
        handle: socialData.twitter.handle,
        verified: socialData.twitter.verified || false,
        follower_count: socialData.twitter.followersCount,
        following_count: socialData.twitter.followingCount,
        bio: socialData.twitter.bio,
        profile_image_url: socialData.twitter.profileImage,
        scraped_data: socialData.twitter
      });
    }

    if (socialData.instagram) {
      profiles.push({
        company_profile_id: companyProfileId,
        platform: 'instagram',
        profile_url: socialData.instagram.url || '',
        username: socialData.instagram.username,
        verified: socialData.instagram.verified || false,
        follower_count: socialData.instagram.followersCount,
        following_count: socialData.instagram.followingCount,
        post_count: socialData.instagram.postsCount,
        bio: socialData.instagram.bio,
        profile_image_url: socialData.instagram.profileImage,
        scraped_data: socialData.instagram
      });
    }

    if (socialData.facebook) {
      profiles.push({
        company_profile_id: companyProfileId,
        platform: 'facebook',
        profile_url: socialData.facebook.url || '',
        username: socialData.facebook.username,
        verified: socialData.facebook.verified || false,
        follower_count: socialData.facebook.likesCount,
        bio: socialData.facebook.about,
        scraped_data: socialData.facebook
      });
    }

    if (socialData.tiktok) {
      profiles.push({
        company_profile_id: companyProfileId,
        platform: 'tiktok',
        profile_url: socialData.tiktok.url || '',
        username: socialData.tiktok.username,
        verified: socialData.tiktok.verified || false,
        follower_count: socialData.tiktok.followersCount,
        following_count: socialData.tiktok.followingCount,
        bio: socialData.tiktok.bio,
        scraped_data: socialData.tiktok
      });
    }

    if (socialData.youtube) {
      profiles.push({
        company_profile_id: companyProfileId,
        platform: 'youtube',
        profile_url: socialData.youtube.url || '',
        username: socialData.youtube.channelName,
        follower_count: socialData.youtube.subscriberCount,
        bio: socialData.youtube.description,
        scraped_data: socialData.youtube
      });
    }

    if (profiles.length > 0) {
      // Upsert social profiles
      const { error } = await db
        .from('company_social_profiles')
        .upsert(profiles, {
          onConflict: 'company_profile_id,platform'
        });

      if (error) throw new Error(`Failed to save social profiles: ${error.message}`);
    }
  };

  /**
   * Get social profiles for a company
   */
  const getSocialProfiles = async (companyProfileId: string): Promise<SocialProfile[]> => {
    const { data, error } = await db
      .from('company_social_profiles')
      .select('*')
      .eq('company_profile_id', companyProfileId)
      .eq('is_active', true);

    if (error) throw new Error(`Failed to get social profiles: ${error.message}`);

    return (data || []).map(profile => ({
      id: profile.id,
      platform: profile.platform,
      profileUrl: profile.profile_url,
      username: profile.username,
      handle: profile.handle,
      verified: profile.verified,
      followerCount: profile.follower_count,
      followingCount: profile.following_count,
      postCount: profile.post_count,
      bio: profile.bio,
      profileImageUrl: profile.profile_image_url,
      lastScrapedAt: profile.last_scraped_at,
      isActive: profile.is_active,
      scrapedData: profile.scraped_data
    }));
  };

  /**
   * Save social content/posts
   */
  const saveSocialContent = async (
    socialProfileId: string,
    posts: any[]
  ): Promise<void> => {
    if (!posts || posts.length === 0) return;

    const contentRecords = posts.map(post => ({
      social_profile_id: socialProfileId,
      platform_post_id: post.id || post.postId,
      post_type: post.type || 'post',
      content_text: post.text || post.content,
      media_urls: post.mediaUrls || post.images || [],
      post_url: post.url,
      likes_count: post.likesCount || post.likes || 0,
      shares_count: post.sharesCount || post.retweets || post.shares || 0,
      comments_count: post.commentsCount || post.replies || post.comments || 0,
      views_count: post.viewsCount || post.views || 0,
      sentiment_score: post.sentimentScore,
      topics: post.topics || [],
      mentions: post.mentions || [],
      hashtags: post.hashtags || [],
      posted_at: post.postedAt || post.createdAt
    }));

    const { error } = await db
      .from('company_social_content')
      .upsert(contentRecords, {
        onConflict: 'social_profile_id,platform_post_id'
      });

    if (error) throw new Error(`Failed to save social content: ${error.message}`);
  };

  /**
   * Generate social insights for a company
   */
  const generateSocialInsights = async (companyProfileId: string): Promise<SocialInsights> => {
    const profiles = await getSocialProfiles(companyProfileId);
    
    const insights: SocialInsights = {
      totalFollowers: 0,
      totalPosts: 0,
      avgEngagementRate: 0,
      sentimentTrend: 'neutral',
      topTopics: [],
      growthMetrics: {
        followerGrowth: 0,
        postFrequency: 0,
        engagementTrend: 0
      },
      platformBreakdown: {}
    };

    // Calculate totals
    for (const profile of profiles) {
      insights.totalFollowers += profile.followerCount || 0;
      insights.totalPosts += profile.postCount || 0;

      insights.platformBreakdown[profile.platform] = {
        followers: profile.followerCount || 0,
        posts: profile.postCount || 0,
        engagement: 0 // Calculate from content data
      };
    }

    // Get recent content for analysis
    const { data: recentContent } = await db
      .from('company_social_content')
      .select(`
        *,
        company_social_profiles!inner(company_profile_id)
      `)
      .eq('company_social_profiles.company_profile_id', companyProfileId)
      .gte('posted_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
      .order('posted_at', { ascending: false });

    if (recentContent && recentContent.length > 0) {
      // Calculate engagement metrics
      let totalEngagement = 0;
      let sentimentSum = 0;
      let sentimentCount = 0;
      const topicCounts: Record<string, number> = {};

      for (const post of recentContent) {
        const engagement = (post.likes_count + post.shares_count + post.comments_count) / Math.max(1, post.views_count || 1);
        totalEngagement += engagement;

        if (post.sentiment_score !== null) {
          sentimentSum += post.sentiment_score;
          sentimentCount++;
        }

        // Count topics
        if (post.topics) {
          for (const topic of post.topics) {
            topicCounts[topic] = (topicCounts[topic] || 0) + 1;
          }
        }
      }

      insights.avgEngagementRate = totalEngagement / recentContent.length;
      
      // Determine sentiment trend
      if (sentimentCount > 0) {
        const avgSentiment = sentimentSum / sentimentCount;
        if (avgSentiment > 0.1) insights.sentimentTrend = 'positive';
        else if (avgSentiment < -0.1) insights.sentimentTrend = 'negative';
        else insights.sentimentTrend = 'neutral';
      }

      // Get top topics
      insights.topTopics = Object.entries(topicCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([topic]) => topic);
    }

    return insights;
  };

  /**
   * Update social links in company profile
   */
  const updateCompanySocialLinks = async (
    companyProfileId: string,
    socialLinks: Record<string, string>
  ): Promise<void> => {
    const { error } = await db
      .from('company_profiles')
      .update({
        social_links: socialLinks,
        updated_at: new Date().toISOString()
      })
      .eq('id', companyProfileId);

    if (error) throw new Error(`Failed to update social links: ${error.message}`);
  };

  return {
    saveSocialProfiles,
    getSocialProfiles,
    saveSocialContent,
    generateSocialInsights,
    updateCompanySocialLinks
  };
};

export type SocialMediaService = ReturnType<typeof makeSocialMediaService>;