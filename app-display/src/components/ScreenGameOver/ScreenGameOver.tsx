import { useEffect } from 'react'
import { Logo, Score, Sound } from '@/components'
import type { TAppState } from '@/types'
import { DURATION_GAMEOVER_SCREEN } from '@/config/game'
import { initialAppState } from '@/state/appState'
import soundGameOver from '@/sounds/gameover.mp3'
import './ScreenGameOver.css'


interface Props {
    appState: TAppState
    setAppState: React.Dispatch<React.SetStateAction<TAppState>>
}


export const ScreenGameOver = ({ appState, setAppState }: Props) => {
    const { username } = appState

    // Reset app state after game over
    useEffect(() => {
        const timer = setTimeout(() => {
            setAppState(initialAppState)
        }, DURATION_GAMEOVER_SCREEN * 1000)

        return () => clearTimeout(timer)
    }, [setAppState])

    return (
        <div className='screen-game-over'>
            <h1 className='screen-game-over__heading'>Game over</h1>
            
            <div className='screen-game-over__score'>
                <Score state={appState} />
            </div>

            {username && (
                <div className='screen-game-over__user'>
                    Nice flight, {username}!
                </div>
            )}

            <div className='screen-game-over__logo'>
                <Logo />
            </div>

            <Sound src={soundGameOver} loop={false} autoplay />
        </div>
    )
}
