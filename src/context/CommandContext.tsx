import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  ref,
  push,
  query,
  orderByChild,
  equalTo,
  onValue,
  update,
} from "firebase/database";
import { db } from "../services/firebase";
import { AuthContext } from "./AuthContext";

export interface CommandEvent {
  id: string;
  command: string;
  senderId: string;
  recipientId: string;
  status: "pending" | "acknowledged";
  timestamp: number;
  responseTime?: number;
}

interface CommandContextType {
  sentCommands: CommandEvent[];
  receivedCommands: CommandEvent[];
  selectedCommand: CommandEvent | null;
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  sendCommand: (text: string, recipientId: string) => void;
  acknowledgeCommand: (id: string) => void;
  activeNotification: CommandEvent | null;
  setActiveNotification: (cmd: CommandEvent | null) => void;
}

const CommandContext = createContext<CommandContextType | null>(null);

export const CommandProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { authDetails } = useContext<any>(AuthContext);
  const [sentCommands, setSentCommands] = useState<CommandEvent[]>([]);
  const [receivedCommands, setReceivedCommands] = useState<CommandEvent[]>([]);
  const [selectedCommand] = useState<CommandEvent | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeNotification, setActiveNotification] =
    useState<CommandEvent | null>(null);

  // Track last notified ID to prevent repeat popups on every render
  const lastNotifiedId = useRef<string | null>(null);

  // 1. Fetch Sent/Received Commands (Separate from notification logic)
  useEffect(() => {
    if (!authDetails?.user?.id) return;

    const sentQuery = query(
      ref(db, "commands"),
      orderByChild("senderId"),
      equalTo(authDetails.user.id),
    );

    const unsubscribeSent = onValue(sentQuery, (snapshot) => {
      const val = snapshot.val();
      if (!val) {
        setSentCommands([]);
        return;
      }
      const formatted: CommandEvent[] = Object.entries(val)
        .map(([id, cmd]: [string, any]) => ({
          id,
          ...cmd,
        }))
        .sort((a, b) => b.timestamp - a.timestamp);

      setSentCommands(formatted);
    });

    const receivedQuery = query(
      ref(db, "commands"),
      orderByChild("recipientId"),
      equalTo(authDetails.user_enid),
    );

    const unsubscribeReceived = onValue(receivedQuery, (snapshot) => {
      const val = snapshot.val();
      if (!val) {
        setReceivedCommands([]);
        return;
      }
      const formatted: CommandEvent[] = Object.entries(val)
        .map(([id, cmd]: [string, any]) => ({
          id,
          ...cmd,
        }))
        .sort((a, b) => b.timestamp - a.timestamp);

      setReceivedCommands(formatted);
    });

    return () => {
      unsubscribeSent();
      unsubscribeReceived();
    };
  }, [authDetails?.user?.id, authDetails?.user_enid]);

  // 2. Notification Watcher (Top Level Hook)
  useEffect(() => {
    if (sentCommands.length > 0) {
      const latestAck = sentCommands.find(
        (cmd) => cmd.status === "acknowledged",
      );

      if (latestAck && latestAck.id !== lastNotifiedId.current) {
        lastNotifiedId.current = latestAck.id;
        setActiveNotification(latestAck);
      }
    }
  }, [sentCommands]);

  const openPanel = useCallback(() => setIsPanelOpen(true), []);
  const closePanel = useCallback(() => setIsPanelOpen(false), []);

  const sendCommand = useCallback(
    async (text: string, recipientId: string) => {
      if (!authDetails?.user?.id || !recipientId) return;
      const commandsRef = ref(db, "commands");
      const newCommandRef = push(commandsRef);
      await update(newCommandRef, {
        command: text,
        senderId: authDetails.user.id,
        recipientId,
        status: "pending",
        timestamp: Date.now(),
      });
      openPanel();
    },
    [authDetails, openPanel],
  );

  const acknowledgeCommand = useCallback(async (id: string) => {
    if (!id) return;
    const commandRef = ref(db, `commands/${id}`);
    await update(commandRef, {
      status: "acknowledged",
      responseTime: Date.now(),
    });
  }, []);

  const value = useMemo(
    () => ({
      sentCommands,
      receivedCommands,
      selectedCommand,
      isPanelOpen,
      openPanel,
      closePanel,
      sendCommand,
      acknowledgeCommand,
      activeNotification,
      setActiveNotification,
    }),
    [
      sentCommands,
      receivedCommands,
      selectedCommand,
      isPanelOpen,
      openPanel,
      closePanel,
      sendCommand,
      acknowledgeCommand,
      activeNotification,
    ],
  );

  return (
    <CommandContext.Provider value={value}>{children}</CommandContext.Provider>
  );
};

export const useCommand = () => {
  const ctx = useContext(CommandContext);
  if (!ctx) throw new Error("useCommand must be used inside CommandProvider");
  return ctx;
};
