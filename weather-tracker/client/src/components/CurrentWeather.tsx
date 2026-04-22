import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Droplets, Wind, Eye, Gauge, Thermometer,
  Sunrise, Sunset, MapPin, Cloud
} from "lucide-react"
import type { WeatherData } from "@/hooks/useWeather"

interface CurrentWeatherProps {
  data: WeatherData
}

const getWeatherGradient = (weatherId: number): string => {
  if (weatherId >= 200 && weatherId < 300) return "from-indigo-600 via-slate-800 to-slate-900"
  if (weatherId >= 300 && weatherId < 400) return "from-blue-500 via-sky-700 to-slate-900"
  if (weatherId >= 500 && weatherId < 600) return "from-cyan-600 via-blue-800 to-slate-900"
  if (weatherId >= 600 && weatherId < 700) return "from-teal-100 via-sky-300 to-blue-400"
  if (weatherId >= 700 && weatherId < 800) return "from-amber-600 via-orange-800 to-slate-900"
  if (weatherId === 800) return "from-sky-400 via-blue-500 to-indigo-600"
  return "from-slate-500 via-gray-600 to-slate-800"
}

const formatTime = (unix: number, timezone: number): string => {
  const date = new Date((unix + timezone) * 1000)
  return date.toUTCString().slice(17, 22)
}

const getWindDirection = (deg: number): string => {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  return dirs[Math.round(deg / 45) % 8]
}

const StatBadge = ({ icon: Icon, label, value, delay }: { icon: any; label: string; value: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex flex-col items-center gap-2 bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 backdrop-blur-3xl transition-all cursor-default w-full"
  >
    <Icon size={18} className="text-white/40" />
    <span className="text-[10px] text-white/20 tracking-[0.2em] font-bold uppercase">{label}</span>
    <span className="text-sm font-semibold text-white/90 tracking-tight">{value}</span>
  </motion.div>
)

const AnimatedNumber = ({ value }: { value: number }) => {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))

  useEffect(() => {
    const animation = animate(count, value, { duration: 1.2, type: "spring", bounce: 0.1 })
    return animation.stop
  }, [value, count])

  return <motion.span>{rounded}</motion.span>
}

export function CurrentWeather({ data }: CurrentWeatherProps) {
  const weather = data.weather[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      <div className="relative overflow-hidden rounded-[4rem] border border-white/10 bg-white/[0.01] backdrop-blur-3xl p-16 md:p-24 lg:p-32">
        {/* Main Info */}
        <div className="flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4 bg-white/5 px-6 py-2 rounded-full border border-white/5"
          >
            <MapPin size={16} className="text-sky-500" />
            <span className="text-xl font-bold tracking-tight">{data.name}, {data.sys.country}</span>
          </motion.div>
          
          <p className="text-white/30 text-xs font-bold uppercase tracking-[0.3em] mb-12">
            {new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })}
          </p>

          <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
            <div className="text-9xl md:text-[12rem] font-black tracking-tighter leading-none text-white flex items-start">
              <AnimatedNumber value={data.main.temp} />
              <span className="text-4xl md:text-5xl font-light text-white/20 mt-8 ml-2">°C</span>
            </div>
            
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                alt={weather.description}
                className="w-32 h-32 md:w-40 md:h-40 drop-shadow-2xl"
              />
               <p className="text-sky-400 font-black uppercase tracking-[0.4em] text-sm md:text-base mb-2">
                {weather.description}
              </p>
              <div className="flex items-center gap-4 text-white/40 text-[10px] font-black tracking-widest uppercase">
                 <span className="flex items-center gap-1.5"><span className="text-sky-500">↑</span> {Math.round(data.main.temp_max)}°</span>
                 <span className="flex items-center gap-1.5"><span className="text-blue-500">↓</span> {Math.round(data.main.temp_min)}°</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-12">
          <StatBadge delay={0.2} icon={Droplets} label="Humidity" value={`${data.main.humidity}%`} />
          <StatBadge delay={0.3} icon={Wind} label="Wind" value={`${Math.round(data.wind.speed * 3.6)} km/h`} />
          <StatBadge delay={0.4} icon={Eye} label="Visibility" value={`${(data.visibility / 1000).toFixed(1)} km`} />
          <StatBadge delay={0.5} icon={Gauge} label="Pressure" value={`${data.main.pressure} hPa`} />
        </div>

        {/* Sunrise/Sunset */}
        <div className="flex items-center justify-center gap-12 pt-12 border-t border-white/5">
           <div className="flex items-center gap-4">
             <Sunrise size={20} className="text-amber-400/50" />
             <div className="flex flex-col">
               <span className="text-[10px] text-white/20 uppercase tracking-widest font-black">Sunrise</span>
               <span className="text-base font-bold text-white/70">{formatTime(data.sys.sunrise, data.timezone)}</span>
             </div>
           </div>
           <div className="flex items-center gap-4">
             <Sunset size={20} className="text-indigo-400/50" />
             <div className="flex flex-col">
               <span className="text-[10px] text-white/20 uppercase tracking-widest font-black">Sunset</span>
               <span className="text-base font-bold text-white/70">{formatTime(data.sys.sunset, data.timezone)}</span>
             </div>
           </div>
        </div>
      </div>
    </motion.div>
  )
}
