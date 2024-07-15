import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import ChatBottomBar from "./ChatBottomBar";
import { AnimatePresence, motion } from "framer-motion";
import { Message } from "@/types";
import { useChat } from "@/contexts/ChatContext";
import { getInitials } from "@/utils/helpers";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "../spinner";
import moment from "moment";
import { FaCrown } from "react-icons/fa";

interface ChatListProps {
  messages?: Message[];
}

export function ChatList({ messages }: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { loadingMessages } = useChat();
  const { user, users } = useAuth();
  const userInitials = getInitials(
    user?.firstName as string,
    user?.lastName as string
  );

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
      {loadingMessages ? (
        <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col justify-center">
          <Spinner />
        </div>
      ) : (
        <div
          ref={messagesContainerRef}
          className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
        >
          <AnimatePresence>
            {messages?.map((message, index) => {
              const formattedTime = moment(message.createdAt).format("h:mm A");
              const sender =
                users && users?.find((user) => user._id === message.sender);
              const selectedUserInitials = getInitials(
                sender?.firstName as string,
                sender?.lastName as string
              );
              return (
                <motion.div
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
                    message.sender === user?._id ? "items-end" : "items-start"
                  )}
                >
                  <div className="flex gap-3 items-center">
                    {message.sender !== user?._id && (
                      <>
                        {sender?.role !== "student" ? (
                          <div className="relative inline-block">
                            <Avatar
                              className={`w-12 h-12 border-solid border-4 border-primary  `}
                            >
                              <AvatarFallback>{selectedUserInitials}</AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-0 right-0 bg-green-500 border-2 text-xs text-white border-white rounded-full w-5 h-5 flex items-center justify-center">
                              <FaCrown />
                            </span>
                          </div>
                        ) : (
                          <Avatar className="flex justify-center items-center">
                            {/* <AvatarImage
                    src={message.avatar}
                    alt={message.name}
                    width={6}
                    height={6}
                    /> */}
                            <AvatarFallback>
                              {selectedUserInitials}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </>
                    )}
                    <div className=" flex flex-col space-x-1">
                      <span className=" bg-accent p-3 rounded-md max-w-xs ">
                        {message.text}
                      </span>
                      <span
                        className={`text-xs text-gray-500 ${
                          message.sender === user?._id
                            ? "self-end"
                            : "self-start"
                        } whitespace-nowrap`}
                      >
                        {formattedTime}
                      </span>
                    </div>
                    {message.sender === user?._id && (
                      <>
                        {user.role !== "student" ? (
                          <div className="relative inline-block">
                            <Avatar
                              className={`w-12 h-12 border-solid border-4 border-primary"  `}
                            >
                              <AvatarFallback>{userInitials}</AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-0 right-0 bg-green-500 border-2 text-xs text-white border-white rounded-full w-5 h-5 flex items-center justify-center">
                              <FaCrown />
                            </span>
                          </div>
                        ) : (
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
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
      <ChatBottomBar />
    </div>
  );
}
