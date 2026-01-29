import { useEffect, useState } from "react";
import { ref, off, onValue } from "firebase/database";
import { db } from "../services/firebase";

export default function useEmergencyFeed() {
  const [allEmergency, setAllEmergency] = useState<Record<string, any> | null>(
    null,
  );
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const emergencyRef = ref(db, "emergency");

    const unsubscribe = onValue(emergencyRef, (snapshot) => {
      const data = snapshot.val();
      setAllEmergency(data);
      setIsConnected(!!data);
    });

    return () => off(emergencyRef);
  }, []);

  return { allEmergency, isConnected };
}
