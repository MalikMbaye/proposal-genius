import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limit: 3 submissions per IP per hour
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_HOURS = 1;

function getClientIp(req: Request): string {
  // Check various headers for the real IP
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Take the first IP in the list (client IP)
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // Fallback - this won't be accurate but provides some protection
  return 'unknown';
}

// Input validation
function validateInput(data: unknown): { valid: true; data: { name: string; email: string; subject?: string; message: string } } | { valid: false; error: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }
  
  const { name, email, subject, message } = data as Record<string, unknown>;
  
  // Validate name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }
  if (name.length > 100) {
    return { valid: false, error: 'Name must be less than 100 characters' };
  }
  
  // Validate email
  if (typeof email !== 'string' || email.trim().length === 0) {
    return { valid: false, error: 'Email is required' };
  }
  if (email.length > 255) {
    return { valid: false, error: 'Email must be less than 255 characters' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Invalid email address' };
  }
  
  // Validate subject (optional)
  if (subject !== undefined && subject !== null) {
    if (typeof subject !== 'string') {
      return { valid: false, error: 'Invalid subject' };
    }
    if (subject.length > 200) {
      return { valid: false, error: 'Subject must be less than 200 characters' };
    }
  }
  
  // Validate message
  if (typeof message !== 'string' || message.trim().length === 0) {
    return { valid: false, error: 'Message is required' };
  }
  if (message.length > 5000) {
    return { valid: false, error: 'Message must be less than 5000 characters' };
  }
  
  return {
    valid: true,
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? (subject as string).trim() : undefined,
      message: message.trim()
    }
  };
}

async function checkRateLimit(supabase: any, ip: string): Promise<{ allowed: boolean; count: number }> {
  const windowStart = new Date();
  windowStart.setHours(windowStart.getHours() - RATE_LIMIT_WINDOW_HOURS);
  
  // Count submissions from this IP in the rate limit window
  const { count, error } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', windowStart.toISOString())
    .eq('ip_address', ip);
  
  if (error) {
    console.error('[CONTACT-FORM] Rate limit check error:', error);
    // On error, allow the request but log it
    return { allowed: true, count: 0 };
  }
  
  const currentCount = count || 0;
  return { 
    allowed: currentCount < RATE_LIMIT_MAX, 
    count: currentCount 
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(req);
    console.log(`[CONTACT-FORM] Submission attempt from IP: ${clientIp.substring(0, 10)}...`);

    // Create Supabase client with service role to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[CONTACT-FORM] Missing Supabase configuration');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check rate limit using database
    const rateLimit = await checkRateLimit(supabase, clientIp);
    if (!rateLimit.allowed) {
      console.log(`[CONTACT-FORM] Rate limit exceeded for IP: ${clientIp.substring(0, 10)}... (${rateLimit.count}/${RATE_LIMIT_MAX})`);
      return new Response(
        JSON.stringify({ error: 'Too many submissions. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const validation = validateInput(body);
    if (!validation.valid) {
      console.log(`[CONTACT-FORM] Validation failed: ${validation.error}`);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { name, email, subject, message } = validation.data;

    // Insert the contact submission with IP for rate limiting
    const { error: insertError } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email,
        subject: subject || null,
        message,
        ip_address: clientIp,
      });

    if (insertError) {
      console.error('[CONTACT-FORM] Database insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to submit message' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[CONTACT-FORM] Successfully submitted from: ${email} (${rateLimit.count + 1}/${RATE_LIMIT_MAX})`);

    return new Response(
      JSON.stringify({ success: true, message: 'Message sent successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[CONTACT-FORM] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
