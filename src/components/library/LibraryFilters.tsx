import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface LibraryFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  dealSizeFilter: string;
  onDealSizeChange: (value: string) => void;
  industryFilter: string;
  onIndustryChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
}

const DEAL_SIZE_OPTIONS = [
  { value: "all", label: "All Deal Sizes" },
  { value: "under5k", label: "Under $5K" },
  { value: "5k-25k", label: "$5K - $25K" },
  { value: "25k-100k", label: "$25K - $100K" },
  { value: "over100k", label: "$100K+" },
];

const INDUSTRY_OPTIONS = [
  { value: "all", label: "All Industries" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "saas", label: "SaaS" },
  { value: "fintech", label: "Fintech" },
  { value: "fitness", label: "Fitness" },
  { value: "wellness", label: "Wellness" },
  { value: "career", label: "Career" },
  { value: "media", label: "Media" },
  { value: "food_beverage", label: "Food & Beverage" },
  { value: "sports", label: "Sports" },
  { value: "consumer_apps", label: "Consumer Apps" },
  { value: "real_estate", label: "Real Estate" },
];

const TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "full_proposal", label: "Full Proposal" },
  { value: "pitch_deck", label: "Pitch Deck" },
  { value: "one_pager", label: "One Pager" },
  { value: "contract", label: "Contract" },
];

export function LibraryFilters({
  searchQuery,
  onSearchChange,
  dealSizeFilter,
  onDealSizeChange,
  industryFilter,
  onIndustryChange,
  typeFilter,
  onTypeChange,
}: LibraryFiltersProps) {
  const activeFilters = [
    dealSizeFilter !== "all" && { key: "dealSize", label: DEAL_SIZE_OPTIONS.find(o => o.value === dealSizeFilter)?.label },
    industryFilter !== "all" && { key: "industry", label: INDUSTRY_OPTIONS.find(o => o.value === industryFilter)?.label },
    typeFilter !== "all" && { key: "type", label: TYPE_OPTIONS.find(o => o.value === typeFilter)?.label },
  ].filter(Boolean) as { key: string; label: string }[];

  const clearFilter = (key: string) => {
    if (key === "dealSize") onDealSizeChange("all");
    if (key === "industry") onIndustryChange("all");
    if (key === "type") onTypeChange("all");
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search proposals..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-card/50"
          />
        </div>

        <Select value={dealSizeFilter} onValueChange={onDealSizeChange}>
          <SelectTrigger className="w-full sm:w-[160px] bg-card/50">
            <SelectValue placeholder="Deal Size" />
          </SelectTrigger>
          <SelectContent>
            {DEAL_SIZE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={industryFilter} onValueChange={onIndustryChange}>
          <SelectTrigger className="w-full sm:w-[160px] bg-card/50">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger className="w-full sm:w-[160px] bg-card/50">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge
              key={filter.key}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => clearFilter(filter.key)}
            >
              {filter.label}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
