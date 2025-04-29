"use client"

import { createContext, useState, type ReactNode } from "react"

type FilterContextType = {
  popularity: number
  setPopularity: (value: number) => void
  duration: number
  setDuration: (value: number) => void
}

export const FilterContext = createContext<FilterContextType>({
  popularity: 3,
  setPopularity: () => { },
  duration: 90,
  setDuration: () => { },
})

export function FilterProvider({ children }: { children: ReactNode }) {
  const [popularity, setPopularity] = useState(3)
  const [duration, setDuration] = useState(90)

  return (
    <FilterContext.Provider value={{ popularity, setPopularity, duration, setDuration }}>
      {children}
    </FilterContext.Provider>
  )
}
