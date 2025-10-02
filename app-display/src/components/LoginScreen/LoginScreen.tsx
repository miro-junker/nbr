import './LoginScreen.css'
import img_qr from './qr.png'

export const LoginScreen = () => {
  return (
    <div className='login-screen'>
      <img className='login-screen__qr' src={img_qr} />
    </div>
  )
}
