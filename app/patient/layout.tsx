import { Activity } from 'lucide-react'
import { SidebarNav } from "@/components/sidebar-nav"
import { DashboardHeader } from "@/components/dashboard-header"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarProvider, 
  SidebarTrigger 
} from "@/components/ui/sidebar"

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="flex h-16 items-center border-b px-6">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">FlexiPT</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-4 py-4">
            <SidebarNav role="patient" />
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <DashboardHeader role="patient" userName="Michael Smith" />
          <main className="flex-1 overflow-auto p-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
