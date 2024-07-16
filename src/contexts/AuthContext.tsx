import { baseUrl, getRequest, postRequest } from "@/utils/services";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { UserProps } from "@/types";
import { useNavigate } from "react-router-dom";

interface AuthContextProps {
  user: UserProps | null;
  users: UserProps[];
  setUser: Dispatch<SetStateAction<UserProps | null>>;
  login: (
    url: string,
    body: BodyInit
  ) => Promise<{ message: string; error: boolean }>;
  logout: () => Promise<{ message: string; error: boolean }>;
  getUser: (userId: string) => Promise<UserProps | null>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => null,
  login: () => Promise.resolve({ message: "", error: false }),
  logout: () => Promise.resolve({ message: "", error: false }),
  users: [],
  getUser: () => Promise.resolve(null),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(() => {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });
  const navigate = useNavigate()

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

  const getUser = useCallback(async (userId: string) => {
    try {
      const response = await getRequest(`${baseUrl}/users/${userId}`);
      return response.user;
    } catch (error) {
      console.log(error);
    }
  }, []);


  const logout = useCallback(async () => {
    Cookies.remove("token");
    sessionStorage.removeItem("user");
    setUser(null);
    localStorage.clear()
    navigate('/sign-in')
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
    users,
    getUser,
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
