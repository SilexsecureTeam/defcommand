import { useCallback, useState } from "react";
import { check, Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

type UpdateState =
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

  const checkForUpdate = useCallback(async () => {
    try {
      setState("checking");

      const result = await check();
      console.log("update", result);

      if (!result) {
        setState("idle");
        return null;
      }

      setUpdate(result);
      setState("available");
      return result;
    } catch (err: any) {
      setError(err?.message ?? "Failed to check update");
      setState("error");
      return null;
    }
  }, []);

  const downloadAndInstall = useCallback(async () => {
    if (!update) return;

    try {
      setState("downloading");

      let downloaded = 0;
      let total = 0;

      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case "Started":
            total = event.data.contentLength ?? 0;
            break;

          case "Progress":
            downloaded += event.data.chunkLength;
            if (total > 0) {
              setProgress(Math.round((downloaded / total) * 100));
            }
            break;

          case "Finished":
            setState("installing");
            break;
        }
      });

      setState("done");
      await relaunch();
    } catch (err: any) {
      setError(err?.message ?? "Update failed");
      setState("error");
    }
  }, [update]);

  return {
    state,
    progress,
    update,
    error,
    checkForUpdate,
    downloadAndInstall,
  };
}
