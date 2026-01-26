import { LocationData } from "./types/location";

export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<LocationData> {
  if (
    lat === null ||
    lng === null ||
    lat === undefined ||
    lng === undefined ||
    Number.isNaN(lat) ||
    Number.isNaN(lng)
  ) {
    return {};
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          "User-Agent": "Defcomm-Control-Center/1.0",
        },
      },
    );

    if (!res.ok) return {};

    const data = await res.json();

    if (!data?.address) return {};

    return {
      neighbourhood: data.address.neighbourhood,
      suburb: data.address.suburb,
      city: data.address.city,
      town: data.address.town,
      village: data.address.village,
      county: data.address.county,
      state: data.address.state,
      postcode: data.address.postcode,
      country: data.address.country,
      display_name: data.display_name,
      lat: parseFloat(data.lat),
      lon: parseFloat(data.lon),
    };
  } catch (err) {
    console.error("Reverse geocode failed:", err);
    return {};
  }
}
