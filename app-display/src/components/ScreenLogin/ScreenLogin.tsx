import { Sound, Logo } from '@/components'
import music from '@/sounds/music-login.mp3'
import img_qr from './qr-update.png'
import './ScreenLogin.css'


export const ScreenLogin = () => {
    return (
        <div className='screen-login'>
            <img className='screen-login__qr' src={img_qr} alt='QR code' />
            <Sound src={music} autoplay />
            <div className='screen-login__logo'>
                <Logo />
            </div>
        </div>
    );
};
