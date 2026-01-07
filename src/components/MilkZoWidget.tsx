import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Generate a unique session ID for analytics tracking
function generateSessionId(): string {
  return `mz_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export function MilkZoWidget() {
  const { user, session } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
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

      // Add assistant response
      setMessages([...newMessages, { role: "assistant", content: data.response }]);
      
    } catch (err) {
      console.error("MilkZo error:", err);
      setError("Connection hiccup. Give it another shot!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110",
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

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-[400px] animate-in slide-in-from-bottom-4 fade-in duration-300">
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
                  <div
                    key={index}
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
    </>
  );
}
