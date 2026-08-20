import axios from "axios";
import { WeatherToolInput } from "./weather.schema";

export const weatherToolHandler = async ({
  query: city,
}: WeatherToolInput) => {
  // 1. Convert city → latitude/longitude
  const geoResponse = await axios.get(
    "https://geocoding-api.open-meteo.com/v1/search",
    {
      params: {
        name: city,
        count: 1,
        language: "en",
        format: "json",
      },
    }
  );

  const location = geoResponse.data.results?.[0];

  if (!location) {
    throw new Error(`Location not found: ${city}`);
  }

  // 2. Get current weather
  const weatherResponse = await axios.get(
    "https://api.open-meteo.com/v1/forecast",
    {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
        current: "temperature_2m,apparent_temperature,weather_code",
      },
    }
  );

  const current = weatherResponse.data.current;

  return {
    city: location.name,
    country: location.country,
    temperature: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    unit: "°C",
    weatherCode: current.weather_code,
  };
};
