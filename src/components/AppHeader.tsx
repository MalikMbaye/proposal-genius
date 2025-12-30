import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { FolderOpen, LayoutDashboard, LogOut, Plus, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AppHeaderProps = {
  center?: ReactNode;
  onNewProposal?: () => void;
};

export function AppHeader({ center, onNewProposal }: AppHeaderProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleNewProposal = () => {
    if (onNewProposal) return onNewProposal();
    navigate("/generate");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="h-14 border-b border-slate-200 bg-slate-900 flex items-center px-4 gap-4 flex-shrink-0">
      <Link to="/preview" className="flex-shrink-0" aria-label="Go to dashboard">
        <Logo />
      </Link>

      <nav className="hidden md:flex items-center">
        <Button asChild variant="ghost" size="sm" className="justify-start text-slate-300 hover:text-white hover:bg-slate-800">
          <Link to="/dashboard" className="flex items-center">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
      </nav>

      <div className="flex-1 flex justify-center">{center ?? null}</div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Button variant="hero" size="sm" onClick={handleNewProposal}>
          <Plus className="mr-2 h-4 w-4" />
          New Proposal
        </Button>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-slate-300 hover:text-white hover:bg-slate-800" aria-label="Open user menu">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled className="text-muted-foreground">
                {user.email}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/preview" className="flex items-center w-full">
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
        )}
      </div>
    </header>
  );
}
