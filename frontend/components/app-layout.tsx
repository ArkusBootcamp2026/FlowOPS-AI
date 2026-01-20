"use client"

import Sidebar from "@/components/sidebar"
import { useSidebarState } from "@/hooks/use-sidebar-state"
import { ReactNode } from "react"

interface AppLayoutProps {
  children: ReactNode
  topBar: ReactNode
}

export default function AppLayout({ children, topBar }: AppLayoutProps) {
  const { isOpen: sidebarOpen } = useSidebarState(true)

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#d1d8e6] via-[#eef2f7] to-[#e2e8f0] text-foreground overflow-hidden">
      {/* Sidebar fijo */}
      <div className="flex-shrink-0 h-full overflow-y-auto">
        <Sidebar open={sidebarOpen} />
      </div>

      {/* Contenedor principal con Top Bar y contenido */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Bar sticky */}
        <div className="sticky top-0 z-50 flex-shrink-0">
          {topBar}
        </div>

        {/* Contenido con scroll independiente */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

