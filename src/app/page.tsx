'use client'
import React, { useState } from 'react'
import { marked } from 'marked'
import { Button } from 'src/components/button'

const Home = () => {
  const [content, setContent] = useState('')

  marked.setOptions({
    gfm: true,
    breaks: true,
  })

  const htmlText = marked.parse(content)

  return (
   <div>寿司打録</div>
  )
}
export default Home
