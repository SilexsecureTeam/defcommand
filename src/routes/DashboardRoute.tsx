import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import DashboardLayout from "../layout/DashboardLayout";
import SecureCall from "../pages/dashboard/SecureCall";
import ControlCenter from "../pages/dashboard/ControlCenter";
import { ChatProvider } from "../context/ChatContext";
import { StoreProvider } from "../context/StoreContext";
import { GroupProvider } from "../context/GroupContext";
import CallCenter from "../pages/dashboard/CallCenter";
import { EmergencyProvider } from "../context/EmergencyContext";
import EmergencyOverlay from "../components/control/EmergencyOverlay";
import { MeetingProvider } from "../context/MeetingContext";
import TacticalCallInterface from "../pages/dashboard/TacticalCallInterface";
import { CommandProvider } from "../context/CommandContext";
import CommandOverlay from "../components/CommandOverLay";
import { CommandToast } from "../utils/notifications/CommandToast";
const DashboardRoute = () => {
  return (
    <StoreProvider>
      <MeetingProvider>
        <ChatProvider>
          <GroupProvider>
            <EmergencyProvider>
              <CommandProvider>
                <EmergencyOverlay />
                <CommandOverlay />
                <CommandToast />
                <Routes>
                  <Route path="/" element={<DashboardLayout />}>
                    <Route path="/home" element={<Dashboard />} />
                    <Route path="/call" element={<SecureCall />} />
                    <Route path="/call-center" element={<CallCenter />} />
                  </Route>

                  <Route path="/control-center" element={<ControlCenter />} />
                </Routes>

                <TacticalCallInterface />
              </CommandProvider>
            </EmergencyProvider>
          </GroupProvider>
        </ChatProvider>
      </MeetingProvider>
    </StoreProvider>
  );
};

export default DashboardRoute;
