// Server Component — no 'use client'.
//
// data/clients.json is read here, on the server, and each record is mapped down
// to the four fields the control-panel UI actually renders before anything is
// passed to the browser.
//
// This file previously carried 'use client' and imported the raw JSON directly,
// which made Next.js inline every record — including drive_folder_id,
// brand_assets_folder_id and website_folder_id — into the public
// /_next/static chunk for this route. That chunk is downloadable without
// authenticating into /control, so middleware protection on the route did not
// protect the data.
//
// Keep the raw import server-side. Do not spread raw records into props.

import clientsData from '@/data/clients.json'
import ControlPanelClient, { type ControlClient } from './ControlPanelClient'

export default function ControlPage() {
  // Explicit field-by-field mapping, not a spread — every field crossing to the
  // browser is listed here. Reads the full list (not getAllClients()) so the
  // publish dropdown keeps showing every client, including ones with no media,
  // exactly as before.
  const clients: ControlClient[] = (
    clientsData.clients as Array<Record<string, unknown>>
  ).map((client) => ({
    name:     String(client.name ?? ''),
    slug:     String(client.slug ?? ''),
    cuisine:  String(client.cuisine ?? ''),
    location: String(client.location ?? ''),
  }))

  return (
    <div className="min-h-[100dvh] bg-[#EDEDED]">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-5 pt-10 pb-6 flex items-start justify-between">
        <div>
          <p className="font-poppins text-[11px] font-bold text-[#3DBE5A] uppercase tracking-[2px] mb-1">
            RampUp
          </p>
          <h1 className="font-sora font-extrabold text-3xl text-[#2D2D2D] tracking-tight">
            Control Panel
          </h1>
          <p className="font-poppins text-sm text-[#888888] mt-1">Agency use only.</p>
        </div>
        <form method="POST" action="/api/control-logout">
          <button
            type="submit"
            className="font-poppins text-xs text-[#888888] hover:text-[#2D2D2D] transition mt-2"
          >
            Sign out
          </button>
        </form>
      </div>

      {/* Sections */}
      <div className="max-w-2xl mx-auto px-5 pb-20 space-y-6">
        <ControlPanelClient clients={clients} />
      </div>
    </div>
  )
}
