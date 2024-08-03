import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import ChatBottomBar from "./ChatBottomBar";
import { Message } from "@/types";
import { useChat } from "@/contexts/ChatContext";
import { getFormattedTime, getInitials } from "@/utils/helpers";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "../spinner";
import { FaCrown, FaExclamationCircle } from "react-icons/fa";
import MessageComponent from "../MessageComponent";

interface ChatListProps {
  messages?: Message[];
}

export function ChatList({ messages }: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { loadingMessages, retrySendMessage } = useChat();
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
    <div className="w-full  overflow-y-hidden overflow-x-hidden h-full flex flex-col">
      {loadingMessages ? (
        <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col justify-center">
          <Spinner />
        </div>
      ) : (
        <div
          ref={messagesContainerRef}
          className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
        >
          {messages?.map((message, index) => {
            const formattedTime = getFormattedTime(message.createdAt);
            const sender =
              users && users?.find((user) => user._id === message.sender);
            const selectedUserInitials = getInitials(
              sender?.firstName as string,
              sender?.lastName as string
            );
            return (
              <div
                key={index}
                className={cn(
                  "flex flex-col gap-2 py-1 px-[24px] whitespace-pre-wrap",
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
                            <AvatarFallback>
                              {selectedUserInitials}
                            </AvatarFallback>
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
                  <div className=" flex flex-col max-w-xs space-y-1">
                    <span
                      className={` ${
                        message.sender === user?._id
                          ? "bg-green-500 text-accent self-end "
                          : "bg-accent"
                      }
                              p-2 rounded-lg max-w-xs shadow-sm shadow-neutral-400 text-sm  w-fit flex-1 break-words`}
                    >
                      <MessageComponent
                        type={message.type}
                        text={message.text}
                      />
                    </span>
                    <span
                      className={`text-xs text-gray-500 ${
                        message.sender === user?._id ? "self-end" : "self-start"
                      } whitespace-nowrap`}
                    >
                      {message.error ? (
                        <span
                          onClick={() => retrySendMessage(message)}
                          className="text-rose-700"
                        >
                          <FaExclamationCircle />
                        </span>
                      ) : (
                        formattedTime
                      )}
                    </span>
                  </div>
                  {message.sender === user?._id && (
                    <>
                      {user.role !== "student" ? (
                        <div className="relative self-start inline-block">
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
              </div>
            );
          })}
        </div>
      )}
      <ChatBottomBar />
    </div>
  );
}
