import { ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { FolderOpen, LayoutDashboard, LogOut, Plus, Settings, User, HelpCircle, BookOpen, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type AppHeaderProps = {
  center?: ReactNode;
  onNewProposal?: () => void;
};

export function AppHeader({ center, onNewProposal }: AppHeaderProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNewProposal = () => {
    if (onNewProposal) return onNewProposal();
    navigate("/generate");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/library", icon: BookOpen, label: "Library" },
    { to: "/help", icon: HelpCircle, label: "Help Center" },
  ];

  return (
    <header className="h-14 border-b border-slate-700/50 bg-gradient-to-r from-slate-900 via-slate-800/95 to-slate-900 backdrop-blur-sm flex items-center px-4 gap-4 flex-shrink-0 shadow-lg">
      <Link to="/" className="flex-shrink-0" aria-label="Go to home">
        <Logo />
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1">
        {navItems.map((item) => (
          <Button 
            key={item.to}
            asChild 
            variant="ghost" 
            size="sm" 
            className="justify-start text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <Link to={item.to} className="flex items-center">
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>

      <div className="flex-1 flex justify-center">{center ?? null}</div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Button variant="hero" size="sm" onClick={handleNewProposal} className="hidden sm:flex">
          <Plus className="mr-2 h-4 w-4" />
          New Proposal
        </Button>
        <Button variant="hero" size="icon" onClick={handleNewProposal} className="sm:hidden">
          <Plus className="h-4 w-4" />
        </Button>

        {user && (
          <>
            {/* Desktop User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-slate-300 hover:text-white hover:bg-slate-800 hidden md:flex" aria-label="Open user menu">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled className="text-muted-foreground">
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/dashboard" className="flex items-center w-full">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/proposals" className="flex items-center w-full">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Saved Proposals
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/library" className="flex items-center w-full">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Proposal Library
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/help" className="flex items-center w-full">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help Center
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/profile" className="flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-slate-300 hover:text-white hover:bg-slate-800">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-slate-900 border-slate-700">
                <div className="flex flex-col gap-1 mt-6">
                  <p className="text-sm text-muted-foreground px-3 mb-2 truncate">{user.email}</p>
                  
                  {navItems.map((item) => (
                    <Button
                      key={item.to}
                      asChild
                      variant="ghost"
                      className="justify-start text-slate-300 hover:text-white hover:bg-slate-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link to={item.to} className="flex items-center">
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.label}
                      </Link>
                    </Button>
                  ))}
                  
                  <Button
                    asChild
                    variant="ghost"
                    className="justify-start text-slate-300 hover:text-white hover:bg-slate-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link to="/proposals" className="flex items-center">
                      <FolderOpen className="mr-3 h-5 w-5" />
                      Saved Proposals
                    </Link>
                  </Button>
                  
                  <Button
                    asChild
                    variant="ghost"
                    className="justify-start text-slate-300 hover:text-white hover:bg-slate-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link to="/profile" className="flex items-center">
                      <Settings className="mr-3 h-5 w-5" />
                      Account Settings
                    </Link>
                  </Button>
                  
                  <div className="border-t border-slate-700 mt-4 pt-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-800"
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Log out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}
      </div>
    </header>
  );
}
