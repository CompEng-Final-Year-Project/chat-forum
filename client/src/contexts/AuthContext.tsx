import { AuthContextProps, UserProps } from "@/types";
import { baseUrl, getRequest, postRequest } from "@/utils/services";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => null,
  login: () => Promise.resolve({ message: "", error: false }),
  logout: () => Promise.resolve({ message: "", error: false }),
  users: []
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(() => {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });

  const [users, setUsers] = useState<UserProps[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (user) {
          const response = await getRequest(`${baseUrl}/users`);
          setUsers(response?.users);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [user]);

  const login = useCallback(async (url: string, body: BodyInit) => {
    try {
      const response = await postRequest(url, body);
      const token = Cookies.get("token");
      if (token) {
        const decoded = jwtDecode(token);
        sessionStorage.setItem("user", JSON.stringify(decoded));
        setUser(decoded as UserProps);
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  }, []);

  const logout = useCallback(async () => {
    Cookies.remove("token");
    sessionStorage.removeItem("user");
    setUser(null);
    return Promise.resolve({
      message: "Logged out successfully",
      error: false,
    });
  }, []);

  const value: AuthContextProps = {
    user,
    setUser,
    login,
    logout,
    users
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
