import './Username.css'


interface Props {
    name: string
}


export const Username = ({ name }: Props) => {
  if (!name) return null

  return (
    <div className='username'>
      <span className='username__label'>Pilot</span> { name }</div>
  )
}
