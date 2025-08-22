import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, History, Upload } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card'
import { Button } from '@/components/atoms/Button'

export function HomePage() {
 const quickActions = [
  {
   title: 'Upload Invoice',
   description: 'Upload and validate a new pharmacy invoice',
   icon: Upload,
   href: '/validation',
   variant: 'default' as const,
   gradient: 'gradient-primary',
   iconBg: 'bg-gradient-to-br from-blue-500 to-purple-600',
  },
  {
   title: 'View History',
   description: 'Browse validation history and results',
   icon: History,
   href: '/history',
   variant: 'outline' as const,
   gradient: 'gradient-info',
   iconBg: 'bg-gradient-to-br from-teal-500 to-blue-600',
  },
 ]

 return (
  <div className="space-y-8">
   {/* Hero Section - Colorful */}
   <div className="text-center space-y-6 animate-fade-in">
    <div className="relative">
     {/* Colorful background elements */}
     <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-teal-400/20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-10 left-1/4 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-full blur-xl"></div>
     </div>

     <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-600 to-teal-600 bg-clip-text text-transparent">
      Pharmacy Invoice Assessment
     </h1>
     <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-6">
      Validate pharmacy invoices against reference data with automated discrepancy detection
     </p>
    </div>
   </div>

   {/* Quick Actions - Colorful */}
   <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
    {quickActions.map((action, index) => (
     <Card
      key={action.title}
      className="gradient-card colorful-shadow"
     >
      <CardHeader className="text-center">
       <div className="flex items-center justify-center space-x-3 mb-4">
        <div className={`p-4 rounded-2xl ${action.iconBg} shadow-lg`}>
         <action.icon className="h-10 w-10 text-white" />
        </div>
        <CardTitle className="text-2xl">{action.title}</CardTitle>
       </div>
       <CardDescription className="text-base">{action.description}</CardDescription>
      </CardHeader>
      <CardContent>
       <Link to={action.href}>
        <Button asChild className={`w-full h-12 text-lg font-semibold ${action.gradient} hover:shadow-xl hover:scale-105 transition-all duration-300`} variant={action.variant}>
         {action.title}
        </Button>
       </Link>
      </CardContent>
     </Card>
    ))}
   </div>

   {/* How it Works Section - Colorful */}
   <Card className="gradient-card max-w-5xl mx-auto colorful-shadow">
    <CardHeader className="text-center">
     <CardTitle className="flex items-center justify-center space-x-3 text-2xl">
      <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
       <FileText className="h-7 w-7 text-white" />
      </div>
      <span>How it works</span>
     </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
     <div className="grid gap-6 md:grid-cols-3">
      {[
       {
        step: '1',
        title: 'Upload',
        description: 'Upload your Excel invoice file (.xlsx, .xls)',
        icon: '📤',
        color: 'from-blue-500 to-purple-600'
       },
       {
        step: '2',
        title: 'Validate',
        description: 'Automated validation against reference drug data',
        icon: '🔍',
        color: 'from-green-500 to-teal-600'
       },
       {
        step: '3',
        title: 'Review',
        description: 'Review discrepancies and export results',
        icon: '📊',
        color: 'from-orange-500 to-red-600'
       }
      ].map((item, index) => (
       <div
        key={item.step}
        className="text-center space-y-4 p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-white transition-all duration-300 hover-lift border border-gray-100"
       >
        <div className="text-5xl mb-3">{item.icon}</div>
        <div className="space-y-2">
         <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${item.color} text-white text-sm font-bold shadow-lg`}>
          {item.step}
         </div>
         <h4 className="font-semibold text-lg">{item.title}</h4>
         <p className="text-sm text-muted-foreground leading-relaxed">
          {item.description}
         </p>
        </div>
       </div>
      ))}
     </div>
    </CardContent>
   </Card>
  </div>
 )
}
