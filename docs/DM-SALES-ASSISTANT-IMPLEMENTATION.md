# PitchGenius DM Sales Assistant
## Lovable Implementation Spec

**For:** Lovable AI Development  
**Project:** PitchGenius  
**Feature:** Leads Tab with DM Analysis

---

## 📋 OVERVIEW

Add a new "Leads" tab to PitchGenius that allows users to:
1. Drop Instagram DM screenshots
2. Get AI-powered response suggestions
3. Track leads through the sales process
4. Generate proposals from qualified leads

---

## 🗄️ DATABASE: Supabase Tables

### Table 1: `leads`

```sql
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic info (auto-extracted from first screenshot)
  name TEXT NOT NULL,
  platform TEXT DEFAULT 'instagram',
  
  -- Status (auto-updated by AI analysis)
  status TEXT DEFAULT 'cold' CHECK (status IN ('cold', 'warm', 'hot', 'qualified', 'proposal_sent', 'closed', 'lost')),
  qualification_score INTEGER CHECK (qualification_score >= 1 AND qualification_score <= 10),
  current_stage TEXT DEFAULT 'Opening' CHECK (current_stage IN ('Opening', 'Qualifying', 'Building Urgency', 'Pitching', 'Booking')),
  
  -- Accumulated context from conversations
  goals TEXT,
  pain_points TEXT[],
  budget_range TEXT,
  timeline TEXT,
  
  -- Links to other features
  proposal_id UUID, -- Link to proposals table when created
  
  -- Timestamps
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own leads"
  ON leads FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own leads"
  ON leads FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads"
  ON leads FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leads"
  ON leads FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_last_activity ON leads(last_activity DESC);
```

### Table 2: `dm_snapshots`

```sql
CREATE TABLE dm_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  
  -- Analysis result from Claude
  analysis JSONB NOT NULL,
  /*
  Expected structure:
  {
    "prospect_name": "Sarah Chen",
    "platform": "instagram",
    "conversation_text": "...",
    "qualification_score": 7,
    "heat_level": "hot",
    "current_stage": "Pitching",
    "response_options": {
      "A": { "type": "Direct", "message": "..." },
      "B": { "type": "Consultative", "message": "..." },
      "C": { "type": "Social Proof", "message": "..." }
    },
    "recommended": "B",
    "reasoning": "...",
    "extracted_context": {
      "goals": "...",
      "pain_points": ["...", "..."],
      "budget_signals": "...",
      "timeline_signals": "..."
    },
    "next_action": "..."
  }
  */
  
  -- Optional: track which response user actually sent
  response_used TEXT CHECK (response_used IN ('A', 'B', 'C')),
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE dm_snapshots ENABLE ROW LEVEL SECURITY;

-- Policies (through leads relationship)
CREATE POLICY "Users can view snapshots for their leads"
  ON dm_snapshots FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM leads WHERE leads.id = dm_snapshots.lead_id AND leads.user_id = auth.uid()
  ));

CREATE POLICY "Users can create snapshots for their leads"
  ON dm_snapshots FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM leads WHERE leads.id = dm_snapshots.lead_id AND leads.user_id = auth.uid()
  ));

-- Index
CREATE INDEX idx_dm_snapshots_lead_id ON dm_snapshots(lead_id);
CREATE INDEX idx_dm_snapshots_created ON dm_snapshots(created_at DESC);
```

---

## 🔌 API: Supabase Edge Functions

### Function 1: `analyze-screenshot`

