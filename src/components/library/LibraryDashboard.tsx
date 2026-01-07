import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LibraryProposals } from "./LibraryProposals";
import { LibraryCourse } from "./LibraryCourse";
import { FileText, Video } from "lucide-react";

export function LibraryDashboard() {
  const [activeTab, setActiveTab] = useState("proposals");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Proposal Library</h1>
        <p className="text-muted-foreground">
          Browse winning proposals and learn the strategies behind closed deals.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="proposals" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Proposals
          </TabsTrigger>
          <TabsTrigger value="course" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Course Videos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="proposals">
          <LibraryProposals />
        </TabsContent>

        <TabsContent value="course">
          <LibraryCourse />
        </TabsContent>
      </Tabs>
    </div>
  );
}
