"use client"
import dynamic from "next/dynamic"
// Removido useEffect, useRouter, e a lógica de popstate daqui

/*  This file is a *Server Component*.
    We lazily load the browser-only implementation below,
    disabling SSR to avoid any window-related errors.           */
const InvestigatingClient = dynamic(() => import("./_client"), { ssr: false })

export default function InvestigatingPage() {
  // A lógica de popstate foi movida para InvestigatingClient
  return <InvestigatingClient />
}
