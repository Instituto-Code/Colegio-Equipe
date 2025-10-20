import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { SideBar } from "../Sidebar/SideBar";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex w-screen ">
        <SideBar />
        <main className="flex flex-1 flex-col ">
          <SidebarTrigger />
          <Outlet/>
        </main>
      </div>
    </SidebarProvider>
  );
}
