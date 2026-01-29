import { useEffect, useState } from "react";
import { ref, off, onValue } from "firebase/database";
import { db } from "../services/firebase";

export interface LiveAsset {
  id: string; // contact_encrypt_id
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  time_string: string;
  timestamp: number;
}

export function useFleetTracking() {
  const [assets, setAssets] = useState<Record<string, LiveAsset>>({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const liveRef = ref(db, "drivers_live");

    onValue(liveRef, (snapshot) => {
      if (!snapshot.exists()) {
        setAssets({});
        setIsConnected(false);
        return;
      }

      const data = snapshot.val();
      console.log(data);

      setAssets(data);
      setIsConnected(true);
    });

    return () => off(liveRef);
  }, []);

  return { assets, isConnected };
}
