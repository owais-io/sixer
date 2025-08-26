import { useEffect, useRef, useState } from 'react'

const usePullToRefresh = (onRefresh, threshold = 80) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const touchStartY = useRef(0)
  const elementRef = useRef(null)
  const isAtTop = useRef(true)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY
      isAtTop.current = window.scrollY === 0
    }

    const handleTouchMove = (e) => {
      if (!isAtTop.current || isRefreshing) return

      const currentY = e.touches[0].clientY
      const distance = currentY - touchStartY.current

      if (distance > 0) {
        e.preventDefault()
        setPullDistance(Math.min(distance, threshold * 1.5))
      }
    }

    const handleTouchEnd = async () => {
      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true)
        try {
          await onRefresh?.()
        } finally {
          setIsRefreshing(false)
        }
      }
      setPullDistance(0)
    }

    const handleScroll = () => {
      isAtTop.current = window.scrollY === 0
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [onRefresh, threshold, pullDistance, isRefreshing])

  const pullIndicatorStyle = {
    transform: `translateY(${pullDistance}px)`,
    opacity: Math.min(pullDistance / threshold, 1),
    transition: pullDistance === 0 ? 'transform 0.3s ease-out, opacity 0.3s ease-out' : 'none'
  }

  return {
    elementRef,
    isRefreshing,
    pullDistance,
    pullIndicatorStyle,
    shouldShowIndicator: pullDistance > 10 || isRefreshing
  }
}

export default usePullToRefresh