**File:** `supabase/functions/analyze-screenshot/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { screenshot, leadId } = await req.json();

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Get user's offer context from their profile/settings
    const { data: profile } = await supabase
      .from("profiles") // or whatever your user settings table is
      .select("offer_context")
      .eq("id", user.id)
      .single();

    const offerContext = profile?.offer_context || "";

    // Get conversation history if this is an existing lead
    let conversationHistory = "";
    if (leadId) {
      const { data: snapshots } = await supabase
        .from("dm_snapshots")
        .select("analysis")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: true });

      if (snapshots && snapshots.length > 0) {
        conversationHistory = snapshots
          .map((s, i) => `Exchange ${i + 1}:\n${JSON.stringify(s.analysis.conversation_text || "")}`)
          .join("\n\n");
      }
    }

    // Call Claude API
    const analysis = await analyzeWithClaude(screenshot, offerContext, conversationHistory);

    // If no leadId, create a new lead
    let finalLeadId = leadId;
    if (!leadId) {
      const { data: newLead, error: leadError } = await supabase
        .from("leads")
        .insert({
          user_id: user.id,
          name: analysis.prospect_name,
          platform: analysis.platform || "instagram",
          status: analysis.heat_level,
          qualification_score: analysis.qualification_score,
          current_stage: analysis.current_stage,
          goals: analysis.extracted_context?.goals,
          pain_points: analysis.extracted_context?.pain_points,
          budget_range: analysis.extracted_context?.budget_signals,
          timeline: analysis.extracted_context?.timeline_signals,
        })
        .select()
        .single();

      if (leadError) throw leadError;
      finalLeadId = newLead.id;
    } else {
      // Update existing lead with latest analysis
      await supabase
        .from("leads")
        .update({
          status: analysis.heat_level,
          qualification_score: analysis.qualification_score,
          current_stage: analysis.current_stage,
          goals: analysis.extracted_context?.goals || undefined,
          pain_points: analysis.extracted_context?.pain_points || undefined,
          budget_range: analysis.extracted_context?.budget_signals || undefined,
          timeline: analysis.extracted_context?.timeline_signals || undefined,
          last_activity: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", leadId);
    }

    // Save the snapshot
    await supabase.from("dm_snapshots").insert({
      lead_id: finalLeadId,
      analysis: analysis,
    });

    return new Response(
      JSON.stringify({
        success: true,
        leadId: finalLeadId,
        analysis: analysis,
        isNewLead: !leadId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function analyzeWithClaude(
  screenshot: string,
  offerContext: string,
  conversationHistory: string
) {
  const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

  const systemPrompt = `You are a 7-figure sales AI assistant analyzing Instagram DM screenshots.

USER'S OFFER CONTEXT:
${offerContext || "No specific offer context provided. Assume they are a consultant/service provider."}

${conversationHistory ? `PREVIOUS CONVERSATION CONTEXT:\n${conversationHistory}\n` : ""}

TASK:
Analyze this DM screenshot and return a JSON response.

EXTRACTION:
1. Find the prospect's name in the Instagram conversation header (usually at the top)
2. Extract all visible message text from the conversation
3. Identify the platform (Instagram, LinkedIn, etc.)

ANALYSIS FRAMEWORK (7-Figure Sales Method):
- Stage 1 (Opening): Building initial rapport and connection
- Stage 2 (Qualifying): Understanding their situation and needs
- Stage 3 (Building Urgency): Helping them feel the cost of inaction
- Stage 4 (Pitching): Introducing your solution naturally
- Stage 5 (Booking): Getting commitment to next step

RESPONSE RULES:
- Match their energy exactly (casual if casual, professional if professional)
- Keep messages under 3 sentences (DM appropriate length)
- Never be salesy or pushy - be genuinely curious
- Questions > Statements
- Advance the conversation naturally toward booking

Return ONLY valid JSON (no markdown, no explanation):
{
  "prospect_name": "Name from screenshot header",
  "platform": "instagram",
  "conversation_text": "The actual conversation text visible",
  "qualification_score": 7,
  "heat_level": "cold|warm|hot|qualified",
  "current_stage": "Opening|Qualifying|Building Urgency|Pitching|Booking",
  "response_options": {
    "A": {
      "type": "Direct",
      "message": "Exact message to copy-paste, matching their tone"
    },
    "B": {
      "type": "Consultative",
      "message": "Exact message to copy-paste, matching their tone"
    },
    "C": {
      "type": "Social Proof",
      "message": "Exact message to copy-paste, matching their tone"
    }
  },
  "recommended": "A|B|C",
  "reasoning": "One sentence on why this option is best",
  "extracted_context": {
    "goals": "What they want to achieve (null if not mentioned)",
    "pain_points": ["Pain point 1", "Pain point 2"],
    "budget_signals": "Any budget mentions (null if none)",
    "timeline_signals": "Any urgency/timeline mentions (null if none)"
  },
  "next_action": "What to watch for or do after they respond"
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: screenshot.replace(/^data:image\/\w+;base64,/, ""),
              },
            },
            {
              type: "text",
              text: "Analyze this DM screenshot and respond with JSON only.",
            },
          ],
        },
      ],
      system: systemPrompt,
    }),
  });

  const result = await response.json();
  
  if (result.error) {
    throw new Error(result.error.message);
  }

  // Parse the JSON response
  const content = result.content[0].text;
  try {
    return JSON.parse(content);
  } catch {
    // If Claude didn't return valid JSON, try to extract it
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Failed to parse AI response as JSON");
  }
}
```

---

## 🎨 COMPONENTS: React/Lovable

### Component 1: LeadsTab (Main Container)

```tsx
// Location: src/pages/Leads.tsx or src/components/LeadsTab.tsx

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ScreenshotDropZone } from '@/components/ScreenshotDropZone';
import { LeadCard } from '@/components/LeadCard';
import { LeadThread } from '@/components/LeadThread';

