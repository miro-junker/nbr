import { useEffect } from 'react'
import { Logo, Score, Sound } from '@/components'
import type { TAppState } from '@/types'
import { URL_API_SUBMIT } from '@/config/main'
import { DURATION_GAMEOVER_SCREEN } from '@/config/game'
import { initialAppState } from '@/state/appState'
import soundGameOver from '@/sounds/gameover.mp3'
import './ScreenGameOver.css'


interface Props {
    appState: TAppState
    setAppState: React.Dispatch<React.SetStateAction<TAppState>>
}


export const ScreenGameOver = ({ appState, setAppState }: Props) => {
    const { username, score } = appState

    useEffect(() => {
        // Send score to API
        if (username && typeof score === 'number') {
            fetch(URL_API_SUBMIT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'x-api-token': 'SECRET_TOKEN', // todo: get from .env
                },
                body: JSON.stringify({ username, score })
            })
            .then(res => {
                if (!res.ok) throw new Error(`Failed to send score: ${res.status}`)
                return res.json()
            })
            .then(() => {
                console.log('Score submitted successfully')
            })
            .catch(err => {
                console.error('Error submitting score:', err)
            })
        }

        // Reset app state after game over
        const timer = setTimeout(() => {
            setAppState(initialAppState)
        }, DURATION_GAMEOVER_SCREEN * 1000)

        return () => clearTimeout(timer)
    }, [username, score, setAppState])

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
