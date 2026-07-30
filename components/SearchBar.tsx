"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types";

export const SearchBar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase.rpc("search_products", {
        search_query: query.trim(),
        result_limit: 6,
      });

      if (!error && data) {
        setResults(data as Product[]);
      }
      setIsLoading(false);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const goToFullResults = () => {
    if (!query.trim()) return;
    router.push(`/?search=${encodeURIComponent(query.trim())}`);
    setIsOpen(false);
  };

  const handleSelect = (id: number) => {
    router.push(`/product/${id}`);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button onClick={() => setIsOpen((prev) => !prev)} aria-label="Buscar">
        {isOpen ? (
          <X className="w-5 h-5 hover:text-gray-500 transition-colors" />
        ) : (
          <Search className="w-5 h-5 hover:text-gray-500 transition-colors" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-80 bg-white shadow-xl border border-gray-100 rounded-lg z-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goToFullResults();
            }}
            className="p-3 border-b border-gray-50"
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por artículo o categoría..."
              className="w-full text-sm outline-none px-2 py-1"
            />
          </form>

          {isLoading && (
            <p className="p-4 text-[10px] uppercase tracking-widest text-gray-400 text-center">
              Buscando...
            </p>
          )}

          {!isLoading && query.trim().length >= 2 && results.length === 0 && (
            <p className="p-4 text-[10px] uppercase tracking-widest text-gray-400 text-center">
              Sin resultados
            </p>
          )}

          {results.length > 0 && (
            <ul className="max-h-80 overflow-y-auto">
              {results.map((product) => (
                <li key={product.id}>
                  <button
                    onClick={() => handleSelect(product.id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="relative w-10 h-14 bg-gray-100 flex-shrink-0 overflow-hidden rounded-sm">
                      {product.images?.[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold uppercase truncate">{product.name}</p>
                      <p className="text-[10px] text-gray-400">${(product.price ?? 0).toFixed(2)}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {query.trim().length >= 2 && (
            <button
              onClick={goToFullResults}
              className="w-full text-center p-3 text-[10px] font-bold uppercase tracking-widest border-t border-gray-50 hover:bg-gray-50 transition-colors"
            >
              Ver todos los resultados
            </button>
          )}
        </div>
      )}
    </div>
  );
};