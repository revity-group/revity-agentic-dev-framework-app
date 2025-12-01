import { useEffect, useRef, useCallback } from 'react'

interface UseInfiniteScrollOptions {
  onLoadMore: () => void
  hasMore: boolean
  loading: boolean
  threshold?: number
  rootMargin?: string
}

export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  loading,
  threshold = 0,
  rootMargin = '100px',
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && hasMore && !loading) {
        onLoadMore()
      }
    },
    [onLoadMore, hasMore, loading]
  )

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    })

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [handleIntersection, threshold, rootMargin])

  return sentinelRef
}
