"use client"

import AppLayout from "@/components/app-layout"
import DashboardContent from "@/components/dashboard-content"
import TopBar from "@/components/top-bar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import NewOpportunityModal from "@/components/new-opportunity-modal"

export default function Page() {
  const [showNewOpportunity, setShowNewOpportunity] = useState(false)

  return (
    <AppLayout
      topBar={
        <TopBar
          title="Dashboard"
          rightContent={
            <Button 
              onClick={() => setShowNewOpportunity(true)} 
              className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-400 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              New Opportunity
            </Button>
          }
        />
      }
    >
      <DashboardContent showNewOpportunity={showNewOpportunity} setShowNewOpportunity={setShowNewOpportunity} />
    </AppLayout>
  )
}
