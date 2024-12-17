"use client"

import * as React from "react"
import { AudioWaveform, Blocks, Calendar, Command, Home, Inbox, MessageCircleQuestion, Search, Settings2, Sparkles, Trash2 } from "lucide-react"
import { SidebarGroupLabel } from "@/components/ui/sidebar"
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import Link from "next/link"  // Importando Link do Next.js

// Dados da navegação
const data = {
  navMain: [
    {
      title: "Home",
      url: "/admin/management",  // Corrigi a URL para usar a barra inicial
      icon: Home,
    },
    {
      title: "Add User",
      url: "/admin/management/add-user",  // Corrigi a URL para usar a barra inicial
      icon: Search,
    },
    {
      title: "Add Notebook",
      url: "/admin/management/add-notebook",  // Corrigi a URL para usar a barra inicial
      icon: Sparkles,
    },
    {
      title: "Associar",
      url: "#",
      icon: Settings2,
      isActive: true,
    },
    {
      title: "Gestores",
      url: "#",
      icon: Settings2,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Definição do componente NavMain dentro de AppSidebar
  function NavMain({ items }: { items: Array<any> }) {
    return (
      <nav>
        <ul>
          {items.map((item) => (
            <li key={item.title} className={item.isActive ? "active" : ""}>
              {item.url !== "#" ? (
                <Link href={item.url} passHref>
                  <div className="flex items-center gap-2 p-2">
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm" >{item.title}</span>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-2 p-2">
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.title}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <SidebarGroupLabel>Admin ControlNote</SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} /> {/* Usando a função NavMain dentro de AppSidebar */}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
