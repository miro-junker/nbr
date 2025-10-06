import { useEffect, useState } from 'react'
import { URL_API_LIST } from '@/config/main'
import './HighScore.css'


type ScoreEntry = {
    user_name: string
    score: number
}


export const HighScore = () => {
    const [scores, setScores] = useState<ScoreEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(URL_API_LIST)
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
                const data: ScoreEntry[] = await response.json()
                setScores(data)
            } catch (error) {
                console.error('Error fetching URL_API_LIST:', error)
                setError('Failed to load high scores')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return <p>Loading high scores...</p>
    if (error) return <p style={{ color: 'red' }}>{error}</p>

    return (
        <div className='high-score'>
            <h2>High Scores</h2>
            <table className='high-score__table'>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {scores
                        .sort((a, b) => b.score - a.score)
                        .map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.user_name}</td>
                                <td>{item.score}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}
