import { createContext, useContext, useState } from 'react'

type AuthContextType = {
  accessToken: string
}

type AuthProviderProps = {
  children: React.ReactNode
  token: string
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: ''
})

export const AuthProvider = ({ children, token }: AuthProviderProps) => {
  const [accessToken, _] = useState<string>(token)

  return <AuthContext.Provider value={{ accessToken }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}
