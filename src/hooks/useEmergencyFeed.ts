import { useEffect, useState } from "react";
import { ref, off } from "firebase/database";
import { db } from "../services/firebase";
import { EmergencyEvent } from "../utils/types/location";

export default function useEmergencyFeed() {
  const [allEmergency, _setAllEmergency] = useState<EmergencyEvent[] | null>(
    null,
  );

  const [isConnected, _setIsConnected] = useState(false);

  useEffect(() => {
    const emergencyRef = ref(db, "emergency_alerts");

    // const unsubscribe = onValue(emergencyRef, (snapshot) => {
    //   const data = snapshot.val() || {};
    //   console.log(data);

    //   setAllEmergency(data); // updates global context
    //   setIsConnected(!!Object.keys(data).length);
    // });

    return () => off(emergencyRef);
  }, []);

  return {
    allEmergency,
    isConnected,
  };
}
