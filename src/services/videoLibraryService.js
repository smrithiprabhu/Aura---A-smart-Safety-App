/**
 * Video Library Service
 * Manages prerecorded video clips for realistic fake video calls
 */

export class VideoClip {
    constructor(data = {}) {
        this.id = data.id || Date.now().toString();
        this.name = data.name || 'Untitled';
        this.url = data.url || null;
        this.duration = data.duration || 5; // seconds
        this.type = data.type || 'idle'; // idle, talking, nodding
        this.profileId = data.profileId || null;
    }
}

class VideoLibraryService {
    constructor() {
        this.storageKey = 'aura_video_library';
        this.initDefaultVideos();
    }

    initDefaultVideos() {
        const existing = this.getAllVideos();
        if (existing.length === 0) {
            // Placeholder video clips - in production these would be actual video URLs
            const defaultClips = [
                // Mom profile videos
                new VideoClip({
                    id: 'mom_idle_1',
                    name: 'Mom - Idle 1',
                    url: this.generatePlaceholderVideo('mom', 'idle', 1),
                    duration: 5,
                    type: 'idle',
                    profileId: 'mom'
                }),
                new VideoClip({
                    id: 'mom_talking_1',
                    name: 'Mom - Talking 1',
                    url: this.generatePlaceholderVideo('mom', 'talking', 1),
                    duration: 8,
                    type: 'talking',
                    profileId: 'mom'
                }),
                new VideoClip({
                    id: 'mom_nodding_1',
                    name: 'Mom - Nodding',
                    url: this.generatePlaceholderVideo('mom', 'nodding', 1),
                    duration: 6,
                    type: 'nodding',
                    profileId: 'mom'
                }),

                // Boss profile videos
                new VideoClip({
                    id: 'boss_idle_1',
                    name: 'Boss - Idle 1',
                    url: this.generatePlaceholderVideo('boss', 'idle', 1),
                    duration: 5,
                    type: 'idle',
                    profileId: 'boss'
                }),
                new VideoClip({
                    id: 'boss_talking_1',
                    name: 'Boss - Talking 1',
                    url: this.generatePlaceholderVideo('boss', 'talking', 1),
                    duration: 7,
                    type: 'talking',
                    profileId: 'boss'
                }),

                // Friend profile videos
                new VideoClip({
                    id: 'friend_idle_1',
                    name: 'Friend - Idle 1',
                    url: this.generatePlaceholderVideo('friend', 'idle', 1),
                    duration: 5,
                    type: 'idle',
                    profileId: 'friend'
                }),
                new VideoClip({
                    id: 'friend_talking_1',
                    name: 'Friend - Talking 1',
                    url: this.generatePlaceholderVideo('friend', 'talking', 1),
                    duration: 8,
                    type: 'talking',
                    profileId: 'friend'
                }),

                // Partner profile videos
                new VideoClip({
                    id: 'partner_idle_1',
                    name: 'Partner - Idle 1',
                    url: this.generatePlaceholderVideo('partner', 'idle', 1),
                    duration: 6,
                    type: 'idle',
                    profileId: 'partner'
                }),
                new VideoClip({
                    id: 'partner_talking_1',
                    name: 'Partner - Talking 1',
                    url: this.generatePlaceholderVideo('partner', 'talking', 1),
                    duration: 7,
                    type: 'talking',
                    profileId: 'partner'
                })
            ];
            this.saveVideos(defaultClips);
        }
    }

    // Generate placeholder video data (in production, these would be actual video URLs)
    generatePlaceholderVideo(profile, type, index) {
        return {
            placeholder: true,
            profile,
            type,
            index,
            // In production, this would be actual video URLs from CDN or local storage
            // url: `https://cdn.example.com/videos/${profile}/${type}/${index}.mp4`
        };
    }

    getAllVideos() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data).map(v => new VideoClip(v)) : [];
        } catch (error) {
            console.error('Error loading video library:', error);
            return [];
        }
    }

    saveVideos(videos) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(videos));
        } catch (error) {
            console.error('Error saving video library:', error);
        }
    }

    getVideosForProfile(profileId) {
        const videos = this.getAllVideos();
        return videos.filter(v => v.profileId === profileId);
    }

    getRandomVideo(profileId, type = null) {
        let videos = this.getVideosForProfile(profileId);

        if (type) {
            videos = videos.filter(v => v.type === type);
        }

        if (videos.length === 0) {
            return null;
        }

        return videos[Math.floor(Math.random() * videos.length)];
    }

    // Get a sequence of videos for realistic playback
    getVideoSequence(profileId, duration = 60) {
        const sequence = [];
        let totalDuration = 0;
        const videos = this.getVideosForProfile(profileId);

        if (videos.length === 0) return sequence;

        // Create a realistic sequence: mix of idle, talking, and nodding
        const patterns = ['idle', 'talking', 'idle', 'nodding', 'talking', 'idle'];
        let patternIndex = 0;

        while (totalDuration < duration) {
            const type = patterns[patternIndex % patterns.length];
            const video = this.getRandomVideo(profileId, type);

            if (video) {
                sequence.push(video);
                totalDuration += video.duration;
            }

            patternIndex++;

            // Prevent infinite loop
            if (patternIndex > 100) break;
        }

        return sequence;
    }

    addVideo(videoData) {
        const videos = this.getAllVideos();
        const newVideo = new VideoClip(videoData);
        videos.push(newVideo);
        this.saveVideos(videos);
        return newVideo;
    }

    deleteVideo(id) {
        const videos = this.getAllVideos();
        const filtered = videos.filter(v => v.id !== id);
        this.saveVideos(filtered);
        return filtered.length < videos.length;
    }
}

export default new VideoLibraryService();
