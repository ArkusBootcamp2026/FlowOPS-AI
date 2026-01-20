"use client"
import { useState, useEffect } from "react"
import KanbanBoard from "@/components/kanban-board"
import StatsCard from "@/components/stats-card"
import FilterBar from "@/components/filter-bar"
import NewOpportunityModal from "@/components/new-opportunity-modal"
import { Flame, Code, Users, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getHighPriorityCount, getTopNeededSkill } from "@/services/opportunities"
import { getTeamAvailabilityPercentage } from "@/services/members"
import { motion } from "framer-motion"

interface DashboardContentProps {
  showNewOpportunity?: boolean
  setShowNewOpportunity?: (show: boolean) => void
}

export default function DashboardContent({ showNewOpportunity: externalShowNewOpportunity, setShowNewOpportunity: externalSetShowNewOpportunity }: DashboardContentProps = {}) {
  const [internalShowNewOpportunity, setInternalShowNewOpportunity] = useState(false)
  const showNewOpportunity = externalShowNewOpportunity ?? internalShowNewOpportunity
  const setShowNewOpportunity = externalSetShowNewOpportunity ?? setInternalShowNewOpportunity
  const [filters, setFilters] = useState({
    urgency: "",
    skill: "",
    assignedTeam: "",
  })
  const [stats, setStats] = useState([
    { label: "Critical Arrivals", value: "0", icon: Flame },
    { label: "Top Needed Skill", value: "Loading...", icon: Code },
    { label: "Team Availability", value: "0%", icon: Users },
  ])

  // Load real statistics from Supabase
  const loadStats = async () => {
    try {
      const [highPriorityCount, topSkill, availability] = await Promise.all([
        getHighPriorityCount(),
        getTopNeededSkill(),
        getTeamAvailabilityPercentage(),
      ])

      setStats([
        { label: "Critical Arrivals", value: String(highPriorityCount), icon: Flame },
        { label: "Top Needed Skill", value: topSkill, icon: Code },
        { label: "Team Availability", value: `${availability}%`, icon: Users },
      ])
    } catch (error) {
      console.error('Error loading stats:', error)
      // Keep default values in case of error
    }
  }

  // Load stats on mount
  useEffect(() => {
    loadStats()
  }, [])

  // Listen for opportunity status changes to refresh stats
  useEffect(() => {
    const handleOpportunityStatusChanged = () => {
      // Refresh stats when opportunity status or urgency changes
      loadStats()
    }

    // Listen for custom events from KanbanBoard
    window.addEventListener('opportunityStatusChanged', handleOpportunityStatusChanged)
    window.addEventListener('addOpportunity', handleOpportunityStatusChanged)

    return () => {
      window.removeEventListener('opportunityStatusChanged', handleOpportunityStatusChanged)
      window.removeEventListener('addOpportunity', handleOpportunityStatusChanged)
    }
  }, [])

  return (
    <div className="space-y-6 p-6">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.3 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        <FilterBar filters={filters} setFilters={setFilters} hideSortBy />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 px-2">Opportunities Pipeline</h2>
          <KanbanBoard filters={filters} />
        </div>

        <NewOpportunityModal open={showNewOpportunity} onOpenChange={setShowNewOpportunity} />
    </div>
  )
}
