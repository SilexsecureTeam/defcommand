import { useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";
import TitleBar from "./layout/TitleBar";
import LoginScreen from "./pages/Login";
import { emit } from "@tauri-apps/api/event";
import DashboardRoute from "./routes/DashboardRoute";
import { AuthProvider } from "./context/AuthContext";
import RootRedirect from "./routes/RootRedirect";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  useEffect(() => {
    const initApp = async () => {
      await emit("frontend-ready", { loggedIn: true, token: "authToken" });
    };

    initApp();
  }, []);

  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <div className="bg-red-100 min-h-screen">
            <TitleBar />
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/dashboard/*" element={<DashboardRoute />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
