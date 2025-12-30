import { cn } from "@/lib/utils";

interface StyledProposalPreviewProps {
  content: string;
  clientName?: string;
  className?: string;
}

export function StyledProposalPreview({
  content,
  clientName,
  className,
}: StyledProposalPreviewProps) {
  const renderContent = () => {
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    let inSection = false;
    let sectionIndex = 0;

    const sectionColors = [
      "from-blue-500/10 to-blue-600/5 border-l-blue-500",
      "from-emerald-500/10 to-emerald-600/5 border-l-emerald-500",
      "from-purple-500/10 to-purple-600/5 border-l-purple-500",
      "from-amber-500/10 to-amber-600/5 border-l-amber-500",
      "from-rose-500/10 to-rose-600/5 border-l-rose-500",
    ];

    const renderFormattedText = (text: string, key: number) => {
      const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={`${key}-${i}`} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          return <em key={`${key}-${i}`}>{part.slice(1, -1)}</em>;
        }
        return part;
      });
    };

    lines.forEach((line, idx) => {
      // Main title (H1)
      if (line.startsWith("# ")) {
        elements.push(
          <div key={idx} className="mb-8 pb-6 border-b-2 border-primary/20">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              {line.slice(2)}
            </h1>
            {clientName && (
              <p className="mt-2 text-lg text-muted-foreground">
                Prepared for {clientName}
              </p>
            )}
          </div>
        );
        return;
      }

      // Section headers (H2) - styled with gradient backgrounds
      if (line.startsWith("## ")) {
        const colorClass = sectionColors[sectionIndex % sectionColors.length];
        sectionIndex++;
        elements.push(
          <div
            key={idx}
            className={`mt-8 mb-4 p-4 rounded-lg bg-gradient-to-r ${colorClass} border-l-4`}
          >
            <h2 className="text-xl font-semibold text-foreground">
              {line.slice(3)}
            </h2>
          </div>
        );
        return;
      }

      // Subsection headers (H3)
      if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={idx}
            className="text-lg font-semibold mt-6 mb-3 text-foreground flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {line.slice(4)}
          </h3>
        );
        return;
      }

      // Bullet points
      if (line.startsWith("- ") || line.startsWith("• ")) {
        elements.push(
          <div key={idx} className="flex items-start gap-3 ml-4 mb-2">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
            <span className="text-muted-foreground leading-relaxed">
              {renderFormattedText(line.slice(2), idx)}
            </span>
          </div>
        );
        return;
      }

      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        const match = line.match(/^(\d+)\.\s(.*)$/);
        if (match) {
          elements.push(
            <div key={idx} className="flex items-start gap-3 ml-4 mb-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium shrink-0">
                {match[1]}
              </span>
              <span className="text-muted-foreground leading-relaxed pt-0.5">
                {renderFormattedText(match[2], idx)}
              </span>
            </div>
          );
        }
        return;
      }

      // Check/cross marks
      if (line.startsWith("✓ ") || line.startsWith("✗ ")) {
        const isCheck = line.startsWith("✓");
        elements.push(
          <div key={idx} className="flex items-start gap-3 ml-4 mb-2">
            <span
              className={`flex items-center justify-center w-5 h-5 rounded-full shrink-0 ${
                isCheck
                  ? "bg-green-500/20 text-green-600"
                  : "bg-red-500/20 text-red-600"
              }`}
            >
              {isCheck ? "✓" : "✗"}
            </span>
            <span className="text-muted-foreground leading-relaxed">
              {renderFormattedText(line.slice(2), idx)}
            </span>
          </div>
        );
        return;
      }

      // Blockquotes
      if (line.startsWith("> ")) {
        elements.push(
          <blockquote
            key={idx}
            className="my-4 ml-4 pl-4 border-l-4 border-primary/40 bg-primary/5 py-3 pr-4 rounded-r-lg italic text-muted-foreground"
          >
            {renderFormattedText(line.slice(2), idx)}
          </blockquote>
        );
        return;
      }

      // Horizontal rules
      if (line.trim() === "---" || line.trim() === "***") {
        elements.push(
          <div key={idx} className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <div className="w-2 h-2 rounded-full bg-primary/30" />
            <div className="flex-1 h-px bg-border" />
          </div>
        );
        return;
      }

      // Empty lines
      if (line.trim() === "") {
        elements.push(<div key={idx} className="h-3" />);
        return;
      }

      // Regular paragraphs
      elements.push(
        <p key={idx} className="text-muted-foreground leading-relaxed mb-3">
          {renderFormattedText(line, idx)}
        </p>
      );
    });

    return elements;
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card shadow-lg overflow-hidden",
        className
      )}
    >
      {/* Header bar */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-primary/60" />
          <div className="w-3 h-3 rounded-full bg-primary/40" />
          <div className="w-3 h-3 rounded-full bg-primary/20" />
        </div>
      </div>

      {/* Content */}
      <div className="p-8 md:p-12">{renderContent()}</div>

      {/* Footer */}
      <div className="bg-muted/30 border-t border-border px-8 py-4">
        <p className="text-xs text-muted-foreground text-center">
          Generated with Proposal AI • Confidential
        </p>
      </div>
    </div>
  );
}
