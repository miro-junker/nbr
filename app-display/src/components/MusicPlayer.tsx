import { useEffect, useRef } from 'react';


interface BackgroundMusicProps {
    src: string;
    loop?: boolean;
}


export const MusicPlayer = ({ src, loop = true }: BackgroundMusicProps) => {
    const refAudio = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = new Audio(src);
        audio.loop = loop;
        refAudio.current = audio;

        const handleUserInteraction = () => {
            audio.play().catch((err) => console.warn('Audio play failed:', err));
            window.removeEventListener('click', handleUserInteraction);
            window.removeEventListener('touchstart', handleUserInteraction);
        };

        window.addEventListener('click', handleUserInteraction);
        window.addEventListener('touchstart', handleUserInteraction);

        return () => {
            audio.pause();
            refAudio.current = null;
            window.removeEventListener('click', handleUserInteraction);
            window.removeEventListener('touchstart', handleUserInteraction);
        };
    }, [src, loop]);

    return null; // No visible UI
};
