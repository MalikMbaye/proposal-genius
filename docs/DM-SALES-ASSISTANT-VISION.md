# PitchGenius DM Sales Assistant
## Complete Vision & Strategy Document

**Created:** December 31, 2025  
**Author:** Malik M. × Claude  
**Status:** Ready for Implementation

---

## 🎯 THE VISION

### One Sentence

**PitchGenius becomes your AI sales command center — from first DM to signed proposal, all in one place.**

### The Problem We're Solving

Right now, closing deals via DM is painful:

1. **You're context-switching constantly** — Instagram, notes app, proposal tool, back to Instagram
2. **You're starting from scratch every conversation** — No system remembers what you talked about
3. **You're guessing on responses** — No framework, just vibes
4. **You're manually creating proposals** — Re-typing everything you learned in DMs
5. **You're tracking leads in your head** — Or worse, a messy spreadsheet

### The Solution

**Screenshot in → AI response out → Repeat → Generate proposal when ready**

That's it. That's the whole workflow.

The AI:
- Creates the lead automatically (extracts name from screenshot)
- Tracks the conversation history
- Tells you exactly what to say (3 options, copy-paste ready)
- Qualifies the lead (hot/warm/cold)
- Extracts their goals, pain points, budget signals
- Generates a custom proposal when they're ready
- Generates a call script if you need to hop on a call

---

## 💡 WHY THIS CHANGES EVERYTHING

### Before: PitchGenius is a One-Time Tool

```
User journey:
1. Have a sales call
2. Come to PitchGenius
3. Generate proposal
4. Leave
5. Come back in 2 weeks for next deal
```

**Problem:** Low retention. Transactional relationship.

### After: PitchGenius is Your Daily Sales Assistant

```
User journey:
1. Wake up, check DMs
2. Screenshot → PitchGenius → Get response
3. Screenshot → PitchGenius → Get response
4. Screenshot → PitchGenius → Get response
5. Lead is hot → Generate Proposal
6. Repeat all day, every day
```

**Result:** Daily active usage. Sticky as fuck.

### The Business Impact

| Metric | Before | After |
|--------|--------|-------|
| Sessions per user/month | 2-4 | 30-60 |
| Time in app | 5 min | 30+ min/day |
| Retention driver | "Need a proposal" | "Need to respond to DMs" |
| Value perception | "$200 for proposals" | "$200 for AI sales assistant + proposals" |
| Competitive moat | Low (many proposal tools) | High (unique workflow) |

---

## 🏗️ PRODUCT ARCHITECTURE

### The Leads Tab

Lives in PitchGenius sidebar alongside:
- Dashboard
- Proposals
- **Leads** ← NEW
- Settings

### Core Components

```
LEADS TAB
├── Global Screenshot Drop Zone (always visible at top)
├── Active Leads Grid
│   ├── Lead Card (name, status badge, last activity)
│   ├── Lead Card
│   └── Lead Card
└── Lead Thread View (when you click into a lead)
    ├── Screenshot Drop Zone
    ├── Response Options (3 cards with copy buttons)
    ├── Action Buttons (Generate Proposal, Generate Call Script)
    └── History (collapsed)
```

### User Flow: New Lead

```
1. User drops screenshot on Leads tab
         ↓
2. Claude Vision extracts:
   - Prospect name (from IG header)
   - Conversation text
   - Platform (Instagram detected)
         ↓
3. System auto-creates lead with that name
         ↓
4. Claude NEPQ analysis runs:
   - Qualification score (1-10)
   - Heat level (cold/warm/hot)
   - Current stage
   - 3 response options
   - Context extraction
         ↓
5. User sees response options
         ↓
6. User copies preferred response
         ↓
7. User is now IN that lead's thread for future screenshots
```

### User Flow: Existing Lead

