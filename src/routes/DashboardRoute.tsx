import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import SecureRoute from "./SecureRoute";
import DashboardLayout from "../layout/DashboardLayout";
import SecureCall from "../pages/dashboard/SecureCall";
import ControlCenter from "../pages/dashboard/ControlCenter";
import { ChatProvider } from "../context/ChatContext";
import { StoreProvider } from "../context/StoreContext";
import { GroupProvider } from "../context/GroupContext";
import CallCenter from "../pages/dashboard/CallCenter";

const DashboardRoute = () => {
  return (
    <StoreProvider>
      <ChatProvider>
        <GroupProvider>
          <Routes>
            <Route path="/" element={<SecureRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/home" element={<Dashboard />} />
                <Route path="/call" element={<SecureCall />} />
                <Route path="/call-center" element={<CallCenter />} />
              </Route>
              <Route path="/control-center" element={<ControlCenter />} />
            </Route>
          </Routes>
        </GroupProvider>
      </ChatProvider>
    </StoreProvider>
  );
};

export default DashboardRoute;
