import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { ref, update, serverTimestamp } from "firebase/database";
import { db } from "../services/firebase";
import useEmergencyFeed from "../hooks/useEmergencyFeed";
import emergencyAudio from "../utils/notifications/emergencyAudio";
import emergencyTone from "../assets/audio/emergency.mp3";
import useChat from "../hooks/useChat";

export interface EmergencyEvent {
  id: string;
  senderId: string;
  status: "pending" | "seen";
  timestamp: number;
  readableTime?: string;
  datacenterMessage?: string;
}

interface EmergencyContextType {
  emergencies: EmergencyEvent[];
  selectedEmergency: EmergencyEvent | null;
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  selectEmergency: (id: string) => void;
  acknowledge: (id: string) => void;
  respond: (id: string, message: string) => void;
}

const EmergencyContext = createContext<EmergencyContextType | null>(null);

export const EmergencyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { allEmergency } = useEmergencyFeed();
  const { useFetchContacts } = useChat();
  const { data: contacts } = useFetchContacts();

  const [emergencies, setEmergencies] = useState<EmergencyEvent[]>([]);
  const [selectedEmergency, setSelectedEmergency] =
    useState<EmergencyEvent | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // map contacts by id
  const contactsById = useMemo(() => {
    if (!contacts) return {};
    return contacts.reduce((acc: any, contact: any) => {
      acc[contact.contact_id_encrypt] = contact;
      return acc;
    }, {});
  }, [contacts]);

  useEffect(() => {
    if (!allEmergency) return;

    const formatted: EmergencyEvent[] = Object.entries(allEmergency)
      .map(([id, val]: [string, any]) => ({
        id,
        senderId: val.senderId,
        status: val.status || "pending",
        timestamp: val.timestamp,
        readableTime: val.readableTime,
        datacenterMessage: val.datacenterMessage,
      }))
      .sort((a, b) => b.timestamp - a.timestamp)
      .filter((e) => contactsById[e.senderId]); // only include known contacts

    setEmergencies(formatted);

    const newestPending = formatted.find((e) => e.status === "pending");
    if (
      newestPending &&
      (!selectedEmergency || selectedEmergency.id !== newestPending.id)
    ) {
      setSelectedEmergency(newestPending);
      emergencyAudio.play(emergencyTone);
    } else if (!newestPending) {
      emergencyAudio.stop();
    }
  }, [allEmergency, contactsById]);

  const openPanel = useCallback(() => setIsPanelOpen(true), []);
  const closePanel = useCallback(() => setIsPanelOpen(false), []);

  const selectEmergency = useCallback(
    (id: string) => {
      setSelectedEmergency(
        (prev) => emergencies.find((e) => e.id === id) || prev,
      );
    },
    [emergencies],
  );

  const acknowledge = useCallback(async (id: string) => {
    const emergencyRef = ref(db, `emergency/${id}`);
    await update(emergencyRef, {
      status: "seen",
      acknowledgedAt: serverTimestamp(),
    });
  }, []);

  const respond = useCallback(async (id: string, message: string) => {
    const emergencyRef = ref(db, `emergency/${id}`);
    await update(emergencyRef, {
      status: "seen",
      dataCenterResponse: message,
      respondedAt: serverTimestamp(),
    });
  }, []);

  const value = useMemo(
    () => ({
      emergencies,
      selectedEmergency,
      isPanelOpen,
      openPanel,
      closePanel,
      selectEmergency,
      acknowledge,
      respond,
    }),
    [
      emergencies,
      selectedEmergency,
      isPanelOpen,
      openPanel,
      closePanel,
      selectEmergency,
      acknowledge,
      respond,
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
