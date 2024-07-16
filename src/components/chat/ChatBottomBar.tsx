import { FileImage, Mic, Paperclip, SendHorizontal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { EmojiPicker } from "../EmojiPicker";

import { useChat } from "@/contexts/ChatContext";

const ChatBottomBar = () => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendTextMessage, chatId } = useChat();

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSend = () => {
    if (message.trim()) {
      sendTextMessage(message.trim(), chatId);
      setMessage("");

      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to auto
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to scrollHeight
      
    }
  };

  useEffect(() => {
    autoResizeTextarea();
  }, [message]);

  return (
    <div className="p-2  flex justify-between w-full items-center gap-2">
      <div className="flex items-end h-full">
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
          <textarea
            autoComplete="off"
            value={message}
            ref={textareaRef}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            name="message"
            placeholder="Message"
            className={cn(
              "w-full border flex items-center resize-none overflow-y-auto bg-background p-2 max-h-[10rem]  ",
              "rounded-t-lg" 
            )}
            rows={1} // Initial number of rows
            // style={{ height: "auto", overflow: "hidden" }}
          />
          <div className="absolute right-2 bottom-0.5  ">
            <EmojiPicker
              onChange={(value) => {
                setMessage(message + value);
                if (textareaRef.current) {
                  textareaRef.current.focus();
                }
              }}
            />
          </div>
        </motion.div>

            <div className="flex items-end h-full">

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
          </div>
      </AnimatePresence>
    </div>
  );
};

export default ChatBottomBar;
