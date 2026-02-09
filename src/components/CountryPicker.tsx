import { useState, useRef, useEffect } from "react";
import { Country } from "@/types/fantasy";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { X, Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountryPickerProps {
  availableCountries: Country[];
  selectedCountries: Country[];
  onToggleCountry: (country: Country) => void;
  label?: string;
}

export const CountryPicker = ({
  availableCountries,
  selectedCountries,
  onToggleCountry,
  label = "Countries",
}: CountryPickerProps) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Scroll search input into view when dropdown opens so results are visible
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = availableCountries.filter(
    (country) =>
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      country.code.toLowerCase().includes(search.toLowerCase())
  );

  const isSelected = (country: Country) =>
    selectedCountries.some((c) => c.code === country.code);

  return (
    <div className="space-y-2" ref={containerRef}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label} ({selectedCountries.length} selected)
      </label>

      {/* Selected Countries as Chips */}
      {selectedCountries.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2 bg-muted/50 rounded-lg">
          {selectedCountries.map((country) => (
            <Badge
              key={country.code}
              variant="secondary"
              className="pl-1.5 pr-1 py-0.5 gap-1 bg-primary/10 hover:bg-primary/20 text-foreground cursor-pointer"
              onClick={() => onToggleCountry(country)}
            >
              <span className="text-base">{country.flag}</span>
              <span className="text-xs font-medium">{country.code}</span>
              <X className="h-3 w-3 ml-0.5 text-muted-foreground hover:text-foreground" />
            </Badge>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search countries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="pl-9 pr-9"
          />
          <ChevronDown 
            className={cn(
              "absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
            <div className="max-h-48 overflow-y-auto">
              {filteredCountries.length === 0 ? (
                <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                  No countries found
                </div>
              ) : (
                <div className="p-1">
                  {filteredCountries.map((country) => {
                    const selected = isSelected(country);
                    return (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => {
                          onToggleCountry(country);
                          setSearch("");
                        }}
                        className={cn(
                          "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                          selected
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-accent"
                        )}
                      >
                        <span className="text-lg">{country.flag}</span>
                        <span className="flex-1 text-left">{country.name}</span>
                        <span className="text-xs text-muted-foreground">{country.code}</span>
                        {selected && (
                          <span className="text-xs text-primary">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
