import { useEffect, useState } from 'react'
import './Passenger.css'


interface Passenger {
    name: string
    img: string
}

interface Props {
    score: number
}


export const Passenger = ({ score }: Props) => {
    const [passengersData, setPassengersData] = useState<Passenger[]>([])
    const [remainingIndexes, setRemainingIndexes] = useState<number[]>([])
    const [currentPassenger, setCurrentPassenger] = useState<Passenger | null>(null)
    const [animate, setAnimate] = useState(false)

    const renewRemainingIndexes = () => {
        setRemainingIndexes(passengersData.map((_, idx) => idx))
    }

    // Initialize passengers data on mount
    useEffect(() => {
        const images = import.meta.glob('./img/*.png', { eager: true })
        const imagePaths = Object.values(images).map((mod: any) => mod.default)

        const processedImages: Passenger[] = imagePaths.map((path) => {
            const fileName = path.split('/').pop()!
            const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '')
            const nameWithSpaces = nameWithoutExt.replace(/_/g, ' ')
            const passengerName = decodeURIComponent(nameWithSpaces)
            const nameWithoutHashTrash = passengerName.split('-')[0]
            return { name: nameWithoutHashTrash, img: path };
        });

        // Preload all images
        processedImages.forEach(p => {
            const img = new Image()
            img.src = p.img;
        });

        setPassengersData(processedImages)
    }, [])

    // Set remainingIndexes when images prepared (on init)
    useEffect(() => {
        if (passengersData.length) renewRemainingIndexes()
    }, [passengersData])

    // Renew remaining indexes when empty
    useEffect(() => {
        if (remainingIndexes.length === 0) renewRemainingIndexes()
    }, [remainingIndexes])

    // Change currentPassenger whenever score changes
    useEffect(() => {
        if (score === 0 || passengersData.length === 0) return;

        const nextIndex = remainingIndexes[Math.floor(Math.random() * remainingIndexes.length)]
        setRemainingIndexes(prev => prev.filter(idx => idx !== nextIndex))
        setCurrentPassenger(passengersData[nextIndex])

        // Trigger animation
        setAnimate(true);
        const timer = setTimeout(() => setAnimate(false), 2000)  // 1.5s visible + 0.5s transition
        return () => clearTimeout(timer)
    }, [score]);

    return (
        <div className={`passenger ${animate ? 'passenger--visible' : ''}`}>
            <div className='passenger__photo'>
                {currentPassenger && <img src={currentPassenger.img} alt={currentPassenger.name} />}
            </div>
            <p className='passenger__name'>
                {currentPassenger ? currentPassenger.name : ''}
            </p>
        </div>
    );
};
