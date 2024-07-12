import { FileImage, Mic, Paperclip, SendHorizontal } from "lucide-react";
import React, { useContext, useRef, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { EmojiPicker } from "../EmojiPicker";

import { Input } from "../ui/input";
import { ChatContext } from "@/contexts/ChatContext";

const ChatBottomBar = () => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { sendTextMessage, chatId } = useContext(ChatContext);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  //   const handleThumbsUp = () => {
  //     const newMessage: Message = {
  //       id: message.length + 1,
  //       name: loggedInUserData.name,
  //       avatar: loggedInUserData.avatar,
  //       message: "👍",
  //     };
  //     sendMessage(newMessage);
  //     setMessage("");
  //   };

  const handleSend = () => {
    if (message.trim()) {
      sendTextMessage(message.trim(), chatId);
      setMessage("");

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  return (
    <div className="p-2  flex justify-between w-full items-center gap-2">
      <div className="flex">
        <Button
          variant={"ghost"}
          size={"icon"}
          className={cn(
            "h-9 w-9",
            "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
          )}
          onClick={handleSend}
        >
          <Paperclip size={20} className="text-muted-foreground" />
        </Button>
      </div>

      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="w-full relative"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
          <Input
            autoComplete="off"
            value={message}
            ref={inputRef}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            name="message"
            placeholder="Message"
            className=" w-full border rounded-full flex items-center h-9 resize-none overflow-hidden bg-background"
          />
          <div className="absolute right-2 bottom-0.5  ">
            <EmojiPicker
              onChange={(value) => {
                setMessage(message + value);
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
            />
          </div>
        </motion.div>

        {message.trim() ? (
          <Button
            variant={"ghost"}
            size={"icon"}
            className={cn(
              "h-9 w-9",
              "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
            )}
            onClick={handleSend}
          >
            <SendHorizontal size={20} className="text-muted-foreground" />
          </Button>
        ) : (
          // {!message.trim() && !isMobile && (
          <div className="flex">
            <Button
              variant={"ghost"}
              size={"icon"}
              className={cn(
                "h-9 w-9",
                "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
              )}
            >
              <FileImage size={20} className="text-muted-foreground" />
            </Button>
            <Button
              variant={"ghost"}
              size={"icon"}
              className={cn(
                "h-9 w-9",
                "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
              )}
            >
              <Mic size={20} className="text-muted-foreground" />
            </Button>
          </div>
          //   )}
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBottomBar;
