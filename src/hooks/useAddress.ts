import { useQuery } from "@tanstack/react-query";
import { reverseGeocode } from "../utils/reverseGeocode";

export function useAddress(lat: number, lng: number) {
  // We round to 4 decimal places to avoid over-fetching if the asset moves 1 meter
  const geoKey = `${lat?.toFixed(4)}:${lng?.toFixed(4)}`;

  return useQuery({
    queryKey: ["geocode", geoKey],
    queryFn: () => reverseGeocode(lat, lng),
    // Tactical settings
    staleTime: Infinity, // Address doesn't change, cache forever
    gcTime: 1000 * 60 * 60, // Keep in memory for 1 hour
    enabled: !!lat && !!lng, // Don't fetch if coords are missing
  });
}
