import './LoginScreen.css';
import img_qr from './qr.png';
import music from '../../sounds/music-login.mp3';
import { Sound } from '../Sound';


export const LoginScreen = () => {
  return (
    <div className='login-screen'>
      <img className='login-screen__qr' src={img_qr} alt='QR code' />
      <Sound src={music} autoplay />
    </div>
  );
};
