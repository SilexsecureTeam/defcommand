import {
  createContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  authDetails: any;
  updateAuth: (newUser: unknown) => void;
  logoutSignal: boolean;
  setLogoutSignal: Dispatch<SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "authUser";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const [logoutSignal, setLogoutSignal] = useState(false);

  // Read from localStorage on mount WITH expiration check
  const [authDetails, setAuthDetails] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    try {
      const { user, expiresAt } = JSON.parse(stored);

      // Expired → clear silently
      if (!expiresAt || Date.now() > expiresAt) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return user;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });

  // React Query cache
  const { data } = useQuery({
    queryKey: ["authUser"],
    queryFn: () => Promise.resolve(authDetails),
    initialData: authDetails,
    staleTime: 0,
  });

  // Sync query data with auth state
  useEffect(() => {
    if (data !== authDetails) {
      setAuthDetails(data);
    }
  }, [data]);

  // Update auth + localStorage WITH expiration
  const updateAuth = (newUser: unknown) => {
    setAuthDetails(newUser);

    if (newUser) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user: newUser,
          expiresAt: Date.now() + SESSION_DURATION,
        }),
      );

      queryClient.setQueryData(["authUser"], newUser);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      queryClient.removeQueries({ queryKey: ["authUser"] });
    }
  };

  return (
    <AuthContext.Provider
      value={{ authDetails, updateAuth, logoutSignal, setLogoutSignal }}
    >
      {children}
    </AuthContext.Provider>
  );
};
