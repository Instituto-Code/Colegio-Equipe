import { MenuItems } from "@/configs/MenuItems"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/authContext"
import { Link } from "react-router-dom"

type Role = "coordenador" | "professor" 

export const SideBar = () => {

    const { user } = useAuth()

    const items = user?.role && user.role in MenuItems ? MenuItems[user.role as Role] : [] 

    return(
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel className="justify-between w-[250px]">Bem vindo(a), {user?.name} </SidebarGroupLabel>
        <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon 
                return(
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                        {Icon ? <Icon/> : <div>Tem não</div> }
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
    )
}