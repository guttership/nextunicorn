import posthog from 'posthog-js'

const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_TOKEN || process.env.NEXT_PUBLIC_POSTHOG_KEY

if (posthogToken) {
  posthog.init(posthogToken, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || '/ingest',
    ui_host: 'https://eu.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: true,
    defaults: '2026-01-30',
  })
}
