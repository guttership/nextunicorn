'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { usePostHog } from 'posthog-js/react'

export function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()
  const scrollMilestones = useRef<Set<number>>(new Set())

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname
      const search = searchParams.toString()
      if (search) {
        url += `?${search}`
      }
      posthog.capture('$pageview', { $current_url: url })
      scrollMilestones.current.clear()
    }
  }, [pathname, searchParams, posthog])

  useEffect(() => {
    if (!posthog) {
      return
    }

    const milestones = [25, 50, 75, 100]

    const handleScroll = () => {
      const doc = document.documentElement
      const maxScrollable = doc.scrollHeight - window.innerHeight
      if (maxScrollable <= 0) {
        return
      }

      const percent = Math.min(100, Math.round((window.scrollY / maxScrollable) * 100))

      for (const milestone of milestones) {
        if (percent >= milestone && !scrollMilestones.current.has(milestone)) {
          scrollMilestones.current.add(milestone)
          posthog.capture('scroll_depth', {
            percent: milestone,
            path: pathname,
          })
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [posthog, pathname])

  return null
}
