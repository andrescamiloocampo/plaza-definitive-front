"use client";

import Image from "next/image";
import React from "react";
import { RestaurantModel } from "@/app/models/RestaurantModel";
import { useRouter } from "next/navigation";
import { MapPin, Building2 } from "lucide-react";

export const RestaurantCard = (props: RestaurantModel) => {
  const router = useRouter();

  const redirect = () => {
    const query = new URLSearchParams({
      name: props.name,
      address: props.address,
    });

    router.push(`/dashboard/restaurant/${props.id}?${query.toString()}`);
  };

  return (
    <div
      onClick={redirect}
      className="group bg-white rounded-2xl shadow-md overflow-hidden w-[340px] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100"
    >
      {/* Imagen con efecto overlay */}
      <div className="relative w-full h-44 overflow-hidden">
        <Image
          src={props.urlLogo}
          alt={props.name}
          width={400}
          height={176}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
          {props.name}
        </h3>
        <p className="text-gray-600 text-sm flex items-center gap-1 mb-3">
          <MapPin className="w-4 h-4 text-gray-400" />
          {props.address}
        </p>

        <div className="flex items-center justify-between text-gray-500 text-sm border-t border-gray-100 pt-3">
          <div className="flex items-center gap-1">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{props.nit}</span>
          </div>
          <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full group-hover:bg-indigo-700 transition-colors">
            Ver menú
          </span>
        </div>
      </div>
    </div>
  );
};
