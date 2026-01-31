import { useEffect, useCallback, useRef } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

// Layout & Pages
import TitleBar from "./layout/TitleBar";
import LoginScreen from "./pages/Login";
import DashboardRoute from "./routes/DashboardRoute";
import SecureRoute from "./routes/SecureRoute";

// System & Context
import { emit } from "@tauri-apps/api/event";
import UpdateOverlay from "./components/system/UpdateOverlay";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { UpdaterProvider, useUpdaterContext } from "./context/UpdaterContext";

function AppContent() {
  const { checkForUpdate } = useUpdaterContext();
  const lastScanTime = useRef<number>(0);
  const isRunning = useRef(false);

  const executeUpdateScan = useCallback(
    async (force = false) => {
      const now = Date.now();
      const COOLDOWN = 60_000; // 1 minute cooldown

      if (isRunning.current) return; // prevent overlapping
      if (!force && now - lastScanTime.current < COOLDOWN) return;

      lastScanTime.current = now;
      isRunning.current = true;
      try {
        await checkForUpdate();
      } finally {
        isRunning.current = false;
      }
    },
    [checkForUpdate],
  );

  useEffect(() => {
    const initApp = async () => {
      await emit("frontend-ready", { loggedIn: true, token: "authToken" });
      setTimeout(() => executeUpdateScan(true), 800); // initial forced scan
    };
    initApp();

    const pollInterval = setInterval(() => executeUpdateScan(), 1000 * 60 * 30); // every 30 min

    const handleRevalidation = () => {
      setTimeout(() => executeUpdateScan(), 200); // small delay debounce
    };

    window.addEventListener("focus", handleRevalidation);
    window.addEventListener("online", handleRevalidation);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener("focus", handleRevalidation);
      window.removeEventListener("online", handleRevalidation);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30">
        <TitleBar />
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route element={<SecureRoute />}>
            <Route path="/dashboard/*" element={<DashboardRoute />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <UpdateOverlay />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <UpdaterProvider>
          <AppContent />
        </UpdaterProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
