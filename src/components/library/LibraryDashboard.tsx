import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LibraryModuleView } from "./LibraryModuleView";
import { LibraryCourse } from "./LibraryCourse";
import { FileText, Video } from "lucide-react";

export function LibraryDashboard() {
  const [activeTab, setActiveTab] = useState("proposals");

  const handleUpgradeClick = () => {
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#pricing";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-white border border-slate-200">
            <TabsTrigger 
              value="proposals" 
              className="flex items-center gap-2 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900"
            >
              <FileText className="h-4 w-4" />
              Proposals
            </TabsTrigger>
            <TabsTrigger 
              value="course" 
              className="flex items-center gap-2 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900"
            >
              <Video className="h-4 w-4" />
              Course Videos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="proposals">
            <LibraryModuleView onUpgradeClick={handleUpgradeClick} />
          </TabsContent>

          <TabsContent value="course">
            <LibraryCourse />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
