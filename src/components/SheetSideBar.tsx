import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import uenrLogo from "../assets/uenrLogo.svg";
import { Menu } from "./Menu";

const SheetSideBar = () => {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden mx-[24px] mt-[20px]" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <div className="flex items-center gap-2 mb-4">
            <img
              src={uenrLogo}
              alt="University Chat Forum"
              className="h-8 w-auto"
            />
            <h2 className="text-lg font-semibold">Chat Forum</h2>
          </div>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
};

export default SheetSideBar;
