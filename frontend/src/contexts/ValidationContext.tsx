import React, { createContext, useContext, useState } from 'react'

interface ValidationContextType {
 validationCount: number
 incrementValidationCount: () => void
 decrementValidationCount: () => void
}

const ValidationContext = createContext<ValidationContextType | undefined>(undefined)

export function ValidationProvider({ children }: { children: React.ReactNode }) {
 const [validationCount, setValidationCount] = useState(0)

 const incrementValidationCount = () => {
  setValidationCount(prev => prev + 1)
 }

 const decrementValidationCount = () => {
  setValidationCount(prev => Math.max(0, prev - 1))
 }

 return (
  <ValidationContext.Provider value={{
   validationCount,
   incrementValidationCount,
   decrementValidationCount
  }}>
   {children}
  </ValidationContext.Provider>
 )
}

export function useValidation() {
 const context = useContext(ValidationContext)
 if (context === undefined) {
  throw new Error('useValidation must be used within a ValidationProvider')
 }
 return context
}
