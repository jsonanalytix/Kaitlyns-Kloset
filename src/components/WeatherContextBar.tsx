import { Sun, Cloud, CloudSun, CloudRain, Snowflake } from "lucide-react";

interface WeatherContextBarProps {
  temp: number;
  condition: string;
  description: string;
}

function getWeatherIcon(condition: string) {
  switch (condition.toLowerCase()) {
    case "sunny":
    case "clear":
      return Sun;
    case "partly cloudy":
      return CloudSun;
    case "rainy":
      return CloudRain;
    case "snowy":
      return Snowflake;
    default:
      return Cloud;
  }
}

export default function WeatherContextBar({
  temp,
  condition,
  description,
}: WeatherContextBarProps) {
  const Icon = getWeatherIcon(condition);

  return (
    <div className="flex items-center gap-2 rounded-xl bg-warm-50 px-3 py-2">
      <Icon className="h-4 w-4 shrink-0 text-warm-500" />
      <span className="text-xs font-medium text-warm-700">
        {temp}&deg;F, {condition}
      </span>
      <span className="text-xs text-warm-300">&middot;</span>
      <span className="truncate text-xs text-warm-400">{description}</span>
    </div>
  );
}
