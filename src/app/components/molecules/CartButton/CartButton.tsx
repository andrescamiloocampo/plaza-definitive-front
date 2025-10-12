"use client";

import React, { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useOrderStore } from "@/app/store/OrderStore";
import { CartButtonModel } from "./CartButton.model";

export const CartButton = ({
  className = "",
}: CartButtonModel): ReactElement => {
  const router = useRouter();
  const { getTotalItems } = useOrderStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;

  const goToCart = () => {
    router.push("/dashboard/cart");
  };

  return (
    <button
      onClick={goToCart}
      className={`relative bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center ${className}`}
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      <span>Tus ordenes ({totalItems})</span>
      {mounted && totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
          {totalItems}
        </span>
      )}
    </button>
  );
};
