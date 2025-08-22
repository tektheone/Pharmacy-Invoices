import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, FileText, History } from 'lucide-react'

export function Navigation() {
  const location = useLocation()

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/validation', label: 'Upload Invoice', icon: FileText },
    { path: '/history', label: 'History', icon: History },
  ]

  return (
    <nav className="flex space-x-1">
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = location.pathname === item.path

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive
                ? 'nav-active'
                : 'nav-inactive'
              }`}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
