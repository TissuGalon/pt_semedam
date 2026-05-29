import React from "react"
import { PayrollSidebar } from "@/components/payroll-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { MobileBottomBar } from "@/components/mobile-bottom-bar"

export default function PayrollLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <PayrollSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col overflow-auto bg-slate-50/40 dark:bg-transparent pt-14 md:pt-0 pb-24 md:pb-0">
          {children}
        </div>
        <MobileBottomBar />
      </SidebarInset>
    </SidebarProvider>
  )
}
