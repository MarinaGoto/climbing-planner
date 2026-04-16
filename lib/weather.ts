import { Weather } from './types';

export function getWeather(date: string): Weather {
  // For MVP, return hardcoded weather data
  // In future, integrate with real weather API
  return {
    rainProbability: 10, // %
    precipitation: 0, // mm
    humidity: 60, // %
    windSpeed: 5, // km/h
    windDirection: 'NE', // N, S, E, W, NE, NW, SE, SW
  };
}