import { UserProps } from "@/types";
import { baseUrl, getRequest, postRequest } from "@/utils/services";
import { createContext, ReactNode, useCallback, useEffect, useState } from "react";

export interface UserChat {
  members: string[];
  _id: string;
}

export const ChatContext = createContext({});

export const ChatContextProvider = ({ children, user }: { children: ReactNode; user: UserProps }) => {
  const [userChats, setUserChats] = useState<UserChat[] | null>(null);

  const createChat = useCallback(async (firstId: string, secondId: string) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({ firstId, secondId })
    );
    if (response.error) {
      return console.log("Error creating chat", response);
    }

    setUserChats((prev: UserChat[] | null) =>
      prev ? [...prev, response] : [response]
    );
    console.log(firstId, secondId);
  }, []);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        // setIsUserChatsLoading(true);
        // setUserChatsError(null);

        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

        // setIsUserChatsLoading(false);

        if (response.error) {
        //   return setUserChatsError(response);
        }

        setUserChats(response);
      }
    };
    getUserChats();
  }, [user]);

  const value = { userChats, createChat };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
