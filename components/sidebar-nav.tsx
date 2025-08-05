"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Activity, BarChart3, Calendar, FileText, Home, MessageSquare, Settings, Users, Dumbbell, User } from 'lucide-react'

interface SidebarNavProps {
  role: "provider" | "patient"
}

export function SidebarNav({ role }: SidebarNavProps) {
  const pathname = usePathname()
  
  const providerItems = [
    {
      title: "Dashboard",
      href: "/provider/dashboard",
      icon: Home,
    },
    {
      title: "Patients",
      href: "/provider/patients",
      icon: Users,
    },
    {
      title: "Exercise Library",
      href: "/provider/exercises",
      icon: Dumbbell,
    },
    {
      title: "Calendar",
      href: "/provider/calendar",
      icon: Calendar,
    },
    {
      title: "Analytics",
      href: "/provider/analytics",
      icon: BarChart3,
    },
    {
      title: "Messages",
      href: "/provider/messages",
      icon: MessageSquare,
    },
    {
      title: "Documents",
      href: "/provider/documents",
      icon: FileText,
    },
    {
      title: "Settings",
      href: "/provider/settings",
      icon: Settings,
    },
  ]
  
  const patientItems = [
    {
      title: "Dashboard",
      href: "/patient/dashboard",
      icon: Home,
    },
    {
      title: "My Exercises",
      href: "/patient/exercises",
      icon: Dumbbell,
    },
    {
      title: "Find Providers",
      href: "/patient/providers",
      icon: Users,
    },
    {
      title: "Progress",
      href: "/patient/progress",
      icon: BarChart3,
    },
    {
      title: "Schedule",
      href: "/patient/schedule",
      icon: Calendar,
    },
    {
      title: "Messages",
      href: "/patient/messages",
      icon: MessageSquare,
    },
    {
      title: "Profile",
      href: "/patient/profile",
      icon: User,
    },
    {
      title: "Settings",
      href: "/patient/settings",
      icon: Settings,
    },
  ]
  
  const items = role === "provider" ? providerItems : patientItems

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === item.href
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  )
}
