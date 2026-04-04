"use client";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {motion, AnimatePresence} from "framer-motion";
export const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const search = searchParams.get("search");
    if (!search && query !== "") {
      setQuery("");
    } else if (search) {
      setQuery(search);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?search=${query}`);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex items-center overflow-hidden h-10">
      <AnimatePresence>
        {isExpanded ? (
          <motion.form
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onSubmit={handleSearch}
            className="flex items-center border-b border-black"
          >
            <input
              autoFocus
              type="text"
              placeholder="Buscar..."
              className="outline-none text-sm pb-1 w-32 md:w-48 bg-transparent"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">
              <Search className="w-5 h-5 mb-1 ml-2 cursor-pointer hover:text-gray-500" />
            </button>
            <motion.div 
              whileHover={{ rotate: 90 }}
              onClick={() => { setIsExpanded(false); router.push("/"); }}
            >
              <X className="w-4 h-4 ml-2 cursor-pointer text-gray-400" />
            </motion.div>
          </motion.form>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            key="search-icon"
          >
            <Search 
              className="w-5 h-5 cursor-pointer hover:text-gray-500" 
              onClick={() => setIsExpanded(true)} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};