import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Sidebar from "@/components/Sidebar";
import SheetSideBar from "@/components/SheetSideBar";
import useAuthMiddleware from "@/hooks/useAuthMiddleware";
import { ChatLayout } from "@/components/chat/ChatLayout";

const HomePage = () => {
  useAuthMiddleware();
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-background">
      <div className="max-md:hidden">
        <Sidebar />
      </div>
      <div className="md:hidden">
        <SheetSideBar />
      </div>
      <div className="overflow-y-auto w-full">
        <Routes>
          <Route path="/general-feed" element={<Dashboard />} />
          <Route
            path="/direct-messages/:id"
            element={<ChatLayout type="direct" />}
          />
          <Route path="/channels/:id" element={<ChatLayout type="course" />} />
        </Routes>
      </div>
    </div>
  );
};

export default HomePage;
