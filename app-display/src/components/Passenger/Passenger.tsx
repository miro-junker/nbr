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

    const renewRemainingIndexes = () => {
        setRemainingIndexes(passengersData.map((_, idx) => idx))
    }

    // Initialize passengers data on mount
    useEffect(() => {
        const images = import.meta.glob('./img/*.png', { eager: true })
        const imagePaths = Object.values(images).map((mod: any) => mod.default)

        const processedImages: Passenger[] = imagePaths.map((path) => {
            const fileName = path.split('/').pop()!;
            const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
            const nameWithSpaces = nameWithoutExt.replace(/_/g, ' ');
            const passengerName = decodeURIComponent(nameWithSpaces);
            return { name: passengerName, img: path };
        });

        // Preload all images
        processedImages.forEach(p => {
            const img = new Image();
            img.src = p.img;
        });

        setPassengersData(processedImages);
    }, []);


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
        if (score === 0) return;

        // Pick random from remaining
        const nextIndex = remainingIndexes[Math.floor(Math.random() * remainingIndexes.length)];
        setRemainingIndexes(prev => prev.filter(idx => idx !== nextIndex));
        setCurrentPassenger(passengersData[nextIndex]);
    }, [score]);


    if (!currentPassenger) return null;

    return (
        <div className="passenger">
            <div className='passenger__photo'><img src={currentPassenger.img} alt={currentPassenger.name} /></div>
            <p className='passenger__name'>{currentPassenger.name}</p>
        </div>
    );
};
