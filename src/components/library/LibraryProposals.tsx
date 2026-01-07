import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, DollarSign, Building2, Loader2, BookOpen } from "lucide-react";
import { SecureProposalViewer } from "./SecureProposalViewer";

interface LibraryItem {
  id: string;
  title: string;
  description: string | null;
  industry: string;
  company_size: string;
  format: string;
  deal_size_min: number | null;
  deal_size_max: number | null;
  deliverable_type: string | null;
  pdf_path: string;
  page_count: number;
}

const INDUSTRY_LABELS: Record<string, string> = {
  technology: "Technology",
  finance: "Finance",
  healthcare: "Healthcare",
  education: "Education",
  nonprofit: "Nonprofit",
  retail: "Retail",
  media: "Media",
  consulting: "Consulting",
  real_estate: "Real Estate",
  other: "Other",
};

const SIZE_LABELS: Record<string, string> = {
  startup: "Startup",
  small_business: "Small Business",
  mid_market: "Mid-Market",
  enterprise: "Enterprise",
  nonprofit: "Nonprofit",
  government: "Government",
};

const FORMAT_LABELS: Record<string, string> = {
  written: "Written Proposal",
  deck: "Presentation Deck",
  hybrid: "Hybrid",
};

export function LibraryProposals() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  
  // Filters
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [sizeFilter, setSizeFilter] = useState<string>("all");
  const [formatFilter, setFormatFilter] = useState<string>("all");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("library_items")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setItems(data as LibraryItem[]);
    }
    setLoading(false);
  };

  const filteredItems = items.filter((item) => {
    if (industryFilter !== "all" && item.industry !== industryFilter) return false;
    if (sizeFilter !== "all" && item.company_size !== sizeFilter) return false;
    if (formatFilter !== "all" && item.format !== formatFilter) return false;
    return true;
  });

  const formatDealSize = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    const format = (n: number) => {
      if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
      if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
      return `$${n}`;
    };
    if (min && max) return `${format(min)} - ${format(max)}`;
    if (min) return `${format(min)}+`;
    return `Up to ${format(max!)}`;
  };

  if (selectedItem) {
    return (
      <SecureProposalViewer
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {Object.entries(INDUSTRY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sizeFilter} onValueChange={setSizeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Company Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            {Object.entries(SIZE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={formatFilter} onValueChange={setFormatFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Formats</SelectItem>
            {Object.entries(FORMAT_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No proposals found</h3>
          <p className="text-muted-foreground">
            {items.length === 0 
              ? "Proposals are being added soon. Check back shortly!"
              : "Try adjusting your filters to see more results."}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className="p-6 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="secondary">{FORMAT_LABELS[item.format]}</Badge>
              </div>

              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {item.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="text-xs">
                  <Building2 className="h-3 w-3 mr-1" />
                  {INDUSTRY_LABELS[item.industry]}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {SIZE_LABELS[item.company_size]}
                </Badge>
                {item.deliverable_type && (
                  <Badge variant="outline" className="text-xs">
                    {item.deliverable_type}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                {formatDealSize(item.deal_size_min, item.deal_size_max) && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    {formatDealSize(item.deal_size_min, item.deal_size_max)}
                  </span>
                )}
                <span className="flex items-center gap-1 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  {item.page_count} pages
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