```
1. User clicks into existing lead
         ↓
2. Sees minimal UI: Drop zone + last response options
         ↓
3. Drops new screenshot
         ↓
4. Claude analyzes WITH full conversation history
         ↓
5. Returns updated response options
         ↓
6. Repeat until qualified
         ↓
7. Click "Generate Proposal" or "Generate Call Script"
```

---

## 🎨 UX PHILOSOPHY

### Principle 1: Zero Friction

**The only action is: Drop screenshot.**

- No "create lead" button needed
- No typing prospect details
- No selecting conversation stage
- No configuring anything

Everything is inferred from the screenshot.

### Principle 2: Minimal UI

**Inside a lead thread, you see:**
1. Drop zone for next screenshot
2. 3 response options with copy buttons
3. Two action buttons (Proposal, Call Script)

That's it. History is collapsed. Settings are elsewhere.

### Principle 3: Speed > Features

**Optimize for:**
- Time from screenshot to copied response
- Number of back-and-forths per minute
- Feeling of flow state

**Not for:**
- Feature richness
- Customization options
- Data visualization

### Principle 4: Tinder Energy

**The vibe should feel like:**
- Swipe, swipe, swipe
- Quick decisions
- Momentum
- Dopamine hits (response copied!)

**Not like:**
- CRM software
- Enterprise dashboard
- Overwhelming data

---

## 🤖 AI FRAMEWORK (Under the Hood)

### The 7-Figure Sales Framework

Internally, we use NEPQ (Neuro-Emotional Persuasion Questions) by Jeremy Miner. But users never see "NEPQ" — they see simple stage names:

| Internal (NEPQ) | User-Facing | What It Means |
|-----------------|-------------|---------------|
| Stage 1: Connection | Opening | First contact, building rapport |
| Stage 2: Problem Awareness | Qualifying | Understanding their situation |
| Stage 3: Consequences | Building Urgency | Helping them feel the cost of inaction |
| Stage 4: Solution Awareness | Pitching | Introducing your offer |
| Stage 5: Commitment | Booking | Getting them to take action |

### Lead Status Badges

| Score | Badge | Meaning |
|-------|-------|---------|
| 1-3 | ❄️ Cold | Just started, unclear interest |
| 4-6 | 🟡 Warm | Engaged, showing interest |
| 7-8 | 🔥 Hot | Ready to hear pitch |
| 9-10 | ✅ Qualified | Ready for proposal/call |

### What Claude Extracts

From each screenshot, Claude identifies:

```json
{
  "prospect_name": "Sarah Chen",
  "platform": "instagram",
  "qualification_score": 7,
  "heat_level": "hot",
  "current_stage": "Pitching",
  "response_options": {
    "A": { "type": "Direct", "message": "..." },
    "B": { "type": "Consultative", "message": "..." },
    "C": { "type": "Social Proof", "message": "..." }
  },
  "recommended": "B",
  "extracted_context": {
    "goals": "Scale to $50K/month",
    "pain_points": ["No consistent lead flow", "Burned by agencies"],
    "budget_signals": "Mentioned $5-10K range",
    "timeline": "Wants to start in January"
  }
}
```

### Context Accumulation

Each new screenshot adds to the lead's context. By the time they're qualified, we know:
- Everything they've said about their goals
- All their pain points mentioned
- Budget range
- Timeline
- Objections raised
- What resonated with them

This context auto-fills the proposal generator.

---

## 📱 SCREEN DESIGNS

### Screen 1: Leads Tab (Empty State)

```
┌─────────────────────────────────────────────────────────────────┐
│  PITCHGENIUS                                    [User Avatar]   │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                      │
│ Dashboard│     ┌────────────────────────────────────────┐      │
│          │     │                                        │      │
│ Proposals│     │      📸 DROP YOUR FIRST SCREENSHOT     │      │
│          │     │                                        │      │
│ ► Leads  │     │         Drag & drop or click          │      │
│          │     │                                        │      │
│ Settings │     └────────────────────────────────────────┘      │
│          │                                                      │
│          │     Your AI sales assistant that turns DMs          │
│          │     into closed deals. Screenshot a conversation    │
│          │     to get started.                                 │
│          │                                                      │
└──────────┴──────────────────────────────────────────────────────┘
```

