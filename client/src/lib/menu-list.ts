import { UserChatWithId, UserProps } from "@/types";
import { getInitials } from "@/utils/helpers";
import { Inbox, LucideIcon } from "lucide-react";
import { FaHashtag, FaPaperPlane, FaUsers } from "react-icons/fa";
import { IconType } from "react-icons/lib";

export type Icon = LucideIcon | IconType;

type Submenu = {
  href: string;
  label: string;
  active: boolean;
  initials?: string;
  icon?: Icon
  recipientId?: string;
  user?: UserProps
  chatId?: string
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: Icon;
  submenus: Submenu[];
  // recipientId?: string
};

type Group = {
  groupLabel: string;
  menus: Menu[];
  
};

export function getMenuList(pathname: string, users: UserChatWithId[]): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/general-feed",
          label: "General Feed",
          active: pathname.includes("/general-feed"),
          icon: Inbox,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Messages",
      menus: [
        {
          href: "",
          label: "Direct Messages",
          active: false,
          icon: FaPaperPlane,
          submenus: users?.map(({user, chatId}) => {
            return {
              href: `/direct-messages/${user._id}`,
              label: `${user.firstName} ${user.lastName}`,
              active: pathname === `/direct-messages/${user._id}`,
              initials: getInitials(user.firstName, user.lastName),
              recipientId: user._id,
              chatId,
              user
            };
          }),
          // [
          //   {
          //     href: "/direct-messages/:id",
          //     label: "Marvin",
          //     active: pathname === "/direct-messages/:id",
          //     icon: FaUser
          //   },
          //   {
          //     href: "/direct-messages/:id",
          //     label: "Mavis",
          //     active: pathname === "/direct-messages/:id",
          //     icon: FaUser
          //   }
          // ]
        },
        {
          href: "",
          label: "Channels",
          active: pathname.includes("/channels"),
          icon: FaUsers,
          submenus: [
            {
              href: "/channels/:id",
              label: "Marvin",
              active: pathname === "/channels/:id",
              icon: FaHashtag,
            },
            {
              href: "/posts/new",
              label: "Mavis",
              active: pathname === "/channels/:id",
              icon: FaHashtag,
            },
          ],
        },
      ],
    },
    // {
    //   groupLabel: "Settings",
    //   menus: [
    //     {
    //       href: "/users",
    //       label: "Users",
    //       active: pathname.includes("/users"),
    //       icon: Users,
    //       submenus: []
    //     },
    //     {
    //       href: "/account",
    //       label: "Account",
    //       active: pathname.includes("/account"),
    //       icon: Settings,
    //       submenus: []
    //     }
    //   ]
    // }
  ];
}
