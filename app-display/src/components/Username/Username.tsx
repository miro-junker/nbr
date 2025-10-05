import './Username.css'

interface Props {
  name: string
}

export const Username = ({ name }: Props) => {
  if (!name) return null

  return (
    <div className="username">
      <span className="username__label">PILOT</span>
      <span className="username__name">{name}</span>
    </div>
  )
}