### Screen 2: Leads Tab (With Leads)

```
┌─────────────────────────────────────────────────────────────────┐
│  PITCHGENIUS                                    [User Avatar]   │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                      │
│ Dashboard│  ┌────────────────────────────────────────────────┐ │
│          │  │  📸 DROP SCREENSHOT                            │ │
│ Proposals│  └────────────────────────────────────────────────┘ │
│          │                                                      │
│ ► Leads  │  ACTIVE LEADS                          Recent ▼     │
│          │                                                      │
│ Settings │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│          │  │ Sarah C. │ │ Mike R.  │ │ James T. │            │
│          │  │ 🔥 Hot   │ │ 🟡 Warm  │ │ ❄️ Cold  │            │
│          │  │ 5m ago   │ │ 2h ago   │ │ 3d ago   │            │
│          │  │ Pitching │ │Qualifying│ │ Opening  │            │
│          │  └──────────┘ └──────────┘ └──────────┘            │
│          │                                                      │
│          │  QUALIFIED                                          │
│          │                                                      │
│          │  ┌──────────┐                                       │
│          │  │ Alex P.  │                                       │
│          │  │ ✅ Ready │                                       │
│          │  │ 1d ago   │                                       │
│          │  └──────────┘                                       │
│          │                                                      │
└──────────┴──────────────────────────────────────────────────────┘
```

### Screen 3: Lead Thread View

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to Leads              Sarah Chen            🔥 Hot      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  📸 DROP NEXT SCREENSHOT                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Current Stage: Pitching                     Score: 7/10       │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 💬 DIRECT                                     [📋 Copy] │   │
│  │                                                         │   │
│  │ "Totally get that. What would hitting $50K/month        │   │
│  │ actually mean for you and your family?"                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🎯 CONSULTATIVE                    ⭐ Recommended [📋]  │   │
│  │                                                         │   │
│  │ "Makes sense. Before I share how we might help -        │   │
│  │ what have you tried so far that hasn't worked?"         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🏆 SOCIAL PROOF                               [📋 Copy] │   │
│  │                                                         │   │
│  │ "I hear you. Had a client in a similar spot last month  │   │
│  │ - what specifically is the biggest blocker right now?"  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  [📝 Generate Proposal]        [📞 Generate Call Script]       │
│                                                                 │
│  ▶ View Conversation History (4 exchanges)                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Screen 4: Generate Proposal (Pre-filled)

```
┌─────────────────────────────────────────────────────────────────┐
│  Generate Proposal for Sarah Chen                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PRE-FILLED FROM YOUR CONVERSATION:                            │
│                                                                 │
│  Client Name                                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Sarah Chen                                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Their Situation                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Running a coaching business, currently at $15K/month.   │   │
│  │ Struggling with consistent lead generation. Has been    │   │
│  │ burned by agencies before who overpromised.             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Their Goals                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Scale to $50K/month. Wants predictable lead flow        │   │
│  │ without depending on referrals.                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Budget Range                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ $5,000 - $10,000                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                              [Generate Proposal →]             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 TECHNICAL ARCHITECTURE

### Stack

- **Frontend:** Lovable (React)
- **Backend:** Supabase (Database + Auth + Edge Functions)
- **AI:** Claude API (claude-sonnet-4-20250514 with vision)
- **Auth:** Supabase Auth (already in PitchGenius)

### Database Schema

```sql
-- Leads table
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Auto-extracted from first screenshot
  name TEXT NOT NULL,
  platform TEXT DEFAULT 'instagram',
  
  -- Status (auto-updated by Claude)
  status TEXT DEFAULT 'cold', -- cold, warm, hot, qualified
  qualification_score INTEGER, -- 1-10
  current_stage TEXT, -- Opening, Qualifying, Building Urgency, Pitching, Booking
  
  -- Accumulated context
  goals TEXT,
  pain_points TEXT[],
  budget_range TEXT,
  timeline TEXT,
  
  -- Links
  proposal_id UUID,
  
  -- Meta
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Screenshot analyses
CREATE TABLE dm_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  
  -- Analysis result (JSON)
  analysis JSONB NOT NULL,
  
  -- Which response was actually sent (optional tracking)
  response_used TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_leads_user ON leads(user_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_snapshots_lead ON dm_snapshots(lead_id);

-- RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE dm_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own leads" ON leads 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own snapshots" ON dm_snapshots 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM leads WHERE leads.id = lead_id AND leads.user_id = auth.uid())
  );
