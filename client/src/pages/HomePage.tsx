import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Sidebar from "@/components/Sidebar";

const HomePage = () => {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-background">
        <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

export default HomePage;
