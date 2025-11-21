/**
 * Caller Profile Service
 * Manages fake caller personas with profiles, photos, videos, and voice lines
 */

export class CallerProfile {
    constructor(data = {}) {
        this.id = data.id || Date.now().toString();
        this.name = data.name || 'Unknown';
        this.avatar = data.avatar || '👤';
        this.relationship = data.relationship || 'Contact';
        this.videoUrl = data.videoUrl || null;
        this.voiceLines = data.voiceLines || [];
        this.isDefault = data.isDefault || false;
    }
}

class CallerProfileService {
    constructor() {
        this.storageKey = 'aura_caller_profiles';
        this.activeProfileKey = 'aura_active_profile';
        this.initDefaultProfiles();
    }

    initDefaultProfiles() {
        const existing = this.getAllProfiles();
        if (existing.length === 0) {
            const defaults = [
                new CallerProfile({
                    id: 'mom',
                    name: 'Mom',
                    avatar: '👩',
                    relationship: 'Mother',
                    voiceLines: ["I'm on my way!", "Where are you?", "Call me back soon"],
                    isDefault: true
                }),
                new CallerProfile({
                    id: 'boss',
                    name: 'Manager',
                    avatar: '💼',
                    relationship: 'Work',
                    voiceLines: ["Urgent meeting in 10 minutes", "Need you at the office", "Important client call"],
                    isDefault: true
                }),
                new CallerProfile({
                    id: 'friend',
                    name: 'Sarah',
                    avatar: '👭',
                    relationship: 'Best Friend',
                    voiceLines: ["I can see you, I'm nearby!", "Coming to pick you up", "Wait there, 2 mins away"],
                    isDefault: true
                }),
                new CallerProfile({
                    id: 'partner',
                    name: 'Partner',
                    avatar: '💑',
                    relationship: 'Significant Other',
                    voiceLines: ["Miss you, coming home now", "Are you okay?", "Need anything from the store?"],
                    isDefault: true
                })
            ];
            this.saveProfiles(defaults);
            this.setActiveProfile('mom');
        }
    }

    getAllProfiles() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data).map(p => new CallerProfile(p)) : [];
        } catch (error) {
            console.error('Error loading profiles:', error);
            return [];
        }
    }

    saveProfiles(profiles) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(profiles));
        } catch (error) {
            console.error('Error saving profiles:', error);
        }
    }

    getProfile(id) {
        const profiles = this.getAllProfiles();
        return profiles.find(p => p.id === id) || profiles[0];
    }

    addProfile(profileData) {
        const profiles = this.getAllProfiles();
        const newProfile = new CallerProfile(profileData);
        profiles.push(newProfile);
        this.saveProfiles(profiles);
        return newProfile;
    }

    updateProfile(id, updates) {
        const profiles = this.getAllProfiles();
        const index = profiles.findIndex(p => p.id === id);
        if (index !== -1) {
            profiles[index] = new CallerProfile({ ...profiles[index], ...updates });
            this.saveProfiles(profiles);
            return profiles[index];
        }
        return null;
    }

    deleteProfile(id) {
        const profiles = this.getAllProfiles();
        const filtered = profiles.filter(p => p.id !== id || p.isDefault);
        this.saveProfiles(filtered);
        return filtered.length < profiles.length;
    }

    getActiveProfile() {
        try {
            const activeId = localStorage.getItem(this.activeProfileKey);
            return activeId ? this.getProfile(activeId) : this.getAllProfiles()[0];
        } catch (error) {
            return this.getAllProfiles()[0];
        }
    }

    setActiveProfile(id) {
        try {
            localStorage.setItem(this.activeProfileKey, id);
        } catch (error) {
            console.error('Error setting active profile:', error);
        }
    }

    getRandomVoiceLine(profileId) {
        const profile = this.getProfile(profileId);
        if (profile.voiceLines.length === 0) return null;
        return profile.voiceLines[Math.floor(Math.random() * profile.voiceLines.length)];
    }
}

export default new CallerProfileService();
