import { debounce } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'

export const useWindowScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0)

  const debouncedSetScrollPosition = useMemo(
    () =>
      debounce((scrollY: number) => {
        setScrollPosition(scrollY)
      }, 100),
    [],
  )

  useEffect(() => {
    const handleScroll = () => {
      debouncedSetScrollPosition(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [debouncedSetScrollPosition])

  return scrollPosition
}
