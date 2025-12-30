import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileData, fileName, mimeType } = await req.json();

    if (!fileData) {
      return new Response(
        JSON.stringify({ error: "No file data provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Parsing document: ${fileName} (${mimeType})`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For PDFs and Word docs, we'll use the AI to extract and summarize
    // Since we can't directly parse complex documents, we'll ask AI to help
    // by treating the base64 as context
    
    // Decode base64 to get raw bytes for text extraction attempt
    let extractedText = "";
    
    try {
      const binaryString = atob(fileData);
      
      // Try to extract readable text from the binary
      // This works well for PDFs that have embedded text
      const textParts: string[] = [];
      let currentText = "";
      
      for (let i = 0; i < binaryString.length; i++) {
        const charCode = binaryString.charCodeAt(i);
        // Check if it's a printable ASCII character or common whitespace
        if ((charCode >= 32 && charCode <= 126) || charCode === 10 || charCode === 13 || charCode === 9) {
          currentText += binaryString[i];
        } else {
          if (currentText.length > 20) {
            textParts.push(currentText.trim());
          }
          currentText = "";
        }
      }
      if (currentText.length > 20) {
        textParts.push(currentText.trim());
      }
      
      extractedText = textParts.join("\n").slice(0, 50000); // Limit to 50k chars
    } catch (e) {
      console.error("Error extracting text from binary:", e);
    }

    if (!extractedText || extractedText.length < 100) {
      return new Response(
        JSON.stringify({ 
          error: "Could not extract readable text from this document. Try a text file or a PDF with selectable text." 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use AI to clean up and structure the extracted text
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a document text extractor. Your job is to clean up and organize raw text extracted from a document.
            
Rules:
- Remove any garbled or nonsensical text
- Preserve the meaningful content and structure
- Keep headers, bullet points, and paragraphs organized
- Remove duplicate content
- Return ONLY the cleaned document text, no commentary
- If the text appears to be a business document, RFP, brief, or professional content, preserve all relevant business details`
          },
          {
            role: "user",
            content: `Clean up and organize this extracted document text from "${fileName}":\n\n${extractedText}`
          }
        ],
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to process document" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const cleanedText = aiResponse.choices?.[0]?.message?.content || extractedText;

    console.log(`Successfully extracted ${cleanedText.length} characters from ${fileName}`);

    return new Response(
      JSON.stringify({ text: cleanedText, fileName }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Parse document error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to parse document" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
