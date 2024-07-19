// import { Info, Phone, Video } from 'lucide-react';
// import { cn } from '@/lib/utils';
import { UserProps } from "@/types";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import { getInitials } from "@/utils/helpers";
import { cn } from "@/lib/utils";
import { HashIcon, Info } from "lucide-react";
import { Button } from "../ui/button";
import { RecipientInfoCard } from "../RecipientInfoCard";
import { AnimatePresence, motion } from "framer-motion";
import { Skeleton } from "../ui/skeleton";
import SheetSideBar from "../SheetSideBar";
import { useSocket } from "@/contexts/SocketContext";

export default function ChatTopBar({ type }: { type: "direct" | "course" }) {
  const { user } = useAuth();
  const { selectedUser, channel } = useChat();
  const [showInfoCard, setShowInfoCard] = useState(false);
  const infoCardRef = useRef<HTMLDivElement>(null);
  const { onlineUsers } = useSocket();
  // const [loading, setLoading] = useState(false)

  const sharedCourses = user?.courses.filter((course) =>
    selectedUser?.courses.some((course2) => course._id === course2._id)
  );
  const isOnline = onlineUsers.some(
    (user) => user.userId === selectedUser?._id
  );

  const toggleCard = () => {
    setShowInfoCard(true);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        infoCardRef.current &&
        !infoCardRef.current.contains(e.target as Node)
      ) {
        setShowInfoCard(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const initials = getInitials(
    selectedUser?.firstName as string,
    selectedUser?.lastName as string
  );
  return (
    <div className="border-b shadow-sm">
      <div className="flex flex-row justify-center items-center md:px-4 max-sm:pe-4">
        <div className="md:hidden">
          <SheetSideBar />
        </div>
        <div className="w-full overflow-hidden h-20 flex justify-between items-center ">
          {type === "direct" ? (
            <>
              {!selectedUser ? (
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full bg-neutral-200" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px] bg-neutral-200" />
                    <Skeleton className="h-4 w-[150px] bg-neutral-200" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="relative inline-block">
                  <Avatar className="flex justify-center items-center">
                    {/* <AvatarImage
            src={selectedUser?.avatar}
            alt={selectedUser?.firstName}
            width={6}
            height={6}
            className="w-10 h-10 "
            /> */}
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 bg-green-500 border-2 text-xs text-white border-white rounded-full w-4 h-4 flex items-center justify-center" />
                  )}

                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium max-sm:w-[8.5rem] truncate">
                      {`${selectedUser?.firstName} ${selectedUser?.lastName}`}{" "}
                    </span>
                    {isOnline ? (
                      <span className="text-xs">Online</span>
                    ) : (
                      <span className="text-xs">Active 2 mins ago</span>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {!channel ? (
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full bg-neutral-200" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px] bg-neutral-200" />
                    <Skeleton className="h-4 w-[150px] bg-neutral-200" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Avatar className="flex justify-center items-center">
                    <AvatarFallback>
                      <HashIcon />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium max-sm:w-[8.5rem] truncate">
                      {channel.name}
                    </span>
                    <span className="text-xs">Active 2 mins ago</span>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="">
            <Button
              onClick={toggleCard}
              variant={"ghost"}
              size={"icon"}
              className={cn(
                "h-9 w-9",
                "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
              )}
            >
              <Info size={20} className="text-muted-foreground" />
            </Button>
          </div>
        </div>
        <AnimatePresence></AnimatePresence>
        {showInfoCard && (
          <motion.div
            ref={infoCardRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed right-[20px] top-16 z-30"
          >
            <RecipientInfoCard
              user={selectedUser as UserProps}
              sharedCourses={sharedCourses as { _id: string; name: string }[]}
              type={type}
              channel={channel!}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
