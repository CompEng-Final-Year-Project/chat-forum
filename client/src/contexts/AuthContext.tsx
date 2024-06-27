import { AuthContextProps } from "@/types";
import { createContext, ReactNode, useState } from "react";

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    setUser: () => null,
  
});

export const AuthProvider = ({ children }: {children: ReactNode}) => {
  const [user, setUser] = useState(() => {
    const user = sessionStorage.getItem('user')
    return user ? JSON.parse(user) : null
  });
  const value: AuthContextProps = {
    user,
    setUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
