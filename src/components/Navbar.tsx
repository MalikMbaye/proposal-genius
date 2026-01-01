import * as React from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User, Settings, FolderOpen, LayoutDashboard, Users, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ForwardRef wrapper for Link to fix ref warning with DropdownMenuItem asChild
const MenuLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ children, ...props }, ref) => (
  <Link ref={ref} {...props}>
    {children}
  </Link>
));

export function Navbar() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <Logo variant="light" />
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#founder" className="text-sm text-slate-300 hover:text-white transition-colors">
            About
          </a>
          <a href="#solution" className="text-sm text-slate-300 hover:text-white transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-slate-300 hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#pricing" className="text-sm text-slate-300 hover:text-white transition-colors">
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/generate">+ New Proposal</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled className="text-muted-foreground">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <MenuLink to="/dashboard" className="flex items-center w-full">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </MenuLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <MenuLink to="/leads" className="flex items-center w-full">
                      <Users className="mr-2 h-4 w-4" />
                      Leads
                    </MenuLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <MenuLink to="/call-script" className="flex items-center w-full">
                      <Phone className="mr-2 h-4 w-4" />
                      Call Script
                    </MenuLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <MenuLink to="/proposals" className="flex items-center w-full">
                      <FolderOpen className="mr-2 h-4 w-4" />
                      Saved Proposals
                    </MenuLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <MenuLink to="/profile" className="flex items-center w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Account Settings
                    </MenuLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" asChild className="rounded-full text-slate-300 hover:text-white hover:bg-slate-800">
                <Link to="/auth">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="sm" variant="hero" asChild>
                <Link to="/generate">+ New Proposal</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
