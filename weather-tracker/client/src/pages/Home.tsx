import { motion, AnimatePresence } from "framer-motion"
import { ShaderAnimation } from "@/components/ui/shader-lines"
import { SearchBar } from "@/components/SearchBar"
import { CurrentWeather } from "@/components/CurrentWeather"
import { ForecastStrip } from "@/components/ForecastStrip"
import { useWeather } from "@/hooks/useWeather"
import { AlertCircle } from "lucide-react"

export default function Home() {
  const { current, forecast, loading, error, fetchWeather } = useWeather()

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-sky-500/30 font-sans relative">

      {/* ── Fixed Background Shader ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-60 mix-blend-screen scale-110">
          <ShaderAnimation />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#050505]" />
      </div>

      <div className="relative z-10">
        {/* ── Search & Hero Section ── */}
        <motion.div
          layout
          className="flex flex-col items-center justify-center min-h-screen px-6 transition-all duration-1000 ease-in-out"
          style={{ paddingBottom: current ? "10vh" : "0" }}
        >
          <motion.div
            layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white drop-shadow-2xl mb-4">
              Weather<span className="text-sky-500">.</span>
            </h1>
            <p className="text-white/40 text-sm md:text-base font-medium tracking-[0.3em] uppercase max-w-lg mx-auto">
              Real-time atmospheric analysis
            </p>
          </motion.div>

          <SearchBar onSearch={fetchWeather} loading={loading} />
        </motion.div>

        {/* ── Weather Data Section ── */}
        <div className="relative pb-32">
          <AnimatePresence mode="wait">
            {(current || error) && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-[1400px] w-full mx-auto px-12 space-y-24 flex flex-col items-center"
              >
                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full flex items-center justify-center gap-4 bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-red-200 backdrop-blur-2xl transition-all"
                  >
                    <AlertCircle size={24} className="text-red-400" />
                    <p className="font-semibold text-xl">{error}</p>
                  </motion.div>
                )}

                {/* Current weather and forecast */}
                {current && <CurrentWeather data={current} />}
                {forecast && <ForecastStrip data={forecast} />}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Footer ── */}
          <motion.footer
            layout
            className="text-center text-white/10 text-[10px] py-20 mt-20 tracking-[0.5em] uppercase font-black border-t border-white/5 mx-auto max-w-5xl"
          >
            <p>Powered by OpenWeatherMap</p>
          </motion.footer>
        </div>
      </div>
    </div>
  )
}
