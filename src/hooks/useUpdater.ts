import { useCallback, useState, useRef } from "react";
import { check, Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

export type UpdateState =
  | "idle"
  | "checking"
  | "available"
  | "downloading"
  | "installing"
  | "done"
  | "error";

export function useUpdater() {
  const [state, setState] = useState<UpdateState>("idle");
  const [progress, setProgress] = useState(0);
  const [update, setUpdate] = useState<Update | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isChecking = useRef(false);

  const checkForUpdate = useCallback(async () => {
    if (isChecking.current) return null;

    // Prevent redundant checks if update is already in progress
    if (
      state === "available" ||
      state === "downloading" ||
      state === "installing"
    ) {
      return null;
    }

    isChecking.current = true;
    setState("checking");
    console.log("[SYSTEM] Initiating secure patch scan...");

    try {
      const result = await check();

      if (!result) {
        setState("idle");
        setUpdate(null);
        return null;
      }

      setUpdate(result);
      setState("available");
      return result;
    } catch (err: any) {
      setError(err?.message ?? "Failed to check update");
      setState("error");
      return null;
    } finally {
      isChecking.current = false;
    }
  }, [state]);

  const downloadAndInstall = useCallback(async () => {
    if (!update || state === "downloading" || state === "installing") return;

    try {
      setState("downloading");
      setError(null);
      let downloaded = 0;
      let total = 0;

      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case "Started":
            total = event.data.contentLength ?? 0;
            break;
          case "Progress":
            downloaded += event.data.chunkLength;
            if (total > 0) setProgress(Math.round((downloaded / total) * 100));
            break;
          case "Finished":
            setState("installing");
            break;
        }
      });

      setState("done");
      await relaunch();
    } catch (err: any) {
      console.error("[SYSTEM] Installation failed:", err);
      setError(err?.message ?? "Update failed");
      setState("error");
    }
  }, [update, state]);

  return { state, progress, update, error, checkForUpdate, downloadAndInstall };
}
