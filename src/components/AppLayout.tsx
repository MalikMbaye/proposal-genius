import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { ProposalSelector } from "@/components/ProposalSelector";
import { useProposalStore } from "@/lib/proposalStore";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  FileText,
  Presentation,
  FileCheck,
  Mail,
  Receipt,
  Send,
  Check,
  Plus,
  Library,
  User,
  Users,
  Phone,
  MessageSquare,
  Home,
  DownloadCloud,
  Pencil,
  Menu,
  Loader2,
} from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  onNewProposal?: () => void;
}

const pitchKitTabs = [
  { id: "proposal", label: "Proposal", icon: FileText, path: "/dashboard", tab: "proposal" },
  { id: "deck", label: "Slide Deck", icon: Presentation, path: "/dashboard", tab: "deck" },
  { id: "contract", label: "Contract", icon: FileCheck, path: "/dashboard", tab: "contract" },
  { id: "contractEmail", label: "Contract Email", icon: Send, path: "/dashboard", tab: "contractEmail" },
  { id: "invoiceDescription", label: "Invoice", icon: Receipt, path: "/dashboard", tab: "invoiceDescription" },
  { id: "proposalEmail", label: "Proposal Email", icon: Mail, path: "/dashboard", tab: "proposalEmail" },
];

const leadsTabs = [
  { id: "leads", label: "All Leads", icon: Users, path: "/leads" },
  { id: "dm-conversations", label: "DM Conversations", icon: MessageSquare, path: "/dm-conversations" },
  { id: "call-scripts", label: "Call Scripts", icon: Phone, path: "/call-script" },
];

export function AppLayout({ children, onNewProposal }: AppLayoutProps) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { deliverables, deckData } = useProposalStore();
  const hasProposal = !!deliverables?.proposal;
  
  const handleNewProposal = () => {
    onNewProposal?.();
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {/* Getting Started */}
        <Link
          to="/dashboard"
          onClick={onNavigate}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            isActiveRoute('/dashboard') || isActiveRoute('/preview')
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-slate-400 hover:text-slate-100 hover:bg-slate-700"
          }`}
        >
          <Home className="h-4 w-4" />
          <span className="flex-1 text-left">Dashboard</span>
        </Link>
        
        {/* Edit Project Brief */}
        {hasProposal && (
          <Link
            to="/generate"
            onClick={onNavigate}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-400/50 hover:bg-amber-500/10"
          >
            <Pencil className="h-4 w-4" />
            <span className="flex-1 text-left">Edit Project Brief</span>
          </Link>
        )}
        
        {/* Your Pitch Kit Section */}
        <div className="mt-4 mb-2">
          <div className="border-t border-slate-700 mx-1" />
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mt-3 mb-2">
            Your Pitch Kit
          </p>
        </div>
        
        {pitchKitTabs.map((tab) => {
          const Icon = tab.icon;
          let hasTabContent = false;
          if (tab.id === 'deck') {
            hasTabContent = deckData?.status === 'completed';
          } else if (tab.id === 'proposal') {
            hasTabContent = !!deliverables?.proposal;
          } else {
            hasTabContent = (deliverables?.[tab.id as keyof typeof deliverables] || '').length > 0;
          }
          
          return (
            <Link
              key={tab.id}
              to={`${tab.path}?tab=${tab.tab}`}
              onClick={onNavigate}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-slate-400 hover:text-slate-100 hover:bg-slate-700"
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1 text-left">{tab.label}</span>
              {!hasTabContent && (
                <span className="text-xs opacity-60">•</span>
              )}
              {hasTabContent && tab.id !== 'proposal' && (
                <Check className="h-3 w-3 opacity-60" />
              )}
            </Link>
          );
        })}
        
        {/* Leads Section */}
        <div className="mt-4 mb-2">
          <div className="border-t border-slate-700 mx-1" />
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mt-3 mb-2">
            Leads
          </p>
        </div>
        
        {leadsTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = isActiveRoute(tab.path);
          
          return (
            <Link
              key={tab.id}
              to={tab.path}
              onClick={onNavigate}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1 text-left">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Proposal Library - Separated at bottom */}
      <div className="px-3 pb-2 border-t border-slate-700 pt-3">
        <Link
          to="/library"
          onClick={onNavigate}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            isActiveRoute('/library')
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-emerald-400 hover:text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 hover:bg-emerald-500/10"
          }`}
        >
          <Library className="h-4 w-4" />
          <span className="flex-1 text-left">Proposal Library</span>
          {!isActiveRoute('/library') && (
            <span className="text-[10px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded">PRO</span>
          )}
        </Link>
      </div>

      {/* Sidebar Actions */}
      <div className="p-4 border-t border-slate-700 space-y-2">
        <div className="border-t border-slate-700 pt-3 mt-2 space-y-1">
          <Button onClick={() => { handleNewProposal(); onNavigate?.(); }} variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700">
            <Plus className="mr-2 h-4 w-4" />
            Generate New
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700">
            <Link to="/profile" onClick={onNavigate}>
              <User className="mr-2 h-4 w-4" />
              Account Settings
            </Link>
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="h-screen bg-slate-800 flex flex-col overflow-hidden">
      {/* Mobile Header with Hamburger */}
      {isMobile ? (
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 bg-slate-800 border-slate-700">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-slate-700">
                  <span className="text-lg font-semibold text-white">Menu</span>
                </div>
                <SidebarContent onNavigate={() => setMobileMenuOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex-1 flex justify-center">
            <ProposalSelector />
          </div>
          
          <Button
            onClick={handleNewProposal}
            variant="ghost"
            size="icon"
            className="text-slate-300 hover:text-white"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <AppHeader center={<ProposalSelector />} onNewProposal={handleNewProposal} />
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="w-64 border-r border-slate-700 bg-slate-800 flex flex-col flex-shrink-0 overflow-hidden">
            <SidebarContent />
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-700">
          {children}
        </main>
      </div>
    </div>
  );
}
