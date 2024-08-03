import { Avatar, AvatarFallback } from "./ui/avatar";
import { HashIcon } from "lucide-react";
import { UserGroupChatWithId, UserProps } from "@/types";
import ErrorBoundary from "./ErrorBoundary";
import ErrorFallback from "./ErrorFallBack";

interface Props {
  type: "direct" | "course";
  selectedUser: UserProps;
  initials: string;
  isOnline: boolean;
  channel: UserGroupChatWithId;
}

const ChatHeader = ({
  type,
  selectedUser,
  initials,
  isOnline,
  channel,
}: Props) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div>
        {type === "direct" ? (
          <>
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
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Avatar className="flex justify-center items-center">
                <AvatarFallback>
                  <HashIcon />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium max-sm:w-[8.5rem] truncate">
                  {channel?.name}
                </span>
                <span className="text-xs">Active 2 mins ago</span>
              </div>
            </div>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ChatHeader;
