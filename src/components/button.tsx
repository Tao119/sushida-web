import { MouseEventHandler } from 'react'

interface Props {
  addClass?: string
  onClick?: MouseEventHandler
  label?: string
}

export const Button = (props: Props) => {
  return (
    <button className={`c-button ${props.addClass}`} onClick={props.onClick}>
      {props.label}
    </button>
  )
}
