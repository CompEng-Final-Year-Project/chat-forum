import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import HomePage from "./pages/HomePage";
import ProtectRoute from "./components/ProtectRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/auth/reset-password/:id/:token"
          element={<ResetPassword />}
        />
        <Route
          path="/*"
          element={
            <ProtectRoute>
              <HomePage />
            </ProtectRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
