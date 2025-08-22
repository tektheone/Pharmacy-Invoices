import React from 'react'
import { Navigation } from '@/components/molecules/Navigation'

export function Header() {
 return (
  <header className="bg-[#1D3358] shadow-sm border-b border-[#1D3358]/20">
   <div className="container mx-auto px-4 py-4">
    <div className="flex items-center justify-between">
     <div className="flex items-center space-x-3">
      <img
       src="https://cdn.prod.website-files.com/636d2545662598a1a2066047/678bb6cf626623b85446c12d_pdslogo.svg"
       alt="Pharmacy Data Solutions Logo"
       className="h-16 w-full"
      />
     </div>
     <Navigation />
    </div>
   </div>
  </header>
 )
}
