"use client"

import { ReactNode } from "react"

interface TopBarProps {
  title: string
  searchBar?: ReactNode
  rightContent?: ReactNode
}

export default function TopBar({ title, searchBar, rightContent }: TopBarProps) {
  return (
    <div className="h-16 mx-4 mt-4 mb-0 bg-white/70 backdrop-blur-md border border-white/40 rounded-[2rem] shadow-sm px-6">
      <div className="h-full grid grid-cols-3 items-center gap-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        </div>
        <div className="flex items-center justify-center">
          {searchBar}
        </div>
        <div className="flex items-center justify-end">
          {rightContent}
        </div>
      </div>
    </div>
  )
}

