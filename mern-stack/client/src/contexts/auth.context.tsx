import { createContext, useContext, useState } from "react";

import { getAccessTokenFromLS } from "@/utils/auth.util";

interface AuthContextState {
  isAuthenticated: boolean; // check xem đã đăng nhập hay chưa
  setIsAuthenticated: (isAuthenticated: boolean) => void; // set trạng thái đăng nhập
}

const intialAuthContext: AuthContextState = {
  isAuthenticated: !!getAccessTokenFromLS(),
  setIsAuthenticated: () => {},
};

export const AuthContext = createContext<AuthContextState>(intialAuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    intialAuthContext.isAuthenticated
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