export function LeadsTab() {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('last_activity', { ascending: false });
    
    if (!error) setLeads(data || []);
    setLoading(false);
  };

  const handleScreenshotAnalyzed = (result) => {
    // If new lead created, add to list and navigate to it
    if (result.isNewLead) {
      fetchLeads();
    }
    // Navigate to the lead thread
    setSelectedLead(result.leadId);
  };

  if (selectedLead) {
    return (
      <LeadThread 
        leadId={selectedLead} 
        onBack={() => {
          setSelectedLead(null);
          fetchLeads();
        }}
      />
    );
  }

  return (
    <div className="p-6">
      {/* Global Screenshot Drop Zone */}
      <ScreenshotDropZone 
        onAnalyzed={handleScreenshotAnalyzed}
        className="mb-8"
      />

      {/* Leads Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Active Leads</h2>
        
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : leads.length === 0 ? (
          <p className="text-gray-500">
            Drop your first DM screenshot above to get started.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {leads.map(lead => (
              <LeadCard 
                key={lead.id}
                lead={lead}
                onClick={() => setSelectedLead(lead.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Component 2: ScreenshotDropZone

```tsx
// Location: src/components/ScreenshotDropZone.tsx

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/lib/supabase';

interface Props {
  leadId?: string; // If provided, adds to existing lead
  onAnalyzed: (result: any) => void;
  className?: string;
}

export function ScreenshotDropZone({ leadId, onAnalyzed, className }: Props) {
  const [analyzing, setAnalyzing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setAnalyzing(true);

    try {
      // Convert to base64
      const base64 = await fileToBase64(file);

      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();

      // Call edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-screenshot`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            screenshot: base64,
            leadId: leadId || null,
          }),
        }
      );

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      onAnalyzed(result);

    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze screenshot. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  }, [leadId, onAnalyzed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    disabled: analyzing,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
        transition-all duration-200
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}
        ${analyzing ? 'opacity-50 cursor-wait' : ''}
        ${className}
      `}
    >
      <input {...getInputProps()} />
      
      {analyzing ? (
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
          <p className="text-gray-600">Analyzing screenshot...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <span className="text-3xl">📸</span>
          <p className="font-medium">
            {isDragActive ? 'Drop screenshot here' : 'Drop screenshot here'}
          </p>
          <p className="text-sm text-gray-500">or click to upload</p>
        </div>
      )}
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}
```

### Component 3: LeadCard

```tsx
// Location: src/components/LeadCard.tsx

interface Lead {
  id: string;
  name: string;
  status: string;
  qualification_score: number;
  current_stage: string;
  last_activity: string;
}

interface Props {
  lead: Lead;
  onClick: () => void;
}

const statusConfig = {
  cold: { emoji: '❄️', label: 'Cold', color: 'bg-blue-100 text-blue-800' },
  warm: { emoji: '🟡', label: 'Warm', color: 'bg-yellow-100 text-yellow-800' },
  hot: { emoji: '🔥', label: 'Hot', color: 'bg-orange-100 text-orange-800' },
  qualified: { emoji: '✅', label: 'Qualified', color: 'bg-green-100 text-green-800' },
  proposal_sent: { emoji: '📝', label: 'Proposal Sent', color: 'bg-purple-100 text-purple-800' },
  closed: { emoji: '🎉', label: 'Closed', color: 'bg-green-100 text-green-800' },
  lost: { emoji: '❌', label: 'Lost', color: 'bg-gray-100 text-gray-800' },
};

export function LeadCard({ lead, onClick }: Props) {
  const config = statusConfig[lead.status] || statusConfig.cold;
  const timeAgo = formatTimeAgo(lead.last_activity);

  return (
    <div
      onClick={onClick}
      className="p-4 bg-white rounded-xl border border-gray-200 cursor-pointer
                 hover:border-gray-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold truncate">{lead.name}</h3>
        <span className="text-lg">{config.emoji}</span>
      </div>
      
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
      
      <div className="mt-3 text-xs text-gray-500">
        <p>{lead.current_stage}</p>
        <p>{timeAgo}</p>
      </div>
    </div>
  );
}

function formatTimeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
```

### Component 4: LeadThread

```tsx
// Location: src/components/LeadThread.tsx

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ScreenshotDropZone } from './ScreenshotDropZone';
import { ResponseOptions } from './ResponseOptions';

interface Props {
  leadId: string;
  onBack: () => void;
}

export function LeadThread({ leadId, onBack }: Props) {
  const [lead, setLead] = useState<any>(null);
  const [latestAnalysis, setLatestAnalysis] = useState<any>(null);
  const [snapshots, setSnapshots] = useState<any[]>([]);

  useEffect(() => {
    fetchLeadData();
  }, [leadId]);

  const fetchLeadData = async () => {
    // Fetch lead
    const { data: leadData } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();
    
    setLead(leadData);

    // Fetch snapshots
    const { data: snapshotData } = await supabase
      .from('dm_snapshots')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    setSnapshots(snapshotData || []);
    
    if (snapshotData && snapshotData.length > 0) {
      setLatestAnalysis(snapshotData[0].analysis);
    }
  };

  const handleScreenshotAnalyzed = (result: any) => {
    setLatestAnalysis(result.analysis);
    fetchLeadData();
  };

  const statusConfig: Record<string, { emoji: string }> = {
    cold: { emoji: '❄️' },
    warm: { emoji: '🟡' },
    hot: { emoji: '🔥' },
    qualified: { emoji: '✅' },
  };

  if (!lead) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold">{lead.name}</h1>
          <span className="text-2xl">
            {statusConfig[lead.status]?.emoji || '❄️'}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          Score: {lead.qualification_score}/10 • {lead.current_stage}
        </div>
      </div>

      {/* Screenshot Drop Zone */}
      <ScreenshotDropZone
        leadId={leadId}
        onAnalyzed={handleScreenshotAnalyzed}
        className="mb-6"
      />

      {/* Response Options */}
      {latestAnalysis && (
        <ResponseOptions 
          analysis={latestAnalysis}
          className="mb-6"
        />
      )}

      {/* Action Buttons */}
      {lead.status === 'qualified' || lead.status === 'hot' ? (
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {/* Navigate to proposal generator with lead context */}}
            className="flex-1 py-3 px-4 bg-primary text-white rounded-lg font-medium
                       hover:bg-primary/90 transition-colors"
          >
            📝 Generate Proposal
          </button>
          <button
            onClick={() => {/* Generate call script */}}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-800 rounded-lg font-medium
                       hover:bg-gray-200 transition-colors"
          >
            📞 Generate Call Script
          </button>
        </div>
      ) : null}

      {/* History */}
      {snapshots.length > 1 && (
        <details className="text-sm">
          <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
            View Conversation History ({snapshots.length} exchanges)
          </summary>
          <div className="mt-4 space-y-4">
            {snapshots.map((snapshot, idx) => (
              <div key={snapshot.id} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-400 mb-2">
                  Exchange {snapshots.length - idx}
                </p>
                <p className="text-sm">
                  {snapshot.analysis.conversation_text}
                </p>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
```

### Component 5: ResponseOptions

```tsx
// Location: src/components/ResponseOptions.tsx

import { useState } from 'react';

interface Analysis {
  response_options: {
    A: { type: string; message: string };
    B: { type: string; message: string };
    C: { type: string; message: string };
  };
  recommended: 'A' | 'B' | 'C';
  reasoning: string;
}

interface Props {
  analysis: Analysis;
  className?: string;
}

const optionLabels = {
  A: { icon: '💬', color: 'border-blue-200 hover:border-blue-400' },
  B: { icon: '🎯', color: 'border-purple-200 hover:border-purple-400' },
  C: { icon: '🏆', color: 'border-orange-200 hover:border-orange-400' },
};

export function ResponseOptions({ analysis, className }: Props) {
  const [copiedOption, setCopiedOption] = useState<string | null>(null);

  const handleCopy = async (option: 'A' | 'B' | 'C') => {
    const message = analysis.response_options[option].message;
    await navigator.clipboard.writeText(message);
    setCopiedOption(option);
    setTimeout(() => setCopiedOption(null), 2000);
  };

  return (
    <div className={className}>
      <div className="space-y-3">
        {(['A', 'B', 'C'] as const).map((option) => {
          const opt = analysis.response_options[option];
          const isRecommended = analysis.recommended === option;
          const config = optionLabels[option];

          return (
            <div
              key={option}
              className={`
                p-4 rounded-xl border-2 transition-all
                ${config.color}
                ${isRecommended ? 'ring-2 ring-primary ring-offset-2' : ''}
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span>{config.icon}</span>
                  <span className="font-medium uppercase text-sm">
                    {opt.type}
                  </span>
                  {isRecommended && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                      ⭐ Recommended
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleCopy(option)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg
                             text-sm font-medium transition-colors"
                >
                  {copiedOption === option ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
              <p className="text-gray-700">{opt.message}</p>
            </div>
          );
        })}
      </div>

      {analysis.reasoning && (
        <p className="mt-4 text-sm text-gray-500 italic">
          💡 {analysis.reasoning}
        </p>
      )}
    </div>
  );
}
```

---

## 🔗 INTEGRATION: Generate Proposal

When user clicks "Generate Proposal" from a qualified lead:

```tsx
// In LeadThread.tsx

const handleGenerateProposal = () => {
  // Navigate to proposal generator with pre-filled context
  const proposalContext = {
    clientName: lead.name,
    situation: lead.goals,
    painPoints: lead.pain_points?.join(', '),
    budgetRange: lead.budget_range,
    timeline: lead.timeline,
    source: 'dm_lead',
    leadId: lead.id,
  };

  // Option 1: Query params
  const params = new URLSearchParams(proposalContext);
  navigate(`/proposals/new?${params.toString()}`);

  // Option 2: Store in context/state and navigate
  // setProposalContext(proposalContext);
  // navigate('/proposals/new');
};
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Database Setup
- [ ] Create `leads` table in Supabase
- [ ] Create `dm_snapshots` table
- [ ] Enable RLS on both tables
- [ ] Create policies
- [ ] Create indexes

### Edge Function
- [ ] Create `analyze-screenshot` function
- [ ] Add ANTHROPIC_API_KEY to Supabase secrets
- [ ] Deploy and test function
- [ ] Verify JSON parsing works

### Components
- [ ] Add Leads tab to sidebar navigation
- [ ] Build LeadsTab main container
- [ ] Build ScreenshotDropZone component
- [ ] Build LeadCard component
- [ ] Build LeadThread component
- [ ] Build ResponseOptions component

### Integration
- [ ] Connect drop zone to edge function
- [ ] Auto-create leads from first screenshot
- [ ] Update leads on subsequent screenshots
- [ ] Generate Proposal pre-fill integration
- [ ] Generate Call Script feature

### Polish
- [ ] Loading states everywhere
- [ ] Error handling with user feedback
- [ ] Copy confirmation animation
- [ ] Mobile responsiveness
- [ ] Empty states

---

## 🚀 READY TO BUILD

This spec contains everything needed to implement the DM Sales Assistant in Lovable:

1. **SQL** — Copy-paste into Supabase SQL editor
2. **Edge Function** — Deploy to Supabase Functions
3. **Components** — Build in Lovable with provided code

Questions? Missing something? Let me know what else you need.
