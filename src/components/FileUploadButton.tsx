import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Loader2, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface FileUploadButtonProps {
  onTextExtracted: (text: string) => void;
  disabled?: boolean;
}

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
];

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt", ".md"];

export function FileUploadButton({ onTextExtracted, disabled }: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    const isValidType = ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(extension);
    
    if (!isValidType) {
      toast({
        title: "Unsupported file type",
        description: "Please upload a PDF, Word document, or text file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setFileName(file.name);

    try {
      // For text files, read directly
      if (file.type === "text/plain" || file.type === "text/markdown" || extension === ".txt" || extension === ".md") {
        const text = await file.text();
        onTextExtracted(text);
        toast({
          title: "File imported",
          description: `Content from ${file.name} has been added.`,
        });
      } else {
        // For PDFs and Word docs, send to edge function
        const base64 = await fileToBase64(file);
        
        const { data, error } = await supabase.functions.invoke("parse-document", {
          body: {
            fileData: base64,
            fileName: file.name,
            mimeType: file.type,
          },
        });

        if (error) {
          throw new Error(error.message || "Failed to parse document");
        }

        if (data?.text) {
          onTextExtracted(data.text);
          toast({
            title: "File imported",
            description: `Content from ${file.name} has been extracted and added.`,
          });
        } else {
          throw new Error("No text could be extracted from the document");
        }
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Could not extract text from the file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_EXTENSIONS.join(",")}
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={disabled || isUploading}
        className="gap-2"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Importing...
          </>
        ) : (
          <>
            <Paperclip className="h-4 w-4" />
            Upload file
          </>
        )}
      </Button>
    </>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
