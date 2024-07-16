// import { Message, UserData } from "@/assets/data";
import ChatTopBar from "./ChatTopBar";
import { ChatList } from "./ChatList";
import { Message } from "@/types";
import { useChat } from "@/contexts/ChatContext";


export function Chat({type}: {type: "direct" | "course"}) {
  const {messages} = useChat()

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopBar type={type} />

      <ChatList
        messages={messages as Message[]}
      />
    </div>
  );
}
