// import { Info, Phone, Video } from 'lucide-react';
// import { cn } from '@/lib/utils';
import { UserGroupChatWithId, UserProps } from "@/types";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import { getInitials } from "@/utils/helpers";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { Button } from "../ui/button";
import { RecipientInfoCard } from "../RecipientInfoCard";
import { AnimatePresence, motion } from "framer-motion";
import { Skeleton } from "../ui/skeleton";
import SheetSideBar from "../SheetSideBar";
import { useSocket } from "@/contexts/SocketContext";

const ChatHeader = lazy(() => import("../ChatHeader"));

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
          <Suspense
            fallback={
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full bg-neutral-200" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px] bg-neutral-200" />
                  <Skeleton className="h-4 w-[150px] bg-neutral-200" />
                </div>
              </div>
            }
          >
            <ChatHeader
              channel={channel as UserGroupChatWithId}
              initials={initials}
              isOnline={isOnline}
              selectedUser={selectedUser as UserProps}              type={type}
            />
          </Suspense>

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