```

### API Endpoints

```
POST /api/analyze-screenshot
  - Input: { screenshot: base64, leadId?: uuid }
  - If no leadId: extracts name, creates lead, returns analysis
  - If leadId: adds to history, returns analysis with full context

GET /api/leads
  - Returns all leads for current user

GET /api/leads/:id
  - Returns lead with all snapshots

POST /api/leads/:id/generate-proposal
  - Pre-fills proposal generator with lead context

POST /api/leads/:id/generate-call-script
  - Returns call preparation script
```

### Claude Prompt (Analyze Screenshot)

```
You are a 7-figure sales AI assistant analyzing Instagram DM screenshots.

USER'S OFFER CONTEXT:
{{offer_context from user profile}}

CONVERSATION HISTORY (if any):
{{previous analyses for this lead}}

TASK:
Analyze this screenshot and return a JSON response.

EXTRACTION:
1. Find the prospect's name in the Instagram conversation header
2. Extract all visible message text
3. Identify the platform (Instagram, LinkedIn, etc.)

ANALYSIS:
Using the 7-Figure Sales Framework:
- Stage 1 (Opening): Building initial rapport
- Stage 2 (Qualifying): Understanding their situation
- Stage 3 (Building Urgency): Helping them feel cost of inaction
- Stage 4 (Pitching): Introducing your solution
- Stage 5 (Booking): Getting commitment

RESPONSE FORMAT:
{
  "prospect_name": "Name from screenshot",
  "platform": "instagram",
  "conversation_text": "What they said...",
  "qualification_score": 1-10,
  "heat_level": "cold|warm|hot|qualified",
  "current_stage": "Opening|Qualifying|Building Urgency|Pitching|Booking",
  "response_options": {
    "A": {
      "type": "Direct",
      "message": "Exact message to copy-paste"
    },
    "B": {
      "type": "Consultative",
      "message": "Exact message to copy-paste"
    },
    "C": {
      "type": "Social Proof",
      "message": "Exact message to copy-paste"
    }
  },
  "recommended": "A|B|C",
  "reasoning": "Why this option is best right now",
  "extracted_context": {
    "goals": "What they want to achieve",
    "pain_points": ["Pain 1", "Pain 2"],
    "budget_signals": "Any budget mentions",
    "timeline_signals": "Any urgency/timeline"
  },
  "next_action": "What to watch for in their response"
}

