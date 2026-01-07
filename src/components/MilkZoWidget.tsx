import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { MessageCircle, X, Send, Loader2, Sparkles, Calendar, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  action?: "book_call" | "feedback";
}

// Generate a unique session ID for analytics tracking
function generateSessionId(): string {
  return `mz_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

// Check if a tour tooltip is currently showing
function useTourActive() {
  const [tourActive, setTourActive] = useState(false);
  
  useEffect(() => {
    const checkTour = () => {
      const tourElement = document.querySelector('[class*="z-[60]"], [class*="z-[61]"]');
      setTourActive(!!tourElement);
    };
    
    checkTour();
    const observer = new MutationObserver(checkTour);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  
  return tourActive;
}

export function MilkZoWidget() {
  const { user, session } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCalendly, setShowCalendly] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tourActive = useTourActive();
  
  // Generate a session ID that persists for this browser session
  const sessionId = useMemo(() => {
    const stored = sessionStorage.getItem("milkzo_session_id");
    if (stored) return stored;
    const newId = generateSessionId();
    sessionStorage.setItem("milkzo_session_id", newId);
    return newId;
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Add welcome message when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: user 
            ? `Welcome back! 😎 I'm MilkZo, your personal evil genius assistant. What can I help you dominate today?`
            : `Hey there! 😎 I'm MilkZo - the evil genius behind PitchGenius. What brings you to my lair today?`
        }
      ]);
    }
  }, [isOpen, messages.length, user]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);
    
    // Add user message immediately
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      // Add auth token if logged in
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/milkzo-chat`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            message: userMessage,
            conversationHistory: messages,
            sessionId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError(data.error || "Too many messages! Slow down a bit.");
        } else {
          setError(data.error || "Something went wrong. Try again?");
        }
        return;
      }

      // Check if response suggests booking a call
      const responseText = data.response.toLowerCase();
      const shouldShowBooking = 
        responseText.includes("book a call") ||
        responseText.includes("schedule a call") ||
        responseText.includes("hop on a call") ||
        responseText.includes("jump on a call") ||
        responseText.includes("would it make sense");
      
      // Add assistant response with potential action
      setMessages([...newMessages, { 
        role: "assistant", 
        content: data.response,
        action: shouldShowBooking ? "book_call" : undefined
      }]);
      
    } catch (err) {
      console.error("MilkZo error:", err);
      setError("Connection hiccup. Give it another shot!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookCall = () => {
    setShowCalendly(true);
  };

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) return;
    
    // Send feedback as a message to MilkZo
    const feedbackMessage = `[FEEDBACK] ${feedbackText}`;
    setInput(feedbackMessage);
    setFeedbackText("");
    setFeedbackSubmitted(true);
    setShowFeedback(false);
    
    // Auto-send the feedback
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button - hidden when tour is active */}
      {!tourActive && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "fixed bottom-6 right-6 z-40 flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110",
            "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500",
            "h-14 w-14 md:h-16 md:w-16",
            isOpen && "rotate-90"
          )}
          aria-label={isOpen ? "Close chat" : "Open MilkZo chat"}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <div className="relative">
              <MessageCircle className="h-6 w-6 md:h-7 md:w-7 text-white" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-200 animate-pulse" />
            </div>
          )}
        </button>
      )}

      {/* Chat Window - hidden when tour is active */}
      {isOpen && !tourActive && (
        <div className="fixed bottom-24 right-4 md:right-6 z-40 w-[calc(100vw-2rem)] max-w-[400px] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[500px] max-h-[70vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-4 flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-xl">🧠</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 rounded-full border-2 border-orange-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-sm">MilkZo</h3>
                <p className="text-white/80 text-xs">Your Evil Genius Assistant</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className="space-y-2">
                    <div
                      className={cn(
                        "flex",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                          message.role === "user"
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-br-md"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-md"
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                    
                    {/* Book Call Button after relevant messages */}
                    {message.action === "book_call" && (
                      <div className="flex justify-start pl-2">
                        <Button
                          onClick={handleBookCall}
                          size="sm"
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full gap-2 text-xs"
                        >
                          <Calendar className="h-3.5 w-3.5" />
                          Book a Call
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Error Message */}
            {error && (
              <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-100 dark:border-red-800">
                <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 flex gap-2">
              <button
                onClick={handleBookCall}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
              >
                <Calendar className="h-3.5 w-3.5" />
                Book a Call
              </button>
              <button
                onClick={() => setShowFeedback(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Feedback
              </button>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-600 rounded-full px-4 text-sm"
                  disabled={isLoading}
                  maxLength={2000}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 h-10 w-10 flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-2">
                {user ? "Pro features unlocked ✨" : "Sign in for full access"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Calendly Modal */}
      <Dialog open={showCalendly} onOpenChange={setShowCalendly}>
        <DialogContent className="max-w-2xl h-[80vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-500" />
              Book Your Strategy Call
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 p-4">
            {/* Calendly Embed - Replace URL with your actual Calendly link */}
            <iframe
              src="https://calendly.com/pitchgenius/strategy-call"
              className="w-full h-full rounded-lg border-0"
              title="Book a call"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Submit Feedback
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Got ideas, bugs, or love to share? MilkZo's listening. 🧠
            </p>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full min-h-[120px] p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={1000}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowFeedback(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitFeedback}
                disabled={!feedbackText.trim()}
                className="bg-gradient-to-r from-blue-500 to-blue-600"
              >
                Send Feedback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
