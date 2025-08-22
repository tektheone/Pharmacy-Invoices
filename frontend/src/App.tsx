import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/templates/Layout'
import { HomePage } from '@/components/pages/HomePage'
import { ValidationPage } from '@/components/pages/ValidationPage'
import { HistoryPage } from '@/components/pages/HistoryPage'
import { ValidationProvider } from '@/contexts/ValidationContext'

function App() {
 return (
  <ValidationProvider>
   <Layout>
    <Routes>
     <Route path="/" element={<HomePage />} />
     <Route path="/validation" element={<ValidationPage />} />
     <Route path="/history" element={<HistoryPage />} />
    </Routes>
   </Layout>
  </ValidationProvider>
 )
}

export default App
