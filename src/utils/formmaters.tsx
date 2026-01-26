import DOMPurify from "dompurify";

export const parseHtml = (inputString: any) => {
  if (typeof inputString !== "string") return "";

  // Sanitize input to prevent XSS attacks
  const sanitizedString = DOMPurify.sanitize(inputString, { ALLOWED_TAGS: [] });

  // Preserve line breaks (`\n`) by replacing them with `<br />`
  return sanitizedString.replace(/\n/g, "  \n"); // Markdown uses "  \n" for new line
};
export const getTimeAgo = (timestamp: string | number | Date) => {
  const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000); // in seconds

  if (diff < 5) return "just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    return `${mins}min${mins !== 1 ? "s" : ""} ago`;
  }
  if (diff < 86400) {
    const hrs = Math.floor(diff / 3600);
    return `${hrs}hr${hrs !== 1 ? "s" : ""} ago`;
  }
  const days = Math.floor(diff / 86400);
  return `${days}d ago`;
};

export const formatCallDuration = (totalSeconds: number) => {
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    "0",
  );
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${hours}.${minutes}.${seconds}`;
};

export const extractErrorMessage = (error: unknown) => {
  const getString = (data: any) => {
    return typeof data === "string" ? data : JSON.stringify(data);
  };

  // Type guard to check if error is an object with 'response'
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as any).response === "object" &&
    (error as any).response !== null
  ) {
    const response = (error as any).response;
    if (response.data?.message) {
      return getString(response.data.message);
    }
    if (response.data?.error) {
      return getString(response.data.error);
    }
    if (response.error) {
      return getString(response.error);
    }
  }

  return getString((error as any)?.message || "An unknown error occurred");
};

export const maskEmail = (email: { split: (arg0: string) => [any, any] }) => {
  if (!email) return "";
  const [name, domain] = email.split("@");
  return `${name.slice(0, 3)}****@${domain}`;
};

export const maskPhone = (phone: string) => `${phone.substring(0, 5)}******`;
export const stringToColor = (str: string) => {
  if (typeof str !== "string" || !str.trim()) {
    // Fallback: dark gray for invalid or empty strings
    return "hsl(0, 0%, 20%)";
  }

  let hash = 0;

  // Create a stable hash from the string
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash % 360); // 0–359
  const saturation = 80 + (Math.abs(hash) % 10); // 80%–89%
  const lightness = 25 + (Math.abs(hash) % 10); // 25%–34%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const loadingMessages = [
  "Preparing secure connection...",
  "Generating meeting access token...",
  "Setting up your conference environment...",
  "Almost ready — please hold on...",
];

export const normalizeId = (obj: { id: number; id_en: any }) => {
  return isNaN(obj?.id) ? obj?.id : obj?.id_en;
};

export function formatTime(value: string | number) {
  if (value === null || value === undefined) return "—";

  let totalSeconds: number;

  if (typeof value === "number") {
    // If the number is a future timestamp or a past timestamp
    // treat it as uptime: difference between now and the timestamp
    totalSeconds = Math.floor((Date.now() - value) / 1000);
    if (totalSeconds < 0) totalSeconds = 0;
  } else if (typeof value === "string") {
    // Try parsing ISO string
    const parsed = Date.parse(value);
    if (isNaN(parsed)) return "—";

    totalSeconds = Math.floor((Date.now() - parsed) / 1000);
    if (totalSeconds < 0) totalSeconds = 0;
  } else {
    return "—";
  }

  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}
