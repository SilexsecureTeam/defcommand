import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "../services/firebase";
import { EmergencyEvent } from "../utils/types/location";

export default function useEmergencyFeed() {
  const [allEmergency, setAllEmergency] = useState<EmergencyEvent[] | null>(
    null,
  );

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const emergencyRef = ref(db, "emergency_alerts");

    const unsubscribe = onValue(emergencyRef, (snapshot) => {
      const data = snapshot.val() || {};
      console.log(data);

      setAllEmergency(data); // updates global context
      setIsConnected(!!Object.keys(data).length);
    });

    return () => off(emergencyRef);
  }, []);

  return {
    allEmergency,
    isConnected,
  };
}
