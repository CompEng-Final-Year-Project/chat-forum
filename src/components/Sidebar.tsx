import uenrLogo from "../assets/uenrLogo.svg";
import { Menu } from "./Menu";

const Sidebar = () => {
  return (
    <div className="bg-muted/40 h-screen p-4 md:w-64 md:border-r">
      <div className="flex items-center gap-2 mb-4">
        <img
          src={uenrLogo}
          alt="University Chat Forum"
          className="h-8 w-auto"
        />
        <h2 className="text-lg font-semibold">Chat Forum</h2>
      </div>
      <nav className="">
        <Menu isOpen/>
      </nav>
    </div>
  );
};

export default Sidebar;
