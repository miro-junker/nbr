import type { TAppState } from '@/types/appState'
import './Score.css'


interface Props {
    state: TAppState
}


export const Score = ({ state }: Props) => {
    const scoreString = String(state.score).padStart(3, '0')

    return (
        <div className="score">
            <h2>PASSENGERS</h2>
            <div className="score-display">
                {scoreString.split('').map((digit, idx) => (
                    <span key={idx} className="digit">{digit}</span>
                ))}
            </div>
        </div>
    )
}
