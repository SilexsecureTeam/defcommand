import { createContext, useEffect, useState } from "react";
import { getAuthToken } from "../services/videosdk";

export const AuthContext = createContext<any>(null);

const STORAGE_KEY = "authUser";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24h

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authDetails, setAuthDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  /** Restore auth from localStorage on mount */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      setAuthDetails(JSON.parse(stored));
    } catch (err) {
      console.error("Failed to load auth:", err);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Fetch VideoSDK token when user.id changes */
  useEffect(() => {
    const userId = authDetails?.user?.id;
    if (!userId) return;

    let cancelled = false;

    const fetchToken = async () => {
      try {
        if (authDetails.meeting_token) return; // already have it

        const token = await getAuthToken(
          userId,
          authDetails.user?.role ?? "guest",
        );
        if (!token || cancelled) return;

        const updated = { ...authDetails, meeting_token: token };
        setAuthDetails(updated);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to fetch meeting token:", err);
      }
    };

    fetchToken();

    return () => {
      cancelled = true;
    };
  }, [authDetails?.user?.id]);

  /** Update auth explicitly (login / refresh) */
  const updateAuth = (user: any) => {
    if (!user) {
      setAuthDetails(null);
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    setAuthDetails(user);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...user,
        expiresAt: Date.now() + SESSION_DURATION,
      }),
    );
  };

  /** Logout */
  const logout = () => {
    setAuthDetails(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{ authDetails, updateAuth, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
