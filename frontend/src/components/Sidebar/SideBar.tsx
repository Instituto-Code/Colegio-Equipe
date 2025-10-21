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

type Role = "coordenador" | "professor" 


export const SideBar = () => {

    const { user } = useAuth()

    const items = user?.role && user.role in MenuItems ? MenuItems[user.role as Role] : [] 

    return(
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel>Bem vindo(a), {user?.name}</SidebarGroupLabel>
        <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon 
                return(
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                        {Icon ? <Icon/> : <div>Tem não</div> }
                      <span>{item.title}</span>
                    </a>
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