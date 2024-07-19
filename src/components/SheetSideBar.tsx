import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { LogOut, MenuIcon } from "lucide-react";
import uenrLogo from "../assets/uenrLogo.svg";
import { Menu } from "./Menu";
import { useAuth } from "@/contexts/AuthContext";

const SheetSideBar = () => {
  const { logout } = useAuth();
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden ms-6 me-2" asChild>
        <Button className="h-8 " variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="sm:w-72 px-3 min-h-[100vh] flex flex-col justify-between"
        side="left"
      >
        <SheetHeader>
          <SheetTitle>
            <div className="flex items-center gap-2 mb-4">
              <img
                src={uenrLogo}
                alt="University Chat Forum"
                className="h-8 w-auto"
              />
              <h2 className="text-lg font-semibold">Chat Forum</h2>
            </div>
          </SheetTitle>
          <SheetDescription>
            {/* Sidebar menu for navigation and user actions. */}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-grow">
            <Menu isOpen />
        </div>
        <div className="flex justify-center items-center p-4">
          <div className="w-full grow flex items-end">
            <Button
              onClick={() => {
                logout();
              }}
              variant="outline"
              className="w-full justify-center h-10 mt-5"
            >
              <span className={"mr-4"}>
                <LogOut size={18} />
              </span>
              <p className={"whitespace-nowrap"}>Sign out</p>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SheetSideBar;
