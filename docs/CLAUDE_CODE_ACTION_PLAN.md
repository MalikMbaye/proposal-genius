# Claude Code Action Plan: GenSpark Integration & UX Overhaul

## Summary of Requirements

**Primary Goal**: Replace Gamma with GenSpark AI Slides for deck generation, with real-time progress visualization and browser automation.

**Secondary Goals**: Fix critical UX issues in the proposal generation flow.

---

## Part 1: GenSpark Integration (Priority 1)

### Context
- GenSpark AI Slides produces significantly better decks than Gamma
- Need browser automation since GenSpark has no public API
- Must show real-time progress to user
- Must render final deck back in the app

### Recommended Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        LOVABLE APP                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │ Generate.tsx │───▶│ Edge Function│───▶│ Preview.tsx  │       │
│  │ (trigger)    │    │ (webhook)    │    │ (display)    │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│         │                   ▲                    ▲               │
│         │                   │                    │               │
│         ▼                   │                    │               │
│  ┌──────────────────────────┴────────────────────┴──────┐       │
│  │              Real-time Status Updates (SSE)           │       │
│  └───────────────────────────▲──────────────────────────┘       │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │     n8n Workflow     │
                    │  (Browser Automation)│
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   GenSpark Website   │
                    │   (AI Slides)        │
                    └─────────────────────┘
```

### Step 1: Explore GenSpark Capabilities

Before building, investigate GenSpark to understand:

```bash
# Questions to answer:
1. What is the exact URL for AI Slides? (genspark.ai/slides or similar)
2. What inputs does it accept? (text prompt, file upload, etc.)
3. What outputs are available? (embed URL, PDF export, image export)
4. How long does generation typically take?
5. Can you get a shareable/embed link after generation?
6. Is there any undocumented API or network requests we can intercept?
```

**Action**: Use browser dev tools to inspect network requests when generating a slide deck manually. Document all API endpoints, request/response formats.

### Step 2: Design the n8n Workflow

Create an n8n workflow with these nodes:

```
[Webhook Trigger] 
    │
    ▼
[Set Variables] ─── Extract: prompt, callbackUrl, sessionId
    │
    ▼
[Browser Automation - Puppeteer/Playwright]
    │
    ├── Navigate to GenSpark AI Slides
    ├── Input the prompt
    ├── Click generate
    ├── Wait for completion (with status polling)
    ├── Extract result URL/embed code
    │
    ▼
[HTTP Request] ─── POST to callbackUrl with results
```

**Key n8n Nodes to Use**:
- `n8n-nodes-base.webhook` - Receive generation requests
- `n8n-nodes-puppeteer` or `@nicklasmaier/n8n-nodes-puppeteer-extended` - Browser automation
- `n8n-nodes-base.httpRequest` - Send results back

### Step 3: Edge Function (Supabase)

Create `supabase/functions/generate-deck-genspark/index.ts`:

```typescript
// Pseudocode structure
serve(async (req) => {
  const { prompt, proposalId } = await req.json();
  
  // 1. Create a pending deck record in database
  // 2. Call n8n webhook with prompt + callback URL
  // 3. Return immediately with status "generating"
  
  // The n8n workflow will call back when complete
});
```

Create `supabase/functions/genspark-callback/index.ts`:

```typescript
// Receives results from n8n
serve(async (req) => {
  const { sessionId, embedUrl, status, error } = await req.json();
  
  // 1. Update database with results
  // 2. Could also push to Supabase Realtime for live updates
});
```

### Step 4: Real-time Progress UI

Options for showing progress:

**Option A: Polling (Simpler)**
```typescript
// Poll every 2 seconds for status updates
useEffect(() => {
  const interval = setInterval(async () => {
    const status = await checkDeckStatus(proposalId);
    if (status.complete) clearInterval(interval);
    setProgress(status);
  }, 2000);
}, []);
```

**Option B: Supabase Realtime (Better UX)**
```typescript
// Subscribe to deck_generations table changes
supabase
  .channel('deck-status')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'deck_generations',
    filter: `proposal_id=eq.${proposalId}`
  }, (payload) => {
    setProgress(payload.new);
  })
  .subscribe();
```

### Step 5: Preview Rendering

Once GenSpark generates the deck, display it:

```typescript
// If GenSpark provides an embed URL
<iframe 
  src={`https://genspark.ai/embed/${deckId}`}
  className="w-full h-[600px]"
/>

// If only PDF/images available
<embed 
  src={pdfUrl} 
  type="application/pdf"
  className="w-full h-[600px]"
