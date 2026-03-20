// Phase 2b: Weather Proxy Worker — keeps API key server-side
// Current conditions for daily suggestions, forecast for trip planning

interface Env {
  OPENWEATHERMAP_API_KEY: string;
  ALLOWED_ORIGINS: string;
}

interface OWMCurrentResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: { speed: number };
  name: string;
}

interface OWMForecastEntry {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: Array<{ main: string; description: string; icon: string }>;
  wind: { speed: number };
}

interface OWMForecastResponse {
  city: { name: string; country: string };
  list: OWMForecastEntry[];
}

function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get("Origin") ?? "*";
  const allowed = env.ALLOWED_ORIGINS || "*";
  const allowOrigin =
    allowed === "*" || allowed.split(",").includes(origin) ? origin : "";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

async function handleCurrentWeather(
  url: URL,
  env: Env,
  cors: Record<string, string>
): Promise<Response> {
  const headers = { ...cors, "Content-Type": "application/json" };

  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");

  if (!lat || !lon) {
    return new Response(
      JSON.stringify({ error: "Missing required parameters: lat, lon" }),
      { status: 400, headers }
    );
  }

  const apiUrl = new URL("https://api.openweathermap.org/data/2.5/weather");
  apiUrl.searchParams.set("lat", lat);
  apiUrl.searchParams.set("lon", lon);
  apiUrl.searchParams.set("appid", env.OPENWEATHERMAP_API_KEY);
  apiUrl.searchParams.set("units", "imperial");

  const res = await fetch(apiUrl.toString());

  if (!res.ok) {
    const errBody = await res.text();
    console.error(`OWM current weather error ${res.status}: ${errBody.slice(0, 300)}`);
    return new Response(
      JSON.stringify({ error: "Weather service error" }),
      { status: 502, headers }
    );
  }

  const data = (await res.json()) as OWMCurrentResponse;
  const weather = data.weather[0];

  const result = {
    location: data.name,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    high: Math.round(data.main.temp_max),
    low: Math.round(data.main.temp_min),
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed),
    condition: weather?.main ?? "Unknown",
    description: weather?.description ?? "",
    icon: weather?.icon ?? "",
  };

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { ...headers, "Cache-Control": "public, max-age=600" },
  });
}

function aggregateDailyForecast(entries: OWMForecastEntry[]) {
  const dailyMap = new Map<
    string,
    {
      date: string;
      temps: number[];
      conditions: string[];
      descriptions: string[];
      humidity: number[];
      windSpeeds: number[];
    }
  >();

  for (const entry of entries) {
    const date = entry.dt_txt.split(" ")[0];
    let day = dailyMap.get(date);
    if (!day) {
      day = {
        date,
        temps: [],
        conditions: [],
        descriptions: [],
        humidity: [],
        windSpeeds: [],
      };
      dailyMap.set(date, day);
    }
    day.temps.push(entry.main.temp);
    day.conditions.push(entry.weather[0]?.main ?? "Unknown");
    day.descriptions.push(entry.weather[0]?.description ?? "");
    day.humidity.push(entry.main.humidity);
    day.windSpeeds.push(entry.wind.speed);
  }

  return Array.from(dailyMap.values()).map((day) => {
    const conditionCounts = new Map<string, number>();
    for (const c of day.conditions) {
      conditionCounts.set(c, (conditionCounts.get(c) ?? 0) + 1);
    }
    const dominantCondition =
      [...conditionCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ??
      "Unknown";

    const avg = (arr: number[]) =>
      Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);

    return {
      date: day.date,
      high: Math.round(Math.max(...day.temps)),
      low: Math.round(Math.min(...day.temps)),
      condition: dominantCondition,
      description: day.descriptions[Math.floor(day.descriptions.length / 2)],
      humidity: avg(day.humidity),
      windSpeed: avg(day.windSpeeds),
    };
  });
}

async function handleForecast(
  url: URL,
  env: Env,
  cors: Record<string, string>
): Promise<Response> {
  const headers = { ...cors, "Content-Type": "application/json" };

  const location = url.searchParams.get("location");
  const days = parseInt(url.searchParams.get("days") ?? "5", 10);

  if (!location) {
    return new Response(
      JSON.stringify({ error: "Missing required parameter: location" }),
      { status: 400, headers }
    );
  }

  // OWM free tier: 5-day / 3-hour forecast. 8 entries per day, max 40 total.
  const cnt = Math.min(Math.max(days, 1) * 8, 40);

  const apiUrl = new URL("https://api.openweathermap.org/data/2.5/forecast");
  apiUrl.searchParams.set("q", location);
  apiUrl.searchParams.set("cnt", String(cnt));
  apiUrl.searchParams.set("appid", env.OPENWEATHERMAP_API_KEY);
  apiUrl.searchParams.set("units", "imperial");

  const res = await fetch(apiUrl.toString());

  if (!res.ok) {
    const errBody = await res.text();
    console.error(`OWM forecast error ${res.status}: ${errBody.slice(0, 300)}`);
    return new Response(
      JSON.stringify({ error: "Weather service error" }),
      { status: 502, headers }
    );
  }

  const data = (await res.json()) as OWMForecastResponse;
  const forecast = aggregateDailyForecast(data.list);

  const result = {
    location: `${data.city.name}, ${data.city.country}`,
    forecast,
  };

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { ...headers, "Cache-Control": "public, max-age=1800" },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);

    try {
      if (url.pathname === "/api/weather" && request.method === "GET") {
        return await handleCurrentWeather(url, env, cors);
      }

      if (url.pathname === "/api/weather/forecast" && request.method === "GET") {
        return await handleForecast(url, env, cors);
      }

      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Unhandled error:", err);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        {
          status: 500,
          headers: { ...cors, "Content-Type": "application/json" },
        }
      );
    }
  },
};