CRITICAL RULES:
- Response messages must match their energy (casual if casual, professional if professional)
- Keep messages under 3 sentences (DM appropriate)
- Never be salesy or pushy
- Always advance the conversation naturally
- Questions > Statements
```

---

## 🚀 IMPLEMENTATION ROADMAP

### Week 1: Core MVP

**Day 1-2: Database & API**
- [ ] Create leads table in Supabase
- [ ] Create dm_snapshots table
- [ ] Build analyze-screenshot edge function
- [ ] Test: Screenshot → JSON response

**Day 3-4: Leads Tab UI**
- [ ] Add Leads tab to sidebar
- [ ] Build global drop zone component
- [ ] Build lead cards grid
- [ ] Build lead thread view
- [ ] Build response options with copy buttons

**Day 5: Integration**
- [ ] Wire up drop zone → API → display results
- [ ] Auto-create lead from first screenshot
- [ ] Navigate into lead thread after creation
- [ ] Pull offer context from user settings

**Day 6-7: Polish & Test**
- [ ] Loading states
- [ ] Error handling
- [ ] Copy feedback ("Copied!")
- [ ] End-to-end testing

### Week 2: Extensions

**Day 8-9: Generate Proposal Integration**
- [ ] "Generate Proposal" button
- [ ] Pre-fill proposal form with lead context
- [ ] Link proposal to lead
- [ ] Update lead status

**Day 10-11: Generate Call Script**
- [ ] Build call script generator
- [ ] Create prompt for call prep
- [ ] Output copyable script

**Day 12-14: Refinement**
- [ ] Conversation history view
- [ ] Lead archiving
- [ ] Sorting/filtering leads
- [ ] Mobile optimization

### Future: Chrome Extension

Once core is solid:
- Build extension from handoff spec
- Distribute via Developer Mode initially
- Submit to Chrome Web Store
- Reduces screenshot friction further

---

## 💰 PRICING IMPACT

### Current PitchGenius Pricing

| Tier | Price | Includes |
|------|-------|----------|
| Free | $0 | 2 proposals |
| Pro | $197-497/yr | Unlimited proposals |
| Lifetime | $997 | Unlimited forever |

### Updated Pricing with DM Assistant

| Tier | Price | Includes |
|------|-------|----------|
| Free | $0 | 2 proposals, 10 DM analyses |
| Pro | $497/yr | Unlimited proposals + DM analyses |
| Lifetime | $1,497 | Everything unlimited |

**Value prop shift:**
- Before: "AI proposal generator"
- After: "AI sales command center — from first DM to signed deal"

---

## 📊 SUCCESS METRICS

### Week 1 Goals
- [ ] MVP live and working
- [ ] You (Malik) using it daily for real DMs
- [ ] 5 complete lead threads (DM → qualified)

### Month 1 Goals
- [ ] 10 beta users
- [ ] 50+ DM analyses
- [ ] 3 proposals generated from leads
- [ ] NPS > 8

### Month 3 Goals
- [ ] Public launch
- [ ] 100+ paying users
- [ ] Daily active usage > 3x proposal-only usage
- [ ] Chrome extension live

---

## 🎬 MARKETING ANGLES

### Content Ideas

1. **"I stopped writing my own DM responses"**
   - Show the workflow
   - Before/after response quality
   - Time saved

2. **"From DM to $10K proposal in 48 hours"**
   - Full case study
   - Screenshot the whole journey
   - End with proposal

3. **"The AI that closes deals while you sleep"**
   - Framework explanation
   - Why it works (NEPQ without saying NEPQ)
   - Demo video

4. **"Every DM is now a potential $10K deal"**
   - Mindset shift content
   - How to treat DMs as sales opportunities
   - Tool reveal at end

### Demo Video Script

```
"Every day I get 20+ DMs from potential clients.
Used to take me hours to respond to all of them.
Now I just... [screenshot, drop, copy, paste]
That's it.

The AI tells me exactly what to say.
It tracks who's hot, who's cold.
And when someone's ready?
One click and my proposal is pre-written.

This is the AI sales assistant I wish I had 
when I was closing my first deals."
```

---

## ✅ SUMMARY

**What we're building:**
A "Leads" tab in PitchGenius that turns DM conversations into closed deals using AI-powered responses and automatic proposal generation.

**Why it matters:**
Transforms PitchGenius from a transactional tool into a daily-use sales assistant.

**Core workflow:**
Screenshot → AI response → Copy → Repeat → Generate Proposal

**Timeline:**
MVP in 1 week. Full feature set in 2 weeks.

**Let's fucking build it.** 🚀
