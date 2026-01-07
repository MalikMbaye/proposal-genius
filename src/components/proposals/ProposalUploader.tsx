import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Loader2, FileText, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RedactionSummary {
  counts: {
    names: number;
    companies: number;
    emails: number;
    phones: number;
    addresses: number;
    amounts: number;
    urls: number;
    years: number;
  };
  total: number;
}

interface UploadedProposal {
  id: string;
  filename: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  redactedText?: string;
  summary?: RedactionSummary;
  error?: string;
}

export function ProposalUploader() {
  const [uploads, setUploads] = useState<UploadedProposal[]>([]);

  const processFile = async (file: File): Promise<string> => {
    // Read file as text (for .txt, .md) or as data URL for parsing
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        resolve(text);
      };
      reader.onerror = reject;
      
      // For text files, read as text
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        reader.readAsText(file);
      } else {
        // For other files, we'd need document parsing - for now just read as text
        reader.readAsText(file);
      }
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const uploadId = crypto.randomUUID();
      
      // Add to uploads list
      setUploads(prev => [...prev, {
        id: uploadId,
        filename: file.name,
        status: 'uploading',
      }]);

      try {
        // Get session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('Please log in to upload proposals');
        }

        // Read file content
        const proposalText = await processFile(file);
        
        if (proposalText.trim().length < 100) {
          throw new Error('Proposal text is too short. Please upload a complete proposal.');
        }

        // Create database record
        const { data: proposal, error: dbError } = await supabase
          .from('uploaded_proposals')
          .insert({
            user_id: session.user.id,
            original_filename: file.name,
            storage_path: `${session.user.id}/${uploadId}/${file.name}`,
            file_size: file.size,
            status: 'processing',
          })
          .select()
          .single();

        if (dbError) throw dbError;

        // Update status to processing
        setUploads(prev => prev.map(u => 
          u.id === uploadId ? { ...u, status: 'processing' } : u
        ));

        // Call redaction function
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/redact-proposal`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              proposalId: proposal.id,
              proposalText,
            }),
          }
        );

        const result = await response.json();

        if (result.error) {
          throw new Error(result.error);
        }

        // Update with results
        setUploads(prev => prev.map(u => 
          u.id === uploadId ? { 
            ...u, 
            status: 'completed',
            redactedText: result.redactedText,
            summary: result.summary,
          } : u
        ));

        toast.success(`${file.name} processed successfully!`);

      } catch (error) {
        console.error('Upload failed:', error);
        setUploads(prev => prev.map(u => 
          u.id === uploadId ? { 
            ...u, 
            status: 'error',
            error: error instanceof Error ? error.message : 'Upload failed',
          } : u
        ));
        toast.error(error instanceof Error ? error.message : 'Upload failed');
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const copyRedactedText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Upload & Redact Proposals
          </CardTitle>
          <CardDescription>
            Upload your proposals and we'll automatically detect and redact sensitive information 
            like names, emails, phone numbers, company names, and dollar amounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/30 hover:border-muted-foreground/50'
            )}
          >
            <input {...getInputProps()} />
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <p className="font-medium mb-1">
              {isDragActive ? 'Drop your proposal here' : 'Drop your proposal file here'}
            </p>
            <p className="text-sm text-muted-foreground">
              Supports .txt and .md files (max 5MB)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploads.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Processed Proposals</h3>
          {uploads.map((upload) => (
            <Card key={upload.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-muted p-2">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium truncate">{upload.filename}</span>
                      {upload.status === 'uploading' && (
                        <Badge variant="secondary" className="gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Uploading
                        </Badge>
                      )}
                      {upload.status === 'processing' && (
                        <Badge variant="secondary" className="gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Redacting...
                        </Badge>
                      )}
                      {upload.status === 'completed' && (
                        <Badge variant="default" className="gap-1 bg-green-600">
                          <CheckCircle className="h-3 w-3" />
                          Complete
                        </Badge>
                      )}
                      {upload.status === 'error' && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Error
                        </Badge>
                      )}
                    </div>

                    {upload.error && (
                      <p className="text-sm text-destructive">{upload.error}</p>
                    )}

                    {upload.summary && (
                      <div className="mb-3">
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium text-foreground">{upload.summary.total}</span> items redacted:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {upload.summary.counts.names > 0 && (
                            <Badge variant="outline">{upload.summary.counts.names} names</Badge>
                          )}
                          {upload.summary.counts.companies > 0 && (
                            <Badge variant="outline">{upload.summary.counts.companies} companies</Badge>
                          )}
                          {upload.summary.counts.emails > 0 && (
                            <Badge variant="outline">{upload.summary.counts.emails} emails</Badge>
                          )}
                          {upload.summary.counts.phones > 0 && (
                            <Badge variant="outline">{upload.summary.counts.phones} phones</Badge>
                          )}
                          {upload.summary.counts.amounts > 0 && (
                            <Badge variant="outline">{upload.summary.counts.amounts} amounts</Badge>
                          )}
                          {upload.summary.counts.urls > 0 && (
                            <Badge variant="outline">{upload.summary.counts.urls} URLs</Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {upload.redactedText && (
                      <div className="space-y-2">
                        <div className="bg-muted rounded-lg p-4 max-h-64 overflow-y-auto">
                          <pre className="text-sm whitespace-pre-wrap font-mono">
                            {upload.redactedText.slice(0, 1500)}
                            {upload.redactedText.length > 1500 && '...'}
                          </pre>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => copyRedactedText(upload.redactedText!)}
                        >
                          Copy Redacted Text
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
