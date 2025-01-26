import { CapacitorHttp } from "@capacitor/core";

export class WeatherApi {
  url: string = import.meta.env.VITE_APP_API_WEATHER_URL || "";
  key: string = import.meta.env.VITE_APP_API_WEATHER_KEY || "";

  constructor() {}

  async currentWeather(location: string) : Promise<ICurrentWeatherData> {
    const request = {
      url: `${this.url}/current.json`,
      params: {
        key: this.key,
        q: location
      }
    };

    try {
      const response = await CapacitorHttp.get(request);
      const data: ICurrentWeatherData = response.data;
      return data;
    }
    catch (error) {
      console.log("HTTP request failed: ", error);
      throw error;
    }
  }
}

export interface ICurrentWeatherData {
  location: ILocation;
  current: IWeatherData;
}

export interface ILocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

export interface IWeatherData {
  last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    windchill_c: number;
    windchill_f: number;
    heatindex_c: number;
    heatindex_f: number;
    dewpoint_c: number;
    dewpoint_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
}