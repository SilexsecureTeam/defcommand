export interface LocationData {
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
  display_name?: string;
  lat?: number;
  lon?: number;
}

export interface EmergencyEvent {
  id: string;
  senderId: string;
  status: "pending" | "resolved" | "active"; // Matches your DB snippet
  timestamp: number; // Unix epoch from Firebase
  readableTime: string;
}
