import {
  Message,
  UserChat,
  UserChatWithId,
  UserGroupChatWithId,
  UserProps,
} from "@/types";
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
import { useAuth } from "./AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "./SocketContext";

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
  chatId: string;
  loadingMessages: boolean;
  userGroupChats: UserGroupChatWithId[] | null;
  channel: UserGroupChatWithId | null;
  sendTextMessageError: string;
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
  chatId: "",
  loadingMessages: false,
  userGroupChats: [],
  channel: null,
  sendTextMessageError: "",
});

export const useChat = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [userChats, setUserChats] = useState<UserChatWithId[] | null>(null);
  const [recipientId, setRecipientId] = useState<string>(
    () => localStorage.getItem("recipientId") || ""
  );
  const [userGroupChats, setUserGroupChats] = useState<
    UserGroupChatWithId[] | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [potentialChats, setPotentialChats] = useState<UserProps[] | null>(
    null
  );
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [newMessage, setNewMessage] = useState<Message | null>(null);
  const [sendTextMessageError, setSendTextMessageError] = useState("");
  const [chatId, setChatId] = useState<string>(
    () => localStorage.getItem("chatId") || ""
  );
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [channel, setChannel] = useState<UserGroupChatWithId | null>(null);
  const { socket } = useSocket();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { user, users } = useAuth();

  useEffect(() => {
    localStorage.setItem("chatId", chatId);
  }, [chatId]);

  useEffect(() => {
    localStorage.setItem("recipientId", recipientId);
    const userDetails = users?.find(
      (userItem) => userItem._id.toString() === recipientId
    );
    setSelectedUser(userDetails || null);
  }, [recipientId, users]);

  useEffect(() => {
    if (socket === null) {
      return;
    }
    if (newMessage?.courseId) {
      socket.emit("sendGroupMessage", {
        ...newMessage
      });
    } else {
      socket?.emit("sendMessage", { ...newMessage, recipientId });
    }
  }, [newMessage]);

  useEffect(() => {
    if (socket === null) {
      return;
    }
    socket?.on("getMessage", (message: Message) => {
      if (message.sender !== recipientId) {
        return;
      }
      setMessages((prevMessages) =>
        prevMessages ? [...prevMessages, message] : [message]
      );
    });
    socket.on("getGroupMessage", (message) => {
      if (user?._id === message.sender) {
        return
      }
      setMessages((prevMessages) => (prevMessages? [...prevMessages, message] : [message]))
    });

    return () => {
      socket.off("getMessage");
      socket.off("getGroupMessage")
    };
  }, [socket, recipientId]);

  const getUserChats = useCallback(async () => {
    if (user?._id) {
      const response = await getRequest(`${baseUrl}/chats/`);

      const userChatsWithIds: UserChatWithId[] = response.chats
        ?.filter((chat: UserChat) => chat.type === "direct")
        .map((chat: UserChat) => {
          const otherMemberId = chat.members.find(
            (memberId) => memberId !== user._id
          );
          const userDetail = users?.find(
            (userItem) => userItem._id.toString() === otherMemberId
          );
          return userDetail
            ? { user: userDetail, chatId: chat._id, messages: chat.messages }
            : null;
        })
        .filter(Boolean) as UserChatWithId[];

      const userGroupChatsWithIds: UserGroupChatWithId[] = response.chats
        ?.filter((chat: UserChat) => chat.type === "course")
        .map((chat: UserChat) => {
          const otherMembersId = chat.members.filter(
            (memberId) => memberId !== user._id
          );
          const courseId = chat.courses[0]
          const userDetails = otherMembersId
            .map((memberId) =>
              users.find(
                (userItem) => userItem._id.toString() === memberId.toString()
              )
            )
            .filter(Boolean) as UserProps[];
          return userDetails.length > 0
            ? {
                users: userDetails,
                chatId: chat._id,
                messages: chat.messages,
                name: chat.name,
                courseId
              }
            : null;
        })
        .filter(Boolean) as UserGroupChatWithId[];

      const userChatIds = userChatsWithIds?.map((chat) => {
        return chat.user._id;
      });
      const potentialChatsUsers = users?.filter(
        (userItem) => !userChatIds.includes(userItem._id.toString())
      );
      setUserChats(userChatsWithIds);
      setPotentialChats(potentialChatsUsers);
      setUserGroupChats(userGroupChatsWithIds);
    }
  }, [users, user]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        setLoadingMessages(true);
        if (!user) {return}
        const response = await getRequest(`${baseUrl}/chats/`);
        const chat = response.chats?.find(
          (chat: UserChat) => chat._id === chatId
        );
        if (chat?.type === "course") {
          const userDetails = chat.members
            .map((memberId: string) =>
              users.find((userItem) => userItem._id.toString() === memberId)
            )
            .filter(Boolean) as UserProps[];
          setChannel({
            users: userDetails,
            chatId: chat._id,
            messages: chat.messages,
            name: chat.name,
            courses: chat.courses
          });
        }
        setMessages(chat?.messages);
        setLoadingMessages(false);
      } catch (error) {
        console.log(error);
        setLoadingMessages(false);
      }
    };
    getMessages();
  }, [chatId, users]);

  const createChat = useCallback(
    async (secondId: string) => {
      const response = await postRequest(
        `${baseUrl}/chats/create-direct-chat/${secondId}`
      );
      if (response.error) {
        return console.log("Error creating chat", response);
      }

      if (pathname !== `/direct-message/${secondId}`) {
        navigate(`/direct-messages/${secondId}`);
      }

      setChatId(response.chat._id)
      await getUserChats();
    },
    [getUserChats]
  );

  const manageCourseChats = useCallback(async () => {
    const response = await postRequest(`${baseUrl}/chats/manage-course-chats`);

    if (response.error) {
      return console.log("Error managing group chats", response);
    }

    await getUserChats();
  }, [getUserChats]);

  useEffect(() => {
    if (user) {
      manageCourseChats();
    }
  }, [user, manageCourseChats]);

  useEffect(() => {
    getUserChats();
  }, [users, getUserChats]);

  useEffect(() => {
    const match = pathname.match(/\/direct-messages\/([^/]+)/);
    if (match) {
      setRecipientId(match[1]);
    }
  }, [pathname]);

  const sendTextMessage = useCallback(
    async (textMessage: string, currentChatId: string) => {
      try {
        const sentMessage = {
          chatId: currentChatId,
          sender: user?._id as string,
          text: textMessage,
          createdAt: new Date(),
        };

        const response = await postRequest(
          `${baseUrl}/message/send-message`,
          JSON.stringify(sentMessage)
        );
        console.log(response)

        if (response.error) {
          return setSendTextMessageError(response.message);
        }

        const newText =
          response.chat.messages[response.chat.messages.length - 1];

        const newMessage = {
          chatId: response.chat._id,
          sender: newText.sender,
          text: newText.text,
          createdAt: newText.createdAt,
          courseId: response.chat.type === "course" && response.chat.courses[0]
        };

        setNewMessage(newMessage);
        setMessages((prev: Message[] | null) =>
          prev ? [...prev, newMessage] : [newMessage]
        );
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

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
    userGroupChats,
    channel,
    sendTextMessageError,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
