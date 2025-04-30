"use client"

import { createContext, useState, type ReactNode } from "react"

type FilterContextType = {
  popularity: number
  setPopularity: (value: number) => void
  duration: number
  setDuration: (value: number) => void
  decade: string | null
  setDecade: (value: string | null) => void
}

export const FilterContext = createContext<FilterContextType>({
  popularity: 3,
  setPopularity: () => { },
  duration: 90,
  setDuration: () => { },
  decade: null,
  setDecade: () => {},
})

export function FilterProvider({ children }: { children: ReactNode }) {
  const [popularity, setPopularity] = useState(3)
  const [duration, setDuration] = useState(90)
  const [decade, setDecade] = useState<string | null>(null)

  return (
    <FilterContext.Provider value={{ popularity, setPopularity, duration, setDuration, decade, setDecade }}>
      {children}
    </FilterContext.Provider>
  )
}
