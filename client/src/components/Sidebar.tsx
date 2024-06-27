import { FaChevronDown, FaInbox, FaPaperPlane, FaUsers } from "react-icons/fa";
import { Button } from "./ui/button";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
import uenrLogo from "../assets/uenrLogo.svg";

const Sidebar = () => {
  return (
    <div className="bg-muted/40 p-4 md:w-64 md:border-r">
      <div className="flex items-center gap-2 mb-4">
        <img
          src={uenrLogo}
          alt="University Chat Forum"
          className="h-8 w-auto"
        />
        <h2 className="text-lg font-semibold">Chat Forum</h2>
      </div>
      <nav className="space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-2">
          {/* <InboxIcon className="w-4 h-4" /> */}
          <span className="w-4 h-4">
            <FaInbox />
          </span>
          General Feed
        </Button>
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 ">
              <span className="w-4 h-4">
                <FaPaperPlane />
              </span>
              Direct Messages
              <Button variant="ghost" size="icon" className="ml-auto">
                <span className="w-4 h-4 group-data-[state=open]:rotate-180 transition-transform">
                  <FaChevronDown />
                </span>
              </Button>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Button
              variant="ghost"
              className="w-full text-gray-700  justify-start"
            >
              Marvin
            </Button>
            <Button
              variant="ghost"
              className="w-full text-gray-700  justify-start"
            >
              Angel
            </Button>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <span className="w-4 h-4">
                <FaUsers />
              </span>
              Channels
              <Button variant="ghost" size="icon" className="ml-auto">
                <span className="w-4 h-4 group-data-[state=open]:rotate-180 transition-transform">
                  <FaChevronDown />
                </span>
              </Button>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Button
              variant="ghost"
              className="w-full text-gray-700 justify-start"
            >
              # General
            </Button>
            <Button
              variant="ghost"
              className="w-full text-gray-700  justify-start"
            >
              # Random
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </nav>
    </div>
  );
};

export default Sidebar;
