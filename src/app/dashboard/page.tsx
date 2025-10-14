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
    <div className="py-20">
      <Welcome title={wc.title} description={wc.description} />
      <div className="px-4 md:px-12 lg:px-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-1 gap-y-8 min-w-0 justify-center items-center">
        {isLoading && (
          <>
            <RestaurantCardSkeleton />
            <RestaurantCardSkeleton />
            <RestaurantCardSkeleton />
            <RestaurantCardSkeleton />
          </>
        )}
        {error && (
          <div className="col-span-4 text-center py-8 text-red-500">
            Error al cargar restaurantes
          </div>
        )}
        {data &&
          data.map((rest: RestaurantModel) => (
            <RestaurantCard key={rest.id} {...rest} />
          ))}
      </div>
      <Pagination
        page={page}
        hasNext={!!data && data.length === size}
        onPrev={() => setPage((prev) => Math.max(prev - 1, 0))}
        onNext={() => setPage((prev) => prev + 1)}
      />

      <OrderHistory/>
    </div>
  );
}