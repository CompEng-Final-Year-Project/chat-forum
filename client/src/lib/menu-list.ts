import {
  Inbox,
  LucideIcon
} from "lucide-react";
import { FaHashtag, FaPaperPlane, FaUser, FaUsers } from "react-icons/fa";
import { IconType } from "react-icons/lib";

export type Icon = LucideIcon | IconType;

type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon: Icon
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: Icon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/general-feed",
          label: "General Feed",
          active: pathname.includes("/general-feed"),
          icon: Inbox,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Messages",
      menus: [
        {
          href: "",
          label: "Direct Messages",
          active: pathname.includes("/direct-messages"),
          icon: FaPaperPlane,
          submenus: [
            {
              href: "/direct-messages/:id",
              label: "Marvin",
              active: pathname === "/direct-messages/:id",
              icon: FaUser
            },
            {
              href: "/direct-messages/:id",
              label: "Mavis",
              active: pathname === "/direct-messages/:id",
              icon: FaUser
            }
          ]
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
              icon: FaHashtag
            },
            {
              href: "/posts/new",
              label: "Mavis",
              active: pathname === "/channels/:id",
              icon: FaHashtag
            }
          ]
        },
      ]
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
