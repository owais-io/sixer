import { useEffect, useRef } from 'react'

const useSwipeGestures = (onSwipeLeft, onSwipeRight, threshold = 50) => {
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleTouchStart = (e) => {
      touchStartX.current = e.changedTouches[0].screenX
    }

    const handleTouchEnd = (e) => {
      touchEndX.current = e.changedTouches[0].screenX
      handleSwipe()
    }

    const handleSwipe = () => {
      const distance = touchStartX.current - touchEndX.current
      const absDistance = Math.abs(distance)

      if (absDistance < threshold) return

      if (distance > 0) {
        // Swiped left
        onSwipeLeft?.()
      } else {
        // Swiped right
        onSwipeRight?.()
      }
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onSwipeLeft, onSwipeRight, threshold])

  return elementRef
}

export default useSwipeGestures