import { Logo } from '@/components'
import './ScreenIntro.css'


interface StartupScreenProps {
    onStart: () => void
}


export const ScreenIntro: React.FC<StartupScreenProps> = ({ onStart }) => {
    return (
        <div
            className='screen-intro__container'
            onClick={onStart}
            onTouchStart={onStart} // ensures touch devices also trigger start
            style={{

            }}
        >
            <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>
                Update Conference Flight
            </h1>
            <button className='screen-intro__cta'>
                Start the Game
            </button>
            <div className='screen-intro__logo'>
                <Logo />
            </div>
        </div>
    )
}
