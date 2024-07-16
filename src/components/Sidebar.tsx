import { useAuth } from "@/contexts/AuthContext";
import uenrLogo from "../assets/uenrLogo.svg";
import { Menu } from "./Menu";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

const Sidebar = () => {
  const { logout } = useAuth();
  return (
    <div className="bg-muted/40 h-screen p-4 md:w-64 md:border-r flex flex-col justify-between">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <img
            src={uenrLogo}
            alt="University Chat Forum"
            className="h-8 w-auto"
          />
          <h2 className="text-lg font-semibold">Chat Forum</h2>
        </div>
        <nav className="">
          <Menu isOpen />
        </nav>
      </div>

      <div className="flex justify-center items-center p-4">
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
  );
};

export default Sidebar;
