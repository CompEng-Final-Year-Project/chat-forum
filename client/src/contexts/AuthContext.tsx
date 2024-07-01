import { AuthContextProps, UserProps } from "@/types";
import { postRequest } from "@/utils/services";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => null,
  login: () => Promise.resolve({message: "", error: false}),
  logout: () => Promise.resolve({message: "", error: false})
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(() => {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });

  const login = useCallback(async (url: string, body: BodyInit) => {
    try {
      const response = await postRequest(
        url,
        body
      );
      const token = Cookies.get("token");
      if(token){
        const decoded = jwtDecode(token)
        sessionStorage.setItem('user', JSON.stringify(decoded))
        setUser(decoded as UserProps)
      }
      return response
    } catch (error) {
      console.log(error);
    }
  }, [])

  const logout = useCallback(async () => {
    Cookies.remove("token");
    sessionStorage.removeItem("user");
    setUser(null);
    return Promise.resolve({message: "Logged out successfully", error: false})
  }, [])

  const value: AuthContextProps = {
    user,
    setUser,
    login,
    logout
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