/>
```

---

## Part 2: UX Fixes (Priority 2)

### Issue 1: Two-Step Deck Generation is Confusing

**Current Flow**:
1. Generate proposal → includes "deck prompt"
2. Manually click "Generate Deck" 
3. Wait again

**Recommended Flow**:
1. Generate proposal (streaming, shows progress)
2. Automatically queue deck generation in background
3. Show unified progress: "Proposal ✓ → Deck generating..."

**Implementation**:
```typescript
// In Generate.tsx, after proposal completes:
useEffect(() => {
  if (deliverables.proposal && !deckData.isGenerating) {
    // Auto-trigger deck generation
    generateDeck(deliverables.deckPrompt);
  }
}, [deliverables.proposal]);
```

### Issue 2: Deck Prompt Below Deck Output

**Fix**: Reorder the Preview.tsx layout:
1. Proposal (top)
2. Deck Output/Preview (middle) 
3. Deck Prompt (collapsed accordion, bottom - it's a technical artifact)

Or better: **Hide the deck prompt entirely** from users - it's an internal input, not a deliverable.

### Issue 3: No Profile Tab

**Add to Navbar**:
```typescript
<NavLink to="/profile" icon={User}>Profile</NavLink>
```

**Profile page should include**:
- Company name (editable)
- Email
- Saved case studies
- Default pricing ranges

### Issue 4: No File Download Options

**Add to Preview.tsx**:
```typescript
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button>Download <ChevronDown /></Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={() => downloadAs('pdf')}>
      PDF
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => downloadAs('docx')}>
      Word (.docx)
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => downloadAs('md')}>
      Markdown
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Dependencies needed**:
- `docx` - Generate Word documents
- Already have `jspdf` for PDF

### Issue 5: No Way to Edit Generated Content

**Add inline editing**:
```typescript
// Toggle between view and edit mode
const [isEditing, setIsEditing] = useState(false);

{isEditing ? (
  <Textarea 
    value={proposal} 
    onChange={(e) => setProposal(e.target.value)}
    className="min-h-[400px]"
  />
) : (
  <div className="prose">{renderMarkdown(proposal)}</div>
)}

<Button onClick={() => setIsEditing(!isEditing)}>
  {isEditing ? 'Save' : 'Edit'}
</Button>
```

---

## Part 3: Database Schema Updates

If using Supabase Realtime for progress:

```sql
-- Add deck generation tracking
CREATE TABLE public.deck_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id),
  status TEXT DEFAULT 'pending', -- pending, generating, completed, failed
  progress_message TEXT,
  embed_url TEXT,
  pdf_url TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE deck_generations;
```

---

## Execution Order

### Phase 1: GenSpark Research (Day 1)
- [ ] Manually use GenSpark AI Slides
- [ ] Document all network requests
- [ ] Identify embed/export options
- [ ] Determine if browser automation is the only path

### Phase 2: n8n Workflow (Day 1-2)
- [ ] Set up n8n instance (cloud or self-hosted)
- [ ] Install Puppeteer/Playwright nodes
- [ ] Build and test the automation workflow
- [ ] Create webhook endpoints

### Phase 3: Backend Integration (Day 2)
- [ ] Create database table for tracking
- [ ] Build edge functions for triggering and callbacks
- [ ] Test end-to-end flow

### Phase 4: Frontend Updates (Day 2-3)
- [ ] Add real-time progress UI
- [ ] Integrate GenSpark preview/embed
- [ ] Unify the generation flow (auto-trigger deck)
- [ ] Add download options
- [ ] Add inline editing
- [ ] Fix layout ordering

### Phase 5: Polish (Day 3)
- [ ] Error handling and retry logic
- [ ] Loading states and skeletons
- [ ] Profile page completion
- [ ] Remove Gamma code (or keep as fallback)

---

## Questions to Answer Before Starting

1. **n8n Setup**: Do you have an n8n instance? Cloud or self-hosted?
2. **GenSpark Account**: Do you have a GenSpark account for testing?
3. **Fallback Strategy**: Keep Gamma as backup option, or fully replace?
4. **Export Priority**: PDF viewer most important, or embed view?
5. **Edit Scope**: Edit proposal text only, or also regenerate sections?

---

## Files to Modify

```
src/
├── pages/
│   ├── Generate.tsx        # Unify flow, auto-trigger deck
│   ├── Preview.tsx         # Reorder, add downloads, add editing
│   └── Profile.tsx         # Complete the profile page
├── components/
│   ├── GeneratingLoader.tsx # Add deck generation progress
│   ├── DeckPreview.tsx     # NEW: GenSpark embed/PDF viewer
│   ├── DownloadMenu.tsx    # NEW: Download options dropdown
│   └── Navbar.tsx          # Add Profile link
├── hooks/
│   ├── useGenSparkDeck.ts  # NEW: GenSpark generation hook
│   └── useDeckStatus.ts    # NEW: Realtime status subscription
└── lib/
    └── exports.ts          # NEW: PDF/DOCX generation utilities

supabase/
├── functions/
│   ├── generate-deck-genspark/index.ts  # NEW
│   └── genspark-callback/index.ts       # NEW
└── config.toml             # Add new functions
```

---

## Success Criteria

1. ✅ Can trigger GenSpark deck generation from the app
2. ✅ See real-time progress while generating
3. ✅ View the completed deck in an embedded preview
4. ✅ Download as PDF and/or DOCX
5. ✅ One-click flow from proposal input to deck output
6. ✅ Can edit generated proposal text
7. ✅ Profile page functional with saved settings
