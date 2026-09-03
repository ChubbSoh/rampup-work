'use client'

import { useEffect, useState } from 'react'

/**
 * Ad-click and campaign attribution capture.
 *
 * These params only ever appear on the FIRST page of a session — a visitor who
 * lands on /lp/bacio?gclid=... and navigates to /contact before submitting has
 * lost them from the URL by the time the form is filled in. So they are read on
 * mount and persisted to sessionStorage, and the submit handler reads them back
 * from there rather than from `window.location`.
 *
 * `gclid` is the only route to Google Ads offline conversion import. If it stops
 * being captured, Google-side attribution dies with it — there is no recovery
 * path, because Google will not accept a conversion without one.
 *
 * `fbclid` is captured separately from the `_fbc` cookie on purpose: the pixel
 * only writes `_fbc` when it sees an `fbclid`, so a visitor who arrives with one
 * but has the pixel blocked still gives us the click id here.
 *
 * sessionStorage, not localStorage: attribution should not survive a closed tab
 * and get stapled onto an unrelated visit weeks later.
 */

const STORAGE_KEY = 'rampup_tracking'

export const TRACKING_PARAMS = [
  'fbclid',
  'gclid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
] as const

export type TrackingParamKey = (typeof TRACKING_PARAMS)[number]
export type TrackingParams = Partial<Record<TrackingParamKey, string>>

function load(): TrackingParams {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as TrackingParams) : {}
  } catch {
    // Private mode / storage disabled. Attribution is best-effort, never fatal.
    return {}
  }
}

function save(params: TrackingParams): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(params))
  } catch {
    /* ignore */
  }
}

/**
 * Merge any params present in the current URL into the stored set and return
 * the result. A param already stored is only overwritten by a non-empty new
 * value, so navigating to a page without them doesn't wipe the landing values.
 */
export function captureTrackingParams(): TrackingParams {
  if (typeof window === 'undefined') return {}

  const stored = load()
  const search = new URLSearchParams(window.location.search)
  let changed = false

  for (const key of TRACKING_PARAMS) {
    const value = search.get(key)?.trim()
    if (value && stored[key] !== value) {
      stored[key] = value
      changed = true
    }
  }

  if (changed) save(stored)
  return stored
}

/** Synchronous read for submit handlers — no React state involved. */
export function readTrackingParams(): TrackingParams {
  return typeof window === 'undefined' ? {} : load()
}

/** Captures on mount and returns what is stored. */
export function useTrackingParams(): TrackingParams {
  const [params, setParams] = useState<TrackingParams>({})
  useEffect(() => {
    setParams(captureTrackingParams())
  }, [])
  return params
}
