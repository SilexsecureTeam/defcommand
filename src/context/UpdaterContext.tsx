import { createContext, useContext } from "react";
import { useUpdater } from "../hooks/useUpdater";

const UpdaterContext = createContext<ReturnType<typeof useUpdater> | null>(
  null,
);

export function UpdaterProvider({ children }: { children: React.ReactNode }) {
  const updater = useUpdater();
  return (
    <UpdaterContext.Provider value={updater}>
      {children}
    </UpdaterContext.Provider>
  );
}

export function useUpdaterContext() {
  const ctx = useContext(UpdaterContext);
  if (!ctx)
    throw new Error("useUpdaterContext must be used inside UpdaterProvider");
  return ctx;
}
