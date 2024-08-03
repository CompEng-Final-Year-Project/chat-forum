import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import HomePage from "./pages/HomePage";
import ProtectRoute from "./components/ProtectRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import ErrorFallback from "./components/ErrorFallBack";

function App() {

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
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
    </ErrorBoundary>
  );
}

export default App;
