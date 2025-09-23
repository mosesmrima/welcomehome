"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Activity, Settings, HelpCircle, LogOut, Instagram, Linkedin } from "lucide-react"
import { cn } from "@/app/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"

const sidebarItems = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: Activity,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col bg-black">
      {/* User Profile */}
      <div className="flex flex-col items-center justify-center p-6 text-white">
        <Avatar className="h-16 w-16 mb-3">
          <AvatarImage src="/avatar.jpg" alt="User" />
          <AvatarFallback className="bg-primary text-white text-lg">JM</AvatarFallback>
        </Avatar>
        <h3 className="text-sm font-semibold">John Martins</h3>
        <p className="text-xs text-gray-300">johnmartins@gmail.com</p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-900 hover:text-white mb-2",
                isActive && "bg-gray-900 text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Help Section */}
      <div className="p-4">
        <div className="rounded-lg bg-primary p-4 text-center mb-4">
          <HelpCircle className="h-8 w-8 text-white mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-white mb-1">Need help?</h4>
          <p className="text-xs text-white/80 mb-3">Talk to us</p>
          <Button size="sm" variant="secondary" className="w-full">
            Support
          </Button>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-2 mb-4">
          <button className="rounded-lg bg-gray-800 p-2 text-white hover:bg-gray-700">
            <Instagram className="h-4 w-4" />
          </button>
          <button className="rounded-lg bg-gray-800 p-2 text-white hover:bg-gray-700">
            <Linkedin className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}