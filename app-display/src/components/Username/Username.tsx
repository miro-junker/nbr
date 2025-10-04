import './Username.css'


interface Props {
    name: string
}


export const Username = ({ name }: Props) => {
  if (!name) return null
  
  return (
    <div className='username'>Pilot: { name }</div>
  )
}
