import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { SideBar } from "../Sidebar/SideBar";
import { Navbar } from "../Navbar/Navbar";

export default function DashboardLayout() {
  return (
    <div className="flex flex-col w-full">
      {/* Cabeçalho carregado no topo da página */}
      <Navbar />
      {/* Dashboard abaixo do cabeçalho */}
      <SidebarProvider>
        <div className="flex w-full ">
          <SideBar />
          <main className="flex flex-1 flex-col justify-between ">
            <SidebarTrigger className="sticky" />
            <Outlet/>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
