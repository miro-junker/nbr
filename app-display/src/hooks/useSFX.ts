import { useRef, useEffect } from 'react';
import soundHey from '@/sounds/hey.mp3'


// Map of sound names to file paths
const SFX_MAP: Record<string, string> = {
    hey: soundHey
};

export const useSFX = () => {
    const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

    // Preload all sounds on mount
    useEffect(() => {
        Object.entries(SFX_MAP).forEach(([name, src]) => {
            if (!audioRefs.current[name]) {
                const audio = new Audio(src);
                audio.preload = 'auto';
                audioRefs.current[name] = audio;
            }
        });
    }, []);

    // Play a sound by name
    const playSFX = (name: keyof typeof SFX_MAP, volume: number = 1) => {
        const audio = audioRefs.current[name];
        if (!audio) {
            console.warn(`SFX not found or not preloaded: ${name}`);
            return;
        }

        audio.currentTime = 0; // restart if already playing
        audio.volume = volume;
        audio.play().catch((err) => console.warn('SFX playback failed:', err));
    };

    return playSFX;
};
