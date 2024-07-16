import { ReactNode,  createContext, useContext, useEffect, useState } from "react";
import {  io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { OnlineUsers } from "@/types";



interface SocketContextProps{
    socket: Socket | null;
    onlineUsers: OnlineUsers[];
}

export const SocketContext = createContext<SocketContextProps>({
    socket: null,
    onlineUsers: []
});

export const useSocket = () => {
    return useContext(SocketContext)
}

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUsers[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!socket && user) {
      const socket = io(import.meta.env.VITE_BASEURL, {
        query: { userId: user?._id },
      });
      setSocket(socket);

      socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
      });

      socket.on("getOnlineUsers", (users: OnlineUsers[]) => {
        setOnlineUsers(users);
      });

      return () => {
        socket.close();
        setSocket(null);
      };
    }
  }, [user]);

  const value: SocketContextProps = { onlineUsers, socket };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
