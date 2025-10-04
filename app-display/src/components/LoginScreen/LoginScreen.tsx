import './LoginScreen.css';
import img_qr from './qr.png';
import music from './music-login.mp3';
import { MusicPlayer } from '../MusicPlayer';

export const LoginScreen = () => {
  return (
    <div className='login-screen'>
      <img className='login-screen__qr' src={img_qr} alt='QR code' />
      <MusicPlayer src={music} />
    </div>
  );
};
