import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';
import { Upload, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { DMUpgradeModal } from './DMUpgradeModal';

interface ScreenshotDropZoneProps {
  leadId?: string;
  onAnalyzed: (result: AnalysisResult) => void;
  className?: string;
  compact?: boolean;
}

export interface AnalysisResult {
  success: boolean;
  leadId: string;
  analysis: DMAnalysis;
  isNewLead: boolean;
}

export interface DMAnalysis {
  prospect_name: string;
  platform: string;
  conversation_text: string;
  qualification_score: number;
  heat_level: 'cold' | 'warm' | 'hot' | 'qualified';
  current_stage: 'Opening' | 'Qualifying' | 'Building Urgency' | 'Pitching' | 'Booking';
  response_options: {
    A: { type: string; message: string };
    B: { type: string; message: string };
    C: { type: string; message: string };
  };
  recommended: 'A' | 'B' | 'C';
  reasoning: string;
  extracted_context: {
    goals: string | null;
    pain_points: string[] | null;
    budget_signals: string | null;
    timeline_signals: string | null;
  };
  next_action: string;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

export function ScreenshotDropZone({ leadId, onAnalyzed, className, compact = false }: ScreenshotDropZoneProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const { 
    dm_analyses_used, 
    dm_analyses_limit, 
    dm_tier,
    checkSubscription 
  } = useSubscription();

  const isUnlimited = dm_tier === 'unlimited';
  const isAtLimit = dm_analyses_used >= dm_analyses_limit && !isUnlimited;

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Check if user is at their limit BEFORE analyzing
    if (isAtLimit) {
      setShowUpgradeModal(true);
      return;
    }

    setAnalyzing(true);

    try {
      // Convert to base64
      const base64 = await fileToBase64(file);

      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Please log in to analyze screenshots');
      }

      // Call edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-screenshot`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            screenshot: base64,
            leadId: leadId || null,
          }),
        }
      );

      const result = await response.json();

      if (result.error) {
        // Check if it's a limit error from the backend
        if (result.error.includes('limit') || result.error.includes('upgrade')) {
          setShowUpgradeModal(true);
          return;
        }
        throw new Error(result.error);
      }

      // Refresh subscription to update usage count
      await checkSubscription();

      toast.success(result.isNewLead ? 'New lead created!' : 'Screenshot analyzed!');
      onAnalyzed(result);

    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze screenshot');
    } finally {
      setAnalyzing(false);
    }
  }, [leadId, onAnalyzed, isAtLimit, checkSubscription]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    disabled: analyzing,
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-200',
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-muted-foreground/50',
          analyzing ? 'opacity-50 cursor-wait' : '',
          compact ? 'p-4' : 'p-8',
          className
        )}
      >
        <input {...getInputProps()} />
        
        {analyzing ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Analyzing screenshot...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className={cn("text-muted-foreground", compact ? "h-6 w-6" : "h-10 w-10")} />
            <p className="font-medium">
              {isDragActive ? 'Drop screenshot here' : compact ? 'Drop next screenshot' : 'Drop your DM screenshot here'}
            </p>
            {!compact && <p className="text-sm text-muted-foreground">or click to upload</p>}
          </div>
        )}
      </div>

      <DMUpgradeModal 
        open={showUpgradeModal} 
        onOpenChange={setShowUpgradeModal} 
      />
    </>
  );
}
