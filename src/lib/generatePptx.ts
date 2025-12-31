import PptxGenJS from 'pptxgenjs';

interface SlideContent {
  title: string;
  subtitle?: string;
  bullets?: string[];
  content?: string;
}

export async function generatePptxFromPrompt(
  deckPrompt: string,
  clientName: string
): Promise<Blob> {
  const pptx = new PptxGenJS();
  
  // Set presentation properties
  pptx.author = 'PitchGenius';
  pptx.title = `${clientName} Proposal`;
  pptx.subject = 'Business Proposal';
  
  // Define master slide with clean styling
  pptx.defineSlideMaster({
    title: 'MAIN',
    background: { color: 'FFFFFF' },
    objects: [
      { rect: { x: 0, y: 0, w: '100%', h: 0.75, fill: { color: '1a1a2e' } } },
    ],
  });

  // Parse the deck prompt to extract slides
  const slides = parseDeckPromptToSlides(deckPrompt);
  
  slides.forEach((slideContent, index) => {
    const slide = pptx.addSlide({ masterName: 'MAIN' });
    
    // Title in header bar
    slide.addText(slideContent.title, {
      x: 0.5,
      y: 0.15,
      w: '90%',
      h: 0.5,
      fontSize: 20,
      bold: true,
      color: 'FFFFFF',
    });
    
    // Subtitle if exists
    if (slideContent.subtitle) {
      slide.addText(slideContent.subtitle, {
        x: 0.5,
        y: 1.0,
        w: '90%',
        fontSize: 14,
        color: '666666',
        italic: true,
      });
    }
    
    // Bullet points
    if (slideContent.bullets && slideContent.bullets.length > 0) {
      slide.addText(
        slideContent.bullets.map(b => ({ text: b, options: { bullet: true } })),
        {
          x: 0.5,
          y: slideContent.subtitle ? 1.5 : 1.2,
          w: '90%',
          h: 4,
          fontSize: 12,
          color: '333333',
          valign: 'top',
        }
      );
    }
    
    // Plain content
    if (slideContent.content && !slideContent.bullets?.length) {
      slide.addText(slideContent.content, {
        x: 0.5,
        y: slideContent.subtitle ? 1.5 : 1.2,
        w: '90%',
        h: 4,
        fontSize: 12,
        color: '333333',
        valign: 'top',
      });
    }
    
    // Slide number
    slide.addText(`${index + 1}`, {
      x: 9,
      y: 5.2,
      w: 0.5,
      fontSize: 10,
      color: '999999',
    });
  });
  
  // Generate blob
  const blob = await pptx.write({ outputType: 'blob' }) as Blob;
  return blob;
}

function parseDeckPromptToSlides(deckPrompt: string): SlideContent[] {
  const slides: SlideContent[] = [];
  
  // Try multiple parsing strategies based on common deck prompt formats
  
  // Strategy 1: Look for "Slide X:" or "**Slide X:" patterns
  const slidePatterns = [
    /(?:\*\*)?Slide\s+\d+[:\s]*([^\n*]+)(?:\*\*)?/gi,
    /(?:^|\n)#+\s*Slide\s+\d+[:\s]*([^\n]+)/gi,
    /(?:^|\n)\d+\.\s*\*\*([^*]+)\*\*/gi,
  ];
  
  let slideMatches: RegExpMatchArray | null = null;
  
  // Try splitting by slide markers
  const slideBlocks = deckPrompt.split(/(?=(?:\*\*)?Slide\s+\d+)/i).filter(block => block.trim());
  
  if (slideBlocks.length > 1) {
    // We found slide markers
    for (const slideText of slideBlocks) {
      const titleMatch = slideText.match(/(?:\*\*)?Slide\s+\d+[:\s–-]*([^*\n]+)/i);
      const title = titleMatch ? titleMatch[1].trim().replace(/\*+$/, '') : 'Slide';
      
      // Extract bullet points (lines starting with -, •, *, or numbered)
      const bulletMatches = slideText.match(/^[\s]*[-•*]\s+(.+)$/gm);
      const bullets = bulletMatches 
        ? bulletMatches.map(b => b.replace(/^[\s]*[-•*]\s+/, '').trim()).filter(b => b.length > 0)
        : [];
      
      // Extract content after removing title and bullets
      let remainingContent = slideText
        .replace(/(?:\*\*)?Slide\s+\d+[:\s–-]*[^*\n]+(?:\*\*)?/i, '')
        .replace(/^[\s]*[-•*]\s+.+$/gm, '')
        .replace(/\*\*/g, '')
        .trim();
      
      // Clean up any leftover formatting
      remainingContent = remainingContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
      
      if (title !== 'Slide' || bullets.length > 0 || remainingContent) {
        slides.push({
          title: title.substring(0, 100), // Limit title length
          bullets: bullets.length > 0 ? bullets.slice(0, 8) : undefined, // Max 8 bullets
          content: remainingContent && !bullets.length ? remainingContent.substring(0, 500) : undefined,
        });
      }
    }
  }
  
  // Strategy 2: If no slides found, try splitting by headers
  if (slides.length === 0) {
    const headerBlocks = deckPrompt.split(/(?=^#+\s)/m).filter(block => block.trim());
    
    for (const block of headerBlocks) {
      const headerMatch = block.match(/^#+\s*(.+)/);
      const title = headerMatch ? headerMatch[1].trim() : 'Slide';
      
      const bulletMatches = block.match(/^[\s]*[-•*]\s+(.+)$/gm);
      const bullets = bulletMatches 
        ? bulletMatches.map(b => b.replace(/^[\s]*[-•*]\s+/, '').trim())
        : [];
      
      if (title || bullets.length > 0) {
        slides.push({
          title: title.substring(0, 100),
          bullets: bullets.length > 0 ? bullets.slice(0, 8) : undefined,
        });
      }
    }
  }
  
  // Strategy 3: Fallback - create slides from paragraphs
  if (slides.length === 0) {
    const paragraphs = deckPrompt.split(/\n\n+/).filter(p => p.trim().length > 20);
    
    // Create title slide
    slides.push({
      title: 'Proposal Presentation',
      subtitle: 'Generated by PitchGenius',
    });
    
    // Create content slides from paragraphs
    paragraphs.slice(0, 10).forEach((para, i) => {
      const lines = para.split('\n').filter(l => l.trim());
      const firstLine = lines[0] || 'Section';
      const restLines = lines.slice(1);
      
      slides.push({
        title: firstLine.substring(0, 80).replace(/[*#]/g, '').trim(),
        bullets: restLines.length > 0 ? restLines.slice(0, 6) : undefined,
        content: restLines.length === 0 ? para.substring(0, 400) : undefined,
      });
    });
  }
  
  // Ensure we have at least one slide
  if (slides.length === 0) {
    slides.push({
      title: 'Proposal',
      content: deckPrompt.substring(0, 500),
    });
  }
  
  return slides;
}
