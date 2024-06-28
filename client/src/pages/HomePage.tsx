import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Sidebar from "@/components/Sidebar";
import SheetSideBar from "@/components/SheetSideBar";

const HomePage = () => {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-background">
      <div className="max-md:hidden">
        <Sidebar  />
      </div>
      <div className="md:hidden">
        <SheetSideBar/> 
      </div>
      <Routes>
        <Route path="/general-feed" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

export default HomePage;

