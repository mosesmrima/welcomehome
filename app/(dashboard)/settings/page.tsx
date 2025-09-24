"use client"

import { useState } from "react"
import { Card } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Badge } from "@/app/components/ui/badge"
import { cn } from "@/app/lib/utils"
import { Upload, Mail, Bell, Shield, User } from "lucide-react"

const tabs = [
  { id: "profile", label: "Profile settings", icon: User },
  { id: "security", label: "Security settings", icon: Shield },
  { id: "notifications", label: "Notification settings", icon: Bell },
  { id: "email", label: "Email settings", icon: Mail },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="bg-primary text-white text-2xl">JM</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">John Martins</h2>
          <p className="text-gray-800">johnmartins@gmail.com</p>
          <Badge className="mt-1">Connected: United Kingdom</Badge>
        </div>
      </div>

      {/* Settings Card */}
      <Card className="overflow-hidden">
        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2",
                    activeTab === tab.id
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-gray-700 hover:text-gray-800"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "email" && <EmailSettings />}
        </div>
      </Card>
    </div>
  )
}

function ProfileSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Personal Info</h3>
        <p className="text-sm text-gray-800 mb-6">Update your photo and personal details.</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">First name</label>
            <Input defaultValue="John" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last name</label>
            <Input defaultValue="Martins" />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Email address</label>
          <Input defaultValue="johnmartins@gmail.com" />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Phone number</label>
          <Input defaultValue="+1 (555) 4598" />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Profile Photo</label>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>JM</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Click to upload or drag and drop
              </Button>
              <p className="text-xs text-gray-700 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option>Australia</option>
              <option>United Kingdom</option>
              <option>United States</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Timezone</label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option>PST UTC-08:00</option>
              <option>EST UTC-05:00</option>
              <option>GMT UTC+00:00</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button>Save changes</Button>
      </div>
    </div>
  )
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Password</h3>
        <p className="text-sm text-gray-800 mb-6">Please enter your current password to change your password</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Current password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">New password</label>
            <Input type="password" placeholder="Your new password must be more than 8 characters" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Confirm new password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button>Update password</Button>
      </div>
    </div>
  )
}

function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">General notifications</h3>
        <p className="text-sm text-gray-800 mb-6">Set what you'll be notified in our service</p>

        <div className="space-y-4">
          <NotificationRow
            title="Earnings Report"
            description=""
            options={["None", "In-app", "Email"]}
          />
          <NotificationRow
            title="New Properties Listing"
            description=""
            options={["None", "In-app", "Email"]}
          />
          <NotificationRow
            title="Property Updates"
            description=""
            options={["None", "In-app", "Email"]}
          />
        </div>
      </div>
    </div>
  )
}

function EmailSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Email notifications</h3>
        <p className="text-sm text-gray-800 mb-6">Set up email notifications that you'll receive on your email.</p>

        <div className="space-y-4">
          <EmailToggle
            title="Newsletter"
            description="Receive the latest news, updates from us"
            enabled={true}
          />
          <EmailToggle
            title="Trading Alerts"
            description="Get notified about all buying and feature updates"
            enabled={true}
          />
        </div>
      </div>
    </div>
  )
}

function NotificationRow({ title, description, options }: { title: string, description: string, options: string[] }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium">{title}</p>
        {description && <p className="text-sm text-gray-700">{description}</p>}
      </div>
      <div className="flex gap-2">
        {options.map((option) => (
          <Button key={option} variant="outline" size="sm">
            {option}
          </Button>
        ))}
      </div>
    </div>
  )
}

function EmailToggle({ title, description, enabled }: { title: string, description: string, enabled: boolean }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-700">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" defaultChecked={enabled} className="rounded" />
      </div>
    </div>
  )
}