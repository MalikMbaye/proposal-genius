import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, BookOpen, Lock, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface LibraryItem {
  id: string;
  title: string;
  description: string | null;
  pdf_path: string;
  page_count: number;
}

interface Annotation {
  id: string;
  page_number: number;
  title: string | null;
  content: string;
}

interface SecureProposalViewerProps {
  item: LibraryItem;
  onClose: () => void;
}

export function SecureProposalViewer({ item, onClose }: SecureProposalViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageImageUrl, setPageImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [generating, setGenerating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent screenshots and right-click
  useEffect(() => {
    const preventScreenshot = (e: KeyboardEvent) => {
      // Block PrintScreen, Cmd+Shift+3/4 (Mac), etc.
      if (
        e.key === "PrintScreen" ||
        (e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4")) ||
        (e.ctrlKey && e.key === "p")
      ) {
        e.preventDefault();
      }
    };

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const preventDrag = (e: DragEvent) => {
      e.preventDefault();
    };

    document.addEventListener("keydown", preventScreenshot);
    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("dragstart", preventDrag);

    return () => {
      document.removeEventListener("keydown", preventScreenshot);
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("dragstart", preventDrag);
    };
  }, []);

  // Fetch annotations
  useEffect(() => {
    const fetchAnnotations = async () => {
      const { data } = await supabase
        .from("library_annotations")
        .select("*")
        .eq("library_item_id", item.id)
        .order("page_number", { ascending: true });

      if (data) {
        setAnnotations(data as Annotation[]);
      }
    };

    fetchAnnotations();
  }, [item.id]);

  // Load page image
  useEffect(() => {
    const loadPage = async () => {
      setLoading(true);
      
      // Get signed URL for the page image
      // Assuming pages are stored as: {pdf_path}/page-{n}.png
      const pagePath = `${item.pdf_path}/page-${currentPage}.png`;
      
      const { data } = await supabase.storage
        .from("library-pdfs")
        .createSignedUrl(pagePath, 300); // 5 min expiry

      if (data?.signedUrl) {
        setPageImageUrl(data.signedUrl);
      }
      setLoading(false);
    };

    loadPage();
  }, [item.pdf_path, currentPage]);

  const currentAnnotation = annotations.find((a) => a.page_number === currentPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= item.page_count) {
      setCurrentPage(page);
    }
  };

  const handleGenerateAnnotation = async () => {
    if (!pageImageUrl) {
      toast.error("Page image not loaded yet");
      return;
    }

    setGenerating(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase.functions.invoke("generate-annotation", {
        body: {
          library_item_id: item.id,
          page_number: currentPage,
          image_url: pageImageUrl,
        },
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.annotation) {
        // Add or update annotation in local state
        setAnnotations((prev) => {
          const existing = prev.findIndex((a) => a.page_number === currentPage);
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = data.annotation;
            return updated;
          }
          return [...prev, data.annotation].sort((a, b) => a.page_number - b.page_number);
        });
        toast.success("Annotation generated!");
      }
    } catch (err) {
      console.error("Error generating annotation:", err);
      const message = err instanceof Error ? err.message : "Failed to generate annotation";
      toast.error(message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-background"
      style={{ userSelect: "none" }}
    >
      {/* Header */}
      <div className="h-16 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-semibold">{item.title}</h1>
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {item.page_count}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Lock className="h-4 w-4" />
          Protected Content
        </div>
      </div>

      {/* Main content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* PDF Viewer */}
        <div className="flex-1 flex flex-col bg-muted/30">
          {/* Page navigation */}
          <div className="flex items-center justify-center gap-4 p-4 border-b">
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                className="w-16 text-center bg-background border rounded px-2 py-1"
                min={1}
                max={item.page_count}
              />
              <span className="text-muted-foreground">/ {item.page_count}</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === item.page_count}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Page display */}
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : pageImageUrl ? (
              <img
                src={pageImageUrl}
                alt={`Page ${currentPage}`}
                className="max-h-full max-w-full shadow-xl rounded-lg pointer-events-none"
                style={{ 
                  userSelect: "none",
                  WebkitUserDrag: "none",
                } as React.CSSProperties}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <p>Page not available</p>
              </div>
            )}
          </div>
        </div>

        {/* Annotations Panel */}
        <div className="w-96 border-l bg-card">
          <div className="p-4 border-b">
            <h2 className="font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Annotations
            </h2>
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="p-4">
              {currentAnnotation ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {currentAnnotation.title && (
                      <h3 className="font-medium text-lg">{currentAnnotation.title}</h3>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleGenerateAnnotation}
                      disabled={generating || !pageImageUrl}
                      className="gap-1 text-xs"
                    >
                      {generating ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3 w-3" />
                      )}
                      Regenerate
                    </Button>
                  </div>
                  <div className="prose prose-sm prose-invert max-w-none">
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {currentAnnotation.content}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-8 w-8 mx-auto mb-3 opacity-50 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">No annotations for this page</p>
                  <Button
                    onClick={handleGenerateAnnotation}
                    disabled={generating || !pageImageUrl}
                    size="sm"
                    className="gap-2"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Page thumbnails / navigation */}
              {annotations.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    Annotated Pages
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {annotations.map((ann) => (
                      <Button
                        key={ann.id}
                        variant={currentPage === ann.page_number ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(ann.page_number)}
                      >
                        {ann.page_number}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
