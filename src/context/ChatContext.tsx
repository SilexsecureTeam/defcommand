import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useAppStore } from "./StoreContext";

export const ChatContext = createContext<any>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [callType, setCallType] = useState("audio"); // Default call type
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [showCall, setShowCall] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [callMessage, setCallMessage] = useState("");
  const [messages, setMessages] = useState(false);
  const [meetingId, setMeetingId] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [typingUsers, setTypingUsers] = useState({}); // key = userId, value = true/false
  const [showContactModal, setShowContactModal] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  const [finalCallData, setFinalCallData] = useState(null);

  const [isInitiator, setIsInitiator] = useState(false);

  const [modalTitle, setModalTitle] = useState("Defcomm");
  const [members, setMembers] = useState();
  const initialShowToggleSwitch =
    JSON.parse(sessionStorage.getItem("showToggleSwitch") as any) ?? true;

  const { get } = useAppStore();

  useEffect(() => {
    let mounted = true;

    const loadSelected = async () => {
      try {
        const value = await get("selectedChatUser");
        if (mounted) {
          setSelectedChatUser(value ?? null);
        }
      } catch (err) {
        console.error("Error loading selectedChatUser:", err);
      }
    };

    loadSelected();

    return () => {
      mounted = false;
    };
  }, [get]);

  const [showToggleSwitch, setShowToggleSwitch] = useState(
    initialShowToggleSwitch,
  );
  // messageRefs container (will be set by GroupMessageList)
  const messageRefsRef = useRef(null);
  const [settings, setSettings] = useState({
    dragToRead: true,
    doubleClickToRead: true,
    pressAndHoldToRead: false,
    toggleSwitch: showToggleSwitch,
    hide_message: 1,
    hide_message_style: "open_once",
    chat_language: "en",
    walkie_language: "en",
    app_language: "en",
  });

  const registerMessageRefs = useCallback((refs: null) => {
    messageRefsRef.current = refs;
  }, []);

  return (
    <ChatContext.Provider
      value={{
        selectedChatUser,
        setSelectedChatUser,
        showCall,
        setShowCall,
        showSettings,
        setShowSettings,
        showContactModal,
        setShowContactModal,
        callMessage,
        setCallMessage,
        messages,
        setMessages,
        file,
        setFile,
        message,
        setMessage,
        callType,
        setCallType,
        typingUsers,
        setTypingUsers,
        modalTitle,
        setModalTitle,
        meetingId,
        setMeetingId,
        callDuration,
        setCallDuration,
        showToggleSwitch,
        setShowToggleSwitch,
        replyTo,
        setReplyTo,
        members,
        setMembers,
        messageRefsRef,
        registerMessageRefs,
        settings,
        setSettings,
        finalCallData,
        setFinalCallData,
        isInitiator,
        setIsInitiator,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
