import { useRouter } from 'next/navigation'

interface Props {
  addClass?: string
}

export const BackButton = (props: Props) => {
  const nav = useRouter()
  return (
    <button
      className={`c-back-button ${props.addClass}`}
      onClick={() => {
        nav.back()
      }}
    />
  )
}
