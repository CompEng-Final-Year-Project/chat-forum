// import { Message, UserData } from "@/assets/data";
import ChatTopBar from "./ChatTopBar";
import { ChatList } from "./ChatList";
import  { useContext } from "react";
import { Message } from "@/types";
import { ChatContext } from "@/contexts/ChatContext";


export function Chat() {
  const {messages} = useContext(ChatContext)

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopBar />

      <ChatList
        messages={messages as Message[]}
      />
    </div>
  );
}
