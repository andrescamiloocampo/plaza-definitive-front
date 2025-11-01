"use client";

import { ReactElement } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";
import { LogOut, User, Store, Menu } from "lucide-react";

export const Header = (): ReactElement => {
  const router = useRouter();
  const { user } = useUser();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/auth/login");
  };

  const goHome = () => router.push("/dashboard");

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md backdrop-blur-md border-b border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between w-full px-4 sm:px-6 md:px-10 py-3 md:py-4">
        <div
          onClick={goHome}
          className="flex items-center gap-2 md:gap-3 cursor-pointer group"
        >
          <div className="bg-white/20 p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-inner group-hover:bg-white/30 transition-colors">
            <Store className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base md:text-lg font-bold text-white leading-tight">
              Super Plaza!
            </h1>
            <p className="text-xs text-white/80">Es hora de comer</p>
          </div>
          <h1 className="text-base font-bold text-white sm:hidden">
            Super Plaza!
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <div className="hidden md:flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2 hover:bg-white/20 transition-all">
            <User className="w-5 h-5 text-white/80" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">{user?.sub}</span>
              <span className="text-xs text-white/80">
                {user?.roles?.[0]?.toLowerCase()}
              </span>
            </div>
          </div>

          <div className="flex md:hidden items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
            <User className="w-4 h-4 text-white/80" />
            <span className="text-sm font-semibold text-white">{user?.sub}</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 md:p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};