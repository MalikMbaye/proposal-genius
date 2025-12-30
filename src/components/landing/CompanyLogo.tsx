interface CompanyLogoProps {
  name: string;
  className?: string;
}

const logoStyles: Record<string, { color: string; font: string }> = {
  "Facebook": { color: "#1877F2", font: "font-bold" },
  "LinkedIn": { color: "#0A66C2", font: "font-bold" },
  "Lyft": { color: "#FF00BF", font: "font-bold" },
  "Google": { color: "#4285F4", font: "font-medium" },
  "Bain & Company": { color: "#CC0000", font: "font-bold" },
  "Forbes": { color: "#B5A36A", font: "font-serif italic font-bold" },
  "TechCrunch": { color: "#0A9E01", font: "font-bold" },
  "Fast Company": { color: "#FFFFFF", font: "font-black uppercase tracking-tight" },
  "Howard University": { color: "#003DA5", font: "font-bold" },
  "McKinsey & Company": { color: "#1E4A8D", font: "font-medium" },
  "Goldman Sachs": { color: "#7399C6", font: "font-medium" },
  "Deloitte": { color: "#86BC25", font: "font-bold" },
};

export function CompanyLogo({ name, className = "" }: CompanyLogoProps) {
  const style = logoStyles[name] || { color: "#FFFFFF", font: "font-medium" };
  
  return (
    <span 
      className={`${style.font} text-sm tracking-wide transition-opacity hover:opacity-80 ${className}`}
      style={{ color: style.color }}
    >
      {name}
    </span>
  );
}
