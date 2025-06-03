import { SensitivityData } from './sensitivity';

// 🆕 백엔드 API 응답 타입들 추가
export interface WeatherScoreResponse {
  totalScore: number;
  grade: WeatherGrade;
  message: string;
  elementScores: ElementScoreDetails;
  weatherInfo: WeatherInfo;
  location: BackendLocationInfo;
}

export interface ElementScoreDetails {
  temperature: number;
  humidity: number;
  wind: number;
  uv: number;
  airQuality: number;
}

export interface WeatherInfo {
  temperature: number;
  feelsLikeTemperature: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  pm25: number;
  pm10: number;
}

export interface BackendLocationInfo {
  latitude: number;
  longitude: number;
  cityName: string;
}

export type WeatherGrade = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'TERRIBLE';

// 기존 프론트엔드 타입들 유지
export type WeatherCondition =
  | 'clear'
  | 'cloudy'
  | 'rainy'
  | 'snowy'
  | 'foggy'
  | 'thunderstorm';

export interface WeatherData {
  id?: string;
  location: {
    name: string;
    lat: number;
    lon: number;
  };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    pressure: number;
    visibility: number;
    uvIndex: number;
    condition: WeatherCondition;
    description: string;
  };
  airQuality: {
    pm25: number;
    pm10: number;
    quality: 'good' | 'moderate' | 'unhealthy' | 'hazardous';
  };
  timestamp: string;
}

export interface HourlyWeather {
  time: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: WeatherCondition;
  precipitationChance: number;
}

export interface WeatherScore {
  total: number;
  emoji: string;
  grade: 'excellent' | 'good' | 'fair' | 'poor' | 'terrible';
  message: string;
  breakdown: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    airQuality: number;
    uvIndex: number;
  };
}

export interface PersonalFeelsLike {
  calculated: number;
  adjustment: number;
  reason: string;
}

export interface WeatherApiResponse {
  success: boolean;
  data?: WeatherData;
  error?: string;
}

export interface LocationInfo {
  lat: number;
  lon: number;
  name?: string;
  permission: 'granted' | 'denied' | 'prompt';
}

export interface WeatherState {
  currentWeather: WeatherData | null;
  hourlyForecast: HourlyWeather[];
  location: LocationInfo | null;
  personalScore: WeatherScore | null;
  personalFeelsLike: PersonalFeelsLike | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;

  setLocation: (location: LocationInfo) => void;
  fetchWeatherData: (lat: number, lon: number) => Promise<void>;
  calculatePersonalScore: () => void;
  refreshData: () => Promise<void>;
  clearError: () => void;
}

export const WEATHER_ICONS: Record<WeatherCondition, string> = {
  clear: '☀️',
  cloudy: '☁️',
  rainy: '🌧️',
  snowy: '❄️',
  foggy: '🌫️',
  thunderstorm: '⛈️',
};

export const SCORE_EMOJIS: Record<WeatherScore['grade'], string> = {
  excellent: '😊',
  good: '🙂',
  fair: '😐',
  poor: '😰',
  terrible: '😵',
};
