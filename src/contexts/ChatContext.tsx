import {
  Message,
  Notifications,
  UploadResponse,
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
  sendTextMessage: (
    textMessage: string,
    type: "text" | "document" | "audio" | "video" | "image",
    currentChatId: string
  ) => void;
  retrySendMessage: (message: Message) => void;
  messages: Message[] | null;
  setChatId: Dispatch<SetStateAction<string>>;
  chatId: string;
  loadingMessages: boolean;
  userGroupChats: UserGroupChatWithId[] | null;
  channel: UserGroupChatWithId | null;
  sendTextMessageError: string;
  notifications: Notifications[];
  markAsRead: (chatId: string, notifications: Notifications[]) => void;
  upload: (file: File) => Promise<UploadResponse | null>;
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
  retrySendMessage: () => {},
  messages: [],
  setChatId: () => null,
  chatId: "",
  loadingMessages: false,
  userGroupChats: [],
  channel: null,
  sendTextMessageError: "",
  notifications: [],
  markAsRead: () => null,
  upload: () => Promise.resolve(null),
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
  const [notifications, setNotifications] = useState<Notifications[]>(() => {
    const notifications = localStorage.getItem("notifications");
    return notifications ? JSON.parse(notifications) : [];
  });

  const { socket } = useSocket();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, users } = useAuth();

  useEffect(() => {
    localStorage.setItem("chatId", chatId);
  }, [chatId]);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("recipientId", recipientId);
    const userDetails = users?.find(
      (userItem) => userItem._id.toString() === recipientId
    );
    setSelectedUser(userDetails || null);
  }, [recipientId, users]);

  useEffect(() => {
    if (socket) {
      socket.emit(newMessage?.courseId ? "sendGroupMessage" : "sendMessage", {
        ...newMessage,
        recipientId,
      });

      socket?.on("getMessage", (message) => {
        if (chatId === message.chatId && message.sender === recipientId) {
          setMessages((prevMessages) =>
            prevMessages ? [...prevMessages, message] : [message]
          );
        }
      });

      socket?.on("getNotifications", (response) => {
        setNotifications((prev) =>
          prev
            ? [{ ...response, isRead: response.chatId === chatId }, ...prev]
            : [response]
        );
      });

      socket.on("getGroupMessage", (message) => {
        if (chatId === message.chatId && user?._id !== message.sender) {
          setMessages((prevMessages) =>
            prevMessages ? [...prevMessages, message] : [message]
          );
        }
      });

      socket?.on("getGroupNotifications", (response) => {
        setNotifications((prev) =>
          prev
            ? [{ ...response, isRead: response.chatId === chatId }, ...prev]
            : [response]
        );
      });

      return () => {
        socket.off("getMessage");
        socket.off("getGroupMessage");
        socket.off("getNotifications");
        socket.off("getGroupNotifications");
      };
    }
  }, [socket, recipientId, chatId, newMessage, user]);

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
        ?.map((chat: UserChat) => {
          const otherMembersId = chat.members?.filter(
            (memberId) => memberId !== user._id
          );
          const courseId = chat.courses[0];
          const userDetails = otherMembersId
            ?.map((memberId) =>
              users?.find(
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
                courseId,
              }
            : null;
        })
        .filter(Boolean) as UserGroupChatWithId[];

      setUserChats(userChatsWithIds);
      setPotentialChats(
        users?.filter(
          (userItem) =>
            !userChatsWithIds
              .map((chat) => chat.user._id)
              .includes(userItem._id.toString())
        )
      );
      setUserGroupChats(userGroupChatsWithIds);
    }
  }, [users, user, newMessage, notifications]);
  // users, user, newMessage, socket, messages, notifications

  useEffect(() => {});

  useEffect(() => {
    const getMessages = async () => {
      if (user && chatId) {
        setLoadingMessages(true);
        try {
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
              courses: chat.courses,
            });
          }
          setMessages(chat?.messages);
        } catch (error) {
          console.log(error);
        } finally {
          setLoadingMessages(false);
        }
      }
    };
    getMessages();
  }, [chatId, users, user]);

  const createChat = useCallback(
    async (secondId: string) => {
      const response = await postRequest(
        `${baseUrl}/chats/create-direct-chat/${secondId}`
      );
      if (!response.error) {
        if (pathname !== `/direct-message/${secondId}`) {
          navigate(`/direct-messages/${secondId}`);
        }

        setChatId(response.chat._id);
        await getUserChats();
      } else {
        return console.log("Error creating chat", response);
      }
    },
    [getUserChats]
  );

  const manageCourseChats = useCallback(async () => {
    const response = await postRequest(`${baseUrl}/chats/manage-course-chats`);
    if (!response.error) {
      await getUserChats();
    } else {
      return console.log("Error managing group chats", response);
    }
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
    async (
      textMessage: string,
      type: "text" | "document" | "audio" | "video" | "image",
      currentChatId: string
    ) => {
      if (!textMessage) {
        console.error("No text message");
        return;
      }
      const tempMessageId = Date.now().toString();
      const tempMessage: Message = {
        _id: tempMessageId,
        chatId: currentChatId,
        sender: user?._id as string,
        text: textMessage,
        createdAt: new Date(),
        sending: true,
        error: false,
        type: type || "text",
      };

      setMessages((prev: Message[] | null) =>
        prev ? [...prev, tempMessage] : [tempMessage]
      );

      try {
        const response = await postRequest(
          `${baseUrl}/message/send-message`,
          JSON.stringify(tempMessage)
        );

        if (response.error) {
          setSendTextMessageError(response.message);
          setMessages((prev: Message[] | null) =>
            prev
              ? prev.map((msg) =>
                  msg._id === tempMessageId
                    ? { ...msg, sending: false, error: true }
                    : msg
                )
              : null
          );
          return;
        }

        const newText =
          response.chat.messages[response.chat.messages.length - 1];

        const newMessage = {
          chatId: response.chat._id,
          sender: newText.sender,
          text: newText.text,
          createdAt: newText.createdAt,
          courseId: response.chat.type === "course" && response.chat.courses[0],
          type: newText.type,
        };

        setNewMessage(newMessage);
        setMessages((prev: Message[] | null) =>
          prev
            ? prev.map((msg) => (msg._id === tempMessageId ? newMessage : msg))
            : [newMessage]
        );
      } catch (error) {
        console.log(error);
        setMessages((prev: Message[] | null) =>
          prev
            ? prev.map((msg) =>
                msg._id === tempMessageId
                  ? { ...msg, sending: false, error: true }
                  : msg
              )
            : null
        );
      }
    },
    [user]
  );

  const retrySendMessage = useCallback(async (message: Message) => {
    const tempMessageId = message._id;
    setMessages((prev: Message[] | null) =>
      prev
        ? prev.map((msg) =>
            msg._id === tempMessageId
              ? { ...msg, sending: true, error: false }
              : msg
          )
        : null
    );
    try {
      const response = await postRequest(
        `${baseUrl}/message/send-message`,
        JSON.stringify(message)
      );
      if (response.error) {
        setSendTextMessageError(response.message);
        setMessages((prev: Message[] | null) =>
          prev
            ? prev.map((msg) =>
                msg._id === tempMessageId
                  ? { ...msg, sending: false, error: true }
                  : msg
              )
            : null
        );
        return;
      }
      const newText = response.chat.messages[response.chat.messages.length - 1];
      const newMessage = {
        chatId: response.chat._id,
        sender: newText.sender,
        text: newText.text,
        createdAt: newText.createdAt,
        courseId: response.chat.type === "course" && response.chat.courses[0],
        type: newText.type,
      };
      setNewMessage(newMessage);
      setMessages((prev: Message[] | null) =>
        prev
          ? prev.map((msg) => (msg._id === tempMessageId ? newMessage : msg))
          : [newMessage]
      );
    } catch (error) {
      console.log(error);
      setMessages((prev: Message[] | null) =>
        prev
          ? prev.map((msg) =>
              msg._id === tempMessageId
                ? { ...msg, sending: false, error: true }
                : msg
            )
          : null
      );
    }
  }, []);

  const markAsRead = useCallback(
    (chatId: string, notifications: Notifications[]) => {
      const updatedNotifications = notifications.map((notification) =>
        notification.chatId === chatId
          ? { ...notification, isRead: true }
          : notification
      );
      setNotifications(updatedNotifications);
    },
    []
  );

  const upload = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      console.log(formData);
      const response = await fetch(`${baseUrl}/uploads`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) {
        return console.log("Error uploading file", response);
      }
      return await response.json();
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
    userGroupChats,
    channel,
    sendTextMessageError,
    notifications,
    markAsRead,
    upload,
    retrySendMessage,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
