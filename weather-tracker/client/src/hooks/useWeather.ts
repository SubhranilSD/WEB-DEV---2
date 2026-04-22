import { useState, useCallback } from "react"
import axios from "axios"

export interface WeatherData {
  name: string
  sys: { country: string; sunrise: number; sunset: number }
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
    temp_min: number
    temp_max: number
  }
  weather: { id: number; main: string; description: string; icon: string }[]
  wind: { speed: number; deg: number }
  visibility: number
  clouds: { all: number }
  dt: number
  timezone: number
  coord: { lat: number; lon: number }
}

export interface ForecastItem {
  dt: number
  main: { temp: number; temp_min: number; temp_max: number; humidity: number }
  weather: { id: number; main: string; description: string; icon: string }[]
  wind: { speed: number }
  dt_txt: string
}

export interface ForecastData {
  list: ForecastItem[]
  city: { name: string; country: string }
}

export interface WeatherState {
  current: WeatherData | null
  forecast: ForecastData | null
  loading: boolean
  error: string | null
}

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    current: null,
    forecast: null,
    loading: false,
    error: null,
  })

  const fetchWeather = useCallback(async (city: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`/api/weather?city=${encodeURIComponent(city)}`),
        axios.get(`/api/forecast?city=${encodeURIComponent(city)}`),
      ])
      setState({
        current: weatherRes.data,
        forecast: forecastRes.data,
        loading: false,
        error: null,
      })
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.error || "City not found. Please try again.",
      }))
    }
  }, [])

  return { ...state, fetchWeather }
}
