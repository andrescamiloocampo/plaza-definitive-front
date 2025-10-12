"use client";

import { ReactElement } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/app/models/JwtPayload";
import { LogOut, User, Store } from "lucide-react";

export const Header = (): ReactElement => {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken;
  let user: JwtPayload | null = null;

  if (token) {
    try {
      user = jwtDecode<JwtPayload>(token);
    } catch (e) {
      console.error("Error decoding token", e);
    }
  }

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/login");
  };

  const goHome = () => {
    router.push("/dashboard");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md backdrop-blur-md border-b border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between w-full px-10 py-4">
        {/* Logo + nombre */}
        <div
          onClick={goHome}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="bg-white/20 p-2 rounded-xl shadow-inner group-hover:bg-white/30 transition-colors">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">
              Super Plaza!
            </h1>
            <p className="text-xs text-white/80">Es hora de comer 🍕</p>
          </div>
        </div>

        {/* Info usuario */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2 hover:bg-white/20 transition-all">
            <User className="w-5 h-5 text-white/80" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">
                {user?.sub}
              </span>
              <span className="text-xs text-white/80">
                {user?.roles?.[0]?.toLowerCase()}
              </span>
            </div>
            <span className="ml-3 bg-white text-purple-600 text-xs font-semibold px-3 py-1 rounded-full capitalize">
              {user?.roles?.[0]?.toLowerCase()}
            </span>
          </div>

          {/* Botón logout */}
          <button
            onClick={handleLogout}
            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
