import { Sound } from '@/components/Sound'
import music from '@/sounds/music-login.mp3'
import img_qr from './qr.png'
import './LoginScreen.css'


export const LoginScreen = () => {
    return (
        <div className='login-screen'>
            <img className='login-screen__qr' src={img_qr} alt='QR code' />
            <Sound src={music} autoplay />
        </div>
    );
};
