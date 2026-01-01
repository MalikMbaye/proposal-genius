import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/Navbar';
import { ArrowLeft, Copy, Check, Loader2, Phone, Printer, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

export default function CallScript() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const leadId = searchParams.get('leadId');
  
  const [script, setScript] = useState<string | null>(null);
  const [leadName, setLeadName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // For generic script generation (no lead)
  const [prospectName, setProspectName] = useState('');
  const [prospectContext, setProspectContext] = useState('');

  useEffect(() => {
    if (leadId) {
      generateFromLead();
    }
  }, [leadId]);

  const generateFromLead = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      const response = await supabase.functions.invoke('generate-call-script', {
        body: { leadId },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to generate script');
      }

      const data = response.data;
      if (data.error) {
        throw new Error(data.error);
      }

      setScript(data.script);
      setLeadName(data.leadName);
    } catch (err) {
      console.error('Error generating call script:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate script');
      toast.error('Failed to generate call script');
    } finally {
      setLoading(false);
    }
  };

  const generateGenericScript = async () => {
    if (!prospectName.trim()) {
      toast.error('Please enter a prospect name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      const response = await supabase.functions.invoke('generate-call-script', {
        body: { 
          prospectName: prospectName.trim(),
          prospectContext: prospectContext.trim(),
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to generate script');
      }

      const data = response.data;
      if (data.error) {
        throw new Error(data.error);
      }

      setScript(data.script);
      setLeadName(data.leadName || prospectName);
    } catch (err) {
      console.error('Error generating call script:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate script');
      toast.error('Failed to generate call script');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!script) return;
    await navigator.clipboard.writeText(script);
    setCopied(true);
    toast.success('Script copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setScript(null);
    setLeadName('');
    setError(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Generating Call Script</h2>
            <p className="text-muted-foreground">
              Creating a personalized NEPQ-style script...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Script generated - show it
  if (script) {
    return (
      <div className="min-h-screen bg-background">
        <div className="print:hidden">
          <Navbar />
        </div>

        {/* Sub-header with actions */}
        <div className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-16 z-10 print:hidden">
          <div className="container mx-auto flex h-12 items-center justify-between px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => leadId ? navigate(`/leads`) : handleReset()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {leadId ? 'Back to Leads' : 'New Script'}
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button size="sm" onClick={handleCopy} className="gap-2">
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Title */}
          <div className="mb-8 print:mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Call Script</h1>
                <p className="text-muted-foreground">
                  Prepared for call with {leadName}
                </p>
              </div>
            </div>
          </div>

          {/* Script Content */}
          <div className="prose prose-invert max-w-none bg-card border border-border rounded-xl p-6 md:p-8 print:border-none print:p-0">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="text-xl font-bold text-primary mt-8 mb-4 first:mt-0 border-b border-border pb-2">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold mt-6 mb-3">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 leading-relaxed">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-4 space-y-2">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="ml-4">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-foreground/90">
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => (
                  <strong className="text-foreground font-semibold">{children}</strong>
                ),
              }}
            >
              {script}
            </ReactMarkdown>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex justify-center gap-4 print:hidden">
            <Button variant="outline" onClick={() => leadId ? navigate('/leads') : handleReset()}>
              {leadId ? 'Back to Leads' : 'Generate Another'}
            </Button>
            <Button onClick={leadId ? generateFromLead : generateGenericScript} variant="secondary">
              Regenerate Script
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Error state with retry
  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Generation Failed</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate('/leads')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Leads
              </Button>
              <Button onClick={leadId ? generateFromLead : handleReset}>
                Try Again
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Default: Generic script generator form (no lead selected)
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Phone className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Generate Call Script</h1>
          <p className="text-muted-foreground">
            Create a personalized NEPQ-style phone script for your next sales call
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          {/* Prospect Name */}
          <div>
            <Label htmlFor="prospectName" className="text-base font-semibold mb-2 block">
              Prospect Name
            </Label>
            <Input
              id="prospectName"
              value={prospectName}
              onChange={(e) => setProspectName(e.target.value)}
              placeholder="e.g., Sarah from BrightTools"
              className="bg-background"
            />
          </div>

          {/* Context */}
          <div>
            <Label htmlFor="context" className="text-base font-semibold mb-2 block">
              What do you know about them? (optional)
            </Label>
            <Textarea
              id="context"
              value={prospectContext}
              onChange={(e) => setProspectContext(e.target.value)}
              placeholder={`Example:
• Marketing SaaS company at $75K MRR
• Growth has stalled, CAC is too high
• Tried agencies before, got burned
• Looking to hit $200K MRR by Q3
• Budget around $15-40K`}
              className="min-h-[160px] resize-none bg-background"
            />
            <p className="mt-2 text-sm text-muted-foreground">
              The more context you provide, the more personalized your script will be
            </p>
          </div>

          <Button
            onClick={generateGenericScript}
            disabled={!prospectName.trim()}
            className="w-full gap-2"
            size="lg"
          >
            <Sparkles className="h-5 w-5" />
            Generate Call Script
          </Button>
        </div>

        {/* Tip */}
        <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Pro tip:</strong> For even better scripts, 
            use the <Link to="/leads" className="text-primary hover:underline">Leads</Link> feature 
            to track your DM conversations. The AI will use your full conversation history to 
            create highly personalized scripts.
          </p>
        </div>
      </main>
    </div>
  );
}
