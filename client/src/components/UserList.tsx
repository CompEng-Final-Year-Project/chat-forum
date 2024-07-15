import { useState } from "react";
import { UserProps } from "@/types";
import { getInitials } from "@/utils/helpers";
import { Input } from "./ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Avatar, AvatarFallback } from "./ui/avatar";

import { FaCrown } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

interface UserListProps {
  users: UserProps[];
}

export function UserList({ users }: UserListProps) {
  const [search, setSearch] = useState<string>("");

//   const navigate = useNavigate();

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredUsers.map((user, index) => (
          <TooltipProvider key={index} disableHoverableContent>
            <Tooltip delayDuration={100}>
              <TooltipTrigger>
                <div className="flex flex-col items-center">
                  <div className="relative inline-block">
                    <Avatar
                    //   onClick={() => navigate(`/direct-messages/${user._id}`)}
                      className={`w-12 h-12 ${
                        user.role !== "student"
                          ? "border-solid border-4 border-primary"
                          : ""
                      } `}
                    >
                      <AvatarFallback>
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 bg-green-500 border-2 text-xs text-white border-white rounded-full w-5 h-5 flex items-center justify-center">
                      {user.role !== "student" && <FaCrown />}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{user.firstName}</p>
                </div>
                <TooltipContent>
                  {`${user.firstName} ${user.lastName}`}
                </TooltipContent>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
