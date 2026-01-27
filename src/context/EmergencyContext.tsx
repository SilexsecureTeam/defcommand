import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import useEmergencyFeed from "../hooks/useEmergencyFeed";
import { EmergencyEvent } from "../utils/types/location";

interface EmergencyContextType {
  emergencies: EmergencyEvent[];
  selectedEmergency: EmergencyEvent | null;
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  selectEmergency: (id: string) => void;
  acknowledge: (id: string) => void;
}

const EmergencyContext = createContext<EmergencyContextType | null>(null);

export const EmergencyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { allEmergency } = useEmergencyFeed();

  // Local state for handled/acknowledged alerts
  const [emergencies, setEmergencies] = useState<EmergencyEvent[]>([]);
  const [selectedEmergency, setSelectedEmergency] =
    useState<EmergencyEvent | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Sync feed with local state
  useEffect(() => {
    if (!allEmergency) return;

    // Transform object/feed into a structured array
    const formatted: EmergencyEvent[] = Object.entries(allEmergency).map(
      ([id, val]: any) => ({
        id,
        senderId: val.senderId,
        isEmergency: val.isEmergency,
        timestamp: val.timestamp,
      }),
    );

    setEmergencies(formatted);

    // Auto-select the most recent active emergency for the HUD overlay
    const mostRecentActive = [...formatted]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .find((e) => e.isEmergency);

    if (mostRecentActive) {
      setSelectedEmergency(mostRecentActive);
    }
  }, [allEmergency]);

  const openPanel = useCallback(() => setIsPanelOpen(true), []);
  const closePanel = useCallback(() => setIsPanelOpen(false), []);

  const selectEmergency = useCallback((id: string) => {
    setEmergencies((prev) => {
      const found = prev.find((e) => e.id === id);
      if (found) setSelectedEmergency(found);
      return prev;
    });
  }, []);

  const acknowledge = useCallback((id: string) => {}, []);

  const value = useMemo(
    () => ({
      emergencies,
      selectedEmergency,
      isPanelOpen,
      openPanel,
      closePanel,
      selectEmergency,
      acknowledge,
    }),
    [
      emergencies,
      selectedEmergency,
      isPanelOpen,
      openPanel,
      closePanel,
      selectEmergency,
      acknowledge,
    ],
  );

  return (
    <EmergencyContext.Provider value={value}>
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const ctx = useContext(EmergencyContext);
  if (!ctx)
    throw new Error("useEmergency must be used inside EmergencyProvider");
  return ctx;
};
