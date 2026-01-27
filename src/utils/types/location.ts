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
  id: string; // Firebase / backend ID
  senderId: string; // contact_id_encrypt
  isEmergency: boolean;
  timestamp: string; // ISO string
}
