import { useEffect, useRef } from 'react'


interface BackgroundMusicProps {
    src: string
    loop?: boolean
    autoplay?: boolean
}


export const Sound = ({ src, loop = true, autoplay = false }: BackgroundMusicProps) => {
    const refAudio = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        const audio = new Audio(src)
        audio.loop = loop
        audio.autoplay = autoplay
        audio.volume = 1 // set volume to max
        refAudio.current = audio

        if (autoplay) {
            audio.play().catch((err) => {
                console.warn('Audio autoplay failed:', err)
            })
        }

        return () => {
            audio.pause()
            refAudio.current = null
        };
    }, [src, loop, autoplay])

    return null; // No visible UI
};
