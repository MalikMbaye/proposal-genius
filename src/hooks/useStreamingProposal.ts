import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StreamingState {
  isStreaming: boolean;
  content: string;
  charCount: number;
  progress: number; // 0-100
  error: string | null;
}

interface StreamingOptions {
  clientContext: string;
  background: string;
  caseStudies?: string;
  length: string;
  pricing: {
    strategy: string;
    ai: string;
    managed: string;
  };
  onProgress?: (progress: number, charCount: number) => void;
  onComplete?: (content: string) => void;
  onError?: (error: string) => void;
}

export function useStreamingProposal() {
  const [state, setState] = useState<StreamingState>({
    isStreaming: false,
    content: '',
    charCount: 0,
    progress: 0,
    error: null,
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const startStreaming = useCallback(async (options: StreamingOptions) => {
    const { 
      clientContext, 
      background, 
      caseStudies = '', 
      length, 
      pricing,
      onProgress,
      onComplete,
      onError 
    } = options;

    // Reset state
    setState({
      isStreaming: true,
      content: '',
      charCount: 0,
      progress: 0,
      error: null,
    });

    abortControllerRef.current = new AbortController();

    try {
      // Get the Supabase URL from the client
      const supabaseUrl = (supabase as any).supabaseUrl || 
        import.meta.env.VITE_SUPABASE_URL;
      
      const response = await fetch(`${supabaseUrl}/functions/v1/generate-proposal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          clientContext,
          background,
          caseStudies,
          length,
          pricing,
          proposalOnly: true,
          stream: true,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let buffer = '';
      
      // Estimate total chars based on proposal length
      const estimatedChars: Record<string, number> = {
        short: 5000,
        medium: 8000,
        long: 12000,
        detailed: 18000,
      };
      const targetChars = estimatedChars[length] || 8000;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'delta' && data.text) {
                accumulatedContent += data.text;
                const charCount = accumulatedContent.length;
                const progress = Math.min(95, Math.round((charCount / targetChars) * 100));
                
                setState(prev => ({
                  ...prev,
                  content: accumulatedContent,
                  charCount,
                  progress,
                }));
                
                onProgress?.(progress, charCount);
              } else if (data.type === 'done') {
                setState(prev => ({
                  ...prev,
                  isStreaming: false,
                  progress: 100,
                }));
                onComplete?.(accumulatedContent);
              }
            } catch (e) {
              // Skip unparseable lines
            }
          }
        }
      }

      // Final update if stream ended without explicit done
      if (state.isStreaming) {
        setState(prev => ({
          ...prev,
          isStreaming: false,
          progress: 100,
        }));
        onComplete?.(accumulatedContent);
      }

    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        console.log('Stream aborted');
        return;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({
        ...prev,
        isStreaming: false,
        error: errorMessage,
      }));
      onError?.(errorMessage);
    }
  }, []);

  const cancelStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
    setState(prev => ({
      ...prev,
      isStreaming: false,
    }));
  }, []);

  return {
    ...state,
    startStreaming,
    cancelStreaming,
  };
}
