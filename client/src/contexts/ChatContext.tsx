import { UserChat, UserProps } from "@/types";
import { baseUrl, getRequest, postRequest } from "@/utils/services";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

interface ChatContextProps {
  createChat: (secondId: string) => Promise<void>;
  userChats: UserProps[] | null;
  potentialChats: UserProps[] | null;
}


export const ChatContext = createContext<ChatContextProps>({
  createChat: () => Promise.resolve(),
  userChats: [],
  potentialChats: []
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [userChats, setUserChats] = useState<UserProps[] | null>(null);
  const [potentialChats, setPotentialChats] = useState<UserProps[] | null>(null);
  const {pathname} = useLocation()
  const navigate = useNavigate()

  const { user, users } = useAuth();

  const getUserChats = useCallback(async () => {
    if (user?._id) {
      const response = await getRequest(`${baseUrl}/chats/`);
      const userChatIds = response.chats.flatMap((chat: UserChat) =>
        chat.members.filter((memberId) => memberId !== user._id)
      ) as string[]
      const chatUsers = users.filter((userItem) =>
        userChatIds.includes(userItem._id.toString())
      );
      const potentialChatsUsers = users.filter((userItem) =>
        !userChatIds.includes(userItem._id.toString())
      );
      setUserChats(chatUsers)
      setPotentialChats(potentialChatsUsers)
    }
  }, [users, user]);

  const createChat = useCallback(async (secondId: string) => {
    const response = await postRequest(`${baseUrl}/chats/${secondId}`);
    if (response.error) {
      return console.log("Error creating chat", response);
    }

    // setUserChats((prev: UserChat[] | null) =>
    //   prev ? [...prev, response.chat] : [response.chat]
    // );
    if(pathname !== `/direct-message/${secondId}`){
      navigate(`/direct-messages/${secondId}`)
    }

    await getUserChats()
  }, [getUserChats]);

  useEffect(() => {
    
    getUserChats();
  }, [users, getUserChats]);

  const value: ChatContextProps = { createChat, userChats, potentialChats };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
