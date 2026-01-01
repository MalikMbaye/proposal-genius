import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { ArrowLeft, Copy, Check, Loader2, Phone, Printer } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

export default function CallScript() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const leadId = searchParams.get('leadId');
  
  const [script, setScript] = useState<string | null>(null);
  const [leadName, setLeadName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (leadId) {
      generateScript();
    } else {
      setError('No lead specified');
      setLoading(false);
    }
  }, [leadId]);

  const generateScript = async () => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
          <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4">
            <Link to="/">
              <Logo />
            </Link>
          </div>
        </header>
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

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
          <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4">
            <Link to="/">
              <Logo />
            </Link>
          </div>
        </header>
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
              <Button onClick={generateScript}>
                Try Again
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-10 print:hidden">
        <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/leads?selected=${leadId}`)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Lead
            </Button>
          </div>
          <Link to="/">
            <Logo />
          </Link>
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
      </header>

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
            {script || ''}
          </ReactMarkdown>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-center gap-4 print:hidden">
          <Button variant="outline" onClick={() => navigate(`/leads?selected=${leadId}`)}>
            Back to Lead
          </Button>
          <Button onClick={generateScript} variant="secondary">
            Regenerate Script
          </Button>
        </div>
      </main>
    </div>
  );
}
