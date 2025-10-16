
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SideBar } from "@/components/Sidebar/SideBar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SideBar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}