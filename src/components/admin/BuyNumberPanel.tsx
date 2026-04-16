import { useState } from "react";
import { Search, Phone, MessageSquare, Image, Printer, MapPin, ChevronDown, ChevronUp, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PhoneNumber {
  number: string;
  location: string;
  type: string;
  voice: boolean;
  sms: boolean;
  mms: boolean;
  fax: boolean;
  addressRequired: string;
  monthlyFee: string;
}

const mockNumbers: PhoneNumber[] = [
  { number: "+1 606 488 3658", location: "Mc Carr, KY US", type: "Local", voice: true, sms: true, mms: true, fax: true, addressRequired: "None", monthlyFee: "$1.15" },
  { number: "+1 606 659 0621", location: "Owingsville, KY US", type: "Local", voice: true, sms: true, mms: true, fax: true, addressRequired: "None", monthlyFee: "$1.15" },
  { number: "+1 502 307 4412", location: "Louisville, KY US", type: "Local", voice: true, sms: true, mms: false, fax: true, addressRequired: "None", monthlyFee: "$1.15" },
  { number: "+1 859 203 7890", location: "Lexington, KY US", type: "Local", voice: true, sms: true, mms: true, fax: false, addressRequired: "None", monthlyFee: "$1.00" },
  { number: "+1 270 555 1234", location: "Bowling Green, KY US", type: "Local", voice: true, sms: false, mms: false, fax: true, addressRequired: "None", monthlyFee: "$0.95" },
];

const countries = [
  { code: "US", label: "United States - US", prefix: "+1" },
  { code: "GB", label: "United Kingdom - GB", prefix: "+44" },
  { code: "CA", label: "Canada - CA", prefix: "+1" },
  { code: "AU", label: "Australia - AU", prefix: "+61" },
  { code: "IN", label: "India - IN", prefix: "+91" },
];

function CapabilityIcon({ enabled, icon: Icon, label }: { enabled: boolean; icon: React.ElementType; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5" title={label}>
      <Icon className={cn("h-4 w-4", enabled ? "text-primary" : "text-muted-foreground/30")} />
    </div>
  );
}

export function BuyNumberPanel() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("US");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [capabilities, setCapabilities] = useState({ voice: true, sms: true, mms: true, fax: true });
  const [searchType, setSearchType] = useState<"number" | "location">("number");
  const [matchTo, setMatchTo] = useState("first");
  const [results, setResults] = useState<PhoneNumber[]>(mockNumbers);
  const [buying, setBuying] = useState<string | null>(null);

  const selectedCountry = countries.find((c) => c.code === country);

  const toggleCap = (key: keyof typeof capabilities) => {
    setCapabilities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSearch = () => {
    const filtered = mockNumbers.filter((n) => {
      if (search && !n.number.includes(search) && !n.location.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    setResults(filtered);
  };

  const handleBuy = (number: string) => {
    setBuying(number);
    setTimeout(() => setBuying(null), 2000);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="shrink-0 pb-5">
        <h1 className="text-2xl font-bold text-foreground">Buy a Number</h1>
        <p className="text-sm text-muted-foreground mt-1">Search and purchase phone numbers for your account</p>
      </div>

      {/* Filters */}
      <div className="shrink-0 space-y-4 pb-4">
        {/* Country + Capabilities row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          {/* Country */}
          <div className="flex-1 min-w-0">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Country</label>
            <div className="relative">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-card px-3 pr-8 text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.prefix}) {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Capabilities */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Capabilities</label>
            <div className="flex items-center gap-3">
              {(["voice", "sms", "mms", "fax"] as const).map((cap) => (
                <button
                  key={cap}
                  onClick={() => toggleCap(cap)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border",
                    capabilities[cap]
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/20"
                  )}
                >
                  <div className={cn("h-2 w-2 rounded-full", capabilities[cap] ? "bg-primary" : "bg-muted-foreground/30")} />
                  {cap.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search row */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Search criteria</label>
            <div className="flex rounded-lg border border-border overflow-hidden bg-card">
              <button
                onClick={() => setSearchType("number")}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  searchType === "number" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                )}
              >
                Number
              </button>
              <button
                onClick={() => setSearchType("location")}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors border-l border-border",
                  searchType === "location" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                )}
              >
                Location
              </button>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchType === "number" ? "Search by digits or phrases" : "Search by city or region"}
              className="h-9 rounded-lg text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Match to</label>
            <div className="relative">
              <select
                value={matchTo}
                onChange={(e) => setMatchTo(e.target.value)}
                className="h-9 rounded-lg border border-border bg-card px-3 pr-8 text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              >
                <option value="first">First part of number</option>
                <option value="anywhere">Anywhere in number</option>
                <option value="last">Last part of number</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <Button
            onClick={handleSearch}
            size="sm"
            className="h-9 rounded-lg gap-1.5 text-white"
            style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}
          >
            <Search className="h-3.5 w-3.5" />
            Search
          </Button>

          <button
            onClick={() => { setSearch(""); setResults(mockNumbers); }}
            className="text-xs text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
          >
            Reset filters
          </button>
        </div>

        {/* Advanced Search toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {showAdvanced ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          Advanced Search
        </button>

        {showAdvanced && (
          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-xs text-muted-foreground">Search by area code, prefix, or characters you want in your phone number.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Area Code</label>
                <Input placeholder="e.g. 606" className="h-8 text-sm rounded-lg" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Contains</label>
                <Input placeholder="e.g. 1234" className="h-8 text-sm rounded-lg" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Table */}
      <div className="flex-1 min-h-0 overflow-auto rounded-xl border border-border bg-card">
        {/* Table Header */}
        <div className="sticky top-0 z-10 bg-muted/60 backdrop-blur-sm border-b border-border">
          <div className="grid grid-cols-[1fr_80px_repeat(4,40px)_100px_80px_70px] items-center gap-1 px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Number</span>
            <span>Type</span>
            <span className="text-center">Voice</span>
            <span className="text-center">SMS</span>
            <span className="text-center">MMS</span>
            <span className="text-center">Fax</span>
            <span className="hidden sm:block">Address Req.</span>
            <span className="text-right">Fee/mo</span>
            <span></span>
          </div>
        </div>

        {/* Table Rows */}
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Phone className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">No numbers found</p>
            <p className="text-xs mt-1">Try adjusting your search criteria</p>
          </div>
        ) : (
          results.map((num, i) => (
            <div
              key={num.number}
              className={cn(
                "grid grid-cols-[1fr_80px_repeat(4,40px)_100px_80px_70px] items-center gap-1 px-4 py-3 border-b border-border/40 hover:bg-accent/40 transition-colors animate-in fade-in duration-300",
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Number + Location */}
              <div>
                <p className="text-sm font-semibold text-primary">{num.number}</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3" />
                  {num.location}
                </p>
              </div>

              {/* Type */}
              <Badge variant="outline" className="text-[10px] h-5 w-fit rounded-md font-medium">
                {num.type}
              </Badge>

              {/* Capabilities */}
              <CapabilityIcon enabled={num.voice} icon={Phone} label="Voice" />
              <CapabilityIcon enabled={num.sms} icon={MessageSquare} label="SMS" />
              <CapabilityIcon enabled={num.mms} icon={Image} label="MMS" />
              <CapabilityIcon enabled={num.fax} icon={Printer} label="Fax" />

              {/* Address */}
              <span className="hidden sm:block text-xs text-muted-foreground">{num.addressRequired}</span>

              {/* Fee */}
              <span className="text-sm font-semibold text-foreground text-right">{num.monthlyFee}</span>

              {/* Buy */}
              <Button
                size="sm"
                variant={buying === num.number ? "default" : "outline"}
                className={cn(
                  "h-7 rounded-lg text-xs font-medium transition-all",
                  buying === num.number && "bg-green-600 border-green-600 text-white pointer-events-none"
                )}
                onClick={() => handleBuy(num.number)}
              >
                {buying === num.number ? (
                  <><Check className="h-3 w-3 mr-1" /> Done</>
                ) : (
                  "Buy"
                )}
              </Button>
            </div>
          ))
        )}
      </div>

      <p className="text-[11px] text-muted-foreground mt-3 shrink-0">
        Showing {results.length} of {mockNumbers.length} available numbers
      </p>
    </div>
  );
}
