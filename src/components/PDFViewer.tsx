import { useState, useCallback, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, AlertCircle, RotateCw, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  url: string;
  className?: string;
}

export function PDFViewer({ url, className = '' }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Auto-adjust scale for mobile
  useEffect(() => {
    if (isMobile) {
      setScale(isLandscape ? 0.8 : 0.5);
    } else {
      setScale(1.0);
    }
  }, [isMobile, isLandscape]);

  // Handle orientation change
  useEffect(() => {
    const handleOrientationChange = () => {
      const isLandscapeMode = window.innerWidth > window.innerHeight;
      setIsLandscape(isLandscapeMode);
    };

    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDF load error:', error);
    setLoading(false);
    setError('Failed to load PDF. The file may not be ready yet or the URL may have expired.');
  }, []);

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 2.5));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.3));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-6 md:p-12 bg-card rounded-xl border border-border ${className}`}>
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-destructive" />
        </div>
        <h3 className="text-base md:text-lg font-semibold mb-2 text-center">PDF Preview Unavailable</h3>
        <p className="text-muted-foreground text-center max-w-md mb-4 text-sm md:text-base px-2">{error}</p>
        <Button variant="outline" onClick={() => window.open(url, '_blank')}>
          Open PDF in New Tab
        </Button>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col bg-card rounded-xl border border-border overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''} ${className}`}
    >
      {/* PDF Controls - Mobile optimized */}
      <div className="flex items-center justify-between px-2 md:px-4 py-2 md:py-3 border-b border-border bg-muted/30 gap-2">
        {/* Page Navigation */}
        <div className="flex items-center gap-1 md:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1 || loading}
            className="h-8 w-8 md:h-9 md:w-auto p-0 md:px-3"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs md:text-sm font-medium min-w-[60px] md:min-w-[100px] text-center">
            {loading ? '...' : `${pageNumber}/${numPages}`}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={pageNumber >= (numPages || 1) || loading}
            className="h-8 w-8 md:h-9 md:w-auto p-0 md:px-3"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 md:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={zoomOut}
            disabled={scale <= 0.3 || loading}
            className="h-8 w-8 p-0"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs md:text-sm font-medium min-w-[40px] md:min-w-[60px] text-center hidden sm:block">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={zoomIn}
            disabled={scale >= 2.5 || loading}
            className="h-8 w-8 p-0"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          {/* Mobile: Rotate hint */}
          {isMobile && !isLandscape && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
              <RotateCw className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Rotate</span>
            </div>
          )}
          
          {/* Fullscreen toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="h-8 w-8 p-0 ml-1"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* PDF Document */}
      <div className={`flex-1 overflow-auto p-2 md:p-4 flex justify-center bg-muted/10 ${isFullscreen ? 'items-center' : ''}`}>
        {loading && (
          <div className="flex flex-col items-center justify-center py-8 md:py-12">
            <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Loading PDF...</p>
          </div>
        )}
        
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          className="flex justify-center"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-lg rounded"
            loading={
              <div className="flex items-center justify-center py-8 md:py-12">
                <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin text-muted-foreground" />
              </div>
            }
          />
        </Document>
      </div>
      
      {/* Mobile hint bar */}
      {isMobile && !isLandscape && !isFullscreen && (
        <div className="px-3 py-2 bg-muted/50 border-t border-border text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <RotateCw className="h-3 w-3" />
            Rotate your phone for a better view
          </p>
        </div>
      )}
    </div>
  );
}