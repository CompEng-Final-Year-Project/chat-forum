import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Icon } from "@/lib/menu-list";
import { useChat } from "@/contexts/ChatContext";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { UserProps } from "@/types";
import { Skeleton } from "./ui/skeleton";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon?: Icon;
  initials?: string;
  recipientId?: string;
  chatId?: string;
  user?: UserProps;
};

interface CollapseMenuButtonProps {
  icon: Icon;
  label: string;
  active: boolean;
  submenus: Submenu[];
  isOpen: boolean | undefined;
}

export function CollapseMenuButton({
  icon: Icon,
  label,
  active,
  submenus,
  isOpen,
}: CollapseMenuButtonProps) {
  const { setRecipientId, setChatId, setSelectedUser } =
    useChat();

  return isOpen ? (
    <Collapsible
      //   open={isCollapsed}
      //   onOpenChange={setIsCollapsed}
      defaultOpen
      className="w-full"
    >
      <CollapsibleTrigger
        className="[&[data-state=open]>div>div>svg]:rotate-180 mb-1"
        asChild
      >
        <Button
          variant={active ? "secondary" : "ghost"}
          className="w-full justify-start h-10"
        >
          <div className="w-full items-center flex justify-between">
            <div className="flex items-center">
              <span className="mr-4">
                <Icon size={18} />
              </span>
              <p
                className={cn(
                  "max-w-[150px] truncate",
                  isOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-96 opacity-0"
                )}
              >
                {label}
              </p>
            </div>
            <div
              className={cn(
                "whitespace-nowrap",
                isOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-96 opacity-0"
              )}
            >
              <ChevronDown
                size={18}
                className="transition-transform duration-200"
              />
            </div>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {!submenus ? (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full bg-neutral-200" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px] bg-neutral-200" />
              <Skeleton className="h-4 w-[150px] bg-neutral-200" />
            </div>
          </div>
        ) : (
          <div className="">
            {submenus?.map(
              (
                {
                  href,
                  label,
                  active,
                  icon: Icon,
                  recipientId,
                  initials,
                  chatId,
                  user,
                },
                index
              ) => (
                <TooltipProvider  key={index} disableHoverableContent>
                  <Tooltip  delayDuration={100}>
                    <TooltipTrigger className="w-full" >
                      <Button
                        key={index}
                        variant={active ? "secondary" : "ghost"}
                        className="w-full justify-start h-10 mb-1 text-gray-600"
                        asChild
                        onClick={() => {
                          setRecipientId(recipientId as string);
                          if (chatId) {
                            setChatId(chatId);
                          }
                          if (user) {
                            setSelectedUser(user);
                          }
                        }}
                      >
                        <Link to={href} className="w-full">
                          <span className="mr-4 ml-2">
                            {initials ? (
                              <Avatar className="flex justify-center items-center">
                                <AvatarFallback>{initials}</AvatarFallback>
                              </Avatar>
                            ) : (
                              <Avatar className="flex justify-center items-center">
                                {Icon && <Icon size={18} />}
                              </Avatar>
                            )}
                          </span>
                          <p
                            className={cn(
                              "max-w-[100px] truncate",                              isOpen
                                ? "translate-x-0 opacity-100"
                                : "-translate-x-96 opacity-0"
                            )}
                          >
                            {label}
                          </p>
                        </Link>
                      </Button>
                      <TooltipContent
                        side="right"
                        align="start"
                        
                      >
                        {label}
                      </TooltipContent>
                    </TooltipTrigger>
                  </Tooltip>
                </TooltipProvider>
              )
            )}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant={active ? "secondary" : "ghost"}
                className="w-full justify-start h-10 mb-1"
              >
                <div className="w-full items-center flex justify-between">
                  <div className="flex items-center">
                    <span className={cn(isOpen === false ? "" : "mr-4")}>
                      <Icon size={18} />
                    </span>
                    <p
                      className={cn(
                        "max-w-[200px] truncate",
                        isOpen === false ? "opacity-0" : "opacity-100"
                      )}
                    >
                      {label}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" align="start" alignOffset={2}>
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent side="right" sideOffset={25} align="start">
        <DropdownMenuLabel className="max-w-[190px] truncate">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {submenus?.map(({ href, label }, index) => (
          <DropdownMenuItem key={index} asChild>
            <Link className="cursor-pointer" to={href}>
              <p className="max-w-[180px] truncate">{label}</p>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuArrow className="fill-border" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
