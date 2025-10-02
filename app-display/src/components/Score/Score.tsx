import './Score.css'
import type { TAppState } from '../../types/appState';


interface Props {
  state: TAppState
}


export const Score = ({state}: Props) => {
  return (
    <div className='score'>
        <h2>Score</h2>
        <div>{state.score}</div>
    </div>
  )
}
