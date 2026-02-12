/**
 * Video streaming utilities for handling video assets
 * Supports Cloudflare Stream and Mux for adaptive bitrate streaming
 */

export interface VideoConfig {
  provider: 'cloudflare' | 'mux' | 'direct';
  src: string;
  poster?: string;
}

export interface StreamingConfig {
  cloudflare?: {
    accountId: string;
    apiToken: string;
  };
  mux?: {
    tokenId: string;
    tokenSecret: string;
  };
}

/**
 * Get optimized video URL based on provider
 */
export function getVideoUrl(config: VideoConfig): string {
  const { provider, src } = config;

  switch (provider) {
    case 'cloudflare':
      // Cloudflare Stream format: https://videodelivery.net/{VIDEO_ID}/manifest/video.m3u8
      if (src.includes('videodelivery.net')) {
        return src;
      }
      // Assume src is video ID
      return `https://videodelivery.net/${src}/manifest/video.m3u8`;

    case 'mux':
      // Mux format: https://stream.mux.com/{PLAYBACK_ID}.m3u8
      if (src.includes('stream.mux.com')) {
        return src;
      }
      return `https://stream.mux.com/${src}.m3u8`;

    case 'direct':
    default:
      return src;
  }
}

/**
 * Get video thumbnail/poster URL
 */
export function getVideoPoster(config: VideoConfig): string | undefined {
  const { provider, src, poster } = config;

  if (poster) return poster;

  switch (provider) {
    case 'cloudflare':
      // Cloudflare Stream thumbnail
      const cfVideoId = src.includes('videodelivery.net')
        ? src.split('/')[3]
        : src;
      return `https://videodelivery.net/${cfVideoId}/thumbnails/thumbnail.jpg`;

    case 'mux':
      // Mux thumbnail
      const muxPlaybackId = src.includes('stream.mux.com')
        ? src.split('/').pop()?.replace('.m3u8', '')
        : src;
      return `https://image.mux.com/${muxPlaybackId}/thumbnail.jpg`;

    default:
      return undefined;
  }
}

/**
 * Video quality presets for adaptive streaming
 */
export const VIDEO_QUALITY_PRESETS = {
  auto: { label: 'Auto', value: 'auto' },
  '1080p': { label: '1080p HD', value: '1080', bitrate: 5000000 },
  '720p': { label: '720p HD', value: '720', bitrate: 2500000 },
  '480p': { label: '480p', value: '480', bitrate: 1000000 },
  '360p': { label: '360p', value: '360', bitrate: 600000 },
} as const;

/**
 * Check if HLS is supported
 */
export function supportsHLS(): boolean {
  if (typeof window === 'undefined') return false;
  
  const video = document.createElement('video');
  return (
    video.canPlayType('application/vnd.apple.mpegurl') !== '' ||
    video.canPlayType('application/x-mpegURL') !== ''
  );
}

/**
 * Create video source configuration for different formats
 */
export function getVideoSources(src: string): { src: string; type: string }[] {
  const sources = [];

  // HLS
  if (src.endsWith('.m3u8')) {
    sources.push({ src, type: 'application/x-mpegURL' });
  }

  // DASH
  if (src.endsWith('.mpd')) {
    sources.push({ src, type: 'application/dash+xml' });
  }

  // MP4 fallback
  if (src.endsWith('.mp4')) {
    sources.push({ src, type: 'video/mp4' });
  }

  // WebM
  if (src.endsWith('.webm')) {
    sources.push({ src, type: 'video/webm' });
  }

  return sources;
}
