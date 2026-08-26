// Default RampUp team members granted access to every new client Shared Drive.
//
// Operational configuration, not secret data — but it is still staff PII, so it
// must not be inlined into a public static bundle. This module is imported by
// the /control Server Component only, which passes the list as a prop into the
// authenticated page. Do not import it from a 'use client' file.
//
// The onboarding user can edit the list per client before submitting; this is
// only the default.

export const DEFAULT_TEAM_EMAILS: string[] = [
  'lead.nova.rampupth@gmail.com',
  'chubb.soh@gmail.com',
  'creative.rampupth@gmail.com',
  'photographerrampup@gmail.com',
  'grace_harper@rampupth.com',
  'social.rampupth@gmail.com',
  'jr.social.rampupth@gmail.com',
  'lead.halo.rampupth@gmail.com',
  'Production.assistant.halo@gmail.com',
  'video.editor.rampupth@gmail.com',
  'rampup.graphic.designer@gmail.com',
  'senior.video.editor.rampupth@gmail.com',
]

/** Shared Drive role granted to RampUp staff. */
export const TEAM_DRIVE_ROLE = 'fileOrganizer' as const

/** Shared Drive role granted to client users. */
export const CLIENT_DRIVE_ROLE = 'writer' as const
