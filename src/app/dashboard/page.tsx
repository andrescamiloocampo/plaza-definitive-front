"use client";

import { Pagination, RestaurantCard } from "../components/molecules";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Welcome } from "../components/organisms/Welcome/Welcome";
import { WelcomeContents as wc } from "../datasources/common/texts";
import { getPaginatedRestaurants } from "../datasources/restaurants/getRestaurants";
import { RestaurantCardSkeleton } from "../components/skeletons/RestaurantCardSkeleton";
import { RestaurantModel } from "../models/RestaurantModel";
import { useSession } from "next-auth/react";
import { OrderHistory } from "../components/organisms/OrdersHistory/OrdersHistory";

export default function HomePage() {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const [page, setPage] = useState(0);
  const size = 4;

  const { data, isLoading, error } = useQuery({
    queryKey: ["restaurants", page, token],
    queryFn: async () => await getPaginatedRestaurants(page, size, token),
    enabled: !!token,
  });

  return (
    <div className="py-16 md:py-20">
      <Welcome title={wc.title} description={wc.description} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            xl:grid-cols-4
            gap-8
            place-items-center
          "
        >          
          {isLoading && (
            <>
              <RestaurantCardSkeleton />
              <RestaurantCardSkeleton />
              <RestaurantCardSkeleton />
              <RestaurantCardSkeleton />
            </>
          )}

          {error && (
            <div className="col-span-full text-center py-8 text-red-500">
              Error al cargar restaurantes
            </div>
          )}

          {data &&
            data.map((rest: RestaurantModel) => (
              <RestaurantCard key={rest.id} {...rest} />
            ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Pagination
            page={page}
            hasNext={!!data && data.length === size}
            onPrev={() => setPage((prev) => Math.max(prev - 1, 0))}
            onNext={() => setPage((prev) => prev + 1)}
          />
        </div>

        <div className="mt-16">
          <OrderHistory />
        </div>
      </div>
    </div>
  );
}
