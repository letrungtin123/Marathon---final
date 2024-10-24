// tạo ra một context mới với createContext

import React, { createContext, useContext, useState } from 'react'

type CounterContextType = {
  counter: number
  handleIncrement: () => void
  handleDecrement: () => void
}

const CouterContext = createContext<CounterContextType>({
  counter: 0,
  handleIncrement: () => {},
  handleDecrement: () => {}
})

export const CounterProvider = ({ children }: { children: React.ReactNode }) => {
  const [counter, setCounter] = useState<number>(20)

  const handleIncrement = () => {
    setCounter((prev) => prev + 1)
  }

  const handleDecrement = () => {
    setCounter((prev) => prev - 1)
  }

  return (
    <CouterContext.Provider
      value={{
        counter,
        handleIncrement,
        handleDecrement
      }}
    >
      {children}
    </CouterContext.Provider>
  )
}

const useCounter = () => {
  const context = useContext(CouterContext) // sử dụng useContext để truy cập vào giá trị của context

  if (context === undefined) {
    throw new Error('useCounter must be used within a CounterProvider')
  }

  return context
}

export default useCounter
