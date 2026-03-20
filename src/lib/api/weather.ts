const WEATHER_URL = process.env.NEXT_PUBLIC_WEATHER_API_URL || "";

export interface CurrentWeather {
  location: string;
  temp: number;
  feelsLike: number;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  description: string;
  icon: string;
}

export interface ForecastDay {
  date: string;
  high: number;
  low: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
}

export interface ForecastResponse {
  location: string;
  forecast: ForecastDay[];
}

export async function getCurrentWeather(
  lat: number,
  lon: number,
): Promise<CurrentWeather> {
  if (!WEATHER_URL) {
    throw new Error("Weather API URL not configured");
  }

  const url = new URL(`${WEATHER_URL}/api/weather`);
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Weather API error ${res.status}`);
  }
  return res.json();
}

export async function getForecast(
  location: string,
  days: number = 5,
): Promise<ForecastResponse> {
  if (!WEATHER_URL) {
    throw new Error("Weather API URL not configured");
  }

  const url = new URL(`${WEATHER_URL}/api/weather/forecast`);
  url.searchParams.set("location", location);
  url.searchParams.set("days", String(days));

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Weather forecast API error ${res.status}`);
  }
  return res.json();
}

/**
 * Attempts to get the user's current position via the Geolocation API.
 * Returns null if geolocation is unavailable or the user denies permission.
 */
export function getUserPosition(): Promise<GeolocationPosition | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      () => resolve(null),
      { timeout: 8000, maximumAge: 300_000 },
    );
  });
}
