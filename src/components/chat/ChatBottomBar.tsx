import { FileImage, Mic, Paperclip, SendHorizontal, Trash2, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { EmojiPicker } from "../EmojiPicker";

import { useChat } from "@/contexts/ChatContext";
import { Label } from "../ui/label";
import { usePost } from "@/contexts/PostContext";
import { LiveAudioVisualizer } from "react-audio-visualize";

const ChatBottomBar = () => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendTextMessage, chatId } = useChat();
  const [files, setFiles] = useState<File[] | null>(null);
  const {
    isRecording,
    startRecording,
    stopRecording,
    audioUrl,
    setAudioUrl,
    recordingTime,
    // blob,
    mediaRecord,
  } = usePost();

  console.log(files)

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const selectedFiles = Array.from(event.target.files);
        const filteredFiles = selectedFiles.filter(
          (file) => file.size <= 20 * 1024 * 1024
        );
        if (filteredFiles < selectedFiles) {
          alert("Some files were too large and were not added");
        }
        setFiles(filteredFiles);
      }
    },
    []
  );

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

      <div className="w-full relative">
        {audioUrl ? (
          <div className="w-full flex items-center">
            <audio controls className="w-full h-10" src={audioUrl} />
            <Button
              onClick={() => setAudioUrl(null)}
              size={"icon"}
              variant={"ghost"}
              className=""
            >
              <Trash2 size={20} color="#83838B" />
            </Button>
          </div>
        ) : (
          <>
            {isRecording ? (
              <div className=" flex items-center gap-2 w-full">
                <div className="blinking-red-light"></div>
                <p>{formatTime(recordingTime)}</p>
                {mediaRecord && 
                <LiveAudioVisualizer
                mediaRecorder={mediaRecord && mediaRecord}
                width={250}
                height={30}
                 barColor="#83838B"
                />
              }
              </div>
            ) : (
              <>
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
                    "rounded-t-lg outline-none text-sm"
                  )}
                  rows={1}
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
              </>
            )}
          </>
        )}
      </div>

      <div className="flex items-end h-full">
        {message.trim() || audioUrl ? (
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
            <Label
              htmlFor="file"
              className="flex h-9 w-9 items-center justify-center flex-col cursor-pointer"
            >
              <input
                title="file"
                type="file"
                accept="image/*, video/*"
                multiple
                className="hidden"
                id="file"
                onChange={handleFileChange}
              />
              {/* <Button
                variant={"ghost"}
                size={"icon"}
                className={cn(
                  "h-9 w-9",
                  "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                )}
              > */}
              <FileImage size={20} className="text-muted-foreground" />
              {/* </Button> */}
            </Label>
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={"ghost"}
              size={"icon"}
              className={cn(
                "h-9 w-9",
                "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
              )}
            >
              {isRecording ? (
                <X size={20} className="text-muted-foreground" />
              ) : (
                <Mic size={20} className="text-muted-foreground" />
              )}
            </Button>
          </div>
          //   )}
        )}
      </div>
    </div>
  );
};

export default ChatBottomBar;
