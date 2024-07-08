// import { Message, UserData } from "@/assets/data";
import ChatTopbar from "./ChatTopBar";
import { ChatList } from "./ChatList";
import React from "react";
import { Message, UserProps } from "@/types";

interface ChatProps {
  messages?: Message[];
  selectedUser: UserProps;
}

export function Chat({ messages, selectedUser }: ChatProps) {
  const [messagesState, setMessages] = React.useState<Message[]>(
    messages ?? []
  );

  const sendMessage = (newMessage: Message) => {
    setMessages([...messagesState, newMessage]);
  };

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedUser={selectedUser} />

      <ChatList
        messages={messagesState}
        selectedUser={selectedUser}
        sendMessage={sendMessage}
      />
    </div>
  );
}
