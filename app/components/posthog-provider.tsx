'use client'

import { useEffect } from 'react'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import posthog from 'posthog-js'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_TOKEN || process.env.NEXT_PUBLIC_POSTHOG_KEY
    const client = posthog as unknown as { __loaded?: boolean }

    if (!token || client.__loaded) {
      return
    }

    posthog.init(token, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || '/ingest',
      ui_host: 'https://eu.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: true,
      defaults: '2026-01-30',
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
