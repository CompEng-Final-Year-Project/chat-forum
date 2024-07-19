import { Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/menu-list";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";
import { Link, useLocation } from "react-router-dom";
import { CollapseMenuButton } from "./CollapseMenuButton";
import { useChat } from "@/contexts/ChatContext";
import { UserChatWithId, UserGroupChatWithId } from "@/types";

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const { pathname } = useLocation();
  const { createChat, userChats, potentialChats, userGroupChats, setRecipientId } = useChat();
  const menuList = getMenuList(pathname, userChats as UserChatWithId[], userGroupChats as UserGroupChatWithId[]);

  return (
    <ScrollArea className="[&>div>div[style]]:!block h-full">
      <nav className="justify-between flex flex-col w-full md:mt-5">
        <ul className="flex flex-col h-full  items-start space-y-1 px-2">
          {menuList?.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className=""></p>
              )}
              {menus?.map(
                ({ href, label, icon: Icon, active, submenus }, index) =>{
                  return submenus?.length === 0 ? (
                    <div  className="w-full" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                           
                              variant={active ? "secondary" : "ghost"}
                              className="w-full justify-start h-10 mb-1"
                              asChild
                            >
                              <Link to={href}>
                                <span className={cn(isOpen === false ? "" : "mr-4")}>
                                  {Icon && <Icon size={18} />}
                                </span>
                                <p
                                  className={cn(
                                    "max-w-[200px] truncate",
                                    isOpen === false
                                      ? "-translate-x-96 opacity-0"
                                      : "translate-x-0 opacity-100"
                                  )}
                                >
                                  {label}
                                </p>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === true && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    
                    <div className="w-full"  key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={active}
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  )}
              )}
            </li>
          ))}

          {userChats?.length === 0 && (
            <li className="w-full flex justify-center items-center">
              <p className="text-muted-foreground">No chats available. Start a chat below.</p>
            </li>
          )}

          {potentialChats && potentialChats.length > 0 && (
            <li className="w-full pt-5">
              <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                Potential Chats
              </p>
              {potentialChats.map((user, index) => (
                <div className="w-full" key={index}>
                  <TooltipProvider disableHoverableContent>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-10 mb-1"
                          onClick={() => {
                            setRecipientId(user._id)
                            createChat(user._id)}}
                        >
                          <span className={cn(isOpen === false ? "" : "mr-4")}>
                            <Ellipsis size={18} />
                          </span>
                          <p
                            className={cn(
                              "max-w-[200px] truncate",
                              isOpen === false
                                ? "-translate-x-96 opacity-0"
                                : "translate-x-0 opacity-100"
                            )}
                          >
                            {`${user.firstName} ${user.lastName}`}
                          </p>
                        </Button>
                      </TooltipTrigger>
                      {isOpen === true && (
                        <TooltipContent side="right">{`${user.firstName} ${user.lastName}`}</TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </li>
          )}

        </ul>
          
      </nav>
    </ScrollArea>
  );
}
