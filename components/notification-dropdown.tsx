"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, MessageSquare, Heart, X } from "lucide-react"

type NotificationItem = {
  id: number
  type: "reply" | "like"
  user: string
  content: string
  time: string
  read: boolean
  link: string
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  
  const unreadCount = notifications.filter(n => !n.read).length

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const clearNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-8 h-8 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-background text-[10px] flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-80 terminal-window z-50">
            <div className="terminal-header">
              <span className="text-xs text-muted-foreground tracking-wider">Notifications</span>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-3 flex gap-3 hover:bg-secondary/50 transition-colors ${
                        !notification.read ? "bg-secondary/30" : ""
                      }`}
                    >
                      <div className="w-8 h-8 bg-secondary border border-border shrink-0 flex items-center justify-center">
                        {notification.type === "reply" ? (
                          <MessageSquare className="w-4 h-4 text-primary" />
                        ) : (
                          <Heart className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={notification.link}
                          onClick={() => setIsOpen(false)}
                          className="block"
                        >
                          <p className="text-xs text-foreground">
                            <span className="font-medium">{notification.user}</span>{" "}
                            <span className="text-muted-foreground">{notification.content}</span>
                          </p>
                          <p className="text-xs text-primary mt-0.5">{notification.time}</p>
                        </Link>
                      </div>
                      <button 
                        onClick={() => clearNotification(notification.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-border p-3">
              <Link 
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-xs text-primary hover:text-primary/80 transition-colors block text-center"
              >
                View All Notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
