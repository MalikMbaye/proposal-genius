import { useState, useEffect, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { DownloadCloud, FileJson, FileSpreadsheet, FileText, Clock, Flame, Users, MessageSquare, Filter } from "lucide-react";
import { format } from "date-fns";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType } from "docx";
import { saveAs } from "file-saver";

type SortMode = "priority" | "chronological";
type SourceFilter = "all" | "direct" | "dm";

interface MergedLead {
  id: string;
  name: string;
  platform: string | null;
  status: string | null;
  qualification_score: number | null;
  budget_range: string | null;
  goals: string | null;
  pain_points: string[] | null;
  timeline: string | null;
  current_stage: string | null;
  created_at: string | null;
  updated_at: string | null;
  dm_prospect_name: string | null;
  source: "Direct" | "DM Closer" | "Both";
}

const HEAT_ORDER: Record<string, number> = {
  hot: 4,
  warm: 3,
  cool: 2,
  cold: 1,
};

function heatRank(level: string | null): number {
  if (!level) return 0;
  return HEAT_ORDER[level.toLowerCase()] ?? 0;
}

export default function LeadsExport() {
  const { user } = useAuth();
  const [sortMode, setSortMode] = useState<SortMode>("priority");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [leads, setLeads] = useState<MergedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastExported, setLastExported] = useState<string | null>(null);

  useEffect(() => {
    setLastExported(localStorage.getItem("blv-leads-last-exported"));
  }, []);

  useEffect(() => {
    if (!user) return;
    async function fetchLeads() {
      setLoading(true);

      // Fetch leads
      const { data: directLeads } = await supabase
        .from("leads")
        .select("*")
        .eq("user_id", user!.id);

      // Fetch dm_snapshots with their lead_ids and analysis
      const { data: snapshots } = await supabase
        .from("dm_snapshots")
        .select("lead_id, analysis");

      // Build map: lead_id -> prospect_name from analysis JSON
      const snapshotMap = new Map<string, string | null>();
      for (const s of snapshots ?? []) {
        const analysis = s.analysis as any;
        const prospectName = analysis?.prospect_name ?? analysis?.name ?? null;
        snapshotMap.set(s.lead_id, prospectName);
      }

      // Merge: if a lead has a snapshot, mark as "Both"
      const merged: MergedLead[] = (directLeads ?? []).map((l) => ({
        id: l.id,
        name: l.name,
        platform: l.platform,
        status: l.status,
        qualification_score: l.qualification_score,
        budget_range: l.budget_range,
        goals: l.goals,
        pain_points: l.pain_points,
        timeline: l.timeline,
        current_stage: l.current_stage,
        created_at: l.created_at,
        updated_at: l.updated_at,
        dm_prospect_name: snapshotMap.has(l.id) ? snapshotMap.get(l.id) ?? null : null,
        source: snapshotMap.has(l.id)
          ? ("Both" as const)
          : ("Direct" as const),
      }));

      setLeads(merged);
      setLoading(false);
    }
    fetchLeads();
  }, [user]);

  const filtered = useMemo(() => {
    let result = leads;
    if (sourceFilter === "direct") result = result.filter((l) => l.source === "Direct");
    if (sourceFilter === "dm") result = result.filter((l) => l.source === "Both" || l.source === "DM Closer");
    return result;
  }, [leads, sourceFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortMode === "chronological") {
      arr.sort((a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime());
    } else {
      arr.sort((a, b) => {
        const heatDiff = heatRank(b.status) - heatRank(a.status);
        if (heatDiff !== 0) return heatDiff;
        const scoreDiff = (b.qualification_score ?? 0) - (a.qualification_score ?? 0);
        if (scoreDiff !== 0) return scoreDiff;
        return new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime();
      });
    }
    return arr;
  }, [filtered, sortMode]);

  const stats = useMemo(() => {
    const direct = leads.filter((l) => l.source === "Direct").length;
    const dm = leads.filter((l) => l.source === "Both" || l.source === "DM Closer").length;
    return { total: leads.length, direct, dm };
  }, [leads]);

  const dateStr = format(new Date(), "yyyy-MM-dd");

  function downloadJSON() {
    const blob = new Blob([JSON.stringify(sorted, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blv-leads-export-${sortMode}-${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
    markExported();
  }

  function downloadCSV() {
    if (sorted.length === 0) return;
    const headers = Object.keys(sorted[0]);
    const csvRows = [
      headers.join(","),
      ...sorted.map((row) =>
        headers
          .map((h) => {
            const val = (row as any)[h];
            const str = Array.isArray(val) ? val.join("; ") : val ?? "";
            return `"${String(str).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blv-leads-export-${sortMode}-${dateStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    markExported();
  }

  async function downloadDOCX() {
    if (sorted.length === 0) return;

    const heatEmoji = (h: string | null) => {
      switch (h?.toLowerCase()) {
        case "hot": return "🔥";
        case "warm": return "🟠";
        case "cool": return "🔵";
        case "cold": return "⚪";
        default: return "—";
      }
    };

    const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" };
    const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
    const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };

    const leadSections: (Paragraph | Table)[] = [];

    sorted.forEach((lead, idx) => {
      if (idx > 0) {
        leadSections.push(new Paragraph({ spacing: { before: 200 } }));
      }

      leadSections.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 100 },
          children: [
            new TextRun({ text: `${heatEmoji(lead.heat_level)} ${lead.dm_prospect_name || lead.name}`, bold: true, size: 28, font: "Arial" }),
          ],
        })
      );

      const details: [string, string][] = [
        ["Lead Name", lead.name],
        ["DM Prospect Name", lead.dm_prospect_name || "—"],
        ["Heat Level", (lead.heat_level ?? "Unknown").toUpperCase()],
        ["Qualification Score", lead.qualification_score != null ? `${lead.qualification_score}/100` : "—"],
        ["Platform", lead.platform ?? "—"],
        ["Status", lead.status ?? "—"],
        ["Stage", lead.current_stage ?? "—"],
        ["Budget", lead.budget_range ?? "—"],
        ["Timeline", lead.timeline ?? "—"],
        ["Goals", lead.goals ?? "—"],
        ["Pain Points", lead.pain_points?.join(", ") ?? "—"],
        ["Source", lead.source],
        ["Created", lead.created_at ? format(new Date(lead.created_at), "MMM d, yyyy") : "—"],
      ];

      const tableRows = details.map(([label, value]) =>
        new TableRow({
          children: [
            new TableCell({
              borders: cellBorders,
              margins: cellMargins,
              width: { size: 2800, type: WidthType.DXA },
              shading: { fill: "F3F4F6", type: ShadingType.CLEAR },
              children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20, font: "Arial", color: "374151" })] })],
            }),
            new TableCell({
              borders: cellBorders,
              margins: cellMargins,
              width: { size: 6560, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, font: "Arial", color: "1F2937" })] })],
            }),
          ],
        })
      );

      leadSections.push(
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2800, 6560],
          rows: tableRows,
        })
      );
    });

    const doc = new Document({
      styles: {
        default: { document: { run: { font: "Arial", size: 22 } } },
        paragraphStyles: [
          {
            id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
            run: { size: 36, bold: true, font: "Arial", color: "D97706" },
            paragraph: { spacing: { before: 240, after: 120 } },
          },
          {
            id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
            run: { size: 28, bold: true, font: "Arial" },
            paragraph: { spacing: { before: 200, after: 80 } },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              size: { width: 12240, height: 15840 },
              margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
            },
          },
          children: [
            new Paragraph({
              heading: HeadingLevel.HEADING_1,
              children: [new TextRun({ text: "Black Lotus Ventures — Leads Export", bold: true, size: 36, font: "Arial", color: "D97706" })],
            }),
            new Paragraph({
              spacing: { after: 100 },
              children: [new TextRun({ text: `Generated ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")} · ${sorted.length} leads · Sorted by ${sortMode}`, size: 20, font: "Arial", color: "6B7280" })],
            }),
            new Paragraph({
              spacing: { after: 300 },
              children: [
                new TextRun({ text: `Direct: ${stats.direct}`, size: 20, font: "Arial", color: "3B82F6" }),
                new TextRun({ text: `  ·  DM Closer: ${stats.dm}`, size: 20, font: "Arial", color: "10B981" }),
                new TextRun({ text: `  ·  Total: ${stats.total}`, size: 20, font: "Arial", color: "6B7280" }),
              ],
            }),
            ...leadSections,
          ],
        },
      ],
    });

    const buffer = await Packer.toBlob(doc);
    saveAs(buffer, `blv-leads-export-${sortMode}-${dateStr}.docx`);
    markExported();
  }

  function markExported() {
    const ts = new Date().toISOString();
    localStorage.setItem("blv-leads-last-exported", ts);
    setLastExported(ts);
  }

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <DownloadCloud className="h-8 w-8 text-amber-400" />
            <h1 className="text-3xl font-bold text-white">Leads Export</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Download your leads for CRM sync, outreach, or team handoff
          </p>
        </div>

        {/* Summary Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="flex items-center gap-3 p-4">
              <Users className="h-5 w-5 text-amber-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-slate-400">Total Leads</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="flex items-center gap-3 p-4">
              <Users className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.direct}</p>
                <p className="text-xs text-slate-400">From Direct</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="flex items-center gap-3 p-4">
              <MessageSquare className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.dm}</p>
                <p className="text-xs text-slate-400">From DM Closer</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Source Filter */}
        <div className="flex items-center gap-3 mb-4">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-400">Source:</span>
          <ToggleGroup
            type="single"
            value={sourceFilter}
            onValueChange={(v) => v && setSourceFilter(v as SourceFilter)}
            className="bg-slate-800 rounded-lg p-1"
          >
            <ToggleGroupItem value="all" className="text-xs data-[state=on]:bg-amber-500 data-[state=on]:text-black px-3 py-1.5 rounded text-slate-300">
              All
            </ToggleGroupItem>
            <ToggleGroupItem value="direct" className="text-xs data-[state=on]:bg-amber-500 data-[state=on]:text-black px-3 py-1.5 rounded text-slate-300">
              Direct Only
            </ToggleGroupItem>
            <ToggleGroupItem value="dm" className="text-xs data-[state=on]:bg-amber-500 data-[state=on]:text-black px-3 py-1.5 rounded text-slate-300">
              DM Closer Only
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Sort Mode Toggle */}
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-300 mb-3">Sort Mode</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setSortMode("priority")}
              className={`text-left p-4 rounded-xl border transition-all ${
                sortMode === "priority"
                  ? "border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30"
                  : "border-slate-700 bg-slate-800 hover:border-slate-600"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Flame className={`h-4 w-4 ${sortMode === "priority" ? "text-amber-400" : "text-slate-500"}`} />
                <span className={`font-semibold text-sm ${sortMode === "priority" ? "text-amber-300" : "text-slate-300"}`}>
                  Priority — Hottest Leads First
                </span>
              </div>
              <p className="text-xs text-slate-500">Ranked by lead temperature and qualification</p>
            </button>
            <button
              onClick={() => setSortMode("chronological")}
              className={`text-left p-4 rounded-xl border transition-all ${
                sortMode === "chronological"
                  ? "border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30"
                  : "border-slate-700 bg-slate-800 hover:border-slate-600"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Clock className={`h-4 w-4 ${sortMode === "chronological" ? "text-amber-400" : "text-slate-500"}`} />
                <span className={`font-semibold text-sm ${sortMode === "chronological" ? "text-amber-300" : "text-slate-300"}`}>
                  Chronological — First Contact First
                </span>
              </div>
              <p className="text-xs text-slate-500">Ordered by who reached out first</p>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {!loading && sorted.length === 0 && (
          <div className="text-center py-16">
            <DownloadCloud className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-medium mb-2">No leads yet</p>
            <p className="text-slate-500 text-sm">
              Start adding leads or run DM analysis to unlock export.
            </p>
          </div>
        )}

        {/* Export Cards */}
        {sorted.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-slate-800 border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer group" onClick={downloadJSON}>
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <FileJson className="h-12 w-12 text-amber-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-white mb-1">Download as JSON</h3>
                <p className="text-sm text-slate-400 mb-4">Structured data for CRM import or automation</p>
                <Button variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  Export JSON
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer group" onClick={downloadCSV}>
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <FileSpreadsheet className="h-12 w-12 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-white mb-1">Download as CSV</h3>
                <p className="text-sm text-slate-400 mb-4">Open in Excel, Sheets, or any spreadsheet tool</p>
                <Button variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer group" onClick={downloadDOCX}>
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <FileText className="h-12 w-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-white mb-1">Download as DOCX</h3>
                <p className="text-sm text-slate-400 mb-4">Formatted report for Google Docs or Word</p>
                <Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  Export DOCX
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Last Exported */}
        {lastExported && (
          <p className="text-xs text-slate-500 text-center">
            Last exported: {format(new Date(lastExported), "MMM d, yyyy 'at' h:mm a")}
          </p>
        )}
      </div>
    </AppLayout>
  );
}
