import { Logo, Score, Sound } from '@/components'
import type { TAppState } from '@/types'
import './ScreenGameOver.css'
import soundGameOver from '@/sounds/gameover.mp3'


interface Props {
    state: TAppState;
}


export const ScreenGameOver = (props: Props) => {
  const { username } = props.state
  return (
    <div className='screen-game-over'>
        <h1 className='screen-game-over__heading'>Game over</h1>
        {username && <div className='screen-game-over__user'>Nice flight, {username}!</div>}
        <div className='screen-game-over__score'>
            <Score state={props.state} />
        </div>
        <div className='screen-game-over__logo'>
            <Logo />
        </div>
        <Sound src={soundGameOver} loop={false} autoplay />
    </div>
  )
}
