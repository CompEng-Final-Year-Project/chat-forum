import { cn } from "@/lib/utils";
import React, { useContext, useRef } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import ChatBottomBar from "./ChatBottomBar";
import { AnimatePresence, motion } from "framer-motion";
import { Message } from "@/types";
import { ChatContext } from "@/contexts/ChatContext";
import { getInitials } from "@/utils/helpers";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "../spinner";

interface ChatListProps {
  messages?: Message[];
}

export function ChatList({
  messages,
}: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const {selectedUser, loadingMessages} = useContext(ChatContext)
  const {user} = useAuth()
  const userInitials = getInitials(user?.firstName as string, user?.lastName as string)
  const selectedUserInitials = getInitials(selectedUser?.firstName as string, selectedUser?.lastName as string)

  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
      {loadingMessages ? <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col justify-center"><Spinner /></div> :
      <div
      ref={messagesContainerRef}
        className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
      >
        <AnimatePresence>
          {messages?.map((message, index) => {
            return <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: "spring",
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                "flex flex-col gap-2 p-4 whitespace-pre-wrap",
                message.sender !== selectedUser?._id ? "items-end" : "items-start"
              )}
            >
              <div className="flex gap-3 items-center">
                {message.sender === selectedUser?._id && (
                  <Avatar className="flex justify-center items-center">
                    {/* <AvatarImage
                      src={message.avatar}
                      alt={message.name}
                      width={6}
                      height={6}
                    /> */}
                    <AvatarFallback>{selectedUserInitials}</AvatarFallback>
                  </Avatar>
                )}
                <span className=" bg-accent p-3 rounded-md max-w-xs">
                  {message.text}
                </span>
                {message.sender !== selectedUser?._id && (
                  <Avatar className="flex justify-center items-center">
                    {/* <AvatarImage
                      src={message.avatar}
                      alt={message.name}
                      width={6}
                      height={6}
                    /> */}
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </motion.div>
})}
        </AnimatePresence>
      </div>
      }
      <ChatBottomBar />
    </div>
  );
}
