"use client"

import { createContext, useState, type ReactNode } from "react"

type FilterContextType = {
    duration: number
    setDuration: (value: number) => void
}

export const FilterContext = createContext<FilterContextType>({
    duration: 90,
    setDuration: () => {},
})

export function FilterProvider({ children }: { children: ReactNode }) {
    const [duration, setDuration] = useState(90)
  
    return (
      <FilterContext.Provider value={{ duration, setDuration }}>
        {children}
      </FilterContext.Provider>
    )
  }
  