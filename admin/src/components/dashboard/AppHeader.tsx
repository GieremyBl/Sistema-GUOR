"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Calendar, ChevronDown, LogOut, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const userName = session?.user?.name || "Usuario";
  const userRole = session?.user?.rol || "cliente";
  const displayRole = userRole.charAt(0).toUpperCase() + userRole.slice(1);

  const userInitials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "CA";

  const currentYear = new Date().getFullYear();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Empty left side - you can add breadcrumbs here */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="w-4 h-4" />
            Año {currentYear}
          </Button>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  {displayRole}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500">{displayRole}</p>
                </div>
                <Avatar className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600">
                  <AvatarFallback className="bg-transparent text-white font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">
                  {session?.user?.name }
                </p>
                <p className="text-xs text-muted-foreground">
                  {session?.user?.email }
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={async () => {
                try {
                  setIsLoading(true);
                  await signOut({ 
                    callbackUrl: "/login",
                    redirect: true 
                  });
                } catch (error) {
                  console.error("Error al cerrar sesión:", error);
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{isLoading ? "Cerrando sesión..." : "Cerrar Sesión"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}