'use client'

import posthog, {type PostHog} from 'posthog-js'
import {PostHogProvider as PostHogProviderRaw} from 'posthog-js/react'
import type {ReactNode} from 'react'
import {useEffect} from 'react'

type PostHogProviderProps = {
  readonly children: ReactNode
}

export const PostHogProvider = (
  properties: Omit<PostHogProviderProps, 'client'>
) => {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.api.posthog.com',
      capture_exceptions: true,
      debug: process.env.NODE_ENV === 'development',
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      capture_pageleave: true, // Overrides the `capture_pageview` setting
    }) as PostHog
  }, [])

  return <PostHogProviderRaw client={posthog} {...properties} />
}

export {usePostHog as useAnalytics} from 'posthog-js/react'
