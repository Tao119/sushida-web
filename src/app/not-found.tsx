'use client'
import { useRouter } from 'next/navigation'

const CustomErrorPage = () => {
  const router = useRouter()
  return (
    <>
      <span>このページは存在しません。</span>
      <a href="/">TOP</a>へ戻る
    </>
  )
}

export default CustomErrorPage
