import { useState, type KeyboardEvent } from "react"
import { Search, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface SearchBarProps {
  onSearch: (city: string) => void
  loading: boolean
}

const POPULAR_CITIES = ["New York", "London", "Tokyo", "Paris", "Dubai"]

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSearch = () => {
    if (query.trim()) onSearch(query.trim())
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative group">
        <div className="relative flex items-center bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-3xl p-2.5 transition-all duration-300 focus-within:border-sky-500/30 focus-within:bg-white/[0.06]">

          <div className="pl-5 pr-2 text-white/20">
            <Search size={20} className="transition-colors duration-300 group-focus-within:text-sky-500" />
          </div>

          <input
            type="text"
            placeholder="Search city..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="flex-1 bg-transparent border-none text-white placeholder:text-white/20 px-3 py-4 text-xl font-light focus:outline-none focus:ring-0 disabled:opacity-50"
          />

          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="h-14 px-10 rounded-[1.25rem] bg-white text-black font-black text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:hover:scale-100 flex items-center justify-center min-w-[120px]"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Search"}
          </button>
        </div>
      </div>

      {/* Popular city chips */}
      <div className="flex gap-3 mt-8 flex-wrap justify-center">
        {POPULAR_CITIES.map((city, idx) => (
          <motion.button
            key={city}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.05 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setQuery(city); onSearch(city) }}
            className="text-[10px] px-5 py-2.5 rounded-full bg-white/[0.02] border border-white/5 text-white/30 hover:text-white hover:border-white/20 transition-all duration-300 cursor-pointer backdrop-blur-md font-bold uppercase tracking-[0.2em]"
          >
            {city}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
