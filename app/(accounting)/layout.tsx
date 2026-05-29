import React from "react"
import { AccountingSidebar } from "@/components/accounting-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { MobileBottomBar } from "@/components/mobile-bottom-bar"
import { AccountingProvider } from "@/hooks/use-accounting-context"
import { FloatingCalculator } from "@/components/accounting/floating-calculator"

export default function AccountingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AccountingProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AccountingSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col overflow-auto bg-slate-50/40 dark:bg-transparent pt-14 md:pt-0 pb-24 md:pb-0">
            {children}
          </div>
          <MobileBottomBar />
          <FloatingCalculator />
        </SidebarInset>
      </SidebarProvider>
    </AccountingProvider>
  )
}
