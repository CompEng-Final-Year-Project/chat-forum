import { Message, UserChat, UserChatWithId, UserProps } from "@/types";
import { baseUrl, getRequest, postRequest } from "@/utils/services";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

interface ChatContextProps {
  createChat: (secondId: string) => Promise<void>;
  userChats: UserChatWithId[] | null;
  potentialChats: UserProps[] | null;
  recipientId: string;
  selectedUser: UserProps | null;
  setRecipientId: Dispatch<SetStateAction<string>>;
  setSelectedUser: Dispatch<SetStateAction<UserProps | null>>;
  sendTextMessage: (textMessage: string, currentChatId: string) => void;
  messages: Message[] | null;
  setChatId: Dispatch<SetStateAction<string>>;
  chatId: string
  loadingMessages: boolean;
}

export const ChatContext = createContext<ChatContextProps>({
  createChat: () => Promise.resolve(),
  userChats: [],
  potentialChats: [],
  recipientId: "",
  setRecipientId: () => {},
  setSelectedUser: () => {},
  selectedUser: null,
  sendTextMessage: () => {},
  messages: [],
  setChatId: () => null,
  chatId: '',
  loadingMessages: false,
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [userChats, setUserChats] = useState<UserChatWithId[] | null>(null);
  const [recipientId, setRecipientId] = useState<string>(
    () => localStorage.getItem("recipientId") || ""
  );
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [potentialChats, setPotentialChats] = useState<UserProps[] | null>(
    null
  );
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [chatId, setChatId] = useState<string>(
    () => localStorage.getItem("chatId") || ""
  );
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { user, users } = useAuth();

  useEffect(() => {
    localStorage.setItem("chatId", chatId);
  }, [chatId]);

  useEffect(() => {
    localStorage.setItem("recipientId", recipientId);
    const userDetails = users.find(
      (userItem) => userItem._id.toString() === recipientId
    );
    setSelectedUser(userDetails || null);
  }, [recipientId, users]);

  const getUserChats = useCallback(async () => {
    if (user?._id) {
      const response = await getRequest(`${baseUrl}/chats/`);

      // console.log(response)

      const userChatsWithIds: UserChatWithId[] = response.chats
        .map((chat: UserChat) => {
          const otherMemberId = chat.members.find(
            (memberId) => memberId !== user._id
          );
          const userDetail = users.find(
            (userItem) => userItem._id.toString() === otherMemberId
          );
          return userDetail ? { user: userDetail, chatId: chat._id, messages: chat.messages } : null;
        })
        .filter(Boolean) as UserChatWithId[];

      // const userChatIds = response.chats.flatMap((chat: UserChat) =>
      //   chat.members.filter((memberId) => memberId !== user._id)
      // ) as string[]
      // const chatUsers = users.filter((userItem) =>
      //   userChatIds.includes(userItem._id.toString())
      // );
      // const potentialChatsUsers = users.filter((userItem) =>
      //   !userChatIds.includes(userItem._id.toString())
      // );

      const userChatIds = userChatsWithIds.map((chat) => {
        return chat.user._id;
      });
      const potentialChatsUsers = users.filter(
        (userItem) => !userChatIds.includes(userItem._id.toString())
      );
      setUserChats(userChatsWithIds);
      setPotentialChats(potentialChatsUsers);
    }
  }, [users, user]);

  useEffect(() => {
    const getMessages = async () => {
      try{
        setLoadingMessages(true)
        const response = await getRequest(`${baseUrl}/chats/`);
        const chat = response.chats.find((chat: UserChat) => chat._id === chatId)?.messages
        setMessages(chat);
        setLoadingMessages(false)
      }catch(error){
        console.log(error)
        setLoadingMessages(false)
      }
    }
    getMessages()
  }, [chatId])

  const createChat = useCallback(
    async (secondId: string) => {
      const response = await postRequest(`${baseUrl}/chats/${secondId}`);
      if (response.error) {
        return console.log("Error creating chat", response);
      }

      if (pathname !== `/direct-message/${secondId}`) {
        navigate(`/direct-messages/${secondId}`);
      }

      await getUserChats();
    },
    [getUserChats]
  ); 

  useEffect(() => {
    getUserChats();
  }, [users, getUserChats]);

  useEffect(() => {
    const match = pathname.match(/\/direct-messages\/([^/]+)/);
    if (match) {
      setRecipientId(match[1]);
    }
  }, [pathname]);

  const sendTextMessage = useCallback(async (textMessage: string, currentChatId: string) => {
    try {
      const newMessage = {
        chatId: currentChatId,
        sender: user?._id as string,
        text: textMessage,
        createdAt: new Date(),
      };

      await postRequest(`${baseUrl}/message/send-message`, JSON.stringify(newMessage))


      setMessages((prev: Message[] | null) =>
        prev ? [...prev, newMessage] : [newMessage]
      );
    } catch (error) {
      console.log(error);
    }
  }, []);


  const value: ChatContextProps = {
    createChat,
    userChats,
    potentialChats,
    recipientId,
    setRecipientId,
    selectedUser,
    setSelectedUser,
    sendTextMessage,
    messages,
    setChatId,
    chatId, 
    loadingMessages,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
