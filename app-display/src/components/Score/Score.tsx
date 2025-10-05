import './Score.css'
import type { TAppState } from '../../types/appState';

interface Props {
  state: TAppState
}

export const Score = ({ state }: Props) => {
  // Convert score to string and pad with zeros if you want fixed length
  const scoreString = String(state.score).padStart(3, '0');

  return (
    <div className="score">
      <h2>Passengers</h2>
      <div className="score-display">
        {scoreString.split('').map((digit, idx) => (
          <span key={idx} className="digit">{digit}</span>
        ))}
      </div>
    </div>
  )
}
