import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import type { ForecastData } from "@/hooks/useWeather"

interface ForecastStripProps {
  data: ForecastData
}

const getDayName = (dtTxt: string): string => {
  const date = new Date(dtTxt)
  const today = new Date()
  if (date.toDateString() === today.toDateString()) return "Today"
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow"
  return date.toLocaleDateString("en-US", { weekday: "short" })
}

const groupByDay = (list: ForecastData["list"]) => {
  const map = new Map<string, (typeof list)[0]>()
  for (const item of list) {
    const dateKey = item.dt_txt.slice(0, 10)
    if (!map.has(dateKey)) {
      map.set(dateKey, item)
    } else {
      const existing = map.get(dateKey)!
      const existingHour = parseInt(existing.dt_txt.slice(11, 13))
      const itemHour = parseInt(item.dt_txt.slice(11, 13))
      if (Math.abs(itemHour - 12) < Math.abs(existingHour - 12)) {
        map.set(dateKey, item)
      }
    }
  }
  return Array.from(map.values()).slice(0, 6)
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", bounce: 0.4, duration: 0.8 }
  }
} as const

export function ForecastStrip({ data }: ForecastStripProps) {
  const days = groupByDay(data.list)

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="mt-16 w-full"
    >
      <div className="mb-10 flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold text-white tracking-tight">6-Day Outlook</h2>
        <div className="w-12 h-0.5 bg-sky-500 rounded-full" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-12">
        {days.map((item) => (
          <motion.div key={item.dt} variants={cardVariants} className="group">
            <div className="relative text-center overflow-hidden border border-white/[0.05] bg-white/[0.01] backdrop-blur-3xl p-8 rounded-3xl transition-all duration-500 group-hover:bg-white/[0.03] group-hover:border-white/10 group-hover:-translate-y-1">
              <p className="text-[10px] font-black text-white/20 mb-6 uppercase tracking-[0.2em]">
                {getDayName(item.dt_txt)}
              </p>

              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt={item.weather[0].description}
                className="w-16 h-16 mx-auto mb-4 drop-shadow-xl"
              />

              <p className="text-3xl font-black text-white mb-1">
                {Math.round(item.main.temp)}<span className="text-lg text-white/20 font-light ml-0.5">°</span>
              </p>

              <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mb-6">
                {item.weather[0].main}
              </p>

              <div className="flex items-center justify-between w-full pt-6 border-t border-white/5 font-black">
                <span className="text-sky-500 text-[10px]">{Math.round(item.main.temp_max)}°</span>
                <span className="text-white/20 text-[10px]">{Math.round(item.main.temp_min)}°</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
