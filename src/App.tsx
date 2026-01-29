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
import { NotificationProvider } from "./context/NotificationContext";
import SecureRoute from "./routes/SecureRoute";

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
          <div className="min-h-screen">
            <TitleBar />
            <Routes>
              {/* PUBLIC */}
              <Route path="/login" element={<LoginScreen />} />

              {/* PROTECTED */}
              <Route element={<SecureRoute />}>
                <Route path="/dashboard/*" element={<DashboardRoute />} />
              </Route>

              {/* FALLBACK */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
