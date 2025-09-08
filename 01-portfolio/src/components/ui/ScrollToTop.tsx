// src/components/ui/ScrollToTop.tsx
// 맨 위로 가기 버튼 컴포넌트

'use client'

import { useState, useEffect } from 'react'
import { Fab, Zoom, useScrollTrigger } from '@mui/material'
import { KeyboardArrowUp } from '@mui/icons-material'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // 스크롤 위치 감지
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  })

  useEffect(() => {
    setIsVisible(trigger)
  }, [trigger])

  // 맨 위로 스크롤
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <Zoom in={isVisible} timeout={200}>
      <Fab
        onClick={handleClick}
        color="primary"
        size="medium"
        aria-label="맨 위로 가기"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
          boxShadow: 3,
          '&:hover': {
            transform: 'scale(1.1)',
          },
          transition: 'transform 0.2s ease-in-out',
        }}
      >
        <KeyboardArrowUp />
      </Fab>
    </Zoom>
  )
}